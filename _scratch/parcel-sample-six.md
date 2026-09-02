# parcel-sample-six scratch

GROUND-TRUTH 2026-09-01T18:28Z: Sample fill run `5b9d3fc9-ffe5-414c-920a-7c134a68640c` wrote Factory `parcel_record`. This run 241 records / 12532 cells. Store after leftovers from an earlier apply: 302 records / 15704 cells. `absent-verified` = 0.

GROUND-TRUTH 2026-09-01T18:07Z: `landing_parcel_jurisdiction` is on PRODUCTION_NEONDB_URL / neondb, not FACTORY_DATABASE_URL. Unincorporated 370289 = 50264+14361+61585+32422+103914+107743.

GROUND-TRUTH 2026-09-01T18:28Z: `48021:34137` livingAreaSqft is `unaccounted` after CAD ingest. CAD has no living area. Fill did not invent one.

GROUND-TRUTH 2026-09-01T18:28Z: Caldwell `48055:103436` improvementValue is kind=value value="0" (node-pg numeric-as-string). Not absent.

LESSON: instantiateParcelRecord stamps `nowIso` onto countyFips vintage. Two passes without a pinned vintage fail idempotency even when CAD is unchanged.

LESSON: place_layer_snapshots has no usable lookup path for a 40-key ANY within 8s. Do not seq-scan it to build a sample.

DEAD-END: DISTINCT ON cad_property for living_null / $0 / snapshot LIKE '48491:%' — hung past 5 minutes. Page landing by prop_id and load CAD for that page only.

DEAD-END: mergeUnique(targeted-first) on Bastrop filled 50 living-null unincorporated rows and missed the in-city floor.

OPEN: Full-county fill cards must keep paged CAD loads. Williamson snapshot presence is unmeasured. Landing prop_id `PRIVATE ROAD` on 48491 is a live key.

OPEN: Planner: merge factory `feat/parcel-record-fill` when CI is green. Do not rebuild the store token.
