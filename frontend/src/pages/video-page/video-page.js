import React from 'react';
import { useParams } from 'react-router-dom';
import Header from 'src/components/ui/header/header';
import { getUserVideo, getVideoData, deleteVideo } from '../../firebase/db.js'
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'src/components/skeleton/skeleton';
import { getAllGraphs } from "../../firebase/db.js";
import { GlobalStateContext } from 'src/components/react/GlobalStateProvider.js';

function VideoPage(props) {
    const  { user } = props;
    const [path, setPath] = useState("");
    const [videoExists, setVideoExists] = useState(false);
    const [skeletonExists, setSkeletonExists] = useState(false);
    let { vid } = useParams();
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const [landmarks, setLandmarks] = useState([]);
    const [count, setCount] = useState(0);
    const [frames, setFrames] = useState(0);
    const [videoData, setvideoData] = useState(undefined);
    const [paused, setPaused] = useState(false);
    const [graphs, setGraphs] = useState({});
    const { videoUploaded, setVideoUploaded } = React.useContext(GlobalStateContext);
    
    useEffect(() => {
        const video = document.getElementById('video');
        

        if (video) {
            video.addEventListener('timeupdate', () => {
                setCount(Math.floor(video.currentTime * 30));
            });
            video.addEventListener('pause', () => { setPaused(true); }  );
            video.addEventListener('play', () => { setPaused(false); }  );
        }
    
        // Cleanup function
        return () => {
          if (video) {
            video.removeEventListener('timeupdate', () => {
                setCount(Math.floor(video.currentTime * 30));
            });
            video.removeEventListener('pause', () => { setPaused(true); }  );   
            video.removeEventListener('play', () => { setPaused(false); }  );
          }
        };
    }, [videoData]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!paused) {
                setCount(prevCount => {
                    if (prevCount >= frames - 1) {
                        return 0;
                    } else {
                        return prevCount + 1;
                    }
                });
            }
        }, 33);
    
        // Clear interval on component unmount
        return () => clearInterval(interval);
    }, [frames, paused]);
    
    useEffect(() => {
        if (vid === undefined) {
            setVideoExists(false);
            return;
        } else if (user.uid === undefined) {
            // navigate('/signup');
        } else {    
            const fetchVideo = async () => {
                const url = await getUserVideo(user, vid);
                setPath(url);
                setVideoExists(true)
            };
            fetchVideo();
            // const graphs = getAllGraphs(user, vid).then((graphs) => console.log(graphs));

            
            getVideoData(vid).then((videoData) => {
              const graphs = getAllGraphs(user, vid, videoData).then((graphs) => setGraphs(graphs));
              setvideoData(videoData)
            });
        }
        
    }, [user, vid]);

    useEffect(() => {
        const getPoseLandmarks = (videoData) => {
            if (videoData.pose_data.x.split(';')[count] === undefined) {
                return;
            }
            const x = videoData.pose_data.x.split(';')[count].split(',');
            const y = videoData.pose_data.y.split(';')[count].split(',');
            setLandmarks([x, y]);
            setFrames(videoData.pose_data.x.split(';').length);
            setSkeletonExists(true);
        }
        if (videoData !== undefined) {
            getPoseLandmarks(videoData);
        }
    }, [videoData, count]);



    useEffect(() => {
        if (videoRef.current) {
        videoRef.current.play().catch(error => console.error("Error attempting to play", error));
        setCount(0);
        }
    }, [path]);

  async function handleDelete(e) {
    e.preventDefault();
    const response = await deleteVideo(user, vid);
    if (response === true) {
      setVideoUploaded(true);
      navigate('/dashboard');
    }
  }  
  
  return (
    <div>
        <Header user={user}></Header>
        {videoExists && (
            <div>
                
                <video id='video' className="pt-20 w-11/12 m-auto" ref={videoRef} muted loop controls key={path}>
                    <source src={path} type="video/mp4"></source>
                </video>
                <button onClick={handleDelete}>Delete</button>
                {skeletonExists && (
                    <Skeleton landmarks={landmarks} graphs={graphs} ></Skeleton>
                )}
                
            </div>
        )}
        {!videoExists && (
            <h1>This Video doesn't exist</h1>
        )}
    </div>
  )
   
}

export default VideoPage;