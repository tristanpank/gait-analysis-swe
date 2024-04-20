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
  
  const content = Array.isArray(videoArray) ? videoArray.map((vid, index) => (
    <div key={index} className="bg-white rounded-md my-2">
      <VideoCard user={user} vid={vid}></VideoCard>
    </div>
  )) : null;

  return (
    <div className="bg-slate-100 min-h-screen">
      <Header user={user} setUser={setUser} color={true}></Header>
      <div className="mt-15 pt-20">
        {/* <button className="w-full h-20" onClick={handleClick}>
          <div className='mx-5 py-7 h-full border'>Upload a video</div>
        </button> */}
        <div className='flex justify-center md:w-[40%] m-auto'>
          <div className='divide-y-[1px]'>
              {content}
          </div>
          {/* <div className="hidden md:block w-0 bg-white md:my-5 md:p-5 md:w-full text-black">Heyyy</div> */}
        </div>
        
        
      </div>
    </div>
  )
}

export default Dashboard