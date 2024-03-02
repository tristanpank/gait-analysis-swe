import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = (props) => {
  const { loggedIn, email } = props
  const navigate = useNavigate()

  const onButtonClick = () => {
    // You'll update this function later
  }

  return (
    <div>
      <div class="top">
      <button class="si-button">Sign In/Sign Up</button>
      </div>
      <div class="web-name">
      Gait Analysis for UF Athletes
      </div>
      <div class="description">
      A platform that analyzes running form for student athletes at UF, 
      making the resources of expensive labs available for everyday runners
      </div>
    </div>
  )
}

export default Home