/*
 * Zero-dependency "lint": syntax-check every JS module with `node --check`.
 * Doesn't catch style nits, but it confirms the unpacked extension has no parse
 * errors, which is the thing that matters for a no-build, load-unpacked extension.
 */

import { readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOTS = ['src', 'tests', 'scripts'];
const EXTS = new Set(['.js', '.mjs']);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (EXTS.has(extname(p))) out.push(p);
  }
  return out;
}

let failures = 0;
for (const root of ROOTS) {
  let files = [];
  try { files = walk(root); } catch { continue; }
  for (const file of files) {
    try {
      execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
      console.log(`ok   ${file}`);
    } catch (err) {
      failures++;
      console.error(`FAIL ${file}\n${err.stderr?.toString() || err.message}`);
    }
  }
}

if (failures) {
  console.error(`\n${failures} file(s) failed the syntax check.`);
  process.exit(1);
}
console.log('\nAll files parsed cleanly.');
