import https from 'https';
import type { AtpAgent } from '@atproto/api';
import { finalizeEvent, getPublicKey } from 'nostr-tools';
import { decode } from 'nostr-tools/nip19';
import { Relay } from 'nostr-tools/relay';
import { getLogger } from '~/index';
import { MessageError, NetworkError, RateLimitError } from '~/types/errors';
import { NOSTR_RELAYS } from '../constants';

/**
 * Post a message to Bluesky
 */
async function postToBluesky(text: string, agent: AtpAgent): Promise<void> {
  try {
    await agent.post({
      text,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    throw new MessageError(
      'Failed to post to Bluesky',
      'bluesky',
      error instanceof Error ? error : new Error(String(error)),
    );
  }
}

/**
 * Post a message to Mastodon
 */
async function postToMastodon(text: string): Promise<void> {
  try {
    // TODO: Implement Mastodon posting
    throw new Error('Not implemented');
  } catch (error) {
    throw new MessageError(
      'Failed to post to Mastodon',
      'mastodon',
      error instanceof Error ? error : new Error(String(error)),
    );
  }
}

/**
 * Post a message to Nostr
 */
async function postToNostr(text: string): Promise<void> {
  try {
    const privateKeyStr = process.env.NOSTR_PRIVATE_KEY ?? '';
    const { type, data } = decode(privateKeyStr);
    if (type !== 'nsec') {
      throw new Error('Invalid private key format. Expected nsec format.');
    }

    const privateKey = data as Uint8Array;
    const publicKey = getPublicKey(privateKey);

    const event = {
      kind: 1,
      pubkey: publicKey,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: text,
    };

    const signedEvent = finalizeEvent(event, privateKey);
    const relays = NOSTR_RELAYS.map((url: string) => new Relay(url));

    await Promise.all(
      relays.map(async (relay: Relay) => {
        try {
          await relay.connect();
          await relay.publish(signedEvent);
          await relay.close();
        } catch (error) {
          console.warn(`Failed to publish to relay ${relay.url}:`, error);
        }
      }),
    );
  } catch (error) {
    throw new MessageError(
      'Failed to post to Nostr',
      'nostr',
      error instanceof Error ? error : new Error(String(error)),
    );
  }
}

/**
 * Post a message to Slack
 */
async function postToSlack(text: string): Promise<void> {
  try {
    // TODO: Implement Slack posting
    throw new Error('Not implemented');
  } catch (error) {
    throw new MessageError(
      'Failed to post to Slack',
      'slack',
      error instanceof Error ? error : new Error(String(error)),
    );
  }
}

/**
 * Post a message to Telegram
 */
async function postToTelegram(text: string): Promise<void> {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      throw new Error('Telegram credentials not configured');
    }

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const data = JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    });

    await new Promise<void>((resolve, reject) => {
      const req = https.request(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data),
          },
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            if (res.statusCode === 429) {
              const retryAfter = parseInt(
                res.headers['retry-after'] || '60',
                10,
              );
              reject(
                new RateLimitError(
                  'Rate limit exceeded for Telegram',
                  retryAfter,
                  'telegram',
                ),
              );
            } else if (res.statusCode !== 200) {
              reject(
                new NetworkError(
                  'Failed to post to Telegram',
                  new Error(data),
                  url,
                ),
              );
            } else {
              resolve(undefined);
            }
          });
        },
      );

      req.on('error', (error) => {
        reject(new NetworkError('Failed to connect to Telegram', error, url));
      });

      req.write(data);
      req.end();
    });
  } catch (error) {
    throw new MessageError(
      'Failed to post to Telegram',
      'telegram',
      error instanceof Error ? error : new Error(String(error)),
    );
  }
}

/**
 * Send a message to all configured platforms
 */
export default async function sendMessage(
  text: string,
  agent: AtpAgent | undefined,
): Promise<void> {
  const logger = await getLogger();
  const errors: Error[] = [];

  // Post to Bluesky
  if (agent) {
    try {
      await postToBluesky(text, agent);
      logger.info('Posted to Bluesky successfully');
    } catch (error) {
      if (error instanceof Error) {
        errors.push(error);
      }
    }
  }

  // Post to Mastodon
  try {
    await postToMastodon(text);
    logger.info('Posted to Mastodon successfully');
  } catch (error) {
    if (error instanceof Error) {
      errors.push(error);
    }
  }

  // Post to Nostr
  try {
    await postToNostr(text);
    logger.info('Posted to Nostr successfully');
  } catch (error) {
    if (error instanceof Error) {
      errors.push(error);
    }
  }

  // Post to Slack
  try {
    await postToSlack(text);
    logger.info('Posted to Slack successfully');
  } catch (error) {
    if (error instanceof Error) {
      errors.push(error);
    }
  }

  // Post to Telegram
  try {
    await postToTelegram(text);
    logger.info('Posted to Telegram successfully');
  } catch (error) {
    if (error instanceof Error) {
      errors.push(error);
    }
  }

  if (errors.length > 0) {
    logger.error('Errors occurred while sending messages:', {
      errors: errors.map((e) => ({
        name: e.name,
        message: e.message,
        stack: e.stack,
      })),
    });
  }
}
