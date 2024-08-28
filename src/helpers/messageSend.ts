import { createRestAPIClient } from 'masto';
import { type AtpAgent, RichText } from '@atproto/api';
import 'websocket-polyfill';
import env from '../env';

const MASTODON_URL: string = env.MASTODON_URL ?? 'https://mastodon.social';
const MASTODON_ACCESS_TOKEN: string = env.MASTODON_ACCESS_TOKEN;

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

  const masto = createRestAPIClient({
    url: MASTODON_URL,
    accessToken: MASTODON_ACCESS_TOKEN,
  });

  // Post to Mastodon
  await masto.v1.statuses.create({
    status: text,
    visibility: 'public',
  });

  try {
    // This writing style because it does not import well.
    const { Relay, finalizeEvent, getPublicKey } = await import('nostr-tools');

    // Post to Nostr
    const relay = await Relay.connect('wss://relay.nostr.info'); // Replace with your relay URL
    console.log(`Connected to Nostr relay at ${relay.url}`);

    await relay.connect();

    const sk = new TextEncoder().encode(env.NOSTR_PRIVATE_KEY);
    const pk = getPublicKey(sk);

    const event = {
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: text,
      pubkey: pk,
    };

    const signedEvent = finalizeEvent(event, sk);
    await relay.publish(signedEvent);
    console.log('Message sent to Nostr');

    relay.close();
  } catch (error) {
    console.error('Error during Nostr message send:', error);
  }
}
