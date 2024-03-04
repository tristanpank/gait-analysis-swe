import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../API_URL";

export default function UploadPage(props) {
  const { user } = props;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById("video");
    const file = fileInput.files[0];
    const formData = new FormData();
    const viewInput = document.getElementById("view");
    const view = viewInput.value;
    console.log(user.uid);
    formData.append("video_file", file);
    formData.append("view", view);
    formData.append("uid", user.uid);

    // Make axios post request with formData
    const axios_config = {
      method: 'post',
      url: API_URL + 'pose/',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: formData
    }

    try {
      const res = await axios(axios_config);
      console.log(res);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }

    // Reset the form
    fileInput.value = null;
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Input for selecting a video file */}
      <label htmlFor="video">Upload a video:</label>
      <input id="video" type="file"></input>

      {/* Select input for choosing a view */}
      <label htmlFor="view">Select a view:</label>
      <select id="view">
        <option value="front">Front</option>
        <option value="side">Side</option>
      </select>

      {/* Submit button */}
      <button type="submit">Upload</button>
    </form>
  );
}
