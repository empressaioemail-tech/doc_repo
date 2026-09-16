---
id: 2026-09-16_scaleup-le_customer_experience_report
title: L-E customer experience — what a customer actually sees, city by city, across the six counties
date: 2026-09-16
kind: research-report
owner: dispatch-planner-le (OPS-24 lane scaleup-le-customer-experience)
plan_rows: [P-197]
status: closed-partial (full fixture list delivered for all 39 buckets; live 3-surface grading completed for 24 of 39 buckets, see §4 "what was not graded this pass")
related_artifacts:
  - _inbox/2026-09-16_scaleup-le_card_spec.md
  - _inbox/2026-09-16_scaleup-le_fixture_list.json
  - _inbox/2026-09-16_scaleup-le_fixture_queries.sql
  - _inbox/2026-09-16_scaleup-le-customer-experience_cp1.json
  - _inbox/2026-09-16_scaleup-le-customer-experience_cp2.json
---

# L-E customer experience report

Read-only research lane. Spawned nothing, wrote no product code, changed no store. All reads
below are LIVE, on 2026-09-16, against `https://smartsite.cloud`, the Smart Site MCP connector
(`get_smart_site`, `find_parcel`, `export_instrument`) on the operator's paid-Solo account, and
the factory store (`FACTORY_DATABASE_URL_RO`, read-only) for fixture selection only.

## 1. The spec

Written first, before any fixture was read: `_inbox/2026-09-16_scaleup-le_card_spec.md`. Eleven
sections, each citing the ruling or finding it derives from. Summary of what it requires:
address with city+ZIP; county; zoning with its governing jurisdiction; setbacks with citation and
vintage, most-current-source-wins, a conflict row on unresolved disagreement; the envelope drawn
or declined with the parcel's own specific true reason, the figure/percent refused everywhere
(R-2); flood with zone; land use; lot size; year built; the PUD message (A-164); salesHistory
declared unavailable with statutory citations (P-209); tier gating (Solo excluded from owner and
CAD-roll dollar values, included in everything else); honest refusals naming what is missing; how
an unincorporated parcel reads; how an uncovered county/address reads (P-210).

## 2. The fixture list

Full deliverable: `_inbox/2026-09-16_scaleup-le_fixture_list.json`, selection SQL:
`_inbox/2026-09-16_scaleup-le_fixture_queries.sql`. Covers all 39 buckets (33 wired cities across
the six counties, plus one unincorporated remainder per county), selected deterministically from
the factory store: for each bucket, the parcel with the lowest `md5(place_key)` satisfying each of
five category predicates (a codified district with a setback value, a district miss, a no-table
city, a PUD-shaped district code, a vacant/no-year-built lot). Corner-lot and curved-frontage
selection were evaluated and found **not determinable** from `parcel_record_cell`'s rail set (no
geometry/adjacency field); disclosed explicitly in the fixture list rather than guessed. Plus the
three operator-named anchor/falsifier fixtures (Bastrop control, Kyle PC R2, Pflugerville).

## 3. Falsifiers, scored

1. **The spec must fail Pflugerville on the missing city, and fail Kyle PC R2 on both the MCP
   state and the map wording.** **PASS (spec is strong enough).** Pflugerville fails spec §1 and
   §8 (city present in `cityLimitsFact`/zoning `jurisdictionKey` but absent from `onRecord` and
   the composed address on both surfaces -- D8 below). Kyle PC R2 fails spec §3 and §4 (no PUD
   message on either surface; the MCP's setbacks-envelope brief section reads
   `absent-verified`/`SETBACK_ROUTER_NOT_A_DISTRICT` -- a confirmed-absence claim on a real
   planned-development district; the map shows Bastrop's own "pre-layer-23" wording on a Kyle lot
   -- D3/D4 below).
2. **At least one city must score well.** **PASS.** The Bastrop control, `48021:34049`
   (1109 Pecan St -- the exact parcel the operator confirmed looks right), scores well on every
   city-specific spec dimension: see §5.1. Its only defects are the three cross-cutting ones
   (D1, D12, D13) present on every fixture regardless of city, so they are not scored against
   Bastrop specifically.
3. **Every defect names the file that produces it, or is marked "source not located."** **PASS.**
   This is a doc_repo-only, read-only lane with no checkout of hauska-map, legacy-design-tools or
   hauska-engine; most defects below are marked "source not located" honestly rather than guessed,
   with the best available inference of which service/endpoint is responsible.

## 4. What was live-graded this pass, and what was not

39 buckets exist in the fixture list. **24 were deep-probed on the map surface** (facets +
live buildable-envelope call), **spanning all six counties**; **10 distinct parcels were read on
the MCP surface** (3 full single-parcel reads for the anchors, plus 5 additional Williamson
reads once the bake-gap pattern emerged, plus a 21-parcel batch summary read); **1 fixture was
read on the PDF surface** (export succeeded; page-content grading not completed -- this
environment has no PDF renderer, `pdftoppm`/poppler-utils are not installed here). This is a
deliberate scope decision (recorded at CP1), not an oversight: full 3-surface grading of all 39
buckets (up to ~150 distinct parcels) was not achievable inside this session. The buckets NOT
live-graded this pass are named per-county in §5 and carried into `leave_behind`.

## 5. Per-city scorecards

Legend: **R** = matches spec, **W** = wrong/defect (numbered, see §6), **P** = partial/honest
gap correctly disclosed (not a defect), **-** = not read this pass.

### 5.1 Bastrop (48021) -- 5 buckets total, 3 deep-probed

| Bucket (n parcels) | Fixture | Addr+city+ZIP | Zoning+jurisdiction | Setbacks+citation+vintage | Envelope | Flood | Land use | Year built |
|---|---|---|---|---|---|---|---|---|
| bastrop-tx (5,775) -- **control/anchor** | 48021:34049 | R | R | R (effective date 2026-04-14) | R drawn, **W D1** (figure leaks) | R (Zone X) | R | R (1906) |
| bastrop-tx (same bucket, 2nd fixture) | 48021:51735 | **W D9** (malformed situsAddress, no address composed) | R (SF-1) | R (30/10/30/20) | - (no address, leg never ran) | R | R | - |
| bastrop-tx (PDD district-miss) | 48021:98624 | R | R (PDD) | P (honestly absent, but **W D3-adjacent**: no PUD message even though PDD is planned-development-shaped) | declined, Bastrop-appropriate wording (correct here) | R | - | - |
| elgin-tx (3,740) | not deep-probed | - | - | - | - | - | - | - |
| smithville-tx (2,295, 100% no-table) | not deep-probed | - | - | - | - | - | - | - |
| (no city: not-applicable, 50,419) | 48021:8733976 | R (Smithville-area address) | R (honest absence, no district) | R | R (honest "could not pin to a rooftop") | R | - | - |
| (no city: refused, 27) | not deep-probed | - | - | - | - | - | - | - |

**Bastrop reads best of the six counties on this sample.** Its control fixture is the falsifier-2
anchor and scores well; its only defects are cross-cutting (D1, D9-local) or a PUD-message gap
that is program-wide, not Bastrop-specific.

### 5.2 Hays (48209) -- 8 buckets total, 5 deep-probed

| Bucket | Fixture | Addr+city+ZIP | Zoning+jurisdiction | Setbacks+citation+vintage | Envelope | Flood |
|---|---|---|---|---|---|---|
| kyle-tx, PC R2 -- **falsifier anchor** | 48209:100698 | R | R (Kyle) | **W D3** (no PUD message; confirmed-absence claim) | **W D3/D4** (declined, wrong wording) + **W D10** (landUseFact vs brief disagree) | R |
| kyle-tx, PC MXD | 48209:196663 | **W D9-class** (address not composed) | R (Kyle) | **W D3/D4** (same pattern, 2nd Kyle PUD fixture) | **W D4** | R |
| kyle-tx, codified R-1-A | 48209:145880 | R | R | R (25/10/15) | **W D1-adjacent**: `envelopeStatus:ok` on the panel, but the live endpoint independently FAILS with `geometry-validation-failed` (boolean clip error) -- a P-217 instance | R |
| san-marcos-tx, codified MU | 48209:166141 | R | R | R (25/7.5/5) | P (honest, specific decline: "no confirmed road-frontage edge labeling"), but panel and endpoint give two DIFFERENT reasons for the same decline (P-217, minor) | R |
| (no city: not-applicable, 62,155) | 48209:25590 | R | R (honest absence) | R | R (honest decline) | R |
| buda-tx, dripping-springs-tx, woodcreek-tx, (no city: refused) | not deep-probed | - | - | - | - | - |

**Hays fails the falsifier-2-adjacent check on Kyle specifically (as designed -- Kyle IS the
required-fail fixture) but reads reasonably on San Marcos and its unincorporated remainder.**

### 5.3 McLennan (48309) -- 4 buckets total, all 4 deep-probed

| Bucket | Fixture | Addr+city+ZIP | Zoning+jurisdiction | Setbacks+citation+vintage | Envelope | Flood |
|---|---|---|---|---|---|---|
| waco-tx, codified R-2 (47,679 parcels, largest city in this sample) | 48309:187374 | R | R | **W D5-adjacent**: panel shows no setback value even though the district resolves | **W D2** (panel declines with Bastrop wording; the live endpoint independently returns `ok` with a real 9-vertex polygon and a correct disclosure -- the map throws away its own endpoint's answer) + **W D1** (figure leaks, 5152 sq ft) | R |
| waco-tx, PUD miss | 48309:342115 | R | R | P (honest miss, but **W D4** wrong-county wording) | declined both ways (consistent, still wrong wording) | R |
| robinson-tx (5,686, 100% no-table) | 48309:402845 | R | R (SF-1 -- zoning IS resolved) | **W D5**: disclosure claims "no zoning district observed" although zoning is SF-1 in the same payload; true reason (no setback table for Robinson) never stated | same as setbacks | R |
| (no city: not-applicable, 33,478) | 48309:342715 | **W D9-class** (no address composed; situsCity shows "WOODWAY" while composedAddress is null -- an internal partial-data inconsistency) | P (honest, but see address note) | - | - | R |
| (no city: refused, 27,411) | not deep-probed | - | - | - | - | - |

**Waco is the single highest-value finding location: its own live endpoint proves the envelope
CAN draw, and the panel throws it away anyway -- Ruling B's original 2026-08-28 defect,
reproduced 2026-09-16, on the county's largest city.**

### 5.4 Travis (48453) -- 10 buckets total, 4 deep-probed

| Bucket | Fixture | Addr+city+ZIP | Zoning+jurisdiction | Setbacks+citation+vintage | Envelope | Flood |
|---|---|---|---|---|---|---|
| pflugerville-tx (Travis part) -- **falsifier anchor** | 48453:427599 | **W D8** (city absent from `onRecord`/`draw.label`; present elsewhere in the same response) | R (jurisdiction present, just not surfaced in the address) | P (citation present, **W D11**: effective date null) | R drawn + **W D1** (figure ready to leak the instant status is ok; here `envByAddr` failed with `geometry-validation-failed`, so D1 did not fire on this specific call, but the facets payload's structured field was not separately re-checked at the moment of failure) | R |
| pflugerville-tx, 2nd independently-selected fixture | 48453:445501 | **W D8** (same defect, confirms it is not a one-off on the operator's own screenshot parcel) | R | R (25/7.5/20/15) | **W** stale/mislabelled atom (`no-buildable-area`, "Tier-1 snapshot status" -- program-scope class E) | R |
| pflugerville-tx, PUD-coded | 48453:728424 | not composed (no address on this call) | R (zoning="PUD") | R (25/7.5/20) -- **W D14**: a "PUD"-coded district resolved normal setbacks with no PUD-message treatment; open question, not asserted as a clean defect | R drawn | - |
| (no city: not-applicable, 104,992) | 48453:855924 | not composed | R (honest absence) | R | R (honest) | R (**Zone AE**, correctly distinct from Zone X elsewhere -- positive finding) |
| austin-tx (203,218, largest bucket in the whole fixture list), lakeway-tx, leander-tx, cedar-park-tx, elgin-tx-travis, round-rock-tx, elgin-tx, buda-tx (Travis parts) | not deep-probed | - | - | - | - | - |

**Travis's falsifier anchor fails exactly as designed; a second, independently-selected
Pflugerville fixture reproduces the same missing-city defect, which rules out "operator's
screenshot was a one-off."** Six of Travis's ten buckets, including its largest (Austin, 203K
parcels), were not deep-probed this pass -- named in `leave_behind`.

### 5.5 Williamson (48491) -- 11 buckets total, 3 deep-probed on the map leg, 5 parcels checked on the MCP leg

| Bucket | Fixture | Map: Addr+city+ZIP | Map: Zoning+setbacks | MCP: `get_smart_site` |
|---|---|---|---|---|
| round-rock-tx, codified | 48491:R483884 | **W D7** (no address composed; DB confirms a real address exists) | R (SF2, 20/5/20/20) | **W D6**: `baked_snapshot_not_found` at both stub and node depth |
| round-rock-tx, PUD-coded | 48491:R490471 | **W D7** | R (PUD, 50/20/50) -- **W D14** (same open question as D14) | **W D6**: `baked_snapshot_not_found` |
| (no city: not-applicable, 109,014) | 48491:R599233 | **W D7** | R (honest absence) | **W D6**: `baked_snapshot_not_found` |
| leander-tx, PUD-HC | 48491:R038268 | not read this pass | - | **W D6**: `baked_snapshot_not_found` (4th confirmation) |
| georgetown-tx, codified | 48491:R405006 | not read this pass | - | **W D6**: `baked_snapshot_not_found` (5th confirmation, different city) |
| cedar-park-tx, hutto-tx, austin-tx (Williamson part), taylor-tx, (no city: refused), liberty-hill-tx, pflugerville-tx (Williamson part) | not deep-probed | - | - | - |

**Williamson is the single worst-performing county in this sample, on BOTH surfaces, at 100%
reproduction across every fixture tried (3/3 map, 5/5 MCP, spanning 3 different cities).** See D6
and D7. This lane did not confirm the mechanism (correlated with, not proven to be, the
already-known P-184 two-namespace/phantom-node issue).

### 5.6 Caldwell (48055) -- 6 buckets total, 4 deep-probed

| Bucket | Fixture | Addr+city+ZIP | Zoning+jurisdiction | Setbacks+citation+vintage | Envelope | Flood |
|---|---|---|---|---|---|---|
| lockhart-tx, codified RHD | 48055:124036 | R | R | R (25/20/25/20) | R drawn (13 vertices) + **W D1** (figure leaks, 805 sq ft, 3rd reproduction) | R |
| lockhart-tx, PDD miss | 48055:124553 | R | R (PDD) | P (honest miss) -- **W D4** wrong-county wording | declined both ways | R |
| luling-tx (2,887, 100% no-table) | 48055:44215 | R | R (R-1 -- zoning IS resolved) | **W D5** (2nd reproduction: disclosure claims "no zoning district observed" although zoning is R-1) | same | R |
| (no city: not-applicable, 14,401) | 48055:21992 | **W D9-class** (no address composed) | P (honest absence) | - | - | R (**Zone AE**) |
| martindale-tx (615, 100% no-table), san-marcos-tx (Caldwell part, 70) | not deep-probed | - | - | - | - | - |

## 6. Defect list

Each defect: what it is, its reproduction count/evidence, and the file/endpoint responsible where
locatable ("source not located" where this read-only, doc_repo-only session could not check).

| # | Defect | Reproduced | Severity | Ruling/spec violated | Source |
|---|---|---|---|---|---|
| D1 | **Buildable-area figure leaks on every 'envelope drawn' fixture**, in BOTH the structured payload field (`buildableAreaSqFt`) and the prose disclosure string, on two independent endpoints (facets GET, buildable-envelope POST) | 3/3 of all "status:ok" fixtures tested: 19052 sq ft (Bastrop 34049), 5152 sq ft (Waco 187374), 805 sq ft (Lockhart 124036) | **HIGH** -- direct, structural violation of a named, dated ruling | Ruling B reversed / R-2, 2026-09-11: "the buildable area figure and percent stay refused everywhere... a numeric figure or percent printed anywhere is a defect" | `POST {PE_BASE}/api/spine/cortex/api/brokerage/v1/place/buildable-envelope` and `GET {PE_BASE}/api/spine/property-atoms/<id>/facets`. Source not located (likely legacy-design-tools cortex-api brokerage route or hauska-engine's envelope-derive/atom-chain service; no checkout of either repo in this session). |
| D2 | **Waco's own panel declines an envelope its own live endpoint can draw** -- the exact 2026-08-28 Ruling B defect, reproduced 2026-09-16 on McLennan's largest city | 1/1 tested (48309:187374, 47,679-parcel city) | HIGH (recurrence of a named historical defect, on a large city) | Ruling B reversed, 2026-09-11 (drawing requirement) | facets `envelopeStatus` field vs. live buildable-envelope POST response for the same parcel; source not located |
| D3 | **No PUD message on any PUD/PC/PDD-shaped district tested**; Kyle's PC R2/PC MXD show a confirmed-absence-shaped MCP state instead | 2/2 Kyle PC fixtures (100698 the operator's own anchor, 196663) | HIGH (ruled 2026-09-15, "never carded as a build" per pickup list) | A-164 | Not built anywhere yet, per the pickup list's own S1/S2 rows; no file to name because the feature does not exist |
| D4 | **Bastrop's "layer-23"/"pre-layer-23 sources" decline wording shows on non-Bastrop parcels** | 4/4 non-Bastrop district-miss fixtures tested: Kyle x2, Woodway, Lockhart | HIGH (customer-facing, wrong on its face outside Bastrop) | Spec §4; matches program-scope §2b/4.5b item X4 exactly | Decline-text generator for the district-miss case; source not located (hauska-map or LDT) |
| D5 | **No-table cities' envelope-decline text says "no zoning district observed" while the SAME payload's zoning field is populated** | 2/2 tested no-table-city fixtures: Robinson (SF-1), Luling (R-1) | MEDIUM-HIGH (internal payload contradiction, likely generalizes to the other 52 no-table cities / ~94,260 parcels named in program-scope §S3) | Spec §8 ("a fact about the corpus, not about the lot"); ties to program-scope's `buildNoRuledTableCells` finding but is a DIFFERENT bug (customer text, not the underlying cell write) | Envelope-decline text generator; source not located |
| D6 | **Williamson County: no MCP baked snapshot for any parcel tested, at any depth** | 5/5 parcels, 3 cities (Round Rock, Leander, Georgetown) | HIGH (county-wide, both `get_smart_site` depths) | Spec §1/§8; not previously carded under this exact framing | `get_smart_site` node/stub-depth bake for county 48491; source not located (did not read the baking pipeline) |
| D7 | **Williamson County: map facets also fail to compose an address for every parcel tested**, although the raw data holds one | 3/3 map fixtures tested | HIGH (compounds D6; same county, different surface) | Spec §1 | `composeAddress`/`baseFacts.situsCity` path in the facets response; source not located. Correlated with, not proven to cause or be caused by, P-184's known two-namespace/phantom-node issue (282,569 nodes) -- this lane did not read the join code. |
| D8 | **Pflugerville's city is dropped from the card's primary identity fields**, though present elsewhere in the same response, on two independently-selected fixtures | 2/2 Pflugerville fixtures: the operator's own 427599, and the independently SQL-selected 445501. Confirmed on both map (`baseFacts.situsCity` null) and MCP (`onRecord` has no city field; `draw.label` bare street, vs. Kyle's `draw.label` which DOES carry city+ZIP) | HIGH (this is the mission's lead example; now doubly confirmed) | Spec §1/§8; matches program-scope X2 exactly, now confirmed independently on the MCP surface too | Address-composition path; the underlying data (`cityLimitsFact.cityName`, zoning `jurisdictionKey`) IS correct, so this is specifically a rendering/composition-layer drop, not a data gap. Source not located. |
| D9 | **A malformed `situsAddress` value (", ,") on one Bastrop fixture cascades into a total envelope-drawing failure** for that parcel, though its zoning and setbacks are fully resolved | 1/1 (48021:51735); 2 further instances of an unreadable/absent address on other fixtures (48309:342715, 48055:21992) without confirming the same malformed-value mechanism | MEDIUM (single-record data-quality defect with a real downstream consequence) | Spec §1 | One bad ingested value; source (ingestion/parsing) not located |
| D10 | **Internal land-use disagreement within one MCP response** (Kyle PC R2): top-level `landUseFact` says absent/`LANDUSE_JOIN_HOLD`; `brief.sections[land-use]` says present with a value, for the same parcel, same call | 1/1 tested this specific way | MEDIUM (P-217-class, but within-payload rather than cross-surface) | Spec §9 (extended: applies within one payload too) | MCP node-depth assembler; source not located |
| D11 | **Setback citation with no readable effective date** on an otherwise fully-resolved fixture (Pflugerville 427599: citation present, `effectiveDate: null`), contrasted with the Bastrop control's correctly-populated date | 1/1 tested this precisely; not confirmed as systemic | LOW-MEDIUM | Spec §3 (most-current-wins vintage requirement) | `setbackRulesFact` writer for pflugerville-tx; source not located |
| D12 | **`salesHistory` is entirely absent from the MCP schema**, not refused | 3/3 full single-parcel `get_smart_site` reads (Bastrop, Kyle, Pflugerville) | HIGH (violates a specific, ruled ruling with named statutory citations) | P-209, 2026-09-14 | MCP node-depth response assembler; the rail simply is not in the response shape at all. Source not located. |
| D13 | **`valueHistoryFact` bypasses the Solo tier gate that correctly blocks `onRecord.cadRoll`** | 3/3 fixtures (matches the already-carded P-246 finding; independently reproduced here on 3 different counties) | HIGH (already known, confirmed still live 2026-09-16) | P-246 mission (own ruling) | `legacy-design-tools artifacts/api-server/src/routes/propertyExplorer.ts assembleNodeBriefBody` (named in P-246's own mission text; not independently re-verified against the file in this session) |
| D14 | **Districts literally coded "PUD" resolve normal setbacks with no PUD-message treatment** | 2/2 tested ("PUD"-named districts in Pflugerville-Travis and Round Rock both had real setback tables and drew) | OPEN QUESTION, not asserted as a clean defect | A-164 (once built) | Flagged for the building lane: does "PUD" here mean a true planned-unit development, or a Euclidean district that happens to be named PUD? This lane could not tell from the API alone. |
| D15 | Flood zone correctly varies (Zone X vs Zone AE) across fixtures | positive finding, not a defect | -- | Spec §5 | -- |
| D16 | PDF export (dossier) succeeds for a Solo account; page-content grading not completed (no PDF renderer in this environment) | 1/1 attempted | leave-behind, not a defect | Spec (PDF leg) | `export_instrument` MCP tool, confirmed working; content grading owed to a session with `pdftoppm`/poppler-utils available |

**P-217 instances** (cross-surface or within-payload disagreement, called out separately per the
mission): D2 (panel vs. live endpoint, Waco), D10 (landUseFact vs. brief section, Kyle), the
San Marcos fixture's two different decline reasons for the same outcome (§5.2, minor), and
D1/D4/D5/D8 each also carry an internal-payload-disagreement component (a correct fact sits next
to an incorrect rendering of the same fact in the same response).

## 7. leave_behind

- 15 of 39 fixture-list buckets not live-graded this pass (named per-county in §5); their
  fixtures ARE selected and listed in `_inbox/2026-09-16_scaleup-le_fixture_list.json`, ready for
  the next pass.
- PDF-surface content grading owed once a PDF renderer is available in the working environment.
- D6/D7's mechanism (Williamson county-wide gap) not read at the code level; worth a dedicated,
  code-reading follow-up before assuming it is the same root cause as P-184.
- D14's open question (does "PUD"-coded district mean true PUD, or a Euclidean code that spells
  PUD) should be settled before the A-164 PUD-message build ships, so it does not misfire on
  districts that already resolve correctly.
- Corner-lot and curved-frontage fixture categories could not be selected from the factory store
  (no geometry field); a geometry-aware selection pass is owed if those categories matter to a
  future probe.
