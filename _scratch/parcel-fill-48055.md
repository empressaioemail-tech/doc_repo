# parcel-fill-48055 scratch

## GROUND-TRUTH
- 2026-09-01T18:47:38Z landing 48055 method=ring 10627 in-city + 14361 unincorporated = 24988 on PRODUCTION_NEONDB_URL / neondb.
- 2026-09-01T18:47:38Z cad_property latest-year 48055 improvement_value=0 is 24552; market present 48588; latest parcels 48649.
- 2026-09-01T18:47:38Z Factory parcel_record 48055 is 60 rows / 3120 cells / 52 cells each / absent-verified 0.
- 2026-09-01T18:46Z no factory-parcel-record-fill Cloud Run job in us-east4.
- 2026-09-01T18:49Z hauska-factory #57 still OPEN at b4fdcfb. CI test+gate8 conclusion SUCCESS. mergeState CLEAN.

## LESSON
- STEP 0 (b) cannot be an ARG-only rebuild. instantiateParcelRecord runs the vendored factory JS. Pin ENGINE_SHA >= 22e71e1 and recompile the module or the image still writes 52 rails.
- Verify equality is containment 24988, never the dispatch dollar-field headline 48588.

## DEAD-END
- Cloud Run execute of current parcel-record-fill --county=48055 --apply. Still a ~50-row sample on 52 rails. Fails the card's own check.
- Laptop county fill. Card violation.

## OPEN
- First fill lane / planner: merge #57, vendor 22e71e1 (65 rails, NA list frozen), county-wide paged walk, LAPTOP_WRITE_FROZEN, deploy factory-parcel-record-fill.
- Do not rebuild the store token.
