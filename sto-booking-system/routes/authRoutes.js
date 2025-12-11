const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// POST http://localhost:5000/api/auth/register
router.post('/register', authController.register);

// POST http://localhost:5000/api/auth/login
router.post('/login', authController.login);

router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);

module.exports = router;