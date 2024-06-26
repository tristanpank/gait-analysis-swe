import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../API_URL";
import { Input } from "../../shadcn/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "../../shadcn/components/ui/card";
import { Label } from "../../shadcn/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../shadcn/components/ui/select";
import { Button } from "../../shadcn/components/ui/button";
import Header from "src/components/ui/header/header";
import { useToast } from "../../shadcn/components/ui/use-toast";
import { GlobalStateContext } from "src/components/react/GlobalStateProvider";
import { getUserHeight } from "src/firebase/db";

export default function UploadPage(props) {
  const { user, setUser } = props;
  const navigate = useNavigate();
  const [view, setView] = useState("front");
  const { toast } = useToast();
  const { setVideoUploaded } = React.useContext(GlobalStateContext);

  // Makes the API request to the backend to upload the video
  const handleSubmit = async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById("video");
    const file = fileInput.files[0];
    const formData = new FormData();
    const height = await getUserHeight(user);
    formData.append("video_file", file);
    formData.append("view", "front");
    formData.append("uid", user.uid);
    formData.append("height", height);

    // Make axios post request with formData
    const axios_config = {
      method: 'post',
      url: API_URL + 'pose/',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: formData
    }

    // Displays toast when video is uploaded or if there is an error. 
    axios(axios_config).then((res) => {
      toast({
        description: "Video uploaded successfully",
      })
      setVideoUploaded(true);
    }).catch((error) => {
      console.error(error);
      toast({
        description: "Error uploading video",
        variant: "destructive"
      })
    });
    toast({
      description: "Uploading video...",
    });
    // Navigates to dashboard immediately after uploading. 
    navigate('/dashboard');

    // Reset the form
    fileInput.value = null;
  };

  return (
  <div className="flex justify-center items-center min-h-screen bg-slate-100">
    <Header user={user} setUser={setUser}></Header>
    <div className="flex flex-col lg:flex-row w-screen mt-16 py-5">
      <div className="w-[20rem] m-auto">
        <div className="rounded-md bg-white p-5">
          Gait analysis is an AI-based tool for runners aiming to prevent injuries and enhance running economy. By meticulously assessing your running mechanics, our analysis helps pinpoint inefficiencies and biomechanical imbalances. This personalized insight allows for targeted interventions, leading to safer running practices and improved performance. Embrace gait analysis to keep your strides efficient and injury-free, ensuring every run is your best.
        </div>
      </div>
      <Card className="p-5 m-auto my-10">
        <CardHeader>
          <CardTitle>Upload a video</CardTitle>
        </CardHeader>
        <CardContent >
          <form onSubmit={handleSubmit} className="">
            <div className="mb-5 block">
              <Input type="file" id="video" className="cursor-pointer" accept="video/*" />
            </div>
            <Button type="submit" variant="default">Submit</Button>
          </form>
        </CardContent>
      </Card>
      <div className="w-[20rem] m-auto">
        <div className="rounded-md bg-white p-5">
          <h1 className="text-lg font-semibold">How to record a video</h1>
          <p>1. Record a video of yourself running on a treadmill or outdoors.</p>
          <p>2. Ensure the camera is at the same level as your waist.</p>
          <p>3. Ensure the camera is close enough so that you take up at least a third of the screen height.</p>
          <p>4. Upload the video here.</p>
        </div>
      </div>
    </div>
  </div>
    
    
  );
}
