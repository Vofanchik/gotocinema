const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/database');
require('dotenv').config();


const router = express.Router();


router.post('/register', (req, res) => {
  const { email, password } = req.body;
  
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    db.run('INSERT INTO admins (email, password) VALUES (?, ?)', [email, hashedPassword]);
    res.status(201).send('Администратор зарегистрирован');
  } catch (err) {
    console.error('Ошибка при регистрации администратора:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  try {
    const result = db.run('SELECT * FROM admins WHERE email = ?', [email]);
      if (result.length === 0) {
      return res.status(400).send('Неверные учетные данные');
    }

    const admin = result[0];
    const isMatch = bcrypt.compareSync(password, admin.password);

    if (!isMatch) {
      return res.status(400).send('Неверные учетные данные');
    }

    const token = jwt.sign({ adminId: admin.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Ошибка при входе в систему:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});


router.post('/refresh-token', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).send('Токен не предоставлен');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const newToken = jwt.sign({ adminId: decoded.adminId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token: newToken });
  } catch (err) {
    console.error('Ошибка при обновлении токена:', err.message);
    res.status(401).send('Неверный или истекший токен');
  }
});

module.exports = router;
