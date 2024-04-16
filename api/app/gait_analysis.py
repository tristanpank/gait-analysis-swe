import mediapipe as mp
import cv2
import numpy as np
import matplotlib.pyplot as plt
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
from mediapipe import solutions
from mediapipe.framework.formats import landmark_pb2
from scipy.signal import find_peaks, savgol_filter, butter, filtfilt
import scipy.stats as stats

class GaitAnalysis:
  frames = np.array([])
  time_between_frames = 0
  # Removal of bad frames due to head below foot
  bad_frames_detected = 0
  outliers_removed = 0
  lower_bound = 0
  upper_bound = 0
  # Cadence in steps per minute (Range 100 to 300)
  avg_cadence = 0
  # Left, Right, Front, Back
  direction = ""
  # Pace in minutes per mile (Range 4 to 20)
  pace = 0
  # Stride length in feet
  stride_length = 0
  # Avg male height in inches
  height = 69
  screen_height = 0
  vertical_oscillation = 0
  # 10% of height is a arbitrary offset for height not accounted for from eyes - ankles distance
  offset = 6.9
  aspect_ratio = 16 / 9.
  # 0 is ideal, negative is heel strike, positive is forefoot strike (Range -5 to 5)
  heel_strike_angle = 0
  # < 10 degress is ideal
  shin_strike_angle = 0
  # < 160 degrees is ideal
  max_knee_flexion_angle = 0
  # < 140 degrees is ideal
  knee_flexion_angle = 0
  #TODO
  forward_tilt_angle = 0
  #TODO Probably 70-110 is ideal, but conflicting views
  elbow_angle = 0
  #TODO We should find a stat for knee drive
  #TODO We should find a stat for arm swing
  #TODO We should find a stat for heel lift

  def __init__(self, input_path="", output_path="", landmarker_path="./app/landmarkers/pose_landmarker.task", data=None, height=69, aspect_ratio=16/9.):
    if data:
      self.frames = self.convert_str_to_numpy_with_python(data)
    else:
      landmark_frames = self.get_pose_array(input_path, output_path, landmarker_path)
      self.frames = self.convert_landmark_frames_to_numpy(landmark_frames)
      self.remove_bad_mediapipe_frames()
      self.height = height
      self.offset = height * 0.1
      self.aspect_ratio = aspect_ratio
      self.perform_calculations()

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
    
    # Account for aspect ratio
    start_mid[:, 0] *= self.aspect_ratio
    mid_end[:, 0] *= self.aspect_ratio
    return self.angle(start_mid, mid_end)

  def smooth_data(self, data, window_length=15, polyorder=3):
    # Ensure window length is odd and less than data length
    if window_length > len(data):
      if len(data) % 2 == 0:
        window_length = len(data) - 1
      else:
        window_length = len(data)
    if window_length < 3:
      return data
    return savgol_filter(data, window_length=window_length, polyorder=polyorder)
  
  # Function to design a Butterworth low-pass filter and apply it
  def lowpass_filter(self, data, cutoff=5, fs=0, order=5):
      if fs == 0:
        fs = 1000 / self.time_between_frames  # sample rate, Hz
      # cutoff = 5  # desired cutoff frequency of the filter, Hz
      nyq = 0.5 * fs  # Nyquist Frequency
      normal_cutoff = cutoff / nyq
      # Get the filter coefficients
      b, a = butter(order, normal_cutoff, btype='low', analog=False)
      y = filtfilt(b, a, data)
      return y
  
  def perform_calculations(self):
    # Calculate all stats
    self.calculate_direction()
    if self.direction == "front" or self.direction == "back":
      self.calculate_leg_crossover()
      self.calculate_cadence()

    else:
      self.calculate_cadence()
      self.calculate_pace()
      self.calculate_heel_strike_angle()
      self.calculate_vertical_oscillation()
      self.calculate_knee_flexion()
    return

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

    # Determine distance between peaks and window length based on framerate
    distance = 0
    window_length = 0
    for i in range(len(left_smooth_heel)):
      if (distance + 1) * self.time_between_frames / 1000 <= 0.2:
        distance += 1
      if (window_length + 1) * self.time_between_frames / 1000 <= 1.5 * 0.33333333:
        window_length += 1

    # Smooth data to remove noise
    for i in range(1):
      left_smooth_heel = self.smooth_data(left_smooth_heel, window_length=window_length)
      right_smooth_heel = self.smooth_data(right_smooth_heel, window_length=window_length)
      left_smooth_toe = self.smooth_data(left_smooth_toe, window_length=window_length)
      right_smooth_toe = self.smooth_data(right_smooth_toe, window_length=window_length)
      left_smooth_ankle = self.smooth_data(left_smooth_ankle, window_length=window_length)
      right_smooth_ankle = self.smooth_data(right_smooth_ankle, window_length=window_length)

    # Uses sklearn to find peaks
    # Calculates periods as diff between local extrema
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

    # Combine all periods
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

    # Find the crossover peaks and calculate the max and average crossover
    left_peaks, _ = find_peaks(left_crossover, distance=10)
    right_peaks, _ = find_peaks(right_crossover, distance=10)

    right_peaks_values = [round(right_crossover[peak], 2) for peak in right_peaks]
    left_peaks_values = [round(left_crossover[peak], 2) for peak in left_peaks]

    right_max = round(max(right_peaks_values), 2)
    left_max = round(max(left_peaks_values), 2)
    right_avg = round(np.average(right_peaks_values), 2)
    left_avg = round(np.average(left_peaks_values), 2)

    data = {
        "left_crossover": left_crossover,
        "right_crossover": right_crossover,
        "right_peaks_values": right_peaks_values,
        "left_peaks_values": left_peaks_values,
        "right_max": right_max,
        "left_max": left_max,
        "right_avg": right_avg,
        "left_avg": left_avg
    }

    # Return the crossover data
    return data


  def calculate_graph(self, first, middle, last):
    angle = 180 - self.lowpass_filter(self.get_angle(first, middle, last))
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
    # Calculate the distance between the ears and the nose
    left_ear = self.get_landmark_frames(0)[:,0] - self.get_landmark_frames(7)[:,0]
    right_ear = self.get_landmark_frames(0)[:,0] - self.get_landmark_frames(8)[:,0]
    ears = left_ear + right_ear
    left_avg = np.mean(left_ear)
    right_avg= np.mean(right_ear)
    average = np.mean(ears)

    # Determine the direction based on the average distance between the ears and the nose
    self.direction = ""
    if average < right_avg and average < left_avg:
      self.direction = "left"
    elif average > left_avg and average > right_avg:
      self.direction = "right"
    elif average > right_avg and average < left_avg:
      self.direction = "back"
    else:
      self.direction = "front"
    return self.direction

  def calculate_heel_strike_angle(self):
    if self.heel_strike_angle != 0:
      return self.heel_strike_angle
    # Calculate angles of both feet and ground
    ground_vector = np.array([[-1, 0]])
    left_foot_ground_angle = -180 + self.angle(self.get_landmark_frames(31) - self.get_landmark_frames(27), ground_vector[:, ::-1])
    right_foot_ground_angle = -180 + self.angle(self.get_landmark_frames(32) - self.get_landmark_frames(28), ground_vector[:, ::-1])

    # Adjust distance between peaks to video framerate, although distance should be double this but it worked well without doubling because data is unsmoothed
    distance = 0
    for i in range(len(self.frames)):
      if (distance + 1) * self.time_between_frames / 1000 <= 0.2:
        distance += 1
    left_foot_ground_peaks = find_peaks(left_foot_ground_angle, distance=distance)[0]
    right_foot_ground_peaks = find_peaks(right_foot_ground_angle, distance=distance)[0]

    # Combine feet and remove outliers, bounding between -5 and 5 helps with next step
    heel_strike_angles = np.concatenate((left_foot_ground_angle[left_foot_ground_peaks], right_foot_ground_angle[right_foot_ground_peaks]))
    bad_frames = np.where(heel_strike_angles < -5)
    heel_strike_angles = np.delete(heel_strike_angles, bad_frames, axis=0)
    bad_frames = np.where(heel_strike_angles > 5)
    heel_strike_angles = np.delete(heel_strike_angles, bad_frames, axis=0)

    # Adjust data to result in a value between 0 and 100
    # hss = (np.mean(heel_strike_angles) + 5) / 10
    # if hss > 0.5:
    #   # Greater than 95% is superb, so forefoot strike
    #   hss = 95 + 5 * (hss - 0.5) / (1 - 0.5)
    # elif hss > 0.3:
    #   # Greater than 85% is good, so small heel strike
    #   hss = 85 + 15 * (hss - 0.3) / (0.5 - 0.3)
    # else:
    #   hss = 85 / 0.3 * hss
    self.heel_strike_angle = np.mean(heel_strike_angles)
    return self.heel_strike_angle
  
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
  
  def calculate_pace(self):
    if self.pace != 0:
      return self.pace, self.stride_length
    
    left_eye = self.get_landmark_frames(1)
    right_eye = self.get_landmark_frames(2)
    left_shoulder = self.get_landmark_frames(11)
    right_shoulder = self.get_landmark_frames(12)
    left_hip = self.get_landmark_frames(23)
    right_hip = self.get_landmark_frames(24)
    left_knee = self.get_landmark_frames(25)
    right_knee = self.get_landmark_frames(26)
    left_ankle = self.get_landmark_frames(27)
    right_ankle = self.get_landmark_frames(28)

    avg_eyes = (left_eye + right_eye) / 2
    avg_shoulders = (left_shoulder + right_shoulder) / 2
    avg_hip = (left_hip + right_hip) / 2
    left_hip_foot_diff = left_hip[:, 0] - left_ankle[:, 0]
    right_hip_foot_diff = right_hip[:, 0] - right_ankle[:, 0]
    framerate = 1 / self.time_between_frames * 1000

    # Define function to calculate distance between two points
    def calculate_distance(first, second):
      output = []
      for i in range(min(len(first), len(second))):
        sum = 0
        for j in range(min(len(first[i]), len(second[i]))):
          if j == 0:
            sum += (16/9. * (first[i][j] - second[i][j])) ** 2
          else:
            sum += (first[i][j] - second[i][j]) ** 2
        output.append(sum ** 0.5)
      return np.array(output)

    # Calculate the window_height of runner (fraction of runner height to screen height)
    # Calculate screen_height in feet, this can be used to convert mediapipe values to feet
    window_height = calculate_distance(avg_eyes, avg_shoulders) + calculate_distance(avg_shoulders, avg_hip) + (calculate_distance(left_hip, left_knee) + calculate_distance(right_hip, right_knee)) / 2 + (calculate_distance(left_knee, left_ankle) + calculate_distance(right_knee, right_ankle)) / 2
    screen_height = (self.height - self.offset) / np.median(window_height)
    self.screen_height = screen_height

    # Determine distance between peaks and window length based on framerate
    distance = 0
    window_length = 0
    for i in range(len(window_height)):
      if (distance + 1) * self.time_between_frames / 1000 <= 0.2:
        distance += 1
      if (window_length + 1) * self.time_between_frames / 1000 <= 1.5 * 0.33333333:
          window_length += 1
    if window_length % 2 == 0:
      window_length += 1

    # Derivative of hip to foot distance is the speed of the foot
    # TODO Consider using x and y distance not just x
    left_running_mph = np.diff(left_hip_foot_diff) * framerate * self.aspect_ratio * screen_height / 63360 * 3600
    right_running_mph = -np.diff(right_hip_foot_diff) * framerate * self.aspect_ratio * screen_height / 63360 * 3600
    left_running_mph = self.smooth_data(left_running_mph, window_length=window_length)
    right_running_mph = self.smooth_data(right_running_mph, window_length=window_length)
    left_foot_speed_mph = find_peaks(left_running_mph, prominence=0.5, distance = distance * 2)[0]
    right_foot_speed_mph = find_peaks(right_running_mph, prominence=0.5, distance = distance * 2)[0]
    foot_speed_mph = np.concatenate((left_running_mph[left_foot_speed_mph], right_running_mph[right_foot_speed_mph]))
    if len(foot_speed_mph) > 0:
        # Define bounds for outliers                    
        # Filter pace to between 4 and 20 min/mile
        lower_bound = 3
        upper_bound = 15
                  
        # Filter out outliers and calculate mean
        foot_speed_mph = foot_speed_mph[(foot_speed_mph >= lower_bound) & (foot_speed_mph <= upper_bound)]
    running_pace = 1 / foot_speed_mph * 60
    self.pace = np.mean(running_pace)
    self.stride_length = np.mean(foot_speed_mph) * 5280 / 60 / self.calculate_cadence()
    return self.pace, self.stride_length

  def calculate_knee_flexion(self):
    """ 
    Less flexion results higher shock at the ankle, tibia and knee leading to common injuries such as PFPS, Tibial stress fractures etc.,
    At initial contact the angle between the hip, knee and ankle should be < 160 degrees and at mid stance that angle should reduce to <140 degrees.      
    """
    left_hip_knee_angle = 180 - self.get_angle(23, 25, 27)
    right_hip_knee_angle = 180 - self.get_angle(24, 26, 28)
    all_knee_angles = np.concatenate((left_hip_knee_angle, right_hip_knee_angle))
    knee_flexion_angle_50th_percentile = np.percentile(all_knee_angles, 50)
    knee_flexion_angle_90th_percentile = np.percentile(all_knee_angles, 90)

    self.max_knee_flexion_angle = knee_flexion_angle_90th_percentile
    self.knee_flexion_angle = knee_flexion_angle_50th_percentile
    return self.max_knee_flexion_angle, self.knee_flexion_angle

  def calculate_vertical_oscillation(self):
    # Get landmarks
    left_eye = self.get_landmark_frames(1)
    right_eye = self.get_landmark_frames(2)
    left_shoulder = self.get_landmark_frames(11)
    right_shoulder = self.get_landmark_frames(12)
    left_hip = self.get_landmark_frames(23)
    right_hip = self.get_landmark_frames(24)
    avg_eyes = (left_eye + right_eye) / 2
    avg_shoulders = (left_shoulder + right_shoulder) / 2
    avg_hip = (left_hip + right_hip) / 2
    # Calculate linear regression
    slope, intercept, r_value, p_value, std_err = stats.linregress([i for i in range(len(avg_eyes))], avg_eyes[:, 1])
    avg_eyes = avg_eyes[:, 1] - ([slope * i for i in range(len(avg_eyes))] + intercept)
    slope, intercept, r_value, p_value, std_err = stats.linregress([i for i in range(len(avg_shoulders))], avg_shoulders[:, 1])
    avg_shoulders = avg_shoulders[:, 1] - ([slope * i for i in range(len(avg_shoulders))] + intercept)
    slope, intercept, r_value, p_value, std_err = stats.linregress([i for i in range(len(avg_hip))], avg_hip[:, 1])
    avg_hip = avg_hip[:, 1] - ([slope * i for i in range(len(avg_hip))] + intercept)
    # plt.plot(avg_eyes)
    # plt.plot(avg_shoulders)
    # plt.plot(avg_hip)
    # plt.show()
    total = np.concatenate((avg_eyes, avg_shoulders, avg_hip))
    amplitude = np.percentile(total, 90) - np.percentile(total, 10)
    self.vertical_oscillation = amplitude * self.screen_height
    return self.vertical_oscillation

