import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface Env {
  EMAIL: string;
  PASSWORD: string;
  NODE_ENV?: 'development' | 'production';
}

function validateEnvVar(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  return value;
}

const env: Env = {
  EMAIL: validateEnvVar('EMAIL', process.env.EMAIL),
  PASSWORD: validateEnvVar('PASSWORD', process.env.PASSWORD),
  NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
};

export default env;
