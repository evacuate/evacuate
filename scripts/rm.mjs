import { existsSync, rmSync } from "node:fs";
import { resolve, dirname } from "node:path";
const dirPath = resolve(dirname(new URL(import.meta.url).pathname), "../dist");
existsSync(dirPath)
  ? rmSync(dirPath, { recursive: true, force: true })
  : console.log("Directory does not exist:", dirPath);
