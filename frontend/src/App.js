import logo from './logo.svg';
import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/home-page/home-page.js'
import Login from './pages/login-page/login-page.js'
import Signup from './pages/signup-page/signup-page.js';
import Dashboard from './pages/dashboard-page/dashboard-page.js';
import './App.css'
import { useEffect, useState } from 'react'

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [user, setUser] = useState({});

  console.log("test");
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} email={email} setEmail={setEmail} setUser={setUser}/>} />
          <Route path="/signup" element={<Signup setLoggedIn={setLoggedIn} email={email} setEmail={setEmail} setUser={setUser}/>} />
          <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
