---
id: architecture_homes_audit_sequence
title: Audit-first plan and build sequence
status: active
last_updated: 2026-06-21
applies_to: portfolio
owner: nick
related: [architecture_homes_overview, architecture_homes_atoms, architecture_homes_topology, calibrated_spine_roadmap_overview, 56_engine_extraction_sprint]
---

# Audit-first plan and build sequence

The rule: audit and clean up the foundation before building anything else, so we are not building on a broken or moving base. Three phases, in order. No new feature build until phase 3.

## Phase 1 — Audit and cleanup (gating, before any build)

Three parallel audit tracks, all reporting to `_inbox/`.

Track A, atom conformance. Audit every atom family against the conformance target ([`02`](02_atoms_lifecycle_ownership.md)): does it carry the read-contract object (three axes, n, width, provenance), an accessPolicy, and the signed-history layer where data-level. Produce a per-family conformance matrix and a remediation per family:
- Immutable code corpus: re-mint, born-correct through the rebuilt snapshot (rides the snapshot rebuild engine already owes).
- Mutable and tenant families (encumbrances, workspace, reasoning, finding, site, user-generated): conformance-migrate and backfill in place; tenant-owned data cannot be re-minted.
- Consequence inputs backfill to a conservative asserted default now; thickens when the ICC I-Code ingest lands.

Track B, repo and naming cleanup. Bring the repo topology and naming to the standard in [`01`](01_homes_and_topology.md): scaffold `AEC-cortex` (as a `P:\` folder for the operator to remote), confirm cortex-api as the reporting function package, confirm the Surfaces classification, and resolve the two-Cortex naming overlap. No logic moves yet beyond what sprint 56 already sequences; this track is naming, repo boundaries, and the scaffold.

Track C, MCP gate rework. Re-group the product gates and add the coverage tools per [`03`](03_mcp_gate_and_agent_surface.md): read-contract on get_atom, the agent-callable atom-trace, the calibration reads. One server, many tools.

## Phase 2 — Doc-repo scrub and draft session

After the audit establishes ground truth, scrub the canonical doc set so this architecture is the standard everywhere and there is no conflicting framing left. This includes: the ADR-008 amendment (the Cortex redefinition and AEC-cortex split, on operator override); updating 50/52 for the gate rework; updating 56 and the calibrated-spine roadmap to point at the corrected homes; and a thorough sweep for any doc that still describes the old Cortex-as-product, cortex-api-as-monolith, or the pre-rework gate classes. Everything scrubbed, deliberately, in one pass, so downstream agents boot from the standard.

## Phase 3 — Build resumes

Only after phases 1 and 2: resume the calibrated-spine build waves (now landing in the correct homes), the engine-extraction lift (sprint 56), and the new surfaces. The calibration substrate and the backtest data are born on the spine, not in the BFF, because the homes are fixed first.

## Skill gates

- catalog-thesis-check: run (2026-06-21). Verdict in [`00`](00_overview.md). One conscious override pending: the ADR-008 Cortex redefinition.
- premortem-check: run before committing the calibration-substrate placement (the spine-vs-BFF lift acceleration) and before the ADR-008 amendment is finalized.

## What is frozen

All new feature building, including the calibrated-spine build waves, until phase 1 completes and phase 2 ratifies the standard. Acquisition continues (its output lands in a bucket, independent of the homes). The freeze is a conscious sequencing decision to protect the foundation.

## Dispatch note

When the phase-1 dispatches are authored, the agent that scaffolds `AEC-cortex` (or any new repo) creates the folder under `P:\` first; the operator creates the GitHub remote afterward; then the agent pushes. Same pattern that worked for hauska-map.
