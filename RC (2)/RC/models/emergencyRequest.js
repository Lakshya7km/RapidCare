const mongoose = require('mongoose');

const emergencyRequestSchema = new mongoose.Schema({
  patient_name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  emergency_type: { type: String, required: true },
  symptoms: { type: String },
  photo: { type: String }, // path or URL
  hospital_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  ambulance_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['Pending', 'Accepted', 'Transferred'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EmergencyRequest', emergencyRequestSchema);
