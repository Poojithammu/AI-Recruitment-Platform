const express = require('express');
const { body } = require('express-validator');
const {
  register,
  verifyEmail,
  login,
  logout,
  refresh,
  getMe,
  updateMe,
  forgotPassword,
  resetPassword
} = require('../controllers/auth.controller');
const { authenticateUser } = require('../middleware/auth.middleware');

const router = express.Router();

const registerValidation = [
  body('fullName')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Full name must be at least 3 characters long'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please include a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character'),
  body('role')
    .optional()
    .isIn(['user', 'recruiter', 'analyst'])
    .withMessage('Invalid role specified')
];

const loginValidation = [
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').exists().withMessage('Password is required')
];

const resetPasswordValidation = [
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character')
];

// Routes
router.post('/register', registerValidation, register);
router.post('/verify-email', verifyEmail);
router.post('/login', loginValidation, login);
router.post('/logout', authenticateUser, logout);
router.post('/refresh', refresh);
router.get('/me', authenticateUser, getMe);
router.put('/me', authenticateUser, updateMe);
router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('Please include a valid email')],
  forgotPassword
);
router.post('/reset-password/:token', resetPasswordValidation, resetPassword);

module.exports = router;
