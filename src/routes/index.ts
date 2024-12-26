import type { BskyAgent } from '@atproto/api';
import { Hono } from 'hono';
import { handleEarthquake, handleTsunami } from '~/messages/handle';

export default function createRoutes(agent: BskyAgent | undefined) {
  const routes = new Hono();

  // Health check
  routes.get('/health', (c) => {
    return c.text('OK');
  });

  // Webhook endpoints
  routes.post('/webhook/earthquake', async (c) => {
    const data = await c.req.json();
    await handleEarthquake(data, agent);
    return c.json({ status: 'ok' });
  });

  routes.post('/webhook/tsunami', async (c) => {
    const data = await c.req.json();
    await handleTsunami(data, agent);
    return c.json({ status: 'ok' });
  });

  return routes;
}
