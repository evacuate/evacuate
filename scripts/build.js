const { build } = require('esbuild');
const path = require('path');

const options = {
  entryPoints: [path.resolve(__dirname, '../src/index.ts')],
  outfile: path.resolve(__dirname, '../dist/index.js'),
  platform: 'node',
  format: 'cjs',
  bundle: true,
  minify: true,
};

build(options).catch((err) => {
  process.stderr.write(err.stderr);
  process.exit(1);
});
