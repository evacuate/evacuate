import { BskyAgent } from '@atproto/api';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger as honoLogger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import pino from 'pino';
import env from '~/env';
import { errorHandler } from '~/middleware/errorHandler';
import createRoutes from '~/routes';

// Environment variables
const BLUESKY_IDENTIFIER = env.BLUESKY_IDENTIFIER;
const BLUESKY_PASSWORD = env.BLUESKY_PASSWORD;
const NODE_ENV = env.NODE_ENV;

// Create logger
const logger = pino({
  level: env.PRODUCTION_LOGGING ? 'info' : 'debug',
  transport: env.PRODUCTION_LOGGING
    ? undefined
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
        },
      },
});

// Export logger for use in other modules
export async function getLogger() {
  return logger;
}

// Create Bluesky agent
let agent: BskyAgent | undefined;

if (BLUESKY_IDENTIFIER && BLUESKY_PASSWORD) {
  agent = new BskyAgent({
    service: 'https://bsky.social',
  });

  try {
    await agent.login({
      identifier: BLUESKY_IDENTIFIER,
      password: BLUESKY_PASSWORD,
    });
    logger.info('Successfully logged in to Bluesky');
  } catch (error) {
    logger.error('Failed to login to Bluesky:', error);
    agent = undefined;
  }
}

// Create Hono app
const app = new Hono();

// Middleware
app.use('*', honoLogger());
app.use('*', prettyJSON());
app.use('*', secureHeaders());
app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['POST'],
    allowHeaders: ['Content-Type', 'x-request-id'],
    maxAge: 86400,
  }),
);

// Error handler
app.onError(errorHandler);

// Mount routes
app.route('', createRoutes(agent));

// Start server
const port = env.PORT;
logger.info(`Starting server on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
