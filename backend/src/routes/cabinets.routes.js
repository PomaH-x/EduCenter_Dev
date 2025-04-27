const express = require('express');
const router = express.Router();
const cabinetsController = require('../controllers/cabinets.controller');

// Получить все кабинеты
router.get('/', cabinetsController.getCabinets);

// Создать новый кабинет
router.post('/', cabinetsController.createCabinet);

// Обновить кабинет по ID
router.put('/:id', cabinetsController.updateCabinet);

// Удалить кабинет по ID
router.delete('/:id', cabinetsController.deleteCabinet);

module.exports = router;
