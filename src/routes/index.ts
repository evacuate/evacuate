import { serve as serveHono } from '@hono/node-server';
import { Hono } from 'hono';
import env from '~/env';

// Routes
import health from '~/routes/health';

export default function serve(): void {
  const app = new Hono();
  app.get('/', (c) => {
    c.header('X-Robots-Tag', 'noindex');
    return c.redirect('/health');
  });

  // Health check
  app.route('/health', health);

  // Add middleware to set noindex header for all routes
  app.use('*', async (c, next) => {
    c.header('X-Robots-Tag', 'noindex');
    await next();
  });

  serveHono({
    fetch: app.fetch,
    port: Number.parseInt(env.PORT ?? '3000', 10),
  });
}
