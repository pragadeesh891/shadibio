const express = require('express');
const { register, login, getCurrentUser, forgotPassword, resetPassword } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

// Protected routes
router.get('/me', auth, getCurrentUser);

module.exports = router;