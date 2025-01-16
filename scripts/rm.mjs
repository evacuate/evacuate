import { existsSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
const dirPath = resolve(dirname(new URL(import.meta.url).pathname), '../dist');
existsSync(dirPath)
  ? rmSync(dirPath, { recursive: true, force: true })
  : console.log('Directory does not exist:', dirPath);
