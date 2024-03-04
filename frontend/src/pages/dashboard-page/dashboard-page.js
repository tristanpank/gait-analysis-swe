import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import Header from "../../components/ui/header/header.js"
import Button from '../../components/ui/button/button.js'
import VideoCard from './video-card.js'
import { getAllVideos } from '../../firebase/db.js'
import Skeleton from '../../components/skeleton/skeleton.js'

const Dashboard = (props) => {
  const { user, setUser, email, loggedIn, setLoggedIn} = props
  const navigate = useNavigate()
  const [videoArray, setVideoArray] = useState([])

  function handleClick (e) {
    navigate('/upload');
  }

  useEffect(() => {
    getAllVideos(user).then((videosArray) => {
      console.log(videosArray);
      setVideoArray(videosArray);
    })
  }, [])
  
  const content = Array.isArray(videoArray) ? videoArray.map((vid, index) => (
    <div key={index}><VideoCard user={user} vid={vid}></VideoCard></div>
  )) : null;

  const landmarks = [{'x': 0.4701109528541565, 'y': 0.17889484763145447},
  {'x': 0.47686585783958435, 'y': 0.16253894567489624},
  {'x': 0.4806632101535797, 'y': 0.16345590353012085},
  {'x': 0.4838244318962097, 'y': 0.1638495922088623},
  {'x': 0.4655856490135193, 'y': 0.16256368160247803},
  {'x': 0.46256741881370544, 'y': 0.16289988160133362},
  {'x': 0.45923978090286255, 'y': 0.16327673196792603},
  {'x': 0.4896169602870941, 'y': 0.1724901795387268},
  {'x': 0.45538321137428284, 'y': 0.1704961657524109},
  {'x': 0.4765562117099762, 'y': 0.1982080191373825},
  {'x': 0.4652791917324066, 'y': 0.19546976685523987},
  {'x': 0.5223994851112366, 'y': 0.28365013003349304},
  {'x': 0.4271388053894043, 'y': 0.28307971358299255},
  {'x': 0.5542727708816528, 'y': 0.40150630474090576},
  {'x': 0.4136073589324951, 'y': 0.40824568271636963},
  {'x': 0.5127837061882019, 'y': 0.4318790137767792},
  {'x': 0.4291068911552429, 'y': 0.4333447217941284},
  {'x': 0.49588364362716675, 'y': 0.4511815905570984},
  {'x': 0.43664008378982544, 'y': 0.4480941891670227},
  {'x': 0.49448472261428833, 'y': 0.42733314633369446},
  {'x': 0.43914851546287537, 'y': 0.42713016271591187},
  {'x': 0.4980829358100891, 'y': 0.42100653052330017},
  {'x': 0.4384918808937073, 'y': 0.421157568693161},
  {'x': 0.497996985912323, 'y': 0.5383824706077576},
  {'x': 0.44846320152282715, 'y': 0.5363181829452515},
  {'x': 0.507649838924408, 'y': 0.7201311588287354},
  {'x': 0.45906537771224976, 'y': 0.7271198630332947},
  {'x': 0.5084192156791687, 'y': 0.7621611952781677},
  {'x': 0.46909308433532715, 'y': 0.8995867967605591},
  {'x': 0.5070658922195435, 'y': 0.7562595009803772},
  {'x': 0.47729945182800293, 'y': 0.9196319580078125},
  {'x': 0.507419228553772, 'y': 0.8333765864372253},
  {'x': 0.4592525064945221, 'y': 0.9562844038009644}];
  return (
    <div className="color-scheme: dark; bg-white dark:bg-black">
      <Header user={user}></Header>
      <div className="pt-20">
        <Button text="Upload a video" handleClick={handleClick}></Button>
        <div>
          {content}
        </div>
        <Skeleton landmarks={landmarks}></Skeleton>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
        <h2>This is the Dashboard!</h2>
      </div>
    </div>
  )
}

export default Dashboard