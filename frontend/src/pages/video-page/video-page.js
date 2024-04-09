import React from 'react';
import { useParams } from 'react-router-dom';
import Header from 'src/components/ui/header/header';
import { getUserVideo, getVideoData, deleteVideo } from '../../firebase/db.js'
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'src/components/skeleton/skeleton';
import { getAllGraphs, getInjuryGraphs, getInjuryData } from "../../firebase/db.js";
import { GlobalStateContext } from 'src/components/react/GlobalStateProvider.js';
import DeleteButton from './DeleteButton.jsx';
import InjuryDisplay from './InjuryDisplay.jsx';
import AngleDisplay from './AngleDisplay.jsx';
import { Accordion } from '@mui/material';
import { AccordionDetails } from '@mui/material';
import { AccordionSummary } from '@mui/material';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function VideoPage(props) {
    const { user, setUser } = props;
    const [videoPath, setVideoPath] = useState("");
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
    const [injuryData, setInjuryData] = useState({});
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
                const videoUrl = await getUserVideo(user, vid);
                setVideoPath(videoUrl);
                setVideoExists(true)
            };
            fetchVideo();
            // const graphs = getAllGraphs(user, vid).then((graphs) => console.log(graphs));

            
            getVideoData(user, vid).then((videoData) => {
              console.log("test rerender");
              const graphs = getAllGraphs(user, vid, videoData).then((graphs) => setGraphs(graphs));
            //   const injuryGraphs = getInjuryGraphs(user, vid, videoData).then((injuryGraphs) => setInjuryGraphs(injuryGraphs));
              setvideoData(videoData)
              getInjuryData(user, vid).then((injuryData) => {
                console.log(injuryData);
                setInjuryData(injuryData);
              });
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
    }, [videoPath]);

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
            <Header user={user} setUser={setUser} ></Header>
            {videoExists && (
                <div>

                    <video id='video' className="pt-20 w-11/12 m-auto" ref={videoRef} muted loop controls key={videoPath}>
                        <source src={videoPath} type="video/mp4"></source>
                    </video>
                    <DeleteButton user={user} vid={vid} />
                    {/* {skeletonExists && (
                        <Skeleton landmarks={landmarks} graphs={graphs} ></Skeleton>
                    )} */}
                    <AngleDisplay graphs={graphs} />
                    <div className='grid grid-cols-2'>
                        <div className='flex flex-col'>
                            <InjuryDisplay injuryData={injuryData} />
                        </div>
                    </div>

                </div>

            )}
            {!videoExists && (
                <h1>This Video doesn't exist</h1>
            )}
        </div>
    )

}

export default VideoPage;