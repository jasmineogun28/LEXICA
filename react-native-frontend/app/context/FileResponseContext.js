import React, { createContext, useState } from "react";

export const FileResponseContext = createContext();

export const FileResponseProvider = ({ children }) => {
  const [fileResponse, setFileResponse] = useState(null); // Stores file upload response

  return (
    <FileResponseContext.Provider value={{ fileResponse, setFileResponse }}>
      {children}
    </FileResponseContext.Provider>
  );
};
