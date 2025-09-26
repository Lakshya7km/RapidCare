const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const auth = require('../middleware/auth');

// PUBLIC: GET /api/doctors/availability
router.get('/availability', doctorController.getDoctorAvailability);

// STAFF: PUT /api/doctors/update/status/:id (JWT required)
router.put('/update/status/:id', auth, doctorController.updateDoctorStatus);

module.exports = router;
