---
id: 40i_cortex_dallas_e2e_grok_plan_review_sprint
title: Cortex Dallas E2E + Grok plan review sprint
status: active
last_updated: 2026-05-26
applies_to: design-accelerator
related: [40f_cortex_grok_runtime_migration_sprint, 40g_cortex_cockpit_backend_wiring_sprint, 41a_cortex_jurisdiction_surfacing, 43_cortex_qa_backlog, 49_code_ingestion_pipeline, QA-58, QA-59, _research/2026-05-23_cortex_ai_model_inventory]
owner: Nick (operator QA) + cc-agent-C (Cortex) + cc-agent-E (ingest, optional)
---

# Cortex Dallas E2E + Grok plan review sprint

> **Goal:** One live architect path you can run repeatedly: **Dallas County engagement (QA-58)** → Regrid + federal site layers → **Grok-backed plan review** with **municipal code citations** → honest coverage UX. Replaces mock/Anthropic finding runs for accuracy testing during the WS-I QA pass.

**Time box:** 3–5 working days, parallel with operator QA (not a blocker on jurisdiction-surfacing merge).

**Baseline repos:** `legacy-design-tools` `main` + merge `fix/jurisdiction-surfacing-v1.5-v3` first.

---

## What “done” looks like (operator E2E)

| Step | Pass criterion |
|------|----------------|
| 1 | Engagement `430 Evergreen Trl` (Cedar Hill / Dallas County) geocoded |
| 2 | Site → Generate layers → Regrid parcel + FEMA/USGS/EPA pills green or honest `no-coverage` |
| 3 | Code Library → **Dallas County** visible under Your firm; **Warm up** completes |
| 4 | `coverageStatus` → `ready` on Site tab |
| 5 | Findings → **Re-run plan review** → run completes with `mode: grok` in api-server logs |
| 6 | Findings include **code-section** citations (not only FEMA advisory) |
| 7 | Manual spot-check: 2–3 findings trace to real atom text in Code Library |

**Env (local QA):**

```text
AIR_FINDING_LLM_MODE=grok
XAI_API_KEY=<set>
XAI_MODEL=grok-3-mini   # or operator-approved Grok model id
REGRID_API_KEY=<trial>
```

Prod canary: same vars on `cortex-api` after local sign-off.

---

## Architecture (unchanged seams)

Plan review stays **in-process on cortex-api** (`@workspace/finding-engine`). It does **not** call Hauska MCP or Hauska Engine at generation time today.

```text
FindingsTab → POST /submissions/:id/findings/generate
  → resolveEngineInputs (briefing + code_atoms retrieval + BIM elements)
  → generateFindings (Grok | mock)
  → findings + finding_runs rows
```

**This sprint adds:** Grok generator + Dallas in `lib/codes` + warmed `code_atoms` + coverage `ready`.

---

## Tracks (parallel)

### Track A — Grok finding engine (cc-agent-C, P0)

**Replaces** Anthropic for findings only in this sprint (chat/briefing stay on existing mode until Track D).

| ID | Deliverable |
|----|-------------|
| A1 | `lib/integrations-xai-grok/` — xAI HTTP client (mirror `integrations-anthropic-ai` shape) |
| A2 | `lib/finding-engine/src/grokGenerator.ts` — structured JSON findings output |
| A3 | `findingLlmClient.ts` → `AIR_FINDING_LLM_MODE=grok\|mock` (deprecate `anthropic` branch or alias to grok with warning) |
| A4 | Boot validation: `validateFindingEngineEnvAtBoot` requires `XAI_API_KEY` when `grok` |
| A5 | Tests: mock HTTP fixture + one integration test with recorded Grok response |
| A6 | `docs/deploy.md` + Cloud Run workflow env template |

**Acceptance:** Dallas submission re-run produces findings with `[[CODE:...]]` tokens that resolve in validator; logs show `mode: grok`.

**Dispatch:** [`_dispatches/2026-05-26_cc-agent-C_grok_finding_engine.md`](_dispatches/2026-05-26_cc-agent-C_grok_finding_engine.md)

---

### Track B — Dallas cortex-local code corpus (cc-agent-C, P0)

Minimum path: **Cortex warmup** into existing `code_atoms` tables (same as Bastrop), not full Hauska substrate ingest (Track C optional).

| ID | Deliverable |
|----|-------------|
| B1 | Recon: Dallas **City** vs **Dallas County** adopted code source (Municode clientId / eCode360 / ICC) — 2h time box |
| B2 | `lib/codes/src/jurisdictions.ts` — `dallas_county_tx` (or `dallas_tx` if city is the right unit) + `CITY_STATE_TO_KEY` for Cedar Hill, Dallas, Dallas County |
| B3 | `sourceRegistry` + adapter config (prefer existing **Municode** bridge if ClientID verified; else document blocker) |
| B4 | Operator script or documented **Warm up** steps → atom count > 0 in Code Library |
| B5 | `resolveEngagementCoverage` maps Dallas geocode → `ready` after warmup |

**Acceptance:** `retrieveAtomsForQuestion({ jurisdictionKey: dallas_* })` returns atoms; finding engine `codeSections.length > 0` for QA-58 submission.

**Dispatch:** [`_dispatches/2026-05-26_cc-agent-C_dallas_code_corpus.md`](_dispatches/2026-05-26_cc-agent-C_dallas_code_corpus.md)

---

### Track C — Hauska substrate row for Dallas (cc-agent-E, P1 optional)

Only if Track B source is eCode360-blocked or you want Code Library substrate card + MCP parity.

| ID | Deliverable |
|----|-------------|
| C1 | Ingest Dallas County (or City) into Hauska catalog per `49_code_ingestion_pipeline.md` |
| C2 | `list_jurisdictions` includes row; cortex `substrate_jurisdiction_key` resolves on Dallas engagement |

**Cost gate:** Must stay inside **$200 + 1h review** per jurisdiction commitment or flag yellow to Nick.

**Dispatch:** [`_dispatches/2026-05-26_cc-agent-E_dallas_substrate_ingest.md`](_dispatches/2026-05-26_cc-agent-E_dallas_substrate_ingest.md) — fire only if B blocked.

---

### Track D — Grok chat (cc-agent-C, P2 deferred)

Per [`40f_cortex_grok_runtime_migration_sprint.md`](40f_cortex_grok_runtime_migration_sprint.md) phase 1 was chat-first; **this sprint inverts** for your QA priority (findings accuracy first). Chat migration queued as follow-on `40f` execution slice.

---

### Track E — Operator / merge (Nick)

| ID | Action |
|----|--------|
| E1 | Merge PR `fix/jurisdiction-surfacing-v1.5-v3` |
| E2 | Apply migrations 0021/0022 on target Neon |
| E3 | xAI API key in local `.env` + Secret Manager `XAI_API_KEY` on Cloud Run |
| E4 | Run E2E checklist (top of this doc) |
| E5 | File accuracy notes in `_inbox/` (false positives, missing citations) for engine prompt tuning |

---

## Pre-mortem (sprint commitment)

| Commitment | Result |
|------------|--------|
| Sell reasoning | **Green** — Grok output keeps citation validator + confidence on findings |
| Partnership-first | **Green** — Dallas pilot ingest is Cortex product-baseline / public code (Municode/eCode360 class), not city operational data scrape |
| Cost per jurisdiction | **Yellow** — Track C must be measured; Track B cortex-only warmup is the default to stay under budget |
| Dual interface | **Green** — no change to MCP-first substrate; optional C adds catalog row |
| Hauska spine | **Green** — optional C feeds catalog |
| Focus queue | **Green** — explicit sprint; queues open 40f planning-only work behind this |
| Quality gate | **Green** — required on all finding outputs |

**Overall: green** with Track C optional and cost-yellow acknowledged.

---

## QA backlog

| ID | Item |
|----|------|
| **QA-60** | Dallas E2E: Grok findings + code corpus + coverage `ready` (this sprint) |

---

## Risk register

| Risk | Mitigation |
|------|------------|
| Dallas source not on Municode API | 2h recon cap; fall back to eCode360 HTML or defer Track C |
| Grok JSON/schema drift | Zod parse + retry; keep `mock` for CI |
| Finding accuracy poor on v1 Grok | Eval set: 5 golden questions against Dallas atoms in `lib/eval` |
| Still on `AIR_FINDING_LLM_MODE=mock` in prod | Operator env on deploy |

---

## Suggested merge order

1. `fix/jurisdiction-surfacing-v1.5-v3`
2. `cortex/dallas-code-corpus` (Track B)
3. `cortex/grok-finding-engine` (Track A)
4. Optional `hauska/dallas-ingest` (Track C)

Single deploy pin after 2+3 green locally.

---

## Cross-references

- **QA-61** — Sync 5 metros must appear in substrate catalog on localhost before metro QA (`_dispatches/2026-05-26_cc-agent-C_substrate_catalog_live_localhost.md`)
- Finding engine today: `lib/finding-engine/`, `artifacts/api-server/src/routes/findings.ts`
- Model inventory: [`_research/2026-05-23_cortex_ai_model_inventory.md`](_research/2026-05-23_cortex_ai_model_inventory.md)
- Grok planning (superseded execution order for findings): [`40f_cortex_grok_runtime_migration_sprint.md`](40f_cortex_grok_runtime_migration_sprint.md)
