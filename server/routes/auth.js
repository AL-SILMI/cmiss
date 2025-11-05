const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Public routes
router.post('/register', authController.register); // Student register
router.post('/login', authController.studentLogin); // Backwards compatible
router.post('/student/login', authController.studentLogin);
router.post('/staff/login', authController.staffLogin);

// Protected routes
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;