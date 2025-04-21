// tests/integration/api.test.js
const request = require('supertest');
const createApp = require('../../src/index');

const app = createApp();

describe('Testing API Endpoints', () => {
  it('should return list of schedules', async () => {
    const response = await request(app).get('/api/schedule');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should create a new schedule', async () => {
    const response = await request(app).post('/api/schedule').send({
      userId: 1,
      day: '2025-04-15',
      timeStart: '09:00',
      timeEnd: '10:00',
      cabinet: 1
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe(1);
  });

  it('should update an existing schedule', async () => {
    const newScheduleResponse = await request(app).post('/api/schedule').send({
      userId: 1,
      day: '2025-04-15',
      timeStart: '09:00',
      timeEnd: '10:00',
      cabinet: 1
    });

    const scheduleId = newScheduleResponse.body.id;

    const updateResponse = await request(app).put(`/api/schedule/${scheduleId}`).send({
      day: '2025-04-16',
      timeStart: '10:00',
      timeEnd: '11:00',
      cabinet: 2
    });

    expect(updateResponse.statusCode).toBe(200);
    expect(updateResponse.body.day).toEqual('2025-04-16');
  });

  it('should delete a schedule by its ID', async () => {
    const newScheduleResponse = await request(app).post('/api/schedule').send({
      userId: 1,
      day: '2025-04-15',
      timeStart: '09:00',
      timeEnd: '10:00',
      cabinet: 1
    });

    const scheduleId = newScheduleResponse.body.id;

    const deleteResponse = await request(app).delete(`/api/schedule/${scheduleId}`);
    expect(deleteResponse.statusCode).toBe(200);
  });
});