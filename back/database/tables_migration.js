const db = require('./database');

db.run(`CREATE TABLE IF NOT EXISTS movies(
	id integer PRIMARY KEY,
    title text NOT NULL,
    synopsis text NOT NULL,
    duration text NOT NULL,
    origin text NOT NULL,
    poster text NOT NULL
);`)

db.run(`CREATE TABLE IF NOT EXISTS halls(
	id integer PRIMARY KEY,
	name text NOT NULL,
	seats text NOT NULL,
	price_regular numeric NOT NULL,
	price_vip numeric NOT NULL
);`)

db.run(`CREATE TABLE IF NOT EXISTS sold_tickets (
	id integer PRIMARY KEY,
	session_id integer,
	seat_row integer NOT NULL,
	seat_column integer NOT NULL,
	status text NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	UNIQUE (session_id, seat_row, seat_column),
	FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);`)

db.run(`CREATE TABLE admins (
	id integer PRIMARY KEY,
	email text NOT NULL,
	password text NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP,
	UNIQUE (email)
);`)

db.run(`CREATE TABLE IF NOT EXISTS sessions (
	id integer PRIMARY KEY,
	movie_id integer,
	hall_id integer,
	time integer NOT NULL,
	date text NOT NULL,
	status text NOT NULL DEFAULT close,
	FOREIGN KEY (hall_id) REFERENCES halls(id) ON DELETE CASCADE,
	FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);`)