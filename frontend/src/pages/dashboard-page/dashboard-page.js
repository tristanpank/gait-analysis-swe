import React from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = (props) => {
  const { user, setUser, email, loggedIn, setLoggedIn} = props
  const navigate = useNavigate()


  return (
    <div>
      This is the Dashboard!
    </div>
  )
}

export default Dashboard