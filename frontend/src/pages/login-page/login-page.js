import React, { useEffect } from 'react'
import { LoginForm } from './login-form.tsx'
import {BackgroundGradientAnimation } from '../../components/ui/background-gradient-animation.tsx';
import Header from "../../components/ui/header/header.js"
import { useNavigate } from 'react-router-dom'

const Login = (props) => {
  const {setLoggedIn, email, setEmail, setUser, user} = props
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user.uid) {
      navigate('/dashboard');
    }
  }, [user])

  return (
    <BackgroundGradientAnimation>
      <div class="override-styles">
          <div className="visible h-full w-full absolute z-10 inset-0 md:flex md:items-center md:justify-center text-white font-bold md:px-4">
            <Header color={false}></Header>
            <div className='w-full md:w-2/5 md:w-[28rem] h-full md:h-auto' >              
            <LoginForm setLoggedIn={setLoggedIn} email={email} setEmail={setEmail} setUser={setUser}/>                   
            </div>
          </div>
      </div>  
    </BackgroundGradientAnimation>
    
  )
}

export default Login