const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    createdBy: { type: String, required: true },
    date: { type: Date, default: Date.now },
    audience: { type: String, enum: ['students', 'staff', 'all'], default: 'students' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Announcement', AnnouncementSchema);