// src/controllers/schedule.controller.js
const { pool } = require('../config/db');
const { emitScheduleUpdatedEvent } = require('../services/websocket.service');

exports.getSchedules = async (req, res) => {
  try {
    const results = await pool.query('SELECT * FROM schedules');
    return res.json(results.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

exports.createSchedule = async (req, res) => {
  const { userId, day, timeStart, timeEnd, cabinet } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO schedules (user_id, day, time_start, time_end, cabinet) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, day, timeStart, timeEnd, cabinet]
    );

    // Отправляем событие через Socket.IO о создании нового расписания
    emitScheduleUpdatedEvent(result.rows[0], 'created');

    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

exports.updateSchedule = async (req, res) => {
  const { id } = req.params;
  const { userId, day, timeStart, timeEnd, cabinet } = req.body;

  try {
    const result = await pool.query(
      'UPDATE schedules SET user_id = $1, day = $2, time_start = $3, time_end = $4, cabinet = $5 WHERE id = $6 RETURNING *',
      [userId, day, timeStart, timeEnd, cabinet, id]
    );

    // Отправляем событие через Socket.IO об обновлении расписания
    emitScheduleUpdatedEvent(result.rows[0], 'updated');

    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

exports.deleteSchedule = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM schedules WHERE id = $1 RETURNING *', [id]);

    // Отправляем событие через Socket.IO о удалении расписания
    emitScheduleUpdatedEvent(result.rows[0], 'deleted');

    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};