import React from "react";
import { signOutUser } from "src/firebase/auth";
import { useNavigate } from "react-router-dom";


const ProfileIcon = (props) => {
  const { user, setUser, size } = props;
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

    <div>
    {(user && user.photoURL === null) && <div style={{ width: `${size}px`, height: `${size}px` }} className="lg:mr-10 sm:mr-5 bg-green-700 text-white flex justify-center items-center rounded-full text-xl">
      {firstLetter}
      </div>}
    {(user && user.photoURL != null) && <img style={{ width: `${size}px`, height: `${size}px` }} className="lg:mr-10 sm:mr-5 bg-green-700 text-white flex justify-center items-center rounded-full text-xl" 
      src={user.photoURL}/>}
    </div>

  )
}

export default ProfileIcon;