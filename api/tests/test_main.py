from fastapi.testclient import TestClient
from app.main import app
import os

static_dir = "/static"

client = TestClient(app)

def test_hello_world():
  response = client.get("/")
  assert response.status_code == 200
  assert response.json() == {"message": "Hello World"}

def test_detect_pose():
  # Error if no video passed
  res = client.post("/pose/")
  assert res.status_code == 422

  testing_video = "running-front-test.mp4"
  temp_videos_dir = "temp_videos"
  os.makedirs(temp_videos_dir, exist_ok=True)

  res = client.post("/pose/", files={"video_file": (testing_video, open(f"static/{testing_video}", "rb"))})
  
  assert res.status_code == 200
  res_json = res.json()
  for key in ["x", "y", "z", "presence", "visibility"]:
    assert key in res_json
    assert len(res_json[key]) > 0

  # Delete every file in temp_videos_dir
  for file_name in os.listdir(temp_videos_dir):
    file_path = os.path.join(temp_videos_dir, file_name)
    if os.path.isfile(file_path):
      os.remove(file_path)
  