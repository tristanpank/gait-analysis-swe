import React, { useState } from 'react'
import { LoginForm } from './login-form.tsx'

const Login = (props) => {
  const {setLoggedIn, email, setEmail, setUser} = props

  return (
    <LoginForm setLoggedIn={setLoggedIn} email={email} setEmail={setEmail} setUser={setUser}/>
  )
}

export default Login