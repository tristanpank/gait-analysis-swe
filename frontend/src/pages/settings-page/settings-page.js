import React, { useState } from 'react'
import Header from '../../components/ui/header/header';
import { Input } from "../../shadcn/components/ui/input";
import { Label } from "../../shadcn/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../shadcn/components/ui/select";
import { Button } from "../../shadcn/components/ui/button";
import { setUserPFP } from "../../firebase/db";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../shadcn/components/ui/dialog"

const SettingPage = (props) => {
  const { user, setUser } = props
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById("image");
    const file = fileInput.files[0];

    if (file) {
      try {
        await setUserPFP(user, file);
        setUploadError(false);
        setUploadSuccess(true);
      } catch (error) {
        console.error(error);
        setUploadSuccess(false);
        setUploadError(true);
      }
    } else {
      console.error("No file selected");
      setUploadSuccess(false);
      setUploadError(true);
    }
  }

  return (
    <div>
      <Header user={user} setUser={setUser} />
      <div className="mt-15 pt-20">
        Settings
      </div>
      <Dialog>
        <button className="p-[3px] relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
          <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
            <DialogTrigger>Add Profile Picture</DialogTrigger>
          </div>
        </button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Profile Picture</DialogTitle>
            <DialogDescription>
              <form onSubmit={handleSubmit} className="">
                <div className="mt-5 mb-5 block">
                  <Label htmlFor="image" className="mb-2 block">Upload an image:</Label>
                  <Input type="file" id="image" className="cursor-pointer" />
                </div>
                <div>
                  {uploadSuccess && 
                    <div className="mb-5 text-green-500">Upload successful!</div>
                  }
                  {uploadError && 
                    <div className="mb-5 text-red-500">Upload failed. Please try again.</div>
                  }
                </div>
                <Button type="submit" variant="default">Submit</Button>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SettingPage;