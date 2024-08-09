import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface Env {
  EMAIL: string;
  PASSWORD: string;
}

const env: Env = {
  EMAIL: process.env.EMAIL || '',
  PASSWORD: process.env.PASSWORD || '',
};

export default env;
