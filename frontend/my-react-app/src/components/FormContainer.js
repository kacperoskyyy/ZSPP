import React from 'react';
import './FormContainer.css';

const FormContainer = ({
  children,
  className = '',
  theme = 'default',
  size = 'default',
  customStyles = {}
}) => {
  const containerClasses = `form-container-wrapper ${theme !== 'default' ? `theme-${theme}` : ''} ${className}`;
  const formClasses = `form-container-inner ${size !== 'default' ? `size-${size}` : ''}`;

  return (
    <div
      className={containerClasses}
      style={customStyles.container}
    >
      <div
        className={formClasses}
        style={customStyles.form}
      >
        {children}
      </div>
    </div>
  );
};

export default FormContainer;
