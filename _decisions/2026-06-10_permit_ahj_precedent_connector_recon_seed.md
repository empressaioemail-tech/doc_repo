---
decision_id: 2026-06-10_permit_ahj_precedent_connector_recon_seed
date: 2026-06-10
owner: Nick
status: provisional
verification_pending:
  - recon must size per-portal-family onboarding cost against the under-$200-plus-1hr envelope before any build commitment (the load-bearing yellow)
  - confirm SmartCity OS permit-data ingest specifics against 31a_bastrop_maintenance_sprint.md (the "Bastrop MyGov, 502 permits" seed figure was read via subagent, not verified verbatim; directionally SmartCity does ingest Bastrop permit data, but the exact count is unasserted until 31a is read)
related_canonical: [58_gtm_readiness_sprint, 59_spine_moat_and_high_value_features, 77b_cotality_integration_strategy, 31a_bastrop_maintenance_sprint, 04a_arrow_two_calibration_capture, 80_adrs/adr_005_multitenancy, 80_adrs/adr_008_engine_factor_out]
---

## Decision

Pull a permit-portal / AHJ-precedent connector into focus as the first post-launch Cortex deepener, paired with the SmartCity-on-spine cut (sprint 58 C4), seeded now as a recon dispatch and not a build; the build commitment is gated on what the recon returns.

## Context

The operator asked to surface a connector the org has not planned. Against the planned set (Regrid, Cotality, FEMA, USGS 3DEP, SSURGO, ICC, ADA/FHA/A117.1, NOAA Atlas 14, CAD hosts), the gap for the 7k SoftPlan/ArchiCAD designer audience is operational AHJ data: permit precedent and submittal requirements. Three candidates were weighed (permit/AHJ-precedent, HOA/CC&R, energy/climate-zone) plus a hold-all option. Permit/AHJ-precedent was chosen for defensibility and thesis double-duty; HOA/CC&R carries product-honesty risk near launch (sprint 58 says the CC&R cross-layer is unbuilt and must not be marketed); energy/climate-zone is lower-defensibility lookup data.

## Structural commitment check

- Sell reasoning, not data: green with a boundary — precedent enters as reasoning/citation atoms, never resold raw permit records.
- Confidence is earned: green, strengthening — permit approval/rejection outcomes are ground truth for arrow-two calibration. Confirmed against doc 59 item 5b ("real-world outcome capture / permit-office ground truth, wired via SmartCity OS permit data and public permit records") and 04a, which defines arrow-two's second signal as finding accuracy against observed outcome (permit approved, variance granted). Today that calibration is reviewer-proxied; this connector is what makes it true outcome calibration.
- Cost per jurisdiction: YELLOW (load-bearing) — heterogeneous portals risk unbounded per-jurisdiction onboarding cost; this is the reason the decision commits only the recon-seed. Resolution is gated on the recon.
- Dual interface: green — adapter behind the gate, exposed as tools.
- Hauska spine: green — permit precedent plus outcome capture is core spine substrate.
- Focus queue: green as scoped — post-launch, recon-seed only, opens no second build front on the cc-agent-C clone before launch.
- Quality gate / sovereignty: green because partitioned — public-portal data pools to public-tier; SmartCity tenant cities' operational permit data stays tenant-private and never pools (ADR-005/017).

## Reasoning

The connector is the most defensible of the candidates because permit precedent is proprietary operational data, the opposite of the commodity, copyrighted code text the web-first thesis already routes away from (per the 2026-06-08 reasoning-not-text decision). It is the only candidate that does double duty: approval and rejection outcomes from permit offices are the literal ground truth arrow-two calibrates confidence against, which sprint 58 already names as a post-launch moat deepener (real-world permit-office outcome capture). The org already owns a seed of the data path: SmartCity OS ingests live municipal permit data for its tenant cities, so the connector pairs naturally with the C4 SmartCity-on-spine cut rather than starting cold. The recon-seed-not-build posture is deliberate: the load-bearing cost yellow (heterogeneous portals) is exactly the kind of question a recon answers before commitment, so the recon must target portal-family adapters and carry a kill criterion on the cost envelope. The yellow is lowered by an existing reuse path the recon must name: the connector is not greenfield. The site-context adapters just lifted to `packages/adapters` on the spine (hauska-engine PR #69) are already federal/state/local-tiered with a portal-family pattern, so an Accela-family adapter (one adapter, every Accela city) extends that framework rather than starting cold — which is precisely the portal-families-not-bespoke-per-city shape the envelope needs.

The recon must classify per data shape, not per connector, because "permit/AHJ" is two shapes with different sovereignty profiles: (a) submittal requirements, checklists, and turnaround — mostly public portal metadata, poolable to public-tier; (b) approval/rejection precedent (what got red-lined on similar projects) — often derived from a tenant city's operational record, which is tenant-private and must never pool. Two boundaries are hard-coded into the recon: no raw-permit-data resale (reasoning atoms only), and the public/private line drawn at per-data-shape granularity (ADR-005/017).

## Reversal criteria

- Revisit (toward kill) if the recon finds per-jurisdiction permit onboarding cannot stay near the under-$200-plus-1hr envelope via portal-family adapters — heterogeneous bespoke-per-city integration breaks commitment 3.
- Revisit if the recon cannot draw the public/private line cleanly at per-data-shape granularity (submittal-metadata poolable vs approval/rejection-precedent often tenant-private), which would put the sovereignty floor (ADR-005/017) at risk.
- Revisit if the precedent data cannot be expressed as reasoning/citation atoms and would only exist as a raw-records feed (off-thesis).
- Revisit priority if a higher-leverage connector for the launch audience emerges before C4 is reached.

## Dependencies

Depends on: sprint 58 reaching the post-launch C4 stage (SmartCity-on-spine cut) for the build; the recon itself depends on nothing and can run on a separate agent/repo without touching the cc-agent-C serialization point. Depended on by: the post-launch arrow-two outcome-capture deepener (moat builder #5), which this connector would feed.

## Counterparties

Internal. Affects: the sprint-58 owner (sequencing the recon vs the launch gate), the SmartCity OS workstream (source of the tenant permit data and the C4 pairing). No external counterparty; public-portal data sources are open municipal portals (Accela, Tyler EnerGov, CityView, Cloudpermit, OpenGov permitting), not licensors.
