// backend/src/config/db.js
const { Pool } = require('pg');

// Читай переменные окружения вручную, минуя процессора env
const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'school_schedule_db',
  password: process.env.DB_PASSWORD || '123', 
  port: parseInt(process.env.DB_PORT) || 5432,
};

console.log(dbConfig); // Отладочный вывод конфигурации

const pool = new Pool(dbConfig);

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;