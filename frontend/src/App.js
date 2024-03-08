import logo from './logo.svg';
import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/home-page/home-page.js'
import Login from './pages/login-page/login-page.js'
import Signup from './pages/signup-page/signup-page.js';
import Dashboard from './pages/dashboard-page/dashboard-page.js';
import UploadPage from './pages/upload-page/upload-page.js';
import VideoPage from './pages/video-page/video-page';
import SettingsPage from './pages/settings-page/settings-page';
import './App.css'
import React, { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from "./firebase/firebaseConfig";
import { Toaster } from "./shadcn/components/ui/toaster";
import { createContext } from 'react';
import { GlobalStateProvider, GlobalStateContext } from './components/react/GlobalStateProvider';


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [user, setUser] = useState({});

  useEffect(() => {
    onAuthStateChanged(auth, (currUser) => {
      if (currUser) {
        setLoggedIn(true);
        setUser(currUser);
      } else {
        setLoggedIn(false);
        setUser({});
      }
    });
  }, []);

  return (
    <div data-testid="App">
      <GlobalStateProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<Login setLoggedIn={setLoggedIn} email={email} setEmail={setEmail} setUser={setUser} user={user} />} />
            <Route path="/signup" element={<Signup setLoggedIn={setLoggedIn} email={email} setEmail={setEmail} setUser={setUser} user={user} />} />
            <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
            <Route path="/upload" element={<UploadPage user={user} />} />
            <Route path="/dashboard/:vid" element={<VideoPage user={user} />} />
            <Route path="/settings" element={<SettingsPage user={user} setUser={setUser} email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </GlobalStateProvider>
    </div>
  );
}

export default App;
