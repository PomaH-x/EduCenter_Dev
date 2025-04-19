const { pool } = require('../config/db');
const { validateTelegramSignature } = require('../services/auth.service');

exports.authWithTelegram = async (req, res) => {
  const { telegramId, username, signature } = req.body;

  try {
    // Проверяем подпись Telegram
    const isValid = validateTelegramSignature(signature);
    if (!isValid) throw new Error('Invalid Telegram signature!');

    // Проверяем существование пользователя в базе данных
    const existingUser = await pool.query('SELECT * FROM users WHERE telegram_id = $1', [telegramId]);
    if (existingUser.rows.length > 0) {
      return res.json({ success: true, message: 'User already exists.' });
    }

    // Создаем нового пользователя
    await pool.query(
      'INSERT INTO users (telegram_id, username) VALUES ($1, $2)',
      [telegramId, username]
    );

    return res.json({ success: true, message: 'User registered successfully!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};