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
  
  # Functions for converting mediapipe landmark data into frame by frame xy points
  @staticmethod
  def convert_to_points(frames):
    x_vectorize = np.vectorize(lambda landmark: landmark.x)
    y_vectorize = np.vectorize(lambda landmark: landmark.y)
    return np.vstack((x_vectorize(frames), y_vectorize(frames))).T

  def get_landmark_frames(self, point):
    # return self.convert_to_points(self.frames[:, point])
    return self.frames[:, point, :2]

  # Uses the dot product to calculate the angle between 2 vectors
  @staticmethod
  def angle(u, v):
    cos = np.sum(u*v, axis=1) / (np.linalg.norm(u, axis=1) * np.linalg.norm(v, axis=1))
    return np.arccos(cos) * (180/np.pi)

  # Gets angle between start-mid and mid-end vectors over all frames
  def get_angle(self, start, mid, end):
    start_frames = self.get_landmark_frames(start)
    mid_frames = self.get_landmark_frames(mid)
    end_frames = self.get_landmark_frames(end)

    start_mid = mid_frames - start_frames
    mid_end = end_frames - mid_frames
    return self.angle(start_mid, mid_end)

  def smooth_data(self, data, window_length=15, polyorder=3):
    return savgol_filter(data, window_length=window_length, polyorder=polyorder)

  def calculate_cadence(self, left=True):
    if left:
      heel = self.get_landmark_frames(29)
    else:
      heel = self.get_landmark_frames(30)
    smooth_heel = self.smooth_data(heel[:, 1])

    # Uses sklearn to find peaks
    # Calculates periods as diff between minimum
    valleys, _ = find_peaks(-smooth_heel)
    periods = np.diff(valleys)

    # Converts periods from frames to seconds
    step_time = periods * (self.time_between_frames / 1000.)
    # Calculates steps per min
    # Filters spm > 300 due to mediapipe outliers
    cadence = (2 * 60.) / step_time
    cadence = cadence[cadence < 250]
    self.avg_cadence = np.mean(cadence)
    return cadence
  
  def calculate_leg_crossover(self):
    # Get the frames for the right hip, left hip, right ankle, and left ankle
    right_hip = self.get_landmark_frames(24)
    left_hip = self.get_landmark_frames(23)
    right_ankle = self.get_landmark_frames(28)
    left_ankle = self.get_landmark_frames(27)
    
    # Calculate the midpoint between the left hip and right hip
    mid = (left_hip + right_hip) / 2
    
    # Calculate the distance between the midpoint and the left hip
    left_mid_dist = mid[:, 0] - left_hip[:, 0]
    
    # Calculate the distance between the right hip and the midpoint
    right_mid_dist = right_hip[:, 0] - mid[:, 0]

    # Calculate the left crossover percentage
    left_crossover = (left_ankle[:, 0] - left_hip[:, 0]) * (100. / left_mid_dist)
    
    # Calculate the right crossover percentage
    right_crossover = (right_hip[:, 0] - right_ankle[:, 0]) * (100. / right_mid_dist)

    # Set negative values to 0
    left_crossover[left_crossover < 0] = 0
    right_crossover[right_crossover < 0] = 0

    # Return the left and right crossover percentages
    return left_crossover, right_crossover


  def calculate_graph(self, first, middle, last):
    angle = 180 - self.smooth_data(self.get_angle(first, middle, last))
    plt.plot(angle)
    plt.xlabel("Frames")
    plt.ylabel("Angle")
    path = f'./temp_graphs/{first}-{middle}-{last}.png'
    plt.savefig(path)
    plt.clf()
    # Returns path
    return path