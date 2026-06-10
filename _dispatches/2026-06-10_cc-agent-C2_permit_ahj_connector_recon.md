---
id: 2026-06-10_cc-agent-C2_permit_ahj_connector_recon
title: Dispatch — permit-portal / AHJ-precedent connector recon (cost-envelope + sovereignty gate)
date: 2026-06-10
agent: cc-agent-C2
repo: legacy-design-tools (cross-repo read: smartcity-os, hauska-engine)
kind: dispatch
status: FIRE-READY as recon (read-only, parallel-safe); the BUILD it scopes is post-launch (pairs with sprint 58 C4)
related: [58_gtm_readiness_sprint, 59_spine_moat_and_high_value_features, 04a_arrow_two_calibration_capture, 31a_bastrop_maintenance_sprint, 77b_cotality_integration_strategy, 80_adrs/adr_005_multitenancy, _decisions/2026-06-10_permit_ahj_precedent_connector_recon_seed, 20_agent_operating_rules]
---

# Permit-portal / AHJ-precedent connector recon

> The operator picked permit/AHJ-precedent as the first post-launch Cortex connector deepener ([`_decisions/2026-06-10_permit_ahj_precedent_connector_recon_seed.md`](../_decisions/2026-06-10_permit_ahj_precedent_connector_recon_seed.md), provisional). The decision left ONE load-bearing yellow — cost per jurisdiction — and that yellow is the gate: this recon answers it and carries a kill criterion. Read-only; produces a sized recommendation the operator turns into a build (or kills). The build is post-launch (pairs with C4, SmartCity-on-spine, where the permit data already lives); the recon itself depends on nothing and runs on a separate agent so it never touches the cc-agent-C serialization point.

You are **cc-agent-C2**, recon owner. READ-ONLY — no branch, no PR, no schema. Use a read-only worktree / separate clone; do not touch the cc-agent-C working tree. Model: **Grok Build 0.1**; escalate to Claude only on failure after retry, log it.

## Read first

1. [`_decisions/2026-06-10_permit_ahj_precedent_connector_recon_seed.md`](../_decisions/2026-06-10_permit_ahj_precedent_connector_recon_seed.md) — the provisional decision + the yellow this resolves
2. [`59_spine_moat_and_high_value_features.md`](../59_spine_moat_and_high_value_features.md) item 5b — real-world permit-office outcome capture as a moat builder
3. [`04a_arrow_two_calibration_capture.md`](../04a_arrow_two_calibration_capture.md) — arrow-two's second signal is "finding accuracy against observed outcome (permit approved, variance granted)"; this connector is the wiring for it
4. [`31a_bastrop_maintenance_sprint.md`](../31a_bastrop_maintenance_sprint.md) — confirm what permit data SmartCity OS ingests for Bastrop (verify the "MyGov / ~502 permits" figure verbatim; it is currently unverified)
5. The lifted adapter framework: `hauska-engine/packages/adapters` (federal/state/local-tiered, portal-family pattern) — the reuse path (cross-repo read)
6. [`80_adrs/adr_005_multitenancy.md`](../80_adrs/adr_005_multitenancy.md) — the sovereignty partition
7. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-8

## The load-bearing question (the kill gate)

**Can a permit/AHJ connector be built as portal-FAMILY adapters (one Accela adapter serves every Accela city) extending the existing `packages/adapters` framework, keeping marginal per-jurisdiction onboarding near the under-$200-compute + 1-hour-review envelope (commitment 3)?** If the answer is bespoke-per-city integration, the connector breaks commitment 3 and this recon recommends KILL (or a tightly bounded pilot). Size the marginal cost per jurisdiction explicitly and carry the kill criterion.

## Scope (recon — answer with evidence)

1. **Portal landscape + family map.** Enumerate the major permit-portal families (Accela, Tyler EnerGov, CityView, Cloudpermit, OpenGov Permitting, and any others material in Texas). For each: does it expose a public/queryable API, what auth, what data, and how many jurisdictions does that one family cover? The output is a family→coverage map, because family coverage is the cost-envelope answer.
2. **Adapter-framework reuse.** Confirm the lifted `packages/adapters` framework (federal/state/local-tiered) can host a permit-portal adapter family the same way the site-context adapters work. Name the concrete extension path; estimate marginal per-jurisdiction cost on a portal-family adapter vs bespoke.
3. **Data-shape split (sovereignty, per shape not per connector).** Classify the data into: (a) **submittal requirements / checklists / turnaround** — typically PUBLIC portal metadata, poolable to public-tier; and (b) **approval/rejection precedent** ("what got red-lined on similar projects in this AHJ") — often derived from a tenant city's OPERATIONAL record, which is `tenant-private` and must NEVER pool. Report which portal data falls in which bucket. The public/tenant-private line is drawn at this granularity.
4. **Reasoning-atoms-only boundary.** Confirm the connector can express precedent as reasoning/citation atoms ("similar projects in this AHJ were flagged for X") rather than a resold raw-permit-records feed (the same no-verbatim shape as code text). If the value only exists as raw records, that is off-thesis — flag it.
5. **The arrow-two + SmartCity pairing.** Confirm permit approval/rejection outcomes are the ground truth arrow-two Phase 2 wants (per 04a/59), and that the SmartCity OS permit ingest (Bastrop) is the seed the C4 cut pairs with. Verify the Bastrop permit-data specifics against 31a (do not assert the count without reading it).

## Acceptance criteria

- The portal-family→coverage map delivered; the cost-envelope question answered with a marginal-per-jurisdiction estimate and an explicit KILL criterion if it cannot stay near-envelope via family adapters.
- The adapter-framework reuse path named (concrete, against the lifted `packages/adapters`).
- The data-shape sovereignty split delivered (public-poolable vs tenant-private-never-pools), per data shape.
- The reasoning-atoms-only boundary confirmed or flagged.
- The SmartCity/arrow-two pairing confirmed; the Bastrop figure verified against 31a.
- A sized, sequenced build recommendation (or kill), explicitly post-launch / C4-paired.
- Read-only: no code, no schema, no PR.

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-10_legacy-design-tools_cc-agent-C2_permit_ahj_connector_recon.md`: the family→coverage map, the cost answer + kill criterion, the reuse path, the sovereignty data-shape split, the reasoning-atoms boundary, the SmartCity/arrow-two pairing + verified Bastrop figure, and the sized build recommendation.
