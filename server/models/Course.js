const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
  {
    courseId: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true 
    },
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    department: { 
      type: String, 
      required: true 
    },
    credits: { 
      type: Number, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    semester: { 
      type: Number, 
      required: true 
    },
    instructor: { 
      type: String, 
      required: true 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', CourseSchema);