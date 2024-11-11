import { Hono } from 'hono';
import env from '~/env';

const version = env.VERSION || 'Unknown';

function uptime(): string {
  const uptime = process.uptime();
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  return `${days} days, ${hours} hours, ${minutes} minutes`;
}

const app = new Hono();
app.get('/', (c) => {
  const status = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: uptime(),
    version: version,
  };
  return c.json(status);
});

export default app;
