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