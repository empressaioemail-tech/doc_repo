---
id: 2026-09-17d_HANDOFF_integration_seat
title: Handoff to a fresh integration-seat planner, 2026-09-17 late evening
date: 2026-09-17
last_updated: 2026-09-17 (revised 22:45Z after the four-block analysis)
status: active handoff
kind: handoff
owner: nick
from: integration seat, 2026-09-17 22:45Z
programs: [OPS-24, OPS-16]
related:
  - _inbox/2026-09-16_texas_scaleup_ROADMAP.md (the live state and the queue; read it second)
  - _sessions/2026-09-17c_williamson_recovery_and_phase0_integration_claude_code.md
  - _inbox/2026-09-17_williamson_mass_retirement_INCIDENT.md
  - _decisions/2026-09-17_ship_without_cotality.md
  - _inbox/2026-09-17_six_county_completeness_post_apply.txt (where the four blocks are counted)
  - _inbox/2026-09-17c_HANDOFF_integration_seat.md (CONSUMED; its traps still apply)
snapshot: doc_repo main 220f2803 or later; hauska-map 3693d831, legacy-design-tools 388ccc5c, hauska-engine 72d72c02, hauska-factory 087927bc; Property Explorer 3cpnl30o0; read 2026-09-17 22:45Z
---

# Handoff: the integration seat, 2026-09-17 late evening

You are the integration seat in `P:/doc_repo` on `main`. You plan, review, merge, deploy and grade;
lanes build; the operator fires the dispatches you compile. Work in active program management mode:
drive, decide, report. Commit only after showing the operator the batch, and **commit and push a
dispatch before it is handed to a lane** — a lane reads `origin/main`, not your working tree.

## Read first

1. `CLAUDE.md`, `ENFORCEMENT.md`, your memory index.
2. `_inbox/2026-09-16_texas_scaleup_ROADMAP.md` — live services with rollback targets, what is in
   flight, the queue, what each side owes. Update it whenever a row changes state, with a change-log
   line, and take timestamps from `date -u`.
3. `_inbox/2026-09-17_williamson_mass_retirement_INCIDENT.md`. Do not skip it: it is why 48491 may
   not be republished yet.
4. OPS-16 amendment **A-212** and rows **P-319 to P-326**.

## 0. Standing facts that override older records

**Cotality is off the critical path** (A-212). About two weeks out, struck from the Phase 0 exit,
P-267 and P-283 deferred to Phase 1, P-322 ships the affected rails as declared, labelled absences.
No row may sit idle naming the vendor.

**No production publish of county 48491 until P-319 ships.** Its publish retired the whole county on
2026-09-17 and the rows were restored from a point-in-time branch. Two leave-behinds are yours:
delete Neon PITR branch `br-late-rain-apffmnp2` only AFTER 48491 has republished successfully (it is
the only copy of the pre-incident payloads), and decide whether to drop the `dblink` extension on
the production database — say which either way.

## 1. Where Phase 0 actually stands: four blocks, none of them blocked

`_inbox/2026-09-17_six_county_completeness_post_apply.txt`, 22:03:12Z, VERDICT INCOMPLETE. Of 65
rails per county: Travis 40, Bastrop 38, Caldwell 38, Hays 38, McLennan 37, Williamson 33.
`false-earned: none` in all six.

The 67 open cells are four blocks, and checking each dependency found **every one satisfied** —
they were undispatched, not blocked:

| Block | Cells | What it needs | Dispatched |
|---|---|---|---|
| Mid-cutover (P-204) | 30 | **A ruling, not a build** | Fired |
| Setbacks (P-326 → P-300) | 30 | 58,339 parcels; classify first | Fired |
| roads + edgeSignal (P-264) | 12 | A measurement | Fired |
| D1 (P-325, P-310) | 6 | Fail-closed fix, then a join decision | Fired |

**Only the setback block is customer-visible.** The five mid-cutover rails all serve a customer
today from a non-ledger path, so their 30 cells are open because nobody ruled, not because work is
missing.

**A correction this seat made and you should not re-inherit:** I earlier called D1 "the biggest
single lever on the Phase 0 exit". It is the biggest lever on WILLIAMSON's number and the SMALLEST
block across the exit. Generalising from one county's headline is what the ledger-headline rule
exists to prevent.

### What each fired lane will hand you

- **P-204** returns a ruling table — rail, what serves it now, ledger cell state, cutover cost, cost
  of not cutting over, recommendation. **The ruling is the operator's.** Editing `RAIL_POLICY`'s
  `accept` list is what IMPLEMENTS the ruling; do not let it happen before the ruling. Watch
  `etjStatus` in particular: P-296 put ETJ on the customer surface hours before this, so that verdict
  may simply be stale, and if so it is the most valuable single finding of that lane.
- **P-326** returns the 58,339 classified by refusal reason, with the P-300-servable share counted
  separately. That number decides whether the customer-visible block is small or large.
- **P-264** returns the per-city road residual with road-name and road-class failures counted
  separately. If a city's residual is road-dominated, A-177's own clause pulls that slice of road
  work into Phase 0 **on the operator's ruling**. Its apply is a serialised heavy write and is the
  operator's, not yours.
- **P-325/P-310** returns a shipped fail-closed fix plus a join recommendation among (a) situs
  recovery, (b) a crosswalk, (c) the apply as measured. **Expect (c) to be rejected**; if the lane
  recommends it, that is the finding to interrogate.

## 2. Corrections to this seat's own records. Trust these over anything older.

- **engine-api FOLLOWS LATEST; retrieval-api is PINNED.** Read by field 2026-09-17 21:30Z. Earlier
  docs said the reverse, which is the dangerous direction: a deploy on the old belief ships itself to
  every customer. Re-measure with `--format=json`, fields by name, never a positional
  `--format="value(...)"` — a blank field shifts every column after it.
- **Migration 0103 is DONE**, verified at the data: backfill gap 0. Do not re-run it.
- **What blocked 0103 all day was NOT the Williamson publish.** It was a psql session holding
  `AccessShareLock` on `txgio_parcel` since 13:42:05Z. When a lock blocks you, read `pg_locks` and
  name the holder rather than inferring it.
- **Both working clones are unsafe to deploy from.** `P:/hauska-map` is 370 behind, 1 AHEAD and
  dirty; `P:/hauska-engine` is 228 behind; `P:/hauska-factory` sits at "Initial commit", 287 behind.
  Clone fresh into a NEW `P:/tmp/` directory and verify the SHA.

## 3. In flight

Eight lanes plus a deploy. The operator reports closes.

| Lane | Rows | State |
|---|---|---|
| Retirement safety | P-319, P-320, P-321 | PR factory **#173 open** |
| Decline wording and PUD | P-257 | PRs map **#417**, LDT **#717** open |
| Citation effective date | P-270 | no PR yet |
| Cotality declared absences | P-322 | no PR yet |
| Mid-cutover serve paths | P-204 | fired |
| Setback residual | P-326 | fired |
| Road residual | P-264 | fired |
| Parcel-record join | P-325, P-310 | fired, gated on #173 |
| Engine deploy | P-260, P-263's code | a fresh session has `_dispatches/2026-09-17_engine-deploy-p260-p263_dispatch.md` |

**Three of the new four are hauska-factory**, where #173 is already open. They touch different
files, but sequence the merges rather than parallelising them.

## 4. Compiled and ready, not yet fired

| Dispatch | Rows | Note |
|---|---|---|
| `_dispatches/2026-09-17_p286-p317-burnet-preconditions_dispatch.md` | P-286, P-317 | Unblocked; #173 is open |
| `_dispatches/2026-09-17_p323-tag-hygiene_dispatch.md` | P-323 | Operator agreed. **Blocks the next cortex-api and smartsite-mcp deploy** |
| `_dispatches/2026-09-17_p324-pixel-attribution-deploy_dispatch.md` | P-324 | Gate 1 is a LOCAL probe, no push; Gate 2 needs a green P-279, so it waits on P-323 |

## 5. Deploys

- **Property Explorer is deployed and verified**: `3cpnl30o0`, rollback `5jtk8s0dw`.
- **engine (#471, #472)** — handed to a fresh session.
- **legacy-design-tools (#715, #716)** — **blocked.** P-279's post-deploy check exits 1 when a tag
  points at a revision missing a credential the serving revision carries, and cortex-api carries 15
  such tags (smartsite-mcp 30). The deploy still happens and both jobs go red for a reason unrelated
  to your change, which is how a working control becomes noise. **Do not make that check advisory
  and do not add a bypass flag.** P-323 clears it.

## 6. Owed by the operator

| Item | Note |
|---|---|
| P-263's apply | 490,185 = bucket sum: 208,868 `not-applicable`, 250,883 `provisional-front-edge`, 30,434 unclassifiable. Moves **69.1 percent** of 709,372 envelope atoms; P-213's guard returned UNMEASURED with no declared max share. Recommend declaring the share and applying county by county |
| The 30,434 unclassifiable envelope atoms | Need a ruling, not a default |
| P-204's ruling | CUT OVER / STAYS ELSEWHERE / RETIRE per rail, once that lane reports |
| P-264's apply, and the road-scope ruling if its residual is road-dominated | |
| Burnet address points | `txgio_address` holds 0 rows for 48053 against 35,857 available. Production write |
| `SURFACE_PROBE_MCP_TOKEN` | Turns 28 UNMEASURED P-254 buckets into decided ones |
| P-278 credential rotation | Before Burnet's first production publish |
| P-243 / P-244a account check | Open |

## 7. Owed by this seat, all writes, deliberately not started

Held because this seat made four wrong load-bearing statements in one long session, which is the
pattern ENFORCEMENT.md names. Start them fresh, not at depth.

1. The Austin stamp, as a session CLI under a production lease, then re-run the P-255 census.
2. P-294: create its schedule without enabling it, run one dry cycle, grade it.
3. P-258's writer re-run and census re-grade, then fire P-300 — **after P-326 says what the 58,339
   are**, since P-300's scope depends on it.
4. Read the Hays join-miss delta (2,770 cells applied against 1,069 measured) before P-308's factory
   re-vendor retires the job-level step on the claim that it moves nothing.

## 8. Traps, on top of the earlier handoffs' lists

- **A doctrine paragraph is not a control.** The refusal ENFORCEMENT.md called for on 2026-09-15 was
  never built, and the same class took a second county two days later.
- **A control that measures one thing does not protect the thing beside it.** P-306 fixed the
  coverage floor for a keyspace split and the retirement decision next to it stayed keyspace-blind.
- **A tracked migration is not a finished backfill.** Verify at the data.
- **A county headline does not generalise to the program.** See the D1 correction above.
- **Dispatches are refused by two gates** — the canon gate and the dispatch template gate — and both
  fire on ANY Agent prompt including read-only reviewers. Compile with `scripts/dispatch.mjs`. If you
  use an override, give a specific reason, never boilerplate: the override log already carries eleven
  identical reasons in one day and that rate is itself a finding.
- **`P:/doc_repo` is a shared tree and other seats commit into it while you work.** This session had
  an entire session close swept into another seat's commit, and HEAD move backwards mid-stage. Read
  `git log -1` and `git diff --cached` immediately before committing, commit by explicit pathspec,
  and push straight away rather than batching.
- **The integration seat has no `_state` namespace** and the gate refuses writes into another seat's,
  so this seat does work it structurally cannot record. Worth a card.
- A traffic shift needs its lease file written in a SEPARATE call before the shift command.

## Starter prompt

"You are the integration seat in P:/doc_repo. Read _inbox/2026-09-17d_HANDOFF_integration_seat.md and
do what it says. Eight lanes and an engine deploy are running; handle their closes as I report them,
and tell me what to fire next."
