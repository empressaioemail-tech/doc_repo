---
date: 2026-06-17
agent: extension-agent
repo: hauska-brief-extension
branch: extension/unified-signin-v067
version: 0.6.16
dispatch: 2026-06-17_extension-agent_prod_readiness_control_audit
status: code-ready — operator screen captures owed
---

# Close — prod-readiness control audit (v0.6.16)

## Version

| Field | Value |
|-------|-------|
| **Version** | **0.6.16** |
| **Prod API** | `https://cortex-api-tds7av26va-uc.a.run.app` |
| **Billing contract** | `POST /api/brokerage/v1/billing/checkout` + `/billing/portal` + `/billing/checkout/complete-simulated` (simulated mode) |

## Priority fixes

### 1. Upgrade flow — DONE

- Entitlement strip (panel) + wallet chip (research) now expose **Upgrade to Pro** when free briefs exhausted.
- Pro users see **Manage subscription** link.
- Click → `startProCheckout()` / `startBillingPortal()` in `src/lib/billing-api.js` → opens `checkoutUrl` / `portalUrl` in new tab.
- Simulated prod (no Stripe keys): on `?billing=success` return → `POST /billing/checkout/complete-simulated` → `GET /entitlement` → **Pro — unlimited briefs**.
- 402/paywall body errors append inline **Upgrade to Pro** button (`paywallUpgradeActionsHtml`).

### 2. Address input garbled/stale — DONE

**Root cause:** `capturedProperty` from page auto-detect persisted across listing navigations and took precedence over Zillow slug adapter → header correct (slug) but `#hauska-manual-addr` retained garbled auto-detect text.

**Fix (`intel-panel.js`):**
- `detectProperty()` prefers listing adapter (Zillow slug) over stale capture.
- Clear `capturedProperty` + manual input on every URL change.
- Skip `detectAddressOnPage()` auto-capture on listing pages.
- `syncCaptureRow()`: on listings with address, hide row and **always clear** input value.

### 3. alert() → inline states — DONE

Replaced all `alert()` in panel + research surfaces with `showPanelNotice` / `showResearchNotice` / `showAttachmentUploadMessage` / `renderError` / `showBriefFailedTerminal`.

No `alert()` remains in built bundles (`content-bundle.js`, `research-bundle.js`).

## Control-by-control audit

Legend: **PASS** = bound handler + real flow + inline success/error. **FIX** = repaired this release. **N/A** = not present on surface. **PLACEHOLDER** = intentional stub pending backend.

### Panel (`intel-panel.js`)

| Control | Status | Flow |
|---------|--------|------|
| Analyze address | **PASS** | `#hauska-btn-capture` → `submitManualCapture` → `CAPTURE_ADDRESS` + `setAddressDisplay`; inline error if empty |
| Run full brief | **PASS** | `#hauska-btn-run` → consent gate → `RUN_BRIEF` port → `renderSummary` / `renderError` + upgrade CTA on 402 |
| Sign up | **PASS** | `signUpWithHauska` via background; inline error on failure |
| Sign in | **PASS** | `signInWithHauska`; inline error on failure |
| Sign out | **PASS** | `signOut` → refresh auth row |
| Deep research | **PASS** | `OPEN_DEEP_RESEARCH` / `window.open(research.html#ws=…)`; inline error if extension stale |
| + Research property | **PASS** | Clears state → `OPEN_DEEP_RESEARCH` fresh |
| Share | **PASS** | `createWorkspaceShare` → clipboard; inline success/error |
| Panel chat Ask | **PASS** | `fetchResearchChat` `{address, message, history}`; thread inline errors |
| Expandable signal cards | **PASS** | `wireFactorCards` toggle `.factor--expandable` |
| Consent checkbox | **PASS** | `submitConsent` → enables Run |
| Settings | **N/A** | No settings control on panel (research topbar only) |
| Attachments + Add | **N/A** | Research rail only |
| Starter chips | **PASS** | Pre-brief → `runBrief`; post-brief → scroll factor or stash + deep research |
| Keep / Pass | **PASS** | `recordVerdictAction` → local profile stats deposit |
| View listing | **N/A** | Research topbar only |
| Reopen workspace (This week) | **N/A** | Panel prefetches workspaces but has no nav list (research-only) |
| Privacy link | **N/A** | Share modal only (research) |
| Add deals to learn | **N/A** | Research rail placeholder |
| Upgrade to Pro | **FIX** | Entitlement strip + paywall error → Stripe checkout |
| Manage subscription | **FIX** | Pro strip → Stripe portal |
| Close / tab expand | **PASS** | UI-only |

### Deep research (`research-app.js`)

| Control | Status | Flow |
|---------|--------|------|
| Property address + Run brief | **PASS** | `#hauska-address-form` → `runBriefFromAddress` → `RUN_BRIEF` message |
| + Research a property | **PASS** | `enterNewPropertyResearch` → empty state + focus input |
| Chat Ask | **PASS** | `fetchResearchChat` or address-first brief if no property |
| Starter chips | **PASS** | Live → `submitQuestion`; no-brief → focus input; unavailable → inline notice (was alert) |
| Share | **PASS** | Modal → `ensureShareLink`; inline error in modal + topbar notice |
| View listing | **PASS** | `#hauska-run-brief` → `chrome.tabs.create(property.url)` |
| Settings | **PASS** | `#hauska-settings-btn` → `chrome.runtime.openOptionsPage()` |
| Attachments + Add | **PASS** | Presign → PUT → complete; inline progress/success/422 error |
| Upload CC&R (chat CTA) | **PASS** | `.hauska-upload-ccr-btn` → same upload pipeline |
| Reopen workspace (This week) | **PASS** | `#recent-list` → `reopenWorkspace` → `fetchWorkspace` → `refreshBriefUi` |
| Privacy link (share modal) | **PASS** | → options page |
| Consent checkbox | **PASS** | `ensureResearchConsent` → inline error if unchecked |
| Upgrade / Manage (wallet) | **FIX** | Topbar wallet chip actions → billing API |
| Site map (Max hero) | **PASS** | `fetchMapData` → `renderSiteMap` / tier gate |
| Add deals to learn | **PLACEHOLDER** | Static chip — profile synthesizer not wired (documented in rail copy) |
| Collaborators avatars | **PLACEHOLDER** | Display-only when workspace has collaborators; no modal yet |

## Files changed (v0.6.16)

| File | Change |
|------|--------|
| `src/lib/billing-api.js` | **NEW** — checkout + portal |
| `src/lib/ui-notice.js` | **NEW** — inline notices |
| `src/lib/entitlement-api.js` | Upgrade/manage HTML + paywall helpers |
| `src/content/intel-panel.js` | Address fix, billing, inline notices, audit wiring |
| `src/research/research-app.js` | Billing wallet, inline notices, paywall CTAs |
| `src/content/inject.css` | Notice + entitlement action styles |
| `research/research.css` | Research notice + wallet link styles |
| `manifest.json` | 0.6.16 |

## Live verification

| Check | Result |
|-------|--------|
| `node scripts/build.mjs` | **PASS** (keyed build) |
| `node scripts/verify-billing-live.mjs` | **ALL PASS** on cortex-api-00199-cen — install `qa-billing-v016-*`; checkout 200 `mode:simulated`; complete-simulated → `proActive:true`; entitlement → `proActive:true`; portal 200 `mode:simulated` |
| `alert()` in src bundles | **0** in panel + research bundles |

**Operator:** reload unpacked **v0.6.16**, sign in, tap **Upgrade to Pro** with a fresh install id, complete/simulate Stripe checkout, confirm entitlement strip shows **Pro — unlimited briefs**. Capture chrome-extension:// PNGs for upgrade strip, paywall inline error, corrected listing address input (empty/hidden on Zillow), and inline auth/share notices.

## Screen captures owed (operator)

1. Panel entitlement strip — **Upgrade to Pro** (0 free briefs)
2. Panel 402 error with inline upgrade button
3. Zillow listing — header correct, manual addr empty/hidden
4. Panel inline sign-in / share notice (no native alert)
5. Research wallet **Upgrade** + post-checkout **Pro — unlimited**
6. Research attachment 422 inline error (reuse v0.6.15 bad PDF test)
