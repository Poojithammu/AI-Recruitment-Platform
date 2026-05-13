const authService = require('../services/auth.service');
const { validationResult } = require('express-validator');

const setTokenCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 
  };
  res.cookie('refreshToken', token, cookieOptions);
};

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation Error', errors: errors.array() });
    }

    const result = await authService.registerUser(req.body);

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const { user, accessToken, refreshToken } = await authService.verifyOTP(email, otp);
    setTokenCookie(res, refreshToken);

    res.status(201).json({
      success: true,
      message: 'Email verified and registration complete',
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      },
      accessToken
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation Error', errors: errors.array() });
    }

    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.loginUser(email, password);
    setTokenCookie(res, refreshToken);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      },
      accessToken
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    await authService.logoutUser(req.user._id);
    res.cookie('refreshToken', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });
    
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
      errors: []
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
exports.refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const { accessToken } = await authService.refreshAccessToken(refreshToken);

    res.status(200).json({
      success: true,
      accessToken
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = req.user;
    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    const { fullName, email } = req.body;
    const user = req.user;

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;

    await user.save();

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation Error', errors: errors.array() });
    }

    const { email } = req.body;
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    
    await authService.forgotPassword(email, clientUrl);

    res.status(200).json({
      success: true,
      message: 'Email sent',
      errors: []
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation Error', errors: errors.array() });
    }

    const { password } = req.body;
    await authService.resetPassword(req.params.token, password);

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
      errors: []
    });
  } catch (error) {
    next(error);
  }
};
