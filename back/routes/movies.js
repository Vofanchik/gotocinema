const express = require('express');
const router = express.Router();
const db = require('../database/database');
const { secondsToTime, timeToSeconds } = require('../database/utils');


router.get('/moviesdate', (req, res) => {
  const { date } = req.query;

  try {
    const result = db.run('SELECT movies.id AS movie_id, movies.title,movies.synopsis, movies.duration, movies.origin, movies.poster, sessions.id AS session_id,'+
        'sessions.time, halls.name AS hall, halls.price_regular, halls.price_vip FROM movies JOIN sessions ON movies.id = sessions.movie_id JOIN ' +
        'halls ON sessions.hall_id = halls.id WHERE sessions.date = ? AND sessions.status = "open"', [date]);
    
    if (result.length ===0){
      res.json(result)
    } else {
    const moviesMap = new Map();

    result.forEach(row => {
      const { movie_id, title, synopsis, duration, origin, poster, session_id, hall, time, price_regular, price_vip } = row;
      if (!moviesMap.has(movie_id)) {
        moviesMap.set(movie_id, {
          id: movie_id,
          title,
          synopsis,
          duration,
          origin,
          poster,
          sessions: []
        });
      }
      moviesMap.get(movie_id).sessions.push({ session_id, hall, time, price_regular, price_vip });
    });

    const movies = Array.from(moviesMap.values());
    movies.forEach(e => {
      e.sessions.forEach(a => {
        a.time = secondsToTime(a.time)
      })
    });   

    res.json(movies);}

  } catch (err) {
    console.error('Ошибка при получении фильмов и сеансов:', err.message);
    res.status(500).send('Server Error');
  }
});


router.get('/movies', (req, res) => {
  try {
    const result =  db.run('SELECT * FROM movies');
    res.json(result);
  } catch (err) {
    console.error('Ошибка при получении фильмов:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});


router.post('/movies', (req, res) => {
  const { title, duration, origin, poster, synopsis } = req.body;

  try {
    const result = db.run('INSERT INTO movies (title, duration, origin, poster, synopsis) VALUES (?,?,?,?,?)',
      [title, duration, origin, poster, synopsis]
    );
    res.status(201)
  } catch (err) {
    console.error('Ошибка при добавлении фильма:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

module.exports = router;
