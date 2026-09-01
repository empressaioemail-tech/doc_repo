---
id: 2026-08-24_field_mapping_pass
title: Lane 3 field-mapping pass — feasibility A3 / P-58
status: filed
date: 2026-08-24
plan_row: P-58
wdll_cite: feasibility A3 (_inbox/2026-08-24_feasibility_v1_plan_DRAFT.md)
related:
  - _inbox/2026-08-24_lane3_field_mapping_brief.md
  - _inbox/2026-08-24_write_path_serve_audit.md
  - _inbox/2026-08-22_parcel_public_facts_gap_matrix.md
  - _inbox/2026-08-24_feasibility_v1_plan_DRAFT.md
  - _decisions/2026-08-24_feasibility_v1_rulings_and_data_capture_program.md
  - _inbox/2026-08-23_setback_geometry_unification_WDLL.md
  - _inbox/2026-08-23_setback_geometry_unification_close.json
owner: Lane 3 mapping agent; planner commits
---

# Field-mapping pass (feasibility A3, P-58)

A3: no new ingest until gap-matrix fields land mapped. This file is that map. It does not harvest, does not `--apply`, and does not design the ETJ or who-serves adapters.

P-58 is the code-read matrix plus gap backlog (`_inbox/2026-08-22_atom_full_surface_WDLL.md` items 3 and 5). The serve half already landed as `_inbox/2026-08-24_write_path_serve_audit.md` (F4: two tables on gold). This pass names store column or atom entity, PE bind, and derive-or-honest-absent for every feasibility-v1 inspect and report field.

## Snapshot

| Surface | Claim | This session |
| --- | --- | --- |
| doc_repo | `476cca2` | `476cca2ce42692bf17e808d49527e4dd033d458f` on `main` (`docs(P-60): setback perf/viz + commercial polish WDLL and close`) |
| Seat / checkout | integration `P:/doc_repo` | Mapping only. No product write. No store query. |
| Serve audit cited | write-path probe `2026-08-24T15:23:00.244Z` | `_inbox/2026-08-24_write_path_serve_audit.md`. Store column on every gold row there is **U**. |
| Store hop (`cad_property`, `hauska_mcp.atoms`, setback-rule bodies) | not queried | **Unmeasured.** Not zero. |
| Retrieval atom-chain JSON | not read | Atom column is BFF-inferred (`atom*`) from the serve audit, not a store read. |

Canvases were not opened. Product repos were not written.

## Method

Read first: Lane 3 brief, write-path serve audit (F4), gap matrix, feasibility v1 plan field sections (3 through 12 and section 6 ingest order), A3/A5 rulings, setback unification WDLL and close.

No SQL. No PostGIS. No full-table scan. A store hop this session cannot query stays unmeasured.

Legend for the mapping tables:

- **Store / atom**: durable home named by the gap matrix or a prior close. Population counts from those docs are dated claims, not re-measured here.
- **PE bind**: the inspect facet key or assembler read named in a file this session read. If the assembler is unbuilt, that is stated.
- **Derive or honest-absent**: what the surface does when the home is empty, refused, or two writers disagree.
- **U** = unmeasured this session.

## Gold 25/5/25 vs 30/10/30: two writers, recommend one

Serve audit F4 on `48021:34137` and `48021:34073`: card/BFF prints **F 25 / S 5 / R 25**; live envelope POST prints **F 30 / S 10 / R 30**. Raw JSON is `front_ft: 25` vs `front_ft: 30`. Not a formatter. `applyLiveDeriveToFacets` copies geometry and area only. Two independently derived numbers for one field, no agreement check on the card.

A third PE table is **not** a writer for Bastrop SF-1. Serve audit: `resolveCodifiedSetbacksForStamp("bastrop-city-tx", "SF-1")` is explicitly null (per-parcel-only). Only two writers exist.

| Writer | Module / path | Number on gold | What binds it |
| --- | --- | --- | --- |
| **Atom-chain `setback-rule`** | Retrieval chain → PE `adaptAtomChainToBakedFacets` → `deriveBakedCardModel` when `facetCoverage.envelope === true` and `envelope.status !== "declined"`. Disclosure on the wire: "Atom-chain setback scalars; geometry from live derive". | **25/5/25** | Inspect card scalars. `facets.envelope.setbacks.front_ft` / `side_ft` / `rear_ft`. |
| **BDC ordinance via `resolveAuthoritativeSetbacks`** | LDT `brokeragePlaceBuildableEnvelope` live POST. Cortex ranks codified ordinance over GIS per-parcel over atom-chain, then `effectiveDate`. Bastrop path is BDC (`bastrop-development-code.json` / BDC router, LDT #466). `setbackSource=codified-ordinance` on the unification close. | **30/10/30** | Map wedge, site-plan export, live derive body. |

Whether the 25/5/25 atom is a live layer-23 record or a stale B3 rule that `isStaleBastropCitySetbackRule` failed to drop is **unmeasured**. The retrieval body was not read. Code allows both (serve audit "What is unmeasured").

**Recommended single writer: BDC ordinance via `resolveAuthoritativeSetbacks` (30/10/30 on gold SF-1).**

Reasons, in order:

1. Operator ruling 2026-08-23 (unification WDLL): draw from the most recent authoritative source, ranked by authority tier then effective date. Codified ordinance (BDC Ord. 2026-06) outranks GIS per-parcel and atom-chain. No Bastrop-only layer-23 preference.
2. Unification close gold-parity item: derive 30/10/30 matches BDC, not layer-23. `setbackSource=codified-ordinance`.
3. The wedge and export already use this writer. The card leftover is the A3 defect. One field, one writer, or fail closed.
4. Pflugerville is already one writer: card and city-complete derive both 25/7.5/20. Bastrop is the split.

What this recommendation is not: an ingest plan, an atom rewrite, or a harvest. The next product cut (not this file) is: card scalars bind the same resolver the wedge uses, or the card refuses the field when the two numbers disagree. A meaning-shaped check compares atom-chain `front_ft` against live-derive `front_ft`. Gold would fail that check today. That fail is the desired behavior until the card stops serving the leftover writer.

Second mechanism that would look like "pick 30/10/30": the city's daily-use GIS card is 25/5/25 and BDC is wrong. Rejected for this mapping because the 2026-08-23 ruling already ranked ordinance over GIS, the live derive already cites BDC, and the 2026-07-29 red flag on 1010 Jefferson (city map 25/5/25 vs PE 15-not-specified) is a different parcel and a different defect class. Reopening BDC vs city-map numbers is a ground-truth card, not this pass.

## Inspect card fields

Free inspect per the locked ladder and feasibility section 2. PE bind is the facets BFF (`GET /api/spine/property-atoms/:id/facets`) through `deriveBakedCardModel` / sheet projection unless noted. Gold values are from the serve audit probe, not a store read.

| Field | Store column or atom entity | PE bind | Derive or honest-absent |
| --- | --- | --- | --- |
| APN / parcel id | `parcel-node` atom; `cad_property.prop_id` on the 15-county roll; `txgio_parcel` identity on 196 counties. Store row **U**. | Facets parcel id (`34137` on gold BFF; live derive `48021:34137`). Map: PMTiles / mesh id. | Honest refuse if the node is missing. Click path can still resolve from a point when boundary is refused (Simsbrook). |
| Situs | `cad_property.situs_*` (15 roll); StratMap situs line on 196; `txgio_address` on 6 counties. Gap matrix row 7. Store **U**. | Facets situs string. Gold: `908 PINE , BASTROP, TX 78602`. Travis gold-neighbor: `, TX` or `STREET , TX 78660`. | **P-74:** a CAD sentinel (`, TX`, comma-tail) is absent. Fall through to `txgio_parcel.situs_address`. Do not copy Find. Do not invent a city. Envelope POST city token is a different hop. |
| County | Parcel-node FIPS prefix; roll county. Store **U**. | Facets county. Gold: Bastrop. | Fail closed if FIPS cannot be parsed from the binding. No default county. |
| Land use | `land-use-fact` atom; `cad_property.property_use_code` on the 15-county roll. Gap matrix row 11. Store **U**. | `landUseFact` (`state=present`, `source=land-use-fact` on gold per P-61). Paint `inspect-landuse`. Bake `facets.baseFacts.landUse.source=cad-roll` is retiredStore. | Honest absent / verdict when no atom. Do not cite cad-roll as the land-use source. |
| Zoning district | `zoning-fact` atom; city GIS staging (not a statewide store). Gap matrix row 20. Store **U**. | Facets zoning stamp + jurisdiction key. Gold: SF-1 `bastrop-city-tx`. Wainee: null, `coverage false`. | Honest absent `no-zoning-stamp` (Wainee: "no setback table covers this parcel's district"). GIS overlay is not the atom. Unincorporated no-zoning is P-63 `not-applicable`, not a fabricated district. |
| Acreage | `cad_property.land_acres` (16.7% filled in the 15-county roll per gap matrix); `cad-parcel-roll`; ring shoelace on inspect. Gap matrix row 12. Store **U**. | Facets acreage. Gold: 0.3827 ac. | Two-source check (tax-roll acres vs ring shoelace) is the feasibility section 4 derive. If only one source exists, print that source with provenance. Do not emit 0 when the column is null. Null acres is absent, not zero. |
| Living area | `cad_property.living_area_sqft` (CAMA bulk, not REST). Gap matrix row 13. Store **U**. | Facets living area. Gold: 2800 present. Travis 280239: absent-verified (CAD row, structural fields null). | Honest absent-verified when the CAD row exists and the structural field is null. `lookup-failed` on StratMap-tier metros with no CAMA load (P-63). Never a fabricated 0 sqft. |
| Setbacks F/S/R | `setback-rule` atom (card writer); BDC / ordinance table via `resolveAuthoritativeSetbacks` (wedge writer). Gap matrix row 21. Store bodies **U**. | Card: `facets.envelope.setbacks.front_ft` / `side_ft` / `rear_ft`. Wedge: live POST `setbacks.*`. | **Single writer = BDC `resolveAuthoritativeSetbacks`.** Card today binds atom-chain (25/5/25 on gold). Honest absent when no stamp (Wainee). Envelope 404 `no-district` while card scalars print is a wedge fail, not an honest setback absence. |
| Buildable area / % | Derived `buildable-envelope` (inspect-only; geometry from live derive, not depth-warm geojson). Gap matrix row 22. Store **U**. | Facets `buildableAreaPct` (null on gold until live augment), `facetGeo` false. Live POST: status `ok` + ring, or `consumed` / `geometry-validation-failed` via `emptyKind`. | Null pct on facets is **unmeasured pending live augment**, not zero. Honest consumed vs validation-failed. 0% plus a visible house is a later honesty line (feasibility section 12), gated on footprint, not a number to invent. |
| Envelope wedge geometry | Not on facets. Live POST `labelEdges+derive` only (unification item 1). Store **U**. | `applyLiveDeriveToFacets` copies geometry/area onto the sheet. Map: `envelope-overlay.ts` amber inset or dashed consume. | Paint live ring or paint nothing with honest decline. Never client uniform inset. Never stale promoted geojson. |
| Flood zone | `flood-hazard-fact` atom (FEMA NFHL). Gap matrix row 24. Store **U**. | `floodHazardFact` (gold present; Zone X on earlier S9 close). Paint `inspect-flood`. Map NFHL GIS is not the atom. | Honest absent / verdict when no intersection. Do not present the GIS layer as the atom. |
| Special district | `special-district-fact` atom. Gap matrix row 32. Store **U**. | `specialDistrictFact`. Gold: absent (`entityId=48021:34137:sd:outside`, outside-tceq). Map `mud-pid` dormant. | Honest non-intersection (gold). Present on a hit parcel. `mud-pid` GIS is not the atom. |
| Pipeline | `rrc-pipeline-fact` atom. Gap matrix row 31. Store **U**. | `pipelineFact` (gold present). Map `texas-rrc` dormant. | Honest absent when no intersection. Diameter/commodity not in body (gap matrix body-field deficit). Do not invent them. |
| Well | `well-fact` atom. Gap matrix row 30. Store **U**. | Well facet refused on gold (atom-miss / refuse). | Honest refuse / atom-miss. Gold empty is a known open, not a measured zero-well county. |
| Building footprint | `building-footprint` atom. Staging is `tx_building_footprint` ~10.67M / 254 counties (P-09). **L20 291,475 / 86 cities is zoning, not this family.** Gold atom-miss. Gap matrix row 33. | Footprint facet refused on gold. | Honest refuse until P-09 drain+P-51 serve. Heavy. Not Wave 1. |
| Property boundary / front edge | `property-boundary-edge` atom. Gap matrix row 23. Store **U**. | Boundary present on gold; refused on Wainee and Simsbrook. | Honest refuse. Click/address may still resolve via point. Deep-link without rings is "no boundary or coordinate on file". |
| Owner name | `owner-fact` atom; `cad_property.owner_name` (98.4% in 15-county roll). Gap matrix row 5. Store **U**. | Owner facet refused on anonymous. Identified session only (P-58 / locked Studio owner data). | Anonymous: hidden / refuse. Identified: present or honest absent. Never on the map. |
| Hover / highlight | Not a fact field. Three geometries (P-60e class). | Hover `hits[0]` on interactive overlays; click PMTiles fill; post-seal `sheet.geometry.rings`. | Paint **U** this session. Mapping note only: not a feasibility field. Lane 1 leftover. |

## Feasibility report fields (beyond the free card)

Assembler is unbuilt (parked). Planned read path: engine `listPropertyAtomsByParcelNodeId()` plus persisted artifacts, not MCP property-atom-chain (feasibility section 5). PE export bind when it ships: `pe-site-plan-export.ts?report=feasibility`. Until then PE bind is "none; assembler unbuilt" except where the inspect card already exposes the field.

| Field | Feasibility section | Store column or atom entity | PE / assembler bind | Derive or honest-absent |
| --- | --- | --- | --- | --- |
| City of record / postal city | 3 | Situs parse + geocode. Not a dedicated store. | Inspect situs; report location block. | Print the situs city token when present. Travis city-less situs stays city-unresolved, not a guessed Pflugerville. |
| ETJ / city limits | 3 | Gap matrix row 35: TxGIO City_Boundaries (1,225 cities source). **Store 0. Atom none.** | None. | **No adapter yet.** Next card: **ETJ adapter card** (feasibility section 6 item 1; A5 ruling 3; Track C). v1 ships three-state honest absence: in city limits / in ETJ / unresolved. Do not design the adapter here. |
| Legal description | 4 | `cad_property.legal_description` (~98% in 15-county roll); `cad-parcel-roll`. StratMap `LEGAL_DESC` discarded at ingest. Gap matrix row 8. Store **U**. | Bake-only on inspect today. Assembler reads cad-parcel-roll. | Honest absent outside the 15-county roll. Do not reconstruct from a discarded StratMap field in this pass. |
| Exemptions | 4 | `cad_property.exemption_codes` (15 roll). Detail is CAMA. Gap matrix row 9. Store **U**. | Assembler / Studio owner block. | Partial codes on roll; honest absent for CAMA detail until the CAMA depth card. |
| Land / improvement / market / assessed value | 4 | `cad_property.land_value`, `improvement_value`, `market_value`, `assessed_value` (15 roll); `cad-parcel-roll`. Gap matrix row 10. Store **U**. | Assembler section 4. | Present on 15-county roll; honest absent on 239 counties with no roll atom. Studio-gated with owner data. |
| School district | 4 | CAD REST `SCHOOL` on 147/176 inventoried counties. **Not persisted.** Gap matrix row 17. Store **U** (absence of a column is the gap-matrix claim; live count unmeasured). | None. | Honest absent until CAMA/CAD depth (Phase 2 P0 item 7 / feasibility section 6 item 4). No harvest plan here. |
| Deed / transfer date | 4 | CAD REST `DEED_DATE` on 148/176. **Not persisted.** Gap matrix row 15. | None. | Honest absent until the same CAMA/CAD depth card. |
| Deed instrument pointer | 4 adjacent | `DEED_SEQ` / `VOLUME` / `PAGE` on 147–150/176. **Not persisted.** Gap matrix row 16. | None. | Honest absent. Same depth card, not a separate harvest. |
| Owner mailing | 4 | `cad_property.owner_mailing_address` (one line, 15 roll); structured `ADDR_*` not persisted. Gap matrix row 6. | Identified / Studio only. | Honest absent when no roll. Structured lines stay unmapped pending the CAMA depth card. |
| Absentee flag | 4 | No store column. | Assembler derive. | **Derive** when both mailing and situs are present and differ. If either side is absent, the flag is unmeasured, not false. |
| Two-source lot area | 4 | Roll `land_acres` vs inspect ring shoelace. | Assembler derive. | **Derive** when both sources exist. One source: print that source. Zero sources: honest absent. This is the meaning-shaped check the plan names. |
| Year built | 4 adjacent | `cad_property.year_built` (CAMA bulk; 10.2% in 15-county roll; metros 0%). Gap matrix row 14. Hidden on inspect. Store **U**. | None on inspect. Assembler may cite cad-parcel-roll when present. | Honest absent. Never a default year. |
| Plat identity (MAP_ID, BLOCK, TRACT, ABS_SUBDV) | 4 adjacent | CAD REST 142–151/176. **No store. No atom.** Gap matrix row 4. | None. | Honest absent. Lands on cad-parcel-roll when the CAMA/harvest depth card runs. No harvest plan here. |
| GEO_ID | join, not a report line | `txgio_parcel.geo_id` only; **not on `cad_property`**. Gap matrix row 3. Store **U**. | Join only. | Unmeasured on the roll. Do not treat missing GEO_ID as zero parcels. |
| FIRM panel id + effective date | 6 | Inside persisted `json-flood-drainage-study`, not a separate atom field. NFHL `STUDY_TYP` / `DEPTH` not in `flood-hazard-fact` body. | Read the persisted flood JSON. Do not re-run DEM. | Honest absent if no study artifact. "Panel currency" caveat **derives** when effective date is old. |
| Flood and drainage sheets | 6 | Persisted study artifact. | ReportsTool flood PDF (Solo). | Append via SheetNumbering. Honest absent if no artifact. |
| Terrain elevation range / contours | 9 | `parcel-terrain-model` atoms (72 cited in gap matrix; not re-counted). | Assembler summary; full exports Studio. | Honest absent when no terrain atom. Paid export stays Studio. |
| Who-serves (water / sewer / electric / PWS) | 10 | L22 staging table `tx_utility_territory_staging` (PUCT water CCN, PUCT sewer CCN, HIFLD electric, TWDB PWS, TCEQ). **Not a served atom. Not a rail.** Gap matrix has no who-serves atom family. | None. | **No adapter yet** (no served read path). Next card: **Who-serves promotion card** (feasibility section 6 item 2; A5 ruling 4; Track C; satisfies A-012.4). v1 ships the fixed honest-absence sentence, or territory holders plus SERVICE-LETTER-REQUIRED after that card. Mains are not a rail. Do not design the promotion here. |
| HOA / recorded restrictions | 11 | **Nowhere in the 38-row gap matrix.** No store. | Smart Files mount slot only. | Honest "not searched". Next card is the HOA recorded-docs **scoping** card (A2 / ruling 5), not a build. Synthesis only over a user-mounted doc, cite-or-decline. |
| Existing structures / footprint honesty | 12 | Same `building-footprint` as inspect. | Assembler section 12. | Honest refuse until gold serve. Non-conforming line (0% buildable + visible house) **derives** only after footprint is present; do not emit it on atom-miss. |
| Data quality / superseded runs | 13 | Persisted artifacts per parcel. No new store. | Assembler run registry. | Structural: failed sibling run named superseded, never appended as independent evidence. |
| Open items table | 14 | No store. | Assembler generate from typed absences of sections 3–12. | Each typed absence emits one prioritized row. Zero absences emit the "no open items" state, never an empty table. ETJ unresolved is one of those rows until the ETJ adapter card lands. |

Sales / MLS fields do not enter this map (gap matrix row 38; public-record-only standing decision).

## What stayed unmeasured

Store hop this session did not run. These are unmeasured, not zero, not absent:

- `cad_property` row presence and column fill for any mapped field, including gold living area 2800 and Travis structural nulls as store facts (those values are BFF-inferred).
- `hauska_mcp.atoms` bodies for `setback-rule`, `zoning-fact`, `land-use-fact`, `flood-hazard-fact`, `special-district-fact`, `rrc-pipeline-fact`, `well-fact`, `building-footprint`, `property-boundary-edge`, `owner-fact`, `parcel-terrain-model`, `cad-parcel-roll`.
- Whether gold 25/5/25 is a live layer-23 `setback-rule` or a stale B3 rule that `isStaleBastropCitySetbackRule` failed to drop.
- Retrieval atom-chain JSON (DID, edition, `sourceAdapter`).
- Cortex serving-revision traffic JSON (declared `00569-maw` on the serve audit, not re-read here).
- Browser paint: hover swap, post-seal rings, amber fill pixels.
- Coords-only envelope POST for Simsbrook.
- Owner identified-session path (anonymous refuse only).
- `tx_utility_territory_staging` live counts (L22 close numbers are dated 2026-08-14; not re-queried).
- TxGIO City_Boundaries row counts in any store we own (gap matrix says store 0; that claim was not re-probed).

`buildableAreaPct` null on gold facets remains unmeasured pending live augment, not zero. Wainee setbacks remain absent (typed). Gold living area 2800 remains present on the BFF, store unmeasured.

## What this file does not do

No harvest plan. No statewide CAD REST ingest ranking beyond naming the already-listed CAMA depth card as the home for school district, deed date, plat, and GEO_ID-on-roll. No ETJ adapter design. No who-serves promotion design. No product PR. No `--apply`.

## leave_behind

```
leave_behind:
  - item: Bastrop card still binds atom-chain setback-rule 25/5/25 while wedge binds BDC resolveAuthoritativeSetbacks 30/10/30
    owner: property
    plan_row: P-58 / feasibility A3
  - item: ETJ adapter card named, not started (gap matrix row 35)
    owner: property
    plan_row: feasibility section 6 item 1 / A5 ruling 3
  - item: Who-serves promotion card named, not started (L22 staging → served read path)
    owner: property
    plan_row: feasibility section 6 item 2 / A5 ruling 4
```
