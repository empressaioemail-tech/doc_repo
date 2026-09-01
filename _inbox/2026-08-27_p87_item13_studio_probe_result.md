---
id: 2026-08-27_p87_item13_studio_probe_result
title: Item 13 probe result — Studio get_smart_site 48021:34137
date: 2026-08-27
status: filed
plan_row: P-87
wdll_item: 13
gold_parcel: 48021:34137
serving_mcp: smartsite-mcp-00016-mim
serving_cortex: b53a0571 (latest shift 2026-08-27T23:15Z)
baked_at: 2026-08-04
grade: met
---

# Item 13 — operator probe result

**Account:** Studio (signed-in Connect path).  
**Parcel:** `48021:34137` (908 Pine St, Bastrop City TX).  
**Tool:** `get_smart_site` via Claude custom connector.

## Sections (MCP brief)

| Section | Disposition | Summary |
| --- | --- | --- |
| Zoning | present | SF-1; Bastrop Zoned_Parcels / ZoneTypeClass; live ArcGIS citation |
| Land use | present · citations-degraded | A1 single-family; CAD roll vintage data-export-01.14.2026; source string, no resolvable citation URL |
| Flood | present · citations-degraded | Zone X outside SFHA; subtype 0.2% annual chance (shaded X); NFHL_48_20260101 evaluated 2026-08-11; no BFE |
| Setbacks-envelope | **refused** | `declined-in-bake` / `atom_path_pending`; `supersededBy: buildable-envelope`; agent refused to invent distances or polygon |

## WDLL item 13 grade: **met**

- Parcel id and bake date match gold fixture.
- Setbacks no longer silent null — typed refusal + agentGuidance behavior (Claude explicitly declined to estimate).
- Flood uses live atom read (not retired tile-centre NFHL); honest shaded-X framing.
- No thinner catalog than workbench R1 family for this parcel.

## Leave-behind (not item-13 blockers)

1. **citationsDegraded** on land-use and flood — claims carry source/vintage strings but no http citation URLs. Flag for customer-facing exports; not an MCP parity failure.
2. **atom_path_pending** on envelope decline — likely clears on rebake when buildable-envelope atom path lands; not a source-data gap.
3. Workbench side-by-side column not recorded in this artifact; operator narrative sufficient for Option B gate.

## Unblocks

**P-88 item 21** — Claude connector directory filing may proceed.
