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
  function handleSettings() {
    navigate('/settings');
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="w-10 h-10 lg:mr-10 sm:mr-5 bg-green-700 text-white flex justify-center items-center rounded-full text-xl">
          {firstLetter}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <button onClick={handleSettings} >Settings</button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <button onClick={handleSignOut} >Sign Out</button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileIcon;