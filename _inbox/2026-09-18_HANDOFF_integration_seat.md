---
id: 2026-09-18_HANDOFF_integration_seat
title: Handoff to a fresh integration-seat planner, 2026-09-18 midday
date: 2026-09-18
last_updated: 2026-09-18 (12:10Z)
status: active handoff
kind: handoff
owner: nick
from: integration seat, 2026-09-18 12:10Z (session that merged the nine lane PRs and took the Phase 0 close-out rulings)
programs: [OPS-24, OPS-16]
related:
  - _inbox/2026-09-18_phase0_closeout_REGISTER.md (THE durable list; read it second)
  - _decisions/2026-09-18_phase0_closeout_rulings.md (A-215, A-216: nineteen rulings)
  - _decisions/2026-09-18_join_miss_unaccounted_until_scoped_guard.md (A-214)
  - _inbox/2026-09-16_texas_scaleup_ROADMAP.md (the live queue and live services)
  - _sessions/2026-09-18_nine_prs_and_phase0_closeout_rulings_claude_code.md
  - _inbox/2026-09-17d_HANDOFF_integration_seat.md (CONSUMED; its traps still apply)
snapshot: doc_repo main 6f9188f6 or later; hauska-map cfe23197, legacy-design-tools 25d1782f, hauska-engine 72d72c02, hauska-factory 85d63e8d; Property Explorer 1qrscbkcf; factory publish lane afbd0bbc, ACQUIRE-GIS 360923cc; retrieval-api 00102-ciz (PINNED), engine-api 00253-qan (FOLLOWS LATEST); read 2026-09-18 12:06Z
---

# Handoff: the integration seat, 2026-09-18 midday

You are the integration seat in `P:/doc_repo` on `main`. You plan, review, merge, deploy and grade;
lanes build; the operator fires the dispatches you compile. Work in active program management mode.
Commit only after showing the operator the batch, and push before a dispatch is handed out.

**The operator's standing instruction for this phase:** everything on the Phase 0 list gets done,
on the exit path or not, and it is done properly. Do not rush Phase 0 to a close. Work runs in waves.

## Read first

1. `CLAUDE.md`, `ENFORCEMENT.md`, your memory index.
2. **`_inbox/2026-09-18_phase0_closeout_REGISTER.md`.** The exit's five legs with their measured
   state, every ruling, every row on and off the exit path with its wave and owner, what the operator
   owes, and the Phase 1 flags. It supersedes the roadmap's old Phase 0 table.
3. `_decisions/2026-09-18_phase0_closeout_rulings.md`: the nineteen rulings, with reversal criteria.
4. The roadmap for live services, and OPS-16 A-213 to A-216 plus rows P-327 to P-351.

## 0. Where things stand

**All nine lane PRs from 2026-09-17 are merged.** Deployed and graded on the customer path:
Property Explorer `1qrscbkcf` (P-257 and P-270 map halves; rollback `3cpnl30o0`), the ACQUIRE-GIS
factory jobs `360923cc` (P-322's deleted sweep, graded by a refused Hays dry run), and the factory
publish lane `afbd0bbc` with migration 0015 applied (P-319/P-320/P-321 as a PARTIAL fix by ruling).
**Merged and not deployed:** every LDT half (P-257, P-270, P-322, and P-206's XD-6 fix), blocked on
P-323; factory #175 (P-325), whose build also rebuilds the hourly gate scheduler.

**Wave 1 is with the operator to fire** (paths on origin/main):
`_dispatches/2026-09-18_p323-tag-hygiene_dispatch.md`, `..._p332-etj-panel_...`,
`..._p335-williamson-crosswalk_...`, `..._p327-retirement-gate-roll_...`,
`..._p342-p263-apply-writer_...`, `..._p328-engine-reconcile-blast-radius_...`.
Their closes land in the lanes' own worktrees; copy each close, its checkpoints and every artifact
it cites into `P:/doc_repo/_inbox` and track them before anything cites them.

**Still running from before:** P-264 (road residual). It opened hauska-engine **#473** today
("separate road-NAME from road-CLASS verify failures"); review it when its close lands.

## 1. Your first job: the seat's own Wave 1 (register section 3b)

Deliberately NOT started in the previous session, because the three production writes should not
run at the end of a very long session. Start them fresh, one at a time, each recorded.

| Order | Item | Kind | Note |
|---|---|---|---|
| 1 | P-348 | read-only | McLennan `situsState` (1 parcel) and Williamson `buildingFootprint` (1 parcel): name each parcel, read its cause, fix or rule |
| 2 | P-337 | doc_repo instrument | `RAIL_POLICY` in `scripts/six-county-completeness.mjs`: named exclusions for `landUseDescription` (ruling 3) and `railCorridor` (ruling 4), each coupled to its open Phase 1 row (P-345, P-344); self-tests both directions |
| 3 | P-347 | doc_repo instrument + runs | Probe XD-1 corrected to P-304's rule (ruling 13); a sign-in helper for the MCP leg (ruling 9: the operator signs in per run with the paid Solo test account, token in memory only, record the tier); `--use-system-ca`; engine key for the PDF leg; build a PDF for each of the 45 fixture parcels (ruling 17); re-run; confirm or reopen P-270's X2; grade coverage |
| 4 | dblink | production write | Confirm nothing depends on the extension on the production database, then drop it; leave a durable record |
| 5 | #175 deploy | production | `cloudbuild.parcel-record-fill.yaml` also rebuilds `factory-publish-gate-sched`, whose lease code moved since its live build `1fa850e7`: pause the hourly trigger, deploy, grade one cycle, resume. No `parcel-record-fill --apply` before this |
| 6 | P-258 re-run | production write | The setback writer re-run and census re-grade, which gates P-300 and P-338 in Wave 2 |

## 2. Wave 2 (register section 3a) and what gates it

P-336 and P-339/P-340/P-341 start after P-332 merges (shared map files). P-300 with P-338 after
P-258's re-run. P-333 and P-351 after P-335. Factory controls P-334/P-329/P-330, P-331, P-324
(after P-323), P-286/P-317 have no gate. Compile each from its OPS-16 row with a mission file, the
way Wave 1's were (`_catalog/dispatch_missions/mission_p3xx_*.md`, then `node scripts/dispatch.mjs`).
**Factory merge order in Wave 2:** P-333, then P-334/P-329/P-330, then P-300/P-338's writer half,
then P-336's writer half, one at a time, each re-greened against the base it merges into.

Seat Wave 2: the LDT deploy right after P-323 lands (verify P-279's check is green first); P-263's
apply county by county once P-342 lands (dry run first, each capped at its own measured share);
P-321's watch scheduled **hourly** once P-334 lands; P-294's dry cycle; the Austin stamp; the Hays
join-miss delta read.

## 3. Standing facts that override older records

- **hauska-engine-api FOLLOWS LATEST** (read by field 2026-09-18 11:45Z: `latestRevision: true` at
  100 percent on `00253-qan`). The 2026-09-17 deploy lane's close says it pinned it; the service says
  otherwise. **retrieval-api is the PINNED one** (`00102-ciz`). Deploy engine-api with `--no-traffic`.
- **No production publish of 48491 until P-327 ships** (A-214). P-319's gate is live but measures
  retirement against `txgio_parcel` while the bake retires against `cad_property` at the declared
  tax_year; P-351 is the LDT half. P-350 is the Williamson republish, and only after it do you
  delete PITR branch `br-late-rain-apffmnp2`.
- **The P-319 gate has never run against a real store.** Its first live verdict is the next hand-run
  publish; P-327's six-county census is the evidence it will not falsely refuse a healthy county.
- **P-321's watch has never run successfully.** It refuses `TARGET_ENV_MISSING` on every execution
  (P-334). Execution `m7cv7` and the ag-valuation execution `jgxmm` were deliberate verification runs:
  exclude both from failed-execution counts.
- **CAD join misses write `unaccounted`** since #175 (A-214), in every county, until P-333 restores
  genuine absences per population. #175 is merged, not deployed.
- **The customer leg of record is the 2026-09-17 19:20Z probe** (P-254). A 22:47Z run with one FAIL
  graded OPS-23 rows and says nothing about the customer leg. The probe needs `node --use-system-ca`
  on the Windows host.
- **San Marcos (ruling 19):** served from corpus 1.4.0 after the 2026-09-07 area-coverage check is
  re-run and holds; Georgetown withheld and uncited until its code takes effect 2026-11-01; then the
  Hays bake that customer-closes P-260 (P-349).

## 4. Traps

- **Lane artifacts live where the lane ran,** not in `P:/doc_repo`: its seat worktree
  (`P:/seat-worktrees/<lane>/doc_repo/_inbox`) or the other clone (`C:/Users/cente/doc_repo`). The
  previous session found 18 cited artifacts untracked and nearly dispatched lanes at files absent from
  `origin/main`. Before compiling or committing anything that cites a file, check it is tracked.
- **Read the service, not the close.** A lane's claim about a deployed service's state is a claim
  (see engine-api above). Read by field with `--format=json`.
- **The seat gate reads the session's working directory.** After cloning into `P:/tmp`, `cd` back to
  `P:/doc_repo` in its own call before a doc_repo push, or the push is refused.
- **The map and LDT "pins" on shared literals cannot fail on cross-repo drift** until P-331. Values
  agree today; do not cite those tests as a control.
- **The county runner stops stage 6** for 48021, 48055, 48209, 48309 and Burnet on ag-valuation's
  declared refusal until P-330.
- `P:/doc_repo` is shared: read `git log -1` and `git diff --cached` immediately before committing,
  commit by explicit pathspec, push straight away.
- 18 stale PRs from August and early September sit open across hauska-engine (12), LDT (4), map (1)
  and factory (1). They are not this program's queue; triage them only when the operator asks.

## 5. Owed by the operator

Sign in when the probe runs (ruling 9); roads per city once P-264 lands (ruling 8); the Williamson
production publish go (P-350); the walk (ruling 18). Off the exit path: P-294's first automated run,
Burnet address points, P-278 rotation, the P-243/P-244a account check, `_STATE.md`.

## Starter prompt

"You are the integration seat in P:/doc_repo. Read _inbox/2026-09-18_HANDOFF_integration_seat.md,
then _inbox/2026-09-18_phase0_closeout_REGISTER.md. The operator has fired Wave 1 (six lanes). Your
first job is the seat's own Wave 1 in the order section 1 gives: P-348, P-337 and P-347 first, then
the three production writes (dblink, the #175 deploy under the gate-scheduler procedure, P-258's
re-run) one at a time with a record for each. Do it properly, not fast. As Wave 1 lanes close, copy
their artifacts into P:/doc_repo, review and merge, and compile Wave 2 from the register."
