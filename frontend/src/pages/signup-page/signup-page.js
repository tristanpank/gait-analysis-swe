import React, {useState} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {createAccountEmailPassword} from '../../firebase/auth.js'
import Button from '../../components/ui/button/button.js'

const Signup = () => {
    const navigate = useNavigate();
 
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
 
    const onSubmit = async (e) => {
      e.preventDefault()
     
      await createAccountEmailPassword(email, password)
        .then((user) => {
            console.log(user);
            navigate("/")
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            // ..
        });
 
   
    }

    function handleClick (e) {
        e.preventDefault()
        navigate('/login')
    }
 
  return (
        <div>                  
            <h1> Signup </h1>                                                                            
            <form>                                                                                            
                <div>
                    <label htmlFor="email-address">
                        Email address
                    </label>
                    <input
                        type="email"
                        label="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}  
                        required                                    
                        placeholder="Email address"                                
                    />
                </div>

                <div>
                    <label htmlFor="password">
                        Password
                    </label>
                    <input
                        type="password"
                        label="Create password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        required                                 
                        placeholder="Password"              
                    />
                </div>                                             
                
                <button
                    type="submit" 
                    onClick={onSubmit}                        
                >  
                    Sign up                                
                </button>
                                                                
            </form>
            <p>
                Already have an account?{' '}
                <Button text={'Log In'} handleClick={handleClick}></Button>
            </p>                   
        </div>
  )
}
 
export default Signup