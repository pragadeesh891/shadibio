const express = require('express');
const { getAllUsers, makeUserPremium } = require('../controllers/adminController');
const auth = require('../middleware/auth');

const router = express.Router();

// A real app should have an admin middleware check, e.g., requireAdmin
// For now we protect it with the standard auth middleware
router.get('/users', auth, getAllUsers);
router.put('/users/:id/premium', auth, makeUserPremium);

module.exports = router;
