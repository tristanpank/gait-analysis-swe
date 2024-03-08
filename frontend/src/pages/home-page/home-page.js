import React from 'react';
import LoginButton from './login-button.js';
import Header from "../../components/ui/header/header.js";

const Home = () => {

  return (
    <div>
      <Header />
      <div className="text-black text-7xl mt-44 text-center">
        UF Gait Analysis
      </div>
      <div className="text-black text-2xl mt-5 text-center">
        A platform that analyzes running form for student athletes at UF, making the resources of expensive labs available for everyday runners
      </div>
      <div className="flex justify-center items-center mt-8">
        <LoginButton />
      </div>
    </div>
  );
}

export default Home;
