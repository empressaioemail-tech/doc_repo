---
id: 2026-07-21_san_marcos_zoning_fix_note
title: San Marcos zoning — CA mis-point fixed (WDLL 6)
status: closed
date: 2026-07-21
applies_to: legacy-design-tools (cad-ingest zoning stamp)
related: [2026-07-21_property_explorer_v1_sprint_WDLL, 2026-07-21_property_explorer_v1_sprint_STATUS]
---

# San Marcos zoning fix (WDLL 6)

Root cause: `san-marcos-tx` registry pointed at San Marcos, California GIS (`maps.san-marcos.net`), not Texas. Not a CRS bug.

Fix: LDT PR #324 merged (`8c88434`) → `smgis.sanmarcostx.gov` … MapServer/6, fields `ZONECODE` / `ZONINGDISTRICT`.

Evidence:
- Live stamp: 18,900 / 117,427 Hays parcels matched (35 district codes).
- Tier-1 re-bake county 48209 completed (~441s).
- Live facets: `48209:104255` and `48209:46957` return `zoning.district: "SF-6"` via property-explorer proxy.

Envelope still declined until `san-marcos-tx` setback `districts[]` is populated (separate WDLL 5 debt).
