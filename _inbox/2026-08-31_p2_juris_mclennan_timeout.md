---
id: 2026-08-31_p2_juris_mclennan_timeout
title: McLennan-scoped 01 cancelled at 180s
date: 2026-08-31
last_updated: 2026-08-31
status: filed
plan_row: F-01
snapshot: 01_mclennan.sql; decoded 48309; equality kept; 00+01 one psql session; short-lived URI cleared
---

# McLennan-scoped 01 cancelled

psql exit 3. Elapsed 263s. RO refuse armed. 01_mclennan.sql
line 353 `canceling statement due to statement timeout`.
Timeout not raised. Nothing adopted. Statewide TOTALS stays
UNMEASURED.

Per-county is a plan for two counties, not six. The boundary
sits between Bastrop (62,257, emit 129s) and McLennan
(114,255, cancel). The split-inside-a-county question arrives
here, not at Travis.

A parcel-only fit through Caldwell and Bastrop (about 1.37
ms/parcel, near-zero intercept) put McLennan near 156s, inside
the bound. It did not finish. Parcels alone do not predict
runtime.

Leading mechanism, not a close: cost is parcels ×
cities-in-that-county. Roster touching-counts
(`_inbox/2026-08-30_ctx_w3_collect_amendments.md`): Bastrop 5,
Caldwell 8, McLennan 21. Those are roster touches, not
`cities_ok` measured on this run. Waco may dominate
independently of the count.

Hays (116,421 parcels, 13 roster touches) is the
discriminator. Same 180s, equality kept. Do not pick the split
before that emit or cancel. Do not raise the timeout.

The 6 stay unnamed and do not gate.
