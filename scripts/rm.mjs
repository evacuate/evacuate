import { existsSync, rmSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dirPath = resolve(__dirname, "../dist");

existsSync(dirPath)
  ? rmSync(dirPath, { recursive: true, force: true })
  : console.log("Directory does not exist:", dirPath);
