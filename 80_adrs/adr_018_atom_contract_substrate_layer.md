---
id: adr_018_atom_contract_substrate_layer
title: "ADR-018 — Atom contract substrate layer placement and Hauska namespace"
status: accepted
last_updated: 2026-05-18
applies_to: portfolio
related: [adr_001_atom_architecture, adr_008_engine_factor_out, adr_012_atom_export_format, 09_post_saas_substrate_thesis, 25_atom_architecture_reference, 26_atom_upgrade_guide, 28_mcp_first_product_design, 50_hauska_mcp_server, 51_substrate_v1_sprint, 60_eci_atomization]
owner: nick
---

# ADR-018 — Atom contract substrate layer placement and Hauska namespace

## Status

**Accepted 2026-05-18.** Originated during the 2026-05-18 Claude Code session that ran two repo recons (Hauska SDK at `p:\Hauska SDK`; legacy-design-tools at `P:\legacy-design-tools`), premortem-check, and catalog-thesis-check on two paired decisions. Both decisions cleared; both decision records filed alongside this ADR at [`_decisions/2026-05-18_atom_contract_hauska_namespace.md`](../_decisions/2026-05-18_atom_contract_hauska_namespace.md) and [`_decisions/2026-05-18_hauska_mcp_server_dedicated_repo.md`](../_decisions/2026-05-18_hauska_mcp_server_dedicated_repo.md).

## Context

Three findings from the recons drove this ADR.

First, the atom contract today is a workspace-private package at `legacy-design-tools/lib/empressa-atom/` named `@workspace/empressa-atom`. It is fully type-enforced (the `register()` signature rejects widened entity types, forces `defaultMode` membership in `supportedModes`, and forces ContextSummary completeness; `@ts-expect-error` smoke tests assert these). The five rendering modes (`inline`, `compact`, `card`, `expanded`, `focus`) exist as a literal union. Nineteen atom types are registered. The package has zero `@hauska-sdk/*` dependency; it pulls only `drizzle-orm`, `pg`, and `@workspace/db`. The package README declares the package as "the in-repo staging ground for `@empressaio/atom` v1.0.0, the SDK extraction planned for milestone M2-C." Extraction has not happened.

Second, the Hauska SDK at `p:\Hauska SDK` is a separate twelve-package monorepo structured around a Verifiable Digital Asset (VDA) primitive plus event-anchoring hash chain plus a full payment substrate (x402, USDC on Base+ETH+Polygon, Circle) plus gated retrieval plus wallet management plus storage and blockchain adapters. The SDK has zero atom-contract code: no `registerAtom`, no `AtomContract`, no rendering-mode enum. The two substrates (atom contract; SDK) are structurally separate today and have been throughout development.

Third, ADR-008 body text at line 80 states "Empressa brand covers product surfaces and the atom contract." CLAUDE.md identity section assigns the atom contract to Hauska Inc.'s commercial substrate alongside the SDK, engine, and MCP server. Neither doc alone surfaces the conflict. The two-recon view forced the cross-doc reading that surfaced it.

The MCP play (every product MCP and the dedicated Hauska MCP Server depend on the atom contract directly) makes the substrate-vs-product layer split structurally permanent rather than provisional. The atom contract is what every agent surface needs to enumerate, validate, and render atoms; the SDK is what monetizes atoms once they exist. Conflating the two layers under a single namespace (either `@hauska-sdk/atom` or `@empressaio/atom`) forces every downstream consumer to take a transitive dependency on the unrelated layer. Keeping them as peer Hauska substrates resolves the dependency-shape problem and matches the structural commitments.

## Decision

The atom contract is Hauska commercial substrate, peer to the Hauska SDK, not Empressa product. The M2-C extraction target is `@hauska/atom-contract`.

The Hauska SDK (`@hauska-sdk/*` packages: core, vda, payment, retrieval, wallet, adapters-*) and the atom contract (`@hauska/atom-contract`) are peer substrates. The SDK delivers verification, payment, retrieval, wallet primitives over atom-shaped digital assets; the atom contract delivers the typed-data interface, registration mechanism, rendering modes, accessPolicy semantics, and context-interface that makes something an atom in the first place. The two layers are sibling Hauska commercial substrates, neither contains the other.

Consumers depend on each substrate independently. Empressa product surfaces consume both: the contract for atom registration and rendering, the SDK for verifiable monetization. The Hauska MCP Server consumes the atom contract directly for tool generation, schema validation, and LLM-context production; it consumes the SDK only when serving paid-tier surfaces that require VDA wrapping or revenue routing. Every product MCP wraps a product-specific subset of the same contract.

The atom contract package has zero runtime dependency on `@hauska-sdk/*`. The dependency graph is: contract → (TypeScript, schema runtime, optional persistence adapter); SDK → (ethers, IPFS, payment infra); product or MCP → (contract, optionally SDK). No cycles.

## Alternatives considered

**Alternative 1. Keep the M2-C extraction target as `@empressaio/atom` per current ADR-008.** Rejected. Brand-inverts substrate under product. The atom contract is the typed-data substrate every product depends on; putting it under the Empressa product namespace forces every downstream consumer (Hauska MCP Server, public catalog atom packs, third-party agent surfaces) to import substrate code through a product brand. The CLAUDE.md identity section already places the atom contract in Hauska Inc.'s commercial substrate; the package name should match.

**Alternative 2. Fold the atom contract into the Hauska SDK as `@hauska-sdk/atom`.** Rejected for two reasons. First, conflates two distinct substrates: the atom contract is typed-data, the SDK is verification-payment-storage; they are orthogonal. Second, forces every MCP server and every product to take a transitive dependency on the entire SDK commerce substrate (x402, USDC on three chains, ethers v6, Circle, BIP39 wallets) just to register an atom type. The free-tier Hauska MCP Server in particular has no use for any of that and should be able to depend on the contract directly without inheriting the commerce stack.

**Alternative 3. Defer the rename until M2-C extraction lands.** Rejected. The cheapest moment to rename is before publication. Rename after publication propagates to every published consumer, every starter template, every doc reference, and breaks every existing import line in third-party code that has started depending on the published name. The window for clean rename is now, while the contract is still workspace-private and nothing external imports the extracted name.

**Alternative 4. Use the shorter `@hauska/atom` form.** Considered. Has the merit of brevity and parallel structure with `@empressaio/atom`. Rejected for `@hauska/atom-contract` because the explicit `-contract` suffix disambiguates the package from future Hauska atom-related packages: `@hauska/atompack` (the export format from ADR-012), `@hauska/atoms-bastrop` or other jurisdiction atom-collection packages, `@hauska/atom-types` if a type-only subpackage is ever needed. Reserving the bare `@hauska/atom` namespace for potential future use, or for a meta-package that re-exports the contract plus common helpers, keeps the topology open. The decision record names `@hauska/atom` as the most likely reversal target if `@hauska/atom-contract` proves cumbersome.

## Consequences

**Positive.**

Substrate brand matches structural placement. Every consumer's import line reads as Hauska substrate plus typed-data interface. `import { register } from '@hauska/atom-contract'` is self-explanatory to an outside developer; no corp-split history required.

Dependency graph stays clean. MCP servers, product surfaces, and the SDK all depend on `@hauska/atom-contract` as a sibling rather than parent or child. The SDK can wrap contract-conformant atoms in VDAs for paid surfaces without forcing the contract to know about VDAs.

Public catalog distribution reads cleanly. A `Bastrop.atompack` per ADR-012 contains atoms registered against `@hauska/atom-contract`; the LLM bootstrap and the `view.html` renderer can reference the substrate by its Hauska-namespaced contract package without explaining why a substrate file is referencing an Empressa-namespaced contract.

The Hauska Inc. corporate substrate story is complete at the namespace level: `@hauska/atom-contract` (typed-data substrate), `@hauska-sdk/*` (commerce substrate), `hauska-engine` (intelligence substrate), `hauska-mcp-server` (agent-consumption substrate). All four substrates live under the Hauska brand at the package and repo level.

**Negative.**

Doc-set sweep required. Active doc references to `@empressaio/atom` exist in `25_atom_architecture_reference.md` (11 hits, doc title includes the package name), `26_atom_upgrade_guide.md` (15 hits, doc title includes the package name), `27_engine_evolution_plan.md` (line 226), `11_roadmap.md` (line 275), `51_substrate_v1_sprint.md` (lines 90 and 133), `80_adrs/adr_001_atom_architecture.md` (5 hits). These need rename. This ADR explicitly defers the sweep; the load-bearing edits (ADR-008 body, CLAUDE.md, 50_hauska_mcp_server, 00_current_state) land in the same session as this ADR. The remaining sweep is queued in [Known follow-on doc updates](#known-follow-on-doc-updates) below.

Coordination cost at M2-C extraction. The legacy-design-tools repo needs a one-line README update at `lib/empressa-atom/README.md` to reflect the new target name. Session summary contains the hand-off snippet.

**Neutral.**

The ECI internal atom registry (canonical name `@empressaio/atom-internal` per [`60_eci_atomization.md`](../60_eci_atomization.md) and CLAUDE.md line 91) is unchanged by this ADR. ECI atoms are Empressa-internal product memory (decisions, sprints, sessions, procedure-execution, actor-record); the Empressa namespace is structurally correct for that registry. The internal registry will consume the renamed `@hauska/atom-contract` as its base substrate.

The public jurisdiction atom-collection packages naming (e.g., `@hauska/atoms-bastrop`, `@hauska/atoms-grand-county`) is deferred. The decision today fixes the contract package name; collections are downstream.

## Known follow-on doc updates

Initially queued for future sessions; **all seven items completed in
the 2026-05-18 doc-set-sweep session** ([`_sessions/2026-05-18_doc_set_sweep_adr018_claude_code.md`](../_sessions/2026-05-18_doc_set_sweep_adr018_claude_code.md)).
Checklist preserved as a status indicator for future agents.

- [x] [`25_atom_architecture_reference.md`](../25_atom_architecture_reference.md) — body sweep plus title update (doc title was "@empressaio/atom — Architecture reference"; now "@hauska/atom-contract — Architecture reference"). Completed 2026-05-18.
- [x] [`26_atom_upgrade_guide.md`](../26_atom_upgrade_guide.md) — body sweep plus title update (doc title was "@empressaio/atom — Upgrade & Consumption Guide"; now "@hauska/atom-contract — Upgrade & Consumption Guide"). Completed 2026-05-18.
- [x] [`27_engine_evolution_plan.md`](../27_engine_evolution_plan.md) line 226 — `@empressaio/atom` consumer-coordination reference renamed to `@hauska/atom-contract`. Completed 2026-05-18.
- [x] [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) lines 90, 133 — minor-version-bump coordination references renamed to `@hauska/atom-contract`. Completed 2026-05-18.
- [x] [`80_adrs/adr_001_atom_architecture.md`](adr_001_atom_architecture.md) — five in-body references renamed; v1.3 ownership-correction note marked superseded with adjacent ADR-018 pointer; Subsidiary-commitments "Empressa owns the atom contract" bullet rewritten to "Hauska commercial substrate owns the atom contract, distinct from the Hauska SDK." Completed 2026-05-18.
- [x] [`11_roadmap.md`](../11_roadmap.md) line 275 — `@empressaio/atom` commercial-posture revisit trigger renamed to `@hauska/atom-contract`. Completed 2026-05-18.
- [x] [`14_pricing_framework.md`](../14_pricing_framework.md) — "Phased implementation" subsection replaced with "Substrate state — code reality vs integration work" reflecting the SDK recon re-verification 2026-05-18 (56 tests green; Circle checkout URL generation at `packages/payment/src/payment-request.ts:253` the sole production code TODO). Completed 2026-05-18.

## Reversal criteria

Revisit if (a) a downstream consumer reveals that consuming `@hauska/atom-contract` directly creates an unworkable dependency boundary that would be cleaner if the contract were folded into the SDK or split further (for example, an atom type needs SDK primitives the contract package structurally cannot expose, and exposing them via a peer dependency creates a cycle); (b) the Hauska Inc. corporate structure changes such that the namespace decision needs reconsidering (for example, IP-related restructuring that requires substrate packages under a different brand); or (c) a future commercial decision puts the contract under a different brand entirely. The shorter `@hauska/atom` form is the most likely rename target if the `-contract` suffix proves cumbersome.

## References

- [`80_adrs/adr_001_atom_architecture.md`](adr_001_atom_architecture.md) — atom contract definition; this ADR supersedes the v1.3 ownership-correction note that placed the contract under Empressa.
- [`80_adrs/adr_008_engine_factor_out.md`](adr_008_engine_factor_out.md) — engine brand and repo placement; body revised in the same session as this ADR to reconcile the line-80 atom-contract inconsistency.
- [`80_adrs/adr_012_atom_export_format.md`](adr_012_atom_export_format.md) — `.atom` and `.atompack` export formats; both reference the atom contract's five rendering modes.
- [`09_post_saas_substrate_thesis.md`](../09_post_saas_substrate_thesis.md) — strategic frame; this ADR is the engineering manifestation of the four-commitment substrate-layer placement.
- [`28_mcp_first_product_design.md`](../28_mcp_first_product_design.md) — product-line MCP principle; the contract-direct dependency this ADR formalizes is what makes MCP-first product design clean.
- [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) — MCP server framing; updated in same session to reflect the dedicated-repo decision and the contract rename.
- [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) — substrate v1 execution plan; queued for body update per Known follow-on doc updates.
- [`60_eci_atomization.md`](../60_eci_atomization.md) — ECI internal registry plan; internal registry naming explicitly out of scope of this ADR.
- [`_decisions/2026-05-18_atom_contract_hauska_namespace.md`](../_decisions/2026-05-18_atom_contract_hauska_namespace.md) — companion decision record.
- [`_decisions/2026-05-18_hauska_mcp_server_dedicated_repo.md`](../_decisions/2026-05-18_hauska_mcp_server_dedicated_repo.md) — paired decision record.
- [`_sessions/2026-05-18_atom_contract_hauska_namespace_and_mcp_repo_split_claude_code.md`](../_sessions/2026-05-18_atom_contract_hauska_namespace_and_mcp_repo_split_claude_code.md) — session origin.

## Revision history

- **2026-05-18 (origin):** drafted during the Claude Code session that ran the Hauska SDK and legacy-design-tools recons. Ratifies the substrate-layer split (atom contract as Hauska substrate, peer to the Hauska SDK), names the M2-C extraction target as `@hauska/atom-contract`, supersedes the ADR-001 v1.3 ownership-correction note, and queues the doc-set sweep across 25, 26, 27, 11, 14, 51, ADR-001 as named follow-ons.
- **2026-05-18 (doc-set sweep completion):** all seven Known-follow-on-doc-updates items executed in a same-day follow-on session per [`_sessions/2026-05-18_doc_set_sweep_adr018_claude_code.md`](../_sessions/2026-05-18_doc_set_sweep_adr018_claude_code.md). Checklist flipped from unchecked to checked; preserved in place as a status indicator. 14_pricing_framework reconciliation re-verified the SDK payment substrate state against current code (`packages/payment/package.json`, `packages/payment/src/payment-request.ts:250-273`, `npm test --workspace=@hauska-sdk/payment` 56 passed). No engineering content changed in any of the seven docs; the sweep was strictly nomenclature plus the 14_pricing_framework substrate-state reconciliation.
