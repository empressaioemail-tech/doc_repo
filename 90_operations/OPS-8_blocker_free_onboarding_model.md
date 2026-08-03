---
id: OPS-8_blocker_free_onboarding_model
title: OPS-8 — Blocker-Free Onboarding Model (pre-flight gate → run-what-passes → dual defect ledger)
date: 2026-08-03
status: model (operator-ratified design for onboarding the rest of Bastrop county + cities, and the fan; adversarial-review corrections applied 2026-08-03 — foundation gap, 8th check, pre-flightability caveat, cert-with-declined-core-rail open ruling)
owner: nick
related: [OPS-2_county_onboarding_runbook, OPS-5_cert_standard, OPS-7_coverage_and_honesty_doctrine, OPS-WDLL_the_factory, PHASE_D_layer23_cohort_full_coverage, 2026-08-03_SWEEP_deployed_final_state, bastrop-county-cities-scope-smithville-ecode360]
purpose: Define what a SUCCESSFUL, blocker-free onboarding looks like — designed directly from the blockers that stopped the Bastrop-city round. A jurisdiction earns the right to run via a PRE-FLIGHT GATE (every known blocker checked up front); runs what passes + honest-declines the rest; and every gap feeds a dual defect ledger (CC console + class-grouped backlog) fixed in isolation off the critical path. No mid-run stall for any blocker we have seen before.
---

# OPS-8 — Blocker-Free Onboarding Model

## THE PRINCIPLE
A jurisdiction EARNS THE RIGHT TO RUN. Before a single warm cycle is spent, it passes a PRE-FLIGHT GATE that checks every condition that blocked us onboarding Bastrop city. Two outcomes: PASS → it runs to completion with no mid-run stops; FAIL (per rail) → that rail honest-declines with a named reason, the jurisdiction runs the rails that passed, and the gap goes on the defect ledger. THE GATE FAILING IS NOT A BLOCKER — a blocker is the line stalling mid-run with an agent stuck. The gate refusing a rail up front, cleanly, is the OPPOSITE of a blocker. That inversion is the whole model.

## THE PRE-FLIGHT GATE (built from the actual Bastrop-city blockers)
Each check maps to a specific thing that stopped us last round. Run ALL before the warm; each produces PASS or a NAMED rail-decline.

| Check | Maps to the blocker | Pass / Decline |
|---|---|---|
| Rail A source + adapter reachable | Smithville eCode360 403 (plain path fails; needs ecode360-scraper) | reachable → PASS; unreachable → decline that rail "source unreachable, needs adapter X" — NEVER a mid-run 403 |
| Zoning source reachable / unzoned-flagged | unincorporated county = legitimately unzoned | reachable → warm zoning; unzoned → honest-absence (a PASS, expected) |
| Rail C parcel layer wired in registry row | the roster chicken-and-egg (cohort read atoms not the parcel layer) | registry row names the authoritative parcel layer + district field → PASS; missing → decline "parcel layer not wired" |
| Superseded cohort measured (layer ∩ ¬cadastral) | the 1.3% Bastrop superseded prop_ids | measure up front → report as EXPECTED honest-decline count, never a mid-run surprise |
| Geometry R28/R33 warm==cert parity on a sample | the Class B recompute divergence | parity holds on ~5 sample parcels → PASS; diverges → decline "geometry parity fails, fix engine first" (catch on 5, not 1,919) |
| Serve-path health (retrieval auth + atom-chain + ledger write) | the retrieval-api key desync (silent 401 → snapshot) | auth ok + atom-chain reads + ledger writes → PASS; 401/unhealthy → decline "serve path unhealthy" (the 503 guardrail makes this loud) |
| Cost on a sample cohort < $200 | commitment #3 | under gate → PASS; over → decline "cost gate exceeded" |
| Mixed-vintage / stale-residue scan (adversarial-review add, 2026-08-03) | the 819 parcels left on repealed P-5 next to fixed SF-1 — stale residue from a prior partial warm | no prior-warm residue in the target area, or residue enumerated with a re-warm plan → PASS; unenumerated residue → decline "mixed-vintage residue unmeasured" |

Caveat on pre-flightability (adversarial review, 2026-08-03): two of the checks above are only PARTIALLY pre-flightable. Geometry R28/R33 parity on ~5 samples bounds risk but does not prove the cohort — parity is a warm-time property and a 5-parcel sample can miss a divergence class (the Bastrop corruption was found by area-sweep, not sampling). Superseded-cohort MEASUREMENT is pre-flightable; superseded RESOLUTION (the R15 successor re-key) is not, and stays a run-time honest-decline. The gate reduces mid-run stalls; it does not certify the run in advance.

## RUN WHAT PASSES, HONEST-DECLINE THE REST (operator ruling)
Partial coverage is a SUCCESSFUL onboarding, not a blocker. A jurisdiction runs every rail that passed pre-flight and honest-declines the rails that didn't, each with a NAMED reason. Zoning unreachable → serve parcels + flood + terrain, honest-decline zoning. Absence is a PASS (OPS-7). The run NEVER stalls waiting for a gap to be fixed. Every layer-23 parcel is served OR honest-declines for a named reason; zero bare "pending" (bare-pending = unwarmed = a real gap; named decline = doctrine working).

## THE DUAL DEFECT LEDGER (operator ruling — both views, one event source)
Every honest-decline + pre-flight rail-fail writes ONE event that feeds BOTH:
1. CC COUNTY LEDGER — a per-jurisdiction "gaps" column (operator visibility): e.g. `Smithville | 88% | [zoning: needs ecode360-scraper]`, `county-tractX | 72% | [superseded 4%]`. See the whole fan's incompleteness in one console; pick what to fix; dispatch an isolated fix; re-warm closes it and updates the ledger.
2. CLASS-GROUPED BACKLOG (doc_repo — efficient fixing): grouped by DEFECT CLASS so a fix clears a whole class at once. E.g. `ADAPTER-NEEDED: Smithville, Buda, Kyle, Pflugerville` (fix = wire ecode360-scraper ONCE → clears all); `SUPERSEDED>3%: tractX, tractY`; `GEOMETRY-DIVERGE: (none yet)`. Fix a class → re-warm its batch.
The console = "what's incomplete" (per-jurisdiction). The backlog = "how to fix efficiently" (per-class, in isolation, OFF the critical path). Both stay in sync off the same honest-decline events. THE RUN NEVER WAITS ON THE LEDGER — the ledger is the backlog, fixed deliberately later.

## THE INVERSION (why this kills the last-round pain)
LAST ROUND: fleet hits a blocker mid-run → stops → debugs live → churns (recompute divergence, roster chicken-and-egg, superseded parcels, key desync all stalled the line).
THIS MODEL: the gate catches it UP FRONT → the jurisdiction runs what it can → the gap goes on both ledgers → someone fixes it deliberately, by class, later. NO mid-run stall for any blocker we have seen. A genuinely-NEW issue stops ONCE, gets added to the pre-flight + the ledger, and never blocks twice — the recursive-loop discipline (64_recursive_loop) applied to onboarding itself. Each run makes the gate smarter.

## THIS IS onboard(fips) — DESTINATION, NOT CURRENT STATE
The pre-flight gate reads the FROZEN REGISTRY ROW (OPS-1). `onboard(fips)` = read registry row → run pre-flight → PASS rails run the proven line, FAIL rails honest-decline + ledger-write → warm + cert + serve → HALT at operator R6. An agent runs `onboard(48091)` with zero recipe knowledge; the gate enforces the recipe; the ledger captures the gaps. That is the un-ambiguous, blocker-free factory.

FOUNDATION GAP (adversarial review 2026-08-03, verified against live hauska-engine source on the PR #213 branch): the registry-cohort foundation this section assumes is NOT yet generalized. Actual state: `jurisdiction-registry.ts` has exactly ONE row (BASTROP_REGISTRY_ROW, fips 48021, `railPerParcel.cityFilter = {field: "CITY", value: "BASTROP"}`); there is no Bastrop-County-unincorporated row, no Elgin row, no Smithville row. `parcel-cohort-loader.ts` carries an explicit `TODO(onboard-fips)`: the per-state provider that resolves districtField + value mapping generalizes WHEN A SECOND JURISDICTION LANDS; the district mapping is Bastrop-AGOL-specific (ZoneTypeClass int). The cohort rail keys off a CITY boundary field, and there is NO schema representation yet for a no-city-filter / unzoned jurisdiction — which the first proving-ground target (unincorporated Bastrop County) requires. The registry row also flags Bastrop's own geometry vintage as STALE (202503). Build order step 1 therefore includes generalizing the registry schema (unzoned/no-city-filter rows) BEFORE the gate can even read a row for the county.

## FIRST PROVING GROUND (the Bastrop-county scope)
Bastrop County (unincorporated, unzoned — proves the zoning-honest-decline path; BLOCKED until the registry schema supports a no-city-filter row, see Foundation gap above) + Elgin (2nd euclidean city — the trigger for the cohort-loader generalization TODO) + Smithville (ecode360-scraper — proves the ADAPTER-NEEDED pre-flight path + the class-fix). Smithville caveat (adversarial review): the ecode360-scraper adapter is NAMED in the registry but has zero demonstrated successful ingests anywhere in the doc set or code history — "in the registry" means named, not proven-working. It may sit behind the same General Code licensing wall that blocked Pflugerville/Kyle/Buda (73_partnerships routing). Treat Smithville's pre-flight as expected to FAIL its Rail A check on first run; that is the pre-flight doing its job, but do not plan Smithville coverage as if the adapter works. Running these three THROUGH the pre-flight gate proves: the gate catches the adapter case up front (Smithville), the unzoned case is a clean honest-decline (county), and a second city generalizes (Elgin). If those three onboard blocker-free with their gaps on the ledger, the model is proven for the wider fan.

## BUILD ORDER
1. Build the pre-flight gate as the front of onboard(fips) (reads the registry row; the 7 checks above; each → PASS or named rail-decline).
2. Wire the honest-decline/fail event → the dual ledger (CC gaps column + class backlog doc).
3. Run Bastrop County + Elgin + Smithville through it. Every gap → ledger, never a stall.
4. Fix the ledger by CLASS, in isolation, off the critical path (Smithville's adapter first — it's already in the registry).
5. Operator R6 per jurisdiction. Then the wider fan, gate-gated.

## OPEN / CARRIES FORWARD
- UNRULED (operator call owed): can a jurisdiction be CERTIFIED (OPS-5 cert) when a CORE rail (parcels, or zoning in a zoned jurisdiction) honest-declined pre-flight? Run-what-passes rules the RUN; it does not yet rule the CERT. Options on the table: cert-with-scope-annotation (cert names the declined rails) vs cert-withheld-until-core-rails-pass. Until ruled, no cert is issued for a jurisdiction with a declined core rail.
- The pre-flight is only as complete as the blockers we've catalogued — add each new one as it appears (recursive-loop). Start with the 8 above (every Bastrop-city blocker + the mixed-vintage add).
- R15 successor re-key for superseded parcels: a class-backlog item, not a run blocker (the named superseded decline is the run-time answer).
- The chat-citation resolution ([n] markers render but source-link depends on Cortex returning the citation array): a class-backlog item under the CC/Cortex boundary, not an onboarding blocker.
