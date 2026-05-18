---
decision_id: 2026-05-18_atom_contract_hauska_namespace
date: 2026-05-18
owner: nick
status: active
related_canonical: [80_adrs/adr_001_atom_architecture, 80_adrs/adr_008_engine_factor_out, 80_adrs/adr_018_atom_contract_substrate_layer, 09_post_saas_substrate_thesis, 25_atom_architecture_reference, 26_atom_upgrade_guide, 50_hauska_mcp_server, 60_eci_atomization, CLAUDE.md]
---

## Decision

Rename the atom contract M2-C extraction target from `@empressaio/atom` to `@hauska/atom-contract`. The atom contract is Hauska commercial substrate, peer to the Hauska SDK, not Empressa product. Formalized in [`80_adrs/adr_018_atom_contract_substrate_layer.md`](../80_adrs/adr_018_atom_contract_substrate_layer.md).

## Context

Two recons today established the actual state of the SDK and the design-tools repo. The atom contract is staged at `legacy-design-tools/lib/empressa-atom/` as `@workspace/empressa-atom`, type-enforced, 19 atom types registered, zero `@hauska-sdk/*` dependency. The current README at that path declares the M2-C extraction target as `@empressaio/atom` v1.0.0 per ADR-008. The Hauska SDK recon separately confirmed the SDK has no atom contract code and is structured around VDA + payment + retrieval + wallet + IPFS adapters (substrate of a different kind, peer to the atom contract).

The internal inconsistency surfaced from reading both sources together: ADR-008 body at line 80 says "Empressa brand covers product surfaces and the atom contract"; CLAUDE.md identity section assigns the atom contract to Hauska Inc.'s commercial substrate alongside the SDK, engine, and MCP server. Neither doc alone catches the conflict. The MCP play (every product MCP and the dedicated Hauska MCP Server depend on the atom contract directly, not through the SDK) makes the substrate-vs-product layer split structurally permanent. The rename today, before M2-C publication, is the cheapest moment to align the package name with the layer placement.

## Structural commitment check

Premortem-check 2026-05-18: all four structural commitments green (sell reasoning not data; partnership-first sourcing; cost per jurisdiction; dual-interface as product-line principle). Hauska spine rule strongest possible alignment. Focus queue rule green (rename is a cheap config-level change pre-extraction). Catalog-thesis-check 2026-05-18: all aligned with current canon. Partial conflict with ADR-008 body text (which is itself stale per CLAUDE.md); resolved by ADR-008 body revision in the same session per ADR-018.

## Reasoning

Four substantive points. First, layer ownership. By the structural commitments, substrate is Hauska-layer and products are Empressa-layer. The atom contract is the typed-data half of the substrate; the SDK is the verification-payment half. They are peers. Empressa-namespacing for a Hauska-layer substrate package consumed by Hauska-layer code (Hauska MCP Server, Hauska SDK, public catalog atoms) is brand inversion at the import surface.

Second, dependency shape. The MCP server's job is to expose atoms as tools. To generate tools, validate schemas, and produce LLM context it needs the atom contract directly. It does not need x402, USDC on three chains, ethers v6, Circle, BIP39 wallets, or AES-256-GCM watermarking. If the atom contract sits inside the SDK, every MCP server and every product takes a transitive dependency on the entire commerce substrate just to register an atom type. Putting the contract in its own Hauska-namespaced package keeps the dependency graph clean: SDK and contract are sibling substrates, MCP server depends on the contract package, products depend on the contract package, the SDK optionally wraps contract-conformant atoms in VDAs for paid surfaces.

Third, irreversibility. Once the package is published under a name, every downstream consumer pins to that name. A rename after publication propagates to every product repo, every MCP server, every starter template, every doc, and breaks every existing `import` line in third-party code that has started depending on it. The window for clean rename is now, while the contract is still workspace-private as `@workspace/empressa-atom` and nothing external imports any extracted name.

Fourth, developer-surface readability. `import { register } from '@hauska/atom-contract'` reads as "Hauska substrate, typed-data interface" to an outside developer. `import { register } from '@empressaio/atom'` reads as "Empressa product memory" and forces the developer to learn the corp-split history to understand why the substrate carries the product brand. The Hauska-namespaced name is self-explanatory.

## Reversal criteria

Revisit if (a) a downstream consumer reveals that consuming the contract package directly creates an unworkable dependency boundary (for example, an atom type needs SDK primitives that the contract package structurally cannot expose); (b) the Hauska Inc. corporate structure changes such that the namespace decision needs reconsidering; or (c) a future commercial decision puts the contract under a different brand entirely. The `@hauska/atom` shorter form is the most likely rename target if the explicit `-contract` suffix proves cumbersome in practice.

## Dependencies

Depends on ADR-018 (formalizes the substrate-layer split and the namespace choice; ratified same session). Depends on ADR-008 body revision (reconciles the line-80 inconsistency with this decision; landed same session). Affects M2-C extraction work in legacy-design-tools (one README line at `lib/empressa-atom/README.md` updates; package name target shifts; no code changes). Affects the queued doc-set sweep across 25_atom_architecture_reference, 26_atom_upgrade_guide, 27_engine_evolution_plan, 11_roadmap, 51_substrate_v1_sprint, ADR-001 (listed as named follow-ons in ADR-018).

## Counterparties

Internal: Nick (operator, decision-maker). Affected stakeholders: the M2-C extraction work in legacy-design-tools (cc-agent or whichever agent owns the extraction sprint) picks up the renamed target. The Hauska MCP Server starter (currently in `doc_repo/MCP Server/`, planned migration to a dedicated repo per the paired decision today) will import from `@hauska/atom-contract` once the contract is extracted.

External: future consumers of the published atom contract package. The Hauska-namespaced name is the surface they will see; preserves the substrate-brand story.
