const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateUser = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route', errors: [] });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Get user from the token
    req.user = await User.findById(decoded.userId).select('-password');
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found', errors: [] });
    }
    
    if (!req.user.isActive) {
      return res.status(401).json({ success: false, message: 'Account is deactivated', errors: [] });
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed', errors: [] });
  }
};

module.exports = { authenticateUser };
