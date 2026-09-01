---
id: 2026-08-27_f16-f18-probe-county-composition
title: Amendment (a) — county composition of the 100,000 rate-probe rows
date: 2026-08-27
last_updated: 2026-08-27
status: recorded
plan_row: F-20
run: e8823e11-3237-420f-b23b-01ff213ca04a
execution: factory-conformant-kjzhx
---

# Probe row county composition (amendment a)

Instrument: Neon Factory `withered-surf-26870298` `write_stage_atoms`; Neon `hauska_mcp` `fancy-fire-06136146` `atoms` where `entity_type = 'cad-parcel-roll'` and `body->>'shape' = 'conformant-v1'`. Snapshot 2026-08-27T12:56Z.

`write_stage_atoms` by `county_fips`: 48021 = 100000. No other county.

`hauska_mcp` conformant-v1 by `body->>'countyFips'` / `jurisdiction_tenant`: 48021 = 100000. No other county.

Every sampled probe body carries `rateProbe = true` and `shape = conformant-v1`.

Cleanup run keyed on `e8823e11`: not run. Amendment trigger is "unless all are 48021". They are.

F-10 must still not count these as the Bastrop CAD roll. Exclusion is `body->>'rateProbe' = 'true'` (or `body->>'shape' = 'conformant-v1'` and no landing alias), not county. Landing 48021 is 77799. Old-shape `cad-parcel-roll` `entity_id LIKE '48021%'` is 77073.
