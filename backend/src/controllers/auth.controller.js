// src/controllers/auth.controller.js
const pool = require('../config/db');
const { generateJwtToken, validateTelegramSignature } = require('../services/auth.service');
const logger = require('../logger');

exports.authWithTelegram = async (req, res) => {
  const { telegramId, username, signature } = req.body;
  try {
    logger.info('Starting authentication via Telegram...');

    const isValid = validateTelegramSignature(signature);
    if (!isValid) throw new Error('Invalid Telegram signature!');
    const existingUser = await pool.query('SELECT * FROM users WHERE telegram_id = $1', [telegramId]);
    console.log(existingUser)
    if (existingUser.rows.length > 0) {
      const user = existingUser.rows[0];
      const token = generateJwtToken(user.id, user.role);
      logger.info(`User authenticated successfully: ${user.username}`);
      return res.json({ success: true, token });
    }

    const newUser = await pool.query(
      'INSERT INTO users (telegram_id, username, role) VALUES ($1, $2, $3) RETURNING *',
      [telegramId, username, "student"]
    );
    const token = generateJwtToken(newUser.rows[0].id, 'student');
    logger.info(`New user registered: ${newUser.rows[0].username}`);
    return res.json({ success: true, token });
  } catch (err) {
    logger.error(`Authentication error: ${err.message}`);
    return res.status(500).json({ error: err.message });
  }
};