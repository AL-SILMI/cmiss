const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth.middleware');
const { requireStaff } = require('../middlewares/auth.middleware');
const staffController = require('../controllers/staff.controller');
const Student = require('../models/Student');
const Course = require('../models/Course');
const Mark = require('../models/Mark');
const Fee = require('../models/Fee');

// Staff-only: create/update marks
router.post('/marks', auth, requireStaff, staffController.upsertMark);

// List students (staff-only)
router.get('/students', auth, requireStaff, async (req, res) => {
  try {
    const { department, q } = req.query;
    const filter = {};
    if (department) filter.department = department;
    if (q) {
      filter.$or = [
        { name: new RegExp(q, 'i') },
        { email: new RegExp(q, 'i') },
        { studentId: new RegExp(q, 'i') },
      ];
    }
    const students = await Student.find(filter).select('name email studentId department semester batch');
    res.json(students);
  } catch (err) {
    console.error('GET /staff/students error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update student basic details (staff-only)
router.put('/students/:id', auth, requireStaff, async (req, res) => {
  try {
    const updatable = ['name', 'email', 'department', 'semester', 'batch'];
    const update = {};
    for (const key of updatable) {
      if (key in req.body) update[key] = req.body[key];
    }
    const student = await Student.findByIdAndUpdate(req.params.id, update, { new: true }).select('name email studentId department semester batch');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student updated', student });
  } catch (err) {
    console.error('PUT /staff/students/:id error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Department overview (courses and performance)
router.get('/department/overview', auth, requireStaff, async (req, res) => {
  try {
    const dept = req.query.department;
    if (!dept) return res.status(400).json({ message: 'department query param is required' });

    const [courseCount, studentCount] = await Promise.all([
      Course.countDocuments({ department: dept }),
      Student.countDocuments({ department: dept }),
    ]);

    const marks = await Mark.find({}).populate('course');
    const deptMarks = marks.filter(m => m.course && m.course.department === dept);
    const totals = deptMarks.reduce(
      (acc, m) => {
        acc.internal += Number(m.internal || 0);
        acc.external += Number(m.external || 0);
        acc.total += Number(m.total || 0);
        acc.count += 1;
        return acc;
      },
      { internal: 0, external: 0, total: 0, count: 0 }
    );

    const avgInternal = totals.count ? +(totals.internal / totals.count).toFixed(2) : 0;
    const avgExternal = totals.count ? +(totals.external / totals.count).toFixed(2) : 0;
    const avgTotal = totals.count ? +(totals.total / totals.count).toFixed(2) : 0;

    const courses = await Course.find({ department: dept }).select('courseId name semester credits instructor');

    res.json({
      department: dept,
      courseCount,
      studentCount,
      averages: { internal: avgInternal, external: avgExternal, total: avgTotal },
      courses,
    });
  } catch (err) {
    console.error('GET /staff/department/overview error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student fees (staff-only)
router.get('/students/:id/fees', auth, requireStaff, async (req, res) => {
  try {
    const studentId = req.params.id;
    const fees = await Fee.find({ student: studentId }).sort({ semester: 1 });
    
    if (!fees.length) {
      return res.status(404).json({ message: 'No fee records found for this student' });
    }
    
    res.json(fees);
  } catch (err) {
    console.error('GET /staff/students/:id/fees error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create/Update student fee (staff-only)
router.post('/students/:id/fees', auth, requireStaff, async (req, res) => {
  try {
    const studentId = req.params.id;
    const { semester, academicYear, totalAmount, paidAmount, dueDate } = req.body;
    
    if (!semester || !academicYear || !totalAmount) {
      return res.status(400).json({ message: 'Semester, academicYear and totalAmount are required' });
    }
    
    // Calculate balance and status
    const balance = totalAmount - (paidAmount || 0);
    let status = 'Pending';
    if (paidAmount >= totalAmount) {
      status = 'Paid';
    } else if (paidAmount > 0) {
      status = 'Partial';
    }
    
    // Check if fee record exists for this student and semester
    let fee = await Fee.findOne({ student: studentId, semester });
    
    if (fee) {
      // Update existing fee
      fee.academicYear = academicYear;
      fee.totalAmount = totalAmount;
      fee.paidAmount = paidAmount || fee.paidAmount;
      fee.balance = balance;
      fee.status = status;
      fee.dueDate = dueDate || fee.dueDate;
      if (status === 'Paid' && !fee.paidDate) {
        fee.paidDate = new Date();
      }
      
      await fee.save();
      res.json({ message: 'Fee record updated', fee });
    } else {
      // Create new fee record
      fee = new Fee({
        student: studentId,
        semester,
        academicYear,
        totalAmount,
        paidAmount: paidAmount || 0,
        balance,
        status,
        dueDate,
        paidDate: status === 'Paid' ? new Date() : null
      });
      
      await fee.save();
      res.status(201).json({ message: 'Fee record created', fee });
    }
  } catch (err) {
    console.error('POST /staff/students/:id/fees error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;