---
id: 2026-08-31_p2_juris_06_ab_and_ceiling
title: What the 06 cancel does not establish; 180s is the session, not the work
date: 2026-08-31
last_updated: 2026-08-31
status: filed
plan_row: F-01
snapshot: operator ruling before scout; Hays 06 cancel `_inbox/2026-08-31_p2_juris_hays_06_timeout.md`
---

# On the record before scout

Operator ruling 2026-08-31, carried into the scout session. Not a card amendment.

## What the 06 cancel eliminates, and what it does not

06 was the cheap shape: bbox reach and npoints, no parcel ring decode. It still consumed the full 180s ceiling. That narrows where cost can live, two ways, and only one is a real elimination.

**A.** The dominant cost is not ring decoding. 01 decodes rings, 06 does not, both exceed the ceiling on Hays. If the same underlying cost is present in both, ring decode is not it.

**B.** 06 introduced its own distinct cost. `BBOX_REACH_NPOINTS` computes per-city reach over 13 cities and 116,421 parcels, a cross product unrelated to whatever kills 01.

A and B are indistinguishable from the 06 run. Under B, the elimination in A is void. **A is not established.** Treating it as established is one observation away from a fifth fit in a different costume.

A prior city-side probe already completed (`_inbox/2026-08-31_p2_juris_cities_ok_npoints.md`: Hays 13 cities, npoints_sum 43205, Austin 32811). That names the city vertex budget. It does not name 06's parcel×city product, and it does not license A. Licensed scout measures the parcel DISTINCT / text-range side, not that product. If scout does not produce a mechanism that separates A from B, stop. Do not take a seventh heavy scan.

## The thing that matters more than the cost driver

Six heavy scans have run on this card. Two counties completed, both small (Caldwell 24,989 / 78s, Bastrop 62,257 / 129s). Every Hays attempt has cancelled at every scope tried: full 01, a 30k slice, and bbox-only 06.

Williamson is 282,570 parcels (2.4× Hays). Travis is 380,918 (3.3× Hays). A clean Hays path through scout / 05_range / 07 still does not reach a six-county split. The two largest counties are ahead. The instrument already fails on the third-largest.

The 180s ceiling is a property of an interactive psql session. It is not a property of a chunked, resumable, ledgered Cloud Run job, which is how every other Factory writer processes a county. The P2 job template merged as Factory #40 `dfe1e247`. The board's own line is that P2-JURIS persist waits on it.

This is not "raise the timeout." The card forbids that because it papers over cost with patience. It is the conformant design: chunk, ledger, resume, one run row per chunk. Under it the cost driver becomes a throughput number, and P3 gets a per-parcel disposition rather than an aggregate that was only ever a scoping figure.

Card is not amended mid-flight. Scout ran 2026-08-31T15:37Z wall 2147 ms. Bounds 100002 / 159378, verified 40000. No mechanism. Seventh scan not taken. Containment moves to the job template.

See `_inbox/2026-08-31_p2_juris_scout_emit.md`.
