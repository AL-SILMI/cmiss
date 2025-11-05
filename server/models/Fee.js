const mongoose = require('mongoose');

const FeeSchema = new mongoose.Schema(
  {
    student: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Student',
      required: true 
    },
    semester: { 
      type: Number, 
      required: true 
    },
    academicYear: { 
      type: String, 
      required: true 
    },
    totalAmount: { 
      type: Number, 
      required: true 
    },
    paidAmount: { 
      type: Number, 
      required: true,
      default: 0
    },
    balance: { 
      type: Number, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['Paid', 'Pending', 'Partial'],
      required: true 
    },
    dueDate: { 
      type: Date
    },
    paidDate: { 
      type: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Fee', FeeSchema);