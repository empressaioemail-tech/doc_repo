# Mission — R5B: the five stamp-gap cities, operator-authorized scope expansion

OPERATOR AUTHORIZATION 2026-09-02 (in-session to the planner): expand the R5 zoning
scope past the stamp-gap boundary. Run the proven R5 job (the exact job, not a
redesign) against Smithville, Luling, Martindale, Woodcreek, Lakeway — their layers
already sit in tx_zoning_district_staging (91/140/17/3165/749 features per the
zoning-ingest close).

Scope change: remove exactly those five city keys from STAMP_GAP_EXCLUDED_CITY_KEYS
(factory PR, own branch, test asserting the exclusion list's remaining content, green
CI, digest-matched deploy per the shared-tag race addenda). Execute per city,
city-polygon-keyed as R5 proved (bleed is a named defect), Cloud Run only, run rows,
idempotent. Verify per city: matched/total against landing in-city counts for that
city, residue honest, zero cross-boundary stamps. The 49 no-layer cities remain OUT —
this authorization covers exactly five cities and nothing else.

Close: _inbox/2026-09-02_parcel-r5b-stampgap_close.json.
