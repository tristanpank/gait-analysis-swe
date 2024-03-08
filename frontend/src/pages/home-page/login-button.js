import React from 'react'
import { useNavigate } from 'react-router-dom';

function LoginButton() {
  const navigate = useNavigate();

  return (
      <button 
          onClick={() => navigate("/login")}
          className="bg-blue-700 text-white border-2 border-solid rounded-full text-center text-2xl px-5 py-2.5"
        >
          Login
      </button>
  );
}

export default LoginButton;
