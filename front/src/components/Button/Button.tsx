import React from 'react';
import './Button.css';


interface ButtonProps {
  type: 'regular' | 'accent' | 'trash';
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}


const Button: React.FC<ButtonProps> = ({ type, onClick, disabled = false, className = '', children }) => {
  const buttonClass = `button ${type === 'accent' ? 'button-accent' : type === 'trash' ? 'button-trash' : 'button-regular'} ${className}`;

  return (
    <button className={buttonClass} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
