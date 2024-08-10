import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface Env {
  EMAIL: string;
  PASSWORD: string;
  NODE_ENV?: 'development' | 'production';
}

const env: Env = {
  EMAIL: process.env.EMAIL || '',
  PASSWORD: process.env.PASSWORD || '',
  NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
};

export default env;
