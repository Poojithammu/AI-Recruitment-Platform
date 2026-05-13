const mongoose = require('mongoose');
const User = require('../src/models/User');
require('dotenv').config({ path: '.env' });

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({}, 'fullName email role isEmailVerified isActive');
    console.log('Users in database:');
    console.log(JSON.stringify(users, null, 2));

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkUsers();
