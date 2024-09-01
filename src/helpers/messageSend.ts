import { createRestAPIClient } from 'masto';
import { type AtpAgent, RichText } from '@atproto/api';
import { finalizeEvent, getPublicKey } from 'nostr-tools/pure';
import { Relay, useWebSocketImplementation } from 'nostr-tools/relay';
import * as nip19 from 'nostr-tools/nip19';
import env from '../env';
import WebSocket from 'ws';
import pino from 'pino';

useWebSocketImplementation(WebSocket);

const logger = pino({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info', // Set log level based on environment
});

const MASTODON_URL: string = env.MASTODON_URL ?? 'https://mastodon.social';

// Define a list of relays
const NOSTR_RELAYS = [
  'wss://relay.damus.io',
  'wss://yabu.me',
  'wss://nostr-pub.wellorder.net',
  'wss://nos.lol',
  // Add as needed
];

export default async function messageSend(
  text: string,
  agent: AtpAgent,
): Promise<void> {
  // Post to Bluesky
  const rt = new RichText({ text });
  await rt.detectFacets(agent);

  await agent.post({
    text: rt.text,
    facets: rt.facets,
    langs: ['en', 'ja'],
  });

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
