/*
 * Paste-to-clean popup. Runs in a real document, so we use
 * navigator.clipboard directly (no offscreen helper) and reuse the same
 * engine as the service worker and the tests.
 */

import api from '../lib/browser-shim.js';
import { cleanUrl } from '../lib/cleaner.js';
import { getSettings, setSettings, resetSettings } from '../lib/settings.js';

/* Element handles */
const $ = (id) => document.getElementById(id);
const els = {
  input: $('input'),
  useTab: $('use-tab'),
  status: $('status'),
  empty: $('empty'),
  noop: $('noop'),
  noopText: $('noop-text'),
  invalid: $('invalid'),
  result: $('result'),
  summary: $('summary'),
  before: $('before'),
  after: $('after'),
  copy: $('copy'),
  copyLabel: document.querySelector('#copy .copy-label'),
  removedTitle: $('removed-title'),
  toggleList: $('toggle-list'),
  settings: $('settings'),
  openSettings: $('open-settings'),
  optAutocopy: $('opt-autocopy'),
  optAggressive: $('opt-aggressive'),
  optUnwrap: $('opt-unwrap'),
  customForm: $('custom-form'),
  customInput: $('custom-input'),
  customList: $('custom-list'),
  reset: $('reset'),
};

let settings = null;       /* loaded async on init */
let currentValue = '';     /* trimmed input currently shown */
let baseResult = null;     /* cleanUrl(value) with no restores: every removable param */
let keptKeys = new Set();   /* params toggled back ON, in-memory, per link */
let lastCleaned = '';      /* URL the Copy button writes */

/* Helpers */
const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );

function cleanOptions() {
  return {
    aggressive: settings.aggressive,
    unwrapRedirects: settings.unwrapRedirects,
    customParams: settings.customParams,
  };
}

/*
 * Re-evaluate the input from scratch. allowCopy is only true for paste and
 * use-tab, never per keystroke, so we don't clobber the clipboard while
 * someone is still typing.
 */
function evaluate(allowCopy = false) {
  const value = els.input.value.trim();

  if (!value) {
    show('empty');
    els.status.textContent = '';
    currentValue = '';
    baseResult = null;
    lastCleaned = '';
    return;
  }

  currentValue = value;
  keptKeys = new Set(); /* new/edited link starts with nothing restored */
  baseResult = cleanUrl(value, cleanOptions());

  if (baseResult.reason === 'not-a-url') {
    show('invalid');
    els.status.textContent = '';
    return;
  }

  if (!baseResult.changed) {
    /* Already clean, or a scheme we don't touch (mailto:, etc.). */
    els.noopText.textContent =
      baseResult.reason === 'unsupported-scheme'
        ? 'Links like this have no trackers to clean.'
        : 'This link is already clean — nothing to remove.';
    show('noop');
    els.status.textContent = '';
    return;
  }

  renderToggleList(baseResult);
  updateEffective();
  show('result');

  if (allowCopy && settings.autoCopy) {
    copyText(lastCleaned, /* quiet */ true);
    els.status.textContent = 'Copied the clean link.';
  } else {
    els.status.textContent = '';
  }
}

/*
 * Recompute the displayed/copied clean URL from the current restore choices
 * and refresh whatever depends on it. We don't rebuild the toggle list here,
 * so toggling a switch keeps keyboard focus where it was.
 */
function updateEffective() {
  const eff = keptKeys.size
    ? cleanUrl(currentValue, { ...cleanOptions(), keep: [...keptKeys] })
    : baseResult;
  lastCleaned = eff.cleaned;

  /* Strike reflects what's actually removed now; restored params un-strike live. */
  const struck = new Set(eff.removed.map((r) => r.key.toLowerCase()));
  els.before.innerHTML = highlightBefore(eff.original, struck);
  els.after.textContent = eff.cleaned;

  const n = eff.removed.length;
  els.removedTitle.textContent = `Removed (${n})`;

  /* Clamp "% shorter" to 0; a bare domain can grow once https:// is added. */
  const pct = Math.max(
    0,
    Math.round((1 - eff.cleaned.length / Math.max(1, eff.original.length)) * 100)
  );
  if (n === 0) {
    els.summary.textContent = 'Keeping every parameter';
  } else {
    const word = n === 1 ? 'tracker' : 'trackers';
    els.summary.textContent =
      pct > 0 ? `${n} ${word} removed · ${pct}% shorter` : `${n} ${word} removed`;
  }
}

/* Show exactly one of the mutually-exclusive states. */
function show(which) {
  els.empty.hidden = which !== 'empty';
  els.noop.hidden = which !== 'noop';
  els.invalid.hidden = which !== 'invalid';
  els.result.hidden = which !== 'result';
}

/*
 * Build the restore-toggle list from every removable tracker. Each row is
 * param name + reason + a switch to keep it.
 */
function renderToggleList(result) {
  els.toggleList.innerHTML = '';
  for (const item of result.removed) {
    const key = item.key;
    const lower = key.toLowerCase();

    const li = document.createElement('li');
    li.className = 'trow';

    const main = document.createElement('span');
    main.className = 'trow-main';
    const keyEl = document.createElement('span');
    keyEl.className = 'trow-key';
    keyEl.textContent = key;
    const reasonEl = document.createElement('span');
    reasonEl.className = 'trow-reason';
    reasonEl.textContent = item.reason;
    main.append(keyEl, reasonEl);

    const sw = document.createElement('button');
    sw.type = 'button';
    sw.className = 'switch';
    sw.setAttribute('role', 'switch');
    sw.setAttribute('aria-checked', 'false');
    sw.setAttribute('aria-label', `Keep ${key} in the link`);
    sw.addEventListener('click', () => {
      const kept = !keptKeys.has(lower);
      if (kept) keptKeys.add(lower);
      else keptKeys.delete(lower);
      sw.setAttribute('aria-checked', String(kept));
      li.classList.toggle('kept', kept);
      updateEffective();
    });

    li.append(main, sw);
    els.toggleList.appendChild(li);
  }
}

/*
 * Wrap each removed key=value token in <del> so you can see what was stripped.
 * Tokenise the raw string instead of substring-searching decoded values, so
 * highlighting stays accurate.
 */
function highlightBefore(original, removedKeys) {
  const hashIdx = original.indexOf('#');
  const main = hashIdx === -1 ? original : original.slice(0, hashIdx);
  const frag = hashIdx === -1 ? '' : original.slice(hashIdx + 1);
  const qIdx = main.indexOf('?');
  const base = qIdx === -1 ? main : main.slice(0, qIdx);
  const query = qIdx === -1 ? '' : main.slice(qIdx + 1);

  let html = escapeHtml(base);
  if (qIdx !== -1) {
    html += '?' + highlightPairs(query, removedKeys);
  }
  if (hashIdx !== -1) {
    /* Only a key=value fragment can hold trackers; a plain "#anchor" is verbatim. */
    html += '#' + (frag.includes('=') ? highlightPairs(frag, removedKeys) : escapeHtml(frag));
  }
  return html;
}

function highlightPairs(segment, removedKeys) {
  return segment
    .split('&')
    .map((tok) => {
      const rawKey = tok.split('=')[0];
      let key = rawKey;
      try { key = decodeURIComponent(rawKey); } catch { /* keep raw */ }
      const safe = escapeHtml(tok);
      return removedKeys.has(key.toLowerCase()) ? `<del>${safe}</del>` : safe;
    })
    .join('&');
}

/* Clipboard */
async function copyText(text, quiet = false) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    /* Fallback for when writeText is unavailable or denied. */
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
  if (!quiet) {
    /* Swap only the label so the icon (now a checkmark via .copied) stays put. */
    els.copy.classList.add('copied');
    els.copyLabel.textContent = 'Copied';
    setTimeout(() => {
      els.copy.classList.remove('copied');
      els.copyLabel.textContent = 'Copy clean link';
    }, 1100);
  }
}

/* Settings UI */
function syncSettingsUi() {
  els.optAutocopy.checked = settings.autoCopy;
  els.optAggressive.checked = settings.aggressive;
  els.optUnwrap.checked = settings.unwrapRedirects;
  renderCustomList();
}

function renderCustomList() {
  els.customList.innerHTML = '';
  for (const param of settings.customParams) {
    const li = document.createElement('li');
    li.className = 'chip';
    const key = document.createElement('span');
    key.className = 'chip-key';
    key.textContent = param;
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'chip-remove';
    remove.textContent = '×';
    remove.setAttribute('aria-label', `Remove ${param}`);
    remove.addEventListener('click', () => removeCustom(param));
    li.append(key, remove);
    els.customList.appendChild(li);
  }
}

async function updateSetting(patch) {
  settings = await setSettings(patch);
  evaluate(false); /* re-clean with new options; don't touch the clipboard */
}

async function addCustom(name) {
  const clean = name.trim().replace(/^[?&#]+/, '').toLowerCase();
  if (!clean || settings.customParams.includes(clean)) return;
  await updateSetting({ customParams: [...settings.customParams, clean] });
  renderCustomList();
}

async function removeCustom(name) {
  await updateSetting({
    customParams: settings.customParams.filter((p) => p !== name),
  });
  renderCustomList();
}

/* Wiring */
/* Debounce so typing stays smooth, and so we don't spam auto-copy mid-keystroke. */
let debounceTimer = null;
function onInput() {
  clearTimeout(debounceTimer);
  /* Typing never auto-copies, just updates the view. */
  debounceTimer = setTimeout(() => evaluate(false), 180);
}

async function useCurrentTab() {
  /* activeTab gives us the current tab URL on demand, no broad host permission. */
  const [tab] = await api.tabs.query({ active: true, currentWindow: true });
  if (tab?.url) {
    els.input.value = tab.url;
    evaluate(true); /* user-initiated, so auto-copy is allowed */
    els.input.focus();
  }
}

function toggleSettings() {
  const open = els.settings.hidden;
  els.settings.hidden = !open;
  els.openSettings.setAttribute('aria-expanded', String(open));
}

async function init() {
  settings = await getSettings();
  syncSettingsUi();
  show('empty');

  els.input.addEventListener('input', onInput);
  /* Paste means the user just handed us a link: clean now and allow auto-copy. */
  els.input.addEventListener('paste', () => setTimeout(() => evaluate(true), 0));
  els.useTab.addEventListener('click', useCurrentTab);
  els.copy.addEventListener('click', () => lastCleaned && copyText(lastCleaned));
  els.openSettings.addEventListener('click', toggleSettings);

  els.optAutocopy.addEventListener('change', (e) => updateSetting({ autoCopy: e.target.checked }));
  els.optAggressive.addEventListener('change', (e) => updateSetting({ aggressive: e.target.checked }));
  els.optUnwrap.addEventListener('change', (e) => updateSetting({ unwrapRedirects: e.target.checked }));

  els.customForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addCustom(els.customInput.value);
    els.customInput.value = '';
  });
  els.reset.addEventListener('click', async () => {
    settings = await resetSettings();
    syncSettingsUi();
    evaluate(false);
  });

  els.input.focus();
}

init();
