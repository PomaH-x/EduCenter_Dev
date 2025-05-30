const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/telegram', authController.authWithTelegram);

module.exports = router;