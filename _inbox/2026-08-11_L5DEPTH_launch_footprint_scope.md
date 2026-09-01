---
id: 2026-08-11_L5DEPTH_launch_footprint_scope
title: L5 depth — what the launch footprint actually costs, and the number that says one county is done
date: 2026-08-11
status: scope (read-only investigation; no rulings made)
owner: nick
related: [_decisions/2026-08-09_texas_flush_launch_gate, _decisions/2026-08-08_layer_first_statewide_fabric_sequence, _decisions/2026-08-04_ecode360_partnership_retired_scrape_posture, 90_runbooks/factory_onboarding_runbook, 90_operations/OPS-12_instrument_inventory, _catalog/texas_roster_v1.json, _inbox/2026-08-05_T1_stamp_roster_sweep.json]
machine_readable: _inbox/2026-08-11_L5DEPTH_launch_footprint_scope.json
---

# The launch footprint, costed

The 2026-08-09 launch gate says jurisdiction-depth rails must be satisfied in "the Bastrop network plus the initial marketed footprint." That second phrase has never been defined. This scope makes it concrete enough to rule on, and reports one finding that has to be read before anything else.

## Read this first: the ledger says nineteen, the truth is one

The brief for this investigation supplied "zoning: satisfied-present 19" as verified ground truth to rely on and not re-derive. That figure is literally true and materially misleading, and building a footprint decision on it would have been an expensive mistake.

Pulling all nineteen satisfied zoning cells from the live ledger and reading their coverage fields: fifteen of them carry `honestCoveragePct` of exactly zero, with `source` null and `lastVerifiedAt` null. Three more are genuinely partial (Williamson 33.98 percent, Comal 25.82, Hays 3.61). Exactly one county in Texas, Bastrop at 99.77 percent, is depth-satisfied against the 95 percent threshold.

The cause is structural rather than a data bug. Satisfaction on the zoning rail is being driven by `atomFamilyState == 'present'`, meaning one zoning atom anywhere in a county turns the whole county green. That predicate is defensible for statewide-uniform rails, which are acquired once and blanket the state. It is wrong for depth rails, where the entire question is what fraction of the county is covered. The repo already knows this: `_STATE.md` line 186 reads "One satisfied cell: Bastrop zoning," and the parked-work queue records nineteen scored counties rendering with `rail_state` left NULL.

The consequence for this decision is direct. The launch gate requires depth rails to be satisfied in the footprint counties, and the instrument that would report that satisfaction currently cannot distinguish 99.77 percent from zero. Before the footprint is ruled, depth-rail satisfaction in the ledger should gate on `honestCoveragePct >= thresholdPct` rather than on `atomFamilyState`. Otherwise the operator cannot read the gate they just wrote.

One further caution: the live ledger has moved past every doc in the repo. It now reports 14 rails, 3,556 cells, 142 satisfied and 4.9146 percent Texas completeness, against `_STATE.md`'s 12 rails, 3,048 cells, 19 satisfied and 0.0395 percent. Geometry went from 19 counties to 141. Re-read the ledger at decision time.

## Where zoning depth actually exists

| County | Coverage | Cities wired | Real state |
|---|---:|---|---|
| Bastrop 48021 | 99.77% | Bastrop, Elgin | Genuinely satisfied. The only one. |
| Williamson 48491 | 33.98% | Georgetown, Round Rock, Leander, Hutto, Cedar Park, Taylor, Liberty Hill | Partial, real zoning-stamp source |
| Comal 48091 | 25.82% | New Braunfels | Partial, real source |
| Hays 48209 | 3.61% | Dripping Springs, Buda, Kyle, San Marcos | Partial, real source |
| Bell, Bexar, Caldwell, Guadalupe, McLennan, Travis | 0% | Killeen/Belton, San Antonio, Lockhart, Seguin/Cibolo, Waco, Austin/Pflugerville | Stamp-capable, never applied |
| Collin, Dallas, Denton, Ellis, Johnson, Kaufman, Parker, Rockwall, Tarrant | 0% | none in the stamp roster | Display artifact only |

The middle group matters most. Those six counties have cities that were dry-run proven and simply never written.

## What produces zoning depth, and where the humans are

The pipeline is the zoned-city lane of the jurisdiction backfill factory, steps Z1 through Z11 in `90_runbooks/factory_onboarding_runbook.md`. The mechanical entry points are `onboard-preflight.mjs` for the gate, the ldt-side `zoning-stamp` CLI, `bake-property-atom-county.mjs` for zoning facts, a per-city `depth-warm-<city>-batch.mjs`, then `cert-grade-and-report.mjs` and `warden-sweep.mjs`.

The input it requires is a registry row carrying a live, probed zoning GIS FeatureServer plus an operator-ratified setback table. Both halves are hard requirements. Without the GIS layer the stamp CLI fails outright with "unknown city," proven on Smithville. Without ratification the draft setback table is registered behind a commented-out marker and cannot serve.

It is not automatable today, and the reason is worth stating precisely because it collides with the humanless ruling. Z5, operator ratification, is not an automation gap that engineering closes incidentally. It exists because no instrument grades a per-parcel setback record against ordinance text. The instrument inventory says so in as many words: that check is "the Z4 planner row-verification step, a human act," and it is listed under defect classes with no instrument. Alongside it, Z1 source recon needs a human reading FeatureServer field semantics, the per-city warm scripts are still hand-authored because the registry-driven runner never shipped, and Warden scheduling is planner-run by hand.

So the operator owes one of three rulings before any multi-city footprint is committed: build the ordinance-to-scalar verifier and let it ratify below a confidence threshold; delegate or batch ratification explicitly and accept the risk; or accept roughly one human-hour per city and size the footprint to the hours available. Under the third, candidate (b) is 21-plus hours and statewide is 1,223. This ruling has not been made.

## Cost is settled, and it is not the constraint

Reported rather than re-measured, per the standing ruling. The T6 roster carries a `cost_est_usd` figure for all 254 counties: the maximum anywhere in Texas is Travis at $14.29, the median is $0.32, and the sum for the entire state is $228.66. No county is estimated over $200. A live-metered corroboration exists in the Elgin zoning-fact bake at $0.1421 against a $200 gate.

The contrary Bastrop datapoint of $284.40 does not falsify this. It is self-described as reconstructed from Cloud Run and Neon line items across six warm passes with confidence "low," it sums six re-warms which the operator already ruled do not count against the commitment, and Bastrop absorbed the cost of building the lane itself. Sibling reconstructions in the same record are Guadalupe $41.20, Bexar $96.70, Caldwell $12.85.

Three caveats travel with the settled figure. These are gate-methodology estimates from named constants, which the runbook itself says must never be quoted as measured. They cover compute only; the one-hour human-review half of commitment #3 has never been measured, and OPS-11 marks that invariant UNENFORCED as a mechanism. And the live ledger meters `costUsd` on 2 of 487 facets, both Bastrop at a penny each, so there is no running cost instrument.

The conclusion is that the whole state costs less in compute than the budget for a single county. Cost should stop being discussed as a constraint on L5. The binding constraints are human ratification hours and per-city GIS probing.

## The four candidates

| Candidate | Counties | Parcel share | Zoning satisfied today | Gap |
|---|---:|---:|---:|---:|
| (a) Bastrop network | 1 | 0.47% | 1 | 0 |
| (b) Central Texas | 8 | 12.66% | 1 | 7 |
| (c) Central + metros | 14 | 38.40% | 1 | 13 |
| (d) Statewide | 254 | 100% | 1 | 253 |

Parcel share is computed against 13,360,496 total Texas parcels from `parcel_count_est` across 254 of 254 counties (only Hemphill 48129 is null). It is the one decision input in this scope that is solid, and it is the number that tells the operator what fraction of Texas users would land on a depth-satisfied parcel.

**(a) Bastrop network** is depth-satisfied today and needs nothing. Bastrop city and Elgin are stamped and certified; Smithville's corpus is ingested but its stamp is honestly absent because no public zoning FeatureServer exists. The cost is reach: fewer than one in two hundred Texas parcels. It also satisfies only half the operator's own phrasing, which said the Bastrop network *plus* the initial marketed footprint.

**(b) Central Texas** is Bastrop, Travis, Williamson, Hays, Caldwell, Comal, Guadalupe and Bell. This is the footprint the repo has actually invested in. All eight counties already have satisfied geometry, all eight appear in the stamp roster sweep, and 21 of the 23 stamp-capable cities in the entire state sit inside it. Moving from (a) to (b) buys 27 times the market reach across seven counties that need stamp-apply, warm and cert rather than acquisition from scratch.

**(c) Central plus metros** adds Bexar, Dallas, Tarrant, Collin, Denton and Harris, tripling reach to 38.40 percent — the only option where a plurality of Texas users land on depth-satisfied ground. It also imports the four hardest known blockers simultaneously. Tarrant's geometry rail is still not-yet at 91.58 percent, so its parcel spine is unfinished while its zoning cell reads satisfied. Harris is short-loaded and the instrument inventory names the missing detector as the highest-priority gap in the factory. Dallas proper sits in the retired-eCode360 bucket with no proven scrape. And of the six added counties only San Antonio is stamp-capable today.

**(d) Statewide** is shown for contrast and is explicitly not the gate. The launch-gate ruling rejected it in terms: filled-everywhere puts roughly 1,222 city scrapes and 254 CAD acquisitions between the product and revenue while the product already discloses honest absence per parcel, which is the thesis.

On the evidence, (b) is the efficient frontier. That is a data-readiness argument, not a demand argument, and demand is the operator's input rather than mine.

## What actually stops city number twenty

Not code text, and not a partnership. The eCode360 track was retired 2026-08-04, the scraper adapter is merged on engine main, and it proved out on Smithville at 836 of 836 TOC sections. Smithville also demonstrates the limit precisely: the corpus ingested successfully and the zoning stamp still could not run.

What stops city twenty is the absence of a probed public zoning FeatureServer. In the CAPCOG registry, 42 of 50 cities have `zoning_gis` null, and a null there is a hard stop. The nuance is that this is a probing gap more than a data gap — Elgin shows null in the registry yet was stamped successfully via a FeatureServer discovered during Z1 recon. So the registry undercounts what is reachable, which means the work item is running probes, not acquiring new sources.

The cheapest move available follows from this. Twenty-three cities totalling roughly 1.09 million parcels are already dry-run proven with exit code zero and no errors across ten counties, held only by a blast-radius review pending ldt #386. Applying those stamps would move Bell, Bexar, Caldwell, Guadalupe, McLennan and Travis off zero coverage and convert most of candidate (b) from paper to measured, at close to zero acquisition cost because the probing and dry-runs are already paid for. That should sequence ahead of any new city acquisition.

## The number that does not exist

`citiesNeeded` cannot be computed for any candidate footprint from repo data. All 1,223 city records in `texas_roster_v1.json` carry `parent_county_fips` null, and `parent_county_name` is the literal garbage value "A" on 1,220 rows and "I" on 3. The CSV mirror contains no city rows at all. This violates the T6 acceptance criterion that every city record carry its containing county. Every `citiesNeeded` figure in the machine-readable artifact is therefore a floor derived from the 23 stamp-proven cities, not a count of incorporated places.

The fix is cheap and needs no acquisition. Spatially join the L1 city boundary layer, `txgio_city_boundaries_202508` with 1,222 polygons already loaded and live, against the 254 county polygons, and emit a per-county incorporated-place count. That is read-only work over data already in the store, it settles the highest-value missing number for this decision, and it repairs the roster's failed acceptance criterion. Until it runs, the only valid per-county city counts anywhere in the repo are the five CAPCOG counties: Bastrop 3, Caldwell 3, Hays 11, Travis 18, Williamson 15.

A second correction will matter once that join exists. A raw incorporated-place count overstates the work, because Texas counties cannot zone by law and over half the corridor's incorporated places are sub-2,000-population towns correctly treated as demand-driven. The CAPCOG registry bears this out: of 50 cities, 46 have zoning, with regime types splitting 38 euclidean, 6 hybrid, 3 unzoned, 1 form-based and 2 unknown. The real denominator is the Tier-A deal-volume cities.

## Rulings the operator owes before this can be decided

The first is what "initial marketed footprint" means. The phrase appears once, in the 2026-08-09 decision, with no referent, and no target-market, affiliate-territory or demand-geography artifact exists in the repo. The candidates here are built from data-readiness adjacency — what the factory has already touched — as a substitute for demand. That substitution is an assumption and it is the operator's to accept or reject.

The second is the ratification question above: verifier, delegation, or hours-bounded footprint.

The third is narrower but blocking: whether the ledger's depth-rail satisfaction predicate gets fixed before or after the footprint is ruled. Ruling a footprint against an instrument that reports nineteen when the answer is one is not a decision the operator can hold anyone to.
