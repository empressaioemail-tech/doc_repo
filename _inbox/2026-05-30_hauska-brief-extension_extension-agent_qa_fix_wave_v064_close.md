---
id: 2026-05-30_hauska-brief-extension_extension-agent_qa_fix_wave_v064_close
title: Close — Property Brief QA fix wave v0.6.4 (extension-agent)
date: 2026-05-30
agent: extension-agent
repo: hauska-brief-extension
kind: inbox-close
related: [2026-05-30_extension-agent_qa_fix_wave_v064, 2026-05-30_property_brief_qa_fix_wave_index]
---

# Extension-agent close — QA fix wave v0.6.4

## Branch / SHA

- **Branch:** `extension/qa-fix-wave-v064`
- **SHA:** `e4fadf0d235bc2f6d2228cd5ce223888b1c9b196`
- **Manifest:** `0.6.4`
- **Build:** `node scripts/build.mjs` — green
- **Tests:** `npm test` — green

## PR

- **Repo:** https://github.com/empressaioemail-tech/hauska-brief-extension
- **Main (v0.6.4):** https://github.com/empressaioemail-tech/hauska-brief-extension/tree/main @ `e4fadf0`
- **Follow-on:** https://github.com/empressaioemail-tech/hauska-brief-extension/pull/1 (v0.6.5 zero-config)

## slimBriefForStorage sample (fat fixture)

| Metric | Bytes |
|--------|------:|
| `JSON.stringify(brief)` before | 190,322 |
| `JSON.stringify(slimBriefForStorage(brief))` after | 3,116 |

Fixture: Round Rock–style brief with ~140KB layer payloads + oversized hits/atoms blob. Unit test asserts after &lt; 100KB.

## Changes shipped

### P0

1. **`src/lib/brief-storage.js`** — `slimBriefForStorage()`, `saveLastBriefToStorage()`, quota user message. Wired in `background/index.js`, `intel-panel.js`, `research-app.js`. Manifest `unlimitedStorage` added.
2. **`workspaceId` persist** — After `runBriefApi`, use response `workspaceId` or `POST /workspaces/open` via `openWorkspaceFromBrief()`. Saves `lastWorkspaceId` on brief complete.
3. **Share** — `buildShareUrl()` prefers `sharePath`. Honest errors for missing API key, missing workspace, 403 `account_upgrade_required`. Share hidden for public-only key installs (`hasPublicClientKey()` && no user `hauskaKey`).
4. **Demo purge** — Removed `DEMO_*` fallbacks on live paths. `no_match` shows honest no-corpus template; never Bastrop ADU HTML. Wallet/collaborators/attachments empty until API returns data.

### P1

5. **`layPanelBodyHtml()`** — `reasoningSummary.headline` narrative under At a glance; optional site-context section. Pre-brief: starter chips + muted CTA.
6. **Wiring** — Starter chips submit when `canUseLiveResearch()`; demo nav rows removed; listing Share uses same workspace path; topbar **View listing** (opens `property.url`).

## Manual QA checklist (operator — not run by agent)

| # | Scenario | Expected | Agent result |
|---|----------|----------|--------------|
| 1 | Round Rock Zillow — Run brief ×5 | No quota error; narrative + chips | _Not run — needs loaded extension + prod API_ |
| 2 | Share — copy link | Non-empty URL with dev/operator key | _Not run_ |
| 3 | Pflugerville `no_match` — ADU chip | No Bastrop text; honest no-corpus copy | _Code path verified; not browser-run_ |
| 4 | `lastWorkspaceId` after brief | Set in storage | _Depends on cc-agent-C `workspaceId` in brief response or `/workspaces/open`_ |
| 5 | Demo surfaces with API connected | No fake collaborators/attachments/wallet | _Code review pass_ |

## Operator next steps

1. Add git remote if missing; push `extension/qa-fix-wave-v064`; open PR (do not merge until cc-agent-C API deploy if share smoke needed).
2. Reload unpacked extension at `P:\hauska-brief-extension`.
3. Re-run manual QA on Round Rock + Pflugerville addresses from dispatch index.
4. Merge PR when green; bump store build after Wave 2 smoke.

## Blocked / dependency

Full share + storage verification against prod requires **cc-agent-C** brief API returning `workspaceId` and slimmed layer payloads (Wave 1). Extension-side slim + `/workspaces/open` fallback implemented regardless.
