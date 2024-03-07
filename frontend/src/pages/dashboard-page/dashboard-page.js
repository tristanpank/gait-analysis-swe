import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import Header from "../../components/ui/header/header.js"
import Button from '../../components/ui/button/button.js'
import VideoCard from './video-card.js'
import { getAllVideos } from '../../firebase/db.js'
import Skeleton from '../../components/skeleton/skeleton.js'

const Dashboard = (props) => {
  const { user, setUser, email, loggedIn, setLoggedIn} = props
  const navigate = useNavigate()
  const [videoArray, setVideoArray] = useState([])

  function handleClick (e) {
    navigate('/upload');
  }

  useEffect(() => {
    getAllVideos(user).then((videosArray) => {
      // console.log(videosArray);
      setVideoArray(videosArray);
    })
  }, [user])
  
  const content = Array.isArray(videoArray) ? videoArray.map((vid, index) => (
    <div key={index}><VideoCard user={user} vid={vid}></VideoCard></div>
  )) : null;

  return (
    <div className=" bg-gradient-to-r from-[#5392b5] to-[#2b5981e3]">
      <Header user={user}></Header>
      <div className="pt-20">
        <Button text="Upload a video" handleClick={handleClick}></Button>
        <div>
          {content}
        </div>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
      </div>
    </div>
  )
}

export default Dashboard