import fs from 'fs';
import path from 'path';
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const distPath = path.resolve(__dirname, '../dist');
fs.existsSync(distPath);
