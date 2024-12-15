const express = require('express');
const router = express.Router();
const db = require('../database/database');
const authMiddleware = require('../middleware/auth');
const { secondsToTime, timeToSeconds } = require('../database/utils');

router.get('/session', (req, res) => {
  const { sessionId } = req.query;

  try {
    const result = db.run('SELECT movies.id AS movie_id, movies.title, movies.synopsis, movies.duration, movies.origin, movies.poster, halls.name AS hall, '+
        'sessions.time, sessions.date, halls.seats, halls.price_regular, halls.price_vip FROM sessions LEFT JOIN movies ON sessions.movie_id = movies.id ' +
        'LEFT JOIN halls ON sessions.hall_id = halls.id WHERE sessions.id = ?'
        , [sessionId]);
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const session = result[0];

    const seats = JSON.parse(session.seats);

    const soldTicketsResult = db.run('SELECT seat_row, seat_column, status FROM sold_tickets WHERE session_id = ?'
      , [sessionId]);

    const soldTickets = soldTicketsResult;

    res.json({
      movie: {
        id: session.movie_id,
        title: session.title,
        synopsis: session.synopsis,
        duration: session.duration,
        origin: session.origin,
        poster: session.poster,
      },
      hall: session.hall,
      time: secondsToTime(session.time),
      date: session.date,
      seats,
      prices: {
        standart: session.price_regular,
        vip: session.price_vip
      },
      soldTickets
    });
  } catch (err) {
    console.error('Ошибка при получении данных о сеансе:', err.message);
    res.status(500).send('Server Error');
  }
});


router.get('/sessions', (req, res) => {
  try {
    const result = db.run('SELECT * FROM sessions');
    result.forEach(e => {
      e.time = secondsToTime(e.time)
    });
    res.json(result);
  } catch (err) {
    console.error('Ошибка при получении сеансов:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});


router.get('/sessions/by-date', (req, res) => {
  const { date } = req.query;

  try {
    const result = db.run('SELECT sessions.id, sessions.hall_id, sessions.movie_id, sessions.time, sessions.date, sessions.status, ' +
        'movies.title, movies.duration, movies.poster FROM sessions LEFT JOIN movies ON sessions.movie_id = movies.id WHERE sessions.date = ?'
    , [date]);
    result.forEach(e => {
      e.time = secondsToTime(e.time)
    });

    res.json(result);
  } catch (err) {
    console.error('Ошибка при получении сеансов по дате:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

router.put('/sessions', authMiddleware, (req, res) => {
  const sessions = req.body;
  try {
    for (const session of sessions) {
      db.run(
        'UPDATE sessions SET time = ? WHERE id = ?',
        [timeToSeconds(session.time), session.id]
      );
    }
    res.sendStatus(200);
  } catch (err) {
    console.error('Ошибка при обновлении сеансов:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});


router.post('/sessions', authMiddleware, (req, res) => {
  const sessions = req.body;
  try {
    for (const session of sessions) {
      db.run(
        'INSERT INTO sessions (hall_id, movie_id, time, date, status) VALUES (?,?,?,?,?)',
        [session.hall_id, session.movie_id, timeToSeconds(session.time), session.date, 'closed']
      );
    }
    res.sendStatus(201);
  } catch (err) {
    console.error('Ошибка при добавлении сеансов:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});


router.delete('/sessions/:id', authMiddleware, (req, res) => {
  const { id } = req.params;

  try {
    db.run('DELETE FROM sessions WHERE id = ?', [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error('Ошибка при удалении сеанса:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

router.post('/sessions/status', authMiddleware, (req, res) => {
  const { hallId, status } = req.body;

  try {
    db.run('UPDATE sessions SET status = ? WHERE hall_id = ? ' +
    'AND status != ? AND id NOT IN (SELECT session_id FROM sold_tickets)',
      [status, hallId, status]
    );

    const remainingSessions = db.run('SELECT id FROM sessions WHERE hall_id = ? ' +
      'AND status != ? AND id IN (SELECT session_id FROM sold_tickets)',
      [ hallId, status]
    );

    if (remainingSessions.rowCount > 0) {
      return res.status(200).json({
        message: `Не все сеансы были ${status === 'open' ? 'открыты' : 'закрыты'}, так как имеются сеансы с проданными билетами.`
      });
    } else {
      return res.status(200).json({
        message: `Все сеансы были успешно ${status === 'open' ? 'открыты' : 'закрыты'}.`
      });
    }
  } catch (err) {
    console.error('Ошибка при обновлении статуса сеансов:', err.message);
    console.error('Подробности ошибки:', err);
    res.status(500).send('Ошибка сервера');
  }
});

module.exports = router;
