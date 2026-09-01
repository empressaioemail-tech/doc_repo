---
id: 2026-08-31_p2_juris_hays_timeout
title: Hays-scoped 01 cancelled at 180s
date: 2026-08-31
last_updated: 2026-08-31
status: filed
plan_row: F-01
snapshot: 01_hays.sql; decoded 48209; equality kept; 00+01 one psql session; short-lived URI cleared
---

# Hays-scoped 01 cancelled

psql exit 3. Elapsed 217s. RO refuse armed. 01_hays.sql line 353
`canceling statement due to statement timeout`. Timeout not
raised. Nothing adopted. Statewide TOTALS stays UNMEASURED.

Hays was the discriminator: 116,421 parcels against 13 roster
touches, vs McLennan 114,255 against 21. If city-count drove
the McLennan cancel, Hays should have emitted. It cancelled.
City-count is retired. The boundary is parcels, between
Bastrop 62,257 (emit 129s) and Hays/McLennan ~114k–116k
(cancel).

The 1.37 ms/parcel fit through the two emits is also retired.
It would have cleared both cancels. Runtime is superlinear in
parcels.

Do not pick a chunk size from this row. Do not raise the
timeout. Do not spend runs on Travis or Williamson. The 6 stay
unnamed and do not gate.
