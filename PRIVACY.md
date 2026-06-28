# Privacy Policy — Link Wash

_Last updated: 28 June 2026_

Link Wash is built around a single promise: **it does not collect, transmit, or
share any data, ever.**

## What we collect

**Nothing.** Link Wash has no servers, no accounts, no analytics, and no
telemetry.

## What the extension stores

Your settings (aggressive mode, unwrap redirects, auto-copy, and your custom
parameter list) are saved **only on your own device** using the browser's
`chrome.storage.local` API. This data never leaves your computer and is not
readable by us or anyone else. Removing the extension deletes it.

## Network activity

Link Wash makes **zero network requests**. All link cleaning is computed locally
in JavaScript on your device. The "unwrap redirect links" feature decodes the
link text locally and **never visits the link** over the network. You can verify
this yourself in your browser's DevTools → Network tab.

## Permissions

Link Wash requests the minimum permissions needed to function
(`contextMenus`, `clipboardWrite`, `storage`, `activeTab`, `offscreen`) and
**no** host, network, browsing-history, or cookie access. Each permission is
explained in the [README](README.md#permissions-and-why-each-one-is-needed).

## Contact

Questions? Open an issue at <https://github.com/Its-sultan/Link_Wash/issues>.

Because Link Wash collects no data, there is nothing to request, export, or
delete from us — there is no "us" that holds your data.
