import React, { useState, useEffect } from 'react';
import ConfStepWrapper from '../ConfStepWrapper/ConfStepWrapper';
import Button from '../../Button/Button';
import Modal from '../../Modal/Modal';
import Calendar from '../../Calendar/Calendar';
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';
import { useHalls } from '../../../contexts/HallsContext';
import { v4 as uuidv4 } from 'uuid';
import MovieList, { MovieType } from './MovieList/MovieList';
import SessionList, { SessionType } from './SessionList/SessionList';
import MovieModal from '../MovieModal/MovieModal';
import './SessionGrid.css';
import { formatDate, formatTimeToDate } from '../../../module/formatDate';


const SessionGrid: React.FC = () => {
  const { halls, sessions, setSessions, fetchSessions } = useHalls();
  const { token } = useAuth();
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [deletedSessions, setDeletedSessions] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationTitle, setNotificationTitle] = useState('');
  const [movieModalVisible, setMovieModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [draggedSession, setDraggedSession] = useState<SessionType | null>(null);
  const [draggedMovie, setDraggedMovie] = useState<MovieType | null>(null);
  const [dragStartX, setDragStartX] = useState<number | null>(null);


  const showNotification = (title: string, message: string) => {
    setNotificationTitle(title);
    setNotificationMessage(message);
    setNotificationModalVisible(true);
  };

  const movieColors = [
    '#caff85', '#85ff89', '#85ffd3', '#85e2ff',
    '#8599ff', '#ba85ff', '#ff85fb', '#ff85b1',
    '#ffa285'
  ];

  useEffect(() => {
    resetState();
  }, [selectedDate]);


  const fetchMovies = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/movies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMovies(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке фильмов:', error);
    }
  };


  const resetState = async () => {
    await fetchMovies();
    await fetchSessions(selectedDate);
  };


  const handleSave = () => {
    setModalVisible(true);
  };


  const handleModalSave = async () => {
    try {
      const updatedSessions = sessions.filter(session => session.status === 'closed' && session.id && !(typeof session.id === 'string' && session.id.startsWith('temp-')) && !deletedSessions.includes(session.id));
      const newSessions = sessions.filter(session => session.status === 'closed' && session.id && (typeof session.id === 'string' && session.id.startsWith('temp-')));
      await axios.put(`${process.env.REACT_APP_API_URL}/sessions`, updatedSessions, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      for (const sessionId of deletedSessions) {
        if (!(typeof sessionId === 'string' && sessionId.startsWith('temp-'))) {
          await axios.delete(`${process.env.REACT_APP_API_URL}/sessions/${sessionId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
      }

      await axios.post(`${process.env.REACT_APP_API_URL}/sessions`, newSessions.map(session => {
        const { id, ...rest } = session;
        return rest;
      }), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setModalVisible(false);
      showNotification('Сохранение конфигурации', 'Сеансы успешно сохранены.');
    } catch (error) {
      console.error('Ошибка при сохранении сеансов:', error);
      showNotification('Ошибка', 'Произошла ошибка при сохранении сеансов.');
    }
  };


  const handleModalClose = () => {
    setModalVisible(false);
  };


  const parseTime = (timeString: string): Date => {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds, 0);
    return date;
  };


  const handleDragStartSession = (e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, session: SessionType) => {
    if (session.status !== 'closed') {
      showNotification('Ошибка', 'Перетаскивание невозможно. Сеанс не закрыт.');
      return;
    }
    setDraggedSession(session);
    if ('clientX' in e) {
      setDragStartX(e.clientX);
    } else {
      setDragStartX(e.touches[0].clientX);
    }
    if ('dataTransfer' in e) {
      e.dataTransfer.setDragImage(new Image(), 0, 0); 
    }
  };


  const handleDragStartMovie = (e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, movie: MovieType) => {
    setDraggedMovie(movie);
    if ('clientX' in e) {
      setDragStartX(e.clientX);
    } else {
      setDragStartX(e.touches[0].clientX);
    }
    if ('dataTransfer' in e) {
      e.dataTransfer.setDragImage(new Image(), 0, 0); 
    }
  };


  const handleDragOver = (e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    if ('dataTransfer' in e) {
      e.dataTransfer.dropEffect = 'move';
    }
  };


  const sessionsOverlap = (session1: SessionType, session2: SessionType, movies: MovieType[]): boolean => {
    const movie1 = movies.find(movie => movie.id === session1.movie_id);
    const movie2 = movies.find(movie => movie.id === session2.movie_id);
    if (!movie1 || !movie2) return false;

    const start1 = parseTime(session1.time).getTime();
    const end1 = start1 + movie1.duration * 60000;
    const start2 = parseTime(session2.time).getTime();
    const end2 = start2 + movie2.duration * 60000;

    return start1 < end2 && start2 < end1;
  };


  const isOverlapWithExistingSessions = (newSession: SessionType, sessions: SessionType[], movies: MovieType[]): boolean => {
    return sessions.some(session => session.hall_id === newSession.hall_id && session.id !== newSession.id && sessionsOverlap(session, newSession, movies));
  };


  const handleDrop = (e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, hallId: number) => {
    if (!draggedMovie) return;

    const timeline = e.currentTarget.getBoundingClientRect();
    let deltaX;
    if ('clientX' in e) {
      deltaX = e.clientX - timeline.left;
    } else {
      deltaX = e.touches[0].clientX - timeline.left;
    }
    const minutesDelta = Math.round((deltaX / timeline.width) * 1440);
    const startTime = new Date(selectedDate);
    startTime.setHours(0, 0, 0, 0);
    startTime.setMinutes(minutesDelta);

    const newTime = formatTimeToDate(startTime);
    const hall = halls.find(hall => hall.id === hallId);
    const newSession: SessionType = {
      id: `temp-${uuidv4()}`,
      hall_id: hallId,
      movie_id: draggedMovie.id,
      time: newTime,
      date: formatDate(selectedDate, 'YYYY-MM-DD'),
      seats_status: hall ? JSON.stringify(hall.seats) : '[]',
      status: 'closed'
    };

    if (isOverlapWithExistingSessions(newSession, sessions, movies)) {
      showNotification('Ошибка', 'Этот сеанс пересекается с другим сеансом. Пожалуйста, выберите другое время.');
      return;
    }

    setSessions([...sessions, newSession]);
    setDraggedMovie(null);
    setDragStartX(null);
  };


  const handleDrag = (e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!dragStartX || !draggedSession) return;

    let deltaX;
    if ('clientX' in e) {
      deltaX = e.clientX - dragStartX;
    } else {
      deltaX = e.touches[0].clientX - dragStartX;
    }
    const timeline = e.currentTarget.parentElement!.getBoundingClientRect();
    const minutesDelta = Math.round((deltaX / timeline.width) * 1440);
    const startTime = parseTime(draggedSession.time);
    startTime.setMinutes(startTime.getMinutes() + minutesDelta);

    const newTime = formatTimeToDate(startTime);

    const newSession = { ...draggedSession, time: newTime };
    if (isOverlapWithExistingSessions(newSession, sessions, movies)) {
      return;
    }

    setSessions(prevSessions => prevSessions.map(session =>
      session.id === draggedSession.id ? { ...session, time: newTime } : session
    ));
  };


  const handleDragEnd = () => {
    setDraggedSession(null);
    setDraggedMovie(null);
    setDragStartX(null);
  };


  const handleDeleteSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session && session.status !== 'closed') {
      showNotification('Ошибка', 'Удаление невозможно. Сеанс не закрыт.');
      return;
    }
    setDeletedSessions(prev => [...prev, sessionId]);
    setSessions(prevSessions => prevSessions.filter(session => session.id !== sessionId));
  };


  const handleAddMovieClick = () => {
    setMovieModalVisible(true);
  };


  const handleMovieModalSave = async (movie: { title: string, duration: number, origin: string, poster: string, synopsis: string }) => {
    try {
      
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/movies`, movie, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMovies([...movies, response.data]);
    } catch (error) {
      console.error('Ошибка при добавлении фильма:', error);
      showNotification('Ошибка', 'Произошла ошибка при добавлении фильма.');
    }
  };

  return (
    <ConfStepWrapper title="Сетка сеансов">
      <div className="calendar-wrapper">
        <Calendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
      </div>

      <div className="conf-step__paragraph">
        <fieldset className="conf-step__buttons">
          <Button type="accent" onClick={handleAddMovieClick}>Добавить фильм</Button>
        </fieldset>
      </div>

      <MovieList movies={movies} colors={movieColors} onDragStart={handleDragStartMovie} onDragEnd={handleDragEnd} />

      <SessionList
        halls={halls}
        sessions={sessions}
        movies={movies}
        colors={movieColors}
        onDragStartSession={handleDragStartSession}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDeleteSession={handleDeleteSession}
      />

      <fieldset className="conf-step__buttons">
        <Button type="regular" onClick={resetState}>Отмена</Button>
        <Button type="accent" onClick={handleSave}>Сохранить</Button>
      </fieldset>

      <Modal
        show={modalVisible}
        onClose={handleModalClose}
        title="Подтверждение сохранения"
        message="Вы уверены, что хотите сохранить изменения?"
        inputVisible={false}
        onSave={handleModalSave}
      />

      <MovieModal
        show={movieModalVisible}
        onClose={() => setMovieModalVisible(false)}
        onSave={handleMovieModalSave}
      />

      <Modal
        show={notificationModalVisible}
        onClose={() => setNotificationModalVisible(false)}
        title={notificationTitle}
        message={notificationMessage}
        inputVisible={false}
        notification={true}
      />
    </ConfStepWrapper>
  );
};

export default SessionGrid;
