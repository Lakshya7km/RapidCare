const mongoose = require('mongoose');
const Developer = require('./models/Developer');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rapidcare';

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        // Check if root exists
        let dev = await Developer.findOne({ username: 'root' });
        if (dev) {
            console.log('Root user already exists. Updating password...');
            dev.password = 'root1234';
            await dev.save();
        } else {
            console.log('Creating root user...');
            dev = new Developer({
                username: 'root',
                password: 'root1234',
                role: 'developer'
            });
            await dev.save();
        }

        console.log('Developer user ready: root / root1234');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
