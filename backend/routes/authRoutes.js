// routes/authRoutes.js

const router = require('express').Router();
const { register, login, googleLogin, forgotPassword, verifyOtp, logout } = require('../controllers/authController');

// Public auth endpoints
router.post('/register', register);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);

// Stateless logout
router.post('/logout', logout);

module.exports = router;