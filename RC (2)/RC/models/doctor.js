const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  hospital_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  availability: { type: Boolean, default: true },
  timings: { type: String }
});

module.exports = mongoose.model('Doctor', doctorSchema);
