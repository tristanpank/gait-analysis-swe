import React from 'react';
import { getUserVideo} from '../../firebase/db.js'
import { useState, useEffect } from 'react';

const VideoCard = (props) => {
    const { user, vid } = props
    const [path, setPath] = useState("");

    useEffect(() => {
        getUserVideo(user, vid).then((url) => setPath(url));
    }, [])

    return (
        <div className="w-full md:w-auto h-auto md:mx-3 my-1 rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-zinc-900">
            <video controls width="250" key={path}>
                <source src={path} type="video/mp4"></source>
            </video>
        </div>
    )
}
 
export default VideoCard