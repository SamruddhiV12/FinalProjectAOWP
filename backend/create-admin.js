const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

// User Schema (copied from models/User.js)
const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    phone: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    role: { type: String, enum: ['student', 'admin', 'teacher'], default: 'student' },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    emergencyContact: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      relation: { type: String, required: true },
    },
    danceInfo: {
      hasPriorExperience: { type: Boolean, default: false },
      yearsOfExperience: { type: Number, default: 0 },
      previousInstitution: { type: String, default: '' },
      preferredBatch: { type: String, enum: ['basic', 'intermediate', 'advanced'], default: 'basic' },
      currentBatch: { type: String, enum: ['basic', 'intermediate', 'advanced'], default: 'basic' },
      enrollmentDate: { type: Date, default: Date.now },
    },
    profilePicture: { type: String, default: '/assets/images/student-placeholder.png' },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      pushNotifications: { type: Boolean, default: true },
    },
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    stats: {
      attendance: { type: Number, default: 0 },
      assignmentsCompleted: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', UserSchema);

// Create Admin User
const createAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@sda.com' });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('📧 Email: admin@sda.com');
      console.log('👤 Name:', existingAdmin.firstName, existingAdmin.lastName);
      console.log('🔑 Role:', existingAdmin.role);
      console.log('\nIf you forgot the password, you can delete this user and run the script again.');
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      firstName: 'Samruddhi',
      lastName: 'Admin',
      email: 'admin@sda.com',
      password: 'admin123', // Will be hashed automatically
      phone: '9876543210',
      dateOfBirth: new Date('1990-01-01'),
      gender: 'Female',
      role: 'admin', // 👈 Important: Set role as admin
      address: {
        street: 'Dance Academy Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
      },
      emergencyContact: {
        name: 'Emergency Contact',
        phone: '9876543211',
        relation: 'Family',
      },
      danceInfo: {
        hasPriorExperience: true,
        yearsOfExperience: 15,
        previousInstitution: 'Kalakshetra',
        preferredBatch: 'advanced',
        currentBatch: 'advanced',
      },
      isEmailVerified: true,
      isActive: true,
    });

    console.log('\n✅ Admin user created successfully!\n');
    console.log('════════════════════════════════════════');
    console.log('📧 Email: admin@sda.com');
    console.log('🔒 Password: admin123');
    console.log('🔑 Role: admin');
    console.log('👤 Name:', adminUser.firstName, adminUser.lastName);
    console.log('🆔 User ID:', adminUser._id);
    console.log('════════════════════════════════════════');
    console.log('\n🎯 You can now login with these credentials!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin();
