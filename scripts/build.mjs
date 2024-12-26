import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  entryPoints: [path.resolve(__dirname, '../src/index.ts')],
  outfile: path.resolve(__dirname, '../dist/index.mjs'),
  platform: 'node',
  format: 'esm',
  bundle: true,
  minify: true,
  external: ['newrelic'],
};

build(options).catch((err) => {
  console.error(err);
  process.exit(1);
});
