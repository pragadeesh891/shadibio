const express = require('express');
const { 
  createBiodata, 
  getUserBiodata, 
  updateBiodata, 
  deleteBiodata, 
  getBiodataById,
  generatePDF
} = require('../controllers/biodataController');
const auth = require('../middleware/auth');

const router = express.Router();

// Protected routes (require authentication)
router.post('/', auth, createBiodata);
router.get('/user/me', auth, getUserBiodata);
router.put('/:id', auth, updateBiodata);
router.delete('/:id', auth, deleteBiodata);

// Public route (with privacy controls)
router.get('/:id', getBiodataById);

// PDF generation route (protected)
router.post('/:id/pdf', auth, generatePDF);

module.exports = router;