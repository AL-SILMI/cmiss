const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema(
  {
    departmentId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    HOD: { type: String, required: true },
    courses: [{ type: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Department', DepartmentSchema);