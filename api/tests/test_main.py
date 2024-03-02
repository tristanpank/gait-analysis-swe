from fastapi.testclient import TestClient
from app.main import app
import os
from unittest.mock import patch


static_dir = "/static"

client = TestClient(app)

def mock_upload_file_to_cloud_storage(file_path, destination_path):
    # Mock upload logic, simply pass for the test
    pass

def mock_firestore_client():
    # Mock firestore client methods used in your endpoint
    pass

def test_hello_world():
  response = client.get("/")
  assert response.status_code == 200
  assert response.json() == {"message": "Hello World"}

@patch('app.main.upload_file_to_cloud_storage', side_effect=mock_upload_file_to_cloud_storage)
@patch('app.main.firestore.Client', side_effect=mock_firestore_client)
def test_detect_pose(upload_mock, firestore_mock):
  # Error if no video passed
  res = client.post("/pose/")
  assert res.status_code == 422

  testing_video = "running-front-test.mp4"
  temp_videos_dir = "temp_videos"
  os.makedirs(temp_videos_dir, exist_ok=True)
  test_video_file = open(f"static/{testing_video}", "rb")

  res = client.post("/pose/", files={"video_file": (testing_video, test_video_file, "video/mp4")}, data={"uid": "test", "view": "front"})
  
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
  