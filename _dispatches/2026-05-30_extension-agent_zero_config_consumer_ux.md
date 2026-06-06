---
id: 2026-05-30_extension-agent_zero_config_consumer_ux
title: Dispatch — Zero-config consumer UX v0.6.5 (single consent, no settings gate)
date: 2026-05-30
agent: extension-agent
repo: hauska-brief-extension
kind: dispatch
priority: P0
related: [75a_hauska_brief_extension, 2026-05-29_cc-agent-C_extension_public_client_key, 2026-05-30_property_brief_qa_fix_wave_index, 2026-05-30_extension-agent_qa_fix_wave_v064]
blocked_on: cc-agent-C public key on prod (parallel; dev key bake OK for internal QA)
---

# Extension — zero-config consumer UX v0.6.5

You are **extension-agent**, owner of `P:\hauska-brief-extension`.

**Context:** Operator QA on prod deploy (2026-05-30). Backend is live (#138 + #139 + env patch). Extension v0.6.4 fixes storage/share/demo issues but **internal unpacked builds still require manual `hauskaKey` and Brief API URL** because no release build with baked public key. Operator reports **three consent/permission surfaces** (listing welcome, options page, share modal graph toggle). Consumer flow must be: **install → listing → one terms accept → Run brief**.

## Model (HR-12)

**Grok Build 0.1** — multi-surface UX pass.

## Read first

1. [`75a_hauska_brief_extension.md`](../75a_hauska_brief_extension.md) — consumer vs operator tiers
2. [`2026-05-29_cc-agent-C_extension_public_client_key.md`](2026-05-29_cc-agent-C_extension_public_client_key.md) — public key contract
3. `src/lib/brokerage-api.js` — `resolveHauskaKey()`, `isApiConfigured()`
4. `src/lib/install-defaults.js` — `PROD_BRIEF_API_URL`, `ensureInstallDefaults()`
5. `src/content/intel-panel.js` — `renderWelcome()`, share errors
6. `src/research/research-app.js` — share modal consent toggle
7. `options/options.html` — current settings layout

## Workspace

- Branch: `extension/zero-config-consumer-v065`
- Bump manifest to **0.6.5**
- `node scripts/build.mjs` before close (operator runs `build-release.ps1` after cc-agent-C ships key)

---

## Task 1 — Zero-config API path (P0)

**Goal:** Never prompt end users for API URL or key when extension has baked public key OR install defaults.

1. Call `ensureInstallDefaults()` from background service worker on startup (in addition to options page).
2. `isApiConfigured(settings)`:
   - `briefApiUrl` defaults to `PROD_BRIEF_API_URL` if empty (inline fallback, not only on first install).
   - `resolveHauskaKey()` returns baked `__HAUSKA_EXTENSION_PUBLIC_KEY__` when user `hauskaKey` blank.
3. Remove user-facing errors that say "Add Hauska key in extension settings" when public key is present. Replace with:
   - Public key present: proceed silently.
   - No public key and no user key (dev unpack): "Internal build not configured — contact Hauska or use Advanced settings."
4. Do **not** open options page on brief failure unless user explicitly clicks settings.

---

## Task 2 — Single consent surface (P0)

**Problem:** Terms + graph opt-in appear on listing welcome AND options page AND share modal.

**Target:**

| Surface | After |
|---------|-------|
| Listing panel welcome | **Only** consent UI: required terms checkbox + optional graph (default **unchecked**) + "Continue" |
| Options page | Remove duplicate terms/graph from main card. Rename section to **Privacy** with single graph opt-in toggle (only if terms already accepted). Link to ToS/Privacy URLs. |
| Share modal | **Remove** "Help improve Hauska's network" toggle. Read `gtmGraphOptIn` from storage only. Optional footer link: "Privacy settings" → options page. |

**Rules:**

- `hasLocalConsent()` gates Run brief (unchanged).
- `submitConsent()` once on listing Continue.
- Options graph toggle updates consent without re-showing welcome.

---

## Task 3 — Hide operator-only surfaces on public tier (P0)

When `hasPublicClientKey()` && !user `hauskaKey`:

| Control | Behavior |
|---------|----------|
| Share button | **Hidden** (server returns 403 `account_upgrade_required` anyway) |
| Wallet display | Hidden in research topbar |
| Share modal | Do not render / disable entry points |
| Error copy | Never mention API key |

When user has **override** `hauskaKey` in Advanced (operator/dev):

- Share + wallet behave as today.

---

## Task 4 — Options page restructure (P1)

**Default view (no `<details>` needed for consumers):**

- Version, short "How it works" (open listing → Run brief)
- Privacy: graph opt-in toggle + consent status line
- Link: Advanced (Hauska team / developers)

**Advanced `<details>` only:**

- Override API key, Brief API URL, MCP URL, jurisdiction, test connection
- Collapsed by default; label clearly "Hauska team / developers"

Remove "Test connection" from visible main flow. Keep in Advanced.

---

## Task 5 — Error message audit (P1)

Grep and fix all user-visible strings referencing:

- "Hauska key", "API configured", "extension settings" (when public key path applies)
- Share link unavailable generic message → tier-specific copy

Files: `intel-panel.js`, `research-app.js`, `brief-engine.js` (background errors), `background/index.js`.

---

## Task 6 — Tests + build

- Unit test: `isApiConfigured()` true with empty user key when `getExtensionPublicKey()` mocked.
- Unit test: `canShowShareButton()` false on public-only install.
- Manifest 0.6.5; `npm test` green.

---

## Out of scope

- Minting public key (cc-agent-C)
- Chrome Web Store upload (operator)
- Stripe / account upgrade UX
- Email invite in share modal

---

## Acceptance criteria

- [ ] Fresh install (simulated: clear storage + reload) with **release build** public key: Run brief works with **zero** options visit
- [ ] Listing welcome is the **only** required consent interaction
- [ ] Options page has no duplicate terms checkbox on main view
- [ ] Share modal has no graph toggle; public installs hide Share
- [ ] Advanced settings still work for operator override key
- [ ] Manifest **0.6.5**; tests green

## Report back

`P:/doc_repo/_inbox/2026-05-30_hauska-brief-extension_extension-agent_zero_config_consumer_ux_close.md`

Include PR URL, SHA, before/after screenshot checklist (listing welcome only, no options gate).

## Operator handoff (in close file)

```powershell
# After cc-agent-C provides BROKERAGE_EXTENSION_PUBLIC_KEY:
cd P:\hauska-brief-extension
$env:HAUSKA_EXTENSION_PUBLIC_KEY = "<from cc-agent-C close — never commit>"
.\scripts\build-release.ps1
# chrome://extensions → Reload → test Round Rock with no options changes
```
