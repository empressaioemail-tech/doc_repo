---
title: P-25 Wave 4 announce - Tarrant 48439 CAMA bulk
date: 2026-08-25
plan_row: P-25
county_fips: 48439
ldt_snapshot: 72cffc8bf3c5660a0d7b756468073859f2583142
status: void-off-path
supersededBy: _inbox/2026-08-25_p25_repair_or_skip.md
---

# Announce: Tarrant / TAD PropertyData(Delimited).ZIP

Announced at: 2026-08-25T13:16:49Z UTC

| Field | Value |
|---|---|
| County | 48439 Tarrant (TAD) |
| Source | https://www.tad.org/content/data-download/PropertyData(Delimited).ZIP |
| Loader | pnpm --filter @workspace/cad-ingest cad-ingest -- --county=48439 (open-fetch) |
| LDT worktree | P:/tmp/ldt-p25 @ 72cffc8bf3c5660a0d7b756468073859f2583142 |
| P-78 merge | #477 merged (cad_property merge authority) |
| Target store | cortex-prod neondb (CORTEX_DATABASE_URL) |

Expected malformed skips (empty gis_link). No atoms --apply on this card.
