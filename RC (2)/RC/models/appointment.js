const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  hospital_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patient_name: { type: String, required: true },
  patient_age: { type: Number, required: true },
  patient_gender: { type: String, required: true },
  patient_contact: { type: String, required: true },
  reason: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected', 'Completed'],
    default: 'Pending'
  },
  remarks: { type: String },
  slot: { type: String }, // e.g., '2024-10-26T11:00:00Z'
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
