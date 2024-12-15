import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // , useLocation
import './Nav.css';
import { formatDate } from '../../module/formatDate';


interface NavProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}


const Nav: React.FC<NavProps> = ({ selectedDate, onDateChange }) => {
  const navigate = useNavigate(); 
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  const selectedDateObj = new Date(selectedDate);
  selectedDateObj.setHours(0, 0, 0, 0);
    const newStartDate = (selectedDateObj.getTime() - today.getTime()) / (1000 * 3600 * 24) > 6
    ? new Date(selectedDateObj.setDate(selectedDateObj.getDate() - 6))
    : today;

  const [startDate, setStartDate] = useState(newStartDate);

  const dates = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i); 
    const isToday = formatDate(date) === formatDate(today); 
    return {
      day: date.toLocaleDateString('ru-RU', { weekday: 'short' }), 
      date: formatDate(date, 'YYYY-MM-DD'), 
      number: date.getDate(), 
      isWeekend: date.getDay() === 6 || date.getDay() === 0, 
      isToday: isToday 
    };
  });


  const handleClick = (date: string) => {
    navigate(`/?date=${date}`); 
    onDateChange(date); 
  };


  const handleNext = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(newStartDate.getDate() + 1); 
    setStartDate(newStartDate); 
  };

    const handlePrev = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(newStartDate.getDate() - 1); 
    if (newStartDate >= today) {
      setStartDate(newStartDate); 
    }
  };

  return (
    <nav className="page-nav">
      <button className="page-nav__day page-nav__day_prev" onClick={handlePrev} disabled={startDate <= today}></button>

      {dates.map((item) => (
        <a
          key={item.date}
          className={`page-nav__day ${item.isToday ? 'page-nav__day_today' : ''} ${item.isWeekend ? 'page-nav__day_weekend' : ''} ${item.date === selectedDate ? 'page-nav__day_chosen' : ''}`}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleClick(item.date); 
          }}
        >
          <span className="page-nav__day-week">{item.day}</span>
          <span className="page-nav__day-number">{item.number}</span>
        </a>
      ))}

      <button className="page-nav__day page-nav__day_next" onClick={handleNext}></button>
    </nav>
  );
};

export default Nav;
