import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = [
  'PORT',
  'NODE_ENV',
  'MONGODB_URI',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'CLIENT_ORIGIN'
];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(
    `[FATAL CONFIG ERROR] Missing required environment variable(s): ${missingVars.join(', ')}. Please define them in your .env file.`
  );
}

export const env = {
  PORT: parseInt(process.env.PORT, 10),
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI,
  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    API_KEY: process.env.CLOUDINARY_API_KEY,
    API_SECRET: process.env.CLOUDINARY_API_SECRET
  },
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN
};
