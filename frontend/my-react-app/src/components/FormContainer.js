// src/components/FormContainer.js
import React from 'react';

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  // Możesz zmienić gradient, żeby pasował do Twojego designu
  background: 'linear-gradient(180deg, #e2f1ff 0%, #86b7e8 100%)',
  fontFamily: 'Arial, sans-serif',
};

const formWrapperStyle = {
  width: '350px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  padding: '20px',
  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
};

const FormContainer = ({ children }) => {
  return (
    <div style={containerStyle}>
      <div style={formWrapperStyle}>
        {children}
      </div>
    </div>
  );
};

export default FormContainer;
