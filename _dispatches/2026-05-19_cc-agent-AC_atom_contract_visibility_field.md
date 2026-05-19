---
id: 2026-05-19_cc-agent-AC_atom_contract_visibility_field
title: Dispatch — cc-agent-AC hauska-atom-contract (visibility field for partnership-pending jurisdictions; v1.1.0 publish)
date: 2026-05-19
agent: cc-agent-AC
repo: hauska-atom-contract
kind: dispatch
related: [_decisions/2026-05-19_sync_4_5_and_cortex_sprint, 51_substrate_v1_sprint, 25_atom_architecture_reference, 80_adrs/adr_017_atom_access_control, 80_adrs/adr_018_atom_contract_substrate_layer, CLAUDE.md]
---

# Lane Foundation — cc-agent-AC dispatch (atom contract v1.1.0; visibility field)

You are cc-agent-AC. Your last work was the v1.0.0 bootstrap and Bump 1 publish. Today's slice is a minor version bump (v1.1.0) adding visibility partitioning to the `jurisdiction-corpus` atom so the Sync 4.5 partnership-pending jurisdictions (Smithville, Elgin, Bastrop County) can ingest as internal-use only until Sylvia closes partnership.

This is Lane Foundation for the 2026-05-19 sprint. The minor bump fires **Sync A** (planner-side checkpoint) and unblocks Lane A (cc-agent-E) to tag the three partnership-pending jurisdictions as `internal` at ingest time.

## Why this exists

Per the 2026-05-19 sprint pre-mortem resolution, partnership-first sourcing (structural commitment #2) requires that Smithville, Elgin, and Bastrop County not surface in the public catalog until Sylvia-led outreach closes partnership. Bastrop UDC is partnership-confirmed and stays public.

The cleanest contract-level expression of this is a visibility partition on `jurisdiction-corpus`. Downstream MCP server filtering (cc-agent-M's Lane B work) honors the partition at the `list_jurisdictions` boundary so unauthenticated callers only see public-tier jurisdictions.

You decide the exact shape: a new `visibility: 'public' | 'internal'` field on `jurisdiction-corpus`, OR reuse of the ADR-017 `accessPolicy` model with values `public-free` (default for catalog atoms) vs `platform-internal` (for partnership-pending) per existing ADR-017 access-control framing. ADR-017 reuse is preferred if the shape works cleanly; new field is the fallback. Pick what is simpler and document the choice in the v1.1.0 changelog.

## Read first

In order:

1. [`CLAUDE.md`](../CLAUDE.md) — operating instructions and identity.
2. [`_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md`](../_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md) — sprint scope plus Path A partnership-pending resolution.
3. [`80_adrs/adr_017_atom_access_control.md`](../80_adrs/adr_017_atom_access_control.md) — existing access-control model (preferred reuse target).
4. [`80_adrs/adr_018_atom_contract_substrate_layer.md`](../80_adrs/adr_018_atom_contract_substrate_layer.md) — substrate layer placement; you already know this doc.
5. [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Sync points — the visibility-field minor bump is Sync A for this sprint (not part of the original Sync 1-5 sequence).
6. Your prior session at [`_sessions/2026-05-18_hauska_atom_contract_bootstrap_and_port_cc-agent-AC.md`](../_sessions/2026-05-18_hauska_atom_contract_bootstrap_and_port_cc-agent-AC.md) — the v1.0.0 bootstrap that lets you re-enter this codebase.

## Scope

### Phase A — Shape decision

Inspect the existing `jurisdiction-corpus` atom registration in `@hauska/atom-contract` and the existing ADR-017 access-control fields (if already wired) or absence thereof. Two paths:

- **Path R (reuse, preferred).** Use the existing `accessPolicy` field defined per ADR-017. Values: `public-free` (default), `public-paid`, `platform-internal`, `tenant-private`. Partnership-pending = `platform-internal`. Public catalog = `public-free`. No new field; one default change if needed.
- **Path N (new field).** Add `visibility: 'public' | 'internal'` to the `jurisdiction-corpus` schema. Default `'public'`. Use this if the existing `accessPolicy` field is not yet wired or has shape mismatches that make reuse painful.

Document the choice in `CHANGELOG.md` for v1.1.0 with one-paragraph reasoning.

### Phase B — Implementation

Once the shape is decided:

- Update the `jurisdiction-corpus` atom schema in the contract package.
- Update conformance suite: tests for both visibility values; tests for default behavior; `@ts-expect-error` smoke test asserting widened values are rejected.
- Update ContextSummary serialization to include the visibility field per the existing render-mode contract.
- Update render-mode stubs if visibility affects any of the five modes (inline, compact, card, expanded, focus) — likely it should at least flag in expanded mode for operator inspection.
- Update inline documentation (JSDoc or equivalent) on the field.

### Phase C — Publish

- Bump version in `package.json` from `1.0.0` to `1.1.0`.
- Update `CHANGELOG.md` with v1.1.0 entry: shape choice, why, downstream consumer impact (note: consumers pin to `^1.0.0` so the minor bump picks up automatically without explicit consumer pin changes).
- Run full conformance suite locally: `pnpm test`. All green.
- `pnpm build` clean.
- Publish: `npm publish` (auth already established from v1.0.0).
- Tag: `git tag v1.1.0 && git push --tags`.

### Phase D — Hand-off signal

- Commit the version bump + changelog + tag push.
- Session summary at `_sessions/2026-05-19_atom_contract_visibility_v1_1_0_cc-agent-AC.md` (or appropriate date) capturing the shape choice, downstream consumer note, and a "Sync A fires" line.

Planner consumes the Sync A signal and unblocks Lane A.

## Test plan

Conformance suite must cover:

1. `jurisdiction-corpus` atom with default visibility serializes correctly across all five render modes.
2. `jurisdiction-corpus` atom with `'internal'` (or `accessPolicy: 'platform-internal'` if Path R) visibility serializes correctly; expanded mode flags it visibly.
3. `@ts-expect-error` smoke test: widening the visibility field beyond the union raises at compile time.
4. Round-trip: `register()` → `contextSummary()` → composition resolution preserves visibility tag.
5. Existing v1.0.0 tests pass unchanged (no regressions).

Local verification before publish:

```
pnpm install
pnpm test
pnpm build
pnpm typecheck
```

All four commands clean. Then `npm publish`.

## Dependencies

- Lane Foundation has no upstream dependencies from this sprint.
- Operator decision 0.19 (Sylvia outreach) is parallel and does not gate this work — the contract change is purely structural.

## Hand-off

Once Sync A fires (v1.1.0 on npm + tag pushed), the planner notifies cc-agent-E (Lane A) and cc-agent-M (Lane B). cc-agent-E uses the visibility tag when ingesting Smithville, Elgin, Bastrop County. cc-agent-M's `list_jurisdictions` filter honors visibility at the MCP boundary.

You return to steady-state until the next minor bump is needed (likely Lane A's L1-L6 atom shape locks per cc-agent-E dispatch [`2026-05-19_cc-agent-E_l_surface_atom_shapes.md`](2026-05-19_cc-agent-E_l_surface_atom_shapes.md), each of which may need additional atom types registered in the contract; coordinate with cc-agent-E on whether new atom types ride this version's bump or warrant their own subsequent minor bumps).
