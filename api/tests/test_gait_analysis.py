from app.gait_analysis import GaitAnalysis
import numpy as np


def test_angle():
  u = np.array([[1, 0]])
  v = np.array([[0, 1]])
  assert GaitAnalysis.angle(u, v) == 90

  u = np.array([[1, 0]])
  v = np.array([[np.sqrt(2)/2, np.sqrt(2)/2]])
  assert GaitAnalysis.angle(u, v) == 45

  u = np.array([[1, 0]])
  v = np.array([[1, 0]])
  assert GaitAnalysis.angle(u, v) == 0

  u = np.array([[1, 0]])
  v = np.array([[2, 0]])
  assert GaitAnalysis.angle(u, v) == 0

  u = np.array([[1, 0]])
  v = np.array([[-1, 0]])
  assert GaitAnalysis.angle(u, v) == 180