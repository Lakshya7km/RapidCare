const express = require('express');
const router = express.Router();
const emergencyController = require('../controllers/emergencyController');
const auth = require('../middleware/auth');

// PUBLIC: POST /api/emergency/request
router.post('/request', emergencyController.createEmergencyRequest);

// STAFF: GET /api/emergency/requests (JWT required)
router.get('/requests', auth, emergencyController.getAllRequests);
// STAFF: PUT /api/emergency/request/transfer/:id (JWT required)
router.put('/request/transfer/:id', auth, emergencyController.transferRequest);
// STAFF: PUT /api/emergency/request/accept/:id (JWT required)
router.put('/request/accept/:id', auth, emergencyController.acceptRequest);

// AMBULANCE: POST /api/emergency/form (JWT required)
router.post('/form', auth, emergencyController.ambulanceEmergencyForm);
// AMBULANCE: PUT /api/emergency/referral/:id (JWT required)
router.put('/referral/:id', auth, emergencyController.updateReferral);

module.exports = router;
