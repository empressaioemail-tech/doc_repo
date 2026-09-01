# zoning-band1 scratch (property, 2026-09-01)

## GROUND-TRUTH
- 2026-09-01T16:56:59.055Z extend: claim and cortex-prod token both expire 2026-09-01T18:56:59.055Z. Old token was 17:44:18Z against claim 18:14:18Z (store_ttl 60 vs lease 90). Planner fixed config for new claims; this lane refreshed itself.
- Claimed 2026-09-01T16:44:18.776Z. LDT P:/tmp/legacy-design-tools-zoning-band1 feat/zoning-band1 91e39991.
- Watcher aborted ~3 min, never fired. next-wake is the sanctioned pace. Do not file-watch tokens.

## LESSON (local, no store)
- ZONING_LAYERS on feat/zoning-band1 @ 91e39991 already has leander-tx and taylor-tx. Missing: smithville-tx, luling-tx, martindale-tx, woodcreek-tx, lakeway-tx, robinson-tx.
- Stamp CLI is county-scoped PIP against one city layer. That is the bleed shape: a Waco run writes waco-tx onto any McLennan centroid that hits a Waco polygon. Robinson needs its own layer AND a stamp that will not leave Waco on Robinson in-city parcels.
- Dry-run without DATABASE_URL fetches+indexes only. Dry-run with DATABASE_URL would-stamp against live parcels and writes nothing. Need the token for the second form.
- Leading-token contract: stamp RAW codeField, do not transform.

## OPEN
- Re-claim after token release or 17:38Z expiry. Do not read cortex-prod until claimed.
- Race: dollar-fields also refused STORE_TOKEN_HELD at 16:38:12Z. Third in line.
- Eight cities: Smithville, Luling, Martindale, Woodcreek, Lakeway, Robinson, Leander 48491, Taylor. NO ACQUISITION.
