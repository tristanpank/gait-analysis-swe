import React from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader, DialogClose } from "../../shadcn/components/ui/dialog";
import { Button } from "../../shadcn/components/ui/button";
import { useNavigate } from "react-router-dom";
import { deleteVideo } from "../../firebase/db";
import { GlobalStateContext } from "src/components/react/GlobalStateProvider";


export default function DeleteButton(props) {
  const { user, vid } = props;
  const navigate = useNavigate();
  const { setVideoUploaded } = React.useContext(GlobalStateContext);

  async function handleDelete() {
    const result = await deleteVideo(user, vid);
    if (result === true) {
      setVideoUploaded(true);
      navigate("/dashboard");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Delete</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete?</DialogTitle>
        </DialogHeader>
        <div className="flex justify-end space-x-2">
          <DialogClose>
            <Button variant="outline" >Cancel</Button>
          </DialogClose>
          <Button onClick={handleDelete}>Delete</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}