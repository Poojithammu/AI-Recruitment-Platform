const path = require('path');
const dotenv = require('dotenv');
// Load environment from backend .env
dotenv.config();

const connectDB = require('../config/db');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = 'admin@hiring.com';
    const adminPassword = 'admin123';

    let user = await User.findOne({ email: adminEmail });
    if (!user) {
      user = new User({
        fullName: 'Administrator',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        isEmailVerified: true
      });
      await user.save();
      console.log('Admin user created:', adminEmail);
    } else {
      user.password = adminPassword; // will be hashed by pre-save hook
      user.role = 'admin';
      user.isEmailVerified = true;
      await user.save();
      console.log('Admin user updated:', adminEmail);
    }

    process.exit(0);
  } catch (err) {
    console.error('Error creating admin user:', err);
    process.exit(1);
  }
};

seedAdmin();
