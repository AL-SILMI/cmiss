const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const Staff = require('../models/Staff');

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

const register = async (req, res) => {
    try {
        console.log('Registration request received');
        console.log('Registration request body:', JSON.stringify(req.body));
        
        // Extract fields from request body
        const { name, email, password, department, semester, batch } = req.body;
        
        // Validate required fields
        if (!name || !email || !password) {
            console.log('Missing required fields:', { name, email, password: password ? 'provided' : 'missing' });
            return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
        }
        
        console.log('Registration attempt for:', email);
        
        // Extract or generate studentId
        let studentId = req.body.studentId;
        if (!studentId) {
            studentId = `STU${Date.now().toString().slice(-6)}`;
        }

        // Check if user already exists
        const existingUser = await Student.findOne({ 
            $or: [{ email }, { studentId }] 
        });
        if (existingUser) {
            const field = existingUser.email === email ? 'Email' : 'Student ID';
            console.log(`${field} already registered:`, existingUser.email === email ? email : studentId);
            return res.status(400).json({ success: false, message: `${field} already registered` });
        }

        // Create new student with provided values or defaults
        const student = new Student({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password, // Model pre-save hook will hash this
            studentId: studentId.trim(),
            department: department || 'Computer Science',
            semester: parseInt(semester) || 1,
            batch: batch || '2023'
        });

        console.log('Saving student details:', JSON.stringify(student));
        const savedStudent = await student.save();
        console.log('Student registered successfully:', email);

        // Generate JWT token
        const token = generateToken(savedStudent);

        return res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: {
                id: savedStudent._id,
                name: savedStudent.name,
                email: savedStudent.email,
                studentId: savedStudent.studentId
            }
        });
    } catch (error) {
        console.error('Registration error:', error.message);
        console.error('Full error:', error);
        
        // Send a clear error response
        return res.status(500).json({ 
            success: false,
            message: 'Registration failed',
            error: error.message || 'Unknown server error'
        });
    }
};

// Student login (separate endpoint)
const studentLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, student.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = generateToken(student);

        res.json({
            token,
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                studentId: student.studentId,
                department: student.department,
                semester: student.semester,
                batch: student.batch,
                cgpa: student.cgpa
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
};

// Staff login (separate endpoint)
const staffLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const staff = await Staff.findOne({ email });
        if (!staff) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isValidPassword = await bcrypt.compare(password, staff.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: staff._id, role: staff.role }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.json({
            token,
            staff: {
                id: staff._id,
                name: staff.name,
                email: staff.email,
                staffId: staff.staffId,
                department: staff.department,
                role: staff.role
            }
        });
    } catch (error) {
        console.error('Staff login error:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
};

const getProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.user.id).select('-password');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ message: 'Error fetching profile' });
    }
};

module.exports = {
    register,
    studentLogin,
    staffLogin,
    getProfile
};