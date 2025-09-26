const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const auth = require('../middleware/auth'); // We'll use this to protect routes

// @route   POST /api/appointments
// @desc    Create a new appointment request (Public)
router.post('/', appointmentController.createAppointment);

// @route   GET /api/appointments/hospital/:hospitalId
// @desc    Get all appointments for a specific hospital (Protected)
router.get('/hospital/:hospitalId', auth, appointmentController.getAppointmentsByHospital);

// @route   PUT /api/appointments/:appointmentId
// @desc    Update appointment status (Protected)
router.put('/:appointmentId', auth, appointmentController.updateAppointmentStatus);

module.exports = router;
