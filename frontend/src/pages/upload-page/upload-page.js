import React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UploadPage(props) {
  const {user} = props;
  const handleSubmit = (e) => {
    e.preventDefault();
    const fileInput = document.getElementById("video");
    const file = fileInput.files[0];
    const formData = new FormData();
    const viewInput = document.getElementById("view");
    const view = viewInput.value;
    formData.append("video", file);
    formData.append("view", view);
    formData.append("user", user.uid);
    
    // Make axios post request with formData
    // Your code here
    
    
    // Reset the form
    fileInput.value = null;
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="video">Upload a video:</label>
      <input id="video" type="file"></input>
      <label htmlFor="view">Select a view:</label>
      <select id="view">
        <option value="front">Front</option>
        <option value="side">Side</option>
      </select>
      <button type="submit">Upload</button>
    </form>
  );
}