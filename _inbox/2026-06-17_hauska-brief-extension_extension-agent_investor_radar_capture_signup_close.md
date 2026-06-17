---
id: 2026-06-17_hauska-brief-extension_extension-agent_investor_radar_capture_signup_close
title: Close — Investor radar verdict reframe, universal capture, signup, asserted confidence
date: 2026-06-17
agent: extension-agent
repo: hauska-brief-extension
dispatch: 2026-06-17_extension-agent_investor_radar_capture_signup
---

# Close — Investor radar verdict reframe, universal capture, signup, asserted confidence

**Repo:** `P:\hauska-brief-extension`  
**Branch:** `extension/unified-signin-v067` (baseline merged; sign-in background delegation retained)  
**Version:** `0.6.8` (manifest + package.json unified; was `0.6.7` / `0.5.0` drift)  
**Build:** `node scripts/build.mjs` — OK  
**Tests:** `test-brief-storage.mjs` OK; `test-consumer-tier.mjs` FAIL pre-existing (`canShowShareButton false on public-only install`)

## Shipped (dispatch tasks 6–8)

### Task 6 — Investor verdict reframe (structure-only; reskin held)

- **`src/lib/lay-summary.js`:** Investor `headlineVerdict` (deal / worth a look / dead), `factorGroups` (become / kill-it), rules fallback synthesizer; normalizes API `laySummary.headlineVerdict` + parcel id when present.
- **`src/lib/lay-render.js`:** Headline card, factor rows, fits-box line, Keep/Pass actions; `layPanelBodyHtml` composes investor layout.
- **`src/content/intel-panel.js`:** Renders investor body; wires Keep/Pass to profile capture.
- **`src/content/inject.css`:** Functional radar/verdict/factor/confidence CSS only — **not** a full claude-design token reskin (per HOLD).

### Asserted confidence (commitment #2)

- **`src/lib/envelope-confidence.js`:** Reads sealed envelope `confidence{value,kind}` + provenance (`source.adapter`, `dataVintage`, degraded reason). Renders **Asserted** label + meter + provenance line; **never** bare `72%` / `100%` when `kind=asserted`.
- **`src/research/research-app.js` + `research/research.css`:** Chat footer uses asserted renderer (replaces bare `%` meter).

Smoke proof (verbatim):

```
<span class="hp-conf hp-conf--asserted"><span class="hp-conf-kind">Asserted</span><span class="hp-conf-meter" ...><span style="width:72%"></span></span><span class="hp-conf-prov">engine-api · 2024-06</span></span>
```

Note: no `.hp-conf-pct` element — percentage text suppressed for asserted kind.

### Task 7 — Universal capture (`activeTab` + `contextMenus`)

- **`manifest.json`:** Added `contextMenus` permission (kept `activeTab`; no new broad host permission).
- **`src/background/index.js`:** Context menu “Analyze with Hauska Deal Radar” on text selection; `ANALYZE_SELECTION` / `CAPTURE_ADDRESS` handlers; panel open on capture.
- **`src/lib/address-detect.js`:** US address regex, page auto-detect, manual/selection property objects.
- **`src/content/intel-panel.js`:** Paste field + Analyze button on non-listing pages; auto-detect on page text; selection + capture message handlers; toolbar click opens panel everywhere.

Adapters (Zillow/Redfin/Matrix) remain enrichment-only; generic capture is the default path.

### Task 8 — Signup + sign-in

- **`src/lib/session-auth.js`:** `runHauskaWebAuthFlow(settings, { intent: 'signup'|'signin' })`; `signUpWithHauska()`; content-script delegation via background `SIGN_IN` with intent.
- **`src/content/intel-panel.js`:** Sign up + Sign in buttons in panel auth row.

### Other

- **`src/lib/profile-api.js`:** Keep/Pass → `/profile/verdict-action` with local stats fallback.
- **`src/lib/site-context-render.js`:** Regrid layer labels removed (Cotality/parcel generic labels).
- **Version drift:** `package.json`, `manifest.json`, `mcp-client` clientInfo → `0.6.8`.

## Held (per dispatch / operator)

| Item | Status |
|------|--------|
| Panel reskin to claude-design tokens | **HOLD** — structure + functional CSS only |
| Task 11 Max site-map render | **QUEUED** — blocked on C/E/M layer capability backend |
| Lead feed surface | **CUT** — not built |
| Live Cotality investor API verdicts | **Blocked on cc-agent-C** — UI consumes shape + rules fallback |

## Screen recording (acceptance demo script)

Record in Chrome with unpacked extension (`chrome://extensions` → Load unpacked → repo root):

1. **Capture on non-listing page:** Open any page with a US address in body text (e.g. a contact page). Select the address → right-click → **Analyze with Hauska Deal Radar** → panel opens with captured address + paste row.
2. **Manual paste:** On `google.com`, click extension icon → paste `1208 Walnut Ave, Austin, TX 78702` → **Analyze address**.
3. **Verdict + asserted confidence:** Accept terms → **Run full brief** (or use cached brief) → headline tier + factor cards + **Asserted** confidence line (no bare %).
4. **Signup:** Click **Sign up** → hosted `extension-login?intent=signup` web auth flow (requires live cortex-api).

> Agent could not attach a `.webm` from this environment (extension content scripts are not loadable in the automation browser). Operator: capture the four steps above as one recording and attach to this close file or `_inbox` media folder.

## Files touched (summary)

21 modified + 4 new modules (`address-detect`, `envelope-confidence`, `profile-api`, `background/capture.js`). Bundles rebuilt in-place.

## Next when unblocked

- Wire live `laySummary.headlineVerdict` + Cotality parcel id from cc-agent-C `/brief` response.
- Profile workspace reskin (`research/research.html`) when design tokens stable.
- Max site-map shared component after layer capability lands (task 11).
