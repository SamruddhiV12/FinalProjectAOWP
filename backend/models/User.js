const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    // Personal Information
    firstName: {
      type: String,
      required: [true, 'Please provide first name'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Please provide last name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: 6,
      select: false, // Don't return password by default
    },
    phone: {
      type: String,
      required: [true, 'Please provide phone number'],
      match: [/^\d{10}$/, 'Please provide a valid 10-digit phone number'],
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Please provide date of birth'],
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: [true, 'Please provide gender'],
    },

    // Role
    role: {
      type: String,
      enum: ['student', 'admin', 'teacher'],
      default: 'student',
    },

    // Address
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: {
        type: String,
        required: true,
        match: [/^\d{6}$/, 'Please provide a valid 6-digit pincode'],
      },
    },

    // Emergency Contact
    emergencyContact: {
      name: { type: String, required: true },
      phone: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Please provide a valid 10-digit phone number'],
      },
      relation: { type: String, required: true },
    },

    // Dance Information (for students)
    danceInfo: {
      hasPriorExperience: {
        type: Boolean,
        default: false,
      },
      yearsOfExperience: {
        type: Number,
        default: 0,
      },
      previousInstitution: {
        type: String,
        default: '',
      },
      preferredBatch: {
        type: String,
        enum: ['basic', 'intermediate', 'advanced'],
        default: 'basic',
      },
      currentBatch: {
        type: String,
        enum: ['basic', 'intermediate', 'advanced'],
        default: 'basic',
      },
      enrollmentDate: {
        type: Date,
        default: Date.now,
      },
    },

    // Profile Picture
    profilePicture: {
      type: String,
      default: '/assets/images/student-placeholder.png',
    },

    // Notification Preferences
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      pushNotifications: { type: Boolean, default: true },
    },

    // Account Status
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    // Exam Information (for students)
    examInfo: {
      examsGiven: { type: Number, default: 0 },
      nextExam: { type: String, default: '' },
      examLevel: {
        type: String,
        enum: ['Junior', 'Senior', 'Arangetram', 'None'],
        default: 'None',
      },
    },

    // Stats (for quick access)
    stats: {
      attendance: { type: Number, default: 0 },
      assignmentsCompleted: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Virtual for full name
UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtuals are included when converting to JSON
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', UserSchema);
