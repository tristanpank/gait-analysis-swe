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
  heel_strike_score = 0
  direction = ""
  bad_frames_detected = 0
  outliers_removed = 0
  lower_bound = 0
  upper_bound = 0

  def __init__(self, input_path="", output_path="", landmarker_path="./landmarkers/pose_landmarker.task", data=None):
    if data:
      self.frames = self.convert_str_to_numpy_with_python(data)
    else:
      landmark_frames = self.get_pose_array(input_path, output_path, landmarker_path)
      self.frames = self.convert_landmark_frames_to_numpy(landmark_frames)
      self.remove_bad_mediapipe_frames()

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
        # The defaults are 0.5 but i wrote them out if we ever want custom values
        min_pose_detection_confidence=0.5,
        min_pose_presence_confidence=0.5,
        min_tracking_confidence=0.5,
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
      try:
        detection_result = detector.detect_for_video(image, frame_timestamp)
        # Annotates results on video and writes to output
        annotated_frame = GaitAnalysis.draw_landmarks_on_image(frame, detection_result)
        out.write(annotated_frame)
        frame_positions.append(detection_result.pose_landmarks[0])
      except:
        pass
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
    if window_length > len(data):
      if len(data) % 2 == 0:
        window_length = len(data) - 1
      else:
        window_length = len(data)
    if window_length < 3:
      return data
    return savgol_filter(data, window_length=window_length, polyorder=polyorder)

  # Timeit took around 5ms per frame
  def calculate_cadence(self):
    if self.avg_cadence != 0:
      return self.avg_cadence
    if len(self.frames) == 0:
      return 0
    left_smooth_heel = self.get_landmark_frames(29)[:, 1]
    right_smooth_heel = self.get_landmark_frames(30)[:, 1]
    left_smooth_toe = self.get_landmark_frames(31)[:, 1]
    right_smooth_toe = self.get_landmark_frames(32)[:, 1]
    left_smooth_ankle = self.get_landmark_frames(27)[:, 1]
    right_smooth_ankle = self.get_landmark_frames(28)[:, 1]
    distance = 0
    window_length = 0
    for i in range(len(left_smooth_heel)):
      if (distance + 1) * self.time_between_frames / 1000 <= 0.2:
        distance += 1
      if (window_length + 1) * self.time_between_frames / 1000 <= 1.5 * 0.33333333:
        window_length += 1

    for i in range(1):
      left_smooth_heel = self.smooth_data(left_smooth_heel, window_length=window_length)
      right_smooth_heel = self.smooth_data(right_smooth_heel, window_length=window_length)
      left_smooth_toe = self.smooth_data(left_smooth_toe, window_length=window_length)
      right_smooth_toe = self.smooth_data(right_smooth_toe, window_length=window_length)
      left_smooth_ankle = self.smooth_data(left_smooth_ankle, window_length=window_length)
      right_smooth_ankle = self.smooth_data(right_smooth_ankle, window_length=window_length)

    # Uses sklearn to find peaks
    # Calculates periods as diff between minimum
    left_peaks_heel = find_peaks(left_smooth_heel, prominence=0.01, distance=distance)[0]
    right_peaks_heel = find_peaks(right_smooth_heel, prominence=0.01, distance=distance)[0]
    left_valleys_heel = find_peaks(-left_smooth_heel, prominence=0.01, distance=distance)[0]
    right_valleys_heel = find_peaks(-right_smooth_heel, prominence=0.01, distance=distance)[0]
    left_peaks_toe = find_peaks(left_smooth_toe, prominence=0.01, distance=distance)[0]
    right_peaks_toe = find_peaks(right_smooth_toe, prominence=0.01, distance=distance)[0]
    left_valleys_toe = find_peaks(-left_smooth_toe, prominence=0.01, distance=distance)[0]
    right_valleys_toe = find_peaks(-right_smooth_toe, prominence=0.01, distance=distance)[0]
    left_peaks_ankle = find_peaks(left_smooth_ankle, prominence=0.01, distance=distance)[0]
    right_peaks_ankle = find_peaks(right_smooth_ankle, prominence=0.01, distance=distance)[0]
    left_valleys_ankle = find_peaks(-left_smooth_ankle, prominence=0.01, distance=distance)[0]
    right_valleys_ankle = find_peaks(-right_smooth_ankle, prominence=0.01, distance=distance)[0]

    all_peaks_heel = np.sort(np.concatenate((left_peaks_heel, right_peaks_heel)))
    all_valleys_heel = np.sort(np.concatenate((left_valleys_heel, right_valleys_heel)))
    all_peaks_toe = np.sort(np.concatenate((left_peaks_toe, right_peaks_toe)))
    all_valleys_toe = np.sort(np.concatenate((left_valleys_toe, right_valleys_toe)))
    all_peaks_ankle = np.sort(np.concatenate((left_peaks_ankle, right_peaks_ankle)))
    all_valleys_ankle = np.sort(np.concatenate((left_valleys_ankle, right_valleys_ankle)))

    # Periods between both feet
    peak_periods_heel = np.diff(all_peaks_heel[:])
    valley_periods_heel = np.diff(all_valleys_heel[:])
    all_periods_heel = np.concatenate((peak_periods_heel, valley_periods_heel))
    peak_periods_toe = np.diff(all_peaks_toe[:])
    valley_periods_toe = np.diff(all_valleys_toe[:])
    all_periods_toe = np.concatenate((peak_periods_toe, valley_periods_toe))
    peak_periods_ankle = np.diff(all_peaks_ankle[:])
    valley_periods_ankle = np.diff(all_valleys_ankle[:])
    all_periods_ankle = np.concatenate((peak_periods_ankle, valley_periods_ankle))

    # Include single legs periods
    left_peak_periods_heel = np.diff(left_peaks_heel[:])
    left_valley_periods_heel = np.diff(left_valleys_heel[:])
    right_peak_periods_heel = np.diff(right_peaks_heel[:])
    right_valley_periods_heel = np.diff(right_valleys_heel[:])
    left_peak_periods_toe = np.diff(left_peaks_toe[:])
    left_valley_periods_toe = np.diff(left_valleys_toe[:])
    right_peak_periods_toe = np.diff(right_peaks_toe[:])
    right_valley_periods_toe = np.diff(right_valleys_toe[:])
    left_peak_periods_ankle = np.diff(left_peaks_ankle[:])
    left_valley_periods_ankle = np.diff(left_valleys_ankle[:])
    right_peak_periods_ankle = np.diff(right_peaks_ankle[:])
    right_valley_periods_ankle = np.diff(right_valleys_ankle[:])
    all_periods_heel = np.concatenate((all_periods_heel, 0.5 * left_peak_periods_heel[:]))
    all_periods_heel = np.concatenate((all_periods_heel, 0.5 * left_valley_periods_heel[:]))
    all_periods_heel = np.concatenate((all_periods_heel, 0.5 * right_peak_periods_heel[:]))
    all_periods_heel = np.concatenate((all_periods_heel, 0.5 * right_valley_periods_heel[:]))
    all_periods_toe = np.concatenate((all_periods_toe, 0.5 * left_peak_periods_toe[:]))
    all_periods_toe = np.concatenate((all_periods_toe, 0.5 * left_valley_periods_toe[:]))
    all_periods_toe = np.concatenate((all_periods_toe, 0.5 * right_peak_periods_toe[:]))
    all_periods_toe = np.concatenate((all_periods_toe, 0.5 * right_valley_periods_toe[:]))
    all_periods_ankle = np.concatenate((all_periods_ankle, 0.5 * left_peak_periods_ankle[:]))
    all_periods_ankle = np.concatenate((all_periods_ankle, 0.5 * left_valley_periods_ankle[:]))
    all_periods_ankle = np.concatenate((all_periods_ankle, 0.5 * right_peak_periods_ankle[:]))
    all_periods_ankle = np.concatenate((all_periods_ankle, 0.5 * right_valley_periods_ankle[:]))

    all_periods = np.concatenate((all_periods_heel, all_periods_toe))
    all_periods = np.concatenate((all_periods, all_periods_ankle))
    # Converts periods from frames to seconds
    step_time = all_periods * (self.time_between_frames / 1000.)
    # Calculates steps per min
    # Filters spm > 300 due to mediapipe outliers
    cadence = 60. / step_time[step_time != 0]
    cadence = cadence[(cadence >= 100) & (cadence <= 300)]
    cadence.sort()
    # Calculate Q1, Q3, and IQR
    if len(cadence) > 2:
      Q1 = np.percentile(cadence, 25)
      Q3 = np.percentile(cadence, 75)
      IQR = Q3 - Q1

      # Define bounds for outliers
      lower_bound = Q1 - 1.5 * IQR
      upper_bound = Q3 + 1.5 * IQR

      # Filter out outliers and calculate mean
      cadence = cadence[(cadence >= lower_bound) & (cadence <= upper_bound)]
    self.avg_cadence = np.mean(cadence)
    return self.avg_cadence

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

  def calculate_direction(self):
    if self.direction != "":
      return self.direction
    left_ear = self.get_landmark_frames(0)[:,0] - self.get_landmark_frames(7)[:,0]
    right_ear = self.get_landmark_frames(0)[:,0] - self.get_landmark_frames(8)[:,0]
    ears = left_ear + right_ear
    left_avg = np.mean(left_ear)
    right_avg= np.mean(right_ear)
    average = np.mean(ears)
    direction = ""
    if average < right_avg and average < left_avg:
      direction = "Left"
    elif average > left_avg and average > right_avg:
      direction = "Right"
    elif average > right_avg and average < left_avg:
      direction = "Back"
    else:
      direction = "Front"
    return direction

  def calculate_heel_strike_score(self):
    if self.heel_strike_score != 0:
      return self.heel_strike_score
    smooth_heel = 1 - (self.get_landmark_frames(29)[:, 1])
    smooth_foot = 1 - (self.get_landmark_frames(31)[:, 1])

    for i in range(10):
      smooth_heel = self.smooth_data(smooth_heel)
      smooth_foot = self.smooth_data(smooth_foot)

    # May need to adjust distance for framerate
    heel_valleys, _ = find_peaks(-smooth_heel, prominence=0.01, distance=5)
    foot_valleys, _ = find_peaks(-smooth_foot, prominence=0.01, distance=5)

    heel_strike_count = 0
    total_strike_count = 0
    foot_offset = 0
    heel_offset = 0
    minimum = min(len(heel_valleys), len(foot_valleys))
    i = 0
    while i < minimum:
      # Heel offsets help get the calculation back on track if the peaks are not aligned
      if i + foot_offset >= len(foot_valleys) or i + heel_offset >= len(heel_valleys):
        break
      temp = foot_valleys[i + foot_offset] - heel_valleys[i + heel_offset]
      if temp > -5 and temp < 5:
        heel_strike_count += temp
        total_strike_count += 1
        i += 1
      elif temp >= 5:
        heel_offset += 1
      else:
        foot_offset += 1

    heel_strike_score = 99
    if total_strike_count == 0:
      return 0
    if heel_strike_count > 0:
      heel_strike_score -= (heel_strike_count/total_strike_count*10)
      heel_strike_score = heel_strike_score * heel_strike_score / 90
      if heel_strike_score > 99:
        heel_strike_score = 99
    else:
      heel_strike_score -= (heel_strike_count/total_strike_count*0.1)

    # Arbitrary values are used to make the calculation seem good
    # We could always curve this to make it higher or lower
    # Downside is that slow running will have a poor score
    # Downside is that high frame rate will have a poor score
    # Downside is that using frame minima says little about overstriding
    self.heel_strike_score = int(heel_strike_score)
    return
  
  def remove_bad_mediapipe_frames(self):
    # Remove frames where the head is below the foot
    avg_head = (self.frames[:, 0, 1] + self.frames[:, 2, 1] + self.frames[:, 5, 1] + self.frames[:, 7, 1] + self.frames[:, 8, 1]) / 5
    avg_foot = (self.frames[:, 27, 1] + self.frames[:, 28, 1] + self.frames[:, 29, 1] + self.frames[:, 30, 1] + self.frames[:, 31, 1] + self.frames[:, 32, 1]) / 6
    avg_head_foot_diff = avg_head[:] - avg_foot[:]
    # 0.2 is arbitrary, maybe need to be less for further away people
    bad_frames = np.where(avg_head_foot_diff[:] > -0.2)
    self.bad_frames_detected = len(bad_frames[0])
    self.frames = np.delete(self.frames, bad_frames, axis=0)

    # Remove outliers
    if len(avg_head_foot_diff) > 2:
      avg_head = (self.frames[:, 0, 1] + self.frames[:, 2, 1] + self.frames[:, 5, 1] + self.frames[:, 7, 1] + self.frames[:, 8, 1]) / 5
      avg_foot = (self.frames[:, 27, 1] + self.frames[:, 28, 1] + self.frames[:, 29, 1] + self.frames[:, 30, 1] + self.frames[:, 31, 1] + self.frames[:, 32, 1]) / 6
      avg_head_foot_diff = avg_head[:] - avg_foot[:]
      Q1 = np.percentile(avg_head_foot_diff, 25)
      Q3 = np.percentile(avg_head_foot_diff, 75)
      IQR = Q3 - Q1

      # Define bounds for outliers
      self.lower_bound = Q1 - 1.5 * IQR
      self.upper_bound = Q3 + 1.5 * IQR

      # Filter out outliers and calculate mean
      bad_frames = np.where(avg_head_foot_diff < self.lower_bound)
      self.outliers_removed = len(bad_frames[0])
      self.frames = np.delete(self.frames, bad_frames, axis=0)

      avg_head = (self.frames[:, 0, 1] + self.frames[:, 2, 1] + self.frames[:, 5, 1] + self.frames[:, 7, 1] + self.frames[:, 8, 1]) / 5
      avg_foot = (self.frames[:, 27, 1] + self.frames[:, 28, 1] + self.frames[:, 29, 1] + self.frames[:, 30, 1] + self.frames[:, 31, 1] + self.frames[:, 32, 1]) / 6
      avg_head_foot_diff = avg_head[:] - avg_foot[:]
      bad_frames = np.where(avg_head_foot_diff > self.upper_bound)
      self.outliers_removed += len(bad_frames[0])
      self.bad_frames_detected += self.outliers_removed
      self.frames = np.delete(self.frames, bad_frames, axis=0)

    return