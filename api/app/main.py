import os
from fastapi import FastAPI, UploadFile, File
from gait_analysis import GaitAnalysis
from graphs import get_all_graphs, get_crossover_graph
from moviepy.editor import VideoFileClip
from fastapi.responses import JSONResponse
import firebase_admin
from firebase_admin import credentials, storage, firestore
from google.cloud import firestore
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Form

def initialize_firebase():
  load_dotenv()
  BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
  service_account_path = os.path.join(BASE_DIR, "firebase_admin/serviceAccountKey.json")
  os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = service_account_path
  cred = credentials.Certificate(service_account_path)
  firebase_admin.initialize_app(cred, {
    "storageBucket": "gait-analysis-swe.appspot.com"
  })
  db = firestore.Client()
  return db

if os.environ.get("TESTING") != "True":
  db = initialize_firebase()


app = FastAPI()

origins = ['*']

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
) 

@app.get("/")
async def hello_world():
  return {"message": "Hello World"}

def add_filename_extension(filename: str, extension: str):
  """
  Adds the given extension to the filename.

  Args:
    filename (str): The original filename.
    extension (str): The extension to be added.

  Returns:
    str: The filename with the added extension.
  """
  dot_idx = (filename[::-1].find(".") * -1) - 1
  return filename[:dot_idx] + extension

def upload_file_to_cloud_storage(file_path, destination_path):
  bucket = storage.bucket()
  blob = bucket.blob(destination_path)
  blob.upload_from_filename(file_path)

def create_video_doc(data):
  data["timestamp"] = firestore.SERVER_TIMESTAMP
  video_ref = db.collection("videos").add(data)
  return video_ref[1]

def update_doc(curr_doc, data):
  curr_doc.update(data)
  return curr_doc

def add_video_to_user(user_ref, video_id):
  user_ref.update({
    "videos": firestore.ArrayUnion([video_id])
  })

def get_doc(collection, doc_id):
  ref = db.collection(collection).document(doc_id)
  if ref.get().exists:
    return ref
  else:
    return None

def make_injury_collection(video_ref):
  return db.collection("videos").document(video_ref.id).collection("injury_data")

def add_doc(collection, data):
  ref = collection.add(data)
  return ref[1]

def compress_video(input_path, output_path):
  clip = VideoFileClip(input_path)
  clip.write_videofile(output_path)
  clip.close()

@app.post("/pose/")
async def detect_pose(video_file: UploadFile = File(...), uid: str = Form(""), view: str = Form("")):
  """
  Detects the pose in a video file and saves the pose data.

  Args:
    video_file (UploadFile): The video file to analyze.
    uid (str): The user ID.
    view (str): The view of the video ('front' or 'side').

  Returns:
    JSONResponse: The pose data in JSON format.

  Raises:
    JSONResponse: If the view is invalid or the user is not found.
  """
  # Check if the view is valid
  if view not in ['front', 'side']:
    return JSONResponse(content={"error": "Invalid view"}, media_type="application/json", status_code=400)
  
  # Check if the user ID is provided
  if uid == "":
    return JSONResponse(content={"error": "User not passed in"}, media_type="application/json", status_code=404)
  
  user_ref = get_doc("users", uid)
  if not user_ref:
    return JSONResponse(content={"error": "User not found"}, media_type="application/json", status_code=404)
  
  temp_videos_dir = "temp_videos"
  os.makedirs(temp_videos_dir, exist_ok=True)
  temp_graphs_dir = "temp_graphs"
  os.makedirs(temp_graphs_dir, exist_ok=True)
  # Save the video file to a file in the temp_videos directory
  file_path = os.path.join("temp_videos", video_file.filename)
  with open(file_path, "wb") as f:
    f.write(video_file.file.read())

  # Generate file paths for pose and compressed videos
  pose_path = add_filename_extension(file_path, "-pose.mp4")
  compressed_path = add_filename_extension(pose_path, "-compressed.mp4")
    
  # Perform gait analysis on the video
  gait_analysis = GaitAnalysis(input_path=file_path, output_path=pose_path, landmarker_path="./landmarkers/pose_landmarker.task")
  
  # Compress the pose video
  compress_video(pose_path, compressed_path)

  # Export pose data as JSON
  pose_data = gait_analysis.export_frames_json()

  # Overwrite view with calculated view"
  view = gait_analysis.calculate_direction()

  video_ref = create_video_doc({
    "pose_data": pose_data,
    "uid": uid,
    "view": view,
  })


  # Update user document with video id
  add_video_to_user(user_ref, video_ref.id)

  # Upload the compressed video to cloud storage
  upload_file_to_cloud_storage(compressed_path, f"users/{uid}/videos/{video_ref.id}/pose.mp4")

  # Calculate all graphs
  graph_paths = get_all_graphs(gait_analysis)

  # Upload graphs to cloud storage
  graph_names = []
  for path in graph_paths:
    graph_file = '/'.join(path.split('/')[2:])
    upload_file_to_cloud_storage(path, f"users/{uid}/videos/{video_ref.id}/graphs/{graph_file}")
    os.remove(path)
    graph_names.append(graph_file)
  print(graph_names)

  # injury_data = db.collection("videos").document(video_ref[1].id).collection("injury_data")

  injury_data = make_injury_collection(video_ref)

  # If the view is "front", calculate and upload the crossover graph
  if view == "Front" or view == "Back":
    crossover_path = get_crossover_graph(gait_analysis)
    upload_file_to_cloud_storage(crossover_path, f"users/{uid}/videos/{video_ref.id}/graphs/crossover.png")
    os.remove(crossover_path)
    add_doc(injury_data, {
      "name": "crossover",
      "graph": "crossover.png",
    
    })

  # Calculates and adds cadence if video is side view
  if view == "Right" or view == "Left":
    gait_analysis.calculate_cadence()
    update_doc(video_ref, {
      "cadence": gait_analysis.avg_cadence
    })


  # Update video document with graph names
  update_doc(video_ref, {
    "graphs": graph_names
  })

  # Update user document with pose data and upload status
  # if uid != "test":
  #   user_ref.update({
  #     f'pose_data_{view}': pose_data,
  #     f'{view}_uploaded': True,
  #   })
  

  os.remove(file_path)
  os.remove(pose_path)
  os.remove(compressed_path)

  # Return the pose data as JSON response
  return JSONResponse(content=pose_data, media_type="application/json")