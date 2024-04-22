import './App.css';
import { act } from 'react-dom/test-utils';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/home-page/home-page.js'
import Login from './pages/login-page/login-page.js'
import Signup from './pages/signup-page/signup-page.js';
import Dashboard from './pages/dashboard-page/dashboard-page.js';
import UploadPage from './pages/upload-page/upload-page.js';
import VideoPage from './pages/video-page/video-page';
import './App.css'
import React, { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from "./firebase/firebaseConfig";
import { Toaster } from "./shadcn/components/ui/toaster";
import { GlobalStateProvider } from './components/react/GlobalStateProvider';


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [user, setUser] = useState({});

  useEffect(() => {
    console.log("test app use effect");
    onAuthStateChanged(auth, (currUser) => {
        console.log(currUser);
        if (currUser) {
          setLoggedIn(true);
          setUser(currUser);
        } else {
          setLoggedIn(false);
          setUser({});
        }
    });
  }, []);

  // useEffect(() => {
  //   console.log("test app use effect");
  //   const unsubscribe = onAuthStateChanged(auth, (currUser) => {
  //     console.log(currUser);
  //     if (currUser) {
  //       setLoggedIn(true);
  //       setUser(currUser);
  //     } else {
  //       setLoggedIn(false);
  //       setUser({});
  //     }
  //   });

  //   // Cleanup subscription on unmount
  //   return () => unsubscribe();
  // }, []);

  return (
    <div data-testid="App">
      <GlobalStateProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<Login setLoggedIn={setLoggedIn} email={email} setEmail={setEmail} setUser={setUser} user={user} />} />
            <Route path="/signup" element={<Signup setLoggedIn={setLoggedIn} email={email} setEmail={setEmail} setUser={setUser} user={user} />} />
            <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
            <Route path="/upload" element={<UploadPage user={user} setUser={setUser} />} />
            <Route path="/dashboard/:vid" element={<VideoPage user={user} setUser={setUser} />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </GlobalStateProvider>
    </div>
  );
}

export default App;
