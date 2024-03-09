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

export default function UploadPage(props) {
  const { user } = props;
  const navigate = useNavigate();
  const [view, setView] = useState("front");
  const { toast } = useToast();
  const { setVideoUploaded } = React.useContext(GlobalStateContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById("video");
    const file = fileInput.files[0];
    const formData = new FormData();
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

    axios(axios_config).then((res) => {
      console.log(res);
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
    navigate('/dashboard');

    // Reset the form
    fileInput.value = null;
  };

  return (
  <div className="flex justify-center items-center min-h-screen bg-black">
    <Header user={user} color={false}></Header>
    <Card className="p-5">
      <CardHeader>
        <CardTitle>Upload a video</CardTitle>
      </CardHeader>
      <CardContent >
        <form onSubmit={handleSubmit} className="">
          <div className="mb-2 block">
            <Label htmlFor="video" className="mb-2 block">Upload a video:</Label>
            <Input type="file" id="video" className="cursor-pointer" accept="video/*" />
          </div>
          <div className="mb-2 block">
            <Label htmlFor="select" className="mb-2 block">Select a view:</Label>
            <Select className="mb-2 block" id="select" onValueChange={(value) => setView(value)} >
              <SelectTrigger >
                <SelectValue placeholder="Front" />
              </SelectTrigger>
              <SelectContent id="view">
                <SelectItem value="front"  >Front</SelectItem>
                <SelectItem value="side" >Side</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" variant="default">Submit</Button>
        </form>
      </CardContent>
    </Card>
  </div>
    
  );
}
