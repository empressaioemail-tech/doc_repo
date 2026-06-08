---
id: 2026-06-06_legacy-design-tools_cc-agent-C_arrow_two_phase1_evidence_ledger
title: Build — Arrow two Phase 1, adjudication-to-atom evidence ledger (tier 1a)
date: 2026-06-06
agent: cc-agent-C
repo: legacy-design-tools
kind: build
status: merged
related: [04a_arrow_two_calibration_capture, _inbox/2026-06-06_legacy-design-tools_cc-agent-C_arrow_two_phase0_recon, 03_structural_constitution_and_drift_guard, 03a_positioning_framework, 01a_atom_conventions, 20_agent_operating_rules]
---

# Build — Arrow two Phase 1: adjudication-to-atom evidence ledger (tier 1a)

Phase 1 tier 1a shipped in cortex-api (`legacy-design-tools`). Zero schema change, zero new write path, zero engine/contract/corpus change. The projection joins existing `atom_events` finding-mutation events to `findings.citations[].atomId` and returns per-atom adjudication tallies partitioned by `jurisdictionTenant`.

## Atoms touched

| Atom / surface | Role |
|---|---|
| `current-state:portfolio` | Dispatch anchor (doc_repo catalog) |
| `finding` (substrate) | Source rows + `citations[]` lineage (`lib/db/src/schema/findings.ts:143`) |
| `decision-event` (substrate) | Out of scope (Phase 2) |
| `code-section` (substrate) | Citation target via `FindingCodeCitation.atomId` |
| Tier 1a read-model | New internal projection only — no atom contract change |

## Model

Default Grok Build 0.1 (no escalation).

## PR + merge

- **Branch:** `cortex/arrow-two-phase1-evidence-ledger`
- **Feature SHA:** `83578034ed1b20d716b4407b87d20a2ca7d12d6c`
- **PR:** https://github.com/empressaioemail-tech/legacy-design-tools/pull/143 — **merged**
- **Merge commit on `main`:** `3a79dad` (`Merge pull request #143 from empressaioemail-tech/cortex/arrow-two-phase1-evidence-ledger`)

## What shipped

### Tier 1a projection (`artifacts/api-server/src/lib/atomAdjudicationEvidenceLedger.ts`)

- Joins `atom_events` (`entity_type = finding`, `event_type ∈ {finding.accepted, finding.rejected, finding.overridden}`) — emitted by `emitFindingMutationEvent` at `artifacts/api-server/src/routes/findings.ts:673` — to `findings` on `findings.atom_id = atom_events.entity_id`.
- Fans out each event to every `code-section` citation in `findings.citations` (`FindingCodeCitation.atomId` per `lib/api-zod/src/generated/types/findingCodeCitation.ts:13`).
- Aggregates per `(jurisdictionTenant, citedAtomId)`: `acceptCount`, `rejectCount`, `overrideCount`, `statedConfidences[]` (finding-level stated confidence at generation — **not** an atom confidence field).
- `jurisdictionTenant` resolved from `engagements.cortex_jurisdiction_key`, falling back to `keyFromEngagement()` on engagement jurisdiction fields (I5/I8 tenant partition — no cross-tenant global rollup).

### Internal routes (`artifacts/api-server/src/routes/findingsEvidenceLedger.ts`)

Reviewer-only (`session.audience === "internal"`), **not in OpenAPI** (I7 — backend attribution only):

| Endpoint | Purpose |
|---|---|
| `GET /api/findings/adjudication-evidence` | Ledger rows; optional `?jurisdictionTenant=` filter |
| `GET /api/findings/adjudication-evidence/health` | `invalidCitationCount` lineage-trust health (60-day window) |

Registered in `artifacts/api-server/src/routes/index.ts` after `findingsRunsRouter`.

## Guardrails verified

| Guardrail | Status |
|---|---|
| Tenant partition (I5/I8) | Every ledger row carries `jurisdictionTenant`; optional filter scopes to one tenant; same `citedAtomId` in two tenants produces two rows (tested) |
| No global write-back | Read-model only; no confidence field on code atoms; no corpus mutation |
| Keep the rail quiet (I7) | Not in OpenAPI; no reviewer UI; no MCP exposure |
| Confidence absent from public outputs | No atom/MCP/UI schema change; `statedConfidences` is internal ledger metadata for Phase 3 calibration computation only |

## `invalidCitationCount` health

**Production Neon:** not queried in this session (`DATABASE_URL` / `TEST_DATABASE_URL` unset in agent shell; no `.env.local` on workstation).

**Local verification (empty test Postgres, 60-day window):**

```json
{
  "windowDays": 60,
  "completedRuns": 2,
  "runsWithInvalidCitations": 1,
  "totalInvalidCitations": 2,
  "runInvalidRate": 0.5
}
```

(from seeded test data in `findings-evidence-ledger.test.ts` health case)

**Operator action:** hit `GET /api/findings/adjudication-evidence/health` on staging/prod (internal audience) to report the live `runInvalidRate`. Phase 0 dependency: keep this rate low; high rates starve the ledger via token-stripping at generation (`invalidCitationCount` on `finding_runs`).

## Tier 1b warranted?

**No.** Tier 1a is a single indexed join over existing tables (`atom_events` timeline index + `findings.atom_id` unique). No migration, no capture-point write amplification. Revisit 1b only if production query cost or retention requirements exceed comfortable recompute bounds.

## Tests (verbatim, HR-8)

```
 RUN  v3.2.4 P:/legacy-design-tools/artifacts/api-server

 ✓ src/__tests__/findings-evidence-ledger.test.ts (7 tests) 6586ms

 Test Files  1 passed (1)
      Tests  7 passed (7)
   Start at  07:51:52
   Duration  8.88s (transform 2.12s, setup 20ms, collect 1.85s, tests 6.59s, environment 0ms, prepare 163ms)
```

Typecheck: `pnpm --filter @workspace/api-server run typecheck` — exit 0.

## Blockers

None at close. Submodule dirty state in `.claude/worktrees/*` and unrelated unstaged brokerage files on the worktree were **not** included in the PR commit.

## Revision history

- **2026-06-06** — Phase 1 tier 1a built; PR #143 opened (`8357803`).
- **2026-06-07** — PR #143 merged to `main` (`3a79dad`). Tier 1a live on `main`.

## Out of scope (confirmed deferred)

- Tier 1b durable evidence write
- Confidence field on code-section atoms
- Engine recompute / corpus mutation
- Phase 2 outcome capture
- Phase 3 calibration computation / grade
