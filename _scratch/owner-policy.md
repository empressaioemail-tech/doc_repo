# owner-policy scratch

## GROUND-TRUTH (2026-08-31, code read, no store query)
- cad-parcel-roll atoms stamped public-free with ownerName when joinPassedOwnerMatchGate true (cad-parcel-roll-writer.ts:150-208).
- joinPassedOwnerMatchGate true = county NOT on crosswalk/landuse hold (plan-county-cad-parcel-roll.ts:193).
- Twin bake never reads ownerName (nodeFacetBakeTier1Conformant.ts:133-149); assertNoOwnerKey on bake output.
- sanitizeNodeFacetPayload strips owner-ish keys at Twin serve only (brokerageNodeFacets.ts:217-246,564-574).
- MCP get_atom / chain / trace / export return full public-free bodies — NO field strip (tools.ts, access-policy.ts).
- owner-fact is public-paid; Twin ownerFact gated Studio|Team.

## LESSON
accessPolicy gates whole atoms, not fields. Owner on public-free cad-parcel-roll is an MCP catalog leak class; Twin stripper does not cover it.

## GROUND-TRUTH (2026-09-01T00:12Z hauska_mcp)
Per-county cad-parcel-roll owner coverage, entity_id FIPS range. Store present.

| FIPS | n_roll | ownerName nonempty | mail nonempty |
|---|---:|---:|---:|
| 48021 | 77078 | 77078 | 77048 |
| 48055 | 48384 | 48384 | 48170 |
| 48209 | 265881 | 29 | 0 |
| 48309 | 114280 | 113384 | 114254 |
| 48453 | 492851 | 3 | 0 |
| 48491 | 319487 | 7 | 0 |

MCP catalog is serving owner on public-free roll today in 48021/48055/48309. Path open and empty in 48209/48453/48491.

## OPEN
- Brief cad:property free owner from cad_property is parallel surface — out of roll atom scope but same product policy tension.
