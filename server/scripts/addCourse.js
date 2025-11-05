require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('../models/Course');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cmis';

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');
  try {
    const courseId = 'CS301';
    const existing = await Course.findOne({ courseId });
    if (existing) {
      console.log('Course already exists:', existing.name);
    } else {
      const course = await Course.create({
        courseId,
        name: 'Data Structures & Algorithms',
        department: 'Computer Science',
        credits: 4,
        description: 'Core concepts of data structures and algorithms',
        semester: 3,
        instructor: 'Dr. HOD'
      });
      console.log('Course created:', course.name);
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
}

run();