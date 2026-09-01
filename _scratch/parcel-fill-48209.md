# parcel-fill-48209 scratch

GROUND-TRUTH 2026-09-01T18:49:30Z: Hays landing method=ring on PRODUCTION_NEONDB_URL/neondb is 54835 in-city + 61585 unincorporated = 116420. Sample-close unincorporated 61585 held.

GROUND-TRUTH 2026-09-01T18:51:10Z: cad_property latest-year market_value IS NOT NULL = 154313. That is the dispatch dollar-field headline, not the fill denominator.

GROUND-TRUTH 2026-09-01T18:50:20Z: unique cad prop_id 173050; living_gt0 93973; 93973/173050 = 0.54304 (dispatch livingArea 54.3%).

GROUND-TRUTH 2026-09-01T18:49:35Z: Factory parcel_record 48209 is 60 rows / 3120 cells / 52 cells each / absent-verified 0.

GROUND-TRUTH 2026-09-01T18:48:03Z: hauska-factory #57 MERGED mergeSha 648366df4da0f3cec3fb9ec54d225456ba470841. CI test+gate8 conclusion SUCCESS.

GROUND-TRUTH 2026-09-01T18:51Z: no factory-parcel-record-fill Cloud Run job in us-east4.

LESSON: Verification equality is containment (116420), never latest-year market present (154313) and never unique CAD keys (173050).

LESSON: Fill-card STEP 0 (b) cannot be satisfied by rebuilding the #57 image with ENGINE_SHA=22e71e1. The vendored factory module is the constructor.

DEAD-END: Executing current parcel-record-fill --county=48209 --apply on Cloud Run would write another sample on 52 rails and fail the card's own equality check.

DEAD-END: Laptop county fill. Card violation. Refused.

OPEN: First fill lane must vendor engine 22e71e1c18ec6bcefe590b97d36093ae3849a4fc (65 rails, NA list frozen), add a real county-wide paged walk, add LAPTOP_WRITE_FROZEN, deploy factory-parcel-record-fill. Then this card can execute.

OPEN: Do not rebuild the store token.
