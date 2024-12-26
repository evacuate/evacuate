import { config } from 'dotenv';

config();

interface Env {
  VERSION: string;
  PORT: number;
  PRODUCTION_LOGGING: boolean;
  NODE_ENV: 'development' | 'production' | 'test';
  EARTHQUAKE_MINIMUM_SCALE: number;

  // SNS auth
  BLUESKY_IDENTIFIER?: string;
  BLUESKY_PASSWORD?: string;
  MASTODON_URL?: string;
  MASTODON_ACCESS_TOKEN?: string;
  NOSTR_PRIVATE_KEY?: string;
  SLACK_BOT_TOKEN?: string;
  SLACK_CHANNEL_ID?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
}

/**
 * Parse a string value as a number
 */
function parseNumber(value: string): number {
  const num = Number(value);
  if (isNaN(num)) {
    throw new Error(`Invalid number: ${value}`);
  }
  return num;
}

/**
 * Get and type check environment variables
 */
function getEnvValue<T>(
  key: string,
  transform?: (value: string) => T,
  required = false,
): T | undefined {
  const value = process.env[key];
  if (value === undefined) {
    if (required) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return undefined;
  }
  return transform ? transform(value) : (value as unknown as T);
}

const env: Env = {
  VERSION: getEnvValue('npm_package_version', undefined, true) ?? '0.0.0',
  PORT: getEnvValue('PORT', parseNumber, true) ?? 3000,
  PRODUCTION_LOGGING:
    getEnvValue('PRODUCTION_LOGGING', (value) => value === 'true') ?? false,
  NODE_ENV: (getEnvValue('NODE_ENV') as Env['NODE_ENV']) ?? 'development',
  EARTHQUAKE_MINIMUM_SCALE:
    getEnvValue(
      'EARTHQUAKE_MINIMUM_SCALE',
      (value) => {
        const num = parseNumber(value);
        if (num < 0 || num > 7) {
          throw new Error('EARTHQUAKE_MINIMUM_SCALE must be between 0 and 7');
        }
        return num;
      },
      true,
    ) ?? 0,

  // SNS auth
  BLUESKY_IDENTIFIER: getEnvValue('BLUESKY_IDENTIFIER'),
  BLUESKY_PASSWORD: getEnvValue('BLUESKY_PASSWORD'),
  MASTODON_URL: getEnvValue('MASTODON_URL'),
  MASTODON_ACCESS_TOKEN: getEnvValue('MASTODON_ACCESS_TOKEN'),
  NOSTR_PRIVATE_KEY: getEnvValue('NOSTR_PRIVATE_KEY'),
  SLACK_BOT_TOKEN: getEnvValue('SLACK_BOT_TOKEN'),
  SLACK_CHANNEL_ID: getEnvValue('SLACK_CHANNEL_ID'),
  TELEGRAM_BOT_TOKEN: getEnvValue('TELEGRAM_BOT_TOKEN'),
  TELEGRAM_CHAT_ID: getEnvValue('TELEGRAM_CHAT_ID'),
};

export default env;
