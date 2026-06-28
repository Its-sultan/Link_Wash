/*
 * User settings, shared by the service worker, popup, and options page.
 * Stored in chrome.storage.local because localStorage isn't shared across
 * extension contexts.
 */

import api from './browser-shim.js';

/* Defaults: aggressive off, redirect unwrapping off, auto-copy on. */
export const DEFAULTS = Object.freeze({
  aggressive: false,
  unwrapRedirects: false,
  autoCopy: true,
  customParams: [], /* array of bare param names, e.g. ["affid", "trk"] */
});

const KEY = 'settings';

/* Read settings merged over defaults so new keys always have a value. */
export async function getSettings() {
  const stored = await api.storage.local.get(KEY);
  return { ...DEFAULTS, ...(stored[KEY] || {}) };
}

/* Persist a partial update, merged onto whatever is stored. */
export async function setSettings(patch) {
  const current = await getSettings();
  const next = { ...current, ...patch };
  await api.storage.local.set({ [KEY]: next });
  return next;
}

/* Restore factory defaults. */
export async function resetSettings() {
  await api.storage.local.set({ [KEY]: { ...DEFAULTS } });
  return { ...DEFAULTS };
}

/* Subscribe to changes; returns an unsubscribe function. */
export function onSettingsChanged(callback) {
  const listener = (changes, area) => {
    if (area === 'local' && changes[KEY]) {
      callback({ ...DEFAULTS, ...(changes[KEY].newValue || {}) });
    }
  };
  api.storage.onChanged.addListener(listener);
  return () => api.storage.onChanged.removeListener(listener);
}
