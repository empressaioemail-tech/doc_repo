---
id: 2026-09-17d_HANDOFF_integration_seat
title: Handoff to a fresh integration-seat planner, 2026-09-17 late evening
date: 2026-09-17
last_updated: 2026-09-17
status: active handoff
kind: handoff
owner: nick
from: integration seat, 2026-09-17 22:10Z
programs: [OPS-24, OPS-16]
related:
  - _inbox/2026-09-16_texas_scaleup_ROADMAP.md (the live state and the queue; read it second)
  - _sessions/2026-09-17c_williamson_recovery_and_phase0_integration_claude_code.md
  - _inbox/2026-09-17_williamson_mass_retirement_INCIDENT.md
  - _decisions/2026-09-17_ship_without_cotality.md
  - _inbox/2026-09-17c_HANDOFF_integration_seat.md (CONSUMED; its traps still apply)
snapshot: doc_repo main e24cd21e; hauska-map 3693d831, legacy-design-tools 388ccc5c, hauska-engine 72d72c02, hauska-factory 087927bc; Property Explorer 3cpnl30o0; read 2026-09-17 22:10Z
---

# Handoff: the integration seat, 2026-09-17 late evening

You are the integration seat in `P:/doc_repo` on `main`. You plan, review, merge, deploy and grade;
lanes build; the operator fires the dispatches you compile. Work in active program management mode:
drive, decide, report. Commit only after showing the operator the batch, and **commit and push a
dispatch before it is handed to a lane** — a lane reads `origin/main`, not your working tree.

## Read first

1. `CLAUDE.md`, `ENFORCEMENT.md`, your memory index.
2. `_inbox/2026-09-16_texas_scaleup_ROADMAP.md` — live services with rollback targets, what is in
   flight, the queue, and what each side owes. Update it whenever a row changes state, with a
   change-log line, and take timestamps from `date -u`.
3. `_inbox/2026-09-17_williamson_mass_retirement_INCIDENT.md`. Do not skip it: it is the reason
   48491 may not be republished yet.
4. OPS-16 amendment **A-212** and rows **P-319 to P-324**.

## 0. Two standing facts that override older records

**Cotality is off the critical path** (A-212). About two weeks out, struck from the Phase 0 exit,
P-267 and P-283 deferred to Phase 1, P-322 ships the affected rails as declared, labelled absences.
No row may sit idle naming the vendor.

**No production publish of county 48491 until P-319 ships.** Its publish retired the whole county on
2026-09-17 and the rows were restored from a point-in-time branch. Two leave-behinds are yours:
delete Neon PITR branch `br-late-rain-apffmnp2` only AFTER 48491 has republished successfully (it is
the only copy of the pre-incident payloads), and decide whether to drop the `dblink` extension
created on the production database — say which either way.

## 1. Corrections to records this seat had wrong. Trust these over anything older.

- **engine-api FOLLOWS LATEST; retrieval-api is PINNED.** Read by field 2026-09-17 21:30Z:
  engine-api traffic is `{"latestRevision": true, "percent": 100}`, retrieval-api is an explicit
  `{"percent": 100, "revisionName": "…-00100-hut"}`. Earlier docs said the reverse, which is the
  dangerous direction: a deploy made on the old belief ships itself to every customer. Re-measure
  before you touch either, with `--format=json` and fields read by name — never a positional
  `--format="value(...)"`, which shifts every column after a blank field.
- **Migration 0103 is DONE.** Verified at the data: 1,184,897 rows with `zoning_district` not null,
  1,184,897 with `zoning_district_interim` populated, backfill gap 0. Do not re-run it; the script
  refuses anyway.
- **What blocked 0103 all day was NOT the Williamson publish.** It was a psql session holding
  `AccessShareLock` on `txgio_parcel` since 13:42:05Z (7.3 hours), running a P-309-shaped query whose
  lane had already closed. Cancelled. When a lock blocks you, read `pg_locks` and name the holder
  rather than inferring it.
- **Both working clones are unsafe to deploy from.** `P:/hauska-map` is 370 behind, 1 AHEAD and
  dirty; `P:/hauska-engine` is 228 behind; `P:/hauska-factory` sits at "Initial commit", 287 behind.
  Clone fresh into a NEW `P:/tmp/` directory and verify the SHA. A `--source` deploy from any of them
  ships stale code and reports success.

## 2. In flight

Four lanes plus a deploy. The operator reports their closes.

| Lane | Rows | State |
|---|---|---|
| Retirement safety | P-319, P-320, P-321 | PR factory **#173 open** |
| Decline wording and PUD | P-257 | PRs map **#417**, LDT **#717** open |
| Citation effective date | P-270 | no PR yet |
| Cotality declared absences | P-322 | no PR yet |
| Engine deploy | P-260, P-263's code | a fresh session has `_dispatches/2026-09-17_engine-deploy-p260-p263_dispatch.md` |

## 3. Compiled and ready to fire

| Dispatch | Rows | Note |
|---|---|---|
| `_dispatches/2026-09-17_p286-p317-burnet-preconditions_dispatch.md` | P-286, P-317 | **Unblocked** — its precondition was P-319's PR being open, and #173 is open |
| `_dispatches/2026-09-17_p323-tag-hygiene_dispatch.md` | P-323 | Operator agreed. **Blocks the next cortex-api and smartsite-mcp deploy** |
| `_dispatches/2026-09-17_p324-pixel-attribution-deploy_dispatch.md` | P-324 | Gate 1 is a LOCAL probe, no push; Gate 2 needs a green P-279, so it waits on P-323 |

## 4. The deploy situation, which is the main thing blocking customer value

Everything merged today except Property Explorer is still sitting on main.

- **Property Explorer is deployed and verified**: `3cpnl30o0`, rollback `5jtk8s0dw`.
- **engine (#471, #472)** — handed to a fresh session, see above.
- **legacy-design-tools (#715, #716)** — **blocked.** P-279 merged a post-deploy check that exits 1
  when a tag points at a revision missing a credential the serving revision carries, and cortex-api
  carries 15 such tags (smartsite-mcp 30). The deploy would still happen and both jobs would go red
  for a reason unrelated to your change, which is how a working control becomes noise. **Do not make
  that check advisory and do not add a bypass flag.** P-323 clears it.

## 5. Where Phase 0 actually stands

`_inbox/2026-09-17_six_county_completeness_post_apply.txt`, 22:03:12Z, VERDICT INCOMPLETE. Of 65
rails: Travis 40, Bastrop 38, Caldwell 38, Hays 38, McLennan 37, **Williamson 33 with 16 open**.
`false-earned: none` in all six.

**Williamson's gap is the D1 hold showing through.** `acreageSqft`, `situsState` and
`landUseVintage` each refuse on all 282,570 parcels because its parcel-record fill is held (P-310).
The biggest single lever on the Phase 0 exit is that held decision, not another lane. The setback
rails stay open on a residual everywhere (Hays 8,610, Travis 33,883, Williamson 5,299), and
`edgeSignal` and `roads` are unmeasured in all six pending P-264's road residual.

## 6. Owed by the operator

| Item | Note |
|---|---|
| P-263's apply | Census in hand: 490,185 = bucket sum, 208,868 to `not-applicable`, 250,883 to `provisional-front-edge`, 30,434 unclassifiable. It moves **69.1 percent** of 709,372 envelope atoms and P-213's guard returned UNMEASURED with no declared max share. Recommend declaring the share and applying county by county |
| The 30,434 unclassifiable envelope atoms | Need a ruling, not a default |
| Burnet address points | `txgio_address` holds 0 rows for 48053 against 35,857 available; no Find-box lookup can pass there until loaded. Production write |
| `SURFACE_PROBE_MCP_TOKEN` | Turns 28 UNMEASURED P-254 buckets into decided ones |
| P-278 credential rotation | Before Burnet's first production publish |
| P-243 / P-244a account check | Open |

## 7. Owed by this seat, all writes, all deliberately not started

They were held because this seat made three wrong load-bearing statements in one long session, which
is the pattern ENFORCEMENT.md names. Start them fresh, not at depth.

1. The Austin stamp, as a session CLI under a production lease (P-296's lane established the path at
   source), then re-run the P-255 census.
2. P-294: create its schedule without enabling it, run one dry cycle, grade it.
3. P-258's writer re-run and census re-grade, then fire P-300.
4. Read the Hays join-miss delta (2,770 cells applied against 1,069 measured) before P-308's factory
   re-vendor retires the job-level step on the claim that it moves nothing.

## 8. Traps, on top of the earlier handoffs' lists

- **A doctrine paragraph is not a control.** The refusal ENFORCEMENT.md called for on 2026-09-15 was
  never built, and the same class took a second county two days later.
- **A control that measures one thing does not protect the thing beside it.** P-306 fixed the
  coverage floor for a keyspace split and the retirement decision next to it stayed keyspace-blind.
- **A tracked migration is not a finished backfill.** Verify at the data.
- **Dispatches are refused by two gates**, the canon gate and the dispatch template gate, and both
  fire on ANY Agent prompt including read-only reviewers. Compile with `scripts/dispatch.mjs`. If you
  use an override, give a specific reason, never a boilerplate string — the override log already has
  eleven identical reasons in one day and that rate is itself a finding.
- **The integration seat has no `_state` namespace**, and the gate refuses writes into another
  seat's. So this seat does work it structurally cannot record. Worth a card.
- A traffic shift needs its lease file written in a SEPARATE call before the shift command.
- `git pull --rebase` refuses on a dirty tree; use `--autostash`. Other seats leave files in
  `P:/doc_repo` and commit into it while you work — check `git log -1` before assuming your HEAD.

## Starter prompt

"You are the integration seat in P:/doc_repo. Read _inbox/2026-09-17d_HANDOFF_integration_seat.md and
do what it says. Four lanes and an engine deploy are running; handle their closes as I report them,
and tell me what to fire next."
