import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Movie.css';
import { formatTime } from '../../module/formatDate';


export interface Session {
  session_id: number;
  hall: string;
  time: string;
  price_regular: number;
  price_vip: number;
}


export interface Movie {
  id: number;
  title: string;
  synopsis: string;
  duration: string;
  origin: string;
  poster: string;
  sessions: Session[];
}


interface MovieProps {
  movie: Movie;
}


const Movie: React.FC<MovieProps> = ({ movie }) => {
  const navigate = useNavigate();


  const handleClick = (sessionId: number) => {
    navigate(`/hall?sessionId=${sessionId}`);
  };

  const sessionsByHall = movie.sessions.reduce((acc, session) => {
    const hall = session.hall;
    if (!acc[hall]) {
      acc[hall] = [];
    }
    acc[hall].push(session);
    acc[hall].sort((a, b) => a.time.localeCompare(b.time));
    return acc;
  }, {} as Record<string, Session[]>);

  return (
    <section className="movie">
      <div className="movie__info">
        <div className="movie__poster">
          <img className="movie__poster-image" alt={`${movie.title} постер`} src={movie.poster} />
        </div>
        <div className="movie__description">
          <h2 className="movie__title">{movie.title}</h2>
          <p className="movie__synopsis">{movie.synopsis}</p>
          <p className="movie__data">
            <span className="movie__data-duration">{movie.duration} мин.</span>
            <span className="movie__data-origin">{movie.origin}</span>
          </p>
        </div>
      </div>
      {Object.entries(sessionsByHall).map(([hall, sessions], index) => (
        <div key={index} className="movie-seances__hall">
          <h3 className="movie-seances__hall-title">{hall}</h3>
          <ul className="movie-seances__list">
            {sessions.map((session, index) => (
              <li key={index} className="movie-seances__time-block">
                <button
                  className="movie-seances__time"
                  onClick={() => handleClick(session.session_id)}
                >
                  {formatTime(session.time)} {/* - Обычный: {session.price_regular} руб., VIP: {session.price_vip} руб. */}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
};

export default Movie;