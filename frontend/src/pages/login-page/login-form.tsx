import React, {useState} from "react";
import { useNavigate } from 'react-router-dom';
import { signInEmailPassword } from '../../firebase/auth.js';
import { Label } from "../../components/ui/label.tsx";
import { Input } from "../../components/ui/input.tsx";
import { cn } from "../../utils/cn.ts";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { signInWithGoogle } from '../../firebase/auth.js'


export function LoginForm(props) {
    const {setLoggedIn, email, setEmail, setUser} = props
    const [password, setPassword] = useState('')
    const [loginError, setLoginError] = useState('')
  
    const navigate = useNavigate()
  
    const onSubmit = async (e) => {
      e.preventDefault()
  
      const user = await signInEmailPassword(email, password);
  
      if (user.uid === undefined) {
        const error = user;
        setLoginError('Email and Password may not be correct, please try again.');
      } else {
        setLoginError('')
        setUser(user);
        setLoggedIn(true);
        navigate('/dashboard');
      }
    };
  
    function handleClick (e) {
      e.preventDefault()
      navigate('/signup')
    }
    function handleSetEmail (e) {
        setEmail(e.target.value)
    }
    function handleSetPassword (e) {
        setPassword(e.target.value)
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
        <div data-testid="Login Form" className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
            <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
            Log In
            </h2>
            <p className="text-neutral-600 text-sm font-bold max-w-sm mt-2 dark:text-neutral-300">
            Don't have an account? <a className="text-blue-500 hover:text-blue-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" onClick={handleClick} >Sign Up</a>
            </p>

            <form className="my-8" onSubmit={onSubmit}>
            <LabelInputContainer className="mb-4">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" placeholder="projectmayhem@fc.com" type="email" onChange={handleSetEmail}/>
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
                <Label htmlFor="password">Password</Label>
                <Input id="password" placeholder="••••••••" type="password" onChange={handleSetPassword}/>
            </LabelInputContainer>
            <Label className="text-sm font-medium text-red-700 dark:text-red-400 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="loginerror">{loginError}</Label>

            <button
                className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                type="submit"
            >
                Log In &rarr;
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
