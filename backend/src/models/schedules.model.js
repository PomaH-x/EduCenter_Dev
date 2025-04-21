// src/models/schedules.model.js
const { pool } = require('../config/db');

exports.getAllSchedules = async () => {
  const result = await pool.query('SELECT * FROM schedules');
  return result.rows;
};

exports.createSchedule = async (data) => {
  const { userId, day, timeStart, timeEnd, cabinet } = data;
  const result = await pool.query(
    'INSERT INTO schedules (user_id, day, time_start, time_end, cabinet) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [userId, day, timeStart, timeEnd, cabinet]
  );
  return result.rows[0];
};

exports.updateSchedule = async (id, data) => {
  const { userId, day, timeStart, timeEnd, cabinet } = data;
  const result = await pool.query(
    'UPDATE schedules SET user_id = $1, day = $2, time_start = $3, time_end = $4, cabinet = $5 WHERE id = $6 RETURNING *',
    [userId, day, timeStart, timeEnd, cabinet, id]
  );
  return result.rows[0];
};

exports.deleteSchedule = async (id) => {
  const result = await pool.query('DELETE FROM schedules WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};