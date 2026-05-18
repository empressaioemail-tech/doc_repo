---
id: 2026-05-18_cc-agent-AC_hauska_atom_contract
title: Dispatch — cc-agent-AC hauska-atom-contract (M2-C extraction; Bump 1 publication)
date: 2026-05-18
agent: cc-agent-AC
repo: hauska-atom-contract
kind: dispatch
related: [51_substrate_v1_sprint, 25_atom_architecture_reference, 26_atom_upgrade_guide, 27_engine_evolution_plan, 80_adrs/adr_001_atom_architecture, 80_adrs/adr_010_atom_graph_traversal, 80_adrs/adr_011_atom_identity_across_versions, 80_adrs/adr_012_atom_export_format, 80_adrs/adr_018_atom_contract_substrate_layer, 00_current_state, CLAUDE.md, _decisions/2026-05-18_substrate_v1_dispatch_reallocation, _decisions/2026-05-18_substrate_v1_phase_0_close]
---

# Substrate v1 — cc-agent-AC dispatch (hauska-atom-contract; Bump 1 publication)

You are cc-agent-AC, owning the `empressaioemail-tech/hauska-atom-contract` repo. Your slice is the load-bearing dependency for the entire substrate v1 sprint: Sync 1 (Bump 1 atom contract v1.0.0 published on npm) unblocks every other stream's atom-shape work.

## Read first

In order:

1. [`CLAUDE.md`](../CLAUDE.md) — operating instructions and identity.
2. [`00_current_state.md`](../00_current_state.md) — portfolio snapshot.
3. [`_decisions/2026-05-18_substrate_v1_phase_0_close.md`](../_decisions/2026-05-18_substrate_v1_phase_0_close.md) — Phase 0 decisions.
4. [`_decisions/2026-05-18_substrate_v1_dispatch_reallocation.md`](../_decisions/2026-05-18_substrate_v1_dispatch_reallocation.md) — per-repo allocation rationale; supersedes the prior cross-repo doubling.
5. [`80_adrs/adr_018_atom_contract_substrate_layer.md`](../80_adrs/adr_018_atom_contract_substrate_layer.md) — substrate layer placement; M2-C extraction target name `@hauska/atom-contract`; peer-to-Hauska-SDK posture; rendering modes; consequences section names the legacy-design-tools README hand-off snippet.
6. [`80_adrs/adr_001_atom_architecture.md`](../80_adrs/adr_001_atom_architecture.md) — four-layer contract (identity, context interface, composition, history); every atom type registered carries this shape.
7. [`80_adrs/adr_010_atom_graph_traversal.md`](../80_adrs/adr_010_atom_graph_traversal.md) — typed link taxonomy required by cross-reference atom types.
8. [`80_adrs/adr_011_atom_identity_across_versions.md`](../80_adrs/adr_011_atom_identity_across_versions.md) — DID plus IPNS identity semantics.
9. [`80_adrs/adr_012_atom_export_format.md`](../80_adrs/adr_012_atom_export_format.md) — five render modes (inline, compact, card, expanded, focus); focus polish-grade.
10. [`25_atom_architecture_reference.md`](../25_atom_architecture_reference.md) — architecture reference for the nineteen existing atom types you port.
11. [`26_atom_upgrade_guide.md`](../26_atom_upgrade_guide.md) — consumer coordination pattern; informs Bump 1 cross-repo PR shape planner runs after you publish.
12. [`27_engine_evolution_plan.md`](../27_engine_evolution_plan.md) — §Stream B Bump 1 names the new atom types you add.
13. [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) — §Bump 1 atom contract coordination (load-bearing); §Sync points.

## Scope

### Phase A — Bootstrap

Nick creates the empty `empressaioemail-tech/hauska-atom-contract` GitHub repo before you start. Bootstrap pattern matches the 2026-05-18 hauska-mcp-server bootstrap (commit `d00586b` in that repo for reference). TypeScript, pnpm, lint (eslint), typecheck (tsc), test (vitest), CI (GitHub Actions: lint, typecheck, test on PR plus push). Single package at repo root or `packages/contract/`; pick the simpler shape and document.

### Phase B — Port the workspace-private contract

Source today: `legacy-design-tools/lib/empressa-atom/` published internally as `@workspace/empressa-atom`. The contract is fully type-enforced per [`adr_018:21`](../80_adrs/adr_018_atom_contract_substrate_layer.md#L21): `register()` rejects widened entityType, forces defaultMode membership in supportedModes, forces ContextSummary completeness; `@ts-expect-error` smoke tests assert these. Five rendering modes exist as a literal union (`inline`, `compact`, `card`, `expanded`, `focus`). Nineteen atom types are registered. Zero `@hauska-sdk/*` dependency; pulls only `drizzle-orm`, `pg`, and `@workspace/db`.

Port work:

- Copy source from `legacy-design-tools/lib/empressa-atom/` into the new repo.
- Rename package from `@workspace/empressa-atom` to `@hauska/atom-contract` in `package.json` and every import path.
- Preserve the type-enforced `register()` signature.
- Preserve the five-mode rendering enum.
- Preserve all `@ts-expect-error` smoke tests; they should pass identically post-rename.
- Port the nineteen existing atom type registrations.
- Verify type tests green (`pnpm typecheck` plus `pnpm test`).
- Drop the `@workspace/db` dependency if the contract package itself does not require persistence; if it does, swap to a peer-dependency shape so consumers inject their own pg connection.

### Phase C — Add Bump 1 atom types

Per [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Bump 1 atom contract coordination and [`27_engine_evolution_plan.md`](../27_engine_evolution_plan.md) §Stream B Bump 1, add:

- `code-section`
- `code-definition`
- `code-amendment`
- `code-cross-reference`
- `code-edition`
- `jurisdiction-corpus`

Plus adjudication-context atoms from [`27_engine_evolution_plan.md`](../27_engine_evolution_plan.md) §Compounding-context atoms — these ship in Bump 1 but are NOT exposed via the public MCP server (Layer 2 paid; stay inside Codex 1b per [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) §What's deliberately absent from v1):

- `adjudication-record`
- `per-reviewer-pattern`
- `comparable-project-precedent`

For each new atom type:

- Schema definition with full Zod validation.
- Render mode stubs per ADR-001 five modes; focus mode polish-grade per ADR-012.
- Registration through the typed `register()` signature.
- `@ts-expect-error` test asserting widening rejection.
- Round-trip test through `register()` → `contextSummary()` → composition resolution.

### Phase D — Publish v1.0.0

- Final type tests green.
- Conformance test suite covers all twenty-eight atom types (nineteen ported plus nine new).
- npm publish under `@hauska/atom-contract` scope. Coordinate npm-org access with Nick if needed.
- Tag `v1.0.0` in git.
- Update `legacy-design-tools/lib/empressa-atom/README.md` to point to the new published package and mark the workspace-private location as the historical staging ground (per ADR-018 §Consequences hand-off snippet at [`adr_018:65`](../80_adrs/adr_018_atom_contract_substrate_layer.md#L65)).

## Sync points

You publish:

- **Sync 1 — Bump 1 atom contract published.** Once `@hauska/atom-contract@1.0.0` is on npm, signal in your session summary. Planner (doc_repo) takes over Bump 1 cross-repo PR rollout immediately. cc-agent-E and cc-agent-M swap from workspace-private path-pin to npm dependency on signal.

You wait on: none.

## Coordination

Planner-owned Bump 1 cross-repo PR rollout follows your v1.0.0 publication. Planner opens single-PR-per-repo pin updates against:

- `legacy-design-tools` (api-server pin plus atom validation update plus README pointer update per Phase D above).
- `smartcity-os` (api-server pin; no-op consumer until Codex 1b lands).
- `legacy-revit-sensor` (consumer; touches `detail-callout-spec` separately).
- `hauska-engine` `packages/atoms/` (cc-agent-E pins to your published version; planner files the PR; cc-agent-E coordinates internal `packages/atoms/` content).
- `hauska-mcp-server` (cc-agent-M pins to your published version; planner files the PR; cc-agent-M coordinates internal handler usage).

Atomic merge across all five repos per [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Bump 1.

Doc clarification you may surface in your first session summary: [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Bump 1 describes Bump 1 as adding the nine atom types in `@hauska/atom-contract`, while §Repo layout marks `hauska-engine/packages/atoms/` as "Atom registry (Bump 1)". The line between contract-package content (atom type definitions, registration API, schema, render stubs) and engine-package content (atom instance generation, runtime registry binding, jurisdiction-scoped consumer code) should be drawn explicitly in your session summary so cc-agent-E's `packages/atoms/` work has no overlap with your contract package.

## Out of scope

- Atom instance generation per jurisdiction (cc-agent-E owns; consumes your published atom types).
- MCP server tool surface (cc-agent-M owns; pins to your published version).
- Cross-repo pin-update PRs (planner owns).
- Storage, retrieval API, eval harness (cc-agent-E Streams 1C, 1D).
- Auth, rate limiting, Stripe, deploy (cc-agent-M Streams 2B, 2D).

## Done criteria

- `@hauska/atom-contract@1.0.0` on npm.
- All nineteen existing atom types ported.
- All nine new Bump 1 atom types registered (six MCP-exposed plus three adjudication-context Layer-2-only).
- Conformance test suite green.
- legacy-design-tools README pointer updated.

## Session protocol

Per CLAUDE.md session protocol. Session close lands `_sessions/<YYYY-MM-DD>_<topic>_cc-agent-AC.md` in doc_repo plus commits to `hauska-atom-contract` (and the one README touch to `legacy-design-tools`). Signal Sync 1 in the session summary so planner can start the Bump 1 cross-repo PR rollout immediately.
