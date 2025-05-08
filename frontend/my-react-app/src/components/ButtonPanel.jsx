import React from 'react';


const ButtonPanel = ({ iconSrc, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="mr-[60px] w-40 h-40 flex flex-col items-center justify-between p-4 rounded-lg bg-white shadow hover:bg-gray-100 transition text-center"
    >
      <div className="w-16 h-16 overflow-hidden flex items-center justify-center">
        <img
          src={iconSrc}
          alt="Ikona"
          className="w-64 h-64 object-contain"
        />
      </div>
      <span className="text-base font-medium leading-tight">
        {label}
      </span>
    </button>
  );
};





export default ButtonPanel;
