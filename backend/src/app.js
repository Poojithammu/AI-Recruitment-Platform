const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middleware/error.middleware');

const app = express();

app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Basic route
app.get('/', (req, res) => {
  res.send('AI Hiring System API is running...');
});

// Routes
app.use('/api/auth', authLimiter, require('./routes/auth.routes'));
app.use('/api/hiring', require('./routes/hiring.routes'));
app.use('/api/profiles', require('./routes/profileRoutes'));
app.use('/api/requirements', require('./routes/requirementRoutes'));
app.use('/api/recruiter/dashboard', require('./routes/recruiterDashboardRoutes'));
app.use('/api/companies', require('./routes/companyRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/user/dashboard', require('./routes/userDashboardRoutes'));

// Error handling middleware
app.use(errorHandler);

module.exports = app;
