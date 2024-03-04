import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import Header from "../../components/ui/header/header.js"
import Button from '../../components/ui/button/button.js'
import VideoCard from './video-card.js'
import { getAllVideos } from '../../firebase/db.js'

const Dashboard = (props) => {
  const { user, setUser, email, loggedIn, setLoggedIn} = props
  const navigate = useNavigate()
  const [videoArray, setVideoArray] = useState([])

  function handleClick (e) {
    navigate('/upload');
  }
  
  useEffect(() => {
    getAllVideos(user).then((videosArray) => {
      console.log(videosArray);
      setVideoArray(videosArray);
    })
  }, [])
  

  return (
    <div className="color-scheme: dark; bg-white dark:bg-black">
      <Header user={user}></Header>
      <div className="pt-20">
        <Button text="Upload a video" handleClick={handleClick}></Button>
        <div>
          {videoArray.map((vid, index) => (
            // Create a div for each element in the array
            // Using index as key is generally not recommended for dynamic lists, consider using a unique identifier
            
            <VideoCard user={user} vid={vid}></VideoCard>
          ))}
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