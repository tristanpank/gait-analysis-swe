import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import InjuryItem from "./InjuryItem";

function generateInjuryDescription(injury) {
  if (injury.name === "crossover") {
    let leftLarger = injury.left_avg > injury.right_avg;
    let avgCrossover = leftLarger ? injury.left_avg : injury.right_avg;
    let maxCrossover = leftLarger ? injury.left_max : injury.right_max;
    return (
      <div>
        <h3>Leg Crossover</h3>
        <li>Average Left Leg Crossover: {injury.left_avg}%</li>
        <li>Average Right Leg Crossover: {injury.right_avg}%</li>
        <li>Maximum Left Leg Crossover: {injury.left_max}%</li>
        <li>Maximum Right Leg Crossover: {injury.right_max}%</li>
        <li>Your {(leftLarger) ? "left" : "right"} leg crosses over more than the other. {(avgCrossover > 50) && "Since the average crossover is over 50%, you may be more prone to lower leg injuries."}</li>
      </div>
    )
  }
}


export default function InjuryDisplay(props) {
  const {injuryData} = props;

  return (
    <div>
      <h1>Injury Data</h1>
      {Object.keys(injuryData).map((key) => {
        return (
          <InjuryItem key={key} injury={injuryData[key]} />
        )
      })}
    </div>
  )
}