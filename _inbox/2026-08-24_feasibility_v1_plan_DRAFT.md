---
id: 2026-08-24_feasibility_v1_plan_DRAFT
title: Feasibility Study v1 — report spec and assembler plan (DRAFT)
date: 2026-08-24
status: operator-approved WDLL 2026-08-24 (with amendments A1-A5 below; see _decisions/2026-08-24_feasibility_v1_rulings_and_data_capture_program.md)
owner: planner (read-only research subagent)
snapshot: doc_repo main; hauska-map main @ 75ac6f4; LDT cortex serving cortex-api-00562-siv (post-P60b); property STATE 2026-08-23/24
target_artifact: P:/tmp/1936_Whitetail_Ridge_Dr_Feasibility_Study.pdf (Val, 2026-08-17, 57 sheets)
sources:
  - _inbox/2026-08-12_RPT1_existing_report_surface_inventory.md
  - _inbox/2026-08-10_smartsite_pricing_and_gtm_LOCKED.md
  - _inbox/2026-08-22_parcel_public_facts_gap_matrix.md
  - _inbox/2026-08-23_phase2_data_ingest_program.md
  - _inbox/2026-08-12_L10_utility_probe_close.json (via OPS-16 A-014)
  - session transcript 1df5be3c-7104-4a8f-8aa7-06cde46da9a1
related:
  - _inbox/2026-08-24_track_coverage_map_DRAFT.md
---

# Feasibility Study v1 — from today's exports to the composed package

## WDLL amendments (operator rulings 2026-08-24; decision record filed)

- **A1 — Tier ruling made (satisfies WDLL item 2).** Section 4 ratified as proposed: composed package = Studio; $15/30d unlock = reduced package minus owner data and CAD-tier content; share carries stored artifacts unchanged.
- **A2 — HOA/recorded documents confirmed separate.** Section 11 ships exactly as specced (honest "not searched" + Smart Files mount). The recorded-docs program starts as a scoping card and is scoped HOLISTICALLY: all recorded instrument classes together, including mineral/oil-and-gas instruments, captured and organized right the first time. It probably ships as its own product surface.
- **A3 — Parcel facts deficit mapped before ingest.** Any new ingest wave first completes the field-mapping pass against the gap matrix so fields land mapped correctly on arrival; no repeat of the current cleanup debt. This extends section 6 with a mapping-completeness precondition.
- **A4 — Data capture split by effort tier; backfill is a 24/7 program.** Report-value ranking in section 6 stands as *why the report wants the data*. Execution order is the write-path game plan (P-73..P-80). Footprint drain is heavy (10.67M), not low-hanging. City limits is not ETJ. CAMA is not bundled with REST harvest.
- **A5 — ETJ adapter card and who-serves promotion approved** (rulings 3 and 4 in the decision record). Ingest items 1 and 2 in section 6 are unblocked.

## 1. The target, inventoried

Val's Whitetail Ridge package (cover: "57 sheets total", generated 2026-08-17) is a composed document, not a bigger site plan. Its structure:

| # | Section | Sheets | Made by |
| --- | --- | --- | --- |
| 1 | Feasibility narrative | 1-5 | human synthesis |
| 2 | Smart Site site plan | 6-9 | product |
| 3 | Smart Site X-ray, failed run | 10 | product (included, then explicitly superseded by narrative sheet 3) |
| 4 | Flood and drainage | 11-12 | product |
| 5 | County GIS reference (tax record + flood map screenshots) | 13-14 | human capture |
| 6 | HOA records index | 15 | human research |
| 7 | Management Certificate (recorded) | 16-29 | county record, hand-pulled |
| 8 | CC&R Declaration | 30-57 | county record, hand-pulled |

What the human layer added that the product does not produce, by narrative sheet:

- **Sheet 1, jurisdiction:** the Kempner 76539 vs Killeen 76549 postal conflict, and that ETJ status "should be confirmed before determining which municipality's ETJ, if any, applies."
- **Sheet 2, ownership and tax:** owner names, absentee flag (mailing address differs from situs), legal description, subdivision, school district (Lampasas ISD), agricultural exemption, 2025 market value $200,200 land-only, and a two-source lot-area reconciliation (436,036 sqft tax record vs 438,568 sqft site plan, "consistent within normal GIS-vs-survey rounding").
- **Sheet 3, data quality:** the failed X-ray "should not be read as a second, independent 'no data available' finding... Treat the site plan sheets as the operative source and the X-ray as a failed, superseded run."
- **Sheet 4, open items:** a prioritized table (High: city/ETJ; Medium: water and sewer well/septic vs CCN, FEMA panel currency; Low: segment table QA) and a plain-language bottom line.
- **Sheet 5, HOA synthesis:** POA identity and contacts, $200 transfer fee, $250/yr assessment, 10.01-acre minimum tract, single-family only, 1,000 sqft minimum residence, manufactured homes prohibited, ACC approval with $250 fee and a 30-day deemed-approved window, 25ft front/rear and 15ft side utility easements, and the resolution that "no road node attaches" means a private POA road, not a data failure.

That last class matters most: Val used recorded documents to convert two of the product's honest absences (street frontage, zoning) into explained findings.

## 2. What a customer can get today, per tier

Reality per RPT1 (verified 2026-08-12 against origin/main; export surface unchanged since, per the PE api directory read 2026-08-24: no dossier function exists, the dossier rides `pe-site-plan-export.ts?kind=dossier`):

| Artifact | Where | Gate in code today |
| --- | --- | --- |
| PDF site plan, DXF, IFC | ReportsTool | property unlock ($15/30d) or subscription |
| Flood and drainage PDF (2 sheets, D8 study) | ReportsTool | property unlock or subscription |
| Terrain GLB / IFC4 / DXF surface / DXF contours | ReportsTool | top tier only |
| Property dossier PDF (cover + verdict + brief facts + AI summary + owner notes + appended renumbered site-plan set) | dossier detail view | property entitlement |
| Property brief ("Research this", cited sections, Grok-first with deterministic rules-v1 fallback per CLAUDE.md) | BriefTool | 402 paywall; 503 "spine report_run integration pending" |
| Inspect card facets (zoning, setbacks, envelope, flood, land use, acreage) | free map | free per locked ladder |

The locked ladder (`_inbox/2026-08-10_smartsite_pricing_and_gtm_LOCKED.md`, quoted): Free = map, inspect card, save, 3 chat messages, share. Solo $49 = "The X-ray, the Flood and Drainage study, unlimited AI chat, unlimited properties." Studio $129 = "everything in Solo plus the professional deliverables: site plan CAD (DXF, IFC), terrain export, and owner data." Team $299 for 10 seats. Unlock $15 for 30 days. RPT1 flags that the feasibility study's tier "is an unmade pricing call" — this plan proposes a placement in section 4 but does not invent one as settled.

The gap between today and Val's package, stated as one sentence: the product emits every machine sheet Val used, but nothing composes them, nothing narrates them, nothing arbitrates between runs, and the jurisdiction / utility / HOA / ownership-context sections have no data path at all or only a staged one.

## 3. Section-by-section spec

Column key. **Status**: have = sealed fact sheet or persisted artifact serves it now (post-P60b the envelope numbers are trustworthy; the false-empty gate is gone and the conservation check is verified by violation); partial = exists with coverage or depth caveats; need-ingest = gated on a named Phase 2 item. **Tier**: placement under the locked ladder, marked (proposed) where the call is not operator-made. **Assembly**: det = deterministic from sealed sheet / persisted artifacts; LLM = narrative generation over cited facts, Grok-first with deterministic fallback (the shipped Property Brief generator precedent), cite-or-decline, never uncited prose.

| # | Section (Val analogue) | Status | Source detail | Tier | Assembly |
| --- | --- | --- | --- | --- | --- |
| 1 | Cover + contents manifest (Val cover) | have | dossier.ts precedent: cover, verdict line, manifest | rides package | det |
| 2 | Executive verdict + bottom line (Val sheet 4 bottom) | have | verdict layer serves live (P-63/P-66 closes); bottom-line prose from sealed sheet | rides package | det verdict + LLM prose |
| 3 | Location and jurisdiction (Val sheet 1) | partial → need-ingest | county/situs/city have; **ETJ = gap matrix row 35: TxGIO City_Boundaries 1,225 cities, store 0, no adapter**. v1 ships the section with an honest three-state absence (in city limits / in ETJ / unresolved) exactly as Val flagged it | rides package | det |
| 4 | Parcel and ownership (Val sheet 2) | partial | owner-fact (identified tier), cad-parcel-roll: legal, exemptions, values on the 15 roll counties; school district and deed date are P0 backfill rows (gap matrix rows 15/17); absentee flag derivable (mailing vs situs). Two-source lot-area reconciliation is computable (tax-roll acres vs ring shoelace) and is exactly the meaning-shaped check ENFORCEMENT.md prefers | **owner data is Studio** (locked, operator ruling 2026-08-10) | det |
| 5 | Zoning, setbacks, buildable envelope (Val sheet 2 mid) | **have, now trustworthy** | sealed ParcelFactSheet: zoning stamp, setback scalars with provenance, envelope derived/consumed/not-derived with emptyKind split (P-60b); honest-absence chips already standard (Val's own sheets show "UNAVAILABLE · no setback rule on file") | free on card; sheets ride package | det |
| 6 | Flood and drainage (Val sheets 11-12 + sheet 2 flood) | have | flood-hazard-fact (FEMA NFHL) + persisted `json-flood-drainage-study`; RPT1: read the persisted JSON, do not re-run the DEM. FIRM panel id + effective date are in the study; "panel currency" caveat generated when effective date is old (Val's Medium open item, automatable) | Solo carries the flood study (locked) | det |
| 7 | Special districts / MUD (no Val analogue; our addition) | have | special-district-fact serves on gold; honest non-intersection | rides package | det |
| 8 | Wells and pipelines (no Val analogue; our addition) | partial | rrc-pipeline-fact serves gold; well-fact atom-miss on gold parcel (P-60 close open item); honest absence until drained | rides package | det |
| 9 | Terrain and site conditions (Val sheet 2 elevation) | have | parcel-terrain-model: elevation range, contours; full terrain exports stay Studio (locked) | summary in package; exports Studio | det |
| 10 | Utilities who-serves (Val sheet 4 Medium item) | need-ingest | L22 staged territory polygons (PUCT water/sewer CCN, HIFLD electric, TWDB PWS, TCEQ); P-26 CLOSED probe-only with verdict (A-014): who-serves territory + SERVICE-LETTER-REQUIRED residual, mains are not a rail. Operator ruled utility lines belong in feasibility with honest "service letter required" (2026-08-12 session, cited in RPT1 era transcript). Gated on promoting staged territory to a served read path, a post-gate consideration per A-012 ruling 4 | rides package (proposed) | det + fixed residual sentence |
| 11 | HOA and recorded restrictions (Val sheets 5, 15-57) | need-ingest | **nowhere in the 38-row gap matrix; no card exists.** v1 ships the section as: recorded-restrictions status = not searched (fixed honest sentence), plus a Smart Files mount slot so a user-supplied CC&R can be indexed and cited. Full auto-pull of county recorded docs is its own scoped program, not this card | rides package (proposed) | det shell; LLM synthesis only over user-mounted docs, cite-or-decline |
| 12 | Existing structures / footprint (no Val analogue; her parcel was vacant) | need-ingest | building-footprint: 291,475 rows / 86 cities staged (L20), ML-fallback default (T3/ADR-029), zero site-plan consumers (RPT1: "confirmed absent"), gold atom-miss. Also the honesty upgrade the setback saga exposed: 0% buildable + visible house should read "existing structures may be non-conforming" | rides package | det |
| 13 | Data quality and superseded runs (Val sheet 3) | have (logic to build) | run registry per parcel from persisted artifacts; a failed sibling run is suppressed or marked superseded, never appended as independent evidence. Val had to write this by hand; the assembler does it structurally | rides package | det |
| 14 | Open items and what's missing (Val sheet 4) | have (logic to build) | generated from the typed absences of sections 3-12: each absent/unresolved fact emits a priority row with the action sentence from a fixed vocabulary (extends the eleven-sentence REASON map) | rides package | det |
| 15 | Appended sheet sets: site plan + flood (Val sheets 6-12) | have | append via the SheetNumbering seam with unified "Sheet N of TOTAL"; `countSitePlanSheets()`, never assume 3 (RPT1 warning) | per-artifact gates above | det |
| 16 | County GIS reference (Val sheets 13-14) | superseded by design | Val screenshotted the county portal because her tax/flood facts had no citations; ours carry provenance rows natively. No screenshot section. Tax-record depth gaps route to CAMA P0, **not MLS: gap matrix row 38 excludes Sales/MLS as "out of scope (not public record)" and the standing decision is uniform public-record only. The transcript's "MLS where licensed" suggestion is overruled by docs; noted as the discrepancy** | n/a | n/a |

## 4. Tier placement (proposed, flagged as an open operator call)

Nothing here invents prices or moves locked contents. The locked ladder fixes: flood study = Solo; CAD, terrain, owner data = Studio; inspect card = Free; unlock = $15/30 days on one property. RPT1 records that the feasibility package's placement is an unmade call. Proposal for the operator to ratify or amend:

1. **The composed Feasibility Study PDF is a Studio deliverable.** It is definitionally "a deliverable you hand to someone else," the locked ladder's own Studio test, and it embeds owner data (Studio-gated) in section 4.
2. **A $15/30d unlocked property gets sections minus owner data and minus appended CAD-tier content**, consistent with the unlock already carrying the site-plan PDF and flood PDF today (RPT1 gate table). If that residual package reads as too much value for $15, the alternative is Solo; that is a judgment call, not derivable from canon.
3. **Share carries whatever the sharer stored** including a generated feasibility PDF, per the locked full-fidelity share ruling. No new gating.

## 5. Assembly architecture (all reuse, one new leg)

1. **Engine-side sibling assembler, cloned from `dossier.ts`.** RPT1: "copy dossier.ts. It is the reference implementation of exactly this document shape." Tokens only from `template-tokens.ts`; primitives from the `render.ts` export seam; page numbers only through `buildFinePrint` + SheetNumbering (a self-stamped page number double-numbers the composed doc); honest absence via chips + the REASON sentence map; no new color or type token (the operator's red line, RPT1 restyle list).
2. **Data access engine-side** via `listPropertyAtomsByParcelNodeId()` and persisted artifacts, not the MCP property-atom-chain: the chain exposes 3 of 16 entity types (RPT1's largest blocker) and widening it is substrate work this card must not silently absorb. If the chain is widened later, the assembler swaps read paths without spec change.
3. **Narrative sections** (2, 11) use the shipped Grok-first-with-deterministic-fallback pattern from the Property Brief generator. Every narrative sentence binds to a cited fact on the sealed sheet or a mounted document; ungrounded sentences are refused, and the deterministic fallback produces the verdict-plus-open-items skeleton when the LLM path is unavailable. Fail closed: a narrative that cannot cite does not ship a paragraph, it ships the deterministic skeleton.
4. **PE surface**: fold into `pe-site-plan-export.ts` as a third query-param leg (`?report=feasibility`), per the Vercel function-cap constraint (RPT1; Hobby stays per the 2026-08-17 decision). ReportsTool gains a Feasibility section cloned from `SitePlanExportSection.tsx` with its honest 401/402/422/502 handling.
5. **No report-run ledger is inherited.** The `report_run` table is engagement-keyed plan-review state, zero MCP references (RPT1 adversarial note). v1 persists the artifact in the existing `parcel-terrain-model` artifacts map pattern; a run ledger, if wanted, is a named follow-up, not an assumption.

## 6. Phase-2 ingest items, mapped to the sections they gate

**Sequencing superseded 2026-08-24.** Report-value order below is why a section wants the data. Execution order is `_inbox/2026-08-24_parcel_facts_write_path_game_plan.md` (write-path dependency). Do not dispatch from this table.

| Report value | Item | Gates section | Write-path row | Note |
| --- | --- | --- | --- | --- |
| 1 | City-limits PIP (incorporated / unincorporated). ETJ stays unresolved | 3 partial | P-76 | Not a full ETJ adapter. No statewide ETJ layer. |
| 2 | Who-serves read over L22 staging | 10 | P-75 | Serve-time PIP. No atoms. |
| 3 | Situs sentinel bind | 3/4 titles | P-74 | Already in store (`txgio_parcel`). Not ingest. |
| 4 | CAMA Dallas/Tarrant living area + year built | 4 depth | P-25 after P-73+P-78 | Not bundled with deed/school. Those are P-79. |
| 5 | REST harvest (deed, school, plat, GEO_ID) | 4 | P-79 | Writer absent today. |
| 6 | Footprint atom drain | 12 | P-09 (heavy) | Staging is `tx_building_footprint` ~10.67M rows, not L20 291k zoning. |
| 7 | HOA recorded-docs | 11 | scoping card | Decision 5. Honest shell in v1. |
| 8 | Private-road classification | 3/14 | rides P-17 | COVER parked (A-022). |

MLS/tax-record fields Val used that we lack: school district, deed date, exemption detail land on CAMA/CAD rows above; sales-comp and listing fields are excluded by canon (row 38) and do not enter this spec.

## 7. WDLL acceptance items — v1 assembler card (execution order, dependencies named, no timeframes)

Per `.cursor/rules/wdll-practice.mdc` this card needs operator approval before build; these are the numbered items a dispatch would cite. Observable end state: a signed-in, correctly-tiered user on smartsite.cloud downloads a composed Feasibility Study PDF for a warm parcel, whose every section is either populated with cited facts or an explicit honest absence, whose appended sheets are renumbered as one document, and whose narrative contains no uncited sentence.

1. **Plan row exists.** OPS-16 amendment row for the feasibility assembler is filed and the dispatch compiles against it (`node scripts/dispatch.mjs`). Depends on: operator approval of this WDLL. Check: dispatch compiles; canon-gate accepts.
2. **Tier ruling recorded.** Operator ratifies or amends section 4 placement; recorded as a decision file. Depends on: 1. Check: decision in `_decisions/` naming the package tier and the unlock residual.
3. **FeasibilityModel + section registry (engine).** A model composed from the sealed ParcelFactSheet, persisted artifacts (site-plan set, flood JSON/PDF), and atom reads via `listPropertyAtomsByParcelNodeId()`; every section input carries an explicit honest-absence variant (matching `SitePlanModel`'s pattern). Depends on: 1. Check: unit-composable on a fixture with zero live calls; absent inputs produce typed absences, never defaults (fail-closed).
4. **Assembler emits the composed PDF** (sections 1-9, 13-15 of this spec) in SHEET_STANDARD_v1 language: tokens only, buildFinePrint numbering, chips + REASON sentences for absences, one accent. Depends on: 3. Check: existing eleven styling regression tests pass unchanged; new assembler tests decode emitted bytes; a fixture with `countSitePlanSheets() > 3` numbers correctly.
5. **Superseded-run arbitration.** Given two runs of the same kind for one parcel where one failed, the composed document appends only the operative run and emits the data-quality note; the failed run is named as superseded. Verified by violation: a fixture that force-appends a failed run fails the test. Depends on: 3.
6. **Open-items table generation.** Every typed absence in the model emits exactly one prioritized row with a fixed-vocabulary action sentence; zero absences emits the "no open items" state, never an empty table. Depends on: 3, 5. Check: Whitetail-class fixture (no zoning, no setback rule, ETJ unresolved) reproduces the shape of Val's sheet 4.
7. **Narrative generator, grounded.** Verdict/bottom-line prose (section 2) via Grok-first with deterministic fallback; every sentence cites a model fact; the citation check is verified by violation (an injected uncited sentence fails); LLM unavailability yields the deterministic skeleton, not an error page. Depends on: 3. Check: fixture run with LLM disabled still emits a complete document.
8. **Utilities section, honest either way.** If the who-serves read path exists (ingest item 2), the section states the territory holders + the SERVICE-LETTER-REQUIRED residual; if not, the fixed honest-absence sentence. The assembler must not block on the ingest decision. Depends on: 3; consumes ingest item 2 when it lands.
9. **HOA section shell + Smart Files mount.** Section renders "not searched" honestly with the mount affordance; when a user-mounted recorded doc exists, the synthesis is cite-or-decline over that document only. Depends on: 3, 7. Check: no mounted doc yields the fixed sentence; a mounted CC&R fixture yields cited synthesis; an uncited synthesis sentence fails (same violation harness as 7).
10. **PE leg + gate.** `pe-site-plan-export.ts?report=feasibility` + ReportsTool section with honest 401/402/422/502 states; entitlement enforced server-side per the ruling in item 2; share view carries the stored artifact per the locked share ruling. Depends on: 4, 2. Check: an un-entitled request is refused with the 402 copy; the dispatch regression risk RPT1 names (one function, three reports) is covered by a test exercising all three query-param legs.
11. **Live probe on the deployed surface** (customer-done, per the standing "code-done != customer-done" decision): download succeeds live for (a) gold `48021:34137`, (b) Travis `48453:280239` (consumed-history parcel, now ok), (c) a Whitetail-class no-zoning rural parcel, each document checked against items 4-9 observable states. Depends on: 4-10 deployed. Check: probe artifact filed with snapshot (deploy id, revision) declared.
12. **Close hygiene.** Leave_behind declared; thesis parity ledger entry (this touches access policy via tier gating and the report composes atoms); WDLL regraded item by item. Depends on: 11.

Items 8's and 9's ingest upstreams (who-serves promotion, HOA program) and item 1's sibling ingest cards (ETJ, footprint) are separate cards sequenced in section 6; this card must not silently absorb them (scope changes are WDLL amendments).

## 8. Discrepancies noted (transcript vs docs, docs win)

1. **MLS ingest**: transcript suggested it where licensed; gap matrix row 38 + public-record-only standing decision exclude it. Excluded here.
2. **Tier sketch**: transcript sketched "narrative + site plan + flood = Solo"; the locked ladder does not place the feasibility package anywhere and RPT1 calls it an unmade call. Carried here as section 4's open ruling, not as settled.
3. **Pipedrive kill** (Track E adjacent): transcript recommended kill-if-unused; the 2026-08-17 decision keeps Pipedrive with named reversal criteria. Framed in the coverage map, not relitigated here.
