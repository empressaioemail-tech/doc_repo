---
id: 2026-06-16_extension-agent_g4_webstore_packaging
title: extension-agent — G4 Web Store packaging kit (manifest narrow, privacy policy, store copy, build hygiene)
date: 2026-06-16
agent: extension-agent
repo: hauska-brief-extension
kind: dispatch
related: [75h_investor_deal_radar_launch_readiness, 75g_investor_deal_radar, 2026-06-16_extension-agent_investor_deal_radar_surfaces]
blocked_on: Final submission waits on the reframe (Waves 1-3) + paywall + Pipedrive + GTM wiring. The packaging kit below can be applied now so submission is instant when the build lands.
---

# extension-agent — G4 Web Store packaging kit

You are the **extension-agent**. This is the G4 gate from [`75h`](../75h_investor_deal_radar_launch_readiness.md): everything needed to list the extension on the Chrome Web Store under the **Hauska** name. Apply the kit below. Do NOT submit until the reframe, paywall, Pipedrive, and GTM wiring are in (you do not submit a half-built product to a slow review queue), but get the package review-ready now.

## Model (HR-12)

Default **Grok Build 0.1**.

## Task 1 — version + baseline hygiene

Merge the `extension/unified-signin-v067` baseline. Unify the version across `manifest.json` (0.6.7), `package.json` (0.5.0), and `README.md` (0.6.0) to one value. Confirm committed bundles match source (`node scripts/build.mjs` produces no diff).

## Task 2 — narrow host permissions (the #1 rejection risk)

Replace the `https://*/*` host permission and the all-URLs content-script match with the listing hosts plus our API hosts. Recommended starting manifest (confirm the Matrix host list against the adapters; Matrix runs on many MLS-board subdomains, so maintain an explicit host list or move Matrix to `optional_host_permissions` + `activeTab`):

```json
"host_permissions": [
  "https://www.zillow.com/*",
  "https://www.redfin.com/*",
  "https://*.mlsmatrix.com/*",
  "https://matrix.*/*",
  "https://cortex-api-tds7av26va-uc.a.run.app/*",
  "https://mcp.hauska.dev/*",
  "https://nominatim.openstreetmap.org/*"
],
"content_scripts": [{
  "matches": [
    "https://www.zillow.com/*",
    "https://www.redfin.com/*",
    "https://*.mlsmatrix.com/*"
  ],
  "js": ["src/content/content-bundle.js"],
  "run_at": "document_idle"
}]
```

Keep `identity` (sign-in), `storage`, `unlimitedStorage`, `activeTab`, `scripting`, `tabs`. Drop the `http://127.0.0.1` and dev MCP hosts from the public build (dev-only). The proactive auto-run radar now fires only on the matched listing hosts, which is correct and reviewable.

## Task 3 — strip / gate dev artifacts

Remove from the public build: the MCP-direct dev mode, the local-MCP options, the "internal build not configured / contact Hauska" messaging, and the baked dev-key path. Public build ships with the public client key only (`HAUSKA_EXTENSION_PUBLIC_KEY`).

## Task 4 — store listing copy (apply verbatim, Hauska brand)

- **Name:** Hauska — Deal Radar for Investors
- **Short description (132 char max):** Instant, cited deal verdicts on any listing. See if a property pencils, what kills it, and how it fits your buy box. Free to start.
- **Category:** Productivity
- **Long description:** lead with the one-glance verdict, the cited reasoning + confidence, the buy-box learning, and the lead feed. State clearly it is informational and not an appraisal, CMA, or opinion of value (G3).
- **Screenshots:** the deal radar panel, the profile/who-you-are workspace, the lead feed (from the approved mockups in `p:\tmp\extension-proposal\`).

## Task 5 — privacy policy + Chrome data-use disclosure (required)

Host a privacy policy (e.g. `hauska.dev/privacy`) and fill the Chrome data-use form to match. Draft text:

> Hauska Deal Radar collects: an anonymous install identifier; the addresses and listings you choose to research; your in-app questions, keep/reject decisions, notes, and saved properties; and product usage events, only with your consent. We use this to run your property research, build your private investor profile, and improve the service. Your private research and profile are yours, are isolated to your account, and are never sold or pooled into another user's data. We do not collect browsing history outside the supported listing sites. Authentication is handled by Hauska sign-in. You can request deletion at any time.

Chrome data-use certification: declare the collected categories above, declare it is not sold, and declare it is not used for unrelated purposes or creditworthiness.

## Task 6 — package

Clean release build (`scripts/build-release.ps1` with `HAUSKA_EXTENSION_PUBLIC_KEY`), zip, validate against the Web Store checklist. Hold submission per the blocked_on note.

## Report back

`P:/doc_repo/_inbox/2026-06-16_hauska-brief-extension_extension-agent_g4_webstore_packaging_close.md`. Include the final manifest diff, the resolved Matrix host approach, and the privacy-policy URL.
