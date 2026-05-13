const mongoose = require('mongoose');
const User = require('../src/models/User');
const authService = require('../src/services/auth.service');
require('dotenv').config({ path: '.env' });

const testCaseInsensitive = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const email = '2004.Harsha.Vardhan.2004@gmail.com'; // Mixed case
    const password = 'any_password'; // We won't actually match it, just testing query

    console.log(`Searching for user with email: ${email}`);
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (user) {
      console.log('User found (SUCCESS):', user.email);
    } else {
      console.log('User not found (FAIL)');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testCaseInsensitive();
