/* offscreen.js: receives "copy" messages from the service worker and writes
   text to the clipboard via the old textarea + execCommand trick, which works
   in a hidden document without any host permission.

   Plain script (not a module) so a simple <script src> loads it. Only handles
   messages addressed to target: 'offscreen' to avoid clashing with
   popup/worker messaging. */

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.target !== 'offscreen' || message.type !== 'copy') return;

  try {
    const sink = document.getElementById('sink');
    sink.value = message.text ?? '';
    sink.focus();
    sink.select();
    /* execCommand('copy') is deprecated but it's still the most reliable
       permission-free clipboard write available in an offscreen document. */
    const ok = document.execCommand('copy');
    sink.value = '';
    sendResponse({ ok });
  } catch (err) {
    sendResponse({ ok: false, error: String(err) });
  }
  /* Return true to keep the message channel open for the async sendResponse. */
  return true;
});
