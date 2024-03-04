import logo from './logo.svg';
import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/home-page/home-page.js'
import Login from './pages/login-page/login-page.js'
import Signup from './pages/signup-page/signup-page.js';
import Dashboard from './pages/dashboard-page/dashboard-page.js';
import UploadPage from './pages/upload-page/upload-page.js';
import VideoPage from './pages/video-page/video-page';
import './App.css'
import { useEffect, useState } from 'react'

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [user, setUser] = useState({});

  return (
    <div data-testid="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} email={email} setEmail={setEmail} setUser={setUser}/>} />
          <Route path="/signup" element={<Signup setLoggedIn={setLoggedIn} email={email} setEmail={setEmail} setUser={setUser}/>} />
          <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
          <Route path="/upload" element={<UploadPage user={user} />} />
          <Route path="/dashboard/:vid" element={<VideoPage user={user} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
