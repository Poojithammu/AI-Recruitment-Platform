const crypto = require('crypto');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateTokens');
const sendEmail = require('../utils/sendEmail');
const sendBrevoEmail = require('../utils/sendBrevoEmail');
const redis = require('../config/redis');

exports.registerUser = async (userData) => {
  const { fullName, email, password, role } = userData;

  const normalizedEmail = email.toLowerCase();

  // Check if user exists
  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) {
    throw { statusCode: 400, message: 'User already exists' };
  }

  // Prevent self-registration of admin
  const userRole = role === 'admin' ? 'user' : role;

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store user data and OTP in Redis with 10-minute expiry
  const tempUserData = { fullName, email: normalizedEmail, password, role: userRole, otp };
  await redis.setex(`temp_user:${normalizedEmail}`, 600, JSON.stringify(tempUserData));

  // Send OTP via Brevo
  await sendBrevoEmail({
    to: email,
    subject: 'Verify your email - AI Hiring System',
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Welcome to AI Hiring System!</h2>
        <p style="font-size: 16px; color: #555;">Please use the following One-Time Password (OTP) to verify your email address and complete your registration:</p>
        <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #007bff; border-radius: 5px; margin: 20px 0;">
          ${otp}
        </div>
        <p style="font-size: 14px; color: #888;">This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
      </div>
    `
  });

  return { message: 'OTP sent to email. Please verify to complete registration.' };
};

exports.verifyOTP = async (email, otp) => {
  const data = await redis.get(`temp_user:${email}`);
  
  if (!data) {
    throw { statusCode: 400, message: 'OTP expired or invalid email' };
  }

  const userData = JSON.parse(data);

  if (userData.otp !== otp) {
    throw { statusCode: 400, message: 'Invalid OTP' };
  }

  // Create user in MongoDB
  const user = await User.create({
    fullName: userData.fullName,
    email: userData.email,
    password: userData.password,
    role: userData.role,
    isEmailVerified: true
  });

  const accessToken = generateAccessToken(user._id, user.role, user.email);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  user.lastLogin = Date.now();
  await user.save();

  // Delete from Redis
  await redis.del(`temp_user:${email}`);

  return { user, accessToken, refreshToken };
};

exports.loginUser = async (email, password) => {
  const normalizedEmail = email.toLowerCase();

  // Check for user
  const user = await User.findOne({ email: normalizedEmail }).select('+password');
  if (!user) {
    throw { statusCode: 401, message: 'Invalid credentials' };
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw { statusCode: 401, message: 'Invalid credentials' };
  }

  // Check if active
  if (!user.isActive) {
    throw { statusCode: 401, message: 'Your account has been deactivated' };
  }

  const accessToken = generateAccessToken(user._id, user.role, user.email);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  user.lastLogin = Date.now();
  await user.save();

  return { user, accessToken, refreshToken };
};

exports.logoutUser = async (userId) => {
  const user = await User.findById(userId);
  if (user) {
    user.refreshToken = '';
    await user.save();
  }
};

exports.refreshAccessToken = async (token) => {
  if (!token) {
    throw { statusCode: 401, message: 'Not authorized, no refresh token' };
  }

  const user = await User.findOne({ refreshToken: token });
  if (!user) {
    throw { statusCode: 401, message: 'Not authorized, invalid refresh token' };
  }

  const accessToken = generateAccessToken(user._id, user.role, user.email);
  return { accessToken };
};

exports.forgotPassword = async (email, clientUrl) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw { statusCode: 404, message: 'There is no user with that email' };
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });

    throw { statusCode: 500, message: 'Email could not be sent' };
  }
};

exports.resetPassword = async (resetToken, newPassword) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw { statusCode: 400, message: 'Invalid or expired token' };
  }

  // Set new password
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  
  // Invalidate refresh tokens
  user.refreshToken = '';
  
  await user.save();
};
