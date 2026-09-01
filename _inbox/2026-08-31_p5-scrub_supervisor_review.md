---
id: 2026-08-31_p5-scrub_supervisor_review
title: Supervisor grade — P5-SCRUB
date: 2026-08-31
last_updated: 2026-08-31
status: active
lane: p5-scrub
plan_row: F-08
agent: 789cde32-a979-44ef-82b6-85e343921efc
snapshot: integration P:/doc_repo; Factory tree P:/seat-worktrees/property/hauska-factory-p5-scrub seat/property-ctx-p5-scrub HEAD 3a0dc9a; uncommitted; no production scrub
---

# Supervisor grade — P5-SCRUB

Seat: integration on `P:/doc_repo`. Reviewed the write path, not the handback. Re-ran `node --test test/p5-scrub.test.mjs` (50/0) and the related publish / p1-controls / reconcile suite (96/0). Did not run a production walk. Did not commit.

Implementer: [P5-SCRUB](789cde32-a979-44ef-82b6-85e343921efc).

## Verdict

Code-done. Customer-done is a live walk after P4 with extra readers and a geometry table attached. That has not started. Poison fixtures stay.

Family zero is the load-bearing fix. `gradeRule` used to PASS on a caller literal. It does not.

| Item | Grade | Evidence |
|---|---|---|
| meaningShaped call sites | MET | Write path: `conformant.mjs` had the literal; test had the literal; `f10-cad-loop.mjs` is empty `gradeCounty`. No derived call site. |
| Family zero | MET | Supervisor ran `{evidence:{pass:true}, meaningShaped:true}` → UNMEASURED. `MEANING.has("V1")` alone → UNMEASURED. |
| Fourteen families on the walk | MET as wiring | `walkParcel` always calls `gradeAllSFamilies`. Missing id fails the wiring test. No skip flag. |
| Both directions | MET | Poison FAIL and known-good PASS per family in `test/p5-scrub.test.mjs`. Supervisor re-ran 50/0. |
| Poison fixtures kept | MET | `48021:__broken__` still present. Existing publish walk tests still pass. |
| Live S6 / S7 / S4 | PARTIAL | Invoked, UNMEASURED without extras. Named leave_behind. Not a skip. |
| Production scrub | NOT THIS CARD | Write and test only. |

## Residuals

S9 and S13 default-on seconds are tables in `s-rules.mjs` (unit range, provenance allowlist). They are named artifacts, not a caller boolean. Acceptable for those families.

S7's fallback probe is the walk body labeled `live-probe`. It only matters if someone later passes `extras.ledgerCell` from the same body. Do not do that.

`HARD_CLASSES` is a named list. The walk sweep does not force those classes in. Fixtures do. Forcing them on a live walk is the next verify card.

Conformant V-grades write UNMEASURED into `rule_grades`. That is honest. Do not restore PASS without two observations.

## leave_behind

- Commit this tree by pathspec after operator go.
- Attach S6/S7 extra readers as an area sweep, never a random sample.
- S4 waits on a Factory geometry table.
- Writer lane supplies two named observations per V-rule or leaves them UNMEASURED.
