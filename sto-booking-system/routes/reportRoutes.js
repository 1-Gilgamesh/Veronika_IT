const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/reports?startDate=...&endDate=...&type=services
router.get('/', authMiddleware, reportController.getStats);

module.exports = router;