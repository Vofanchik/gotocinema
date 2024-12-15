import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import MovieList from '../../components/MovieList/MovieList';
import Nav from '../../components/Nav/Nav';
import useMovies from '../../hooks/useMovies';
import './HomePage.css';


const HomePage: React.FC = () => {
  const location = useLocation(); 
  const searchParams = new URLSearchParams(location.search);
  const dateParam = searchParams.get('date'); 

  const timeZone = 'Europe/Moscow';

  const getCurrentDate = (timeZone: string): string => {
    const today = new Date(); 
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: timeZone
    };

    const formatter = new Intl.DateTimeFormat('en-CA', options);
    const formattedDate = formatter.format(today);

    return formattedDate;
  };

  const [selectedDate, setSelectedDate] = useState(dateParam || getCurrentDate(timeZone));

  const movies = useMovies(selectedDate);

  useEffect(() => {
    if (dateParam) {
      setSelectedDate(dateParam);
    } else if (location.pathname === '/') {
      setSelectedDate(getCurrentDate(timeZone));
    }
  }, [dateParam, location.pathname]);


  const handleDateChange = useCallback((date: string) => {
    setSelectedDate(date);
  }, []);

  return (
    <div className='page-container'>
      <Nav selectedDate={selectedDate} onDateChange={handleDateChange} />
      <MovieList movies={movies} />
    </div>
  );
};

export default HomePage;
