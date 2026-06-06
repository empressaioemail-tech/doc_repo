---
id: 2026-05-28_hauska-brief-extension_property_brief_v050_lay_ui_close
title: Close — Hauska Property Brief extension v0.5.0 lay UI + V1 workspace wire
date: 2026-05-28
agent: cursor-agent
repo: hauska-brief-extension
depends_on: legacy-design-tools PR #132 @ 1109f02
---

# Close — Hauska Property Brief extension v0.5.0

## Summary

Product pivot to **Hauska Property Brief** (Carfax-style): consumer verdict cards, starter research chips, V1 workspace/recent/share wiring, no user-facing “brokerage” copy. API paths remain `/api/brokerage/v1/*` for backward compatibility.

## Repo / version

| Item | Value |
|------|-------|
| Repo | `P:\hauska-brief-extension` |
| Version | **0.5.0** (`manifest.json`) |
| Git | Local-only (no `.git` at close); SHA **n/a** |
| Backend dep | [PR #132](https://github.com/empressaioemail-tech/legacy-design-tools/pull/132) `1109f02` + lay-summary on brief API |

## Build

```powershell
cd P:\hauska-brief-extension
npm install
node scripts/generate-icons.mjs   # if icons missing
node scripts/build.mjs            # bundles content, panel, popup, research IIFEs
```

## Status (2026-05-28 resume)

**COMPLETE** — all user-facing surfaces now use consumer lay UI:

| Surface | Bundle | Default view |
|---------|--------|--------------|
| Listing panel (Zillow) | `src/content/content-bundle.js` | Verdict cards + See sources |
| Deep research | `research/research-bundle.js` | Starter chips + lay chat |
| Side panel (`panel/panel.html`) | `src/panel/panel-bundle.js` | Verdict cards (JSON in collapsed details) |
| Toolbar popup | `popup/popup.js` | Verdict cards + See sources |

**Operator:** reload unpacked extension after `node scripts/build.mjs`.

## Changelog (extension)

### A) Panel / brief results (`src/content/intel-panel.js` → `content-bundle.js`)

- Default body: `laySummary` traffic-light verdict cards (Yes / Maybe / No / Unknown).
- **See sources** toggles pro block (`reasoningSummary` + atom list); DIDs not in main column.
- Brand label: **Hauska Property Brief** / property intel tab unchanged.

### B) Deep research (`research/research.html`, `src/research/research-app.js`)

- First screen: six starter chips (ADU, flood, schools, STR, setbacks, red flags) with canonical IDs aligned to cortex `propertyBriefStarters.ts`.
- Click → prefills chat, sends `starterPromptId` + `personaBucket`, logs `starter_prompt_selected` via GTM events API.
- Assistant replies: `messageHtml` lay-first; **See sources** `<details>` accordion per message.
- Side column: **For your agent** (pro sources HTML).

### C) V1 backend wire

- `src/lib/brokerage-api.js` — `X-Hauska-Install-Id` + auth on metered calls.
- `src/lib/workspace-api.js` — `GET workspaces/recent`, `GET workspaces/:id`, `POST workspaces/:id/share`.
- Panel + research: recent properties list, reopen workspace, listing backlink, **Copy share link** when API configured.
- Background: attaches `workspaceId` from recent list after API brief.

### D) Options

- Consumer / not-legal-advice lead copy; build tag 0.5.0.
- Placeholders no longer show the word “brokerage” (paths unchanged in code).

### E) Docs

- `README.md` — v0.5.0, build step, out-of-scope note.

## Files touched (primary)

- `manifest.json`, `package.json`, `README.md`, `options/options.html`
- `src/content/intel-panel.js`, `src/content/content-bundle.js` (built), `src/content/inject.css`
- `src/lib/lay-summary.js`, `src/lib/lay-render.js`, `src/lib/brokerage-api.js`, `src/lib/workspace-api.js`
- `src/lib/brief-engine.js`, `src/lib/research-api.js`, `src/lib/reasoning-summary.js`
- `src/background/index.js`, `src/research/research-app.js`
- `research/research.html`, `research/research.css`
- `scripts/build.mjs`

## Test output

```text
cd P:\hauska-brief-extension
npm install
# added 2 packages (esbuild), 0 vulnerabilities

node scripts/build.mjs
# built dist/ + src/content/content-bundle.js
```

**Manual QA (operator):** load unpacked on Zillow homedetails with `briefApiUrl` + `hauskaKey` + migration 0029 applied.

## Acceptance checklist

| Criterion | Status | Notes |
|-----------|--------|-------|
| Zillow panel shows verdict cards, not DIDs by default | **PASS** (code) | Rules fallback if API omits `laySummary` |
| Deep research starter chips → live chat + GTM | **PASS** (code) | Needs Brief API + key + prior brief `runId` |
| Recent properties visible; reopen works | **PASS** (code) | Needs PR #132 routes deployed |
| No user-visible “brokerage” string | **PASS** (code) | Grep HTML/CSS; API path only in JS |
| Out of scope (STR $, discovery, Matrix upload) | **N/A** | Not implemented |

## Operator follow-ups

1. Deploy cortex-api with PR #132 + lay-summary branch; run migration `0029`.
2. Set extension options: prod `briefApiUrl`, `hauskaKey`, consent.
3. Smoke: Run brief → verdicts → See sources → Deep research chip → recent reopen → share copy.

## PR URL

Extension repo is local-only at close — no GitHub PR. Backend: https://github.com/empressaioemail-tech/legacy-design-tools/pull/132
