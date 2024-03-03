def get_all_graphs(gait_analysis):
    angles_right_side = [
        [12, 14, 16], 
        [14, 12, 24], 
        [12, 24, 26], 
        [24, 26, 28],
        [26, 28, 32]
        ]
    paths = []
    for angle in angles_right_side:
        path = gait_analysis.calculate_graph(angle[0], angle[1], angle[2])
        paths.append(path)
    for angle in angles_right_side:
        path = gait_analysis.calculate_graph(angle[0] - 1, angle[1] - 1, angle[2] -1)
        paths.append(path)
    return paths