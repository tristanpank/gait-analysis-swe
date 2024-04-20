import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import Header from "../../components/ui/header/header.js"
import Button from '../../components/ui/button/button.js'
import VideoCard from './video-card.js'
import { getAllVideos } from '../../firebase/db.js'
import Skeleton from '../../components/skeleton/skeleton.js'
import { GlobalStateContext } from '../../components/react/GlobalStateProvider.js'

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
    <div className="bg-slate-100 min-h-screen">
      <Header user={user} setUser={setUser} color={false}></Header>
      <div className="mt-16 flex flex-row">
        <div className='flex justify-center px-3 md:px-0 md:w-[40rem] m-auto'>
          <div className='divide-y-[1px]'>
              {content}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard