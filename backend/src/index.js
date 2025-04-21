// src/index.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const scheduleRoutes = require('./routes/schedule.routes');
const { Server } = require("socket.io");

const createApp = () => {
  const app = express();
  const server = http.createServer(app); // Используем сервер HTTP
  

  app.use(cors());
  app.use(express.json());

  app.use('/api/auth', authRoutes);
  app.use('/api/schedule', scheduleRoutes);

  // Настройка Socket.IO
  const io = new Server(server, {
    cors: {
      origin: "*", // Доступ со всех источников (можно сузить для повышения безопасности)
      methods: ["GET", "POST"]
    }
  });
  require('./services/websocket.service').setIOInstance(io);

  // Обработчик событий
  io.on('connection', (socket) => {
    console.log('A user connected');

    // Либо слушаем определенное событие от клиента
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  return { app, server };
};

if (require.main === module) {
  const { app, server } = createApp();
  const PORT = process.env.PORT || 3001;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = createApp;