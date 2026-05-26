---
id: 2026-05-26_hauska-atom-contract_cc-agent-AC_recorded_restriction_atoms_close
title: Close — ADR-020 encumbrance atom types (@hauska/atom-contract v1.2.0)
date: 2026-05-26
agent: cc-agent-AC
repo: hauska-atom-contract
branch: feat/adr-020-recorded-restriction-atoms
commit: ae94222
pr: https://github.com/empressaioemail-tech/hauska-atom-contract/pull/1
related: [80_adrs/adr_020_recorded_instruments_and_restriction_clauses, 80_adrs/adr_021_constraint_resolution_and_precedence, _dispatches/2026-05-26_cc-agent-AC_recorded_restriction_atom_types, _dispatches/2026-05-26_cc-agent-C_encumbrances_phase_1_upload]
---

# Close — recorded restriction atom types (contract)

## Status

**PR open** — operator merge + npm publish held.

| Artifact | Value |
|---|---|
| Branch | `feat/adr-020-recorded-restriction-atoms` |
| Commit | `ae94222` |
| PR | https://github.com/empressaioemail-tech/hauska-atom-contract/pull/1 |
| Version | `@hauska/atom-contract@1.2.0` |

## Delivered

- New subpath `@hauska/atom-contract/encumbrances` — Zod schemas + TS interfaces for:
  - `recorded-instrument` (ADR-020)
  - `restriction-clause` (ADR-020)
  - `restriction-corpus` (ADR-020)
  - `administrative-rule` (ADR-020)
  - `constraint-resolution` (ADR-021)
- Sample fixtures (`SAMPLE_*`) for Cortex/engine scaffolding.
- `ENCUMBRANCE_RENDER_MODES` / `ENCUMBRANCE_DEFAULT_RENDER_MODE` — `restriction-clause` default **`focus`** for citation.
- `AccessPolicy` union extended with `tenant-shared`; encumbrance schemas reject `public-free`.
- 11 new schema tests; full suite **70** green at commit time.

## Verification (HR-8)

```powershell
cd P:\hauska-atom-contract
git checkout feat/adr-020-recorded-restriction-atoms
npm run lint
npm run typecheck
npm test
npm run build
```

## Consumer handoff

| Agent | Action |
|---|---|
| **Operator** | Merge PR #1; `npm publish` + tag `v1.2.0` |
| **cc-agent-C** | Pin `^1.2.0`; validate Phase 1 upload JSON with `RECORDED_INSTRUMENT_SCHEMA` / `RESTRICTION_CLAUSE_SCHEMA` |
| **cc-agent-E** | Register `AtomRegistration` in `hauska-engine/packages/atoms/` (separate dispatch) |

## Out of scope (per dispatch)

- Engine registry producers/consumers (cc-agent-E).
- Cortex upload UI (cc-agent-C).
- MCP tools (cc-agent-M).
