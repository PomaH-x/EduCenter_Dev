// testDbConnection.js
const pool = require('./backend/src/config/db');

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err);
  } else {
    console.log('Подключение успешно!', res.rows[0]);
  }
  pool.end();
});