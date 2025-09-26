const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema({
  hospital_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  bed_number: { type: String, required: true },
  type: { type: String, enum: ['ICU', 'General'], required: true },
  status: { type: String, enum: ['Vacant', 'Occupied'], default: 'Vacant' },
  qr_code_id: { type: String }
});

module.exports = mongoose.model('Bed', bedSchema);
