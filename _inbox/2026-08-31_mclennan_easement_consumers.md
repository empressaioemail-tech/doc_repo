---
id: 2026-08-31_mclennan_easement_consumers
title: McLennan easement consumer measurement (wipe not executed)
date: 2026-08-31
last_updated: 2026-08-31
status: filed
plan_row: F-08, P-85
snapshot: factory origin/main a7a8042; engine 80fb906; LDT df6ae2b; map 7772706
---

# McLennan easement consumers

File-side measurement for the CTX-HANDBACK ruling. Wipe not executed.

Runtime readers of `landing_easement_gis`: **zero**. Search was `git grep landing_easement_gis` on origin/main in Factory, engine, LDT, and hauska-map. Hits are the 0005a DDL seed and a test that parses the SQL file. `landing-import` `LANDING_TABLES` does not include the table.

The two `gis-layer` rows live in `migrations/0005a_landing_setback_easement.sql`:

- `mclennan-cad-easement-lines-9`, t3_count 44197
- `mclennan-cad-easement-text-10`, t3_count 16578

T3 counts are also in `_inbox/2026-08-05_T3_easement_source_recon.md` and `_catalog/t3_rails_registry_rows_proposed.json`.

Parallel live-REST paths (PE `liveEasementGisQuery.ts`, engine `constants.ts`) do not read the landing table. Unmerged `easement-gis-landing.mjs` on ctx-publish has zero job imports.

Wipe is consumer-safe and not executable on this card alone. A later card must co-change the 0005a INSERT, the CHECK whitelist, and the unmerged module, or a remigrate re-seeds the coverage claim.

```
leave_behind:
  - item: McLennan gis-layer to county-absence (keep T3 44197/16578 in the basis)
    owner: property seat
    plan_row: P-85
```
