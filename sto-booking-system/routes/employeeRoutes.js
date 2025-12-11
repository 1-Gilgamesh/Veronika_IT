const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');

// Всі бачать список майстрів
router.get('/', employeeController.getAllEmployees);

// Тільки авторизований користувач (в ідеалі Адмін) може додати майстра
router.post('/', authMiddleware, employeeController.createEmployee);

module.exports = router;