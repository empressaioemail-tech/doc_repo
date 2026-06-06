---
id: 2026-05-29_hauska-brief-extension_extension-agent_replit_ui_port_close
title: Close — Replit UI port into hauska-brief-extension
date: 2026-05-29
agent: extension-agent
repo: hauska-brief-extension
dispatch: 2026-05-29_extension-agent_replit_ui_port
related: [75f_replit_ui_export_package_spec, 75d_property_brief_ui_replit_handoff, 75e_property_brief_collaboration_sharing_handoff]
---

# Close — Replit UI port into extension

**Repo:** `P:\hauska-brief-extension`  
**Version:** `0.5.5` (from `0.5.4`; context-invalid fix + listing panel Replit skin)

## Post-port fix (2026-05-29)

### Extension context invalidated (Zillow console spam)

**Cause:** After reloading the unpacked extension, the old content script on open tabs still runs `setInterval` / `MutationObserver` → `syncPanelClasses()` → `ensurePanel()` → `chrome.runtime.getURL()` throws.

**Fix in `src/content/intel-panel.js`:**

- `extensionAlive()` / `markContextDead()` guards on all chrome API paths
- Stop interval + observer when context dies
- `syncPanelClasses()` skips `ensurePanel()` when context is dead and host already exists
- User-friendly alert on Run brief / Deep research if context is stale (refresh page)

### Listing panel Replit skin (deferred item shipped)

- Panel HTML restructured to match Replit `panel/panel.html` (hero, Run full brief, Deep research + Share row, At a glance rows)
- `inject.css` rewritten with Replit tokens (`#2196F3`)
- `layPanelGlanceHtml()` in `lay-render.js` for verdict rows

**Operator action after reload:** **Refresh any open Zillow/Redfin tabs** once after extension reload to inject the new content script cleanly.

**Source export:** `P:\replit-property-brief-ui-2026-05-29\replit-property-brief-ui\`

## Operator decisions (locked)

| Decision | Choice |
|----------|--------|
| Accent color | Replit `#2196F3` (not extension `#38bdf8`) |
| Pro mode toggle | Out — consumer mode only |
| Share modal copy | Approved as-is from Replit |

## Shipped

### Deep Research shell (primary target)

| Replit export | Extension target | Status |
|---------------|------------------|--------|
| `index.html` body structure | `research/research.html` | Done |
| `styles.css` tokens + layout | `research/research.css` | Done |
| Top action bar (collaborators, wallet, Share, Run brief, Settings) | `#hauska-topbar` | Done |
| Header verdict pills + brand row | `#hauska-verdicts`, `#brand-label` | Done |
| Left property nav | `#property-nav`, `#recent-list` | Done |
| Chat-first layout + seed cards | `#chat`, starter chips | Done |
| Attachments drawer | `#hauska-attachments` | Done (UI; upload backend unchanged) |
| Share modal | `#hauska-share-modal` | Done, wired to `createWorkspaceShare` |
| Consumer mode (no citations rail) | `body.hauska-consumer-mode` | Done |

### JS merge (`src/research/research-app.js`)

Rewrote app layer to render Replit UI while preserving v0.5.3 behavior:

- Workspace API: `fetchRecentWorkspaces`, `fetchWorkspace`, `createWorkspaceShare`, `fetchWallet`
- Research chat: `fetchResearchChat`, starter prompts, sparse-reply honest template
- Inline atom chips via `inline-atoms.js` + brief refs
- Schools starter short-circuit (no hallucination)
- GTM client events
- Share URL flex: accepts `shareUrl`, `url`, or `shareToken` from API response

### Build + version

- `manifest.json` → **0.5.4**
- Bundles rebuilt: `research/research-bundle.js`, `dist/*`, `popup/popup.js`, panel bundles

## DOM hooks preserved

All dispatch contract IDs intact: `#app`, `#address`, `#jurisdiction`, `#property-nav`, `#recent-list`, `#chat`, `#citations-panel`, `#citation-list`, `#suggestions`, `#chat-form`, `#chat-input`, `.hauska-consumer-mode`.

New Replit IDs prefixed `hauska-` (topbar, share modal, attachments, wallet, verdicts).

## DELTA — deferred

| Replit item | Status |
|-------------|--------|
| `panel/` listing panel mock | Deferred — Deep Research was primary; panel still uses prior lay-render styling |
| `collaboration/` standalone mock | Merged into research shell only |
| `screenshots/desktop-1280.png`, `mobile-390.png` | Not in export zip (empty folder) — operator visual acceptance pending manual reload |
| Pro mode toggle | Explicitly out per operator |
| Paywall / Stripe top-up UI | Out of scope |

## Acceptance

| Criterion | Status |
|-----------|--------|
| Deep Research matches Replit layout at 1280px / 390px | Done (CSS ported; operator screenshot compare pending) |
| DOM hook IDs preserved or migrated | Done |
| Live `/brief` + `/research/chat` wiring intact | Done (no API path changes) |
| Consumer mode: inline citations, no permanent rail | Done |
| `node scripts/build.mjs` green | Done |
| Version bumped | Done (`0.5.4`) |

## Operator smoke (manual)

1. Chrome → Extensions → Reload unpacked `P:\hauska-brief-extension` (confirm **0.5.4**).
2. Options: prod API + Hauska key configured.
3. Zillow (or Matrix) listing → **Run brief** → verdict cards in panel.
4. **Deep research** → confirm topbar, property nav, verdict pills, seed message cards.
5. Tap starter chip → chat reply + confidence footer; consumer mode hides `#citations-panel`.
6. **Share** → modal opens → copy link (requires workspace with `wsId`).
7. Wallet pill shows when API returns balance.
8. Resize to ~390px — chat column stacks; property nav collapses per CSS.

## Files touched

- `manifest.json`
- `research/research.html`
- `research/research.css`
- `src/research/research-app.js`
- Built: `research/research-bundle.js`, `dist/*`, `src/content/content-bundle.js`, `src/panel/panel-bundle.js`, `popup/popup.js`

## Blockers

None for build. Live API smoke requires operator key + listing context.
