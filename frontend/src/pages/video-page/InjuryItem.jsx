import React from "react";

// Used for formatting the injury data for a specific injury
function generateInjuryDescription(injury) {
  // Displays crossover graphs and warning if crossover is too high
  if (injury.name === "crossover") {
    let leftLarger = injury.left_avg > injury.right_avg;
    let avgCrossover = leftLarger ? injury.left_avg : injury.right_avg;
    let maxCrossover = leftLarger ? injury.left_max : injury.right_max;
    return (
      <div className="px-4 py-4">
        <h3 className="font-semibold">Leg Crossover</h3>
        <img src={injury.url} />
        <li>Average Left Leg Crossover: {injury.left_avg}%</li>
        <li>Average Right Leg Crossover: {injury.right_avg}%</li>
        <li>Maximum Left Leg Crossover: {injury.left_max}%</li>
        <li>Maximum Right Leg Crossover: {injury.right_max}%</li>
        <li>Your {(leftLarger) ? "left" : "right"} leg crosses over more than the other. {(avgCrossover > 50) && "Since the average crossover is over 50%, you may be more prone to lower leg injuries."}</li>
      </div>
    )
  }
}

export default function InjuryItem(props) {
  const {injury} = props;
  return (
    <div>
      {generateInjuryDescription(injury)}
    </div>
  )
}