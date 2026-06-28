/* service-worker.js: background script for Link Wash.

   What it does:
     1. Registers the right-click context-menu items on install/update.
     2. On click: clean the relevant URL with the shared engine, copy it to the
        clipboard (via the offscreen helper), and flash a "✓" badge.
     3. Keeps no long-lived state. Durable stuff lives in chrome.storage.

   ES module worker (manifest "type": "module"), so it imports the same engine
   the popup and tests use. */

import api from '../lib/browser-shim.js';
import { cleanUrl } from '../lib/cleaner.js';
import { copyFromWorker } from '../lib/clipboard.js';
import { getSettings } from '../lib/settings.js';

/* Stable menu ids so we can tell the two items apart in the click handler. */
const MENU_LINK = 'linkwash-copy-clean-link';
const MENU_PAGE = 'linkwash-copy-clean-page';

/* Menu registration.
   Recreate from scratch on install and update so stale items never linger. */
function registerMenus() {
  api.contextMenus.removeAll(() => {
    /* "link" context: right-clicking an actual <a href>. linkUrl is provided. */
    api.contextMenus.create({
      id: MENU_LINK,
      title: 'Copy clean link',
      contexts: ['link'],
    });
    /* "page" context: right-clicking empty page space. Clean the page's URL. */
    api.contextMenus.create({
      id: MENU_PAGE,
      title: 'Copy clean link to this page',
      contexts: ['page'],
    });
  });
}

api.runtime.onInstalled.addListener(registerMenus);
/* Re-register on browser startup too. Menus usually persist, but registration
   gets lost occasionally and this covers that. */
api.runtime.onStartup.addListener(registerMenus);

/* Click handling. */
api.contextMenus.onClicked.addListener(async (info, tab) => {
  /* Source URL depends on which item fired: linkUrl for a link, pageUrl/tab
     for the page item. */
  const sourceUrl =
    info.menuItemId === MENU_LINK ? info.linkUrl : info.pageUrl || tab?.url;
  if (!sourceUrl) return;

  const settings = await getSettings();
  const result = cleanUrl(sourceUrl, {
    aggressive: settings.aggressive,
    unwrapRedirects: settings.unwrapRedirects,
    customParams: settings.customParams,
  });

  /* Copy the cleaned URL. result.cleaned falls back to the original when
     nothing changed, so we always copy what the user asked for. */
  const toCopy = result.cleaned;
  const ok = await copyFromWorker(toCopy).catch(() => false);

  /* Badge feedback: "✓" on success (green), "!" on failure (red), cleared after
     ~1s. No extra permission needed, and avoids chrome.notifications. */
  flashBadge(ok ? '✓' : '!', ok ? '#16a34a' : '#dc2626', tab?.id);
});

/* Badge confirmation. */
let badgeTimer = null;
function flashBadge(text, color, tabId) {
  const target = typeof tabId === 'number' ? { tabId } : {};
  api.action.setBadgeBackgroundColor({ color, ...target });
  api.action.setBadgeText({ text, ...target });
  if (badgeTimer) clearTimeout(badgeTimer);
  badgeTimer = setTimeout(() => {
    api.action.setBadgeText({ text: '', ...target });
    badgeTimer = null;
  }, 1000);
}
