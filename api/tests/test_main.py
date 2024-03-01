from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_hello_world():
  response = client.get("/")
  assert response.status_code == 200
  assert response.json() == {"message": "Hello World"}

def test_detect_pose():
  # Error if no video passed
  res = client.post("/pose/")
  assert res.status_code == 422
