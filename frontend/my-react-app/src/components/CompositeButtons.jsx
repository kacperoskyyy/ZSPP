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

const ButtonTwo = ({ onClick }) => (
  <IconButton iconSrc="/edit.png" onClick={onClick} />
);

const ButtonThree = ({ onClick }) => (
  <IconButton iconSrc="/delete.png" onClick={onClick} />
);

const CompositeButtons = ({ onButtonOneClick, onButtonTwoClick, onButtonThreeClick }) => (
  <div className="button-container">
    <ButtonOne onClick={onButtonOneClick} />
    <ButtonTwo onClick={onButtonTwoClick} />
    <ButtonThree onClick={onButtonThreeClick} />
  </div>
);

export default CompositeButtons;
