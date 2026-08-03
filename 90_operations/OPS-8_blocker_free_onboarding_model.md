---
id: OPS-8_blocker_free_onboarding_model
title: OPS-8 — Blocker-Free Onboarding Model (pre-flight gate → run-what-passes → dual defect ledger)
date: 2026-08-03
status: model (operator-ratified design for onboarding the rest of Bastrop county + cities, and the fan)
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

## THIS IS onboard(fips)
The pre-flight gate reads the FROZEN REGISTRY ROW (OPS-1) — which is exactly the registry-cohort foundation Phase D built. `onboard(fips)` = read registry row → run pre-flight → PASS rails run the proven line, FAIL rails honest-decline + ledger-write → warm + cert + serve → HALT at operator R6. An agent runs `onboard(48091)` with zero recipe knowledge; the gate enforces the recipe; the ledger captures the gaps. That is the un-ambiguous, blocker-free factory.

## FIRST PROVING GROUND (the Bastrop-county scope)
Bastrop County (unincorporated, unzoned — proves the zoning-honest-decline path) + Elgin (2nd euclidean city) + Smithville (ecode360-scraper — proves the ADAPTER-NEEDED pre-flight path + the class-fix). Running these three THROUGH the pre-flight gate proves: the gate catches the adapter case up front (Smithville), the unzoned case is a clean honest-decline (county), and a second city generalizes (Elgin). If those three onboard blocker-free with their gaps on the ledger, the model is proven for the wider fan.

## BUILD ORDER
1. Build the pre-flight gate as the front of onboard(fips) (reads the registry row; the 7 checks above; each → PASS or named rail-decline).
2. Wire the honest-decline/fail event → the dual ledger (CC gaps column + class backlog doc).
3. Run Bastrop County + Elgin + Smithville through it. Every gap → ledger, never a stall.
4. Fix the ledger by CLASS, in isolation, off the critical path (Smithville's adapter first — it's already in the registry).
5. Operator R6 per jurisdiction. Then the wider fan, gate-gated.

## OPEN / CARRIES FORWARD
- The pre-flight is only as complete as the blockers we've catalogued — add each new one as it appears (recursive-loop). Start with the 7 above (every Bastrop-city blocker).
- R15 successor re-key for superseded parcels: a class-backlog item, not a run blocker (the named superseded decline is the run-time answer).
- The chat-citation resolution ([n] markers render but source-link depends on Cortex returning the citation array): a class-backlog item under the CC/Cortex boundary, not an onboarding blocker.
