"use client";
import React, {useState} from "react";
import { Label } from "../../components/ui/label.tsx";
import { Input } from "../../components/ui/input.tsx";
import { cn } from "../../utils/cn.ts";
import {
  IconBrandGithub,
  IconBrandGoogle
} from "@tabler/icons-react";
import { NavLink, useNavigate } from 'react-router-dom';
import {createAccountEmailPassword, signInWithGoogle} from '../../firebase/auth.js'



export function SignupForm(props) {
  const {setLoggedIn, email, setEmail, setUser} = props
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signUpError, setSignUpError] = useState('')
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault()
    console.log("Form submitted");
    
    if (password != confirmPassword) {
        setSignUpError('Passwords do not match.')
    } else if (password == ''){
        setSignUpError('Please provide a password.')
    } else if (confirmPassword == ''){
        setSignUpError('Please confirm your password.')
    } else if (firstName == '' || lastName == ''){
        setSignUpError('First or last name is missing.')
    } else if (firstName.length > 100 || lastName.length > 100){
        setSignUpError('First or last name is too long.')
    } else {
        const displayName = firstName + ' ' + lastName;
        const user = await createAccountEmailPassword(email, password, displayName)
        if (user.uid === undefined) {
            const error = user;
            console.log(error);
            if (error.code === 'auth/email-already-in-use') {
                setSignUpError('An account already exists with this email, please log in.');
            } else if (error.code === 'auth/weak-password') {
                setSignUpError('Password should be at least 6 characters.');
            } else if (error.code === 'auth/invalid-email'){
                setSignUpError('Please provide a valid email address.')
            } else {
                setSignUpError('Error while creating account.');
            }
        } else {
            setSignUpError('')
            setUser(user);
            setLoggedIn(true);
            navigate('/dashboard');
        }
    }

}

  const navigate = useNavigate();

  function handleClick (e) {
    navigate('/login')
  }
  function handleSetEmail (e) {
    setEmail(e.target.value)
  }
  function handleSetFirstName (e) {
    setFirstName(e.target.value)
  }
  function handleSetLastName (e) {
    setLastName(e.target.value)
  }
  function handleSetPassword (e) {
    setPassword(e.target.value)
  }
  function handleSetConfirmPassword (e) {
    setConfirmPassword(e.target.value)
  }
  async function handleGoogleClick(e) {
    e.preventDefault();
    const user = await signInWithGoogle();
    if (user.uid === undefined) {
      return
    }
    setUser(user);
    setLoggedIn(true);
    navigate('/dashboard')
  }
  return (
    <div data-testid="Signup Form" className="md:max-w-md h-full md:h-auto w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to Gait Analysis
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Already have an account? <a className="text-blue-500 hover:text-blue-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" onClick={handleClick} >Login</a>
      </p>

      <form className="my-8" onSubmit={onSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstname">First name</Label>
            <Input id="firstname" placeholder="Eliud" type="text" onChange={handleSetFirstName} />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Last name</Label>
            <Input id="lastname" placeholder="Kipchoge" type="text" onChange={handleSetLastName} />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="projectmayhem@fc.com" type="email" onChange={handleSetEmail}/>
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" onChange={handleSetPassword}/>
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="confirmpassword">Confirm Password</Label>
          <Input id="confirmpassword" placeholder="••••••••" type="password" onChange={handleSetConfirmPassword}/>
          <Label className="text-sm font-medium text-red-700 dark:text-red-400 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="signuperror">{signUpError}</Label>
        </LabelInputContainer>
        

        <button
          className="bg-gradient-to-br font-bold text-xl relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Sign up &rarr;
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <div className="flex flex-col space-y-4">
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
          >
            <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              GitHub
            </span>
            <BottomGradient />
          </button>
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
            onClick={handleGoogleClick}
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Google
            </span>
            <BottomGradient />
          </button>

        </div>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
