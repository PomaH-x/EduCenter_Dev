// src/index.js

const express = require('express');
const http = require('http');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const scheduleRoutes = require('./routes/schedule.routes');
const logger = require('./logger');
const { Server } = require('socket.io'); // ✅ один раз импортируем
const cabinetRoutes = require('./routes/cabinets.routes');

const createApp = () => {
  const app = express();
  const server = http.createServer(app); // ✅ сначала создаём сервер

  // Создаём экземпляр socket.io
  const io = new Server(server, {
    cors: {
      origin: "*", // доступ со всех источников
      methods: ["GET", "POST"]
    }
  });

  app.use(cors());
  app.use(express.json());

  app.use('/api/auth', authRoutes);
  app.use('/api/schedule', scheduleRoutes);
  app.use('/api/cabinets', cabinetRoutes);

  // Прокидываем io в websocket service (если нужно)
  require('./services/websocket.service').setIOInstance(io);

  // Socket.io обработчики
  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('cabinets.update', () => {
      io.emit('cabinets.updated');
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  return { app, server };
};

// Если файл запущен напрямую
if (require.main === module) {
  const { app, server } = createApp();
  const PORT = process.env.PORT || 3001;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Экспортируем для тестов или других целей
module.exports = createApp;
