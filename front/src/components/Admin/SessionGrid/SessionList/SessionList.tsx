import React from 'react';
import { MovieType } from '../MovieList/MovieList';
import Session from './Session';


export interface SessionType {
  id?: string; 
  hall_id: number;
  movie_id: number;
  time: string; 
  date: string; 
  seats_status: string; 
  status: string; 
}

interface SessionListProps {
  halls: { id: number; name: string }[];
  sessions: SessionType[];
  movies: MovieType[];
  colors: string[];
  onDragStartSession: (e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, session: SessionType) => void;
  onDrag: (e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, hallId: number) => void;
  onDeleteSession: (id: string) => void;
}


const SessionList: React.FC<SessionListProps> = ({
  halls, sessions, movies, colors,
  onDragStartSession, onDrag, onDragEnd, onDragOver, onDrop, onDeleteSession,
}) => {


  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>, hallId: number) => {
    onDrop(e, hallId);
    onDragEnd();
  };

  return (
    <div className="conf-step__seances">
      {halls.map(hall => (
        <div className="conf-step__seances-hall" key={hall.id}>
          <h3 className="conf-step__seances-title">{hall.name}</h3>
          <div
            className="conf-step__seances-timeline"
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, hall.id)}
            onTouchEnd={(e) => handleTouchEnd(e, hall.id)}
          >
            {sessions.filter(session => session.hall_id === hall.id).map(session => {
              const movie = movies.find(movie => movie.id === session.movie_id);
              if (!movie) return null;
              const movieIndex = movies.findIndex(m => m.id === movie.id);
              return (
                <Session
                  key={session.id}
                  session={session}
                  movie={movie}
                  color={colors[movieIndex % colors.length]}
                  onDragStart={onDragStartSession}
                  onDrag={onDrag}
                  onDragEnd={onDragEnd}
                  onDelete={onDeleteSession}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SessionList;