const mongoose = require('mongoose');

const MarkSchema = new mongoose.Schema(
  {
    student: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Student',
      required: true 
    },
    course: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Course',
      required: true 
    },
    internal: { 
      type: Number, 
      required: true 
    },
    external: { 
      type: Number, 
      required: true 
    },
    total: { 
      type: Number, 
      required: true 
    },
    maxTotal: { 
      type: Number, 
      required: true,
      default: 150
    },
    grade: { 
      type: String, 
      required: true 
    },
    semester: { 
      type: Number, 
      required: true 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Mark', MarkSchema);