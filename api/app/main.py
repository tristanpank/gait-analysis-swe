import os
from fastapi import FastAPI, UploadFile, File
from .gait_analysis import GaitAnalysis
from moviepy.editor import VideoFileClip
from fastapi.responses import JSONResponse
import firebase_admin
from firebase_admin import credentials, storage
from google.cloud import firestore
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Form

load_dotenv()
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
service_account_path = os.path.join(BASE_DIR, "firebase_admin/serviceAccountKey.json")
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = service_account_path
if os.environ.get("TESTING") != "True":
  cred = credentials.Certificate(service_account_path)
  firebase_admin.initialize_app(cred, {
    "storageBucket": "gait-analysis-swe.appspot.com"
  })
  db = firestore.Client()

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

  # Check if the user exists in the database
  if os.environ.get("TESTING") != "True":
    user_ref = db.collection("users").document(uid)
    if not user_ref.get().exists:
      return JSONResponse(content={"error": "User not found"}, media_type="application/json", status_code=404)
  
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
  clip = VideoFileClip(pose_path)
  clip.write_videofile(compressed_path)
  clip.close()

  # Export pose data as JSON
  pose_data = gait_analysis.export_frames_json()

  video_ref = db.collection("videos").add({
    "pose_data": pose_data,
    "uid": uid,
    "view": view,
  })
  print(video_ref[1].id)

  # Upload the compressed video to cloud storage
  upload_file_to_cloud_storage(compressed_path, f"users/{uid}/videos/{video_ref[1].id}/pose.mp4")

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