const Appointment = require('../models/appointment');
const Doctor = require('../models/doctor');

// POST /api/appointments
// Create a new appointment request
exports.createAppointment = async (req, res) => {
  try {
    const { hospital_id, doctor_id, patient_name, patient_age, patient_gender, patient_contact, reason } = req.body;

    // Validate that the doctor is available
    const doctor = await Doctor.findById(doctor_id);
    if (!doctor || !doctor.availability) {
      return res.status(400).json({ error: 'Doctor is not available for appointments.' });
    }

    const newAppointment = new Appointment({
      hospital_id,
      doctor_id,
      patient_name,
      patient_age,
      patient_gender,
      patient_contact,
      reason
    });

    await newAppointment.save();

    // Emit a real-time event to the specific hospital's reception
    const io = req.app.get('io');
    io.to(`hospital_${hospital_id}`).emit('appointment:new', newAppointment);

    res.status(201).json(newAppointment);
  } catch (err) {
    console.error('Error creating appointment:', err);
    res.status(500).json({ error: 'Failed to create appointment.' });
  }
};

// GET /api/appointments/hospital/:hospitalId
// Get all appointments for a specific hospital
exports.getAppointmentsByHospital = async (req, res) => {
  try {
    const appointments = await Appointment.find({ hospital_id: req.params.hospitalId })
      .populate('doctor_id', 'name specialty') // Populate doctor details
      .sort({ createdAt: -1 }); // Show newest first

    res.json(appointments);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ error: 'Failed to fetch appointments.' });
  }
};

// PUT /api/appointments/:appointmentId
// Update an appointment's status (accept, reject, etc.)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status, remarks, slot } = req.body;
    const { appointmentId } = req.params;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status, remarks, slot },
      { new: true }
    ).populate('doctor_id', 'name specialty');

    if (!updatedAppointment) {
      return res.status(404).json({ error: 'Appointment not found.' });
    }

    // Emit a real-time event to notify the patient/public
    const io = req.app.get('io');
    // We can emit a generic event or a more specific one if we track individual clients
    io.emit('appointment:updated', updatedAppointment);

    // Also update the reception dashboard in real-time
    io.to(`hospital_${updatedAppointment.hospital_id}`).emit('appointment:updated', updatedAppointment);

    res.json(updatedAppointment);
  } catch (err) {
    console.error('Error updating appointment:', err);
    res.status(500).json({ error: 'Failed to update appointment status.' });
  }
};
