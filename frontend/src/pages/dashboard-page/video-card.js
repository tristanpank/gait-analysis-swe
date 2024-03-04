import React from 'react';
import { useNavigate } from 'react-router-dom';

const VideoCard = (props) => {
    const { path } = props
    const navigate = useNavigate();

    return (
        <div className="w-full md:w-auto h-auto md:mx-3 my-1 rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-zinc-900">
            <video controls width="250">
                <source src={path} type="video/mp4"></source>
            </video>
        </div>
    )
}
 
export default VideoCard