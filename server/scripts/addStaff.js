require('dotenv').config();
const mongoose = require('mongoose');
const Staff = require('../models/Staff');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cmis';

async function run() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const email = 'hod.cse@msec.edu.in';
    const existing = await Staff.findOne({ email });
    if (existing) {
      console.log('Staff already exists:', email);
      return process.exit(0);
    }

    const staff = new Staff({
      staffId: 'STF1001',
      name: 'Head of CSE',
      email,
      password: 'Pass@123',
      department: 'Computer Science',
      role: 'hod'
    });

    await staff.save();
    console.log('Seeded staff user:', email);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding staff:', err);
    process.exit(1);
  }
}

run();