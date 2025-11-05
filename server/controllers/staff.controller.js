const Mark = require('../models/Mark');
const Student = require('../models/Student');
const Course = require('../models/Course');

function calculateGrade(total, maxTotal) {
  const pct = (total / maxTotal) * 100;
  if (pct >= 85) return 'A';
  if (pct >= 70) return 'B';
  if (pct >= 60) return 'C';
  if (pct >= 50) return 'D';
  return 'F';
}

// Create or update mark for a student-course-semester
exports.upsertMark = async (req, res) => {
  try {
    const { studentId, courseId, internal = 0, external = 0, semester, maxTotal = 150 } = req.body;

    if (!studentId || !courseId || !semester) {
      return res.status(400).json({ message: 'studentId, courseId and semester are required' });
    }

    const student = await Student.findOne({ studentId });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const course = await Course.findOne({ courseId });
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const total = Number(internal) + Number(external);
    const grade = calculateGrade(total, maxTotal);

    const existing = await Mark.findOne({ student: student._id, course: course._id, semester });

    if (existing) {
      existing.internal = internal;
      existing.external = external;
      existing.total = total;
      existing.maxTotal = maxTotal;
      existing.grade = grade;
      await existing.save();
      return res.json({ message: 'Mark updated', mark: existing });
    }

    const mark = await Mark.create({
      student: student._id,
      course: course._id,
      internal,
      external,
      total,
      maxTotal,
      grade,
      semester,
    });

    res.status(201).json({ message: 'Mark created', mark });
  } catch (err) {
    console.error('upsertMark error', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};