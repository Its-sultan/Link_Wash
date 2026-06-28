// clipboard.js — MV3-safe "write text to clipboard" for the service worker.
//
// THE PROBLEM: an MV3 service worker has no DOM, and `navigator.clipboard`
// is not reliably available there (no document, no user-gesture focus). The
// documented, permission-light way to copy from a worker is an OFFSCREEN
// DOCUMENT: a hidden page the worker can spin up that *does* have a DOM, where
// a classic `textarea` + `document.execCommand('copy')` works without asking
// for any host permission. We use the `CLIPBOARD` offscreen reason for this.
//
// The popup and options page DON'T use this — they run in a real document and
// can call `navigator.clipboard.writeText` directly. This helper is only for
// the context-menu path that originates in the worker.

import api from './browser-shim.js';

const OFFSCREEN_PATH = 'offscreen/offscreen.html';

// Ensure exactly one offscreen document exists. Chrome allows only one per
// extension, so we check before creating and tolerate the race where another
// call created it first.
async function ensureOffscreenDocument() {
  // `hasDocument` is the simplest existence check; fall back to clients query on
  // older builds that lack it.
  if (api.offscreen.hasDocument && (await api.offscreen.hasDocument())) return;

  try {
    await api.offscreen.createDocument({
      url: OFFSCREEN_PATH,
      reasons: [api.offscreen.Reason?.CLIPBOARD ?? 'CLIPBOARD'],
      justification: 'Write the cleaned link to the clipboard from the context menu.',
    });
  } catch (err) {
    // Two near-simultaneous context-menu clicks can both try to create it;
    // "Only a single offscreen document may be created" is safe to ignore.
    if (!String(err?.message || err).includes('single offscreen')) throw err;
  }
}

/**
 * Copy `text` to the clipboard from the service-worker context.
 * @param {string} text
 * @returns {Promise<boolean>} true on success.
 */
export async function copyFromWorker(text) {
  await ensureOffscreenDocument();
  // Message the offscreen document and wait for its ack. We keep the document
  // alive (cheap, idle) so rapid repeated copies don't pay setup cost each time.
  const response = await api.runtime.sendMessage({
    target: 'offscreen',
    type: 'copy',
    text,
  });
  return response?.ok === true;
}

export default copyFromWorker;
