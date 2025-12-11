const express = require('express');
const mongoose = require('mongoose');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Models
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const Ambulance = require('../models/Ambulance');
const Emergency = require('../models/EmergencyRequest');
const Bed = require('../models/Bed');
const Developer = require('../models/Developer');

// Helper to get stats for a model
async function getModelStats(Model, name) {
    try {
        const count = await Model.countDocuments();
        // Try to find the most recent update
        // Assuming models have timestamps: true
        const lastDoc = await Model.findOne().sort({ updatedAt: -1 }).select('updatedAt');
        return {
            name,
            count,
            lastUpdated: lastDoc ? lastDoc.updatedAt : null
        };
    } catch (e) {
        return { name, count: 0, error: e.message };
    }
}

router.get('/db-info', auth(['developer']), async (req, res) => {
    try {
        // Masked URI
        let uri = process.env.MONGO_URI || 'mongodb://localhost:27017/rapidcare';
        // Basic masking (replace content between // and @ if present with ****)
        // mongodb+srv://<user>:<password>@cluster...
        uri = uri.replace(/:\/\/(.*?)@/, '://****:****@');

        const dbName = mongoose.connection.name;

        const stats = await Promise.all([
            getModelStats(Hospital, 'hospitals'),
            getModelStats(Doctor, 'doctors'),
            getModelStats(Ambulance, 'ambulances'),
            getModelStats(Emergency, 'emergency_requests'),
            getModelStats(Bed, 'beds'),
            getModelStats(Developer, 'developers')
        ]);

        res.json({
            success: true,
            connection: {
                uri,
                dbName,
                state: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
            },
            collections: stats
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// System Logs Placeholder (mock)
router.get('/logs', auth(['developer']), (req, res) => {
    res.json({ logs: ['System started', 'DB Connected', '...'] });
});

// === USER MANAGEMENT ===

// Get users by type
router.get('/users/:type', auth(['developer']), async (req, res) => {
    try {
        const { type } = req.params;
        let users = [];
        if (type === 'hospitals') users = await Hospital.find().lean();
        else if (type === 'doctors') users = await Doctor.find().lean();
        else if (type === 'ambulances') users = await Ambulance.find().lean();
        else return res.status(400).json({ message: 'Invalid type' });

        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete user
router.delete('/users/:type/:id', auth(['developer']), async (req, res) => {
    try {
        const { type, id } = req.params;
        if (type === 'hospitals') await Hospital.findOneAndDelete({ hospitalId: id });
        else if (type === 'doctors') await Doctor.findOneAndDelete({ doctorId: id });
        else if (type === 'ambulances') await Ambulance.findOneAndDelete({ ambulanceId: id });
        else return res.status(400).json({ message: 'Invalid type' });

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// === HOSPITAL MANAGEMENT ===

// Create Hospital
router.post('/hospitals', auth(['developer']), async (req, res) => {
    try {
        // Basic validation
        if (!req.body.hospitalId || !req.body.password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const h = new Hospital(req.body);
        await h.save();
        res.json({ success: true, hospital: h });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update Hospital
router.put('/hospitals/:id', auth(['developer']), async (req, res) => {
    try {
        const h = await Hospital.findOneAndUpdate(
            { hospitalId: req.params.id },
            { $set: req.body },
            { new: true }
        );
        res.json({ success: true, hospital: h });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// === EMERGENCY REQUESTS ===

// Get all emergencies
router.get('/emergencies', auth(['developer']), async (req, res) => {
    try {
        const list = await Emergency.find().sort({ createdAt: -1 }).lean();
        res.json(list);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Fix/Update emergency
router.put('/emergencies/:id', auth(['developer']), async (req, res) => {
    try {
        const em = await Emergency.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json({ success: true, emergency: em });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// === SYSTEM ===
router.get('/health', (req, res) => {
    res.json({ status: 'OK', uptime: process.uptime(), timestamp: new Date() });
});

module.exports = router;
