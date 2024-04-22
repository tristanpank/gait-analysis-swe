import React from 'react';
import { getUserVideo, getVideoData, getUserVideoThumbnail } from '../../firebase/db.js'
import { useState, useEffect, useRef } from 'react';
import { Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Button } from "../../shadcn/components/ui/button.jsx";


function calculateTimeText(time) {
  if (!time) {
    return "";
  }
  const now = Timestamp.now().toMillis();
  const uploadTime = time.seconds * 1000 + time.nanoseconds / 1000000;

  const nowDate = new Date(now);
  const uploadDate = new Date(uploadTime);
 
  const uploadDay = uploadDate.getDate();
  const uploadMonth = uploadDate.getMonth();
  const uploadYear = uploadDate.getFullYear();

  const nowDay = nowDate.getDate();
  const nowMonth = nowDate.getMonth();
  const nowYear = nowDate.getFullYear();

  let timeText = "";
  if (uploadDay === nowDay && uploadMonth === nowMonth && uploadYear === nowYear) {
    timeText = `Today at ${uploadDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
  }
  else if (uploadDay === nowDay - 1 && uploadMonth === nowMonth && uploadYear === nowYear) {
    timeText = `Yesterday at ${uploadDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
  }
  else {
    timeText = `${uploadDate.toLocaleDateString()} at ${uploadDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
  }
  return timeText;

}

function calculatePaceText(time) {
  if (!time) {
    return "";
  }

  const minutes = Math.floor(time);
  const seconds = Math.round((time - minutes) * 60);

  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}


const VideoCard = (props) => {
    const { user, vid } = props
    const [path, setPath] = useState("");
    const [videoData, setVideoData] = useState({});
    const videoRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
      if (user.uid) {
        console.log(user)
        const fetchVideo = async () => {
            console.log("url updated")
            const url = await getUserVideoThumbnail(user, vid);
            setPath(url);
        };
        fetchVideo();
        getVideoData(user, vid).then((data) => {
            setVideoData(data);
            console.log(data);
        }).catch((error) => {
            console.error(error);
        });
      };
    }, [user, vid]);

    const handleMouseEnter = async () => {
        if (videoRef.current) {
            try {
                await videoRef.current.play();
            } catch (error) {
                console.error('Error trying to play the video:', error);
            }
        }
    };

    const handleMouseLeave = () => {
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };

    if (!videoData.view) {
      console.log("test");
      return (
        <div></div>
      )
    } else {
      return (
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} 
          className="p-3 flex flex-col">
            <div className="flex flex-row">
              <div>
                <h1 className="text-lg font-semibold">{videoData.view.charAt(0).toUpperCase() + videoData.view.slice(1)} Video</h1>
                <div className='text-sm text-slate-500'>
                  {(videoData) && calculateTimeText(videoData.timestamp)}
                  {(videoData.cadence) && <div>Cadence: {Math.round(videoData.cadence)} spm</div>}
                  {(videoData.pace) && <div>Pace: {calculatePaceText(videoData.pace)}</div>}
                  {(videoData.stride_length) && <div>Stride Length: {videoData.stride_length.toFixed(2)}</div>}
                </div>
              </div>
              <img src={path} alt='user-video' className='w-[50%] mx-auto rounded-sm'></img>
            </div>
            <Button variant="outline" size="default" className="bg-blue-300 hover:bg-blue-500 mt-3 text-md" onClick={() => {navigate(`./${vid}`)}}>More Insights</Button>
        </div>
    )
    }
    
}
 
export default VideoCard