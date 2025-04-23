// src/routes/schedule.routes.js
const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/schedule.controller');
const { checkJwtToken } = require('../middlewares/auth.middleware');
const { restrictToRole } = require('../middlewares/auth.middleware');

router.get('/', checkJwtToken, scheduleController.getSchedules);
// src/routes/schedule.routes.js
router.post('/', checkJwtToken, restrictToRole(['teacher', 'admin']), scheduleController.createSchedule);
router.put('/:id', checkJwtToken, scheduleController.updateSchedule);
router.delete('/:id', checkJwtToken, scheduleController.deleteSchedule);


module.exports = router;