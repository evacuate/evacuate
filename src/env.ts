import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface Env {
  EMAIL: string;
  PASSWORD: string;
  DEEPL_API_KEY: string;
}

const env: Env = {
  EMAIL: process.env.EMAIL || '',
  PASSWORD: process.env.PASSWORD || '',
  DEEPL_API_KEY: process.env.DEEPL_API_KEY || '',
};

export default env;
