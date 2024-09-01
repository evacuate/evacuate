import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface Env {
  BLUESKY_EMAIL: string;
  BLUESKY_PASSWORD: string;
  MASTODON_URL?: string | undefined;
  MASTODON_ACCESS_TOKEN?: string | undefined;
  NODE_ENV?: 'development' | 'production';
  NOSTR_PRIVATE_KEY?: string | undefined;
}

function validateEnvVar(name: string): string {
  const value = process.env[name];
  if (value === undefined) {
    throw new Error(`Environment variable ${name} is not set`);
  }

  return value;
}

const env: Env = {
  BLUESKY_EMAIL: validateEnvVar('BLUESKY_EMAIL'),
  BLUESKY_PASSWORD: validateEnvVar('BLUESKY_PASSWORD'),
  MASTODON_URL: process.env.MASTODON_URL,
  MASTODON_ACCESS_TOKEN: process.env.MASTODON_ACCESS_TOKEN,
  NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
  NOSTR_PRIVATE_KEY: process.env.NOSTR_PRIVATE_KEY,
};

export default env;
