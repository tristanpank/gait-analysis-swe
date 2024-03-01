import os
from fastapi import FastAPI, UploadFile, File
from .gait_analysis import GaitAnalysis
from moviepy.editor import VideoFileClip
from fastapi.responses import JSONResponse

app = FastAPI()

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

@app.post("/pose/")
async def detect_pose(video_file: UploadFile = File(...)):
  # Save the video file to a file in the temp_videos directory
  file_path = os.path.join("temp_videos", video_file.filename)
  with open(file_path, "wb") as f:
    f.write(video_file.file.read())

  pose_path = add_filename_extension(file_path, "-pose.mp4")
  compressed_path = add_filename_extension(pose_path, "-compressed.mp4")
    
  gait_analysis = GaitAnalysis(input_path=file_path, output_path=pose_path, landmarker_path="./landmarkers/pose_landmarker.task")
  
  clip = VideoFileClip(pose_path)
  clip.write_videofile(compressed_path)
  clip.close()

  pose_data = gait_analysis.export_frames_json()

  return JSONResponse(content=pose_data, media_type="application/json")