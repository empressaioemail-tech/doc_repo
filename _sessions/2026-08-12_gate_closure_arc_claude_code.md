---
title: Gate-closure arc — instruments, applies, and the report engine
date: 2026-08-12
type: session
agent: doc_repo planner (claude code)
status: mid-session capture
---

# Session capture — 2026-08-12

## The one-line

Texas completeness moved **0.7689% to 12.909%** and cells in gate-forbidden states went **1,778 to 0**, almost none of it from acquiring new data. It came from repairing instruments that were lying and applying machinery already built. Scope then widened deliberately: a report engine, Factory 1.5, and a platform migration.

## Where the numbers stand (live, verified at capture)

| Measure | Session start | Now |
|---|---|---|
| texasCompletenessPct | 0.7689% | **12.909%** |
| satisfiedCells | 89 | **405** |
| Cells in `no-writer` / `no-atom` | 1,778 (see caveat) | **0** |
| Parcel fabric | 196/254 | **253/254** |
| Geometry rail | 141 | **251/254** |
| Rails with writer + atom family | 11/14 | **14/14** |
| Registered property atom types | 14 | **16** |
| satisfiedPresentPartialCells | 18 | **0** |

The 1,778 baseline matches no single artifact — D3 records 1,016 and 762 as separate quantities, and their sum is asserted rather than measured.

**THE "SESSION START" COLUMN IS SELF-REPORT AND UNFALSIFIABLE.** There is no ledger history table and no start-of-session dump, so every BEFORE figure — and therefore every delta — rests on planner narration. The NOW column is verified live at source. Treat the deltas as directionally sound and precisely unproven. A ledger-history snapshot should be captured at the start of the next arc so this is falsifiable next time.

**"Parcel fabric 253/254" is a `txgio_parcel` STAGING count, not a rail.** It is not a ledger cell state and must not be read as one.

NOTE ON AN 18-CELL DELTA — CORRECTED BY ADVERSARIAL REVIEW. A1 closed at satisfiedCells 423 / 11.8954%. The live read is 405 / 12.909% — fewer cells, higher percentage. The parcel-weighting mechanism is real and confirmed (`texasCompletenessPct` is PARCEL-WEIGHTED and BINARY per cell, so promoting high-parcel-count counties raises the headline while cells drop elsewhere). **BUT THE LEDGER IS NOT MOVING** — two reads ten minutes apart are BYTE-IDENTICAL (405 / 12.909486508370861), so "A2 is mid-run" does NOT explain it. The 18-cell delta is SETTLED and OWED A RAIL-BY-RAIL ATTRIBUTION. An earlier draft of this capture said "do not reconcile these two readings as an error" — that instruction is RETRACTED. This session already had a silent 1,016-cell regression that looked like normal variance; a standing instruction not to reconcile a cell drop is exactly how the second one gets missed.

## The pattern that dominated the session

**EIGHT instrument-not-data defects.** Every one was a value ASSERTED where it could be DERIVED, or derived with a SILENT FALLBACK that manufactured a confident answer.

**TWO OF THE EIGHT ARE STILL OPEN — #4 and #8.** Do not read this list as a list of fixes.

1. `hasWriter` hand-declared — drifted both directions; up to 762 cells misreported.
2. special-district verify validated the IN-MEMORY object it had just built — `verifyFailures` structurally incapable of being non-zero, on the largest planned apply.
3. Zoning satisfaction keyed on `atomFamilyState` — one atom flipped a whole county green. 19 reported satisfied; ONE was real; 15 sat at exactly 0.00% coverage.
4. **STILL OPEN — 40.4% EXPOSURE MEASURED.** `mapSymnumToWellStatus` DEFAULTS unmatched codes to "producing" — verified on engine origin/main at `well-fact/symnum.ts:36`, a bare `return "producing"`. It was DETECTED this session, never FIXED, and the blast radius GREW: the statewide RRC source (1,396,049 wells) landed while it stayed open. `mapSymnumToWellType` carries the identical `return "oil"` fallthrough. Both must be fixed before any wells apply.
5. Warm preflight gate called by 1 of 4 runners, and the PROMOTED runbook handed out an ungated command.
6. Geometry scorer divided ACCOUNT cardinality by FEATURE cardinality — counties fully written and mis-scored; the ledger UNDERSTATED real coverage.
7. `resolveLdtRoot()` used `process.cwd()`; a refresh from the wrong directory turned a probe MISS into a confident "no writer" and persisted it. 1,016 cells went dark with 11.6M atoms behind them.
8. MCP property-atom-chain hardcodes FOUR types in a DID regex — **12 of 16 registered families unreachable**, including every family written statewide this session. OPEN; dispatch issued.

Two would have shipped CONFIDENTLY WRONG CLAIMS TO CUSTOMERS: well-fact Harris-only source (0.92% of Texas; ~1.4M false "no well" assertions across the Permian) and footprint bbox matching (59.5% false-positive rate — buildings attributed to the wrong parcel, on a site plan).

TWO TESTS WERE THEMSELVES THE DEFECT: the Command Center suite asserted the console against the same constant the console rendered from; the manifest derivation test `fileExists` mock was a hardcoded allowlist asserting "easement has no writer" at the moment the writer merged.

**Base rate holds: hook-shaped controls that fail closed work 1-for-1; protocol-step-shaped controls are 0-for-3.** S1 (legacy-design-tools PR #413 — NOTE: PR numbers in this document span TWO repos; #293/#306/#313/#315/#316/#317/#319 are hauska-engine, #413/#414 are legacy-design-tools) shipped the structural answer: three-state derivation across 14 call sites, a reconciliation gate with 5 fail-closed assertions, a CI binding check across all 14 rails.

## What landed

**Instruments.** Depth predicate fixed (zoning 19 to 1 honest). Geometry denominator corrected (+53 cells; near-miss counties were fully written and mis-scored). Derived `hasWriter` plus capability probe. `process.cwd()` regression fixed and 1,016 cells restored. Console derives its rail list from the API (RRC split now visible; header no longer contradicts its own cell count).

**Fabric.** Wave 4 landed the 57 reprojection counties (196 to 253); the gap was an EXECUTION gap, not a source gap — `--reproject=3857` was already merged and had never been run. B2 wrote 590,212 parcel-node atoms, geometry 194 to 251.

**Applies.** Flood 178 counties / ~2.4M atoms / 114 cells. A1 applied owner + landuse + cad across 15 CAD counties (13.1M atoms, zero verifyFailures) and PROVED the paid-tier gate fires by mutating an atom to `public-free` and confirming the run aborted. A2 in flight.

**Sources.** RRC statewide staged (1,396,049 wells / 491,178 pipelines) replacing the Harris mirror; county join 35.8% to 99.88%. Building footprints staged (10,674,975 rows) with geometry populated, eliminating a 59.5% bbox false-positive rate.

**Roads.** Salvaged #293, built the missing writer, closed the synthetic-id landmine (12,658 rows migrated), Bastrop held at 19,907 rows. Statewide ingest NOT run — correctly still unauthorised.

**Flood metros unblocked.** A vertex-density grid index FAILED (made it slower; cost is vertex-volume dominated, not candidate-count dominated). PostGIS zone-major succeeded: 48099 planMs 1,818,708 to 5,025 (362x); **Harris measured at ~1,862s (~31 min)**. Parity proven by sha256 digest, bit-identical.

## Factory 1.5 — the structural addition of this session

The factory model was re-labelled by operator ruling. NOTE THESE ARE REVERSED from older docs, which called the county factory "1" because it was built first:

- **Factory 1 — statewide fabric.** Jurisdiction-free layers; one source blankets a state; cost roughly constant per state regardless of county count.
- **Factory 1.5 — acquisition / staging.** Find, fetch, parse, normalise, and PERSIST payloads with provenance so the single write path has a queue to drain. Network-bound, failure-prone, infinitely parallel, SLOT-FREE. Both other factories consume its output.
- **Factory 2 — county / jurisdiction depth.** Zoning, setbacks, code text. The moat.

**The insight that produced it: the one-slot rule is a WRITE constraint, not a throughput ceiling.** Acquisition never needs the slot. Factory 1 already had a dry/apply split but DISCARDED the planned payload (a 1,145-byte artifact for a county that built 62,394 atoms), so acquisition and write were welded together. Factory 1.5 breaks that weld: N parallel acquisition lanes produce validated, write-ready payloads; one writer drains the queue whenever the slot is free. Slot contention then costs LATENCY TO VISIBLE COVERAGE, never THROUGHPUT OF THE EXPENSIVE WORK.

H1 shipped it (hauska-engine PRs #316/#317): `tx_zoning_district_staging`, a normalised payload contract (`packages/engine-core/src/zoning-staging/payload-contract.ts`), a source registry recording WHICH TIER satisfied each city, and a drain interface (`zoning-staging/drain.ts`). Migration `0074_tx_zoning_district_staging.sql`.

Proven on two genuinely divergent schemas — Elgin (parcel-joined, 26 attrs, `Zone_Code` plus a long-name twin, domain map A to R-4, CITY_LIMIT filter, 3,209 rows) and Smithville (bare district polygons, OBJECTID plus ZONING only, no twin, no domain map, 91 rows). Unmapped source fields are RETAINED VERBATIM per the harvest-completeness ruling; empty `source_tier_satisfied` FAILS CLOSED at both the TS and SQL-CHECK layer, because falling back is fine but falling back SILENTLY is the defect.

Its own adversarial pass caught a county-scoped drain MIXING Elgin and Smithville `C-3` districts — same code, different meaning — fixed in #317 by requiring `cityKey` unless `allowMultiCity=true`.

**Factory 1.5 is unnamed code, not missing code:** `lib/cad-ingest` already fetches, parses, projection-guards and persists with vintage provenance. Re-tiering it is naming, a queue, and close artifacts — which is WHY its blockers surfaced serially instead of as a drainable backlog.

**Zoning pre-staging is the first real workload.** The blocker is a PROBING gap, not a data gap: 42 of 50 CAPCOG cities have `zoning_gis` NULL, and NULL is a hard stop — but Elgin showed NULL and was stamped from a layer found during recon. The layer existed; nobody had looked. A city probed and genuinely not found must be recorded as SEARCHED-AND-ABSENT, never left NULL, which is indistinguishable from never-looked.

## Second state

Utah probed (reference only; CTX/national remains HELD). UGRC publishes a genuine statewide parcel product — 1,592,583 features, all 29 counties confirmed by County groupBy AND four-corner probes. **The Factory 1 premise HOLDS.** But `uniformProduct: false` — it is a county-steward merge, so the ACQUISITION motion ports and the NORMALISATION motion does NOT. Do not budget Texas normalisation reuse.

Two name/extent traps found, both RRC-class: `Parcels_Utah` advertises the state with a Utah-COUNTY extent (284,092 features); inversely `UtahRoads` metadata reads Wasatch-Front while `COUNTY_L` groupBy returns all 29 — trusting extent alone would have FALSELY REJECTED a statewide product. Probe coverage by groupBy AND corners, never by advertised extent alone.

## Two planner claims that were FALSE and are now corrected

1. **"engine-core is Texas-clean."** Repeated all session on the strength of a FIPS-literal grep — the WRONG INSTRUMENT. `GLOBAL_ML_TEXAS_ZIP_URL`, `ML_TEXAS_ZIP_ENTRY_NAME`, `GEOFABRIK_TEXAS_PBF_URL`, `TEXAS_RRC_WELLS_LAYER` are production constants, plus `txgio_parcel` SQL and TX pilot defaults. A hardcoded Texas SOURCE URL couples as hard as a FIPS literal and is harder to spot.
2. **"26 of 47 cad-ingest files coupled."** RETIRED — its counting method was never stated, which is how it drifted across three sessions. Measured: **30/48 executable** (36/48 on an inclusive count that includes six comment-only files). ALWAYS QUOTE A RATIO WITH ITS COUNTING RULE.

## Scope added this session (operator-ruled)

**Report engine.** A feasibility study as a THIRD SIBLING ASSEMBLER alongside site-plan and flood-drainage. Styling is centralised and the reuse is proven twice (`SHEET_STANDARD_v1.html`, `template-tokens.ts` ported verbatim from the operator ds-industry.css, font metrics read from the font, 11 regression tests). `dossier.ts` is the direct precedent — it already composes cover plus facts plus sections plus the whole site-plan set with renumbering. **The operator styling red line is SAFE.**

- Audience selector (architect / investor / lender / municipality / broker) changes the DELIVERABLE SET by default, with user override that persists. Profile appears on the cover. Unavailable deliverables degrade honestly with a reason — the same honest-absence discipline applied to the download list.
- ONE model already feeds DXF, IFC and PDF (`author.ts:412`, four parity tests) — **the architect profile is nearly free**, and it is the profile with the clearest willingness to pay.
- Flood is a genuine D8 hydrology run over a padded 3DEP catchment with live NOAA Atlas 14 rainfall, needs NO warm parcel, and persists a machine-readable artifact the report must READ rather than re-run.
- Comparison is a MODE of the same engine, not a separate build. CompareTool has real UI and ZERO emitter.
- Never hardcode page counts — `render.ts:193` warns "never assume 3".
- Narrative discipline: slot-filled structure with generated prose ONLY over verified atom values. No free-form paragraphs about a parcel. The engineered study gets away with prose because a licensed engineer signs it; this cannot and must not pretend to.
- Disclaimer: one quiet line on the cover, full exclusions page at the back.

**Smart Files as the artifact store.** ZERO code in either product repo — it is a SmartCity concept doc, so this is a BUILD, not an integration. The need is real and immediate: report-run persistence does NOT exist for this surface (`report_run` is plan-review-only and self-describes as "run STATE, not a result store"; the MCP server has zero references to it). The share link becomes a data-room link, keeping the share loop intact while upgrading the destination. Refined on Smart Site before SmartCity depends on it.

**Vercel to GCP migration.** Operator-ruled: Vercel was dev convenience; the domain is owned; SmartCity already deploys from GCP. SCOPED NOW, EXECUTED AFTER THE GATE CLOSES — it touches deploys, secrets, DNS, build pipeline and BFF routes, and this session alone produced two Vercel deploy traps (wrong project link; exit-255 as a false failure signal). The 11/12 function cap is NOT blocking: the report folds into the existing query-param-dispatched function exactly as flood and dossier already do. Natural bundle with the `smartsite.cloud` canonical-URL sweep already sitting in the Q11 GTM batch.

## The gate

`_decisions/2026-08-11_texas_flush_launch_gate_amendment.md` — 14 numbered acceptance items, each with a named pass/fail instrument. Before this session there was NO single coherent definition of done; five documents each held a piece and none agreed on the denominator.

**Criterion 3 is structurally closed: zero cells in `no-writer` or `no-atom`** — and it survives the harder test: zero cells sit in S1's new `derivation-indeterminate` state, so the tri-state did not become a hiding place.

**CAVEAT ON "14/14 rails have a writer" — the CI test that backs it is weaker than the claim.** It passes when a rail binds a writer **OR declares a `noWriterReason`**, and the ledger's uniform `hasWriter=true` cannot distinguish the two. Both declarers (easement, rrc-pipelines) sit at 0 satisfied cells. "Every rail has a writer bound" is therefore NOT proven by that test alone.

**100% does NOT mean every parcel has every fact.** Large parts of Texas are unincorporated and legitimately unzoned; most parcels have no well within 500 ft. Texas at 100 means every one of 3,556 cells returns either verified data or a disclosed, provenanced absence — measured-everywhere, which is the ruled launch gate. Filled-everywhere (CAD depth across 254 districts, zoning across ~1,222 cities) is program completion and runs post-launch.


## Late-session landings (added after the adversarial review)

**W2 CP1 — the symnum exposure is 40.4%, and the halt was correct.** 563,935 of 1,396,049 staged wells
(40.4%) hit the fallthrough across 43 distinct unmapped SYMNUMs. The breakdown matters more than the
total: SYMNUM 4 (316,298 "Oil Well"), 5 (126,429 "Gas Well") and 6 (23,269 "Oil/Gas Well") are CORRECT BY
ACCIDENT — the fallthrough happens to give them the right answer. But **SYMNUM 9 (44,563 "Canceled /
Abandoned Location") and 21 (25,005 "Injection / Disposal from Oil") would ship as PRODUCING** — roughly
70,000 wells carrying a confident false status. The fix must do BOTH: map the legitimate values properly
off `GIS_SYMBOL_DESCRIPTION`, and fail closed on the rest. Contract path: add `unknown` to both
`WellStatus` and `WellType` unions (neither currently has it), publish from merged main.

**Z1 — the zoning probing gap is real but SMALLER than hoped, and Houston is a structural absence.**
  Central Texas: 138 cities probed, 26 layers found, 112 searched-and-absent (19% hit rate)
  Houston:       125 cities probed, 20 layers found, 105 searched-and-absent (16% hit rate)
Both below the pre-registered band. **The City of Houston itself has NO Euclidean zoning** — a
deed-restriction regime — recorded as SEARCHED-AND-ABSENT with the reason and an explicit note not to
invent a layer. That is honest-absence discipline applied to ACQUISITION, and it reframes the metro
sequence: Houston will never light the zoning rail the way Central Texas can, because the data does not
exist to find. Elgin proved layers exist that the registry denies; these numbers prove most cities
genuinely have none. Size L5 against the found counts, not the city counts.

**A1P — all three owed patches RECOVERED, not reconstructed** (hauska-engine PR #319 merged). The A1
working tree still held the uncommitted diffs at 89d4c08. Hays verified live at 265,852 join-hold
absences / 0 presents, so the corrected HOLD semantics took without needing the slot. Its CP2 caught a
DEFECTIVE NEGATIVE TEST: `createOwnerFact` used an illegal `atomDid` and omitted required provenance, so
a bare `toThrow` would have passed WITHOUT proving the parcelNodeId alphabet failure — a test that could
not fail for the right reason, caught before merge.

## Lane state at capture close

LANDED: A1, A1P, B2, D1, D2, D3, E1, E2, F1, G1, H1, P0/P1/P2 packs, R1, R2, RPT1, S1, U1, C1, C2,
CAPREV, W2-CP1, Z1 (Central TX + Houston).
IN FLIGHT: A2 (holds the atoms bulk-writer slot; halted before well-fact pending W2), MCP1 (atom-chain
widening), SWEEP (silent-fallback audit), W2 (symnum fix execution), Z1 (Dallas metro).

## Open

- MCP atom chain: 12 of 16 families unreachable — BLOCKS the report engine. Dispatch issued.
- ~~A1 two fixes uncommitted~~ CLOSED — hauska-engine PR #319 merged, patches RECOVERED not reconstructed.
- **UNCOMMITTED WORK IS LIVE IN ALL THREE REPOS**, including untracked `well-fact/fetch-wells-staged.ts`. Same K5 class. Sweep and PR before session close.
- Flood metros: viable at ~31 min for Harris, awaiting the slot.
- L5 zoning depth: real depth is ONE county. Z1 probing sweep in flight.
- Second-state portability: parameterise envelope/FIPS/NFHL/ML/Geofabrik, then a UGRC adapter.
- `_STATE.md` needs regeneration against these numbers.
