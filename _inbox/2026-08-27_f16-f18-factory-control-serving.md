---
id: 2026-08-27_f16-f18-factory-control-serving
title: Amendment (c) — factory-control serving revision for item 3
date: 2026-08-27
last_updated: 2026-08-27
status: recorded
plan_row: F-16
---

# factory-control serving (item 3 grade surface)

Snapshot 2026-08-27T13:01Z. Job of record digest `hauska-factory@sha256:2af32780ce93b810eccb33c017007086c7099f4c561173cd6299ebd850c45d61`.

Canary revision `factory-control-00004-jin` Ready 2026-08-27T13:00:06Z. Image on the revision (not the tag): the digest above. Traffic then shifted so serving is `00004-jin` at 100 percent. Latest ready equals that revision.

Serving URL `https://factory-control-h7gvu7rgcq-uk.a.run.app` smoked after the shift:

- unauthenticated `/queues` returns 401
- authenticated `/queues` returns owner `property-seat-resolution`, depth 0, throughput `decisions-per-run`
- authenticated `/gates` returns `bastrop-cad-promote` with owner `property-seat-resolution` and `throughputPerHour` 500
- `/screens` names Queues and Gates `ready`

Depth 0 is honest: `5j4mc` has not persisted the adjudication queue. Item 3 grades the screens on this serving revision, not the tree.
