const express = require('express');
const cors = require('cors');
const moviesRouter = require('./routes/movies');
const sessionRouter = require('./routes/session');
const seatsRouter = require('./routes/seats');
const authRouter = require('./routes/auth');
const hallsRouter = require('./routes/halls');
const authMiddleware = require('./middleware/auth');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', moviesRouter);
app.use('/api', sessionRouter);
app.use('/api', seatsRouter);
app.use('/api/auth', authRouter);
app.use('/api', authMiddleware, hallsRouter);


app.get('/', (req, res) => {
  res.send('Сервер работает');
});

app.get('/api', (req, res) => {
  res.send('API работает');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Сервер запущен, порт ${PORT}`);
});