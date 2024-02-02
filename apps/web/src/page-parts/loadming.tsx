import React from "react";
import { FaSpinner } from "react-icons/fa";

const LoadingComponent = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
      <div className="flex items-center">
        <FaSpinner className="animate-spin" size={50} color="#0070f3" />
        <span className="ml-2 text-white">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingComponent;
