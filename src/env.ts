import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface Env {
  BLUESKY_EMAIL: string;
  BLUESKY_PASSWORD: string;
  NODE_ENV?: 'development' | 'production';
}

function validateEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  return value;
}

const env: Env = {
  BLUESKY_EMAIL: validateEnvVar('BLUESKY_EMAIL'),
  BLUESKY_PASSWORD: validateEnvVar('BLUESKY_PASSWORD'),
  NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
};

export default env;
