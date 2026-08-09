---
id: OPS-12_instrument_inventory
title: OPS-12 — Verification and Instrument Inventory (what each instrument checks, and what it cannot see)
date: 2026-08-09
status: active
owner: nick
related: [OPS-5_cert_standard, OPS-8_blocker_free_onboarding_model, OPS-2_county_onboarding_runbook, onboarding_defect_class_backlog, 90_runbooks/factory_onboarding_runbook, 90_runbooks/product_surface_smoke_suite, _decisions/2026-08-07_envelope_saga_close_and_geometry_law, _inbox/2026-08-09_L2_W3R2_RESUME_REPORT, _inbox/2026-08-09_MULTI_SHP_sweep_summary]
---

# OPS-12 — Verification and Instrument Inventory

## THE ORGANIZING PRINCIPLE: NEGATIVE CAPABILITY

Every instrument in the factory is catalogued here with two facts of equal weight: what it checks, and what it structurally cannot see. An instrument's blind spot is a property of the instrument, not a defect in its implementation, and it does not get better with more careful running. The only remedy for a blind spot is a different instrument reading a different frame.

This doc exists because the factory once ran four instruments in agreement on a two-thirds-empty county and every one of them said PASS.

## THE FOUNDING CASE — HARRIS COUNTY 48201 (a count cannot detect a defect it inherits)

Verified against live source at `P:\legacy-design-tools` (HEAD `12d08f50`, 2026-08-09). `lib/cad-ingest/src/txgio/cli.ts:148-149`:

```
async function discoverShapefile(files: string[]): Promise<ResolvedShapefile> {
  const shpFile = files.find((f) => /\.shp$/i.test(f));
```

`files.find()` returns the first match and discards the rest. The function has no multi-shapefile branch, no count of how many `.shp` entries the archive held, and no warning when it drops one. The claim in the task frame is confirmed exactly at the stated file and line.

The Harris TxGIO archive ships two shapefiles. Verified from the statewide multi-shapefile sweep, `_inbox/2026-08-09_MULTI_SHP_sweep_summary.md`, which probed 254 counties by ZIP central-directory range and found exactly one multi-shapefile county:

> 48201 Harris: stratmap25-landparcels_48201_harris_east_202508.shp, stratmap25-landparcels_48201_harris_west_202508.shp. Inference: geographic split inferred from filename: east/west.

The 213 MB `harris_west` half was downloaded, extracted, and silently discarded; only the 103 MB east half loaded. Verified from `_inbox/2026-08-09_L2_W3R2_RESUME_REPORT.md`:

- Line 52: `| Harris | 48201 | 536,512 | 564,948 | 0 | **SHORT-LOADED, see below** |`
- Line 80: `extracting shp/stratmap25-landparcels_48201_harris_west_202508.shp (213768804 bytes)`
- Line 90, verbatim: "`find` returns the first match. `harris_west`, at 213 MB, larger than the 103 MB east half, was downloaded, extracted, and discarded without a word."
- Line 95: `HARRIS_BBOX={"w":"-95.4364","e":"-94.9076","s":"29.5086","n":"30.1670","cnt":564948}`. That is an artificial western wall at lon -95.4364 with 21,300 parcels stacked against it, while true Harris extends to about -95.96.

The instrument lesson, quoted from that report at line 102:

> What makes this the important finding is that no count-based check can detect it. Dry, apply, apply2, and SQL all agree at 564,948 because all four read the same truncated input. Worse, the membership file's `parcel_count_est` for Harris is 536,512 — exactly the east-only feature count — so the original sizing probe carried the same bug and the estimate cannot be used as an independent check. Idempotency, dry-apply parity, and envelope conformance all pass on a two-thirds-empty county.

A COUNT CANNOT DETECT A DEFECT IT INHERITS. Dry-run, apply, a second apply, and independent SQL are four readings of one input, not four independent instruments. Their agreement measures reproducibility, never completeness. Only an instrument reading a DIFFERENT FRAME catches this class, and for a short-loaded geographic dataset that frame is geographic: a county-extent or bounding-box check against an authoritative county boundary, an artificial-straight-wall detector against a parcel-density edge, or an archive-manifest check that counts source shapefiles and fails when more than one exists and only one was consumed.

The 2026-08-08 statewide readiness file recorded `48201 Harris 479.5 MB vintage=202508 est_parcels=536512`, the same inherited number, one day earlier. The estimate was never independent.

This is the same species as Geometry Law rule 3 (write-then-verify: gate-one-representation-serve-another) and rule 5 (instrument independence: no fix is closed by a check authored in its own lane), extended one layer earlier to ingest: no completeness claim may be closed by a check reading the same input as the thing it grades.

## NEGATIVE CAPABILITY IS ALREADY DOCTRINE

OPS-8 states its own limit explicitly at line 30, and this sentence is the model for every row below:

> The gate reduces mid-run stalls; it does not certify the run in advance.

The same paragraph names two checks as only PARTIALLY pre-flightable: geometry parity on a 5-parcel sample bounds risk but does not prove the cohort, and superseded MEASUREMENT is pre-flightable while superseded RESOLUTION is not.

OPS-5 line 17 makes the equivalent admission for the mechanical sweep: it "can be under-strict (it once passed a shape it said it rejected), which is why gate 2 exists."

## THE INSTRUMENT TABLE

Frame column reads: which representation the instrument grades against. Shipped column is verified against live source where a path is given.

### Ingest and acquisition layer

| Instrument | Where it lives | What it checks | WHAT IT CANNOT SEE | Frame | Status |
|---|---|---|---|---|---|
| `discoverShapefile` | ldt `lib/cad-ingest/src/txgio/cli.ts:148` | that at least one `.shp` and its matching `.dbf` exist in the archive | that the archive held MORE than one shapefile; that a discarded half exists; any geographic consequence of the discard | TxGIO archive file list | SHIPPED, and it is the Harris defect |
| Dry-run predicts apply | runbook section 2 "Dry-run-must-predict-apply"; every apply-capable script | that the write leg landed the count the read leg predicted | any defect present in the shared input both legs read; short-loads, truncations, missing source halves | same input, twice | SHIPPED |
| Idempotency re-run (apply2) | runbook, wave procedure | that a second apply writes nothing new | same as above; it is a third read of the same input | same input, third time | SHIPPED |
| Independent SQL row count | planner-run, per run record | that the store holds what the run reported | completeness against the SOURCE; it grades the store against the process, both downstream of the same truncated input | atoms/txgio store | SHIPPED |
| `parcel_count_est` sizing probe | membership JSON (`_inbox/2026-08-08_L2_WAVE3_membership.json` family) | rough cohort size for slot budgeting | anything, when the estimate is derived from the same truncated read; Harris est 536,512 was the east-only count | source archive (same read) | SHIPPED, NOT INDEPENDENT |
| Multi-shapefile ZIP sweep | `_inbox/2026-08-09_MULTI_SHP_sweep_summary.md`, zip-eocd-central-directory-range method | how many `.shp` entries each county archive holds; 254 attempted, 253 succeeded, 1 dead, 1 multi-shapefile | it is a one-shot audit artifact, not a wired gate; nothing re-runs it on a new vintage | archive central directory | RAN ONCE, NOT WIRED |
| County geographic extent check | does not exist | none | none | none | ABSENT (see "defect classes with no instrument") |

### The pre-flight gate (OPS-8, 8 checks)

Verified in live source at `P:\hauska-engine` HEAD `ed2498f`: all eight check ids present in `packages/engine-core/src/registry/onboard-preflight.ts`, and eight defectClass string literals present in the same file (`ADAPTER-NEEDED`, `COST-GATE`, `GEOMETRY-DIVERGE`, `MEASURE-EMPTY-COHORT`, `MIXED-VINTAGE`, `PARCEL-LAYER-UNWIRED`, `SERVE-PATH-UNHEALTHY`, `SUPERSEDED-GT3PCT`). Runner: `scripts/onboard-preflight.mjs`, fips-keyed wrapper `scripts/preflight-and-report.mjs`.

| Instrument | What it checks | WHAT IT CANNOT SEE | Frame | Status |
|---|---|---|---|---|
| `railASourceReachable` | code source + adapter reachable | whether the adapter, once reachable, extracts correctly or completely | live HTTP probe | SHIPPED |
| `zoningSourceReachableOrUnzoned` | zoning source reachable, or row flagged unzoned (a PASS) | whether an "unzoned" flag is factually right for that jurisdiction; a wrongly-flagged row passes silently | registry row + live probe | SHIPPED |
| `parcelLayerWired` | registry row names an authoritative parcel layer + district field | whether the named layer is the right layer; Caldwell's row pointed at "Municipal Utility Districts" and this check passed it (CAD-LAYER-INDEX-UNVERIFIED, cleared by a live probe rule, not by this check) | registry row | SHIPPED |
| `supersededCohortMeasured` | superseded cohort measured up front, reported as expected decline count | whether resolution will succeed; a 0-count on a pre-warm county is a legitimate PASS that carries no information (`MEASURE-EMPTY-COHORT` backstop added in #220/#250) | atoms store | SHIPPED |
| `geometryParitySample` | warm==cert R28/R33 parity on a 5-parcel sample | the cohort; OPS-8:30 says so in writing, and the Bastrop corruption was found by area-sweep, never by sampling | txgio/atoms sample | SHIPPED |
| `servePathHealth` | retrieval auth + atom-chain read + ledger write | whether the served VALUES are correct; it proves the pipe is open, never that the water is clean | live retrieval-api | SHIPPED |
| `costGate` | sample-cohort estimate under $200 | actual full-cohort cost; runbook planner correction 10 says these are named-constant ESTIMATES, "never quote as measured" | cost model heuristic | SHIPPED |
| `mixedVintageResidueScan` | prior-warm residue in the target area, enumerated or absent | residue in a cohort the scan does not address; it found nothing on every row so far, so its true-positive rate is unproven | atoms store | SHIPPED, UNEXERCISED |

Gate-level blind spot: the gate reads the FROZEN REGISTRY ROW. Every check is downstream of the row being right. A wrong row (wrong layer index, wrong URL, wrong unzoned flag) is invisible to seven of eight checks; only a live probe of the service root catches it, and that is a runbook rule, not a gate check.

### The cert instruments (OPS-5)

| Instrument | Where it lives | What it checks | WHAT IT CANNOT SEE | Frame | Status |
|---|---|---|---|---|---|
| Gate 1: mechanical area-sweep | engine `packages/engine-core/scripts/block13-cert-grade.mjs`, `cert-grade-and-report.mjs`, core in `src/registry/cert-grade-core.ts` | every parcel in the browsable extent, graded fail-closed; one wrong parcel = area FAIL (R3) | what the assertion itself gets wrong; OPS-5:17 records it "once passed a shape it said it rejected". Also cannot see parcels outside the extent it was handed, so a short-loaded county has a smaller browsable extent and sweeps clean | see FRAME QUESTION below | SHIPPED |
| Gate 2: operator R6 live QA | CC / PE, human | what the assertion missed; the catch tightens the assertion | at scale; one pair of eyes does not sweep 1.65 million parcels, and it is the last gate, not a coverage instrument | live product surface | SHIPPED (human) |
| R26 district match | cert-grade-core | district matches live zoning layer / dominant row | whether the live layer's stamp coverage is complete (STAMP-CENTROID-PRECISION was live for every pre-#386 whole-county stamp run) | live zoning layer | SHIPPED |
| R1/R2/R24 setback numbers | cert-grade-core | numbers match the per-parcel record, interior/corner-side distinct, all fields | whether the per-parcel record itself is right; it grades against the record, not the ordinance | per-parcel CAD/AGOL record | SHIPPED |
| R32 per-edge inset | `measurePerEdgeInsetForRings`, index-matched inward-normal | the DRAWN envelope's per-edge feet against each edge's setback | a defect shared by the frame it measures in; PLAIN-GEOM-INSTRUMENT (2026-08-08) shows this instrument producing a false 0/12 on a healthy store when run with dual projection frames | ring frame, see below | SHIPPED |
| R30/R31 front orientation | fresh `labelEdgesFromRoads` + situs-street-match token match | that the front setback sits on the actual street-frontage edge | road-name normalization gaps; ELGIN-CERT-RESIDUAL (a) is OSM abbreviations vs CAD situs abbreviations, a live open class | OSM road nodes + CAD situs | SHIPPED |
| R20 three-way convergence | cert path | PE == SmartCity == city GIS per field | a value all three inherit from one upstream source; convergence of three consumers of one input is the Harris pattern at field level | three serve surfaces | SHIPPED |
| R9 parcel-currency | cert path | every prop_id still exists in the current CAD | parcels present in CAD but absent from the loaded cohort, the exact inverse, and the Harris direction (CAD-COHORT-VINTAGE-DRIFT is the documented forward direction only) | live CAD | SHIPPED |
| R10 persisted == recompute | OPS-5 Gap #10; read-only recompute probe | drift between the stored atom and a fresh recompute | a deterministic error reproduced identically by both legs; same-input agreement again | atoms store vs recompute | SHIPPED as spec, per-cert run |
| R13 currency / no repealed code | cert path | that no repealed edition serves | repealed content in a jurisdiction whose edition metadata is itself wrong | corpus edition metadata | SHIPPED |
| `gradeUnzonedParcel` (`--grade-mode=unzoned`) | engine #222 cert branch | that each unzoned parcel carries a genuine honest-decline with a resolving cadastral ring | anything about parcels NOT in the roster; county certs run 20-parcel rosters, which is sampling by construction on the unzoned lane | atoms + live CAD ring | SHIPPED |
| `bastrop-district-cert-grade.mjs` | engine scripts | district-scoped cert grading | same roster-bound limit | atoms | SHIPPED |

### Warm-time and geometry-law instruments

| Instrument | Where it lives | What it checks | WHAT IT CANNOT SEE | Frame | Status |
|---|---|---|---|---|---|
| R28 ring recompute at warm | warm path under `--force-overwrite` | recomputes boundary primitive when stored normals disagree with the working ring | which ring is the RIGHT ring; see FRAME QUESTION | working ring (contested) | SHIPPED |
| R30 fresh edge relabel at warm | warm path under `--force-overwrite` | re-derives edge roles from fresh road labels; never promotes stale roles | road-data absence; Elgin returned 49/50 `no-road-adjacency` and the fix was OSM ingest, not a code change | OSM + situs | SHIPPED |
| Flag-lot rear gating | `detectFlagLotShape()`, engine #258/#260 | inward-normal opposition and same-street backing promotion, gated to flag/corner lots | ordinary-lot regressions are gated OUT by design, so it cannot see a defect that presents on an ordinary lot | parcel ring | SHIPPED, LIVE-VERIFY PENDING per backlog |
| Ground-truth predicate | engine `packages/engine-core/src/geometry/envelope-ground-truth.ts`, exports `checkEnvelopeContainment` and `checkEnvelopeGroundTruth` | containment + per-edge ground truth against the raw ring; predicate must equal plain geometry within 0.5 ft (Geometry Law 4) | anything its escape valves excuse; the law caps them precisely because "an instrument that can excuse wholesale drift is not an instrument" | RAW txgio ring | SHIPPED |
| Write-then-verify at promote | `promoteDepthWarmToStorage` + `src/depth-warm/__tests__/promote-ground-truth-gate.test.ts` | the predicate runs on the exact stored bytes that will serve | that the right parcels were offered to it; it grades what was written, never what was never attempted | stored bytes | SHIPPED |
| Live-ring conformance harness | `src/depth-warm/__tests__/twelve-parcel-live-integration.test.ts` | twelve live rings end to end against served store | twelve parcels; it is a conformance fixture, not a sweep | live serving ring | SHIPPED |
| `plain-geometry-twelve-sweep.mjs` | engine `packages/engine-core/scripts/plain-geometry-twelve-sweep.mjs` | naive independent measurement: envelope-edge midpoint to nearest txgio parcel edge, SINGLE shared projection frame via `projectRing` + `projectRingInFrame` | twelve parcels, same limit; and it produced a false 0/12 in its dual-frame form (PLAIN-GEOM-INSTRUMENT, CLEARED 2026-08-08) | txgio serving ring | SHIPPED |
| `projectRing` / `projectRingInFrame` | `src/depth-warm/geometry.ts:105` (exported) and `:152` (module-local); a second local copy in `src/warden/envelope-sanity.ts:152` | shared planar frame for parcel and envelope | UNVERIFIED-IN-SOURCE: `projectRingInFrame` is NOT exported from `geometry.ts` and is duplicated in the Warden module. Two copies of a frame primitive is the shape of the dual-frame bug that caused the false 0/12 | projection frame | SHIPPED with a duplication risk |
| Extended dry/apply parity equation | runbook 2026-08-08 amendment | `dryRun.verifyPass == apply.promoted + apply.computePassNotPersisted + apply.skippedIdempotent` | the same-input blind spot; and per the runbook the batch JSON today emits only `promoted`/`verifyPass`/`verifyFail`/`honestDeclines`/`declines.other`, so three of the four terms are not emitted | process counters | PARTIALLY SHIPPED (terms named, emission SHOULD) |
| Identical engineSha pin | runbook, binding | that a dry-run and its apply ran on the same 40-char commit | code drift is caught, data drift is not | git SHA | SHIPPED as discipline |

### The Warden (post-cert sweep, files never fixes)

Verified in live source: `packages/engine-core/scripts/warden-sweep.mjs` references six check names: `neighborConsistency` (9), `servePathTruth` (10), `crossStoreConsistency` (7), `certFreshness` (10), `envelopeSanity` (15), `serveTruthEdgeLabels` (5). `editionDrift` and `provenanceIntegrity` appear ZERO times, confirming the runbook's statement that they are deferred by ruling, not omissions. Files-never-fixes is enforced structurally by `src/warden/__tests__/files-never-fixes-import-guard.test.ts`, verified present.

| Instrument | What it checks | WHAT IT CANNOT SEE | Frame | Status |
|---|---|---|---|---|
| `neighborConsistency` | a parcel whose district is null/stale while over 0.75 of its geographic neighbors carry a current district; defectClass `MIXED-VINTAGE-NEIGHBOR` | a defect that is UNIFORM across a neighborhood; it is a relative instrument, so a whole short-loaded region has no districted neighbors to contrast against and flags nothing | atoms store, geographic neighbors | SHIPPED |
| `servePathTruth` | served payload matches DB truth | value correctness; it compares two representations, not either against reality. Its comparator was itself wrong twice (#234 wrong wire field names; WARDEN-MIXED-CITY-BLIND-SPOT) | served payload vs atoms | SHIPPED (v1.1 comparator) |
| `crossStoreConsistency` | atoms store vs txgio store agreement | anything when no `--cert-artifact` is supplied; it returns `MEASURE-EMPTY-COHORT` info and looks like a pass | atoms vs txgio | SHIPPED |
| `certFreshness` | recipe-version / cert timestamp staleness vs the supplied cert artifact | drift with no artifact supplied; the runbook says supply `--cert-artifact` explicitly or it "only reports that it has nothing to compare against" | cert artifact `when` field | SHIPPED |
| `envelopeSanity` (v1.2, #256) | envelope contained in parcel ring; area ratio in district regime bounds (SF-1 0.30-0.95, sliver <0.05, full-lot >=0.995); inset edges parallel within 12 deg; defectClass `ENVELOPE-SHAPE-ANOMALY` | a wrong-but-plausible envelope; a correctly-shaped envelope built on the wrong setback numbers passes every one of these three tests | txgio parcel ring | SHIPPED |
| `serveTruthEdgeLabels` (v1.3) | cert-path fresh `labelEdgesFromRoads` roles vs export-served roles after `prepareBoundaryEdgesForExport` at each edgeIndex; defectClass `CERT-VS-SERVE-EDGE-MISMATCH` | sampled parcels only unless a full cert roster is supplied; hit `WARDEN-SITUS-ADDR` (`situs_addr` vs `situs_address`), fixed PR #277 `dba7a82`, v1.3 sweep re-run still pending | cert path vs served payload | SHIPPED, RE-RUN PENDING |
| `editionDrift` | intended: code-edition drift per OPS-9 S5 | everything, it does not exist | none | DEFERRED BY RULING (verified absent in source) |
| `provenanceIntegrity` | intended: provenance chain integrity per OPS-9 S5 | everything, it does not exist | none | DEFERRED BY RULING (verified absent in source) |
| Warden scheduler / periodic trigger | intended: rolling re-sweep of onboarded jurisdictions | everything; runbook planner correction 4 states the scheduled trigger DID NOT SHIP, and v1 is planner-run by hand | none | DEFERRED |

Warden-level blind spot, and the most important line in this section: the Warden FILES, it never fixes. That is a deliberate structural constraint, not a limitation to be removed. But it means a Warden finding that nobody reads changes nothing, and the Warden has no instrument that grades whether its own findings were acted on.

### Regression and product-surface instruments

| Instrument | Where it lives | What it checks | WHAT IT CANNOT SEE | Frame | Status |
|---|---|---|---|---|---|
| Bastrop block-13 7/7 | `block13-cert-grade.mjs`, roster `BLOCK13 constant`, measurer `R32 index-matched inward-normal`, orientation gate fresh `labelEdgesFromRoads` R33 | that a shared-code change did not regress the proven reference block | new-generation defects; Geometry Law 6 rules block13 a FOSSIL: hand-built, self-referential answer key that never rode the bulk path. Passing block13 is not "at parity"; only the versioned conformance suite claims that | fossil answer key | SHIPPED, MANDATORY, FOSSIL |
| Product-surface smoke suite | doc_repo `scripts/product-surface-smoke.mjs` (verified present) | live GETs: engine `/health`, retrieval `/health`, `/health/search`, PE facets, PE atom-chain, card-vs-sheet setback equality, envelope sanity, corpus `/search` | three default Bastrop parcels (`48021:34073`, `48021:34785`, `48021:34017`) unless `SMOKE_PARCELS` overrides; it is a coherence check on three known-good nodes, never a coverage check | live product surface | SHIPPED |
| Drift-pin tests | engine #223 pattern (backfill table pinned to the live TS map) | a hand-authored script's assumed data shape diverging from the live source of truth | any script that never got a drift-pin test written for it; the pattern is a discipline, not a gate | script constant vs live map | SHIPPED as pattern |
| CI conclusion-string gating | runbook section 2 | that a merge rides a real `"success"` conclusion on the PR head SHA | test coverage gaps; green CI on an untested path | GitHub Actions | SHIPPED as discipline |
| Cert-freshness sweeps | Warden `certFreshness` + OPS-5 recipe-version rule | jurisdictions whose cert is behind the current recipe-version | nothing, without `--cert-artifact`; see above | recipe-version | SHIPPED, needs explicit invocation |
| Ledger POST (`onboarding_ledger_event`) | cortex Neon; `sourceKind` values `preflight` \| `cert-grade` \| `block13-quarantine` \| `warden-sweep` (runbook planner correction 2, ldt `onboardingLedgerIngest.ts`) | it records, it does not grade; absent env the report wrappers print-only and byte-identical, so a missing POST is silent | event stream | SHIPPED |
| CC County Ledger v2 | Vercel project `cmdcenter` | per-registry-row gate verdicts, cert label/date, per-rail coverage, open defect classes, source vintages | a jurisdiction with no gate run recorded; it now honestly shows "no gate run recorded" rather than a misleading UNCERTED default, which is a fix, but the absence is still an absence | ledger store | SHIPPED |

## THE FRAME QUESTION (load-bearing, and unresolved)

Every geometry instrument grades against SOME ring. Which ring is truth was settled by the Geometry Law on 2026-08-07 and the cert lane has not been reconciled to it. Geometry Law rule 1:

> ONE RING PER PARCEL: the geometry the product displays (txgio serving ring) is the geometry envelopes are constructed FROM, verified AGAINST, and served ON. Alternative sources (live CAD) are currency instruments that FLAG divergence; they never silently substitute.

The decision names its own unreconciled item at line 36:

> The cert lane's historical BCAD grading frame is a NAMED OPEN ITEM: reconcile cert frame with the serve-consistency law before the next county cert wave.

### The four line references, verified verbatim 2026-08-09

Two of the four carry a 2026-08-08 correction block; two do not. Read exactly:

1. `90_operations/OPS-5_cert_standard.md:34`, a CORRECTION block, present:

> **CORRECTION 2026-08-08:** the R28 line below names BCAD as "the working ring." This is SUPERSEDED by the Geometry Law (`_decisions/2026-08-07_envelope_saga_close_and_geometry_law.md`, engine PR #273 Serve-Consistency): **txgio is THE truth frame** that envelopes are constructed from, verified against, and served on. BCAD is demoted to a currency/divergence-reporting instrument only: it flags `PARCEL-RING-SOURCE-DIVERGENCE`, it never silently substitutes as the working ring. Any cert or warm-time gate still grading against the BCAD ring as the working frame is running the pre-Geometry-Law frame and is a named open item (`_decisions/2026-08-07_envelope_saga_close_and_geometry_law.md` calls out the cert lane's historical BCAD grading frame explicitly as unreconciled). Read "BCAD ring" below as legacy language pending that reconciliation, not current doctrine.

The R28 line the correction governs is `OPS-5:37`:

> - **R28**: recompute boundary primitive when stored normals disagree with the working ring (winding swap at equal vertex count). (Legacy text named "BCAD ring" here; per the Geometry Law the working/truth ring is txgio, with BCAD divergence reported separately, not substituted.)

2. `90_operations/OPS-2_county_onboarding_runbook.md:33`. This line is a section heading, not the BCAD claim:

> ### STAGE 4 — INSET (mechanical; buildable-envelope atom)

The BCAD claim in OPS-2 lives at line 35, a CORRECTION block, present:

> **CORRECTION 2026-08-08:** "BCAD rings trusted, no scrub (A5)" below is SUPERSEDED by the Geometry Law (`_decisions/2026-08-07_envelope_saga_close_and_geometry_law.md`, engine PR #273 Serve-Consistency). **txgio is THE truth frame**, the geometry envelopes are constructed from, verified against, and served on. BCAD is demoted to a divergence-reporting instrument (`PARCEL-RING-SOURCE-DIVERGENCE`); it flags currency mismatches, it never silently substitutes as the working ring. This is a named open item in the Geometry Law record: the cert lane's historical BCAD grading frame still needs reconciliation against this rule before the next county cert wave. Do not read "BCAD rings trusted" as current doctrine.

The corrected body line follows at `OPS-2:37`:

> Working ring is txgio (not BCAD; see correction above), no scrub (A5); recompute primitive on ring-swap + winding invariant (R28); edge-role re-derive to frontage (R30); inset per-edge (R0); conditional convexity gate (R29); invalidate stale envelope on source-repeal (R27).

3. `90_operations/PHASE_C_HANDOFF_bastrop_warm.md:35`, UNCORRECTED, verbatim:

> - GEOMETRY: BCAD rings trusted, NO scrub (A5). On re-warm, RECOMPUTE the boundary primitive against the ring (winding invariant R28) + RE-DERIVE edge roles to actual frontage (situs-street-match R30). Conditional convexity gate (R29 — convex only if the lot is near-rect). Invalidate stale envelope on source-repeal (R27).

4. A repo-wide grep across `90_operations/` and `90_runbooks/` for "BCAD ring", "BCAD rings", and "working ring" returns exactly four hits: `OPS-2:35` (correction), `OPS-5:34` (correction), `OPS-5:37` (corrected body), `PHASE_C_HANDOFF_bastrop_warm.md:35` (UNCORRECTED). One further BCAD mention exists in `onboarding_defect_class_backlog.md:61` but it is descriptive of a unit-test fixture ("Unit tests pass for 80577/80578 BCAD rings"), not a frame ruling.

### Open item, recorded not fixed

FRAME-RECONCILIATION is an open item, not closed by this doc. Three of four doc instances now carry an explicit correction; `PHASE_C_HANDOFF_bastrop_warm.md:35` still states "BCAD rings trusted, NO scrub (A5)" with no correction attached, and a fresh reader of that handoff alone would run the pre-Geometry-Law frame. Per instruction, this inventory does not edit the other docs.

The deeper half is now RESOLVED, and the answer is worse than doc lag. Verified in live source by the planner on 2026-08-09, `P:\hauska-engine` HEAD `ed2498f`, `packages/engine-core/src/registry/cert-grade-core.ts` at three separate call sites, lines 330-331, 452-453, and 505-506, each reading:

```
const bcadRing = bcad[0]?.ring;
ring = bcadRing ? scrubLotLineRing(bcadRing) : null;
```

The cert lane fetches the BCAD ring and grades against it. It also passes that ring through `scrubLotLineRing` before grading. So the cert lane currently violates TWO Geometry Law points at once: INV-1 one-ring-per-parcel, because it grades on a frame the product does not serve, and INV-2 truth-is-the-raw-ring, because it measures against a scrubbed representation rather than the raw one. Line 706 of the same file acknowledges the resulting divergence in a comment, "Edge-count mismatch (TXGIO primitive vs BCAD ring): warm uses road-label path," and falls back to a second code path when the primitive and the ring disagree on edge count.

This is a live instrument defect, not a documentation defect, and it means every cert grade produced by this lane was computed in a frame the Geometry Law retired. It is the substantive content of the named open item that the Geometry Law decision said must be reconciled before the next county cert wave.

CONFIRMED ON TRUNK, not branch-local. The read above was taken on branch `feat/property-fact-writers`; `git show origin/main:packages/engine-core/src/registry/cert-grade-core.ts` carries the identical pattern at lines 335-336, 463-464, and 521-522, with `scrubLotLineRing` imported at line 31. So the defect is shipped on main and is not an artifact of an in-flight branch.

## DEFECT CLASSES WITH NO INSTRUMENT

Classes the backlog or the record names where no gate detects them.

| Class | Named where | Why no instrument sees it |
|---|---|---|
| SHORT-LOADED-SOURCE (Harris 48201) | `_inbox/2026-08-09_L2_W3R2_RESUME_REPORT.md`; `_inbox/2026-08-09_MULTI_SHP_sweep_summary.md` | No county-extent, bounding-box, or artificial-wall instrument exists anywhere in the factory. Every count-based instrument inherits the defect. The one-shot multi-shapefile sweep is an audit artifact, not a wired gate, and nothing re-runs it on a new vintage. THIS IS THE HIGHEST-PRIORITY MISSING INSTRUMENT. |
| CAD-COHORT-VINTAGE-DRIFT (reverse direction) | backlog, 3 Caldwell members + 27 Hays roster swaps | R9 checks cohort-to-CAD (a loaded parcel missing from live CAD). Nothing checks CAD-to-cohort (a live CAD parcel missing from the loaded cohort), which is the Harris direction. |
| STAMP-CENTROID-PRECISION residue | backlog, "every pre-#386 whole-county stamp run (all ZONING_LAYERS cities)" | The fix (ldt #386) is in; per-city applies are HELD for blast-radius review. No instrument grades whether a stamped city's coverage is complete against its zoning layer. The Warden's `neighborConsistency` catches SOME of it only where districted neighbors exist to contrast against. |
| PROPID-GEOMETRY-NONUNIQUE | backlog, 48021:29431 | No instrument detects two distinct geometries under one prop_id; it was found by a scoped debug, and the ruling was to exclude the parcel, not to build a detector. R15-family follow-up OPEN. |
| EDGE-ROLE-MISJUDGED (live verify) | backlog, 48021:80577/80578 | Code fixed engine #258/#260 with unit tests, but marked LIVE VERIFY PENDING. Unit tests on stored fixtures are not a live-surface probe. The only detector of record was a stakeholder screenshot (Valerie Thompson, 2026-08-03), a human, not an instrument. |
| CERT-VS-SERVE-EDGE-MISMATCH at cohort scale | backlog, ~4,003 FIPS 48021 promoted, re-persist IN FLIGHT | `serveTruthEdgeLabels` is a SAMPLED check. There is no full-cohort serve-truth sweep. |
| DRY-APPLY-PARITY-DRIFT accounting terms | backlog 2026-08-08; runbook amendment | The extended parity equation needs `computePassNotPersisted`, `writeThenVerifyRefused`, `promoteGateRefused`, `skippedIdempotent`, but the batch JSON emits only `promoted`, `verifyPass`, `verifyFail`, `honestDeclines`, `declines.other`. The instrument is specified and not emitted. |
| Ledger POST silence | runbook planner correction 3 | Absent `LEDGER_INGEST_URL`/`LEDGER_INGEST_KEY` the report wrappers print-only and byte-identical, so a run whose POST never happened looks exactly like a run whose POST succeeded. No instrument checks that a cert or gate result actually reached the ledger. |
| Warden finding acted-on | Warden design, files-never-fixes | Correct by design, but nothing grades whether a filed finding was ever fixed. Backlog rows are hand-maintained. |
| Registry-row correctness | OPS-8 gate design; CAD-LAYER-INDEX-UNVERIFIED | Seven of eight gate checks read the frozen row. The row itself is graded only by a runbook rule (live-probe layer name + fields + one roster query), never by a check. |
| Setback VALUE correctness vs ordinance | OPS-5 R1 | Every setback instrument grades against the per-parcel record. Nothing mechanically grades the per-parcel record against the ordinance text; that is the Z4 planner row-verification step, a human act. |
| Deadlock-consumed idempotency pass | `_inbox/2026-08-09_L2_W3R2_RESUME_REPORT.md:141` | Six of nine batch counties plus Bosque died on Postgres 40P01 deadlocks from 8-concurrent writes to one table, so their apply2 pass was consumed as the load pass: seven counties have no genuine idempotency re-run. Nothing detects that an idempotency check was silently spent. |
| Truncated status files | same report line 141 | The runner's status writer does not truncate, leaving files reading `48061 OK` followed by an orphan `LY1_FAILED exit=1`. A naive reader sees only "OK". No instrument validates status-artifact integrity. |

## WHAT COULD NOT BE VERIFIED

- Whether `cert-grade-core.ts` fetches the txgio ring or a BCAD ring on engine HEAD `ed2498f`: RESOLVED 2026-08-09 by planner source verification. It fetches the BCAD ring and scrubs it, at three call sites. See the FRAME QUESTION section above. Both follow-ups are now closed. `packages/engine-core/scripts/block13-cert-grade.mjs` imports its grading functions directly from `../src/registry/cert-grade-core.ts` at line 46, so it INHERITS the same BCAD-scrubbed frame rather than fetching its own ring; the comment at line 37 states the core lives there "precisely so other src/ modules" share it. And the pattern is present on `origin/main`, so it is not branch-local. The block13 7/7 standing regression gate therefore also grades in the retired frame.
- `projectRingInFrame` is module-local in `src/depth-warm/geometry.ts:152` and separately re-implemented in `src/warden/envelope-sanity.ts:152`. Whether the two implementations are byte-equivalent: UNVERIFIED-IN-SOURCE. Two copies of the primitive whose dual-frame misuse produced the false 0/12 is a standing hazard.
- Whether the extended dry/apply parity terms are emitted by any batch script today: UNVERIFIED-IN-SOURCE (runbook says SHOULD, not DOES).
- Whether the ldt `onboardingLedgerIngest.ts` `sourceKind` enum matches the four values the runbook records: not read in this pass, UNVERIFIED-IN-SOURCE.
- Whether the Warden `serveTruthEdgeLabels` v1.3 sweep has been re-run since PR #277 (`dba7a82`) fixed the `situs_addr` column error: UNVERIFIED, backlog says pending.
- Total live parcel count for Harris County: the 1.65 million figure is the expected order of magnitude carried in the task frame; the measured short-load numbers (536,512 est / 564,948 loaded / west half discarded / true western extent ~ -95.96 vs loaded wall -95.4364) are all verified in the resume report, but no verified authoritative full-county parcel count was located in this pass.

## THE STANDING RULE THIS DOC ADDS

An instrument's agreement with another instrument is evidence only when the two read DIFFERENT FRAMES. Four readings of one input are one reading. Before any completeness claim, name the frame each instrument read, and if they are the same frame, the claim is unproven no matter how many instruments agreed.
