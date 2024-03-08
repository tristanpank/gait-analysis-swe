import React from 'react'
import { useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import homebutton from '../../components/home-page-comp/homebutton.js'
import Header from "../../components/ui/header/header.js"

const Home = () => {
  const navigate = useNavigate()

  document.body.style.backgroundColor = "white";

  //TODO Add handleClick Function for Button
  return (
    //TODO Add Button component that redirects to login page
    <div>
      <Header></Header>
      <div style={{color: 'black', fontSize: '50px', marginTop: '175px', textAlign: 'center'}}>
        UF Gait Analysis
      </div>
      <div style={{color: 'black', fontSize: '20px', marginTop: '20px', textAlign: 'center'}}>
      A platform that analyzes running form for student athletes at UF, 
      making the resources of expensive labs available for everyday runners
      </div>
      <div class="button" style={{display: 'flex', justifyContent: 'center', alignItems: 'center',
    marginTop: '30px'}}>
        <button onClick={() => navigate("/login")} 
        style={{backgroundColor: 'rgb(6, 95, 212)', color: 'white', borderWidth: '3px', borderRadius: '18px', textAlign: 'center',
      fontSize: '25px', paddingLeft: '18px', paddingRight: '18px', paddingTop: '7px', paddingBottom: '10px',
      borderStyle: 'solid'}}>login</button>
      </div>
      <homebutton></homebutton>
    </div>
  )
}

export default Home