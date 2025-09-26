const Bed = require('../models/bed');
const Hospital = require('../models/hospital');

// GET /api/beds/availability
exports.getBedAvailability = async (req, res) => {
  try {
    // Optionally filter by hospital_id
    const filter = {};
    if (req.query.hospital_id) filter.hospital_id = req.query.hospital_id;
    const beds = await Bed.find(filter).populate('hospital_id', 'name location');
    res.json(beds);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bed availability' });
  }
};

// PUT /api/beds/update/:id
exports.updateBedStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const bed = await Bed.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!bed) return res.status(404).json({ error: 'Bed not found' });
    // Emit socket.io event for real-time update
    const io = req.app.get('io');
    io.emit('bed:updated', bed);
    res.json(bed);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update bed status' });
  }
};
