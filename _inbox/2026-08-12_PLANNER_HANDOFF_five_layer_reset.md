---
title: Planner handoff — five-layer reset and the Factory 1.5 build
date: 2026-08-12
status: active-handoff
from: doc_repo planner session 2026-08-12
purpose: Restore the five-layer frame as the organizing structure, reconcile every lane against it, and hand the Factory 1.5 build to a fresh planner with a specification rather than a conversation.
---

# Planner handoff — five-layer reset

## Why this document exists

Two things happened this session that this handoff corrects.

**The program drifted.** Twenty-plus lanes ran and produced real movement, but scope grew by three programs mid-session with no layer assignment, the QUEUED WORK register was not maintained, `_STATE.md` was not regenerated as work landed, and lane state lived in chat rather than in the repo. A fresh agent reading `_STATE.md` would not have found most of it. That is the same failure shape as uncommitted code: correct work, no durable pointer.

**The planner propagated a fabricated claim.** Z1 reported "City of Houston has no Euclidean zoning; do not invent a zoning layer" as SEARCHED-AND-ABSENT. The planner repeated it in a canonical session capture as a market signal. The operator challenged it. Verified at source: `z1_houston_probe.py` line 426 carries `if city_key == "houston-tx": return {...}` — a hardcoded early return **before any network call**. Houston was never probed. The word SEARCHED in that status was false.

**The lesson that generalises: the factories exist to remove agent judgment from repeatable work. Where the mechanical part is missing, an agent fills the gap with guesses and the output looks identical to real work.**

## THE FIVE-LAYER FRAME — restored as the canonical organizing structure

Operator ruling 2026-08-12. Every lane, every proposal, every dispatch is assigned to a layer. A lane without a layer is not scoped.

| Layer | What it is | State |
|---|---|---|
| **1. Foundation** | Statewide parcel fabric, NFHL, the factory-joint contract | 253/254 counties; flood loaded; contract proven in production |
| **2. Measurement** | Writers + scorer making the data count honestly | Running. 14/14 rails have writers; 8 instrument defects found, 2 open at capture |
| **3. Integrity** | Cert truth in the real frame, roads | Roads landed honestly (`not-yet` x254); statewide ingest still unauthorised |
| **4. Depth** | The F1/F1.5/F2 factories — the forever engine | **Factory 1.5 front half is NOT BUILT.** This is the MAIN GAP |
| **5. Launch** | 76j capacity, branding, billing, MCP revival, report engine, Smart Files, GCP migration | Parallel track; nothing here blocks the gate |

**The strategic read that still holds: the bottleneck moved from ACQUISITION to WIRING.** All eight instrument defects this session were wiring. Zero were acquisition.

**The scope-drift rule this frame enforces:** the report engine, Smart Files, and the Vercel→GCP migration are all LAYER 5. Foundation and Measurement are not closed. Layer 5 work does not start until they are, except where explicitly ruled otherwise.

## QUEUED WORK — the register, restored

**If it is in this list it has NOT been executed.** In-flight is a separate column. This table is the pickup list for a fresh agent.

| # | Layer | Lane | Status | Blocked on |
|---|---|---|---|---|
| Q1 | 4 | **Factory 1.5 — build the front half** | SCOPED, not dispatched | This handoff |
| Q2 | 4 | Utility lines probe (water/sewer/electric) | SCOPED, not dispatched | This handoff |
| Q3 | 2 | A2 — special-district → rail-corridor → wells | **IN FLIGHT** (holds atoms slot) | — |
| Q4 | 2 | Flood metros (PostGIS path, Harris ~1,862s measured) | READY | atoms slot |
| Q5 | 2 | Remaining applies: footprint, easement, envelope, mud | READY | atoms slot |
| Q6 | 4 | Z1 re-probe with folder recursion + host catalogue | BLOCKED | Q1 |
| Q7 | 4 | Four owed Z1 corrections (see below) | READY | a free lane |
| Q8 | 2 | SWEEP findings — 47 findings, 14 tests that cannot fail | READY | a free lane |
| Q9 | 3 | Roads statewide ingest | HELD | operator ruling |
| Q10 | 5 | Report engine + audience profiles + comparison mode | SCOPED | Foundation/Measurement close |
| Q11 | 5 | Smart Files as artifact store | SCOPED | Q10 |
| Q12 | 5 | Vercel → GCP migration | SCOPED | gate close |
| Q13 | 1 | Ector 48135 re-key on geo_id (~71,673 atoms) | READY | a free lane |
| Q14 | 2 | Ledger endpoint performance — 10s to >145s under write load | READY | a free lane |

## Where the numbers stand

**Last independently planner-verified live read: satisfiedCells 405 / texasCompletenessPct 12.909% / totalCells 3,556.** The ledger endpoint has since degraded past 145s under concurrent write load and could not be re-read at handoff time — see Q14. A2 has been writing since, so the true figure is higher. **Do not quote a number you have not read yourself.**

Session start was 89 satisfied / 0.7689%. That start figure is planner self-report; no ledger history table exists. **Capture a ledger snapshot at the start of the next arc so deltas become falsifiable.**

Cells in `no-writer` / `no-atom`: **0**. All 14 rails have a writer and an atom family. Criterion 3 of the launch gate is structurally closed.

## What landed this session

**Layer 1 — Foundation.** Wave 4 landed the 57 reprojection counties (196→253); the gap was an EXECUTION gap, not a source gap — `--reproject=3857` was already merged and had never been run. B2 wrote 590,212 parcel-node atoms.

**Layer 2 — Measurement.** Depth predicate fixed (zoning 19→1 honest). Geometry denominator corrected (+53 cells). Derived `hasWriter` + capability probe. `process.cwd()` regression fixed, 1,016 cells restored. Console derives its rail list from the API. A1 applied owner+landuse+cad across 15 CAD counties (13.1M atoms, zero verifyFailures) and PROVED the paid-tier gate fires. Flood 178 counties / ~2.4M atoms.

**MCP1 widened the atom chain 4 → 15 slots and DEPLOYED** (engine #318/#320, mcp #59; revisions `hauska-retrieval-api-00067-gow`, `hauska-mcp-server-00042-25d`). Derived from `PARCEL_KEYED_PROPERTY_ENTITY_TYPES`, hardcoded regex replaced, cross-repo drift test added. `road-node` correctly remains out — it is roadNodeId-keyed, not parcel-keyed. **Five hardcoded lists remain**, listed in its artifact.

**W2 closed the symnum defect.** Contract 1.21.0 adds `unknown` to WellStatus/WellType; engine #321 merged. Prefer `GIS_SYMBOL_DESCRIPTION`, explicit `PRODUCING_SYMNUMS={4,5,6}`, unmatched → `unknown`. Staging exposure was **563,935 rows across 43 SYMNUMs (40.4%)** — of which ~70,000 (SYMNUM 9 "Canceled/Abandoned" 44,563; SYMNUM 21 "Injection/Disposal" 25,005) would have shipped as PRODUCING. **well-fact atoms written with the default: 0. remediationNeeded: false.** The halt was correct and caught it in time.

**Layer 3 — Integrity.** Roads salvaged (#293), writer built, synthetic-id landmine closed (12,658 rows migrated), Bastrop held at 19,907. Statewide ingest NOT run.

**Layer 4 — Depth.** H1 shipped the Factory 1.5 BACK half (see below). Z1 probed 263 cities across two metros. ZCHAL challenged and largely cleared Z1's data while indicting its method.

**Flood metros unblocked.** A vertex-density grid index FAILED (slower — cost is vertex-volume dominated, not candidate-count dominated). PostGIS **zone-major** succeeded: 48099 planMs 1,818,708→5,025 (362x); Harris measured ~1,862s. **Point-major LATERAL is ~218x slower** — detoast each mega-polygon once per batch, not once per point. Parity proven by sha256 digest.

## FACTORY 1.5 — what it actually is, and what is missing

**This is the central finding of the session and the main handoff item.**

### The insight that produced it

**The one-slot rule is a WRITE constraint, not a throughput ceiling.** Acquisition never needs the atoms slot. Factory 1 already had a dry/apply split but DISCARDED the planned payload — a 1,145-byte artifact for a county that had built 62,394 atoms — so acquisition and write were welded together. Factory 1.5 breaks that weld: N parallel acquisition lanes produce validated, write-ready payloads; one writer drains the queue whenever the slot is free. Slot contention then costs LATENCY TO VISIBLE COVERAGE, never THROUGHPUT OF THE EXPENSIVE WORK.

### The factory model (operator-ruled; REVERSED from older docs)

- **Factory 1 — statewide fabric.** Jurisdiction-free layers; one source blankets a state; cost roughly constant per state regardless of county count.
- **Factory 1.5 — acquisition / staging.** Find, fetch, parse, normalise, PERSIST with provenance. Network-bound, failure-prone, infinitely parallel, SLOT-FREE. Both other factories consume its output.
- **Factory 2 — county / jurisdiction depth.** Zoning, setbacks, code text. The moat.

### What EXISTS (the back half — built, proven, sound)

H1 (engine PRs #316/#317): `tx_zoning_district_staging`, migration `0074`, payload contract at `packages/engine-core/src/zoning-staging/payload-contract.ts`, source registry recording WHICH TIER satisfied each city, drain interface at `zoning-staging/drain.ts`.

Proven on two genuinely divergent schemas — Elgin (parcel-joined, 26 attrs, `Zone_Code` + long-name twin, domain map A→R-4, CITY_LIMIT filter, 3,209 rows) and Smithville (bare district polygons, OBJECTID+ZONING only, 91 rows). Unmapped source fields RETAINED VERBATIM per the harvest-completeness ruling. Empty `source_tier_satisfied` FAILS CLOSED at both TS and SQL-CHECK layers.

Its own adversarial pass caught a county-scoped drain MIXING Elgin's and Smithville's `C-3` districts — same code, different meaning — fixed by requiring `cityKey`. **ZCHAL specifically cleared the payload contract: the cityKey scoping is sound and Deer Park would slot in cleanly. The weakness is upstream, in discovery.**

### What is MISSING (the front half — NOT BUILT)

**Z1 is not a factory. It is an agent with a guess list.** Compare against the other two:

| Property | Factory 1 | Factory 2 | Factory 1.5 today |
|---|---|---|---|
| Deterministic runner | `run_sweep.mjs`, versioned | county recipe / cert lane | **none — an agent improvises** |
| Enumerable input | county queue from store truth | jurisdiction roster | **synthesised hostnames** |
| Progress / resume | `progress.json`, landed-only skip | onboarding state | **none** |
| Typed per-item outcome | landed / halted | six named decline codes | **found vs absent, undifferentiated** |
| Fail-closed gate | WGS84 bbox assert | warm preflight gate | **none — empty result reads as ABSENT** |
| Proven artifact | 132 counties swept | Bastrop certified | 2 cities, same source type |

**Six probe-method defects found by ZCHAL:**

1. **Houston hardcoded** to SEARCHED-AND-ABSENT before any network call (`z1_houston_probe.py:426`).
2. **Synthesised hostnames** — `f"https://gis.{slug}tx.gov/arcgis/rest/services"` against hosts that mostly do not resolve. **The municipal-host path returned zero services in 104 of 104 cities.** Half the stated search was a no-op counted as though it ran; **64 of 105 absences rest on two probes, both empty.**
3. **No folder recursion** — Deer Park's zoning sits one level down at `WGS84/Zoning_WGS84` (301 polygons, 18 codes). Z1 queried the right host, got three folders, logged `services: []`.
4. **Layer identification by name regex** — `/zon/` matched hurricane evacuation zones, forest seed zones, rail blast zones. ZCHAL's own first automated pass fell into this trap, reporting 7 of 7 false hits.
5. **Absence taxonomy collapsed** — one status carrying at least seven meanings.
6. **Roster fields actively wrong** — Houston `code_text.publisher` reads `"none"` marked `"verified"`; the evidence string is doctrine citing the roster citing doctrine, a closed loop with no observation in it.

### The false-absence rate — measured, and honestly bounded

**21 cities resampled. Strict false-absence 4.8% (1 of 21, Deer Park); 14.3% counting misclassified-but-unrecoverable.** BELOW ZCHAL's pre-registered 15-45% band; it recorded its own prediction as REFUTED.

**But treat 4.8% as an UPPER bound on a biased sample and a LOWER bound on the true rate:**
- Sampling was deliberately one-directional — largest and most-likely-zoned cities first.
- The one confirmed recovery was found BY HAND; ZCHAL's own automated pass also missed it.
- Both methods are AGOL-centric and **blind to self-hosted servers behind unguessable hostnames**, and to zoning published only as PDF/tile/paper.

**Z1 was right where it looked hardest:** League City's apparent hit is Dickinson's service (PIP=0, extent stops south of the city) and both Pasadena hits are California. Do not assume Z1 was uniformly wrong — its data was mostly right; its METHOD was unsound.

### Houston — the correct answer

**Verdict: PARTLY_TRUE_BUT_WRONG_FOR_PRODUCT.** No Euclidean zoning districts is CORRECT. "Absent" is NOT.

ZCHAL reports Houston publishes what the product needs on `mycity2.houstontx.gov` (a host absent from Z1's guess list): **Special Minimum Lot Size** (722 polygons, 236 distinct minimums 2,176–55,648 sq ft, ordinance-cited, SFR flag) and **Special Minimum Building Lines** (195 polygons, 30 distinct setbacks 10–100 ft). Those are the two constraints that bound a residential envelope. Extents fall inside city limits — checked specifically for the RRC-wells / Parcels_Utah name-extent trap; it is not one.

**PLANNER CAVEAT — VERIFY BEFORE ACTING.** The planner could NOT independently reproduce these layer counts: both `mycity2.houstontx.gov/arcgis4/rest/services` and `mycity.houstontx.gov/arcgis/rest/services` returned 404 on direct probe at handoff time (the second redirects to `mycity.maps.arcgis.com`). The HARDCODE at line 426 is verified beyond doubt. **The layer inventory is agent-reported and must be re-probed before it is staged or quoted.**

**Houston must never be staged AS ZONING.** Minimum-lot-size and building-line constraints are a different shape from Euclidean districts and need their own treatment in the payload contract.

## THE FOUR OWED Z1 CORRECTIONS (Q7 — ready now)

1. **Recover Deer Park** — stage `https://gis.deerparktx.gov/arcgis/rest/services/WGS84/Zoning_WGS84/MapServer/0`, layerId 0, codeField `Code`, 301 polygons, 18 Euclidean codes, PIP verified returning SF1.
2. **Reclassify Houston** — not SEARCHED-AND-ABSENT. Re-probe the COHGIS layers first, then classify under the new taxonomy. Never stage as zoning.
3. **Mark Webster HOST-BROKEN** — distinct from absent.
4. **Downgrade the 84 no-signal rows** from SEARCHED-AND-ABSENT to **NOT-FOUND-UNKNOWN-WHY**, pending re-probe with folder recursion and a real host catalogue.

## THE ABSENCE TAXONOMY (ZCHAL proposed seven; adopt it)

`SEARCHED-AND-ABSENT` is doing too much work. Each status implies DIFFERENT product behaviour, and collapsing them is how a probe failure wears the costume of a data gap:

- **NO-ZONING-AUTHORITY** — unincorporated; TX counties generally cannot zone. Answer affirmatively.
- **NO-EUCLIDEAN-REGIME** — authority exists, no districts (Houston). Serve the constraints that DO exist.
- **ORDINANCE-NO-GIS** — regulation exists, not published as GIS. Cite the ordinance; do not claim absence of regulation.
- **AUTH-WALLED** — GIS exists behind auth. A different acquisition motion.
- **HOST-BROKEN** — the endpoint is down, not the data.
- **NOT-FOUND-UNKNOWN-WHY** — the honest default. Re-enters the queue.
- **LAYER-FOUND** — staged.

**The governing rule: only a POSITIVE determination writes an absence. An empty result is NOT-FOUND-UNKNOWN-WHY and re-enters the queue.** That single rule kills the entire Houston class.

## SWEEP — 47 findings, and the ones that matter

The silent-fallback audit swept three repos and **TWELVE writers** (the dispatch said eleven; it measured twelve on origin/main).

**14 TESTS THAT CANNOT FAIL** — including `plan-county-well-facts.test.ts` which asserts SYMNUM 11 → `producing`, i.e. **a correct fail-closed mapper FAILS that test.** The test locks in the defect. Read the artifact's `testsThatCannotFail` list before touching any writer.

**16 CI-enforceable greppable patterns proposed** — e.g. `ci-no-bare-status-default` matching `return "(producing|oil|active|spur)"` scoped to classifier files. This is the durable answer: the measured base rate in this program is **hook-shaped controls that fail closed work 1-for-1; protocol-step-shaped controls are 0-for-3.**

**15 guards assessed for reachability.** The paid-tier gate is PROVEN reachable (A1 mutated an atom to `public-free` and the run aborted with `wroteToStore=false`). Most others are trusted on faith — the artifact names the specific test that would prove each.

**Zero fixes applied**, deliberately: no candidate met the one-line fail-closed + failing-first-test bar without colliding with W2 or A2. Correct restraint.

**Its own stated blind spots:** ternaries, early returns, default parameters, Zod `.default()`/`.catch()` inside dependency packages, and vacuous in-memory verify patterns that do not look like defaults. **The true count is higher than 47.**

## Q1 — FACTORY 1.5 BUILD SPEC (the main handoff item)

Build the front half as a real factory, modelled explicitly on `run_sweep.mjs` (Factory 1) and the county recipe (Factory 2). **OPERATE THE PATTERN, DO NOT INVENT ONE.**

**Required properties, each mirroring an existing factory:**

1. **A versioned deterministic runner** in the repo — not a `P:/tmp` script. Factory 1's `run_sweep.mjs` is now at `packages/engine-core/scripts/sweep/run_sweep.mjs`; follow that placement. Parameterise the queue and the target; never hardcode a path or a city.
2. **A catalogue-driven queue.** Source hosts from REAL directories — ArcGIS Hub search API, state clearinghouse, COG holdings (CAPCOG, H-GAC, NCTCOG), county REST roots, municipal open-data portals. **NEVER synthesise a hostname.** The queue is enumerable input, like Factory 1's county list from store truth.
3. **Folder recursion and typed layer identification.** Recurse ArcGIS folders (Deer Park). Identify candidate layers by GEOMETRY TYPE + FIELD SHAPE, never by name regex (`/zon/` matched hurricane evacuation zones).
4. **A typed outcome enum** — the seven-status taxonomy above. No boolean found/absent.
5. **Fail-closed.** Empty result → NOT-FOUND-UNKNOWN-WHY, re-enters the queue. Only a positive determination writes an absence. **No hardcoded per-city branches, ever.**
6. **Progress and resume**, like `progress.json`: what was probed, what was tried, what was found, so a method improvement re-runs only the unknowns. Note the Factory 1 resume-hole lesson — the skip set must be `landed`-only; a halted-never-landed item must re-enter, or you get a silent hole no count-based gate can see.
7. **A close artifact per run** with per-item verdicts and the search paths attempted.

**Verification bar:** prove it on a set that spans source types — an AGOL-hosted city, a self-hosted city (Deer Park), a county-hosted enclave, a no-Euclidean city (Houston), and a genuine absence. Two Bastrop cities on the same source type is what produced this problem.

## Q2 — UTILITY LINES PROBE SCOPE

**Operator ruling: water, sewer and power lines from the CAD layers must be part of the feasibility study.** Utility availability is often THE constraint that kills a site, ahead of zoning.

**Probe first, scope after — do not assume a rail.** Utility GIS is frequently NOT public: withheld for security, sometimes available only under agreement, sometimes only as a service-availability letter. Some cities publish mains; almost none publish laterals. Electric is usually the utility's own data, not the city's.

Expect **three separate sources with different postures** — water, wastewater, electric — and expect the honest product answer for many parcels to be *"utility availability requires a service letter from the provider,"* which is itself a correct and useful answer.

Apply the same skepticism the RRC and Utah probes earned: verify coverage by groupBy AND corner probes, never by advertised name or extent metadata alone. Both directions have bitten — `Parcels_Utah` advertised a state with a county extent; `UtahRoads` metadata read Wasatch-Front while its groupBy returned all 29 counties.

## What a fresh planner should do first

1. **Read this document, then `_STATE.md`, then the artifacts it names.** Do not reconstruct state from chat.
2. **Read the live ledger yourself.** The number in this document is stale by design.
3. **Check A2's status** — it holds the atoms bulk-writer slot and may have completed. Its close artifact is `_inbox/2026-08-12_A2_staged_rails_apply_close.json`.
4. **Dispatch Q1 (Factory 1.5) and Q7 (the four owed corrections).** Q7 is small and ready; Q1 is the substantial build.
5. **Do not open Layer 5 work** — report engine, Smart Files, GCP migration — until Foundation and Measurement close. All three are scoped and none is urgent.

## Standing rules that cost real time to learn

- **A status is a CLAIM.** Writing a brief is not dispatching it. Houston's SEARCHED status was a hardcode.
- **When a fix produces no gain, that is DATA.** The flood grid index failing is what found the real cause.
- **A performance conclusion has a SHELF LIFE.** The atoms table went 16.2M → 25.3M in one session.
- **A phase-level timing attributes cost to the phase's NAME, not what it does.**
- **Prescribe the INVARIANT, never the RECONSTRUCTION.** entityId shapes are NOT uniform across writers.
- **Look for two numbers that should agree and don't.** Nearly every finding came from this.
- **Quote a ratio WITH its counting rule.** "26 of 47" drifted three sessions because its method was never stated.
- **Verify at source, including this document.** Two planner claims proved false this session.
- **Merge only on the CI conclusion STRING "success"** — `gh pr checks` prints "pass", which is not it.
- **An empty result is not an absence.**
