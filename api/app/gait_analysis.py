import mediapipe as mp
import cv2
import numpy as np
import matplotlib.pyplot as plt
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
from mediapipe import solutions
from mediapipe.framework.formats import landmark_pb2
from scipy.signal import find_peaks, savgol_filter

class GaitAnalysis:
  frames = np.array([])
  time_between_frames = 0
  avg_cadence = 0

  def __init__(self, input_path="", output_path="", landmarker_path="./landmarkers/pose_landmarker.task", data=None):
    if data:
      self.frames = self.convert_str_to_numpy_with_python(data)
    else:
      landmark_frames = self.get_pose_array(input_path, output_path, landmarker_path)
      self.frames = self.convert_landmark_frames_to_numpy(landmark_frames)

  @staticmethod
  def convert_landmark_frames_to_numpy(frames):
    new_frames = []
    for frame in frames:
      temp_frame = []
      for landmark in frame:
        temp_landmark = [landmark.x, landmark.y, landmark.z, landmark.presence, landmark.visibility]
        temp_frame.append(temp_landmark)
      new_frames.append(temp_frame)
    return np.array(new_frames)

  @staticmethod
  def convert_str_to_numpy_with_python(data: str):
    frames = data.split(";")
    pose_array = []
    for i in range(len(frames) - 1):
      frame = [float(num) for num in frames[i].split(',')]
      pose_array.append(frame)
    return np.array(pose_array)
  
  def export_frames_json(self):
    data = {"x": "", "y": "", "z": "", "presence": "", "visibility": ""}
    vectorizers = [
      np.vectorize(lambda landmark: landmark.x),
      np.vectorize(lambda landmark: landmark.y),
      np.vectorize(lambda landmark: landmark.z),
      np.vectorize(lambda landmark: landmark.presence),
      np.vectorize(lambda landmark: landmark.visibility)
    ]
    for i, key in enumerate(data.keys()):
      key_frames = self.frames[:, :, i]
      temp = []
      for frame in key_frames:
        temp.append(",".join([str(num) for num in frame]))
      data[key] = ";".join(temp)
    return data



  @staticmethod
  def draw_landmarks_on_image(rgb_image, detection_result):
    pose_landmarks_list = detection_result.pose_landmarks
    annotated_image = np.copy(rgb_image)

    # Loop through the detected poses to visualize.
    for idx in range(len(pose_landmarks_list)):
      pose_landmarks = pose_landmarks_list[idx]

      # Draw the pose landmarks.
      pose_landmarks_proto = landmark_pb2.NormalizedLandmarkList()
      pose_landmarks_proto.landmark.extend([
        landmark_pb2.NormalizedLandmark(x=landmark.x, y=landmark.y, z=landmark.z) for landmark in pose_landmarks
      ])
      solutions.drawing_utils.draw_landmarks(
        annotated_image,
        pose_landmarks_proto,
        solutions.pose.POSE_CONNECTIONS,
        solutions.drawing_styles.get_default_pose_landmarks_style())
    return annotated_image

  # Method for calculating the overall pose array for all frames
  def get_pose_array(self, input_path, output_path, model_asset_path):
    # Configure Mediapipe settings and initialize detector
    VisionRunningMode = mp.tasks.vision.RunningMode
    base_options = python.BaseOptions(model_asset_path=model_asset_path)
    options = vision.PoseLandmarkerOptions(
        base_options=base_options,
        output_segmentation_masks=True,
        running_mode=VisionRunningMode.VIDEO
    )
    detector = vision.PoseLandmarker.create_from_options(options)

    # Setup cv2 video capture input and output settings
    video = cv2.VideoCapture(input_path)
    fourcc = cv2.VideoWriter_fourcc(*'XVID')
    out = cv2.VideoWriter(output_path, fourcc, video.get(cv2.CAP_PROP_FPS), (int(video.get(3)), int(video.get(4))))
    frame_positions = []
    frame_times = []
    # Iterates over every frame in input video
    while video.isOpened():
      success, frame = video.read()
      if not success:
        break
      frame_timestamp = int(video.get(cv2.CAP_PROP_POS_MSEC))
      frame_times.append(frame_timestamp)
      # Calculates pose detection for that frame
      image = mp.Image(image_format=mp.ImageFormat.SRGB, data=frame)
      detection_result = detector.detect_for_video(image, frame_timestamp)
      # Annotates results on video and writes to output
      annotated_frame = GaitAnalysis.draw_landmarks_on_image(frame, detection_result)
      out.write(annotated_frame)
      frame_positions.append(detection_result.pose_landmarks[0])
    video.release()
    out.release()
    cv2.destroyAllWindows()
    self.time_between_frames = np.mean(np.diff(frame_times))

    return np.array(frame_positions)