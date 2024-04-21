import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import InjuryItem from "./InjuryItem";

export default function InjuryDisplay(props) {
  const {injuryData, videoData} = props;
  if (!injuryData || !videoData) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center p-4 justify-center md:w-2/3 rounded-md bg-white">
      <h1 className="text-2xl font-bold text-center">Injury Data</h1>
      {Object.keys(injuryData).map((key) => {
        return (
          <InjuryItem key={key} injury={injuryData[key]} />
        )
      })}
      {(videoData.view === "left" || videoData.view === "right") && (
        <div className="md:flex md:flex-row w-[100%] p-5">
          <div className="md:w-[40%]">
            <h3 className="font-semibold">Overstriding</h3>
            <div className={
              videoData.heel_strike_angle > 0 ? "text-green-600" :
              videoData.heel_strike_angle > -3 ? "text-yellow-500" :
              "text-red-600"
            }>Heel Strike Angle: {Math.round(videoData.heel_strike_angle * 10) / 10}°</div>
            <div className={
              videoData.max_knee_flexion_angle > 170 ? "text-red-600" :
              videoData.max_knee_flexion_angle > 160 ? "text-yellow-500" :
              "text-green-600"
            }>Max Knee Flexion Angle: {Math.round(videoData.max_knee_flexion_angle)}°</div>
            <div className={
              videoData.knee_flexion_angle > 150 ? "text-red-600" :
              videoData.knee_flexion_angle > 140 ? "text-yellow-500" :
              "text-green-600"
            }>Knee Flexion Angle: {Math.round(videoData.knee_flexion_angle)}°</div>
            <div className={
              videoData.shin_strike_angle > 100 ? "text-red-600" :
              videoData.shin_strike_angle > 90 ? "text-yellow-500" :
              "text-green-600"
            }>Shin Strike Angle: {Math.round(videoData.shin_strike_angle)}°</div>
          </div>
          <div className="md:w-[60%] mt-3 md:mt-0">
            These angles are used to determine if you are overstriding. Overstriding can lead to injuries such as shin splints, plantar fasciitis, and runner's knee. Negative heel strike angle means that your heel touches the ground before your toes, large negative values can indicate overstriding. Your max knee flexion angle is the angle of your knee when your foot initially strikes the ground. Angles greater than 160 degrees can indicate overstriding and are associated with higher impact forces. Your knee flexion angle is the angle of your knee when your foot is directly under your hips. A knee flexion angle of greater than 140 degree also is associated with higher impact forces. Less flexion (angles closer to 180 degrees) results higher shock at the ankle, tibia and knee leading to common injuries such as PFPS, Tibial stress fractures etc. Your shin strike angle is the angle of your shin with respect to the ground at the time of max knee flexion. A shin strike angle of greater than 90 degrees can indicate overstriding.
          </div>
        </div>
      )}

    </div>
  )
}