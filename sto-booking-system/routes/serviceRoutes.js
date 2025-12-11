const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const authMiddleware = require('../middleware/authMiddleware');


// Визначаємо маршрути
// GET http://localhost:5000/api/services -> викликає getAllServices
router.get('/', serviceController.getAllServices);

// POST http://localhost:5000/api/services -> викликає createService
router.post('/', authMiddleware, serviceController.createService);

// DELETE http://localhost:5000/api/services/1 -> викликає deleteService для ID 1
router.delete('/:id', authMiddleware, serviceController.deleteService);

router.put('/:id', authMiddleware, serviceController.updateService);

module.exports = router;