require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('../models/Student');

// MongoDB connection string - update if needed
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todos';

// Sample student data to add
const studentsToAdd = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    password: "password123", // In a real app, this should be hashed
    id: "STU001",
    department: "CSE",
    semester: 4,
    batch: "2022-2026",
    cgpa: 8.2,
    avatar: null
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    password: "password123", // In a real app, this should be hashed
    id: "STU002",
    department: "ECE",
    semester: 3,
    batch: "2022-2026",
    cgpa: 8.5,
    avatar: null
  }
  // Add more student records as needed
];

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Create a new collection named "register" if it doesn't exist
      // and add the student records to it
      await mongoose.connection.db.collection('register').insertMany(studentsToAdd);
      console.log('Students added successfully to the "register" collection');
    } catch (error) {
      console.error('Error adding students:', error.message);
    } finally {
      // Close the connection
      mongoose.connection.close();
      console.log('MongoDB connection closed');
    }
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });