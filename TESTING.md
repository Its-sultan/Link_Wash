# Manual test checklist

Run `npm test` first (the automated engine suite). Then walk this list in a real
browser after **Load unpacked** on `src/`.

## Cleaning engine (mirrors the automated suite)

- [ ] A multi-tracker URL is stripped to just its functional params.
- [ ] Functional params survive: `id`, `q`, `v`, `page` are never dropped.
- [ ] An already-clean link reports **"already clean — nothing to remove."**
- [ ] A bare domain (`example.com/x?utm_source=y`) is recovered to `https://…`.
- [ ] A fragment-only URL (`…/docs#section-2`) is left unchanged.
- [ ] A `mailto:` link is left completely untouched.
- [ ] Garbage input (`not a url`) doesn't throw or copy nonsense.
- [ ] **Unwrap redirect links** ON: a wrapper `?u=https%3A%2F%2F…` resolves to
      the cleaned inner URL. OFF: the wrapper is left as-is.
- [ ] A custom param added in Settings is then removed from links.

## Right-click context menu

- [ ] Right-click a tracker-laden link → **Copy clean link** → paste shows the
      cleaned URL.
- [ ] Right-click empty page space → **Copy clean link to page** → paste
      shows the cleaned page URL.
- [ ] A green **✓** badge appears for ~1s after a successful copy, then clears.
- [ ] Copying a link with no trackers still copies the (unchanged) link.

## Popup

- [ ] Paste a link → it cleans without pressing a button (debounced).
- [ ] Summary shows up top, e.g. "3 trackers removed · 46% shorter".
- [ ] Before/after view shows removed parts struck through in the original.
- [ ] "Removed (N)" rows appear, each with its plain-language explanation.
- [ ] Toggling a row **on** restores that param to the clean link; its strike
      fades out, the count and "% shorter" update live, focus stays on the switch.
- [ ] **Copy clean link** button copies the current (restore-aware) URL.
- [ ] **Auto-copy on clean** (default on): pasting a link copies it; **typing**
      does NOT auto-copy (no silent clipboard clobber); toggling does NOT auto-copy.
- [ ] **Use current tab** fills the input with the active tab's URL and copies.
- [ ] Empty input → empty state. Already-clean link → no-change state.
      Non-URL text → invalid state. `mailto:` → "no trackers to clean".
- [ ] A very long URL wraps inside both boxes without breaking the layout.

## Settings

- [ ] Toggling **Aggressive mode** strips `ref` on a `?ref=…` link.
- [ ] Toggling **Unwrap redirect links** changes behavior as above.
- [ ] Add / remove a custom parameter; it persists after closing the popup.
- [ ] **Reset to defaults** restores all toggles and clears custom params.
- [ ] Settings set in the options tab are reflected in the popup, and vice-versa.

## Quality bar

- [ ] DevTools → **Network** stays **empty** during all of the above.
- [ ] No errors in the popup, options, service-worker, or offscreen consoles.
- [ ] Fully keyboard-operable: Tab order is logical, focus rings are visible,
      chips and toggles are reachable.
- [ ] Looks correct in both light and dark (`prefers-color-scheme`).
- [ ] With OS "reduce motion" on, no transitions animate.
