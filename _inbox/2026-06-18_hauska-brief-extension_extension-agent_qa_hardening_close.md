---
date: 2026-06-18
agent: extension-agent
repo: hauska-brief-extension
branch: extension/unified-signin-v067
version: 0.6.18
dispatch: qa_hardening_pass
status: code-ready — uncommitted; operator sign-out/sign-in + tab-focus captures owed
---

# Close — QA hardening pass (v0.6.18)

## Version

| Field | Value |
|-------|-------|
| **Version** | **0.6.18** (manifest bumped; build PASS) |
| **Prior pushed** | `30f3df8` v0.6.17 depth pass v2 |
| **Build** | `node scripts/build.mjs` — keyed public client injected |

---

## Per-item status

### BLOCKERS

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | Logout/session + persistence | **FIX** | `signOut()` clears session token, user record, scoped workspace map, flat cache keys, profile local stats/chips; panel resets UI. Workspace state saved under `user:<jwt-sub>` or `install:<id>` via `user-scope.js`. Reload restores active scope. |
| 2 | Deep-dive tab routing | **FIX** | `OPEN_DEEP_RESEARCH` finds existing `research/research.html` tab → focus window → `RESEARCH_NAVIGATE` postMessage with brief/property/workspace. Fallback: reload tab URL. Panel passes current `cachedBrief` + property. |

### CORE

| # | Item | Status | Notes |
|---|------|--------|-------|
| 3 | Research chat before brief | **FIX** | `ensureBriefForChat()` auto-runs brief when chat submitted without `runId`. `callLiveResearch` sends `runId` + `workspaceDid` (fixed inverted logic). Panel chat gates on `runId`/sections. Backend errors → `showResearchNotice` + inline assistant error (not silent fail). |
| 4 | Address autocomplete | **FIX** | `address-suggest.js`: tries `GET /geocode/suggest`, falls back to Nominatim US search. Wired on panel `#hauska-manual-addr` + research `#hauska-address-input` (debounced dropdown). |

### UX

| # | Item | Status | Notes |
|---|------|--------|-------|
| 5 | Disclaimer padding | **FIX** | `.hauska-fineprint` padding under chat composer (`research.css`). |
| 6 | Operator profile box | **FIX** | `.twin` restyled — light brand-tint card, navy label (no black slab). |
| 7 | Right sidebar flow | **PARTIAL** | Reordered rail: **Who you are → Buy box → At a glance → Blind spots → Attachments**. Full redesign proposal below (not built this pass). |

### GATED

| # | Item | Status |
|---|------|--------|
| Max upgrade alongside Pro | **DEFERRED** | Awaiting cc-agent-C `checkout(tier=max)` contract. No UI stub added. |

---

## Blocker detail

### 1. Session / install-id vs ownerUserId

**Root cause:** Sign-out only removed JWT keys; `lastBrief`, profile locals, and panel `cachedBrief` persisted. Anonymous install-scoped storage mixed with signed-in sessions.

**Fix:**
- `src/lib/user-scope.js` — scope key `user:<sub>` when signed in, else `install:<installId>`
- `saveLastBriefToStorage` → scoped map `hauskaWorkspaceByScope`
- `signOut()` → `clearLocalUserData()` + `USER_SIGNED_OUT` to background (clears SW memory)
- Panel sign-out clears UI, recent list, attachments, brief body
- Sign-in loads scoped state for new account (no bleed from prior session)
- `getSessionUser()` stores `userId` + `email` from JWT; panel shows “Signed in as …”

**Persistence:** Same signed-in user reloads → `loadScopedWorkspaceState()` + `fetchRecentWorkspaces` repopulates This week.

### 2. Deep research tab focus

**Flow:**
1. Panel **Deep research** → `openDeepResearchTab({ brief, property, workspaceId, workspaceDid })`
2. Background queries tabs for research.html
3. If found: `tabs.update(active)` + `sendMessage({ type: RESEARCH_NAVIGATE, ... })`
4. Research tab `handleResearchNavigate` → `refreshBriefUi` or `runBriefFromAddress`

---

## Sidebar reorg — shipped vs proposed

### Shipped (v0.6.18)

```
Who you are (profile headline)
Your buy box (+ keep/pass)
At a glance (verdict dots)
Blind spots (hidden when empty)
Attachments
Footer privacy line
```

### Proposed v2 (future pass — not built)

Single scroll narrative:

1. **Property context chip** — address + tier dot (links to left nav)
2. **Verdict strip** — 3 at-a-glance pills inline (merge “At a glance” up)
3. **Your box** — buy-box chips + keep/pass inline (teacher-first)
4. **Profile thesis** — one-line headline only; expand for summary
5. **Documents** — attachments as compact rows
6. **Patterns** — blind spots collapsed `<details>` default closed

Rationale: actionable buy-box + verdict before narrative profile; reduces vertical “stack of headings.”

---

## Files changed

| File | Change |
|------|--------|
| `src/lib/user-scope.js` | **NEW** — scoped workspace persistence |
| `src/lib/address-suggest.js` | **NEW** — geocode suggest + Nominatim fallback |
| `src/lib/session-auth.js` | Sign-out clears user data; JWT user metadata |
| `src/lib/brief-storage.js` | Delegates save to scoped storage |
| `src/lib/research-nav.js` | Pass brief/property to background |
| `src/background/index.js` | Tab focus + `RESEARCH_NAVIGATE`; `USER_SIGNED_OUT` |
| `src/content/intel-panel.js` | Sign-out reset, scoped load, autocomplete, chat runId |
| `src/research/research-app.js` | Navigate handler, ensureBriefForChat, scoped init |
| `research/research.html` | Rail section reorder |
| `research/research.css` | Profile card, fineprint, autocomplete list |
| `src/content/inject.css` | Panel autocomplete + auth status |
| `manifest.json` | 0.6.18 |

---

## Live verification

| Check | Result |
|-------|--------|
| `node scripts/build.mjs` | **PASS** |
| `node scripts/verify-profile-live.mjs` (main prod) | **ALL PASS** (2026-06-18) — server-side keep durable |
| HTTP smoke research rail | **PASS** — reordered sections + light profile card |
| Sign-out isolation | **Code-complete** — operator verify: sign out → sign in as different account → no prior brief/recent |
| Tab focus | **Code-complete** — operator verify: open deep research twice → single tab updates |

---

## Screen captures

| Capture | Path |
|---------|------|
| Research rail (profile + buy box reorder) | `P:\doc_repo\_inbox\screenshots\qa-hardening-research-rail.png` |
| Sign-out / tab focus | **Operator owed** — requires unpacked extension on listing |

---

## Operator checklist

1. Sign in as user A → run brief → reload extension → This week + last brief persist.
2. Sign out → sign in as user B → no user A addresses/briefs visible.
3. Run brief on listing → **Deep research** → run another listing brief → **Deep research** again → same tab focuses with new property.
4. Type address in panel capture → suggestions appear → select fills field.
5. Chat before brief completes → auto-runs brief or shows inline error (not dead “request failed”).

---

## Git state

- **Uncommitted** on `extension/unified-signin-v067`
- Last pushed: `30f3df8` v0.6.17
