---
id: 2026-08-01_fan_readiness_audit_dispatch
title: PRE-FAN GATE — read-only fan-readiness audit of the certified mold (source-correctness + honest-degradation + cold-county generalization)
date: 2026-08-01
status: dispatch (read-only, adversarially gated; GATES the fan-out — go/no-go before scaling)
owner: nick
related: [2026-08-01_scale_before_new_layers_sequencing, 2026-07-13_cotality_swap_public_record_migration, 27_MASTER_WDLL_spine_completion_and_depth_engine]
purpose: Before fanning the certified mold across ~254 TX counties, prove it is built right and looking at the right data. A wrong/stale source or a silent-degradation bug does not break one parcel at scale — it produces 254 counties of confidently-wrong data, possibly unnoticed for days (the spine-outage lesson). This is the go/no-go gate. READ-ONLY, one coordinator, adversarially gated.
---

# Fan-readiness audit — the pre-fan gate

## WHY THIS GATES THE FAN
The fan-out stamps the certified mold across ~254 TX counties. Blast radius of "built on the wrong data" scales with the fan. So we prove three things BEFORE fanning, not after: (1) each layer pulls the AUTHORITATIVE source, (2) each layer FAILS CLOSED / honest-absence when a source is missing, (3) the mold GENERALIZES to counties nobody tuned. Output = a go/no-go gate + what-breaks-first.

## HARD CONSTRAINTS
READ-ONLY. No code changes, no deploys, no data-runs, no writes. Observation + read probes only (live engine/cortex/map endpoints, DB reads, source-URL probes). Verify against LIVE + against the SOURCE rulings, not against docs (docs lag). Adversarial gate on every finding. Paste RAW output. Do NOT touch the in-flight fleets (spine-ledger + OZ — different surfaces) or run any ingest.

## THE SOURCE RULINGS (what "right data" MEANS — measure against these)
Per _decisions/2026-07-13_cotality_swap_public_record_migration.md + 00_current_state:
- PARCELS: county-GIS provider (Travis/Williamson/Bexar/Bastrop/Caldwell ArcGIS) in front of the DORMANT Cotality Spatial Tile branch; TxGIO self-hosted store for Hays/Comal. Cotality is config-gated dormant (degrades to `no-coverage`, never a live pull). Regrid is DEAD/removed. A live parcel hit that reaches Cotality = WRONG ROUTING (standing decision).
- JOIN KEY: CLIP if resolvable, else `apn:<fips>:<apn>`, else `geo:` — never fails on vendor darkness.
- CAD (owner/tax/land-use): `cad_property` store from PACS/Orion ingest (Central-TX appraisal vendors). Assessed values labeled assessed, never AVM.
- ZONING/SETBACK: the city's ADOPTED code (stamp), envelope only where a setback table exists; honest "no zoning stamp here" otherwise.
- FLOOD: current FEMA NFHL. TERRAIN: 3DEP. SOILS: SSURGO (real, live).
- THE FABRICATION FIREWALL: the owner-match join-integrity GATE + `county_facet_coverage` ledger — a coverage number is recorded only after owner-agreement proves the join is the same property. This EXISTS because of a real failure (Williamson R-prefix FABRICATED land-use on ~167k parcels, owner-match ~0%, caught + stripped). The audit MUST stress whether this firewall HOLDS on a cold county or was tuned to the warm ones.

## KNOWN LIVE FAILURE MODES (probe that these do NOT recur at scale)
- Fabrication: a join that emits a value without owner-agreement (the Williamson R-prefix class).
- Silent-neutral: NULL use-codes rendering as neutral without a "not verified" signal (Hays pending Orion; Comal no CAD roll).
- Wrong-routing: a live call reaching dormant Cotality instead of county-GIS.
- Silent-degradation: a missing source returning empty/stale AS IF authoritative (the spine-outage class).

## WARM vs COLD (pick COLD = outside the tuned set)
WARM/tuned (do NOT audit for generalization — they're hand-fixed): Travis, Williamson, Hays, Bastrop, Caldwell, Comal, Bexar.
COLD counties for the generalization run (confirmed NOT loaded), chosen to stress different conditions:
- HARRIS (metro, ~1.8M parcels, HCAD — a DIFFERENT appraisal system than Central-TX PACS/Orion): stresses "does the CAD ingest + parcel source generalize beyond the Central-TX vendors it was built against?"
- FAYETTE (rural, largely unincorporated/unzoned): stresses HONEST-ABSENCE — does it say "not verified here" or silently fabricate/degrade where there's genuinely no zoning/CAD coverage?
- GUADALUPE (mid-size suburban-to-rural, adjacent to warm cluster but not loaded): the middle case.

## THE THREE AUDIT QUESTIONS (one coordinator; fan lanes; adversarial gate each finding)

### Q1 — SOURCE CORRECTNESS (is each layer wired to the authoritative source?)
For each layer (parcel, join-key, CAD/land-use, zoning/setback, flood, terrain, soils): trace the LIVE code path from request to source and confirm it hits the ruled authoritative source, NOT a stale fallback or dormant Cotality. Probe live: does a parcel request for a warm county resolve via county-GIS/TxGIO (not Cotality)? Is the dormant-Cotality branch truly gated off? Any layer whose live path can reach a wrong/stale source is a finding. Deliver: per-layer source-wiring verdict (authoritative | stale-risk | wrong-routing) with the live probe/code line proving it.

### Q2 — HONEST DEGRADATION (does it fail closed when a source is missing?)
For each layer, force/observe the MISSING-source case and confirm it returns honest-absence ("not verified here" / "no zoning stamp here" / `no-coverage`) — NEVER a fabricated value and NEVER a silent-neutral that reads as "known." Specifically stress the fabrication firewall: does the owner-match gate BLOCK a value when owner-agreement fails (the Williamson R-prefix scenario) on a cold county? Does a NULL-use-code county signal "not verified" vs render neutral-as-if-known (the Hays class)? Deliver: per-layer degradation verdict (honest-absence | fabricates | silent-neutral) with evidence; explicit stress of the owner-match gate on a cold county.

### Q3 — COLD-COUNTY GENERALIZATION (does the mold hold outside the tuned set?)
Run/observe the full mold on HARRIS, FAYETTE, GUADALUPE (read-only — query the live path as it stands; do NOT ingest). For each: does parcel geometry resolve? Does the join key resolve (CLIP/apn/geo)? Does CAD/land-use populate or honest-absent? Does zoning honest-absent correctly (Fayette should be mostly unzoned — is that HONEST or a gap masked as data)? Does the owner-match gate hold? Compare the OUTPUT to independent ground truth (the county's own GIS/CAD portal) for a handful of parcels per county. THE key question: does the mold produce correct+honest output on a county nobody tuned, or does it break/fabricate in ways Bastrop's tuning hid? Deliver: per-cold-county generalization verdict with parcel-level ground-truth spot-checks (raw).

## ADVERSARIAL GATE (required)
Every finding gets a separate refuter trying to kill it with live evidence ("this IS the authoritative source because X", "this degrades honestly, you misread the path", "this generalizes, the cold-county output is actually correct"). Survives only if unrefutable. CONFIRMED (adversary tried+failed) vs PLAUSIBLE (couldn't fully verify live). Default refuted when uncertain. Same discipline that killed the false citation-fixes.

## OUTPUT — THE GO/NO-GO GATE
A single verdict doc: GO (mold is source-correct + fails honestly + generalizes to cold counties — safe to fan) or NO-GO (here is what breaks first, fix before scaling), backed by: the per-layer source + degradation matrix, the three cold-county generalization results with parcel-level ground-truth spot-checks, and a ranked list of any mold defects (most-fan-dangerous first) with fix-class. This gates the fan-out planning.

## COORDINATION / DISCIPLINE
ONE coordinator owns the fan (fans lanes, BLOCKS until they return — do not fan-and-return), runs the adversarial gate itself (never delegates the verdict to the finder), synthesizes the go/no-go. Operator manages only the coordinator. READ-ONLY throughout — coordinator enforces no-writes on every sub-agent. Verify live + against the source rulings. Cloud Run traffic-trap (serving != latestReady). Migration-merged != applied-to-live-DB. No-special-data-access (every source path must work for a no-relationship county — that IS the generalization test). No timeframe estimates. Paste raw output. Do not touch in-flight fleets or run ingests.
