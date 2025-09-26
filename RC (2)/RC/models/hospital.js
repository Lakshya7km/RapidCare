const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  rating: { type: Number, default: 0 },
  specialties: [String],
  contact: { type: String },
  yearsInService: { type: Number },
  doctorsAvailable: { type: Number, default: 0 }
});

module.exports = mongoose.model('Hospital', hospitalSchema);
