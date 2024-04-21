import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import InjuryItem from "./InjuryItem";

export default function InjuryDisplay(props) {
  const {injuryData} = props;

  return (
    <div className="flex flex-col items-center md:w-2/3 rounded-md bg-white">
      <h1 className="text-2xl font-bold">Injury Data</h1>
      {Object.keys(injuryData).map((key) => {
        return (
          <InjuryItem key={key} injury={injuryData[key]} />
        )
      })}
    </div>
  )
}