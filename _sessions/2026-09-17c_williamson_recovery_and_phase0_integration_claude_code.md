---
id: 2026-09-17c_williamson_recovery_and_phase0_integration_claude_code
title: "Session: Williamson restored from a point-in-time branch, all six Phase 0 lanes merged, and Cotality ruled off the critical path"
date: 2026-09-17
last_updated: 2026-09-17
kind: session
session_type: integration
status: closed (operator-called close; handoff at _inbox/2026-09-17d_HANDOFF_integration_seat.md)
agent: claude_code
repo: doc_repo
owner: nick
seat: integration
programs: [OPS-24, OPS-16]
related:
  - _sessions/2026-09-17b_phase0_applies_and_serving_claude_code.md (the session this continues)
  - _inbox/2026-09-17_williamson_mass_retirement_INCIDENT.md
  - _decisions/2026-09-17_ship_without_cotality.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md (A-212; rows P-319 to P-324)
  - _inbox/2026-09-16_texas_scaleup_ROADMAP.md (updated through close)
snapshot: doc_repo main e24cd21e; map 3693d831, LDT 388ccc5c, engine 72d72c02, factory 087927bc; PE 3cpnl30o0; read 2026-09-17 22:10Z
---

# Session: a county went dark, came back, and the rest of Phase 0 landed

This session reopened after the previous one had been closed, because the Williamson publish that was
running at that close completed and emptied the county.

## The incident, and the thing worth keeping from it

Williamson's production publish (run `7b2540c8`) did not crash. It completed, and it retired all
602,050 served tier-1 rows for 48491 including the 319,480 numeric rows that were live on the
2026-09-10 bake. The county was dark on the customer surface from 19:26Z. The published parcel index
is R-keyed, the served nodes are numeric-keyed, and the retirement step differenced one keyspace
against the other, so every numeric node was absent by construction.

P-306 had fixed the coverage FLOOR for exactly that keyspace split, and the floor duly passed at
retention 1.1666 while the writer emptied the county. **A control that measures one thing does not
protect the thing next to it**, and the floor's pass is what made the run look healthy.

Recovery was a row copy from a Neon point-in-time branch at 19:22:29Z, because production payloads
had become 1,579-byte retirement stubs against 2,226-byte payloads on the branch: facts were
destroyed, not merely flagged, so un-retiring the keys would have restored nothing. 319,480 rows were
copied back over `dblink` in ten batches under a heavy-scan lease, verified by an independent census
and on the customer surface, with an R-keyed parcel shown still correctly retired — which is what
proves one keyspace was touched and not the store.

**The finding that outranks the defect:** ENFORCEMENT.md has carried "a mass state change refuses
before it lands" since the 2026-09-15 Bastrop reconcile retired 92.5 percent of that county by the
same presence-shaped comparison. Nobody built the refusal. Two days later the class took a second
county through a different writer. A doctrine paragraph is not a control. P-320 builds it, and P-320
is generic: it needs no knowledge of either defect and would have stopped both at write time.

## What was ruled

**Ship without Cotality** (A-212, `_decisions/2026-09-17_ship_without_cotality.md`). About two weeks
out, struck from the Phase 0 exit, P-267 and P-283 deferred to Phase 1, and P-322 ships the affected
rails as declared, labelled absences. Recording it surfaced a live defect: the fleet-wide bullet in
`_state/shared/STANDING_DECISIONS.md` read "COTALITY IS EXTINGUISHED" at HEAD, a third and wrong
state, so every regeneration of `_STATE.md` propagated it into the canon preamble of every compiled
dispatch. The generator's scope gate then refused my first correction for naming a plan row in a
fleet-wide bullet, which was right; the program half went to `_catalog/program_preambles/OPS-24.md`.

**The stale tags** (P-323, operator agreed). Repoint the two named tags, delete the unreferenced
one-offs, and kill the generator.

## All six Phase 0 lanes closed and merged

factory #171 (P-287), engine #470 and LDT #715 (P-279), map #416 (P-272, P-291), engine #471 (P-260,
P-263), and the controls trio factory #172 / engine #472 / LDT #716 (P-273, P-274). Each diff was
read before merging, not taken on the PR body.

Three of them are worth recording for what they found rather than what they fixed:

- **A CI step named for a check it could not perform.** It asserted that a sha256 digest is a
  64-character string, which is true of every input; five distinct byte strings including an empty
  file all returned PASS.
- **Dallas 48113 grades 1 of 65 rails.** The other 64 emit no verdict row at all, and a missing row
  is invisible where an unaccounted cell would be countable, so the county most needing a refusal
  generates the fewest verdicts. The new `gate-verdict-audit` fails on the live store today, which is
  it measuring a real gap rather than regressing.
- **A four-copy rule with one copy drifted** in hauska-map: the "is this address unusable" test lived
  in four files and the narrow one did not know the `", ,"` sentinel, so a malformed situs rode along
  with a perfectly good click point.

Two rows the dispatches named were **not built**, and both lanes said so plainly rather than quietly:
P-270 (the widest customer defect, 29 of 31) and P-286. Both are now their own dispatches.

## What reached customers

Property Explorer `3cpnl30o0` on smartsite.cloud, carrying P-272 and P-291, verified on the live
alias rather than on the deploy result: the asset moved `index-BmSA68Wd.js` to `index-gi9ECXVc.js`
and the served bundle carries both new strings. Deployed from a fresh clone, because `P:/hauska-map`
is 370 commits behind, one commit ahead and dirty.

Nothing else shipped. The engine deploy was handed to a fresh session and the LDT legs are blocked by
P-323.

## Measurements taken

**0103 is applied and verified at the data**, not at the tracker: 1,184,897 rows with
`zoning_district` not null, 1,184,897 with `zoning_district_interim` populated, backfill gap 0. It
had already been applied when the store went quiet and the script correctly refused to re-run it.

**Six-county completeness, re-graded against a current verdict table** for the first time since the
applies (`_inbox/2026-09-17_six_county_completeness_post_apply.txt`, 22:03:12Z). VERDICT INCOMPLETE.
Of 65 rails: Travis 40, Bastrop 38, Caldwell 38, Hays 38, McLennan 37, **Williamson 33 with 16
open**. `false-earned: none` in all six. Williamson's gap is the D1 hold showing through — three
rails refuse on all 282,570 parcels because its parcel-record fill is held (P-310). **The biggest
single lever on the Phase 0 exit is that held decision, not more lanes.**

**P-263's census**, from the engine lane: population 490,185 = bucket sum, 208,868 to
`not-applicable`, 250,883 to `provisional-front-edge`, 30,434 unclassifiable and unmoved, proven
read-only by an identical population digest before and after. It moves 69.1 percent of the 709,372
envelope atoms in scope and P-213's blast-radius guard returned UNMEASURED because no max share was
declared.

## Mistakes, stated

Three of my own records were wrong, and each was found by reading the authoritative source rather
than by re-reading my conclusion.

- **I blamed the Williamson publish for blocking migration 0103.** The publish had ended and 0103
  still blocked. `pg_locks` named the real holder: a psql session that had held `AccessShareLock` on
  `txgio_parcel` since 13:42:05Z, 7.3 hours, running a P-309-shaped query whose lane had closed
  hours earlier. Cancelled with the operator's go.
- **I recorded engine-api as traffic-PINNED and retrieval-api as following latest. It is the
  reverse**, and reversed in the dangerous direction: a deploy made on that belief would have taken
  100 percent of production traffic the moment the revision was ready, while I believed it was parked
  on a tag. Read by field before deploying anything.
- **I recorded Property Explorer's production deployment as `mfesp954e`.** It was `5jtk8s0dw`,
  deployed about 20:30Z by another seat.

That rate is the pattern ENFORCEMENT.md names for a long session, which is why the remaining write
operations were held rather than pushed through.

## Open at close

Four lanes running (P-319 with PR #173 open, P-257 with PRs #417 and #717 open, P-270 and P-322 with
none yet) plus the engine deploy in a fresh session. Three dispatches compiled and ready: P-286/P-317
(now unblocked), P-323, P-324. The Austin stamp, P-294's schedule and dry cycle, and P-258's writer
re-run are all writes and were deliberately not started.
