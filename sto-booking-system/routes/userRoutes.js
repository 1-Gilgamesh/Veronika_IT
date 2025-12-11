const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Тільки адмін може бачити список клієнтів
router.get('/clients', authMiddleware, userController.getClients);

module.exports = router;