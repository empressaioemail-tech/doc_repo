---
id: 2026-09-01_ctx_containment_and_seat_queue
title: CTX containment completes on covers-v1; the seat queue replaces hand-carry
status: complete
last_updated: 2026-09-01
applies_to: OPS-19 F-01, F-00
related: [_queue/README, 90_runbooks/seat_loop, _decisions/2026-09-01_seat_queue_protocol]
---

# Session — 2026-09-01

## What landed

**A1 is closed. All six Central Texas counties have containment, and TOTALS is unblocked.**
TOTALS is the head of the critical path.

| county | rows | in city | unincorporated | unresolved | method | run | wall |
|---|---|---|---|---|---|---|---|
| 48491 Williamson | 282,570 | 174,827 | 107,743 | 0 | `covers-v1` | `2a40517b` | 5m26s |
| 48453 Travis | 380,917 | 277,003 | 103,914 | 0 | `covers-v1` | `dd58e803` | 4m40s |

Bastrop, Caldwell, Hays and McLennan landed earlier under `intersection-v1`. The six do not
share a method version and TOTALS must record that per county rather than averaging it.

## The fix that made it possible

`ST_Intersection` has no prepared-geometry path in PostGIS; `ST_Covers` does. For a parcel
wholly inside a city the intersection area **is** the parcel's own area, so the substitution
is bit-identical rather than an approximation, and only true straddlers keep paying the
overlay. Measured 40.2x, 55.7x and 79.0x on three ranges with identical emit. The Williamson
corridor chunk that cost 145.2s cost 1.838s.

Second half: the county city set is decoded once per run into a TEMP table with GiST instead
of the statewide table being re-decoded every chunk under `NOT MATERIALIZED`. **That is this
operation's own L1 Harris pattern from 2026-08-13, re-applied.** The pattern was already
recorded and had not been carried across, which matters more than the novelty of the
`ST_Covers` asymmetry.

Cost-budget chunking is **dropped, not deferred**: a uniform 8,000-row page is sufficient now.

## Two planner predictions, both refuted

**The write-path falsifier.** Registered: per-chunk wall above ~20s means the write path is
the bottleneck. Nine Williamson chunks passed 20s so the number fired, and the same log
refutes the conclusion — chunks 6 and 16 wrote the same 8,000 rows in under 1.6s with *more*
in-city parcels. A 21x spread on identical row counts is not a write path. **The falsifier
registered a number rather than a mechanism**, and a number fires for reasons unrelated to
the claim.

**The Travis straddler forecast.** Registered: Travis is the regional worst case, 10 to 22
minutes, a slow fraction far above Williamson's 25 percent. Travis ran **1 of 48 chunks slow
in 4m40s** with 35 percent more rows. Travis *is* Austin, so if proximity to the
32,811-vertex polygon drove the Williamson outliers, Travis would be full of them.

What survives is two mechanisms where the planner had one: straddler cost is real and sets
the **floor** (Travis p50 3,535ms against Williamson's 1,762ms, roughly 2x across the whole
distribution), while Williamson's 20-25s outliers in `prop_id` block R574469 to R674292 are
something else, most likely a different record class.

## The seat queue

Hand-carry was the measured bottleneck: four cards compiled in an hour against an operator
who can carry one at a time, with thirty-plus CTX cards left. `_queue/` plus
`scripts/queue/` now hold a card board that **refuses** rather than dispatches. Decision
record `_decisions/2026-09-01_seat_queue_protocol.md`; protocol `_queue/README.md`; loop spec
`90_runbooks/seat_loop.md`.

Ten refusals, each answering a failure this operation actually had. `MAINTENANCE_WINDOW` and
`ALREADY_CLAIMED`-on-own-seat both come from mistakes made *in this session*. 40 assertions,
both directions on every refusal with an inverse, plus an explicit not-vacuous case.

Seats run on loops. `next-wake` paces them: 0 when claimable, the exact unblock time when
knowable, a tight poll when the card in front is **in flight**, the idle poll when nobody has
started it. `authorization: "operator"` stops a loop auto-starting a deploy by being the next
thing to tick.

## Planner errors this session, for the record

Four, all caught by a lane, a control, or the next measurement, none by re-reading a
conclusion:

1. Asserted run `fb490620` was still `started` without reading the store; the reaper had
   written `killed / execution-finished` at 04:20:29Z. Same class as the Bastrop license
   `1dda40f7` error earlier in the week.
2. Compiled `CTX-CONTAINMENT-RUN` without the Neon maintenance guard that the owner-backfill
   card had carried all along. Williamson launched at 04:52:09Z with the window eight minutes
   out and finished with 2m25s to spare, on luck.
3. The write-path falsifier above.
4. The Travis forecast above.

The maintenance guard is now arithmetic in `_queue/config.json` rather than prose in a card.

## Board at close

Six cards enqueued. `factory-merges`, `green-merge-sweep` and `a4-p3-build` claimable;
`ctx-totals` and `a3-f1-chunked` unblock at `06:00:00Z`; `owner-backfill` blocked on its
dependency, the operator go, and the window.

## Owed

**Operator:** authorize `owner-backfill` if it should run unattended, and move the Neon
maintenance window off Tuesday 05:00-06:00 UTC. The window cost two runs in one night and is
a console setting, not an engineering change.

**Next:** rebuild the Factory image from a committed SHA and add a git SHA to the job env.
The job carries `IMAGE_DIGEST` and no SHA of any kind, which is what let an image built from
an uncommitted tree stay invisible. A digest identifies an artifact; only a SHA ties it to a
source. Deferred deliberately until the campaign settled, because a rebuild produces an
unproven digest.
