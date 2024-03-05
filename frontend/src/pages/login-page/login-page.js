import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/button/button.js'
import { signInEmailPassword } from '../../firebase/auth.js';
import { LoginForm } from './login-form.tsx'

const Login = (props) => {
  const {setLoggedIn, email, setEmail, setUser} = props

  return (
    <LoginForm setLoggedIn={setLoggedIn} email={email} setEmail={setEmail} setUser={setUser}/>
    // <div>
    //   <form onSubmit={onSubmit} data-testid="Login Form">                                                                                            
    //       <div>
    //           <label>
    //               Email address
    //           </label>
    //           <input
    //               type="email"
    //               label="Email address"
    //               value={email}
    //               onChange={(e) => setEmail(e.target.value)}  
    //               required                                    
    //               placeholder="Email address"                                
    //           />
    //       </div>
    //       <div>
    //           <label htmlFor="password">
    //               Password
    //           </label>
    //           <input
    //               type="password"
    //               label="Create password"
    //               value={password}
    //               onChange={(e) => setPassword(e.target.value)} 
    //               required                                 
    //               placeholder="Password"              
    //           />
    //       </div>
    //       <label>{signInError}</label>       
    //       <button type="submit">  
    //           Log In                                
    //       </button>
                                                          
    //   </form>
    //   <p>
    //       Don't have an account?{' '}
    //       <Button text={'Sign Up'} handleClick={handleClick}></Button>
    //   </p> 
    //   </div>
  )
}

export default Login