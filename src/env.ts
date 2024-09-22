import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface Env {
  BLUESKY_EMAIL?: string | undefined;
  BLUESKY_PASSWORD?: string | undefined;
  MASTODON_URL?: string | undefined;
  MASTODON_ACCESS_TOKEN?: string | undefined;
  NODE_ENV?: 'development' | 'production';
  NOSTR_PRIVATE_KEY?: string | undefined;
  WEBHOOK_URL?: string | undefined;
}

const env: Env = {
  BLUESKY_EMAIL: process.env.BLUESKY_EMAIL,
  BLUESKY_PASSWORD: process.env.BLUESKY_PASSWORD,
  MASTODON_URL: process.env.MASTODON_URL,
  MASTODON_ACCESS_TOKEN: process.env.MASTODON_ACCESS_TOKEN,
  NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
  NOSTR_PRIVATE_KEY: process.env.NOSTR_PRIVATE_KEY,
  WEBHOOK_URL: process.env.WEBHOOK_URL,
};

export default env;
