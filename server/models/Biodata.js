const mongoose = require('mongoose');

const biodataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },

  // Personal Details
  personalDetails: {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required']
    },
    age: {
      type: Number,
      min: [18, 'Must be at least 18 years old'],
      max: [60, 'Must be at most 60 years old']
    },
    gender: {
      type: String,
      enum: ['Male', 'Female'],
      required: [true, 'Gender is required']
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: {
        type: String,
        default: 'India'
      }
    },
    maritalStatus: {
      type: String,
      enum: ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'],
      default: 'Never Married'
    },
    height: {
      feet: Number,
      inches: Number
    },
    weight: Number,
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    complexion: {
      type: String,
      enum: ['Very Fair', 'Fair', 'Wheatish', 'Wheatish Brown', 'Dark']
    }
  },

  // Family Details
  familyDetails: {
    father: {
      name: String,
      occupation: String,
      companyName: String
    },
    mother: {
      name: String,
      occupation: String,
      companyName: String
    },
    siblings: {
      brothers: {
        total: { type: Number, default: 0 },
        married: { type: Number, default: 0 }
      },
      sisters: {
        total: { type: Number, default: 0 },
        married: { type: Number, default: 0 }
      }
    },
    familyType: {
      type: String,
      enum: ['Joint', 'Nuclear', 'Extended'],
      default: 'Nuclear'
    },
    familyStatus: {
      type: String,
      enum: ['Middle Class', 'Upper Middle Class', 'High Class', 'Rich'],
      default: 'Middle Class'
    },
    familyValues: {
      type: String,
      enum: ['Traditional', 'Orthodox', 'Liberal', 'Moderate'],
      default: 'Traditional'
    },
    aboutFamily: String
  },

  // Education & Profession
  educationDetails: {
    highestEducation: {
      type: String,
      enum: [
        'High School', 'Bachelor Degree', 'Master Degree', 'Doctorate',
        'Diploma', 'Professional Degree', 'Other'
      ]
    },
    college: String,
    specialization: String,
    additionalQualifications: [String],
    occupation: {
      type: String,
      enum: [
        'Software Engineer', 'Doctor', 'Engineer', 'Teacher', 'Business Owner',
        'Manager', 'Consultant', 'Lawyer', 'Accountant', 'Banker', 'Other'
      ]
    },
    companyName: String,
    annualIncome: {
      amount: Number,
      currency: {
        type: String,
        default: 'INR'
      }
    },
    workLocation: String
  },

  // Horoscope Details (Optional)
  horoscopeDetails: {
    rashi: {
      type: String,
      enum: [
        'Mesh (Aries)', 'Vrishabh (Taurus)', 'Mithun (Gemini)', 'Karkat (Cancer)',
        'Simha (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrishchik (Scorpio)',
        'Dhanus (Sagittarius)', 'Makar (Capricorn)', 'Kumbh (Aquarius)', 'Meen (Pisces)'
      ]
    },
    nakshatra: String,
    manglik: {
      type: String,
      enum: ['Yes', 'No', 'Partial']
    },
    timeOfBirth: String,
    placeOfBirth: String,
    gotra: String
  },

  // Profile Settings
  profilePhoto: {
    type: String, // URL or file path
    default: null
  },
  templateSelected: {
    type: String,
    enum: ['Traditional', 'Modern'],
    default: 'Traditional'
  },
  privacySettings: {
    hidePhone: {
      type: Boolean,
      default: false
    },
    hideEmail: {
      type: Boolean,
      default: false
    },
    hideIncome: {
      type: Boolean,
      default: false
    }
  },
  completionPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  history: [{
    snapshot: Object,
    savedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt before saving
biodataSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
biodataSchema.index({ userId: 1 });
biodataSchema.index({ createdAt: -1 });

// Calculate profile completion percentage
biodataSchema.methods.calculateCompletion = function () {
  const requiredFields = [
    'personalDetails.fullName',
    'personalDetails.dateOfBirth',
    'personalDetails.gender',
    'personalDetails.phone',
    'personalDetails.email',
    'familyDetails.father.name',
    'familyDetails.mother.name',
    'educationDetails.highestEducation',
    'educationDetails.occupation'
  ];

  let completedFields = 0;

  requiredFields.forEach(field => {
    const value = this.get(field);
    if (value && value.toString().trim() !== '') {
      completedFields++;
    }
  });

  this.completionPercentage = Math.round((completedFields / requiredFields.length) * 100);
  return this.completionPercentage;
};

// Auto-calculate age from date of birth
biodataSchema.pre('save', function (next) {
  if (this.personalDetails && this.personalDetails.dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(this.personalDetails.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    this.personalDetails.age = age;
  }
  next();
});

module.exports = mongoose.model('Biodata', biodataSchema);