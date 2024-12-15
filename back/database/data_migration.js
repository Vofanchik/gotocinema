const db = require('./database');
const bcrypt = require('bcryptjs');
const { secondsToTime, timeToSeconds } = require('./utils.js');

function generateSessions(db, movieId, hallId, times, baseDate, days, timeZoneOffset, status = 'open') {
  for (let j = 0; j < days; j++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + j); 
    const formattedDate = dateToTimezone(date, timeZoneOffset);

    times.forEach(time => {
        db.run(`INSERT INTO sessions (movie_id, hall_id, time, date, status) VALUES (${movieId}, ${hallId}, '${timeToSeconds(time)}', '${formattedDate}', '${status}')`);
    });
  }
}

function dateToTimezone(dateValue, zone = 0) {
  const newDate = new Date(dateValue);
  const dateTimezone = new Date(newDate.setHours(newDate.getHours() + zone)); 
  const year = dateTimezone.getUTCFullYear();
  const month = String(dateTimezone.getUTCMonth() + 1).padStart(2, '0'); 
  const day = String(dateTimezone.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


const seatsStatusTemplate = [
["disabled", "disabled", "disabled", "disabled", "disabled", "standart", "standart", "disabled", "disabled", "disabled", "disabled", "disabled"],
["disabled", "disabled", "disabled", "disabled", "standart", "standart", "standart", "standart", "disabled", "disabled", "disabled", "disabled"],
["disabled", "standart", "standart", "standart", "standart", "standart", "standart", "standart", "standart", "disabled", "disabled", "disabled"],
["standart", "standart", "standart", "standart", "standart", "vip", "vip", "standart", "standart", "disabled", "disabled", "disabled"],
["standart", "standart", "standart", "standart", "vip", "vip", "vip", "vip", "standart", "disabled", "disabled", "disabled"],
["standart", "standart", "standart", "standart", "vip", "vip", "vip", "vip", "standart", "disabled", "disabled", "disabled"],
["standart", "standart", "standart", "standart", "vip", "vip", "vip", "vip", "standart", "disabled", "disabled", "disabled"],
["standart", "standart", "standart", "standart", "standart", "standart", "standart", "standart", "standart", "standart", "standart", "standart"]
];

const baseDate = new Date();
const times1 = ['08:00:00', '13:00:00', '18:00:00'];
const times2 = ['09:40:00', '14:40:00', '19:40:00'];
const times3 = ['11:10:00', '16:10:00', '21:10:00'];
const days = 10;
const timeZoneOffset = 3; 

db.run(`
INSERT INTO movies (title, synopsis, duration, origin, poster) VALUES
('Звёздные войны XXIII: Атака клонированных клонов', 'Две сотни лет назад малороссийские хутора разоряла шайка нехристей-ляхов во главе с могущественным колдуном.', '90', 'США', 'i/poster1.jpg'),
('Альфа', '20 тысяч лет назад Земля была холодным и неуютным местом, в котором смерть подстерегала человека на каждом шагу.', '80', 'Франция', 'i/poster2.jpg'),
('Хищник', 'Самые опасные хищники Вселенной, прибыв из глубин космоса, высаживаются на улицах маленького городка, чтобы начать свою кровавую охоту.', '100', 'Канада, США', 'i/poster3.jpg');
`);

db.run(`
INSERT INTO halls (name, seats, price_regular, price_vip) VALUES
('Зал 1', '${JSON.stringify(seatsStatusTemplate)}', 300.00, 500.00),
('Зал 2', '${JSON.stringify(seatsStatusTemplate)}', 350.00, 600.00);
`);

generateSessions(db, 1, 1, times1, baseDate, days, timeZoneOffset);
generateSessions(db, 2, 1, times2, baseDate, days, timeZoneOffset);
generateSessions(db, 3, 1, times3, baseDate, days, timeZoneOffset);
generateSessions(db, 1, 2, times3, baseDate, days, timeZoneOffset);
generateSessions(db, 2, 2, times2, baseDate, days, timeZoneOffset);
generateSessions(db, 3, 2, times1, baseDate, days, timeZoneOffset);


const email = 'admin@admin.ru'; 
const password = 'admin'; 
const hashedPassword = bcrypt.hashSync(password, 10);

db.run(`
INSERT INTO admins (email, password)
VALUES ('${email}', '${hashedPassword}')
`);



