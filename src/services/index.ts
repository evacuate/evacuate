import env from '~/env';

export function availableServices(): string[] {
  const serviceConditions: { [key: string]: boolean } = {
    Bluesky:
      env.BLUESKY_EMAIL !== undefined && env.BLUESKY_PASSWORD !== undefined,
    Mastodon: env.MASTODON_ACCESS_TOKEN !== undefined,
    Nostr: env.NOSTR_PRIVATE_KEY !== undefined,
    Webhook: env.WEBHOOK_URL !== undefined,
    Slack:
      env.SLACK_BOT_TOKEN !== undefined && env.SLACK_CHANNEL_ID !== undefined,
    Telegram:
      env.TELEGRAM_BOT_TOKEN !== undefined &&
      env.TELEGRAM_CHAT_ID !== undefined,
  };

  return Object.keys(serviceConditions).filter(
    (service) => serviceConditions[service],
  );
}
