---
id: 2026-08-31_p4-rails_supervisor_review
title: Supervisor grade — P4 rails
date: 2026-08-31
last_updated: 2026-08-31
status: active
lane: p4-rails
plan_row: F-18
agent: 7ac45d46-ab72-40d5-af2b-d72c4d4ac0f5
snapshot: integration P:/doc_repo; Factory tree P:/seat-worktrees/property/hauska-factory-p4-rails seat/property-ctx-p4-rails HEAD a7a804220ad046ac3c70e286d61c83595bb3afe3; uncommitted; no apply
---

# Supervisor grade — P4 rails

Seat: integration on `P:/doc_repo`. Reviewed the write path, not the handback. Re-ran `node --test test/p4-rails.test.mjs`: 16 pass / 0 fail. Did not execute a writer job. Did not re-fetch C3/C4/C7. Did not commit.

## Verdict

File-side wiring accepted. Customer-done is planner create of the two missing writer jobs, then the apply plan. That has not started. Setbacks stay HOLD.

| Item | Grade | Evidence |
|---|---|---|
| Missing `--county` | MET | CLI `p4-rails` → `COUNTY_REQUIRED`. No default 48021. Harris is `SCOPE_NOT_SIX`. |
| Collect-complete | MET | `RAIL_LEDGER_TABLE.wells` is `tx_rrc_well`. `landing_` source refuses. 0=0 refuses. Scope 254 refuses. |
| Zero-FIPS dead | MET | `writeAbsenceBecauseZero` or `sourceCount === 0` → `ZERO_FIPS_DEAD`. Measured wells all > 0. |
| Caldwell skip | MET | `--apply` on 48055 wells/footprint → `CALDWELL_ALREADY_APPLIED`. Flood is convert on all six. |
| Laptop `--apply` | MET | `LAPTOP_WRITE_FROZEN` before connect. `executeP4Apply` is `APPLY_NOT_THIS_CARD`. `applyExecuted` stays false. |
| Held rails | MET | `setbacks` / `edges` / `envelope` → `HELD_RAIL`. Diff is cli, allowlist, new job, new test. No setback files. |
| Gate 8 | MET as snapshot | Return copies fail/fail/fail. Not a live probe. A move after apply is a finding. |

## Residuals

Allowlist ids are `p4-wells` / `p4-footprint` / `p4-flood`. The jobs that write are `factory-atoms-wells`, `factory-atoms-footprint`, and existing `factory-conformant`. Engine writers do not call `requireWriterJob`. Named bypass.

Five-field two-count is table-grain statewide. Scope is one county. That is what `import_ledger` stores. Do not treat 1,396,049 as a county owe.

Counts in the close match the dispatch. I did not re-query Neon.

## leave_behind

- Commit this tree by pathspec after operator go.
- Create `factory-atoms-wells` and `factory-atoms-footprint` digest-pinned us-east4 before execute.
- Wells five, then footprint five after the RRC scan releases, then flood convert on six.
- Gate 8 `dayOne` after apply: C3/C4/C7 must stay fail.
- Do not re-run `landing-import`. Do not Wave R. Do not touch setbacks.
