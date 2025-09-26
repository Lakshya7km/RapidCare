const EmergencyRequest = require('../models/emergencyRequest');
const Hospital = require('../models/hospital');

// PUBLIC: POST /api/emergency/request
exports.createEmergencyRequest = async (req, res) => {
  try {
    const { patient_name, age, gender, emergency_type, symptoms, hospital_id, photo } = req.body;
    if (!patient_name || !age || !gender || !emergency_type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const request = await EmergencyRequest.create({
      patient_name,
      age,
      gender,
      emergency_type,
      symptoms,
      hospital_id: hospital_id || null,
      photo: photo || null,
      status: 'Pending'
    });

    const io = req.app.get('io');
    io.emit('emergency:new', request);

    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create emergency request' });
  }
};

// STAFF: GET /api/emergency/requests
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await EmergencyRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch emergency requests' });
  }
};

// STAFF: PUT /api/emergency/request/accept/:id
exports.acceptRequest = async (req, res) => {
  try {
    const request = await EmergencyRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'Accepted', updatedAt: new Date() },
      { new: true }
    );
    if (!request) return res.status(404).json({ error: 'Request not found' });

    const io = req.app.get('io');
    io.emit('emergency:updated', request);

    res.json(request);
  } catch (err) {
    res.status(500).json({ error: 'Failed to accept request' });
  }
};

// STAFF: PUT /api/emergency/request/transfer/:id
exports.transferRequest = async (req, res) => {
  try {
    const { hospital_id } = req.body;
    const request = await EmergencyRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    // If hospital rejected, suggest alternate (simple heuristic: pick highest rating)
    let newHospitalId = hospital_id;
    if (!newHospitalId) {
      const alt = await Hospital.find().sort({ rating: -1 }).limit(1);
      if (alt && alt.length) newHospitalId = alt[0]._id;
    }

    request.hospital_id = newHospitalId || request.hospital_id;
    request.status = 'Transferred';
    request.updatedAt = new Date();
    await request.save();

    const io = req.app.get('io');
    io.emit('emergency:transferred', request);

    res.json(request);
  } catch (err) {
    res.status(500).json({ error: 'Failed to transfer request' });
  }
};

// AMBULANCE: POST /api/emergency/form
exports.ambulanceEmergencyForm = async (req, res) => {
  try {
    const { patient_name, age, gender, emergency_type, symptoms, hospital_id, photo } = req.body;
    if (!patient_name || !age || !gender || !emergency_type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const request = await EmergencyRequest.create({
      patient_name,
      age,
      gender,
      emergency_type,
      symptoms,
      hospital_id: hospital_id || null,
      ambulance_id: req.user.id,
      photo: photo || null,
      status: 'Pending'
    });

    const io = req.app.get('io');
    io.emit('emergency:new', request);

    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit ambulance emergency form' });
  }
};

// AMBULANCE: PUT /api/emergency/referral/:id
exports.updateReferral = async (req, res) => {
  try {
    const { hospital_id } = req.body;
    const request = await EmergencyRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    request.hospital_id = hospital_id || request.hospital_id;
    request.updatedAt = new Date();
    await request.save();

    const io = req.app.get('io');
    io.emit('emergency:updated', request);

    res.json(request);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update referral' });
  }
};

