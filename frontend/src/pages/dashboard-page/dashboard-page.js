import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import Header from "../../components/ui/header/header.js"
import Button from '../../components/ui/button/button.js'
import VideoCard from './video-card.js'
import { getAllVideos } from '../../firebase/db.js'
import Skeleton from '../../components/skeleton/skeleton.js'
import { GlobalStateContext } from '../../components/react/GlobalStateProvider.js'
import ProfileIcon from '../../components/ui/header/ProfileIcon.jsx'
import { getUserHeight } from '../../firebase/db.js'

const Dashboard = (props) => {
  const { user, setUser, email, loggedIn, setLoggedIn} = props
  const navigate = useNavigate()
  const [videoArray, setVideoArray] = useState([]);
  const [totalHeight, setTotalHeight] = useState(null);
  const [inches, setInches] = useState(null);
  const [feet, setFeet] = useState(null);
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

  useEffect(() => {
    getUserHeight(user).then((totalHeight) => {
      if (Number.isInteger(totalHeight)) {
        setTotalHeight(totalHeight);
        console.log(totalHeight);
        setInches(totalHeight % 12);
        setFeet(Math.floor(totalHeight / 12));
    }});
  }, [user, inches, feet])
  
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
      <div className="flex justify-center bg-slate-100 h-screen">
        <Header user={user} setUser={setUser} color={false} setInches={setInches} setFeet={setFeet}></Header>
        <div className="overflow-auto mt-16 flex w-screen">
          <div className="overflow-hidden content-center max-w-96 w-1/4 hidden xl:block absolute left-16 top-96">
            <div className='flex flex-col items-center text-wrap rounded-md bg-white p-5 mr-20'>
              <div className="flex justify-center">
                <ProfileIcon user={user} setUser={setUser} size={80}/>
              </div>
              <div className="text-center text-2xl font-semibold">
                {user.displayName}
              </div>
              {Number.isInteger(totalHeight) &&
                <div className="text-center">
                  Height: {feet}' {inches}"
                </div>
              }
              <div className="text-center">
                Videos uploaded: {content.length}
              </div>
            </div>
          </div>
          <div className='h-full flex justify-center px-3 md:px-0 md:w-[40rem] m-auto'>
            <div className='divide-y-[1px]'>
                {content}
            </div>
          </div>
          <div className="overflow-hidden content-center w-1/4 max-w-96 hidden xl:block absolute right-16 top-96">
            <div className='flex flex-col items-center text-wrap rounded-md bg-white p-5 ml-20'>
              <div className="flex justify-center">
                <ProfileIcon user={user} setUser={setUser} size={80}/>
              </div>
              <div className="text-center text-2xl font-semibold">
                {user.displayName}
              </div>
              {Number.isInteger(totalHeight) &&
                <div className="text-center">
                  Height: {feet}' {inches}"
                </div>
              }
              <div className="text-center">
                Videos uploaded: {content.length}
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Dashboard