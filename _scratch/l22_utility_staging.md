# L22 utility who-serves territory staging

GROUND-TRUTH (2026-08-14T16:27:00Z): Lane CLOSED. Close `_inbox/2026-08-14_l22_close.json`. Geometry review verified 13/14 same-subject ID aliases; crosswalk was filed before deletion; exactly those 13 rows were deleted. `tceq-water-districts:1727` (AGOL ID 5857545, Montgomery County MUD 140) remains additive because equal-area overlap against existing ID 5857859 was only 0.262866, below the 0.80 threshold.

GROUND-TRUTH (2026-08-14T16:00:43Z successful stage run):
- Table `tx_utility_territory_staging` live on deployment Neon `neondb`.
- Final staged rows: PUCT water 3925, PUCT sewer 1455, HIFLD electric TX 139, TWDB PWS 4590, TCEQ additive 87.
- TWDB live count 4621; 31 empty-geometry source polygons excluded with positive determination (coordinates=[]).
- Coverage method: local Shapely intersects on `tx_county_boundary` GeoJSON; no PostGIS.
- Host fingerprint used: `ep-lucky-truth-apodo8hr-pooler.c-7.us-east-1.aws.neon.tech`.

LESSON: HIFLD/TWDB/HIFLD ObjectID spelling can differ between layer metadata and GeoJSON properties. TWDB advertises `ObjectId` and serializes `ObjectID`.

LESSON: TCEQ subject reconciliation by DISTRICT_ID or normalized NAME alone is insufficient against the existing `tx_special_district` load. The existing load comes from `gisweb.tceq.texas.gov/.../Public/WaterDistricts/MapServer/0` (2775 rows / 2734 IDs). The L10/L14 AGOL layer is a 2125-feature sibling. Name normalization found 14 alias candidates, but equal-area geometry overlap verified only 13 as the same subject.

DEAD-END: Treating the AGOL TCEQ_Water_Districts layer as a second full copy of the same subject set. Stage only subjects absent by both normalized ID and normalized NAME.

LESSON (from [Trace utility staging patterns](448ef053-e15d-4a80-ab04-cffa7428d640)): `tx_special_district` subjects are owned by hauska-engine ingest from `gisweb.tceq.texas.gov/.../Public/WaterDistricts/MapServer/0` (`tceq:${OBJECTID}`). Do not invent a competing special-district subject table. L22's `tx_utility_territory_staging` is the who-serves acquisition seam; TCEQ rows there must remain additive-only against the existing subject store. Comptroller JSON remains enrich-only.

GROUND-TRUTH CP2: First two full-source attempts rolled back cleanly (zero staged rows). Third attempt succeeded after ObjectID + empty-geometry fixes.