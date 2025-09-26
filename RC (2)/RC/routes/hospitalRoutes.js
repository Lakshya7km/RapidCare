const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');

// GET /api/hospitals - List hospitals
router.get('/', hospitalController.listHospitals);
// GET /api/hospitals/:id - Get hospital by id (for hospital detail page)
router.get('/:id', hospitalController.getHospitalById);

module.exports = router;
