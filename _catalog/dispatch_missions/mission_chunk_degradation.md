# Mission — why do Williamson's chunks stretch? Deep dive, one hour.

## The phenomenon

Execution `factory-p2-juris-hzkqk`, run `fb490620`, Williamson 48491, on image
`sha256:9e417502`. Started `2026-09-01T01:51:18Z`.

**Seven chunks of 8,000 rows in ~1h56m. 56,000 of 282,570. And the chunks are
stretching: early ones 1–2 minutes, recent ones 13–28 minutes.** `unresolved` is 0 on
every chunk. Split so far 35,980 in-city and 20,020 unincorporated. Last chunk write
`03:42:04Z`.

At that pace it needs 8–10 more hours against a `max_duration_s` of 21600 and a
maintenance restart at 05:00 UTC. **It will not finish.** That is already decided and
is not your problem. Your problem is *why*.

## Why this matters beyond this run

Travis is 380,918 parcels and is next. If this degradation is a property of the county
rather than of this run, Travis is worse and the current design cannot complete it
either. **The degradation is the finding, not the failure.** The 57P01 connection
problem is fixed; this is a different and more interesting one.

## The comparison set, so you do not re-derive it

| county | rows | chunks | wall | per chunk |
|---|---|---|---|---|
| 48055 Caldwell | 24,988 | 4 | 1m14s | ~19s |
| 48021 Bastrop | 62,256 | 8 | 1m58s | ~15s |
| 48209 Hays | 116,420 | 15 | 14m16s | ~57s |
| 48309 McLennan | 114,254 | ~14 | 29m58s | ~128s |
| 48491 Williamson | 282,570 | 7 so far | 1h56m+ | **~16 min, rising** |

Williamson's per-chunk cost is roughly **8–15x Hays** on the same page size. Hays chunk
wall times were 52.0 56.3 51.1 62.5 61.0 58.1 53.7 51.6 40.2 42.1 92.9 82.4 49.9 48.0
36.4 — noisy but **flat**, not rising. Williamson is the first county to show a trend.

## Read this prior work first. Do not re-derive it.

`_inbox/2026-08-31_p2_juris_partition_record.md` and the memory
`postgis-zone-major-not-point-major`. Four cost mechanisms were already proposed on this
card and **all four lost**:

- **parcels-linear** — predicted McLennan at 156s; it cancelled
- **city-count** — Hays 13 cities vs McLennan 21; both cancelled
- **chunk-linear** — confounded by a planner flip, re-opened, never settled
- **Austin vertex budget** — a real straddle, but only **3.56%** of Hays parcels reach
  its bbox, so vertex count was not per-parcel cost *for Hays*

Do not re-run those. But note the fourth was rejected **for Hays specifically**, on the
grounds that few parcels reached Austin's bbox. Williamson's geography is different:
Round Rock, Georgetown, Cedar Park, Leander, Hutto and Taylor, 17 roster touches, and
64% of its parcels in-city. A mechanism that fails on a county where 3.56% of parcels
reach one big polygon is not thereby refuted on a county where most parcels sit inside
one.

Also known: `cities_ok` npoints measured Hays at 9.29x Bastrop's vertices, Austin alone
at 32,811. And the standing PostGIS finding is that this work is **vertex-volume
dominated, not row-count dominated** — grid indexing failed for exactly that reason.

## The data you need is on the store that is NOT busy

**`run_events` for run `fb490620` lives on the hauska-factory control store**
(`withered-surf-26870298`), a different project and a different compute from cortex-prod.
Reading it does not contend with the running job. Each chunk record should carry its
range, row count and wall time.

**DO NOT read cortex-prod while `hzkqk` is running.** No `landing_parcel_jurisdiction`
scans, no city-polygon queries, no `txgio_parcel`. If a question can only be answered
there, mark it PENDING-STORE-READ and say what you would run.

**Do not cancel or interfere with `hzkqk`.** It is producing your data.

## The leading hypothesis, and it is yours to kill

**Cost tracks in-city work, not row count.** An in-city parcel requires ring containment
against a city polygon; an unincorporated one is refused cheaply once it misses every
bbox. So a chunk of 8,000 mostly-in-city parcels near Round Rock is a different unit of
work from 8,000 rural parcels, and the design treats them as the same.

**Test it directly:** correlate per-chunk `wallMs` against per-chunk in-city count. If
the slow chunks are the in-city-heavy ones, the mechanism is named.

**Pre-register the falsifier before you look:** if slow chunks look like fast chunks on
in-city ratio, this hypothesis is dead and the cause is something accumulating in the
process — connection state, memory, a growing in-memory structure, a query plan that
degrades as the landing table fills. Say so plainly rather than salvaging it.

**And state a second mechanism regardless**, with why you rejected it. Candidates worth
considering rather than assuming: `prop_id` ranges correlating with geography so later
chunks are systematically denser; the landing table growing under its own writes; a plan
flip partway through; per-chunk overhead that is constant while useful work shrinks.

**Do not fit a curve through seven points.** Four mechanisms already died on this card
doing exactly that. A trend in seven samples is a reason to look for a mechanism, not a
law.

## What a good answer looks like

The mechanism, named, with the measurement that supports it and the second mechanism
you rejected and why.

**Whether it predicts Travis.** Travis is 380,918 parcels and Austin's polygon is the
32,811-vertex one already measured. If your mechanism is right, say what it predicts for
Travis *before* anyone runs it.

**The fix shape.** If cost tracks in-city work, a uniform 8,000-row page is the wrong
unit and the answer is chunking by estimated cost rather than by row count — but say
what you would actually use as the cost proxy, and how it is computed cheaply.

**And a note on cross-run resume.** Completed chunks are keyed by `run.id`, so a failed
run loses all its work; `fb490620`'s 56,000 rows will not be licensed. If chunking is
being redesigned anyway, say whether resume across runs belongs in the same change.

## Timing

There is a decision at roughly **04:50 UTC** on whether to terminate `hzkqk` cleanly
before the 05:00 maintenance restart. **Report by 04:40 if you can**, even if the answer
is partial. A partial answer in time is worth more than a complete one after the
decision.

## Do not

- Do not read cortex-prod. Do not cancel or interfere with `hzkqk`.
- Do not re-run the four dead mechanisms.
- Do not fit a curve through seven points and call it a law.
- Do not propose raising `max_duration_s` or the page size without a mechanism.
- Do not write to any store. This is a read-and-diagnose card.
- Do not touch any repository other than a registered read-only checkout.

## Close

Report the mechanism with its measurement, the rejected alternative, the Travis
prediction, the fix shape and its cost proxy. Anything you could not establish is
UNMEASURED or PENDING-STORE-READ, never a guess. Declare snapshot in the first output.
Subagents do not commit.
