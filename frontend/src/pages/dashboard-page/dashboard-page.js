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
  const [nameCard, setNameCard] = useState(user.displayName);
  const { videoUploaded, setVideoUploaded } = React.useContext(GlobalStateContext);

  // Gets all videos for a user on page load or when a video is finished uploading. 
  useEffect(() => {
    getAllVideos(user).then((videosArray) => {
      if (Array.isArray(videosArray)) {
        setVideoArray(videosArray.reverse());
        setVideoUploaded(false);
      }
    })
  }, [user, videoUploaded])

  // Gets the user's height on page load and when height changes
  useEffect(() => {
    getUserHeight(user).then((totalHeight) => {
      if (Number.isInteger(totalHeight)) {
        setTotalHeight(totalHeight);
        setInches(totalHeight % 12);
        setFeet(Math.floor(totalHeight / 12));
    }});
  }, [user, inches, feet])
  
  // Maps each video to a VideoCard component
  // Displays message if no videos are uploaded
  const content = Array.isArray(videoArray) && videoArray.length > 0 
    ? videoArray.map((vid, index) => (
      <div key={index} className="bg-white rounded-md my-2">
        <VideoCard user={user} vid={vid}></VideoCard>
      </div>
    )) 
    : <div className="my-2 text-center w-[40rem]">
        <h1 className="text-lg font-semibold"> You Haven't Uploaded Any Videos</h1>
      </div>;

  // Displays the Videos in a feed formData
  // Has messages on the sides that explain the dashboard and basic user info. 
  return (
      <div className="flex justify-center bg-slate-100 h-screen">
        <Header user={user} setUser={setUser} color={false} setInches={setInches} setFeet={setFeet} setNameCard={setNameCard}></Header>
        <div className="overflow-auto mt-16 flex w-screen">
          <div>
            <div className="overflow-hidden content-center max-w-96 w-1/4 hidden xl:block absolute left-10 top-1/4">
              <div className='flex flex-col items-center text-wrap rounded-md bg-white p-5 mr-20'>
                <div className="flex justify-center">
                  <ProfileIcon user={user} setUser={setUser} size={80}/>
                </div>
                <div className="text-center text-2xl font-semibold">
                  {nameCard}
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
            <div className="overflow-hidden content-center max-w-96 w-1/4 hidden xl:block absolute left-10 top-1/2">
              <div className='flex flex-col items-center text-pretty rounded-md bg-white p-5 mr-20'>
                <div className='font-semibold text-lg w-full mb-3'>
                  Dashboard
                </div>
                <div>
                  Here you can see a summary of your analyzed running <span className='text-blue-600 font-semibold'>videos</span>. 
                  These can be used to improve your <span className='text-blue-600 font-semibold'>performance</span> and reduce your risk of injury. 
                  Click the <span className='text-blue-600 font-semibold'>More Insights</span> button on a video to learn more about your running form.
                </div>
              </div>
            </div>
          </div>
          <div className='h-full flex justify-center px-3 md:px-0 md:w-[40rem] m-auto'>
            <div className='divide-y-[1px]'>
                {content}
            </div>
          </div>
          <div className="overflow-hidden content-center w-1/4 max-w-96 hidden xl:block absolute right-16 top-24">
            <div className='flex flex-col items-center text-wrap rounded-md bg-white p-5 ml-20'>
              <div className='font-semibold text-xl w-full mb-5'>
                Common Sources of Injury
              </div>
              <div className='font-semibold text-lg w-full'>
                Cadence
              </div>
              <div className='w-full mb-3'>
                An inefficient cadence, or stride rate, while running can lead to injuries by increasing the strain on muscles, tendons, and joints. 
                A low cadence may result in overstriding, where the foot lands too far in front of the body, causing excessive braking forces and placing stress on the knees and hips. 
                A runner should aim to keep their cadence in the range of 170-190 steps per minute.
              </div>
              <div className='font-semibold text-lg w-full'>
                Leg Crossover
              </div>
              <div className='w-full mb-3'>
                Leg crossover while running, where one leg crosses over the midline of the body during the stride, can lead to injuries by causing biomechanical imbalances and inefficient movement patterns. 
                This can increase the risk of strain on muscles and connective tissues, particularly in the hips, knees, and ankles, potentially leading to issues such as IT band syndrome, knee pain, or hip impingement. 
                Correcting leg crossover through proper form and strengthening exercises can help reduce the risk of these injuries and improve running efficiency.
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Dashboard