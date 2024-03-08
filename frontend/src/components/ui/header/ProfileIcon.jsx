import React from "react";

const ProfileIcon = (props) => {
  const { user } = props;
  const firstLetter = user.displayName ? user.displayName.charAt(0).toUpperCase() : "U";

  return (
    <div className="w-10 h-10 lg:mr-10 sm:mr-5 bg-green-700 text-white flex justify-center items-center rounded-full text-xl">
      {firstLetter}
    </div>
  )
}

export default ProfileIcon;