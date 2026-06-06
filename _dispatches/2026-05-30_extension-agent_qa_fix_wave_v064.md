---
id: 2026-05-30_extension-agent_qa_fix_wave_v064
title: Dispatch — Property Brief QA fix wave v0.6.4
date: 2026-05-30
agent: extension-agent
repo: hauska-brief-extension
kind: dispatch
related: [75d_property_brief_ui_replit_handoff, 75e_property_brief_collaboration_sharing_handoff, 2026-05-30_property_brief_qa_fix_wave_index, 2026-05-30_cc-agent-C_brief_api_slim_and_workspace_id]
blocked_on: cc-agent-C brief API slim + workspaceId (Task 1–2) for full share/storage verification; start Tasks 3–7 immediately
---

# Extension — QA fix wave v0.6.4

You are **extension-agent**, owner of `P:\hauska-brief-extension`.

**Context:** Operator manual QA on prod **v0.6.3**. Replit UI port left **DEMO_*** fallbacks; share broken (no `workspaceId`); **chrome.storage quota** exceeded on Round Rock brief; listing panel missing narrative; wrong-jurisdiction ADU on `no_match`.

## Model (HR-12)

**Grok Build 0.1** — multi-file JS across background, content, research.

## Atoms to resolve

- `product:property-brief`
- `workflow:brokerage-brief-run`

## Read first

1. [`75d_property_brief_ui_replit_handoff.md`](../75d_property_brief_ui_replit_handoff.md) — §4 listing panel, § reasoningSummary
2. [`75e_property_brief_collaboration_sharing_handoff.md`](../75e_property_brief_collaboration_sharing_handoff.md) — share flow
3. [`2026-05-30_cc-agent-C_brief_api_slim_and_workspace_id.md`](2026-05-30_cc-agent-C_brief_api_slim_and_workspace_id.md) — server fields
4. Source: `src/research/research-app.js`, `src/content/intel-panel.js`, `src/background/index.js`, `src/lib/brief-engine.js`, `src/lib/lay-render.js`

## Workspace

- Branch: `extension/qa-fix-wave-v064`
- Bump manifest to **0.6.4**
- Run `node scripts/build.mjs` before close

---

## Task 1 — Slim brief before `chrome.storage.local` (P0)

**Problem:** `ResourceOkQuotaBytes quota exceeded` when saving `lastBrief` after prod brief with fat `siteContext`.

**Implement** `src/lib/brief-storage.js`:

```js
export function slimBriefForStorage(brief) { … }
```

Rules:

- Drop `siteContext.layers[].payload` (keep status, layerKind, summary, provider)
- Truncate hit snippets to 320 chars
- Cap `sections` to brief UI needs (keep all five query sections; trim hit count per section to 3)
- Preserve: `runId`, `workspaceId`, `workspaceDid`, `corpusStatus`, `jurisdiction`, `property`, `laySummary`, `reasoningSummary`, `citations`, `inlineRefs`, `briefApi`, timestamps

Use in:

- `src/background/index.js` — all `lastBrief` writes
- `src/content/intel-panel.js` — workspace reopen writes
- `src/research/research-app.js` — `reopenWorkspace` writes

Add manifest permission `"unlimitedStorage"` as safety net (still slim — do not rely on unlimited alone).

On quota error despite slim: user message *"Brief ran but could not cache locally. Open Deep research or re-run brief."*

---

## Task 2 — Persist `workspaceId` after every API brief (P0)

**Problem:** `ensureShareLink()` requires `activeWorkspaceId || brief.workspaceId`; neither set after Run brief.

After successful `runBriefApi()` in `brief-engine.js` (or in background after `runBrief`):

1. If response includes `workspaceId`, use it.
2. Else `POST /api/brokerage/v1/workspaces/open` with `{ address, page_url, run_id, mls_id }`.
3. Set `brief.workspaceId = pkg.id`.
4. Persist `chrome.storage.local.lastWorkspaceId`.

Add `openWorkspaceFromBrief(settings, brief, property)` to `src/lib/workspace-api.js`.

---

## Task 3 — Share modal — real links and honest errors (P0)

In `research-app.js` `ensureShareLink()` / `wireShareModal()` and `intel-panel.js` `copyShareLink()`:

| Condition | UI copy |
|-----------|---------|
| No API key / URL | "Add Brief API URL and Hauska key in extension settings." |
| No workspaceId | "Run a brief on this listing first to create a workspace." |
| 403 `account_upgrade_required` | "Sharing requires a Hauska operator account. Public installs are Layer 1 read-only." — hide Share button when `hasPublicClientKey()` && !user `hauskaKey` |
| Success | Full URL: `{briefApiUrl}{sharePath}` from API |

Unify URL building: prefer `sharePath` from API response.

Remove hardcoded access list demo — fetch collaborators when API exists; else show only "You · Owner".

---

## Task 4 — Purge demo data on live paths (P0)

Remove or gate when `brief` present and not in local dev flag:

| Constant | File | Replacement |
|----------|------|-------------|
| `DEMO_COLLABORATORS` | research-app.js | Hide avatars until API returns collaborators |
| `DEMO_WORKSPACES` | research-app.js | Do not merge into nav if API returns ≥1 workspace |
| `DEMO_ATTACHMENTS` | research-app.js | Empty list; `loadWorkspaceExtras` only |
| `DEMO_ADU_REFS` / `ADU_ANSWER_HTML` | research-app.js | **Never** on `corpusStatus === 'no_match'` |
| Wallet `$8.00` fallback | research-app.js | Hide wallet row if fetch fails |

**`aduRefsFromBrief`:** return `[]` when no refs; caller shows honest no-corpus template, not Bastrop HTML.

**`no_match` chat template:**

> This address is not in the Hauska municipal code catalog yet. Flood and parcel data may still appear. Verify zoning and ADU rules with the city or your agent.

---

## Task 5 — Listing panel narrative (P1)

After brief completes, listing panel should show prose under At a glance chips.

In `lay-render.js` → `layPanelBodyHtml()`:

1. Existing `layPanelGlanceHtml(brief)` verdict rows
2. **New:** if `brief.reasoningSummary?.headline`, render `<p class="hp-narrative">` with headline + first plain sentence from paragraphs (strip HTML) or first `laySummary` one-liner
3. Optional: `siteContextSectionHtml(brief.siteContext)` when ok layers exist

Pre-brief expanded state (`intel-panel.js` `primePanelContent`): show starter chip row (reuse `STARTER_PROMPTS` from lay-render) + muted line "Run full brief for ADU, flood, and local rule verdicts."

---

## Task 6 — Button and nav wiring (P1)

| Control | Fix |
|---------|-----|
| Starter chips (listing + research) | Ensure click sends question when `canUseLiveResearch()`; disable with tooltip when not |
| Demo property nav rows | Remove `demo_*` ids from click targets; do not inject demo rows when API configured |
| Share (listing panel) | Same workspaceId path as research modal |
| Attachments add | Keep PB-301 stub alert; do not show demo attachments |
| Run brief (research topbar) | Label "View listing" or re-run brief via background message — pick one; document in close |

---

## Task 7 — Tests and build

Add unit tests for `slimBriefForStorage` (fixture: fat siteContext → under 100KB JSON).

Manual script in close file:

1. Round Rock Zillow listing — Run brief — no quota error
2. Share — copy link — non-empty URL
3. Pflugerville — ADU chip — no Bastrop text

---

## Out of scope

- Email invite (HTML disabled — keep disabled)
- Encumbrance upload UI (PB-301)
- Server-side payload strip (cc-agent-C)
- Chrome Web Store release zip (operator after merge)

---

## Acceptance criteria

- [ ] Five consecutive Round Rock briefs without quota error
- [ ] `lastWorkspaceId` set after every API brief
- [ ] Share link copies valid URL on dev-key install
- [ ] Pflugerville / `no_match` never shows Bastrop ADU citations
- [ ] Listing panel shows narrative after brief
- [ ] No demo collaborators/attachments/wallet when API connected
- [ ] Manifest **0.6.4**; build green

## Report back

`P:/doc_repo/_inbox/2026-05-30_hauska-brief-extension_extension-agent_qa_fix_wave_v064_close.md`

Include PR URL, SHA, before/after `JSON.stringify(slimBrief).length` sample, screenshots checklist.
