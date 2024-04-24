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
import BasicData from './BasicData.jsx';

function VideoPage(props) {
    const { user, setUser } = props;
    const [videoPath, setVideoPath] = useState("");
    const [videoExists, setVideoExists] = useState(false);
    let { vid } = useParams();
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const [videoData, setvideoData] = useState(undefined);
    const [graphs, setGraphs] = useState({});
    const [injuryData, setInjuryData] = useState({});
    const { videoUploaded, setVideoUploaded } = React.useContext(GlobalStateContext);
    
    // Used to retrieve the video data and graphs for the video on load
    useEffect(() => {
        if (vid === undefined) {
            setVideoExists(false);
            return;
        } else if (user.uid === undefined) {
            navigate('/signup');
        } else {    
            const fetchVideo = async () => {
                const videoUrl = await getUserVideo(user, vid);
                setVideoPath(videoUrl);
                setVideoExists(true)
            };
            fetchVideo();
            getVideoData(user, vid).then((videoData) => {
              const graphs = getAllGraphs(user, vid, videoData).then((graphs) => setGraphs(graphs));
              setvideoData(videoData)
              getInjuryData(user, vid).then((injuryData) => {
                setInjuryData(injuryData);
              });
            });
        }
        
    }, [user, vid]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => console.error("Error attempting to play", error));
        }
    }, [videoPath]);
    
    // If the video exists, displays the video along with the Data components
    return (
        <div>
            <Header user={user} setUser={setUser} ></Header>
            {videoExists && (
                <div className='flex flex-col items-center mt-16 pt-5 bg-slate-100 min-h-screen gap-5'>
                    <div className='md:flex flex-row justify-center'>
                        <video id='video' className="md:max-w-[40rem] m-auto" ref={videoRef} muted loop controls key={videoPath}>
                            <source src={videoPath} type="video/mp4"></source>
                        </video>
                        <div className='flex flex-col'>
                            <BasicData videoData={videoData} />
                            <div className='p-5'>
                                <DeleteButton user={user} vid={vid} />
                            </div>
                        </div>
                    </div>
                    <InjuryDisplay injuryData={injuryData} videoData={videoData}/>
                    <AngleDisplay graphs={graphs} />
                </div>

            )}
            {!videoExists && (
                <h1>This Video doesn't exist</h1>
            )}
        </div>
    )

}

export default VideoPage;