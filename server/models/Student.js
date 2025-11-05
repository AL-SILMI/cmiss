const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const StudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true,
      lowercase: true
    },
    password: { type: String, required: true },
    studentId: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true 
    },
    department: { type: String, required: true },
    semester: { type: Number, required: true },
    batch: { type: String, required: true },
    cgpa: { type: Number, default: 0 },
    avatar: { type: String, default: null },
    role: { 
      type: String, 
      enum: ['student', 'admin'], 
      default: 'student' 
    }
  },
  { 
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        delete ret.password;
        return ret;
      }
    }
  }
);

// Email validation - removing async validation as it's causing issues
// The uniqueness is already enforced by the schema's unique: true

// Pre-save middleware to hash password
StudentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password
StudentSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Student', StudentSchema);