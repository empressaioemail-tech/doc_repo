# nfhl statewide load — 2026-08-09

## GROUND-TRUTH
- 2026-08-09: `tx_fema_nfhl_flood_zone` LIVE **198178** rows on DEPLOYMENT_DATABASE_URL (direct Neon, not pooler). Idempotency net 0.
- Projection extents degrees: lng [-106.41,-93.51] lat [25.84,35.62]; 0 outside envelope; 0 metre-like.

## LESSON
- Unbounded `featureQueue` in GeoJSONSeq stdout bridge OOMs on bulk layers even with 16 GB heap. Fix is pause/resume at queue high/low water, and stop draining further lines from the current buffer once high-water is hit.
- Dry-run insert count counts stream yields; apply can be lower due to within-batch `zoneRowId` dedupe + ON CONFLICT upsert of cross-batch dupes (198240 → 198180 ops → 198178 unique).

## DEAD-END
- Raising `--max-old-space-size` alone does not fix this shape.

## OPEN
- PR #403 needs merge (typecheck follow-up pushed). Writers / MCP / flood-hazard-fact consumption still unblocked only for the table itself.
