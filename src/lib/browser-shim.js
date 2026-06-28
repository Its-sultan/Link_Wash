/*
 * Picks the extension API namespace in one place.
 * Chrome and Edge give us `chrome`; Firefox uses `browser` (promise-based).
 * Everything imports `api` from here, so a Firefox port only touches this file.
 */

/* chrome is defined in every context (worker, popup, offscreen, options);
   the browser fallback covers Firefox if it ever runs there. */
export const api = globalThis.chrome ?? globalThis.browser;

export default api;
