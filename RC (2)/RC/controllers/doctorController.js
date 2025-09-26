const Doctor = require('../models/doctor');

// GET /api/doctors/availability
exports.getDoctorAvailability = async (req, res) => {
  try {
    // Optionally filter by hospital_id
    const filter = {};
    if (req.query.hospital_id) filter.hospital_id = req.query.hospital_id;
    const doctors = await Doctor.find(filter).populate('hospital_id', 'name location');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch doctor availability' });
  }
};

// PUT /api/doctors/update/status/:id
exports.updateDoctorStatus = async (req, res) => {
  try {
    const { availability } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { availability },
      { new: true }
    );
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    // Emit socket.io event for real-time update
    const io = req.app.get('io');
    io.emit('doctor:updated', doctor);
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update doctor status' });
  }
};
