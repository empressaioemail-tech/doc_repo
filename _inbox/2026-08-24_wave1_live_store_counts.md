---
title: Wave 1 live store counts
date: 2026-08-24
status: measured
---

# Wave 1 live store counts

Snapshot: 2026-08-25T01:58:19.796Z against doc_repo main ee9b17d. URL from gcloud secret legacy-design-tools-prod/DEPLOYMENT_DATABASE_URL (env was unset). URL not printed. Queries were COUNT / COUNT DISTINCT / information_schema only.

Both target tables exist. tx_county_boundary also exists.

| table | live | prior close | match |
| --- | --- | --- | --- |
| tx_city_boundary count(*) | 1222 | ss-w15 city_boundary_rows=1222 (2026-08-19) | exact |
| tx_city_boundary count(distinct geo_id) | 1222 | same table PK | exact |
| tx_county_boundary count(*) | 254 | Texas county set (L22 used 254 GeoJSON rows) | exact |
| tx_utility_territory_staging count(*) | 10196 | L22 final_source_counts sum 10196 (2026-08-14) | exact |

Staging by service_kind: electric 139, sewer 1455, water 8515, water-district 87. There is no source column; the real column is source_key (5 distinct). Split by source_key matches L22 exactly: puct-water-ccn 3925, puct-sewer-ccn 1455, hifld-electric-retail 139, twdb-pws 4590, tceq-water-districts 87.

Falsifier: these counts match the 2026-08-14/19 closes exactly. They may be an unchanged store rather than fresh ingest truth. The timestamp is the only new fact.

Empty-index lie risk (P-76): WDLL item 1 says an empty polygon index is unmeasured, not unincorporated. A zero-row tx_city_boundary that still returns unincorporated would lie. Live count is 1222, so the index is not empty today. That does not retire the code-path risk. If the table is later truncated, P-76 must refuse or mark unmeasured rather than emit statewide unincorporated.

No product PRs. No --apply. No commit.
