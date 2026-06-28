/*
 * Package the extension into link-wash.zip for the Chrome Web Store / Edge
 * Add-ons. Dependency-free.
 *
 * Also strips anything whose name is in EXCLUDE below (OS junk and dev-only
 * files), even inside src/. To drop more, add a filename or a `src/relative/path`
 * to EXCLUDE.
 *
 * Copies src/ into a temp staging folder skipping excluded entries, zips the
 * staging folder's contents, then deletes it. Lets us filter per-entry instead
 * of zipping src/* wholesale.
 */

import { rmSync, existsSync, cpSync, mkdtempSync } from 'node:fs';
import { tmpdir, platform } from 'node:os';
import { join, basename, relative, sep } from 'node:path';
import { execFileSync } from 'node:child_process';

const SRC = 'src';
const OUT = join(process.cwd(), 'link-wash.zip');

/*
 * Exclude by exact filename (matched anywhere) or by path relative to src/.
 * e.g. add 'src/options' to ship without the options page, or 'notes.md' to
 * drop a stray file.
 */
const EXCLUDE = new Set([
  '.DS_Store',     /* macOS folder metadata */
  'Thumbs.db',     /* Windows thumbnail cache */
  'desktop.ini',   /* Windows folder settings */
]);

if (!existsSync(SRC)) {
  console.error(`No ${SRC}/ folder found — run from the project root.`);
  process.exit(1);
}
if (existsSync(OUT)) rmSync(OUT);

/* Stage src/ minus the excluded entries. */
const staging = mkdtempSync(join(tmpdir(), 'linkwash-'));
let dropped = 0;
cpSync(SRC, staging, {
  recursive: true,
  filter: (source) => {
    /* `source` is an absolute path under SRC; build its path relative to src/ */
    const rel = relative(SRC, source).split(sep).join('/');
    const excluded = EXCLUDE.has(basename(source)) || (rel && EXCLUDE.has(`src/${rel}`));
    if (excluded) {
      dropped++;
      console.log(`skip  ${rel || basename(source)}`);
    }
    return !excluded; /* false skips this entry and its subtree */
  },
});

try {
  if (platform() === 'win32') {
    /* Compress-Archive on staging/* puts manifest.json at the zip root */
    execFileSync(
      'powershell',
      ['-NoProfile', '-Command', `Compress-Archive -Path "${join(staging, '*')}" -DestinationPath "${OUT}"`],
      { stdio: 'inherit' }
    );
  } else {
    /* `zip -r <out> .` run from inside the staging dir */
    execFileSync('zip', ['-r', OUT, '.'], { cwd: staging, stdio: 'inherit' });
  }
  console.log(`\nWrote ${OUT}${dropped ? ` (excluded ${dropped} item${dropped === 1 ? '' : 's'})` : ''}`);
} catch (err) {
  console.error('Could not create zip. Ensure an archiver is available.');
  console.error(String(err.message || err));
  process.exitCode = 1;
} finally {
  rmSync(staging, { recursive: true, force: true }); /* always clean up staging */
}
