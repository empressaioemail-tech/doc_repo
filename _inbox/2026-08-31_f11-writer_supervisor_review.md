---
id: 2026-08-31_f11-writer_supervisor_review
title: Supervisor grade — F11-WRITER
date: 2026-08-31
last_updated: 2026-08-31
status: active
lane: f11-writer
plan_row: F-11, F-02
agent: 89e48338-1312-4012-a587-05a6bfbce5a8
snapshot: integration P:/doc_repo; engine tree P:/seat-worktrees/property/hauska-engine-f11-setback seat/property-ctx-f11-writer HEAD 80fb906; uncommitted; no apply
---

# Supervisor grade — F11-WRITER

Seat: integration on `P:/doc_repo`. Reviewed the write path, not the handback. Re-ran vitest 33/33 and the process refuse arms. Did not apply. Did not commit.

Implementer: [F11-WRITER](89e48338-1312-4012-a587-05a6bfbce5a8).

## Verdict

Items 1 and 2 are code-done. Item 3 is handed back. Customer-done is a Cloud Run job that passes an explicit writer name, then a later apply card. That has not started.

The load-bearing fix is the allowlist. `atoms-writer-job.mjs` no longer hardcodes the CAD child.

| Item | Grade | Evidence |
|---|---|---|
| Absent writer | MET | `node atoms-writer-job.mjs` → `WRITER_REQUIRED` exit 2. Not MISSING_ENV. CAD does not spawn. |
| Unknown writer | MET | `--writer=not-a-writer` → `WRITER_NOT_ALLOWLISTED` exit 2. |
| Missing county | MET | `--writer=cad-parcel-roll` → `COUNTY_REQUIRED` exit 2. `--county=48021` resolves. |
| Path env | MET | well-fact sets only `WELL_FACT_PATH`. cad-parcel-roll clears the others. |
| Setback city scope | MET | `--city=elgin-tx` without county refuses. austin-tx on 48021 refuses. Unincorporated is not-applicable. In-city smithville is unmeasured. |
| Apply held | MET | `--apply` is `SETBACK_APPLY_HELD` before fixture load. |
| Quarantines | MET | Placeholder input `PLACEHOLDER_COLLISION`. McLennan envelope `MCLENNAN_ENVELOPE_COLLISION`. |
| Item 3 | DROPPED THIS CARD | Live `fetch()` at `write-utility-easement-county.mjs:191`. |

## Residuals

`factory-atoms-cad` will fail `WRITER_REQUIRED` until its args name `--writer=cad-parcel-roll` or `WRITER_NAME=cad-parcel-roll`. That is the card working, not a regression to paper over.

`planConformantChunks` is a plan object. It does not take a lease or write `run_events`. Apply stays held.

Plain `node write-setback-city.mjs` cannot resolve the TypeScript imports. The job uses `pnpm exec tsx`, same as the other writers.

## leave_behind

- Commit this tree by pathspec after operator go.
- Update `factory-atoms-cad` args before the next execute.
- Do not apply setbacks from this card.
- Easement landed-bytes is a leftover card.
