import React from 'react';
import LoginButton from './login-button.js';
import Header from "../../components/ui/header/header.js";
import { HomeParallax } from './home-parallax.js';

const Home = () => {

  return (
    <div data-testid = "Home">
      <Header />
      <HomeParallax />
    </div>
  );
}

export default Home;
