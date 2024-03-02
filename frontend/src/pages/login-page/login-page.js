import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/button/button.js'

const Login = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const navigate = useNavigate()

  function handleClick (e) {
    e.preventDefault()
    navigate('/signup')
}

  return (
    <div>
      <div>
        <div>Login</div>
      </div>
      <p>
          Don't have an account?{' '}
          <Button text={'Sign Up'} handleClick={handleClick}></Button>
      </p> 
    </div>
  )
}

export default Login