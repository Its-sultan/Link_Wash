/*
 * Write text to the clipboard from the MV3 service worker.
 *
 * A service worker has no DOM and navigator.clipboard isn't reliable there,
 * so we use an offscreen document: a hidden page with a real DOM where a
 * textarea + document.execCommand('copy') works without host permissions.
 *
 * The popup and options page don't use this; they have a real document and
 * call navigator.clipboard.writeText directly. This is only for the
 * context-menu path that runs in the worker.
 */

import api from './browser-shim.js';

const OFFSCREEN_PATH = 'offscreen/offscreen.html';

/*
 * Chrome allows only one offscreen document per extension, so check before
 * creating and tolerate the race where another call beat us to it.
 */
async function ensureOffscreenDocument() {
  /* hasDocument is the simplest existence check; fall back to a clients query on older builds. */
  if (api.offscreen.hasDocument && (await api.offscreen.hasDocument())) return;

  try {
    await api.offscreen.createDocument({
      url: OFFSCREEN_PATH,
      reasons: [api.offscreen.Reason?.CLIPBOARD ?? 'CLIPBOARD'],
      justification: 'Write the cleaned link to the clipboard from the context menu.',
    });
  } catch (err) {
    /* Two near-simultaneous clicks can both try to create it; the "single offscreen document" error is safe to ignore. */
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
  /* Message the offscreen document and wait for its ack. Leave it alive so repeated copies skip setup. */
  const response = await api.runtime.sendMessage({
    target: 'offscreen',
    type: 'copy',
    text,
  });
  return response?.ok === true;
}

export default copyFromWorker;
