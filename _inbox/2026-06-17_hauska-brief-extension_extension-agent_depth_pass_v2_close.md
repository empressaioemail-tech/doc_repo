---
date: 2026-06-17
agent: extension-agent
repo: hauska-brief-extension
branch: extension/unified-signin-v067
version: 0.6.17
dispatch: depth_pass_v2
status: pushed — panel chrome-extension captures owed; prod profile pending traffic shift
---

# Close — depth pass v2 (v0.6.17)

## Version

| Field | Value |
|-------|-------|
| **Version** | **0.6.17** |
| **Build** | `node scripts/build.mjs` (keyed public client injected) |
| **Prod API** | `https://cortex-api-tds7av26va-uc.a.run.app` |
| **Billing** | unchanged from v0.6.16 — `POST /billing/checkout`, `/billing/portal`, `/billing/checkout/complete-simulated` |
| **Buy-box profile** | `GET /profile/buy-box`, `GET /profile`, `POST /profile/verdict-action` (+ local fallback when anonymous) |

## Pillar delivery

### 1. Upgrade before credits run out — DONE

Persistent **Upgrade to Pro** while free briefs remain (not only at 0):

| Surface | Affordance | Handler |
|---------|------------|---------|
| Panel entitlement strip | Link under “N free briefs remaining” | `entitlementPanelHtml()` → `#hauska-btn-upgrade-pro` → `startProCheckout()` |
| Research topbar wallet | “Upgrade to Pro” chip action | `renderEntitlement()` → same checkout flow |
| Settings → Plan card | **Upgrade to Pro** button | `options/index.js` → `startProCheckout()` |
| Pro users | **Manage subscription** | `startBillingPortal()` on all three surfaces |

Exhausted state still shows primary CTA button (unchanged paywall UX).

### 2. Keep in my box / Add to buy box → deep research buy-box — DONE

| Origin | Flow |
|--------|------|
| Panel **Keep in my box** | `recordVerdictAction(keep)` → `openDeepResearchTab({ workspaceDid, section: "buybox" })` |
| Panel **Pass** | `recordVerdictAction(pass)` → inline stats only (no nav) |
| Research **Add deals to learn** | Focus buy-box rail; if no brief, focus address form |
| Research **Keep in my box / Pass** (rail) | `recordRailVerdict()` → API + `renderBuyBoxRail()` + scroll highlight |
| Landing | `research.html?section=buybox#ws=<did>` → `scrollToBuyBoxSection()` + `#hauska-buybox-section.is-highlight` |
| Background | `OPEN_DEEP_RESEARCH` accepts `section` + optional prebuilt `url` |

Shared helper: `src/lib/research-nav.js` (`buildResearchUrl`, `openDeepResearchTab`, `parseResearchLanding`, `scrollToBuyBoxSection`).

Buy-box data: `src/lib/profile-api.js` — `fetchBuyBoxProfile`, `recordVerdictAction` (server when signed in; local chips/stats fallback for wedge).

### 3. Placeholder controls — DONE (hide-or-ship rule)

| Control | v0.6.16 | v0.6.17 |
|---------|---------|---------|
| Panel **Settings** (gear) | N/A | **PASS** → `chrome.runtime.openOptionsPage()` |
| Panel **This week** | N/A | **PASS** → `fetchRecentWorkspaces` → click `reopenWorkspace` |
| Panel **Attachments + Add** | N/A | **PASS** → presign upload (`encumbrance-upload-api.js`) |
| Research **Add deals to learn** | PLACEHOLDER | **PASS** → buy-box teacher rail |
| Research **Collaborators** | PLACEHOLDER | **HIDDEN** — invite out of scope; `renderCollaborators()` forces `hidden` |
| Settings **Plan** tier | N/A | **PASS** → entitlement label + upgrade/manage |

**Rule:** no visible no-op controls remain on shipped surfaces.

## Control-by-control audit

Legend: **PASS** = bound + real flow. **FIX** = repaired this release. **HIDDEN** = intentionally not shown. **N/A** = not on surface.

### Panel (`intel-panel.js`)

| Control | Status | Flow |
|---------|--------|------|
| Settings (gear) | **FIX** | `openOptionsPage()` |
| This week list | **FIX** | `loadRecentWorkspaces` → `renderPanelRecentList` → `reopenWorkspace` |
| Attachments + Add | **FIX** | `listEncumbrances` + `uploadEncumbrancePdf` presign pipeline |
| Upgrade to Pro (while credits remain) | **FIX** | Entitlement strip link always when not Pro |
| Keep in my box | **FIX** | Verdict + navigate `?section=buybox` deep research |
| Pass | **PASS** | `recordVerdictAction(pass)` + profile deposit |
| Manage subscription | **PASS** | Pro strip → portal |
| All v0.6.16 panel controls | **PASS** | unchanged |

### Deep research (`research-app.js`)

| Control | Status | Flow |
|---------|--------|------|
| Wallet Upgrade (anytime) | **FIX** | Shown when not Pro regardless of remaining credits |
| Add deals to learn | **FIX** | `renderBuyBoxRail` action chip → scroll/highlight buy-box |
| Keep in my box / Pass (rail) | **FIX** | `recordRailVerdict` + refresh learned chips |
| Collaborators avatars | **HIDDEN** | Button stays `hidden`; no dead invite UI |
| Workspace hash landing `#ws=` | **FIX** | `tryOpenWorkspaceFromHash` via recent list match |
| All v0.6.16 research controls | **PASS** | unchanged |

### Settings (`options/index.js`)

| Control | Status | Flow |
|---------|--------|------|
| Plan / entitlement label | **FIX** | `fetchEntitlement` + `entitlementLabel` |
| Upgrade to Pro | **FIX** | `startProCheckout` → new tab |
| Manage subscription | **FIX** | `startBillingPortal` |
| Account sign-in/out | **PASS** | unchanged |
| Privacy / Advanced | **PASS** | unchanged |

## Files changed (v0.6.17)

| File | Change |
|------|--------|
| `src/lib/research-nav.js` | **NEW** — deep research URL + buy-box scroll |
| `src/lib/profile-api.js` | Buy-box fetch + verdict-action + local fallback |
| `src/lib/entitlement-api.js` | Upgrade link while credits remain |
| `src/content/intel-panel.js` | Settings, This week, attachments, keep→research buy-box |
| `src/research/research-app.js` | Buy-box rail, anytime upgrade, hash landing, hide collaborators |
| `src/options/index.js` + `options/options.html` | Plan tier + billing actions |
| `src/background/index.js` | `OPEN_DEEP_RESEARCH` section/url |
| `src/content/inject.css` + `styles/hauska-shadow.css` | Panel recent/attachments/settings + entitlement upgrade link |
| `research/research.html` + `research/research.css` | Buy-box section IDs, keep/pass rail, chip styles, highlight |
| `manifest.json` | 0.6.17 |
| `scripts/verify-profile-live.mjs` | **NEW** — install-scoped keep/pass durability smoke |

| Bundles | Rebuilt via `node scripts/build.mjs` |

## Live verification

| Check | Result |
|-------|--------|
| `node scripts/build.mjs` | **PASS** — keyed build, bundles updated |
| `node scripts/verify-profile-live.mjs` (main prod) | **PENDING** — `GET /profile` → **401** as of 2026-06-18; traffic still on pre-00204 revision |
| `HAUSKA_BRIEF_API_URL=https://canary---cortex-api-tds7av26va-uc.a.run.app node scripts/verify-profile-live.mjs` | **ALL PASS** on `cortex-api-00204-kew` |
| `alert()` in src | **0** (panel + research) |
| Local HTTP smoke (research buy-box rail) | **PASS** — Add deals / Keep / Pass visible; buy-box copy rendered |
| Local HTTP smoke (options Plan card) | **PARTIAL** — Plan section markup present; `chrome.*` APIs require unpacked extension context |
| Billing live script | Not re-run this pass (unchanged from v0.6.16 ALL PASS) |

### Server-side “Keep in my box” — profile verdict-action (2026-06-18)

cc-agent-C buy-box teacher close (`cortex-api-00204-kew`, image `9fe187ea`) verified on **canary** with a **fresh install id** per run:

```
Install: qa-buybox-v017-1781791987728
GET  /profile                         → 200  owner=install:qa-buybox-v017-… kept=0
POST /profile/verdict-action {keep}   → 200  { ok: true, kept: 1, passed: 0 }
GET  /profile                         → 200  kept=1 (durable)
```

**Main prod URL** (`https://cortex-api-tds7av26va-uc.a.run.app`) still returns **401** on profile routes — cc-agent-C has not shifted default traffic to 00204-kew yet. Until shift:

- Extension **Keep in my box** uses local fallback (`profile-api.js` local chips/stats) on 401.
- After traffic shift: re-run `node scripts/verify-profile-live.mjs` (no env override) — expect **ALL PASS** and server-owned `install:<id>` persistence without local-only path.

**Commit:** `30f3df8` — pushed to `origin/extension/unified-signin-v067`.

## Screen captures

| Capture | Path |
|---------|------|
| Research buy-box rail (`?section=buybox`) | `P:\doc_repo\_inbox\screenshots\depth-v2-research-buybox.png` |
| Settings Plan card | `P:\doc_repo\_inbox\screenshots\depth-v2-options-plan.png` |
| Panel entitlement + This week + attachments | **Operator owed** — requires `chrome-extension://` unpacked v0.6.17 on a listing with brief run |

### Operator capture checklist (unpacked v0.6.17)

1. Listing panel with **2 free briefs remaining** + **Upgrade to Pro** link visible in strip.
2. Panel **This week** with ≥1 workspace; tap to reopen.
3. Panel **Attachments + Add** after brief (presign upload toast).
4. Tap **Keep in my box** → deep research opens scrolled to buy-box with highlight.
5. Settings → **Plan** shows entitlement + Upgrade (or Manage if Pro).

## Git state

- Branch: `extension/unified-signin-v067`
- **Pushed:** `30f3df8` — v0.6.17 depth pass v2
- Prior: `34190a5` — v0.6.16 prod-readiness

## Acceptance criteria

- [x] Upgrade CTA available while free briefs remain (panel strip, research wallet, settings)
- [x] Keep / Add deals navigate to deep research buy-box section for workspace
- [x] Buy-box teacher UI wired (keep/pass, learned chips, API + local fallback)
- [x] Panel settings, This week, attachments shipped
- [x] Collaborators hidden (no dead control)
- [x] Keyed build v0.6.17
- [x] Committed + pushed `30f3df8`
- [x] Canary 00204-kew: server-side keep via `/profile/verdict-action` (fresh install id)
- [ ] Main prod traffic shift to 00204-kew → re-run `verify-profile-live.mjs`
- [ ] Operator chrome-extension PNGs for panel surfaces (paths above)
