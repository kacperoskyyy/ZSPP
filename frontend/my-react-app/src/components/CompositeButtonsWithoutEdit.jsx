import React from 'react';
import './CompositeButtons.css';

const IconButton = ({ iconSrc, onClick }) => (
  <button onClick={onClick} className="icon-button">
    <img src={iconSrc} alt="" className="icon-image" />
  </button>
);

const ButtonOne = ({ onClick }) => (
  <IconButton iconSrc="/info.png" onClick={onClick} />
);


const ButtonThree = ({ onClick }) => (
  <IconButton iconSrc="/delete.png" onClick={onClick} />
);

const CompositeButtonsWithoutEdit = ({ onButtonOneClick, onButtonTwoClick}) => (
  <div className="button-container">
    <ButtonOne onClick={onButtonOneClick} />
    <ButtonThree onClick={onButtonTwoClick} />
  </div>
);

export default CompositeButtonsWithoutEdit;
