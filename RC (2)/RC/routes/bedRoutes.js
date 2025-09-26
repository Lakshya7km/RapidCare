const express = require('express');
const router = express.Router();
const bedController = require('../controllers/bedController');
const auth = require('../middleware/auth');

// PUBLIC: GET /api/beds/availability
router.get('/availability', bedController.getBedAvailability);

// STAFF: PUT /api/beds/update/:id (JWT required)
router.put('/update/:id', auth, bedController.updateBedStatus);

module.exports = router;
