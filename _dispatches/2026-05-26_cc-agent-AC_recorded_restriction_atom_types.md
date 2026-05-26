---
id: 2026-05-26_cc-agent-AC_recorded_restriction_atom_types
title: Dispatch — Recorded restriction atom types (contract + engine registry)
date: 2026-05-26
agent: cc-agent-AC
repo: hauska-atom-contract
kind: dispatch
related: [80_adrs/adr_020_recorded_instruments_and_restriction_clauses, 80_adrs/adr_021_constraint_resolution_and_precedence, 49b_encumbrance_ingestion_pipeline, _decisions/2026-05-26_recorded_restrictions_phase_0_scope, _dispatches/2026-05-26_cc-agent-C_encumbrances_phase_1_upload]
---

# Recorded restriction atom types — cc-agent-AC

You are **cc-agent-AC**, owner of `hauska-atom-contract` (and coordination with cc-agent-E for `hauska-engine/packages/atoms/` registry).

**Gate:** Run only when operator dispatches. Phase 0 ADRs are accepted in doc_repo. cc-agent-C Phase 1 may use provisional Postgres JSON until this lands; prefer shipping types before C merges to main.

## Model (HR-12)

Default: Grok Build 0.1. Escalate to Claude on failure; log in session summary.

## Atoms to resolve

- `current-state:portfolio`
- Read ADR-020 field lists for: `recorded-instrument`, `restriction-clause`, `restriction-corpus`, `administrative-rule`, `constraint-resolution`

## Read first

1. `P:\doc_repo\80_adrs\adr_020_recorded_instruments_and_restriction_clauses.md`
2. `P:\doc_repo\80_adrs\adr_021_constraint_resolution_and_precedence.md`
3. `P:\doc_repo\49b_encumbrance_ingestion_pipeline.md`
4. `P:\doc_repo\_decisions\2026-05-26_recorded_restrictions_phase_0_scope.md`
5. Published `@hauska/atom-contract` README + latest CHANGELOG (in clone)
6. `hauska-engine/packages/atoms/` registration pattern from prior Stream B types

## Workspace

- Clone: `P:\hauska-atom-contract` (primary); read `P:\hauska-engine` for registry mirror
- Branch: `feat/adr-020-recorded-restriction-atoms`
- Verbatim `git status` + `git log -3` at start

## Scope — in

1. Add Zod/TS schemas for ADR-020 types + `constraint-resolution` (ADR-021)
2. Register rendering modes (`focus` for clause citation; document in README)
3. `accessPolicy` defaults: never `public-free` on instrument/clause types
4. Minor version bump `@hauska/atom-contract` (e.g. 1.2.0); publish plan in PR body
5. cc-agent-E follow-on: register producers/consumers in `hauska-engine/packages/atoms/` (coordinate in PR description; separate dispatch if needed)

## Scope — out

- Cortex upload UI (cc-agent-C)
- Ingest adapters E.1–E.6 (cc-agent-E, later)
- MCP tools (cc-agent-M)

## Acceptance

- [ ] All five types validate sample fixtures in package tests
- [ ] CHANGELOG + version bump
- [ ] PR open; held for operator merge
- [ ] `_inbox/` drop: `2026-05-26_hauska-atom-contract_cc-agent-AC_recorded_restriction_atoms_close.md`

## Reporting

Verbatim test commands (HR-8). Note breaking changes for C/E consumers.
