import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "../../../shadcn/components/ui/dropdown-menu";
import { signOutUser } from "src/firebase/auth";
import { useNavigate } from "react-router-dom";


const ProfileIcon = (props) => {
  const { user, setUser } = props;
  const firstLetter = (user && user.displayName) ? user.displayName.charAt(0).toUpperCase() : "U";
  const navigate = useNavigate();
  const handleSignOut = async () => {
    signOutUser().then(() => {
      setUser({});
      navigate('/');
    }).catch((error) => {
      console.error(error);
    });
  }

  return (
    // <DropdownMenu>
    //   <DropdownMenuTrigger>
    //     <div className="mx-5 md:mx-10">
    //       {(user && user.photoURL === null) && <div className="w-10 h-10 bg-green-700 text-white flex justify-center items-center rounded-full text-xl">
    //         {firstLetter}
    //         </div>}
    //       {(user && user.photoURL != null) && <img className="w-10 h-10 bg-green-700 text-white flex justify-center items-center rounded-full text-xl" 
    //         src={user.photoURL}/>}
    //     </div>
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent className="bg-white rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade">
    //     <DropdownMenuItem>
    //       <button onClick={() => {navigate()}} >Settings</button>
    //     </DropdownMenuItem>
    //     <DropdownMenuItem>
    //       <button onClick={handleSignOut} >Sign Out</button>
    //     </DropdownMenuItem>
    //   </DropdownMenuContent>
    // </DropdownMenu>
    <div>
    {(user && user.photoURL === null) && <div className="w-10 h-10 lg:mr-10 sm:mr-5 bg-green-700 text-white flex justify-center items-center rounded-full text-xl">
      {firstLetter}
      </div>}
    {(user && user.photoURL != null) && <img className="w-10 h-10 lg:mr-10 sm:mr-5 bg-green-700 text-white flex justify-center items-center rounded-full text-xl" 
      src={user.photoURL}/>}
    </div>

  )
}

export default ProfileIcon;