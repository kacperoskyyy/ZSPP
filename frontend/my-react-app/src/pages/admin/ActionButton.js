import React from 'react';
import './AdminPanel.css';

const ActionButton = ({ label, onClick, type = 'primary' }) => (
  <button 
    className={`action-button ${type}`}
    onClick={onClick}
  >
    {label}
  </button>
);

export default ActionButton;