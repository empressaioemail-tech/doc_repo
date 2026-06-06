---
id: 2026-05-28_cc-agent-E_property_workspace_atom_pipeline
title: Dispatch — Property workspace atom emission and retrieval pipeline for V1
date: 2026-05-28
agent: cc-agent-E
repo: hauska-engine
kind: dispatch
related: [49b_encumbrance_ingestion_pipeline, 01a_atom_conventions, _dispatches/2026-05-28_cc-agent-AC_property_workspace_atom_contract, _decisions/2026-05-28_brokerage_v1_expanded_scope]
---

# Engine pipeline for Brokerage V1 atomization (3c)

You are `cc-agent-E`, owning engine-side atom pipeline.

## Goal

Implement emission, indexing, and retrieval support for Brokerage V1 workspace package atoms using the new contract types from AC.

## Scope

In scope:
- Ingest/emission path for:
  - `property-workspace`
  - `brief-run`
  - `workspace-attachment`
  - `workspace-share-edge`
- Query helpers for:
  - recent workspaces by user
  - workspace package by id
  - share graph edges by workspace/user
- Source/citation linkage fields preserved for retrieval integrity.

Out of scope:
- Legacy-design-tools route/controller implementation.
- Billing/paywall logic.

## Dependencies

- Consume AC contract branch/tag for final schema.
- Coordinate with C on payload shape compatibility.

## Acceptance criteria

- [ ] Engine can write and retrieve all four atom types.
- [ ] Recent-workspace query returns deterministic order (most recent first).
- [ ] Workspace package query returns complete linked records.
- [ ] Share-edge query supports admin graph consumers.
- [ ] Eval/tests green with fixtures.

## Report back

Write inbox close file:

`P:/doc_repo/_inbox/2026-05-28_hauska-engine_cc-agent-E_property_workspace_atom_pipeline_close.md`

Include PR URL, SHA, test output, and any schema coordination blockers with AC/C.
