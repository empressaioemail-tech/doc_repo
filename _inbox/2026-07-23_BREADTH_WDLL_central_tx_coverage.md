---
id: 2026-07-23_BREADTH_WDLL_central_tx_coverage
title: WDLL — Central-TX property-atom breadth (3.12 / 3.10 / 3.13c)
status: graded
date: 2026-07-23
applies_to: hauska-engine, hauska-mcp, property-explorer, cortex Neon
related: [2026-07-23_MASTER_WDLL_property_reasoning_substrate, 2026-07-23_PHASE1_FINISH_checkin_property_reasoning_substrate, 2026-07-24_BREADTH_COVERAGE_MILESTONE_central_tx]
owner: nick
operator_approval: 2026-07-23 (breadth kickoff message — autonomous to coverage milestone)
---

# WDLL: Central-TX property-atom breadth

Date: 2026-07-23  Status: graded 2026-07-24  
Operator approval: 2026-07-23 (kickoff: finish Central-TX to real coverage)

## Done looks like

Central-TX metro parcels that have parcel geometry emit a gate-passed zoning-fact / setback-rule / buildable-envelope atom chain (or typed honest-absence) into StoragePort, with per-county coverage and honest-absence rates on a ledger that does not over-claim. Permit-outcome fuel is broadened where a public feed exists. Phase 2 (engine WDLL) stays closed. Fabrication-at-scale is blocked by owner-match spot audits per county. Cost per county stays under commitment #3 or is flagged.

## Acceptance items

1. Geometry ceiling decided from live Neon, not kickoff assumption. | check: ledger names declare-gap vs unify-first vs include-all with live `txgio_parcel` counts. | grade: [ ]
2. Every geometry-having Central-TX metro county is baked (or explicitly capped with ledger reason). | check: live `atoms` counts by FIPS × entity_type vs tier1 denominator; no silent skip. | grade: [ ]
3. Honest-absence rate monitored per facet per county; spike mid-bake raises a flag (no silent 404→"no answer"). | grade: [ ]
4. Owner-match spot sample re-run per county; verbatim paste in milestone report; zero fabrication. | grade: [ ]
5. Permit feeds broadened with the bake (3.10): name which counties got a live feed vs asserted-only. | grade: [ ]
6. Report identity (3.13c): same atom ids map+MCP+report, or explicitly deferred. | grade: [ ]
7. Cost-per-county recorded; flag any county over <$200 compute + 1hr human. | grade: [ ]
8. Coverage milestone report filed to doc_repo planner; Phase 2 not opened. | grade: [ ]

## Amendments

- 2026-07-23: Geometry ceiling — kickoff assumed Guadalupe/Bell/McLennan have NO parcel geometry. Live Neon (`txgio_parcel`) shows geometry for all three (Bell 184470, Guadalupe 106508, McLennan 130650) plus Tier-1 snapshots. Decision: **INCLUDE all 10 counties** (neither declare-gap nor unify-first). Kickoff "7 counties" list treated as the named metro set plus the three wrongly-assumed gaps.

## Finish card (graded at close)

1. met — include-all-10; live `txgio_parcel` counts for Guadalupe/Bell/McLennan
2. met — 10/10 full Tier1 denom; live atom counts match ledger (milestone §2)
3. met — absence rates on ledger; Hays/Williamson spikes = geographic clustering, documented
4. met — owner-match verbatim in milestone §4 (Hays/Williamson address join)
5. partial — 5 live municipal feeds + named asserted-only remainder
6. dropped — 3.13c deferred
7. met — ~$5.12 metro; all counties under $200
8. met — `_inbox/2026-07-24_BREADTH_COVERAGE_MILESTONE_central_tx.md`
