---
id: 2026-08-24_p76_planner_review
title: P-76 planner review of city-limits serve
status: active
date: 2026-08-24
plan_row: P-76
tree: P:/tmp/ldt-lane3-p76
---

# P-76 planner review

Read [P-76](116f5622-f2a7-4605-afda-153f7b65e879) CP1 and the isolated-tree write path. Re-ran:

- `lib/cad-ingest` `src/__tests__/boundary.test.ts` — 10 passed
- `artifacts/api-server` `cityLimitsFactRead.test.ts` + route contract — 7 passed

## What held

Empty index was unincorporated; it is now unmeasured. Serve is `cityLimitsFact` on `GET /api/brokerage/v1/place/node/:id/facets`. Census is `SELECT geo_id LIMIT 1` (table populated) vs bbox-filtered candidates (miss). A 2-mile offset from the Austin fixture is unincorporated with `etjStatus: unresolved`, not ETJ. No atom family. No `--apply`. No fabricated buffer in the containment helper.

## Leftover

Live `tx_city_boundary` count and CLI apply. Live gold `48021:34137` and a named rural control after deploy. PE inspect chip. Full ETJ when a statewide source exists. No commit.

If every bbox-hit row has unparseable geometry, the reader currently treats that as unincorporated. Same class as a silent skip. Not this close.
