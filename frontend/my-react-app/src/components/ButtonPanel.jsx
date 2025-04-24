import React from 'react';

const ButtonPanel = ({ iconSrc, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 rounded-lg bg-white shadow hover:bg-gray-100 transition"
    >
      <div className="relative">
        <img src={iconSrc} alt="Ikona" className="w-12 h-12 mb-2" />
      </div>
      <span className="text-sm font-medium text-center">{label}</span>
    </button>
  );
};

export default ButtonPanel;
