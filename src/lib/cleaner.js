/*
 * cleaner.js: the URL cleaning engine for Link Wash.
 *
 * No dependencies and no side effects, so it runs under `node --test` and works
 * anywhere (popup, service worker, tests). Exports one function,
 * `cleanUrl(input, options)`.
 *
 * Rule behind every decision here: never break a link. When unsure whether a
 * param is tracking or functional, keep it. Missing a tracker just leaves a
 * longer URL; dropping a functional param breaks the destination.
 */

import {
  TRACKING_PARAMS,
  TRACKING_PREFIXES,
  AGGRESSIVE_PARAMS,
  FRAGMENT_TRACKERS,
  CUSTOM_PARAM_REASON,
} from './rules.js';

/*
 * Build lookup maps once at load. Keys are lower-cased: query keys are
 * case-sensitive per spec, but matching case-insensitively catches `UTM_Source`
 * and friends. Low risk since functional params rarely collide with a UTM or
 * clickid name in a different case.
 */
const EXACT = new Map(TRACKING_PARAMS.map(([k, reason]) => [k.toLowerCase(), reason]));
const AGGRESSIVE = new Map(AGGRESSIVE_PARAMS.map(([k, reason]) => [k.toLowerCase(), reason]));
const FRAGMENT = new Map(FRAGMENT_TRACKERS.map(([k, reason]) => [k.toLowerCase(), reason]));
const PREFIXES = TRACKING_PREFIXES.map(([p, reason]) => [p.toLowerCase(), reason]);

/*
 * Only http/https URLs carry tracking query strings worth touching. mailto:,
 * tel:, javascript:, data: and the rest are left alone; cleaning them does
 * nothing useful and could corrupt them.
 */
const CLEANABLE_PROTOCOLS = new Set(['http:', 'https:']);

/**
 * @typedef {Object} RemovedParam
 * @property {string} key     The parameter name that was removed.
 * @property {string} value   Its value (may be empty).
 * @property {string} reason  Plain-language explanation, shown in the popup.
 *
 * @typedef {Object} CleanResult
 * @property {string} original  The input as received.
 * @property {string} cleaned   The cleaned URL (=== original when nothing changed).
 * @property {boolean} changed
 * @property {RemovedParam[]} removed
 * @property {string} [reason]  Set when changed is false for a notable cause
 *                              (e.g. "not-a-url", "unsupported-scheme").
 */

/**
 * Attempt to parse `input` into a URL. Returns the URL object, or null.
 * Recovers bare domains like "example.com/path?x=1" by prepending https://.
 */
function parseLoose(input) {
  const trimmed = input.trim();
  try {
    return new URL(trimmed);
  } catch {
    /*
     * Only retry for things that look like a bare host. Skip strings that
     * already declared a scheme we couldn't parse, so we don't turn
     * "mailto:bad" into "https://mailto:bad".
     */
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) return null; /* has a scheme already */
    if (!/^[^\s/]+\.[^\s/]/.test(trimmed)) return null; /* needs a dot like a domain */
    try {
      return new URL('https://' + trimmed);
    } catch {
      return null;
    }
  }
}

/** True if a param key matches the tracking denylist (exact or prefix). */
function trackingReason(key, aggressive) {
  const lower = key.toLowerCase();
  if (EXACT.has(lower)) return EXACT.get(lower);
  for (const [prefix, reason] of PREFIXES) {
    if (lower.startsWith(prefix)) return reason;
  }
  if (aggressive && AGGRESSIVE.has(lower)) return AGGRESSIVE.get(lower);
  return null;
}

/**
 * If `value` is itself a URL (a wrapped redirect destination), return it,
 * else null. Only used when unwrapRedirects is on. Decodes the string locally;
 * never makes a network request to follow the redirect.
 */
function asWrappedUrl(value) {
  if (!value) return null;
  /*
   * URLSearchParams usually hands us the value already percent-decoded. Accept
   * only absolute http(s) URLs so a normal value isn't mistaken for a link.
   */
  let candidate = value;
  try {
    const u = new URL(candidate);
    if (CLEANABLE_PROTOCOLS.has(u.protocol)) return u.href;
  } catch {
    /* not a bare URL; fall through */
  }
  /* Some wrappers double-encode; try one more decode pass. */
  try {
    const decoded = decodeURIComponent(value);
    if (decoded !== value) {
      const u = new URL(decoded);
      if (CLEANABLE_PROTOCOLS.has(u.protocol)) return u.href;
    }
  } catch {
    /* not a URL */
  }
  return null;
}

/** Strip known tracking keys from a `#a=b&c=d` style fragment. */
function cleanFragment(fragment, keepSet = new Set()) {
  /*
   * Only treat the fragment as key/value pairs when it looks like a query
   * (has '='). A plain "#section-2" or SPA route "#/inbox" is left alone so we
   * don't break in-page navigation.
   */
  if (!fragment || !fragment.includes('=')) return { fragment, removed: [] };
  const params = new URLSearchParams(fragment);
  const removed = [];
  for (const key of [...params.keys()]) {
    const reason = FRAGMENT.get(key.toLowerCase());
    if (reason && !keepSet.has(key.toLowerCase())) {
      removed.push({ key, value: params.get(key), reason });
      params.delete(key);
    }
  }
  if (removed.length === 0) return { fragment, removed };
  return { fragment: params.toString(), removed };
}

/**
 * Clean a single URL string. Pure: no I/O, no throw.
 *
 * @param {string} input
 * @param {Object} [options]
 * @param {boolean} [options.aggressive=false]      Also strip ref-style params.
 * @param {boolean} [options.unwrapRedirects=false] Decode wrapped destination URLs.
 * @param {string[]} [options.customParams=[]]      Extra param names to remove.
 * @returns {CleanResult}
 */
export function cleanUrl(input, options = {}) {
  const original = typeof input === 'string' ? input : String(input ?? '');
  const {
    aggressive = false,
    unwrapRedirects = false,
    customParams = [],
    keep = [],
  } = options;

  const noChange = (reason) => ({ original, cleaned: original, changed: false, removed: [], ...(reason ? { reason } : {}) });

  if (!original.trim()) return noChange('empty');

  const url = parseLoose(original);
  if (!url) return noChange('not-a-url');

  // Non-web schemes (mailto:, tel:, etc.) are left untouched by design.
  if (!CLEANABLE_PROTOCOLS.has(url.protocol)) return noChange('unsupported-scheme');

  /* Custom params come from user storage; normalise to a lower-case Set. */
  const custom = new Set(
    customParams
      .map((p) => String(p).trim().toLowerCase())
      .filter(Boolean)
  );

  /*
   * `keep` is an exception list: param names the caller wants preserved even
   * though they'd normally be stripped. The popup uses it to let a user restore
   * a removed param with one toggle, recomputing live.
   */
  const keepSet = new Set(keep.map((p) => String(p).trim().toLowerCase()).filter(Boolean));

  const removed = [];

  /*
   * Optional redirect unwrap.
   * If a query value is itself a URL, treat that inner URL as the real
   * destination, clean it recursively, and return it. Off by default since it
   * changes which page the link points to. String-only; never a network hop.
   */
  if (unwrapRedirects) {
    for (const [key, value] of url.searchParams) {
      const inner = asWrappedUrl(value);
      if (inner) {
        const innerResult = cleanUrl(inner, options);
        return {
          original,
          cleaned: innerResult.cleaned,
          changed: innerResult.cleaned !== original,
          /* Report the unwrap, plus anything stripped from the inner URL. */
          removed: [
            { key, value, reason: 'Unwrapped the real destination from a redirect link' },
            ...innerResult.removed,
          ],
        };
      }
    }
  }

  /*
   * Strip tracking query params.
   * Iterate over a snapshot of keys; URLSearchParams.delete removes all values
   * for a key, which is what we want for repeated trackers.
   */
  for (const key of [...new Set([...url.searchParams.keys()])]) {
    const lower = key.toLowerCase();
    let reason = trackingReason(key, aggressive);
    if (!reason && custom.has(lower)) reason = CUSTOM_PARAM_REASON;
    /* keepSet wins over every removal rule; the user asked to keep it. */
    if (reason && !keepSet.has(lower)) {
      /* Capture each value (a key can repeat) before deleting. */
      for (const value of url.searchParams.getAll(key)) {
        removed.push({ key, value, reason });
      }
      url.searchParams.delete(key);
    }
  }

  /* Clean the fragment, known-tracker case only. */
  const { fragment: cleanedFragment, removed: fragRemoved } = cleanFragment(url.hash.replace(/^#/, ''), keepSet);
  removed.push(...fragRemoved);

  if (removed.length === 0) {
    /*
     * Nothing matched. Return the original string verbatim so we don't
     * normalise or re-encode a link the user didn't ask us to touch.
     */
    return noChange();
  }

  /*
   * Rebuild. URL serialisation already drops a now-empty "?" and collapses the
   * separators, so no manual string surgery here.
   */
  if (fragRemoved.length > 0) {
    url.hash = cleanedFragment ? '#' + cleanedFragment : '';
  }

  return {
    original,
    cleaned: url.href,
    changed: url.href !== original,
    removed,
  };
}

export default cleanUrl;
