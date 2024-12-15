const express = require('express');
const router = express.Router();
const db = require('../database/database');


router.get('/halls', (req, res) => {
  try {
    const result = db.run('SELECT * FROM halls');

    result.forEach(e => {
      e.seats = JSON.parse(e.seats)      
    });
    res.json(result);
  } catch (err) {
    console.error('Ошибка при получении залов:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

router.delete('/halls/:id',  (req, res) => {
  const { id } = req.params;
  try {
    db.run('DELETE FROM halls WHERE id = ?', [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error('Ошибка при удалении зала:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});


router.post('/halls', (req, res) => {
  const { name } = req.body;
  try {
    db.run('INSERT INTO halls (name, seats, price_regular, price_vip) VALUES (?,?,?,?)', [name, '[]', 300, 500]);
    res.sendStatus(201);
  } catch (err) {
    console.error('Ошибка при создании зала:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

router.get('/halls/:id',  (req, res) => {
  const { id } = req.params;
  try {
    const result = db.run('SELECT seats FROM halls WHERE id = ?', [id]);
    if (result.length === 0) {
      return res.status(404).send('Зал не найден');
    }
     
    res.json({'seats':JSON.parse(result[0].seats)});
  } catch (err) {
    console.error('Ошибка при получении конфигурации зала:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

router.post('/halls/:id/config', (req, res) => {
  const { id } = req.params;
  const { seats } = req.body;
  const seats_str = JSON.stringify( [seats][0]);
  
  try {
    db.run('UPDATE halls SET seats = ? WHERE id = ?', [seats_str, id]);
    res.sendStatus(200);
  } catch (err) {
    console.error('Ошибка при сохранении конфигурации зала:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});


router.post('/halls/:id/prices', (req, res) => {
  const { id } = req.params;
  const { regularPrice, vipPrice } = req.body;
  try {
    db.run('UPDATE halls SET price_regular = ?, price_vip = ? WHERE id = ?', [regularPrice, vipPrice, id]);
    res.sendStatus(200);
  } catch (err) {
    console.error('Ошибка при обновлении цен зала:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

module.exports = router;
