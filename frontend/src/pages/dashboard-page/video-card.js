import React from 'react';
import { getUserVideo} from '../../firebase/db.js'
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const VideoCard = (props) => {
    const { user, vid } = props
    const [path, setPath] = useState("");
    const videoRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVideo = async () => {
            const url = await getUserVideo(user, vid);
            setPath(url);
        };
        fetchVideo();
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
        </div>
    )
}
 
export default VideoCard