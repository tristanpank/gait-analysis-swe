import React from 'react';
import { getUserVideo, getVideoData} from '../../firebase/db.js'
import { useState, useEffect, useRef } from 'react';
import { Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';


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

const VideoCard = (props) => {
    const { user, vid } = props
    const [path, setPath] = useState("");
    const [videoData, setVideoData] = useState({});
    const videoRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVideo = async () => {
            const url = await getUserVideo(user, vid);
            setPath(url);
        };
        if (user){
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


    return (
        <div onClick={() => {navigate(`./${vid}`)}} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} 
          className="px-3 p-2 flex flex-col items-center">
            <video muted loop ref={videoRef} key={path} className='object-cover max-w-[50%] max-h-[15%] rounded-xl'>
                <source src={path} type="video/mp4"></source>
            </video>
            <div>
              {(videoData) && calculateTimeText(videoData.timestamp)}
            </div>
        </div>
    )
}
 
export default VideoCard