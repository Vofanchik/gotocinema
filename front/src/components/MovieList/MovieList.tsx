import React from 'react';
import Movie from '../Movie/Movie';
import Placeholder from '../Placeholder/Placeholder';
import './MovieList.css';
import { Movie as MovieType } from '../Movie/Movie';


interface MovieListProps {
  movies: MovieType[];
}

const MovieList: React.FC<MovieListProps> = ({ movies }) => {
  return (
    <main className="main">
      {movies.length > 0 ? (
        movies.map((movie) => (
          <Movie key={movie.id} movie={movie} />
        ))
      ) : (
        <Placeholder text="К сожалению, на выбранную дату нет доступных фильмов." />
      )}
    </main>
  );
};

export default MovieList;
