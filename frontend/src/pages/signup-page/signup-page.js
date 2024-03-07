import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignupForm } from './signup-form.tsx';
import {BackgroundGradientAnimation } from '../../components/ui/background-gradient-animation.tsx';
import Header from "../../components/ui/header/header.js"


const Signup = (props) => {
    const {setLoggedIn, email, setEmail, setUser, user} = props

    const navigate = useNavigate();
  
    useEffect(() => {
        if (user) {
        navigate('/dashboard');
        }
    }, [user])

    return (
        <BackgroundGradientAnimation>
            <div class="override-styles">
                <div className="visible h-full w-full absolute z-10 inset-0 md:flex md:items-center md:justify-center text-white font-bold md:px-4">
                    <Header color={false}></Header>
                    <div data-testid="Signup Page" className='mt-16 h-full md:h-auto' >                  
                        <SignupForm setLoggedIn={setLoggedIn} email={email} setEmail={setEmail} setUser={setUser}></SignupForm>                   
                    </div>
                </div>
            </div>  
        </BackgroundGradientAnimation>
      );
  return (
        <div data-testid="Signup Page">                  
            <h1> Signup </h1>                                                                            
            <SignupForm setLoggedIn={setLoggedIn} email={email} setEmail={setEmail} setUser={setUser}></SignupForm>                   
        </div>
  )
}
 
export default Signup