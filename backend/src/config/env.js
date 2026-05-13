const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const requiredEnvVars = [
  'MONGO_URI',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'ACCESS_TOKEN_EXPIRES',
  'REFRESH_TOKEN_EXPIRES',
];

const checkEnvVars = () => {
  const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
  }
};

module.exports = { checkEnvVars };
