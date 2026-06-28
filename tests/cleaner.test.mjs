/*
 * Runs with `node --test`, no framework dependency.
 * The engine is pure, so we test the behaviour directly here.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanUrl } from '../src/lib/cleaner.js';

test('strips a multi-tracker URL down to its functional parts', () => {
  const input =
    'https://shop.example.com/item?id=123&utm_source=newsletter&utm_medium=email&fbclid=IwAR99&gclid=abc&page=2';
  const r = cleanUrl(input);
  assert.equal(r.changed, true);
  assert.equal(r.cleaned, 'https://shop.example.com/item?id=123&page=2');
  /* each removed tracker should carry an explanation */
  const keys = r.removed.map((x) => x.key).sort();
  assert.deepEqual(keys, ['fbclid', 'gclid', 'utm_medium', 'utm_source']);
  assert.ok(r.removed.every((x) => typeof x.reason === 'string' && x.reason.length > 0));
});

test('keeps functional params (id, q, v, page)', () => {
  const input = 'https://example.com/search?q=cats&v=2&page=3&id=42&utm_campaign=spring';
  const r = cleanUrl(input);
  assert.equal(r.cleaned, 'https://example.com/search?q=cats&v=2&page=3&id=42');
  assert.deepEqual(r.removed.map((x) => x.key), ['utm_campaign']);
});

test('leaves an already-clean URL unchanged (changed: false)', () => {
  const input = 'https://example.com/article?id=7&page=2';
  const r = cleanUrl(input);
  assert.equal(r.changed, false);
  assert.equal(r.cleaned, input);
  assert.deepEqual(r.removed, []);
});

test('the utm_* prefix rule catches unlisted UTM variants', () => {
  const r = cleanUrl('https://example.com/?utm_somethingnew=x&keep=1');
  assert.equal(r.cleaned, 'https://example.com/?keep=1');
  assert.equal(r.removed[0].key, 'utm_somethingnew');
});

test('matches tracker keys case-insensitively', () => {
  const r = cleanUrl('https://example.com/?FBCLID=abc&UTM_Source=x&Keep=1');
  assert.equal(r.changed, true);
  assert.equal(r.cleaned, 'https://example.com/?Keep=1');
});

test('recovers a bare domain by assuming https', () => {
  const r = cleanUrl('example.com/path?utm_source=x&id=1');
  assert.equal(r.changed, true);
  assert.equal(r.cleaned, 'https://example.com/path?id=1');
});

test('a URL with only a fragment is preserved', () => {
  const r = cleanUrl('https://example.com/docs#section-2');
  assert.equal(r.changed, false);
  assert.equal(r.cleaned, 'https://example.com/docs#section-2');
});

test('preserves the fragment while stripping query trackers', () => {
  const r = cleanUrl('https://example.com/p?utm_source=x#anchor');
  assert.equal(r.cleaned, 'https://example.com/p#anchor');
});

test('leaves a mailto: link completely untouched', () => {
  const input = 'mailto:hi@example.com?subject=Hello&utm_source=x';
  const r = cleanUrl(input);
  assert.equal(r.changed, false);
  assert.equal(r.cleaned, input);
  assert.equal(r.reason, 'unsupported-scheme');
});

test('does not throw on malformed input; reports not-a-url', () => {
  for (const bad of ['', '   ', 'not a url at all', '::::', 'http://', '???']) {
    const r = cleanUrl(bad);
    assert.equal(r.changed, false);
    assert.equal(r.cleaned, bad);
  }
});

test('ref-style params are KEPT by default (conservative)', () => {
  const r = cleanUrl('https://example.com/?ref=alice&id=1');
  assert.equal(r.changed, false);
  assert.equal(r.cleaned, 'https://example.com/?ref=alice&id=1');
});

test('ref-style params ARE stripped in aggressive mode', () => {
  const r = cleanUrl('https://example.com/?ref=alice&id=1', { aggressive: true });
  assert.equal(r.cleaned, 'https://example.com/?id=1');
  assert.equal(r.removed[0].key, 'ref');
});

test('unwraps a nested redirect when the option is ON, cleaning the inner URL', () => {
  const input =
    'https://l.example.com/?u=' +
    encodeURIComponent('https://real.com/page?utm_source=x&id=9');
  const r = cleanUrl(input, { unwrapRedirects: true });
  assert.equal(r.changed, true);
  assert.equal(r.cleaned, 'https://real.com/page?id=9');
});

test('does NOT unwrap a nested redirect when the option is OFF', () => {
  const input =
    'https://l.example.com/?u=' + encodeURIComponent('https://real.com/page?id=9');
  const r = cleanUrl(input); /* default off */
  /* wrapper has no tracking params of its own, so it stays as-is */
  assert.equal(r.changed, false);
  assert.equal(r.cleaned, input);
});

test('a user-added custom param gets removed', () => {
  const r = cleanUrl('https://example.com/?affid=42&id=1', { customParams: ['affid'] });
  assert.equal(r.cleaned, 'https://example.com/?id=1');
  assert.equal(r.removed[0].key, 'affid');
  assert.equal(r.removed[0].reason, 'Removed by your custom rule');
});

test('the keep option preserves a param that would normally be stripped', () => {
  const input = 'https://example.com/?utm_source=x&utm_medium=y&id=1';
  const r = cleanUrl(input, { keep: ['utm_source'] });
  /* utm_source stays in place; utm_medium still removed */
  assert.equal(r.cleaned, 'https://example.com/?utm_source=x&id=1');
  assert.deepEqual(r.removed.map((x) => x.key), ['utm_medium']);
});

test('keep is case-insensitive and applies to custom params too', () => {
  const r = cleanUrl('https://example.com/?affid=42&fbclid=z&id=1', {
    customParams: ['affid'],
    keep: ['AFFID'],
  });
  assert.equal(r.cleaned, 'https://example.com/?affid=42&id=1');
  assert.deepEqual(r.removed.map((x) => x.key), ['fbclid']);
});

test('strips a known tracking key from a key=value fragment', () => {
  const r = cleanUrl('https://example.com/p#xtor=AD-123&id=keep');
  assert.equal(r.changed, true);
  assert.equal(r.cleaned, 'https://example.com/p#id=keep');
});

test('handles repeated tracker keys (deletes all instances)', () => {
  const r = cleanUrl('https://example.com/?utm_source=a&utm_source=b&id=1');
  assert.equal(r.cleaned, 'https://example.com/?id=1');
  assert.equal(r.removed.length, 2);
});

test('result is structured with original/cleaned/changed/removed', () => {
  const r = cleanUrl('https://example.com/?fbclid=x');
  assert.equal(r.original, 'https://example.com/?fbclid=x');
  assert.equal(typeof r.cleaned, 'string');
  assert.equal(typeof r.changed, 'boolean');
  assert.ok(Array.isArray(r.removed));
  assert.deepEqual(Object.keys(r.removed[0]).sort(), ['key', 'reason', 'value']);
});
