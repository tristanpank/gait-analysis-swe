import React from "react";
import { useState } from "react";

const GlobalStateContext = React.createContext();
const GlobalStateProvider = ({ children }) => {
  const [videoUploaded, setVideoUploaded] = useState(false);
  return (
    <GlobalStateContext.Provider value={{ videoUploaded, setVideoUploaded }}>
      {children}
    </GlobalStateContext.Provider>
  )
}

export { GlobalStateProvider, GlobalStateContext}