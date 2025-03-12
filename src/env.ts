import dotenv from 'dotenv';
import { Language } from './types/translate';

// Load environment variables
dotenv.config();

const getScale = () => {
  const value = Number(process.env.EARTHQUAKE_MINIMUM_SCALE);
  const validScales = [0, 10, 20, 30, 40, 45, 50, 55, 60, 70];
  if (!validScales.includes(value)) {
    throw new Error(
      'EARTHQUAKE_MINIMUM_SCALE must be between 0 and 70 in increments of 10',
    );
  }
  return value;
};

interface Env {
  VERSION?: string | undefined;
  PORT?: string | undefined;
  PRODUCTION_LOGGING?: boolean | undefined;
  NODE_ENV?: 'development' | 'production';
  ENABLE_LOGGER: boolean | undefined;
  EARTHQUAKE_MINIMUM_SCALE?: number | undefined;
  WEBSOCKET_URL?: string | undefined;
  LANGUAGE: Language;

  BLUESKY_EMAIL?: string | undefined;
  BLUESKY_PASSWORD?: string | undefined;
  MASTODON_URL?: string | undefined;
  MASTODON_ACCESS_TOKEN?: string | undefined;
  NOSTR_PRIVATE_KEY?: string | undefined;
  WEBHOOK_URL?: string | undefined;
  SLACK_BOT_TOKEN?: string | undefined;
  SLACK_CHANNEL_ID?: string | undefined;
  TELEGRAM_BOT_TOKEN?: string | undefined;
  TELEGRAM_CHAT_ID?: string | undefined;
}

const env: Env = {
  VERSION: process.env.npm_package_version,
  PORT: process.env.PORT,
  PRODUCTION_LOGGING: process.env.PRODUCTION_LOGGING === 'true',
  NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
  ENABLE_LOGGER: process.env.ENABLE_LOGGER
    ? process.env.ENABLE_LOGGER === 'true'
    : true,
  EARTHQUAKE_MINIMUM_SCALE: getScale(),
  WEBSOCKET_URL: process.env.WEBSOCKET_URL,
  LANGUAGE: (process.env.LANGUAGE as Language) || ('en' as Language),

  BLUESKY_EMAIL: process.env.BLUESKY_EMAIL,
  BLUESKY_PASSWORD: process.env.BLUESKY_PASSWORD,
  MASTODON_URL: process.env.MASTODON_URL,
  MASTODON_ACCESS_TOKEN: process.env.MASTODON_ACCESS_TOKEN,
  NOSTR_PRIVATE_KEY: process.env.NOSTR_PRIVATE_KEY,
  WEBHOOK_URL: process.env.WEBHOOK_URL,
  SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN,
  SLACK_CHANNEL_ID: process.env.SLACK_CHANNEL_ID,
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
};

export default env;
