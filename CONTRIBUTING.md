# Contributing to Link Wash

Thanks for helping keep links clean. Link Wash has a deliberately narrow scope,
so the most valuable contributions are usually **new tracking rules** and **bug
fixes that prevent breaking links** — not new features.

> Just want to *use* Link Wash? Install it in one click from the
> **[Microsoft Edge Add-ons store](https://microsoftedge.microsoft.com/addons/detail/link-wash/ofplnfannogodfifhomgpnpnobopdhhh)**.
> This guide is for people who want to contribute code or rules.

## The one rule that governs everything

**Never break a link.** When you're unsure whether a parameter is tracking or
functional, **keep it**. A missed tracker is a slightly longer URL; a stripped
functional param is a broken page. We always choose the safe side.

## Setup

No dependencies, no build step.

```bash
git clone https://github.com/Its-sultan/Link_Wash
cd Link_Wash
npm test       # node --test — the engine suite
npm run lint   # node --check on every JS file
```

Load `src/` via **Load unpacked** at `chrome://extensions` to try it live.

## Adding a tracking parameter

1. Add a `[name, explanation]` pair to the right group in
   [`src/lib/rules.js`](src/lib/rules.js). Write the explanation for a
   non-technical reader — it shows up verbatim in the popup.
2. Add a test in [`tests/cleaner.test.mjs`](tests/cleaner.test.mjs) proving it's
   stripped **and** that a nearby functional param is preserved.
3. Run `npm test`.

Put `ref`/`source`-style params (ones a site might legitimately route on) in
`AGGRESSIVE_PARAMS`, not `TRACKING_PARAMS`, so they're only stripped when the
user opts in.

## Things we will (politely) decline

Anything that needs a network request, broadens permissions, or expands scope
beyond cleaning links: redirect *checkers* that ping servers, QR codes, encoders,
domain inspectors, bulk uploaders, remote rule auto-updates, analytics. See the
README's "What it intentionally does NOT do" section. Keeping the scope tight is
the product.

## Code style

- Vanilla ES modules + plain CSS. No frameworks, no runtime deps.
- Use the `chrome.*` namespace through [`src/lib/browser-shim.js`](src/lib/browser-shim.js).
- Comment any non-obvious tradeoff, especially anything touching the
  conservative-by-default cleaning behavior.
- Keep `npm test` and `npm run lint` green.

## Pull requests

Small and focused. Describe the tradeoff if there is one, and confirm DevTools
shows **zero network requests** for UI changes.
