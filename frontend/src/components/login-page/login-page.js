import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';

const Login = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const navigate = useNavigate()

  const onButtonClick = () => {
    // You'll update this function later...
  }

  return (
    <div>
      <div>
        <div>Login</div>
      </div>
      <p>
          Don't have an account?{' '}
          <NavLink to="/signup" >
              Sign Up
          </NavLink>
      </p> 
    </div>
  )
}

export default Login