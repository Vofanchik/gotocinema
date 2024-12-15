import React from 'react';
import './HallSelector.css';

interface Hall {
  id: number;
  name: string;
}

interface HallSelectorProps {
  halls: Hall[];
  selectedHallId: number | null;
  setSelectedHallId: (id: number) => void;
  name: string;
}

const HallSelector: React.FC<HallSelectorProps> = ({ halls, selectedHallId, setSelectedHallId, name }) => {
  return (
    <ul className="conf-step__selectors-box">
      {halls.map(hall => (
        <li key={hall.id}>
          <label className="conf-step__selector-label">
            <input
              type="radio"
              className="conf-step__radio"
              name={name}
              value={hall.name}
              checked={selectedHallId === hall.id}
              onChange={() => setSelectedHallId(hall.id)}
            />
            <span className="conf-step__selector">{hall.name}</span>
          </label>
        </li>
      ))}
    </ul>
  );
};

export default HallSelector;
