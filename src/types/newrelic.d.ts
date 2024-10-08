declare module '@newrelic/pino-enricher' {
  import type { Logger } from 'pino';
  type EnricherOptions = Record<string, unknown>;
  export default function pinoEnricher(options?: EnricherOptions): Logger;
}
