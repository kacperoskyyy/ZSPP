import React from 'react';

const IconButton = ({ iconSrc, onClick }) => (
  <button
    onClick={onClick}
    className="w-12 h-12 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
  >
    <img
      src={iconSrc}
      alt=""
      className="w-16 h-16 object-contain"
    />
  </button>
);
const ButtonOne = ({ onClick }) => (
    <IconButton
      iconSrc="/info.png"
      onClick={onClick}
    />
  );

const ButtonTwo = ({ onClick }) => (
  <IconButton
    iconSrc="/edit.png"
    onClick={onClick}
  />
);

const ButtonThree = ({ onClick }) => (
  <IconButton
    iconSrc="/delete.png"
    onClick={onClick}
  />
);


const CompositeButtons = ({ onButtonOneClick, onButtonTwoClick,onButtonThreeClick }) => (
  <div className="flex space-x-[10px]">
    <ButtonOne onClick={onButtonOneClick} />
    <ButtonTwo onClick={onButtonTwoClick} />
    <ButtonThree onclick={onButtonThreeClick} />
  </div>
);

export default CompositeButtons;
