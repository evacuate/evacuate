import dotenv from 'dotenv';
import { Language } from './types/translate';

// Load environment variables
dotenv.config();

const getScale = () => {
  const value = Number(process.env.EARTHQUAKE_MINIMUM_SCALE);
  const validScales = [0, 10, 20, 30, 40, 45, 50, 55, 60, 70];
  if (!validScales.includes(value)) {
    return 0;
  }
  return value;
};

interface Env {
  HASHTAGS?: string | undefined;
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

  // Map settings
  ENABLE_MAP_GENERATION: boolean;
  MAP_OUTPUT_DIR: string;
  MAP_WIDTH: number;
  MAP_HEIGHT: number;
  MAP_BACKGROUND_COLOR: string;
  MAP_JAPAN_COLOR: string;
  MAP_EPICENTER_COLOR: string;
  MAP_ATTRIBUTION_TEXT?: string | undefined;
  MAP_INTENSITY_SCALE_1_COLOR: string;
  MAP_INTENSITY_SCALE_2_COLOR: string;
  MAP_INTENSITY_SCALE_3_COLOR: string;
  MAP_INTENSITY_SCALE_4_COLOR: string;
  MAP_INTENSITY_SCALE_5_LOWER_COLOR: string;
  MAP_INTENSITY_SCALE_5_UPPER_COLOR: string;
  MAP_INTENSITY_SCALE_6_LOWER_COLOR: string;
  MAP_INTENSITY_SCALE_6_UPPER_COLOR: string;
  MAP_INTENSITY_SCALE_7_COLOR: string;
}

const env: Env = {
  HASHTAGS: process.env.HASHTAGS,
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

  // Map settings
  ENABLE_MAP_GENERATION: process.env.ENABLE_MAP_GENERATION === 'true',
  MAP_OUTPUT_DIR: process.env.MAP_OUTPUT_DIR || './earthquake_images',
  MAP_WIDTH: Number(process.env.MAP_WIDTH || '1280'),
  MAP_HEIGHT: Number(process.env.MAP_HEIGHT || '720'),
  MAP_BACKGROUND_COLOR: process.env.MAP_BACKGROUND_COLOR || '#F0F0F0',
  MAP_JAPAN_COLOR: process.env.MAP_JAPAN_COLOR || '#CCCCCC',
  MAP_EPICENTER_COLOR: process.env.MAP_EPICENTER_COLOR || '#FF0000',
  MAP_ATTRIBUTION_TEXT: process.env.MAP_ATTRIBUTION_TEXT || 'Map data: GeoJSON',
  MAP_INTENSITY_SCALE_1_COLOR:
    process.env.MAP_INTENSITY_SCALE_1_COLOR || '#FFFFFF',
  MAP_INTENSITY_SCALE_2_COLOR:
    process.env.MAP_INTENSITY_SCALE_2_COLOR || '#FFFF00',
  MAP_INTENSITY_SCALE_3_COLOR:
    process.env.MAP_INTENSITY_SCALE_3_COLOR || '#FFCC00',
  MAP_INTENSITY_SCALE_4_COLOR:
    process.env.MAP_INTENSITY_SCALE_4_COLOR || '#FF9900',
  MAP_INTENSITY_SCALE_5_LOWER_COLOR:
    process.env.MAP_INTENSITY_SCALE_5_LOWER_COLOR || '#FF6600',
  MAP_INTENSITY_SCALE_5_UPPER_COLOR:
    process.env.MAP_INTENSITY_SCALE_5_UPPER_COLOR || '#FF3300',
  MAP_INTENSITY_SCALE_6_LOWER_COLOR:
    process.env.MAP_INTENSITY_SCALE_6_LOWER_COLOR || '#FF0000',
  MAP_INTENSITY_SCALE_6_UPPER_COLOR:
    process.env.MAP_INTENSITY_SCALE_6_UPPER_COLOR || '#CC0000',
  MAP_INTENSITY_SCALE_7_COLOR:
    process.env.MAP_INTENSITY_SCALE_7_COLOR || '#990000',
};

export default env;
