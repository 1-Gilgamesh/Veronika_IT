const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');

// Усі ці маршрути захищені (потрібен токен)
router.post('/', authMiddleware, appointmentController.createAppointment);
router.get('/my', authMiddleware, appointmentController.getMyAppointments);

// Отримати всі записи
router.get('/', authMiddleware, appointmentController.getAllAppointments);

// Змінити статус (наприклад, PATCH /api/appointments/5/status)
router.patch('/:id/status', authMiddleware, appointmentController.updateAppointmentStatus);

module.exports = router;