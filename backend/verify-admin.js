const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected\n');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  role: String,
  isActive: Boolean,
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

const verifyAdmin = async () => {
  try {
    await connectDB();

    const admins = await User.find({ role: 'admin' });

    if (admins.length === 0) {
      console.log('❌ No admin users found!');
      console.log('\nRun: node create-admin.js');
    } else {
      console.log('✅ Found', admins.length, 'admin user(s):\n');
      admins.forEach((admin, index) => {
        console.log(`Admin ${index + 1}:`);
        console.log('  Email:', admin.email);
        console.log('  Name:', admin.firstName, admin.lastName);
        console.log('  Active:', admin.isActive);
        console.log('  Created:', admin.createdAt);
        console.log('');
      });

      console.log('🎯 You can login with:');
      console.log('   Email:', admins[0].email);
      console.log('   Password: (the one you set when creating the admin)\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

verifyAdmin();
