import React, { useState, useEffect, useRef } from "react";
import { Button } from "components/button";
import { MdAdd, MdClose } from "react-icons/md";

type Props = {
   buttonList: { 
    id: string; 
    label: string; 
    size: string; 
    onClick: () => void; 
  }[];
};

const FloatingButton: React.FC<Props> = (props) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPosition({
        x: window.innerWidth - 100,
        y: window.innerHeight - 100,
      });
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    setIsDragging(false);
    const rect = e.currentTarget.getBoundingClientRect();
    offsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    setIsDragging(true);
    setPosition({
      x: Math.max(0, Math.min(window.innerWidth - 56, e.clientX - offsetRef.current.x)),
      y: Math.max(0, Math.min(window.innerHeight - 56, e.clientY - offsetRef.current.y)),
    });
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);

    setTimeout(() => setIsDragging(false), 0);
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (isDragging) {
        return;
      }
      setIsOpen(!isOpen);
  };

  return (
    <div
      style={{
        position: "fixed",
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 1000
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="relative flex flex-col items-end justify-end bg-black border rounded-xl border-gray">
        {isOpen && (
            <div className="absolute flex flex-col-reverse items-center justify-end bottom-14 gap-y-2">
              {props.buttonList.map((data, index) => (
                <div key={index} className="flex flex-row items-center justify-end w-40">
                  <span className="p-2 text-xs font-bold border rounded-lg text-stone-600 border-stone-500">{data.label}</span>
                  <Button id={data.id} size={data.size} onClick={data.onClick}/>
                </div>
              ))}
            </div>
        )}
        <button className="flex items-center justify-center p-2 text-white shadow-lg rounded-xl hover:text-black hover:bg-gray-200"
            onClick={handleButtonClick}>
          {isOpen? <MdClose size="30" /> : <MdAdd size="30" /> }
        </button>
      </div>
    </div>
  );
};

export default FloatingButton;