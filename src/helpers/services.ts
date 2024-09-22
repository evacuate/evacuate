import env from '../env';

export default function services(): string[] {
  const serviceConditions: { [key: string]: boolean } = {
    Bluesky:
      env.BLUESKY_EMAIL !== undefined && env.BLUESKY_PASSWORD !== undefined,
    Mastodon: env.MASTODON_ACCESS_TOKEN !== undefined,
    Nostr: env.NOSTR_PRIVATE_KEY !== undefined,
    Webhook: env.WEBHOOK_URL !== undefined,
  };

  return Object.keys(serviceConditions).filter(
    (service) => serviceConditions[service],
  );
}
