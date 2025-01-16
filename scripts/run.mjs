import { spawn } from 'node:child_process';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const isProductionLogging = process.env.PRODUCTION_LOGGING !== 'false';
const command = isProductionLogging
  ? ['node', '-r', 'newrelic', 'dist/index.cjs']
  : ['node', 'dist/index.cjs'];

const child = spawn(command[0], command.slice(1), {
  stdio: 'inherit',
});

child.on('error', (error) => {
  console.error('Failed to start process:', error);
  process.exit(1);
});

process.on('SIGTERM', () => {
  child.kill('SIGTERM');
});

process.on('SIGINT', () => {
  child.kill('SIGINT');
});
