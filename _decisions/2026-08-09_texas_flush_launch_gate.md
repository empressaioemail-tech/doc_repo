---
id: 2026-08-09_texas_flush_launch_gate
title: Texas flush — launch gate is measured-everywhere; filled-everywhere is program completion
date: 2026-08-09
status: active
owner: nick
related: [_decisions/2026-08-08_layer_first_statewide_fabric_sequence, 90_operations/OPS-11_invariant_register, 90_operations/OPS-12_instrument_inventory, 90_operations/OPS-13_store_topology, 76j_smartsite_launch_readiness_program, 90_operations/OPS-7_coverage_and_honesty_doctrine]
---

# Texas flush: two gates, not one

Operator ruling 2026-08-09, closing the question 76j left open ("Texas flush" as the launch gate, previously undefined).

## The decision

"Texas flush" splits into two distinct, measurable states.

**Launch gate (measured-everywhere).** Smart Site launches in Texas when every cell of the county ledger carries an honest measured state, not when every cell carries data. Concretely:

1. L2 parcel geometry at 254 of 254 counties (fabric complete), with the coastal-short and Donley exceptions resolved or ruled honestly absent.
2. Statewide-uniform layers live: roads, NFHL flood (done 2026-08-09), building footprints (ML-derived default per ADR-029).
3. All 12 rails have writers, so every one of the 3,048 ledger cells resolves to data or disclosed honest absence with provenance. No cell left in `no-writer`.
4. Cert frame reconciled to the Geometry Law (cert lane grades the raw txgio ring; block13 fixture re-dumped; certs re-earned in the true frame).
5. 76j capacity items done: rate-limit store, load test, capacity doc, domain and branding.

Honest absence is a legitimate satisfied state per OPS-7 and INV-17; a launch on measured-everywhere is a launch on the truth the product actually tells per parcel.

**Program completion (filled-everywhere).** All planned data sources live with depth: CAD attribute rolls across the 254 appraisal districts and zoning, setback and code text across the roughly 1,222 incorporated cities. This is the moat and the permanent post-launch engine, not the launch gate. Depth backfill runs continuously after launch; state expansion (out-of-Texas) continues to gate on the target state reaching flush per 76j.

## Why

Making filled-everywhere the launch gate puts roughly 1,222 city scrapes and 254 CAD acquisitions between the product and revenue, while the product already discloses per-parcel honest absence, which is the thesis (honest absence is the product). Measured-everywhere is the earliest gate at which the statewide claim is honest: every parcel in Texas returns either verified data or a disclosed, provenanced absence. The writers ceiling found 2026-08-09 (8 of 12 rails structurally unable to produce a satisfied cell) makes the distinction concrete: the launch bottleneck is writer engineering plus fabric completion, not jurisdiction depth.

## Instruments

The gate is read from two dashboards, never asserted: the county ledger (`GET /api/county-ledger`, all cells out of `no-writer`, completeness computed over honest states) and the invariant register (OPS-11, with the cert-frame amendment cleared and no UNENFORCED invariant on the correctness path).

## Reversal criteria

Reverse to a stricter gate if either: (a) tester or affiliate feedback shows honest-absence cells at launch density materially break conversion or trust, meaning the market reads absence as broken rather than honest; or (b) a legal or partner constraint requires filled data in a category (e.g. flood disclosure) before public sale. Reverse to a looser gate only by explicit operator ruling; no agent may soften a criterion to make a date.
