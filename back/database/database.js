const sqlite3 = require('sqlite-sync');
const db = sqlite3.connect('./database.sqlite');
module.exports = db;