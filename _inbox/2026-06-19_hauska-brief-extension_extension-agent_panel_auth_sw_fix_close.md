---
date: 2026-06-19
agent: extension-agent
repo: hauska-brief-extension
branch: (working tree)
version: 0.6.27
dispatch: panel_signin_launchWebAuthFlow_mv3_fix
status: code-ready — operator reload + panel sign-up verification owed
---

# Close — Panel Sign in / Sign up via extension auth page (v0.6.27)

## Summary

**Blocker:** Listing panel **Sign up / Sign in** failed with `Authorization page could not be loaded.` Backend auth page and CSS verified healthy (200). Root cause was **`chrome.identity.launchWebAuthFlow` running in the MV3 service worker** after the content script delegated `SIGN_IN` — SW suspension and loss of user-gesture context make this path unreliable.

**Fix:** Route panel/content-script auth through a dedicated **extension page** (`auth/auth.html`) that runs `launchWebAuthFlow` inline, persists the JWT to `chrome.storage.local`, and signals completion via `hauskaAuthResult`. Panel already listens on `hauskaSessionToken` storage changes to refresh UI.

---

## Root-cause confirmation

| Path | Context | `chrome.identity` | Result |
|------|---------|-------------------|--------|
| **Options page** | Extension page | Available | **Works** — inline `runHauskaWebAuthFlow` |
| **Deep Research page** | Extension page | Available | No sign-in UI (directs to panel); inline would work |
| **Listing panel** (before fix) | Content script → SW `SIGN_IN` | Unavailable in CS; SW runs flow | **Fails** — `Authorization page could not be loaded.` |

SW console shows `chrome.runtime.lastError` from `launchWebAuthFlow` when the worker is not in a stable interactive context.

---

## Changes (v0.6.27)

| File | Change |
|------|--------|
| `auth/auth.html` | Minimal branded auth shell |
| `src/auth/auth-app.js` | Reads `requestId` + `intent` from query; runs `runHauskaWebAuthFlow`; writes `hauskaAuthResult`; auto-closes tab |
| `auth/auth-bundle.js` | Built IIFE bundle |
| `src/lib/session-auth.js` | Content scripts call `OPEN_AUTH_PAGE` + `waitForAuthResult`; extension pages still inline |
| `src/background/index.js` | `OPEN_AUTH_PAGE` opens/focuses auth tab; tab-close writes cancel; **removed** SW `launchWebAuthFlow` on `SIGN_IN` |
| `scripts/build.mjs` | Auth bundle entry |
| `manifest.json` / `package.json` | Version **0.6.27** |

### Flow (panel)

1. User clicks **Sign in** / **Sign up** on listing panel (content script).
2. `signInWithHauska` → `openAuthPageAndWait` → `OPEN_AUTH_PAGE` message.
3. Background opens `auth/auth.html?requestId=…&intent=…`.
4. Auth page runs `launchWebAuthFlow` → `persistSessionFromToken` → `writeAuthResult({ ok: true, token })`.
5. Panel `waitForAuthResult` resolves; existing `storage.onChanged` on `hauskaSessionToken` syncs panel chrome.

---

## Build

```
npm run build
```

PASS — `dist/`, `content-bundle.js`, `auth/auth-bundle.js`, `research/research-bundle.js`.

---

## Operator verification (required)

1. **Reload** extension at `chrome://extensions` (v0.6.27).
2. Open a **real listing** (Zillow / Redfin).
3. Expand Hauska panel → **Sign up** (fresh email) or **Sign in**.
4. Expect: brief auth tab opens → Google/hosted login → tab closes → panel shows signed-in state (no `Authorization page could not be loaded.`).
5. **Control:** Options → **Sign in with Hauska** should still work (inline path unchanged).
6. Optional: close auth tab mid-flow → panel should show `Sign-in cancelled.`

---

## Acceptance criteria

- [ ] Panel sign-up on live listing completes without auth-page load error
- [ ] Panel sign-in restores session and wallet/share affordances
- [ ] Options page sign-in still works (regression)
- [ ] Auth tab auto-closes on success; cancel on tab close is surfaced

---

## Notes

- Legacy `SIGN_IN` message to background now returns an explicit error (forces reload if stale bundle).
- Research page sign-in remains “via panel” by design; extension-page inline path is available if we add UI later.
