// SPDX-License-Identifier: MIT
// One-Sentence Absurd Invention Pitch — make.fun bounty
// u-suroso-69-one-sentence-absurd-invention-pitch-5326c34a
//
// Writes one sentence pitching a ridiculous invention to /output/entry.txt.
// The gate: UTF-8 text of 1 to 220 characters, not whitespace-only.

import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "A phone charger that only charges while you do squats, so your battery \u2014 and your legs \u2014 never die on the couch.";

const MIN_LENGTH = 1;
const MAX_LENGTH = 220;

// Empty only the contents of a directory; never remove the directory itself.
// The grader's /output is a mounted empty directory and removing it fails.
function emptyDir(dir: string): void {
  for (const name of readdirSync(dir)) {
    rmSync(join(dir, name), { recursive: true, force: true });
  }
}

function main(): void {
  const outDir = process.argv[2] ?? "/output";

  if (ENTRY.length < MIN_LENGTH || ENTRY.length > MAX_LENGTH) {
    throw new Error(`entry is ${ENTRY.length} characters, gate is ${MIN_LENGTH}-${MAX_LENGTH}`);
  }
  if (ENTRY.trim().length === 0) {
    throw new Error("entry is whitespace-only");
  }
  if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  // One sentence: exactly one terminal full stop, at the very end.
  const stops = (ENTRY.match(/\./g) ?? []).length;
  if (stops !== 1 || !ENTRY.endsWith(".")) {
    throw new Error("entry must be exactly one sentence");
  }

  mkdirSync(outDir, { recursive: true });
  emptyDir(outDir);

  const target = join(outDir, "entry.txt");
  writeFileSync(target, ENTRY, "utf8");

  const written = readFileSync(target, "utf8");
  if (written !== ENTRY) {
    throw new Error("entry.txt does not match the pitch after writing");
  }

  console.log(`wrote ${target} (${ENTRY.length} characters)`);
}

main();
