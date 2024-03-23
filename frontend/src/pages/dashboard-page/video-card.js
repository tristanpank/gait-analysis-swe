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
  const diff = now - uploadTime;

  let timeText = "";
  if (diff < 60000) {
    timeText = "Just now";
  } else if (diff < 3600000) {
    timeText = `${Math.floor(diff / 60000)} minutes ago`;
  } else if (diff < 86400000) {
    timeText = `${Math.floor(diff / 3600000)} hours ago`;
  } else {
    timeText = `${Math.floor(diff / 86400000)} days ago`;
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
        <div onClick={() => {navigate(`./${vid}`)}} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="video-container px-3 p-2">
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