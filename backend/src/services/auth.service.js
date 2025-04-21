// src/services/auth.service.js
const crypto = require('crypto');

exports.validateTelegramSignature = (signature) => {
  // Алгоритм проверки подписи от Telegram
  const secretKey = process.env.TELEGRAM_LOGIN_WIDGET_SECRET;
  const computedHash = crypto.createHmac('sha256', secretKey).update(signature).digest('base64');

  return computedHash === signature;
};

// src/services/auth.service.js
const jwt = require('jsonwebtoken');

// src/services/auth.service.js
exports.generateJwtToken = (userId, role) => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  };