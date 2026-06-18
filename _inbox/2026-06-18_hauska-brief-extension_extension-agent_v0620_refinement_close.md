# v0.6.20 refinement pass — ship report

**Date:** 2026-06-18  
**Version:** `0.6.20`  
**Branch:** `extension/unified-signin-v067`  
**Build:** keyed release — `release/` + `hauska-brief-extension-v0.6.20.zip`

## Summary

Six-item refinement pass on Max spatial map UX, dock layout, checkout polling, and global chat context. Panel disclaimer padding fixed in shadow DOM; map tab is a slim pull-tab; deep-dive columns are collapsible/resizable; map uses light basemap on deep brown canvas; checkout no longer relies on broken `chrome-extension://` Stripe redirect; chat POST includes live map state.

---

## 1. Panel disclaimer padding (shadow DOM)

**Problem:** Disclaimer below panel chat bar had wrong padding — prior fixes targeted `research.css`, which does not apply inside the shadow panel.

**Fix:**
- `src/content/inject.css` — `.panel__chat` bottom padding removed from container; `.panel__chat-foot` gets `padding: 8px 16px 12px` + `flex-shrink: 0`; `.panel__foot` hidden when chat is visible
- `src/content/intel-panel.js` — disclaimer rendered as `<p class="panel__chat-foot">…</p>` inside chat block
- Regenerated `styles/hauska-shadow.css` via `node scripts/sync-hauska-css.mjs`

**Verify:** Open Deal radar panel on a listing → expand chat → disclaimer should sit below input with symmetric horizontal padding matching the form.

---

## 2. Map tab — slim pull-tab (not full-height bar)

**Problem:** Collapsed map rendered as a tall black vertical bar (gate/loading shells forced `width/height: 100%`).

**Fix:**
- `styles/site-map.css` — gate/loading/error shells only expand to full pane when `data-expanded="true"`; collapsed = 26px absolute tab
- `research/research.css` — when map closed, `.hauska-spatial-shell` is absolutely positioned on the brief pane edge (26px wide); tab floats over chat, not in a zero-width grid column

---

## 3. Dock layout — collapsible / resizable columns

**Problem:** Brief / map / rail columns fought for space; map expand did not cleanly dock beside chat.

**Fix:**
- `src/lib/research-dock.js` — nav | center | rail widths persisted in `localStorage`; collapse toggles; map split resizer
- `research/research.html` — `#hauska-dock-root` grid with resizers + collapse buttons
- `research/research.css` — dock grid, split pane, collapsed-tab overlay rules
- `src/lib/site-map.js` — map expand/collapse calls `onExpandChange` → `researchDock.setMapOpen()` (updates resizer + `--dock-map-w`, not just `dataset`)

**Verify:** Toggle nav/rail collapse; drag nav/rail/map resizers; click Map tab → brief + map side-by-side with 5px splitter; collapse map → slim tab returns to brief edge.

---

## 4. Map theme — light basemap, deep brown canvas

**Fix in `src/lib/hauska-map-style.js`:**
- Carto `light_all` raster basemap (desaturated / warmed)
- Canvas `#3d2f24` (`MAP_CANVAS_BROWN`)
- Rich GIS overlay paints (zoning subcodes, flood, OZ, parcel stroke)

---

## 5. Post-checkout redirect bug — poll entitlement instead

**Problem:** `successUrl = chrome-extension://…?billing=success` → browser "site can't be reached" (web → extension navigation blocked).

**Fix:**
- `src/lib/billing-api.js` — `billingReturnUrl()` returns `https://hauska.io/brief?checkout=…` only; added `pollEntitlementAfterCheckout()` + `focusExtensionApp()`
- After opening Stripe checkout, panel + research poll `GET /entitlement` every 2.5s until `proActive` / `maxActive` flips
- On success: refresh entitlement UI, focus extension research tab, re-render map if Max
- Legacy `?billing=` query stripped on load; pending checkout resumed from `chrome.storage.local` on research init
- **No user-facing dependency on Stripe redirect landing in extension**

---

## 6. Global chat awareness — map context in `/research/chat`

**Fix:**
- `src/lib/site-map.js` — `getMapChatContext()` snapshot: expanded state, active filters, jurisdiction, visible layers, researched properties, reasoning overlays
- `src/lib/research-api.js` — POST body accepts `mapContext`, `jurisdiction`
- `src/research/research-app.js` — `callLiveResearch()` passes live map snapshot on every chat turn

**Verify:** Network tab on `/research/chat` → body includes `mapContext` when map shell is mounted.

---

## Build artifacts

```powershell
node scripts/sync-hauska-css.mjs
npm run build
.\scripts\build-release.ps1   # requires HAUSKA_EXTENSION_PUBLIC_KEY
```

| Output | Path |
|---|---|
| Dev load (repo root) | `P:\hauska-brief-extension` |
| Tester load | `P:\hauska-brief-extension\release` |
| Zip | `P:\hauska-brief-extension\hauska-brief-extension-v0.6.20.zip` |

---

## Operator QA checklist

1. **Panel padding** — listing page → Deal radar → chat disclaimer spacing
2. **Map tab** — Deep Research with brief → collapsed = ~26px "Map" tab on right edge of brief (not black bar)
3. **Dock** — expand map → resizable split; collapse nav/rail; no squished middle column
4. **Theme** — light tiles on brown canvas when map expanded
5. **Checkout** — Pro/Max upgrade → complete Stripe → entitlement poll unlocks UI (no broken extension URL tab)
6. **Chat** — ask area question ("where is rent strongest") → `mapContext` in request body

### Map QA without Max sub
- Dev product `map-max-qa` or `hauskaMapMaxQa: true` → install id `extension-agent-map-max-qa`

---

## Files touched (refinement)

| Area | Files |
|---|---|
| Shadow panel | `src/content/inject.css`, `src/content/intel-panel.js`, `styles/hauska-shadow.css` |
| Map / dock | `src/lib/site-map.js`, `src/lib/research-dock.js`, `src/lib/hauska-map-style.js`, `styles/site-map.css`, `research/research.html`, `research/research.css` |
| Billing poll | `src/lib/billing-api.js`, `src/research/research-app.js`, `src/content/intel-panel.js` |
| Chat context | `src/lib/research-api.js`, `src/research/research-app.js`, `src/lib/site-map.js` |
| Version | `manifest.json`, `package.json` → **0.6.20** |
| Bundles | `research/research-bundle.js`, `src/content/content-bundle.js`, `release/*` |

---

## Notes

- SW static-import fix from v0.6.19 (`brief-storage.js`) retained — no dynamic `import()` in service worker graph.
- Close reports stay in `P:\doc_repo\_inbox\` — never `_inbox/` inside extension repo (breaks Load unpacked).
