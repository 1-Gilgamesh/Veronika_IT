const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const employeeController = require('../controllers/employeeController'); // Імпортуємо сюди ж для зручності
const authMiddleware = require('../middleware/authMiddleware');

// Маршрути для Майстрів (видалення)
router.delete('/employees/:id', authMiddleware, employeeController.deleteEmployee);

// Маршрути для Графіку
router.get('/:masterId', authMiddleware, scheduleController.getSchedule);
router.post('/:masterId', authMiddleware, scheduleController.saveSchedule);

module.exports = router;