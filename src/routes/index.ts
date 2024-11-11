import { serve as serveHono } from '@hono/node-server';
import { Hono } from 'hono';
import env from '~/env';

// Routes
import health from '~/routes/health';

export default function serve(): void {
  const app = new Hono();
  app.get('/', (c) => c.redirect('/health'));

  // Health check
  app.route('/health', health);

  serveHono({
    fetch: app.fetch,
    port: Number.parseInt(env.PORT ?? '3000', 10),
  });
}
