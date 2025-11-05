const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const Student = require('../models/Student');
const Mark = require('../models/Mark');
const Course = require('../models/Course');
const Fee = require('../models/Fee');

// Get student profile
router.get('/profile', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select('-password');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get student marks
router.get('/marks', auth, async (req, res) => {
  try {
    const { semester } = req.query; // optional filter
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const query = { student: student._id };
    if (semester) query.semester = semester;

    const markDocs = await Mark.find(query).populate('course');

    const marks = markDocs.map((m, idx) => ({
      id: m._id,
      subject: m.course?.name || 'Unknown',
      code: m.course?.courseId || 'N/A',
      internal: m.internal,
      external: m.external,
      total: m.total,
      maxTotal: m.maxTotal,
      grade: m.grade,
      semester: m.semester,
    }));

    res.json(marks);
  } catch (err) {
    console.error('GET /students/marks error', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get student fees
router.get('/fees', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const feeDocs = await Fee.find({ student: student._id }).sort({ semester: 1 });

    const fees = feeDocs.map(f => ({
      id: f._id.toString(),
      _id: f._id,
      semester: f.semester, // numeric
      semesterLabel: `Semester ${f.semester}`,
      academicYear: f.academicYear,
      totalAmount: f.totalAmount,
      paidAmount: f.paidAmount,
      balance: f.balance,
      status: f.status,
      dueDate: f.dueDate ? f.dueDate.toISOString() : null,
      paidDate: f.paidDate ? f.paidDate.toISOString() : null,
    }));

    res.json(fees);
  } catch (err) {
    console.error('GET /students/fees error', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;