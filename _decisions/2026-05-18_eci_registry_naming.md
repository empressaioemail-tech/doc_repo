---
decision_id: 2026-05-18_eci_registry_naming
date: 2026-05-18
owner: nick
status: active
related_canonical: [60_eci_atomization, 60a_eci_atomization_sprint, 80_adrs/adr_018_atom_contract_substrate_layer, 80_adrs/adr_013_procedure_execution_atoms, 80_adrs/adr_015_actor_atoms, 80_adrs/adr_017_atom_access_control, 00_current_state, CLAUDE.md]
---

## Decision

Two paired decisions for the ECI atomization sprint kickoff. (1) Confirm `@empressaio/atom-internal` as the canonical package name for the ECI internal atom registry. (2) Locate the registry's source in a dedicated GitHub repo at `empressaioemail-tech/empressa-atom-internal`. Sprint plan lives at [`60a_eci_atomization_sprint.md`](../60a_eci_atomization_sprint.md).

## Context

The ECI atomization spec at [`60_eci_atomization.md`](../60_eci_atomization.md) (drafted 2026-05-15, dependencies completed 2026-05-16) names `@empressaio/atom-internal` as the registry package name per Nick's routing decision and declares "own sprint, post-[`51`](../51_substrate_v1_sprint.md) v1 ship; likely `60a_eci_atomization_sprint.md` when scoped." CLAUDE.md identity section reinforces the same package name. [ADR-018](../80_adrs/adr_018_atom_contract_substrate_layer.md) Neutral section explicitly leaves the registry's package-name ratification and repo-placement decision open for the kickoff session.

The kickoff condition is met. Substrate v1 sprint Phase 0 closed 2026-05-18 per [`_decisions/2026-05-18_substrate_v1_phase_0_close.md`](2026-05-18_substrate_v1_phase_0_close.md); dispatch allocation landed per [`_decisions/2026-05-18_substrate_v1_dispatch_allocation.md`](2026-05-18_substrate_v1_dispatch_allocation.md). The original hand-off prompt that opened the 2026-05-18 evening session was ECI atomization kickoff; operator deferred it behind 51 ("do those first, then we'll hop back over here and do the ECI stuff"); 51 is now dispatch-ready and the ECI work resumes.

## Structural commitment check

Premortem clear across all four structural commitments. ECI atoms carry only `platform-internal` or `tenant-private` access policy (never `public-free` or `public-paid`); commitments 1 (sell reasoning), 2 (partnership-first sourcing), 3 (cost per jurisdiction) are N/A by virtue of ECI being internal-tenant. Commitment 4 (MCP-first dual interface) aligned: ECI atoms ship MCP-first via the internal endpoint at `mcp.internal.hauska.dev` per [`60_eci_atomization.md`](../60_eci_atomization.md) Open questions, non-commercial per [`29_mcp_surface_tier_model.md`](../29_mcp_surface_tier_model.md). Operational yellow on the focus-queue rule (dedicated repo is one more repo to maintain) accepted on the same reasoning as the 2026-05-18 hauska-mcp-server precedent.

Catalog-thesis check aligned. Package name `@empressaio/atom-internal` correctly carries Empressa namespace because ECI is Empressa-internal product memory; the `-internal` suffix parallels `@hauska/atom-contract`'s substrate-package-plus-role-suffix shape. Dedicated repo at `empressaioemail-tech/empressa-atom-internal` correctly carries Empressa brand (Empressa-namespaced npm scope; matching repo name) and lives in the same GitHub org as the other Hauska-stack repos (`hauska-sdk`, `hauska-mcp-server`, planned `hauska-engine`) per ADR-008.

## Reasoning

Two substantive points per decision.

**Decision 1 reasoning (package name).** First, brand placement. ECI is Empressa-internal product memory (sprints, decisions, sessions, conversations, daily synthesis). The Empressa namespace is structurally correct. Hauska-namespacing would brand-invert internal product memory under the commercial-substrate layer; ADR-018's substrate-vs-product split makes the brand-coherent choice unambiguous. Second, structural parallel. `@empressaio/atom-internal` mirrors `@hauska/atom-contract` in shape: substrate-or-product-namespaced package plus role-suffix. `-internal` reads as "the internal atom registry"; future Empressa-internal sub-packages (if any) can follow the same suffix pattern.

**Decision 2 reasoning (dedicated repo).** First, dependency coordination at M2-C. Once Bump 1 extracts `@hauska/atom-contract` v1.0.0 as a published npm package (per [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Bump 1), the ECI internal registry is one of the first significant external consumers. A dedicated repo means the consumer-of-published-contract story exercises cleanly from day one. No monorepo workspace cheat; no in-source import. Second, structural parallel with the 2026-05-18 hauska-mcp-server precedent. The MCP server is Hauska commercial substrate ("public catalog read surface"); the atom-internal registry is Empressa internal substrate ("internal product memory"). Both are substrate-shaped packages structurally distinct from any single product surface. Both get dedicated repos for the same reason: substrate-shape doesn't fit naturally inside any product repo, and dedicated repos make migration to a future Hauska Inc. corp GitHub org (per ADR-008 P3 roadmap entry) cleaner. Third, cheapest moment is now. The starter has no production consumers. Bootstrapping a fresh empty repo is half a day of operator work. Doing it after P1 produces consumer code, or after the ECI Replit pnpm monorepo grows accustomed to a path-pin shape, is strictly more expensive in every dimension.

Three alternatives rejected for Decision 2. (a) Inside legacy-design-tools as a workspace package: rejected because legacy-design-tools is the Cortex product repo; ECI-internal atom types have no Cortex domain overlap; mixing creates brand confusion at the workspace level. (b) Inside the ECI Replit repo as workspace-private: rejected because ECI is Replit-hosted today and atomization is forward-looking; Replit-pinned location weakens the data-portability rationale at [`60_eci_atomization.md`](../60_eci_atomization.md) Why atomize ECI section. (c) Inside the planned hauska-engine: rejected because hauska-engine is Hauska commercial substrate (Track 1 pipeline plus retrieval), not Empressa product memory; mixing would brand-invert ECI under Hauska.

## Reversal criteria

Per-decision reversal triggers.

For Decision 1 (package name): revisit if (a) the ECI registry grows additional sub-packages and `-internal` proves a confusing suffix that conflicts with the new shape; (b) future Hauska Inc. corporate restructuring requires renamespacing internal-product packages.

For Decision 2 (dedicated repo): revisit if (a) ECI Replit-to-GitHub migration completes before M2-C and a single ECI monorepo containing the registry plus the consumer app proves more efficient than peer repos; (b) M2-C extraction reveals tighter contract-registry coupling than the recon evidence suggests, in which case co-location with `@hauska/atom-contract` in a single substrate monorepo would be the next-best option; (c) the GitHub-org strategy at [`72_hauska_inc_operations.md`](../72_hauska_inc_operations.md) Entity status section completes in a way that requires relocating ECI-internal repos.

## Dependencies

Depends on [`80_adrs/adr_018_atom_contract_substrate_layer.md`](../80_adrs/adr_018_atom_contract_substrate_layer.md) which establishes the substrate-vs-product split and renames the M2-C extraction target to `@hauska/atom-contract`. Depends on [`_decisions/2026-05-18_substrate_v1_phase_0_close.md`](2026-05-18_substrate_v1_phase_0_close.md) and [`_decisions/2026-05-18_substrate_v1_dispatch_allocation.md`](2026-05-18_substrate_v1_dispatch_allocation.md) which together ready the substrate v1 sprint such that ECI kickoff can resume. Unblocks ECI P1 (minimum-viable registry) and P2 (backfill), both pre-M2-C feasible. Coordinates with cc-agent-2's Stream 1B work (publishes `hauska-engine/packages/atoms/`) which feeds Bump 1 atom contract publication; P3 of ECI atomization gates on that.

## Counterparties

Internal: Nick (operator; creates the `empressaioemail-tech/empressa-atom-internal` repo and pastes the eventual P1 dispatch prompt to the cc-agent assigned to the ECI work). cc-agent-X (TBD allocation; consumer of P1 dispatch).

External: future consumers of the ECI internal MCP endpoint `mcp.internal.hauska.dev` (operator-side Claude conversations, strategic agents reading ECI state). The dedicated repo is what they will discover if the registry is ever published or surfaced; the Empressa-namespaced name is the surface they see.
