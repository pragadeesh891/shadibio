const Biodata = require('../models/Biodata');
const { generateBiodataPDF } = require('../utils/pdfGenerator');

// Create new biodata
const createBiodata = async (req, res) => {
  try {
    const biodataData = req.body;
    biodataData.userId = req.user._id;

    // Check if user already has biodata
    const existingBiodata = await Biodata.findOne({ userId: req.user._id });
    if (existingBiodata) {
      return res.status(400).json({
        success: false,
        message: 'You already have a biodata profile. Please update your existing profile instead.'
      });
    }

    // Create new biodata
    const biodata = new Biodata(biodataData);
    biodata.calculateCompletion();
    
    await biodata.save();

    res.status(201).json({
      success: true,
      message: 'Biodata created successfully',
      data: {
        biodata
      }
    });

  } catch (error) {
    console.error('Create biodata error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages[0]
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during biodata creation'
    });
  }
};

// Get user's biodata
const getUserBiodata = async (req, res) => {
  try {
    const biodata = await Biodata.findOne({ userId: req.user._id });
    
    if (!biodata) {
      return res.status(404).json({
        success: false,
        message: 'No biodata found for this user'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        biodata
      }
    });

  } catch (error) {
    console.error('Get biodata error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching biodata'
    });
  }
};

// Update biodata
const updateBiodata = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find biodata and check ownership
    const biodata = await Biodata.findOne({ 
      _id: id, 
      userId: req.user._id 
    });

    if (!biodata) {
      return res.status(404).json({
        success: false,
        message: 'Biodata not found or you do not have permission to update it'
      });
    }

    // Update biodata
    Object.keys(updateData).forEach(key => {
      if (key !== 'userId') { // Prevent userId modification
        biodata[key] = updateData[key];
      }
    });

    biodata.calculateCompletion();
    await biodata.save();

    res.status(200).json({
      success: true,
      message: 'Biodata updated successfully',
      data: {
        biodata
      }
    });

  } catch (error) {
    console.error('Update biodata error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages[0]
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during biodata update'
    });
  }
};

// Delete biodata
const deleteBiodata = async (req, res) => {
  try {
    const { id } = req.params;

    const biodata = await Biodata.findOneAndDelete({ 
      _id: id, 
      userId: req.user._id 
    });

    if (!biodata) {
      return res.status(404).json({
        success: false,
        message: 'Biodata not found or you do not have permission to delete it'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Biodata deleted successfully'
    });

  } catch (error) {
    console.error('Delete biodata error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during biodata deletion'
    });
  }
};

// Get biodata by ID (public access with privacy controls)
const getBiodataById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const biodata = await Biodata.findById(id).populate('userId', 'name email');
    
    if (!biodata) {
      return res.status(404).json({
        success: false,
        message: 'Biodata not found'
      });
    }

    // Apply privacy settings
    const sanitizedBiodata = { ...biodata.toObject() };
    
    if (sanitizedBiodata.privacySettings?.hidePhone) {
      delete sanitizedBiodata.personalDetails.phone;
    }
    
    if (sanitizedBiodata.privacySettings?.hideEmail) {
      delete sanitizedBiodata.personalDetails.email;
    }
    
    if (sanitizedBiodata.privacySettings?.hideIncome) {
      delete sanitizedBiodata.educationDetails.annualIncome;
    }

    res.status(200).json({
      success: true,
      data: {
        biodata: sanitizedBiodata
      }
    });

  } catch (error) {
    console.error('Get biodata by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching biodata'
    });
  }
};

// Generate PDF for biodata
const generatePDF = async (req, res) => {
  try {
    const { id } = req.params;
    const { template, customization } = req.body;

    // Get biodata
    const biodata = await Biodata.findById(id);
    
    if (!biodata) {
      return res.status(404).json({
        success: false,
        message: 'Biodata not found'
      });
    }

    // Apply privacy settings for PDF
    const sanitizedBiodata = { ...biodata.toObject() };
    
    if (sanitizedBiodata.privacySettings?.hidePhone) {
      delete sanitizedBiodata.personalDetails.phone;
    }
    
    if (sanitizedBiodata.privacySettings?.hideEmail) {
      delete sanitizedBiodata.personalDetails.email;
    }
    
    if (sanitizedBiodata.privacySettings?.hideIncome) {
      delete sanitizedBiodata.educationDetails.annualIncome;
    }

    // Generate PDF
    const pdfBuffer = await generateBiodataPDF(sanitizedBiodata, template, customization);

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=biodata_${biodata.personalDetails.fullName.replace(/\s+/g, '_')}.pdf`);
    
    // Send PDF buffer
    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate PDF'
    });
  }
};

module.exports = {
  createBiodata,
  getUserBiodata,
  updateBiodata,
  deleteBiodata,
  getBiodataById,
  generatePDF
};