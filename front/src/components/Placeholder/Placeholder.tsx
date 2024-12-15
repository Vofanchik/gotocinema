import React from 'react';
import './Placeholder.css';


interface PlaceholderProps {
  text: string;
}


const Placeholder: React.FC<PlaceholderProps> = ({ text }) => {
  return (
    <div className="placeholder">
      <p>{text}</p>
    </div>
  );
};

export default Placeholder;
