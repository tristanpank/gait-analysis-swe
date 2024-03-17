from fastapi.testclient import TestClient
from unittest.mock import patch
from app.main import app
import os
import matplotlib
import os
os.environ["TESTING"] = True


client = TestClient(app)

@patch('app.main.create_video_doc')
@patch('app.main.update_doc')
@patch('app.main.add_video_to_user')
@patch('app.main.get_doc')
@patch('app.main.make_injury_collection')
@patch('app.main.add_doc')
@patch('app.main.upload_file_to_cloud_storage')
# @patch('app.main.compress_video')
def test_detect_pose_valid_request(upload_file_mock, add_doc_mock, make_injury_collection_mock, get_doc_mock, add_video_to_user_mock, update_doc_mock, create_video_doc_mock):
    # Set up the mocks
    get_doc_mock.return_value = True  # Simulate user exists
    class MockFirestoreDocumentRef:
      def __init__(self, id):
          self.id = id

    # In your test setup:
    create_video_doc_mock.return_value = MockFirestoreDocumentRef("test_video_id")

    # Path to the test video in the static folder
    test_video_path = os.path.join("static", "running-front-test.mp4")

    # Make the API request using the test video
    with open(test_video_path, "rb") as video_file:
        response = client.post("/pose/", files={"video_file": ("test_video.mp4", video_file, "video/mp4")}, data={"uid": "test_uid", "view": "front"})

    # Check the response
    assert response.status_code == 200
    assert "x" in response.json()

    # Check that the mocks were called as expected
    get_doc_mock.assert_called_once_with("users", "test_uid")
    create_video_doc_mock.assert_called()
    add_video_to_user_mock.assert_called()
    upload_file_mock.assert_called()
    # compress_video_mock.assert_called()
    # Add more checks for other mocks


# Add more test cases for different scenarios (invalid view, missing user ID, non-existent user, etc.)
