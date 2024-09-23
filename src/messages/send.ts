import { WebClient } from '@slack/web-api';
import https from 'node:https';
import { type AtpAgent, RichText } from '@atproto/api';
import nrPino from '@newrelic/pino-enricher';
import { createRestAPIClient } from 'masto';
import * as nip19 from 'nostr-tools/nip19';
import { finalizeEvent, getPublicKey } from 'nostr-tools/pure';
import { Relay, useWebSocketImplementation } from 'nostr-tools/relay';
import pino from 'pino';
import WebSocket from 'ws';
import env from '../env';

useWebSocketImplementation(WebSocket);

const logger = pino(nrPino());
const slackClient = new WebClient(env.SLACK_BOT_TOKEN); // Slack Web API Client
const MASTODON_URL: string = env.MASTODON_URL ?? 'https://mastodon.social';

// Define a list of relays
const NOSTR_RELAYS = [
  'wss://relay.damus.io',
  'wss://yabu.me',
  'wss://nostr-pub.wellorder.net',
  'wss://nos.lol',
  // Add as needed
];

export default async function sendMessage(
  text: string,
  agent: AtpAgent | undefined,
): Promise<void> {
  // Post to Bluesky
  if (agent?.session !== undefined) {
    const rt = new RichText({ text });
    await rt.detectFacets(agent);

    await agent.post({
      text: rt.text,
      facets: rt.facets,
      langs: ['en', 'ja'],
    });
  }

  // Post to Mastodon
  if (env.MASTODON_ACCESS_TOKEN !== undefined) {
    const masto = createRestAPIClient({
      url: MASTODON_URL,
      accessToken: env.MASTODON_ACCESS_TOKEN,
    });

    // Post to Mastodon
    await masto.v1.statuses.create({
      status: text,
      visibility: 'public',
    });
  }

  // Post to Webhook
  if (env.WEBHOOK_URL !== undefined) {
    try {
      const url = new URL(env.WEBHOOK_URL);

      // Setting options for POST data
      const options = {
        hostname: url.hostname,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // Create a request
      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          logger.info(`Webhook status code: ${res.statusCode}`);
        });
      });

      req.on('error', (e) => {
        logger.error(`Error during webhook message send: ${e.message}`);
      });

      // Data to be sent to Webhook
      const payload = JSON.stringify({
        content: text.replace('#evacuate', ''),
      });

      // Write data to request
      req.write(payload);
      req.end();

      logger.info('Message successfully sent to webhook');
    } catch (webhookError) {
      logger.error('Error during webhook message send:', webhookError);
    }
  }

  // Post to Slack
  if (env.SLACK_BOT_TOKEN !== undefined && env.SLACK_CHANNEL_ID !== undefined) {
    const lines = text.split('\n').filter((line) => line.trim() !== '');

    const maxLine = lines.find((line) =>
      line.startsWith('Maximum Seismic Intensity'),
    );
    const max = maxLine
      ? Number.parseInt(maxLine.replace('Maximum Seismic Intensity ', ''), 10)
      : null;

    const area = new Map<string, string>();

    for (const line of lines.slice(2)) {
      const match = line.match(/\[Seismic Intensity (\d)\] (.+)/);
      if (match) {
        const intensity = match[1];
        const regions = match[2];
        area.set(intensity, regions);
      }
    }

    const attachments = [
      {
        fallback: `${lines[0]}: Maximum Seismic Intensity ${max}`,
        color: '#228BFF',
        title: lines[0],
        text: `Maximum Seismic Intensity ${max}`,
        fields: [
          ...Array.from(area.entries()).map(([intensity, regions]) => ({
            title: `Seismic Intensity ${intensity}`,
            value: regions,
            short: true,
          })),
        ],
      },
    ];

    try {
      await slackClient.chat.postMessage({
        channel: env.SLACK_CHANNEL_ID,
        attachments: attachments,
      });
      logger.info('Message successfully sent to Slack');
    } catch (slackError) {
      logger.error('Error during Slack message send:', slackError);
    }
  }

  if (env.NOSTR_PRIVATE_KEY !== undefined) {
    try {
      // Post to Nostr
      const decodeResult = nip19.decode(env.NOSTR_PRIVATE_KEY);
      const sk = decodeResult.data as Uint8Array;
      const pk = getPublicKey(sk);

      const event = {
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: text,
        pubkey: pk,
      };

      const signedEvent = finalizeEvent(event, sk);

      let successfulRelays = 0;

      // Send a message to each relay
      for (const relayUrl of NOSTR_RELAYS) {
        try {
          const relay = await Relay.connect(relayUrl);

          await relay.connect();
          await relay.publish(signedEvent);
          successfulRelays++;

          relay.close();
        } catch (relayError) {
          logger.error(
            `Error during Nostr message send to ${relayUrl}`,
            relayError,
          );
        }
      }

      logger.info(
        `Submission was successful for ${successfulRelays} out of ${NOSTR_RELAYS.length} relays`,
      );
    } catch (error) {
      logger.error('Error during Nostr message send:', error);
    }
  }
}