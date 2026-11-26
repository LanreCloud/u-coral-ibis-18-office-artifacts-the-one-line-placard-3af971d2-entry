// Office Artifacts: The One-Line Placard Contest
// Writes a single-line museum placard for an ordinary office object,
// treated as an ancient artifact, to <outputDir>/entry.txt.
//
// The grader runs `node /bot/main.ts` with the repo mounted READ-ONLY at
// /bot and a writable /output at $MAKEFUN_OUTPUT_DIR, so the output
// directory is resolved in this order:
//   1. $MAKEFUN_OUTPUT_DIR when set and non-empty
//   2. /output when it exists and is writable
//   3. a local "output" directory next to this script (local runs only)
// The script directory itself is never used as the primary output path.
import { mkdirSync, writeFileSync } from "node:fs";
import { existsSync } from "node:fs";
import { accessSync, constants } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PLACARD =
  "Sticky note, c. 2004. Paper, adhesive, ballpoint ink. Curse tablet of middle management, affixed to the communal fridge and never answered. Bequest of K. Adeyemi.";

function isWritableDir(path) {
  try {
    accessSync(path, constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

function outputDir() {
  const envDir = (process.env.MAKEFUN_OUTPUT_DIR || "").trim();
  if (envDir) return envDir;
  if (existsSync("/output") && isWritableDir("/output")) return "/output";
  return join(dirname(fileURLToPath(import.meta.url)), "output");
}

function main() {
  const text = PLACARD.trim();
  const chars = [...text].length;
  if (chars < 1 || chars > 180) {
    throw new Error(`placard must be 1-180 characters, got ${chars}`);
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("placard must be a single line");
  }
  const dir = outputDir();
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "entry.txt"), text + "\n", "utf8");
}

main();
