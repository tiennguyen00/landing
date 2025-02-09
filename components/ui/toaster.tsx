import React from "react";
import { Toaster } from "react-hot-toast";

const Toast = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        className: "customReactHostToastContainer",
        duration: 5000,
        style: {
          background: "white",
          color: "#1E1E1E",
          wordBreak: "break-word",
          maxWidth: "550px",
          alignItems: "flex-start",
          padding: 0,
          borderRadius: "16px",
          boxShadow: "2px 4px 5px rgba(0,0,0,0.5)",
        },
      }}
    />
  );
};

export default Toast;
