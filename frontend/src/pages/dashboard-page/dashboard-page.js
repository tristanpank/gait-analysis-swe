import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from "../../components/ui/header/header.js"
import Button from '../../components/ui/button/button.js'
import VideoCard from './video-card.js'

const Dashboard = (props) => {
  const { user, setUser, email, loggedIn, setLoggedIn} = props
  const navigate = useNavigate()

  function handleClick (e) {
    navigate('/upload')
  }


  return (
    <div className="color-scheme: dark; bg-white dark:bg-black">
      <Header user={user}></Header>
      <div className="pt-20">
        <Button text="Upload a video" onClick={handleClick}></Button>
        <VideoCard></VideoCard>
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