require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Hospital = require('../models/hospital');
const Bed = require('../models/bed');
const Doctor = require('../models/doctor');

async function seed() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rapidcare';
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  // Clear collections
  await Promise.all([
    User.deleteMany({}),
    Hospital.deleteMany({}),
    Bed.deleteMany({}),
    Doctor.deleteMany({}),
  ]);

  // Users
  const passwordHash = await bcrypt.hash('password123', 10);
  const staff = await User.create({ username: 'reception1', password: passwordHash, role: 'staff', name: 'Reception Staff' });
  const ambulance = await User.create({ username: 'ambulance1', password: passwordHash, role: 'ambulance', name: 'EMT John' });

  // Hospitals
  const h1 = await Hospital.create({
    name: 'Shree Narayana Hospital',
    location: 'Pandri, Raipur',
    rating: 3.3,
    specialties: ['Cardiology', 'Orthopedics', 'Emergency'],
    contact: '+91-12345-67890',
    yearsInService: 14,
    doctorsAvailable: 6,
  });
  const h2 = await Hospital.create({
    name: 'City Care Hospital',
    location: 'GE Road, Raipur',
    rating: 4.1,
    specialties: ['General Medicine', 'Pediatrics'],
    contact: '+91-98765-43210',
    yearsInService: 10,
    doctorsAvailable: 4,
  });

  // Beds
  const beds = [];
  for (let i = 1; i <= 4; i++) {
    beds.push({ hospital_id: h1._id, bed_number: `ICU-${i}`, type: 'ICU', status: i % 2 ? 'Vacant' : 'Occupied' });
  }
  for (let i = 1; i <= 6; i++) {
    beds.push({ hospital_id: h1._id, bed_number: `GEN-${i}`, type: 'General', status: i % 3 ? 'Vacant' : 'Occupied' });
  }
  for (let i = 1; i <= 3; i++) {
    beds.push({ hospital_id: h2._id, bed_number: `ICU-${i}`, type: 'ICU', status: 'Vacant' });
  }
  for (let i = 1; i <= 5; i++) {
    beds.push({ hospital_id: h2._id, bed_number: `GEN-${i}`, type: 'General', status: i % 2 ? 'Occupied' : 'Vacant' });
  }
  await Bed.insertMany(beds);

  // Doctors
  const doctors = [
    { hospital_id: h1._id, name: 'A. Gupta', specialty: 'Cardiology', availability: true, timings: '10:00 - 14:00' },
    { hospital_id: h1._id, name: 'S. Verma', specialty: 'Orthopedics', availability: false, timings: '12:00 - 16:00' },
    { hospital_id: h1._id, name: 'P. Singh', specialty: 'Emergency', availability: true, timings: '24x7' },
    { hospital_id: h2._id, name: 'R. Mehta', specialty: 'General Medicine', availability: true, timings: '09:00 - 13:00' },
    { hospital_id: h2._id, name: 'N. Rao', specialty: 'Pediatrics', availability: false, timings: '11:00 - 15:00' },
  ];
  await Doctor.insertMany(doctors);

  console.log('Seed completed.');
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
