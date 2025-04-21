// src/controllers/auth.controller.js
const { generateJwtToken } = require('../services/auth.service');

exports.authWithTelegram = async (req, res) => {
  const { telegramId, username, signature } = req.body;

  try {
    const isValid = validateTelegramSignature(signature);
    if (!isValid) throw new Error('Invalid Telegram signature!');

    const existingUser = await pool.query('SELECT * FROM users WHERE telegram_id = $1', [telegramId]);
    if (existingUser.rows.length > 0) {
      const user = existingUser.rows[0];
      const token = generateJwtToken(user.id);
      return res.json({ success: true, token });
    }

    // Новый пользователь
    const newUser = await pool.query(
      'INSERT INTO users (telegram_id, username) VALUES ($1, $2) RETURNING *',
      [telegramId, username]
    );
    const token = generateJwtToken(user.id, user.role); // role — получается из базы данных
    return res.json({ success: true, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};