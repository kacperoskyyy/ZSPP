import React from 'react';
import "./ButtonPanel.css";

const ButtonPanel = ({ iconSrc, label, onClick }) => {
  return (
    <button onClick={onClick} className="button-panel">
      <div className="button-panel-icon-wrapper">
        <img src={iconSrc} alt="Ikona" className="button-panel-icon" />
      </div>
      <span className="button-panel-label">{label}</span>
    </button>
  );
};

export default ButtonPanel;
