import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import Header from "../../components/ui/header/header.js"
import Button from '../../components/ui/button/button.js'
import VideoCard from './video-card.js'
import { getAllVideos } from '../../firebase/db.js'
import Skeleton from '../../components/skeleton/skeleton.js'
import { GlobalStateContext } from '../../components/react/GlobalStateProvider.js'
import ProfileIcon from '../../components/ui/header/ProfileIcon.jsx'

const Dashboard = (props) => {
  const { user, setUser, email, loggedIn, setLoggedIn} = props
  const navigate = useNavigate()
  const [videoArray, setVideoArray] = useState([]);
  const { videoUploaded, setVideoUploaded } = React.useContext(GlobalStateContext);

  function handleClick (e) {
    navigate('/upload');
  }

  useEffect(() => {
    getAllVideos(user).then((videosArray) => {
      if (Array.isArray(videosArray)) {
        setVideoArray(videosArray.reverse());
        setVideoUploaded(false);
        console.log(videosArray);
        console.log(user)
      }
    })
  }, [user, videoUploaded])
  
  const content = Array.isArray(videoArray) && videoArray.length > 0 
    ? videoArray.map((vid, index) => (
      <div key={index} className="bg-white rounded-md my-2">
        <VideoCard user={user} vid={vid}></VideoCard>
      </div>
    )) 
    : <div className="my-2 text-center w-[40rem]">
        <h1 className="text-lg font-semibold"> You Haven't Uploaded Any Videos</h1>
      </div>;

  return (
      <div className="flex justify-center bg-slate-100 min-h-screen">
        <Header user={user} setUser={setUser} color={false}></Header>
        <div className="pt-16 flex space-x-20">
          <div className="content-center w-96 hidden xl:block">
            <div className='flex flex-col justify-center items-center text-wrap rounded-md bg-white p-5'>
              <div className="ml-10 flex justify-center">
                <ProfileIcon user={user} setUser={setUser} size={80}/>
              </div>
              <div className="text-center text-2xl font-semibold">
                {user.displayName}
              </div>
              <div className="text-center">
                Videos uploaded: {content.length}
              </div>
            </div>
          </div>
          <div className='flex justify-center px-3 md:px-0 md:w-[40rem] m-auto'>
            <div className='divide-y-[1px]'>
                {content}
            </div>
          </div>
          <div className="w-96 hidden xl:block rounded-md bg-white p-5">
            test
          </div>
        </div>
      </div>
  )
}

export default Dashboard