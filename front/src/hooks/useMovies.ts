import { useState, useEffect } from 'react';
import axios from 'axios';
import { Movie } from '../components/Movie/Movie';



const useMovies = (date: string): Movie[] => {
  const [data, setData] = useState<Movie[]>([]);

  useEffect(() => {

    
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/moviesdate`, { params: { date } });
        setData(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке данных фильмов:', error);
      }
    };

    fetchData();
  }, [date]);

  return data;
};

export default useMovies;
