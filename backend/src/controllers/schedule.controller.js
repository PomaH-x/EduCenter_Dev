// src/controllers/schedule.controller.js
const { getAllSchedules, createSchedule, updateSchedule, deleteSchedule } = require('../models/schedules.model');

exports.getSchedules = async (req, res) => {
  try {
    const schedules = await getAllSchedules();
    return res.json(schedules);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

exports.createSchedule = async (req, res) => {
  const { userId, day, timeStart, timeEnd, cabinet } = req.body;

  try {
    const newSchedule = await createSchedule({ userId, day, timeStart, timeEnd, cabinet });
    return res.json(newSchedule);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

exports.updateSchedule = async (req, res) => {
  const { id } = req.params;
  const { userId, day, timeStart, timeEnd, cabinet } = req.body;

  try {
    const updatedSchedule = await updateSchedule(id, { userId, day, timeStart, timeEnd, cabinet });
    return res.json(updatedSchedule);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

exports.deleteSchedule = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSchedule = await deleteSchedule(id);
    return res.json(deletedSchedule);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};