import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  //TODO Add handleClick Function for Button
  return (
    //TODO Add Button component that redirects to login page
    <div>
      <div>
      <button>Sign In/Sign Up</button>
      </div>
      <div>
      Gait Analysis for UF Athletes
      </div>
      <div>
      A platform that analyzes running form for student athletes at UF, 
      making the resources of expensive labs available for everyday runners
      </div>
    </div>
  )
}

export default Home