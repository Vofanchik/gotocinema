const express = require('express');
const router = express.Router();
const db = require('../database/database');


router.post('/update-seats', (req, res) => {
  const { sessionId, selectedSeats } = req.body;

  try {
    for (const seat of selectedSeats) {
      const [row, column] = seat.split('-').map(Number);
      const checkResult = db.run('SELECT * FROM sold_tickets WHERE session_id = ? AND seat_row = ? AND seat_column = ?',
         [sessionId, row, column]);
         
      if (checkResult.length > 0) {
        db.run('UPDATE sold_tickets SET status = "taken" WHERE session_id = ? AND seat_row = ? AND seat_column = ?'
          , [sessionId, row, column]);
      } else {
             
        db.run('INSERT INTO sold_tickets (session_id, seat_row, seat_column, status)VALUES (?, ?, ?, "taken")'
        , [sessionId, row, column]);

      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error(`Ошибка при обновлении мест для сеанса ${sessionId}:`, err.message);
    res.status(500).send('Ошибка сервера');
  }
});

module.exports = router;
