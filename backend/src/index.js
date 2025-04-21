// src/index.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const scheduleRoutes = require('./routes/schedule.routes');

const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json()); // Новая замена для bodyParser

  app.use('/api/auth', authRoutes);
  app.use('/api/schedule', scheduleRoutes);

  return app;
};

if (require.main === module) {
  const app = createApp();
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = createApp;