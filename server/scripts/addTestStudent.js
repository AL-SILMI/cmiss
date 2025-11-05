require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('../models/Student');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cmis';

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');
  try {
    const studentId = 'ST2025001';
    const email = 'test.student@example.com';
    let student = await Student.findOne({ studentId });
    if (student) {
      console.log('Student already exists:', student.name);
    } else {
      student = await Student.create({
        name: 'Test Student',
        email,
        password: 'Test123!@#',
        studentId,
        department: 'Computer Science',
        semester: 3,
        batch: '2025',
      });
      console.log('Student created:', student.name);
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
}

run();