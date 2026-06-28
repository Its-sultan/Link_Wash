/*
 * Standalone settings tab. Binds the shared settings module to the same
 * controls the popup uses, so popup and options stay in sync via lib/settings.js.
 */

import { getSettings, setSettings, resetSettings } from '../lib/settings.js';

const $ = (id) => document.getElementById(id);
const els = {
  autocopy: $('opt-autocopy'),
  aggressive: $('opt-aggressive'),
  unwrap: $('opt-unwrap'),
  customForm: $('custom-form'),
  customInput: $('custom-input'),
  customList: $('custom-list'),
  reset: $('reset'),
};

let settings = null;

function sync() {
  els.autocopy.checked = settings.autoCopy;
  els.aggressive.checked = settings.aggressive;
  els.unwrap.checked = settings.unwrapRedirects;
  renderCustom();
}

function renderCustom() {
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
    remove.addEventListener('click', async () => {
      settings = await setSettings({
        customParams: settings.customParams.filter((p) => p !== param),
      });
      renderCustom();
    });
    li.append(key, remove);
    els.customList.appendChild(li);
  }
}

async function init() {
  settings = await getSettings();
  sync();

  els.autocopy.addEventListener('change', async (e) => {
    settings = await setSettings({ autoCopy: e.target.checked });
  });
  els.aggressive.addEventListener('change', async (e) => {
    settings = await setSettings({ aggressive: e.target.checked });
  });
  els.unwrap.addEventListener('change', async (e) => {
    settings = await setSettings({ unwrapRedirects: e.target.checked });
  });

  els.customForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = els.customInput.value.trim().replace(/^[?&#]+/, '').toLowerCase();
    els.customInput.value = '';
    if (!name || settings.customParams.includes(name)) return;
    settings = await setSettings({ customParams: [...settings.customParams, name] });
    renderCustom();
  });

  els.reset.addEventListener('click', async () => {
    settings = await resetSettings();
    sync();
  });
}

init();
