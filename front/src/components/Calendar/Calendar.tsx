import React, { useState, useEffect } from 'react';
import './Calendar.css';


interface CalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}


const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateChange }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(selectedDate));

  useEffect(() => {
    setCurrentMonth(new Date(selectedDate));
  }, [selectedDate]);


  const daysInMonth = (month: number, year: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };


  const firstDayOfMonth = (month: number, year: number): number => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; 
  };


  const handlePrevMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(currentMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };


  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(currentMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };


  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth);
    newDate.setDate(day);
    onDateChange(newDate);
  };

  const renderDays = (): JSX.Element[] => {
    const days = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const numDays = daysInMonth(month, year);
    const firstDay = firstDayOfMonth(month, year);

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar__day calendar__day--empty"></div>);
    }

    for (let day = 1; day <= numDays; day++) {
      const isSelected = day === selectedDate.getDate() &&
        month === selectedDate.getMonth() &&
        year === selectedDate.getFullYear();
      days.push(
        <div
          key={day}
          className={`calendar__day ${isSelected ? 'calendar__day--selected' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="calendar">
      <div className="calendar__header">
        <button onClick={handlePrevMonth}>{"<"}</button>
        <span>{currentMonth.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}</span>
        <button onClick={handleNextMonth}>{">"}</button>
      </div>
      <div className="calendar__body">
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, index) => (
          <div key={index} className="calendar__weekday">{day}</div>
        ))}
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;
