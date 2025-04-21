// tests/unit/schedules.model.test.js
const pool = require('../../src/config/db');
const { getAllSchedules, createSchedule, updateSchedule, deleteSchedule } = require('../../src/models/schedules.model');

describe('Testing schedules model', () => {
  beforeEach(async () => {
    await pool.query('TRUNCATE schedules');
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should retrieve all schedules', async () => {
    const schedules = await getAllSchedules();
    expect(Array.isArray(schedules)).toBe(true);
  });

  it('should create a new schedule', async () => {
    const newSchedule = await createSchedule({
      userId: 1,
      day: '2025-04-15',
      timeStart: '09:00',
      timeEnd: '10:00',
      cabinet: 1
    });
    expect(newSchedule).not.toBeNull();
  });

  it('should update an existing schedule', async () => {
    const initialSchedule = await createSchedule({
      userId: 1,
      day: '2025-04-15',
      timeStart: '09:00',
      timeEnd: '10:00',
      cabinet: 1
    });

    const updatedSchedule = await updateSchedule(initialSchedule.id, {
      day: '2025-04-16',
      timeStart: '10:00',
      timeEnd: '11:00',
      cabinet: 2
    });

    expect(updatedSchedule.day).toEqual('2025-04-16');
  });

  it('should delete a schedule by its ID', async () => {
    const schedule = await createSchedule({
      userId: 1,
      day: '2025-04-15',
      timeStart: '09:00',
      timeEnd: '10:00',
      cabinet: 1
    });

    const deletedSchedule = await deleteSchedule(schedule.id);
    expect(deletedSchedule).not.toBeNull();
  });
});