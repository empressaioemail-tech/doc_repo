---
id: 2026-05-26_legacy-design-tools_cc-agent-C_since_inbox_handoff
title: Inbox delta — since 2026-05-26 session handoff (40i A/B, Cedar Hill corpus, chat UX)
date: 2026-05-26
agent: cc-agent-C (Cursor)
repo: legacy-design-tools
branch: fix/jurisdiction-surfacing-v1.5-v3 (worktree p:\legacy-design-tools)
status: uncommitted — no commits unless operator requests
supersedes_delta_of: 2026-05-26_legacy-design-tools_cursor_session_handoff
related:
  - _inbox/2026-05-26_legacy-design-tools_cursor_session_handoff.md
  - _dispatches/2026-05-26_cc-agent-C_grok_finding_engine.md
  - _dispatches/2026-05-26_cc-agent-C_dallas_code_corpus.md
  - _research/2026-05-26_40i_track_b_dallas_corpus_recon.md (in repo)
---

# Delta since last doc_repo inbox submittal

**Baseline:** `_inbox/2026-05-26_legacy-design-tools_cursor_session_handoff.md` (workspace prefs, QA-61 partial, charcoal buttons, CockpitShell ⌘K, jurisdiction v1.5–v3 closes referenced).

**This filing:** Everything completed **after** that handoff, still **uncommitted** on `fix/jurisdiction-surfacing-v1.5-v3` unless noted.

---

## 1. 40i Track A — Grok finding engine (dispatch: done in code)

| Deliverable | Status | Location |
|-------------|--------|----------|
| `lib/integrations-xai-grok/` | Done | `createGrokClient()`, OpenAI-compatible `/chat/completions` |
| `lib/finding-engine` grok branch | Done | `grokGenerator.ts`, `AIR_FINDING_LLM_MODE=grok\|mock\|anthropic` |
| api-server wiring | Done | `findingLlmClient.ts` — Grok bundle, boot `XAI_API_KEY` validation |
| Route | Done | `findings.ts` passes `grokClient` when mode is grok |
| Tests | Done | `grokGenerator.test.ts`, engine grok mode tests — **60/60** green in `@workspace/finding-engine` |
| Docs | Done | `docs/deploy.md` rows for `XAI_*`, updated `AIR_FINDING_LLM_MODE` |

**Operator smoke:**

```env
AIR_FINDING_LLM_MODE=grok
XAI_API_KEY=<key>
# optional: XAI_FINDING_MODEL=grok-3-mini
```

Re-run plan review → api-server logs should show `mode: grok`. CI default remains `mock`.

**Note:** Regenerate `lib/finding-engine/dist` after pulling (`tsc --emitDeclarationOnly` in that package) if api-server typecheck complains that `FindingLlmMode` lacks `grok` (stale `.d.ts`).

**Not done:** Dedicated branch `cortex/grok-finding-engine`, PR, cloud-run `AIR_FINDING_LLM_MODE=grok` deploy (operator approval per dispatch).

---

## 2. 40i Track B — Cedar Hill code corpus (dispatch: done + operator ground truth)

### Shipped substrate (operator-confirmed)

| Field | Value |
|-------|--------|
| Substrate key | `cedar_hill_tx` |
| Atom count | **706** |
| Eval | **0.913 / 1.0 / 1.0** |
| Municode | **clientId 1568**, **productId 11825** |
| Geocode for QA-58 / QA-60 | **City** — Cedar Hill municipal code |

### Code changes (aligned to operator mapping)

| Item | Implementation |
|------|----------------|
| `cedar_hill_tx` | `lib/codes/src/jurisdictions.ts` — pins clientId + `municodeProductId: 11825` |
| Municode adapter | `lib/codes-sources/src/municode/index.ts` — optional `municodeProductId` when client has multiple products |
| Registry | `cedar_hill_municode` in `sourceRegistry` + `codes-sources` index |
| **`CITY_STATE_TO_KEY` active** | `cedar hill\|tx`, `cedar hill\|texas` → `cedar_hill_tx` |
| **Blocked (no mapping)** | `dallas\|tx` (AmLegal partnership), `dallas county\|tx` (no Municode product) |
| Removed | `dallas_county_tx` jurisdiction + `dallas_county_municode` (was incorrect pilot mapping) |
| Recon | `_research/2026-05-26_40i_track_b_dallas_corpus_recon.md` |
| Tests | `jurisdictions.test.ts` + `bootstrap.test.ts` — **23/23** green |

**QA-58 address:** `430 Evergreen Trl, Cedar Hill, TX` resolves via structured city or address scan. Engagements geocoded as **Dallas** or **Dallas County** return `null` from `keyFromEngagement()` until separate corpora exist.

**Operator:** Code Library → Cedar Hill → Warm up (already at 706 atoms in prod path). Site coverage **Code ready** on QA-58 when city = Cedar Hill.

**Not done:** Dedicated branch `cortex/dallas-code-corpus`, inbox close files for Track A/B dispatches, optional retrieval smoke test.

---

## 3. Claude chat — user prompt bubble contrast (this session)

| Issue | Fix |
|-------|-----|
| Sent prompts **white on white** on charcoal | User bubble used `background: var(--cyan)` (#e5e5e5 on charcoal) + `text-white` |
| Fix | `.claude-chat-user-bubble` — `#ffffff` background, `#111111` text |

**Files:** `artifacts/design-tools/src/components/ClaudeChat.tsx`, `claude-markdown.css`

---

## 4. Unchanged from prior handoff (still true)

Carried forward — see baseline handoff for detail:

- Workspace prefs / branding / QA-61 substrate UI / charcoal Save + chip fixes / CockpitShell ⌘K
- Jurisdiction surfacing v1.5–v3 (separate close files)
- **Agent E** — Hauska Dallas substrate ingest (parallel; not cc-agent-C)
- **QA-62** — operator must set `HAUSKA_SUBSTRATE_MODE=mcp` for live catalog
- **OpenAPI/codegen** drift risk; **schema.sql.template** not refreshed for 0023/0024
- **api-server typecheck** — may still fail on workspace prefs schema vs Drizzle types (unrelated WIP)
- **Mixed worktree** — recommend PR split before merge (see baseline handoff § commit strategy)

---

## 5. Recommended PR split (updated)

| PR | Scope |
|----|--------|
| 1 | Jurisdiction surfacing v1.5–v3 |
| 2 | Workspace 0023–0024 + three product cards + branding |
| 3 | QA-61 substrate localhost (health, panel, deploy.md) |
| 4 | **40i Track A** — Grok (`integrations-xai-grok`, finding-engine, api-server) |
| 5 | **40i Track B** — `cedar_hill_tx` only (jurisdictions + municode productId pin) |
| 6 | Portal-ui contrast + CockpitShell + **Claude chat user bubble** |

---

## 6. Operator checklist (priority order)

1. **QA-58 / QA-60** — Confirm engagement geocode city = **Cedar Hill** (not Dallas); coverage **Code ready** with 706 atoms.
2. **Plan review** — `AIR_FINDING_LLM_MODE=grok` + `XAI_API_KEY`; re-run findings on QA-58 submission.
3. **QA-62** — MCP substrate env (unchanged from operator runbook).
4. **Agent E** — Dallas row in MCP catalog when ingest completes (substrate browse ≠ Code Library warmup).

---

## 7. Tests run since last inbox (green)

| Package | Command / scope |
|---------|-----------------|
| `@workspace/finding-engine` | full vitest — 60 tests |
| `@workspace/codes` | `jurisdictions.test.ts`, `bootstrap.test.ts` — 23 tests |
| Prior session (baseline) | workspace prefs, substrate health, briefing PDF contract |

**Not re-run:** full monorepo `pnpm run typecheck`.

---

## 8. Inbox close files (dispatch) — still open

Planner may want dedicated closes after PR merge:

- `_inbox/2026-05-26_legacy-design-tools_cc-agent-C_grok_finding_engine.md` (Track A)
- `_inbox/2026-05-26_legacy-design-tools_cc-agent-C_dallas_code_corpus.md` (Track B)

---

## Planning-agent one-liner

**Since the 2026-05-26 handoff inbox: Track A (Grok findings) and Track B (`cedar_hill_tx`, 706 atoms, productId 11825) are implemented in code; Dallas/Dallas County geocode keys are explicitly blocked; Claude user bubbles are black-on-white; all still uncommitted on `fix/jurisdiction-surfacing-v1.5-v3`. QA-60 unblocks on operator Grok env + Cedar Hill geocode + optional MCP substrate live.**
