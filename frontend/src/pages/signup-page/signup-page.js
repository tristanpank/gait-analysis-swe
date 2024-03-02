import React, {useState} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {createAccountEmailPassword} from '../../firebase/auth.js'
import Button from '../../components/ui/button/button.js'

const Signup = (props) => {
    const {setLoggedIn, email, setEmail, setUser} = props
    const navigate = useNavigate();
 
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [signUpError, setSignUpError] = useState('')
   
    const onSubmit = async (e) => {
        e.preventDefault()
        
        if (password != confirmPassword) {
            setSignUpError('Passwords do not match.')
        } else {
            const user = await createAccountEmailPassword(email, password)
            if (user.uid === undefined) {
                const error = user;
                if (error.code === 'auth/email-already-in-use') {
                    setSignUpError('An account already exists with this email, please log in.');
                } else if (error.code === 'auth/weak-password') {
                    setSignUpError('Password should be at least 6 characters.');
                } else {
                    setSignUpError('Error while creating account.');
                }
            } else {
                setSignUpError('')
                console.log(user)
                setUser(user);
                setLoggedIn(true);
                navigate('/dashboard');
            }
        }
   
    }

    function handleClick (e) {
        e.preventDefault()
        navigate('/login')
    }
 
  return (
        <div>                  
            <h1> Signup </h1>                                                                            
            <form data-testid="Signup Form">                                                                                            
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

                <div>
                    <label htmlFor="confirm-password">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        label="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required                                 
                        placeholder="Confirm password"              
                    />
                </div>

                <label>{signUpError}</label>
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