import React from "react";
import { FaSpinner } from "react-icons/fa";

interface LoadingComponentProps {
  noText?: boolean; // 선택적 prop
}

const LoadingComponent: React.FC<LoadingComponentProps> = ({ noText }) => {
  const showText = noText === undefined ? true : !noText;
  return (
    <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-opacity-50 shadow">
      <div className="flex items-center">
        <FaSpinner className="animate-spin" size={50} color="#0070f3" />
        {showText && <span className="ml-2 text-gray-700 dark:text-white">Loading...</span>}
      </div>
    </div>
  );
};

export default LoadingComponent;
