import React, {useState} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {createAccountEmailPassword} from '../../firebase/auth.js'
import Button from '../../components/ui/button/button.js'
import { SignupForm } from './signup-form.tsx';
import {BackgroundGradientAnimation } from '../../components/ui/background-gradient-animation.tsx';
import Header from "../../components/ui/header/header.js"

const Signup = (props) => {
    const {setLoggedIn, email, setEmail, setUser} = props
    // const navigate = useNavigate();
 
    // const [password, setPassword] = useState('');
    // const [confirmPassword, setConfirmPassword] = useState('');
    // const [signUpError, setSignUpError] = useState('')
   
    // const onSubmit = async (e) => {
    //     e.preventDefault()
        
    //     if (password != confirmPassword) {
    //         setSignUpError('Passwords do not match.')
    //     } else {
    //         const user = await createAccountEmailPassword(email, password)
    //         if (user.uid === undefined) {
    //             const error = user;
    //             if (error.code === 'auth/email-already-in-use') {
    //                 setSignUpError('An account already exists with this email, please log in.');
    //             } else if (error.code === 'auth/weak-password') {
    //                 setSignUpError('Password should be at least 6 characters.');
    //             } else {
    //                 setSignUpError('Error while creating account.');
    //             }
    //         } else {
    //             setSignUpError('')
    //             console.log(user)
    //             setUser(user);
    //             setLoggedIn(true);
    //             navigate('/dashboard');
    //         }
    //     }
   
    // }

    // function handleClick (e) {
    //     e.preventDefault()
    //     navigate('/login')
    // }
    return (
        <BackgroundGradientAnimation>
            <div class="override-styles">
                <div className="visible h-full w-full absolute z-10 inset-0 md:flex md:items-center md:justify-center text-white font-bold md:px-4">
                    <Header></Header>
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