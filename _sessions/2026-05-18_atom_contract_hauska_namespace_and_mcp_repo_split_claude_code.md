---
date: 2026-05-18
agent: claude-code
repo: docs
session_type: planning
rolled_up: true
rolled_up_into: [80_adrs/adr_018_atom_contract_substrate_layer, 80_adrs/adr_008_engine_factor_out, 50_hauska_mcp_server, CLAUDE.md, 00_current_state, _decisions/2026-05-18_atom_contract_hauska_namespace, _decisions/2026-05-18_hauska_mcp_server_dedicated_repo]
---

## What was done

Two repo recons, two paired strategic decisions ratified, three new canonical artifacts produced, four existing canonical docs updated, one commit at session close.

The recons. Probing prompt for the Hauska SDK repo at `p:\Hauska SDK` produced `RECON_2026-05-18.md` (twelve published-ready packages organized around VDA + payment + event-anchoring + retrieval + wallet + adapters; zero atom-contract code; parked at six weeks no activity since last commit 2026-04-05; full payment substrate built and tested at 56 cases green). Probing prompt for the legacy-design-tools repo at `P:\legacy-design-tools` produced `RECON_2026-05-18_codex.md` (atom contract present at `lib/empressa-atom/` as workspace-private `@workspace/empressa-atom`, type-enforced, 19 of 24 expected atoms registered, all five rendering modes defined as a literal union, zero `@hauska-sdk/*` dependency, README declares M2-C extraction target as `@empressaio/atom`; repo is the active engine room at 572 commits in 120 days; MCP server does not exist anywhere in the repo, contradicting the conversation's earlier belief; ATOM_CONTEXT_V2 doc claim is stale, the flag does not exist in code; 4 atoms missing `focus` rendering mode (sheet, decision-event, submission, submission-classification) which will block their `.atom` export per ADR-012 when renderers ship).

The decisions. Premortem-check 2026-05-18 cleared both (all green plus one operational yellow on focus-queue for the MCP-repo migration's half-day cost). Catalog-thesis-check 2026-05-18 cleared both (all aligned with current canon; partial conflict surfaced with ADR-008 line 80 body text, which was itself stale relative to CLAUDE.md identity section). Decisions ratified:

1. M2-C atom contract extraction target renamed from `@empressaio/atom` to `@hauska/atom-contract`. The atom contract is Hauska commercial substrate, peer to the Hauska SDK, consumed directly by the Hauska MCP Server and by Empressa product surfaces. Recorded at [`_decisions/2026-05-18_atom_contract_hauska_namespace.md`](../_decisions/2026-05-18_atom_contract_hauska_namespace.md).
2. MCP server starter implementation migrates from `doc_repo/MCP Server/` (gitignored) to a dedicated `empressaioemail-tech/hauska-mcp-server` GitHub repo. Recorded at [`_decisions/2026-05-18_hauska_mcp_server_dedicated_repo.md`](../_decisions/2026-05-18_hauska_mcp_server_dedicated_repo.md). Awaits Nick action to create the repo.

The doc changes. Produced [`80_adrs/adr_018_atom_contract_substrate_layer.md`](../80_adrs/adr_018_atom_contract_substrate_layer.md) formalizing the substrate-layer split and the namespace choice, with explicit Known-follow-on-doc-updates checklist for the queued sweep across 25, 26, 27, 11, 14, 51, ADR-001. Revised [`80_adrs/adr_008_engine_factor_out.md`](../80_adrs/adr_008_engine_factor_out.md) body at the brand-coherence section, decision section, and brand-summary section to reflect Hauska substrate placement; corrected the stale "Design Accelerator" reference to "Cortex" per CLAUDE.md identity section; added revision-history entry. Updated [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) with a new "Repo placement and migration status" section, the line-171 Bump 1 atom-package reference, and the scaffold-location pointer at the references section. Updated `CLAUDE.md` "What is settled" with the ADR-018 entry; updated the "What is open" MCP-server-migration entry with the Decision 2 ratification and target repo name. Updated [`00_current_state.md`](../00_current_state.md) Open ADRs to add ADR-018, Recent session summaries to add today, Cross-cutting watch list to reflect the MCP migration ratification.

## What was learned (changes to ground truth)

The doc set was drifting on atom contract layer placement and the drift was not catchable from any single document. ADR-008 body at line 80 still said "Empressa brand covers product surfaces and the atom contract" while CLAUDE.md identity section assigned the atom contract to Hauska Inc.'s commercial substrate. Both claims were authored at different times by the same operator; neither got caught because both were locally consistent with adjacent text. The two-recon view forced the cross-doc read that surfaced the conflict. Going forward, treat the four-structural-commitments substrate-layer claim (atom contract = Hauska) as canon; ADR-008 body and the ADR-001 v1.3 ownership-correction note are now reconciled to match.

The Hauska SDK is more concrete and more mature than the canonical doc set acknowledges. Twelve published-ready packages including a full payment substrate (x402, USDC on Base+ETH+Polygon, Circle) with 56 tests green. The 2026-05-16 strategic brainstorm session and 14_pricing_framework.md treat the SDK payment substrate as a principle committed, implementation phased starting with Phase 1 metadata, Phase 2 metering, Phase 3 settlement. Reality is Phase 1 and Phase 2 substantially built, only the Circle checkout URL generation is a real TODO. This is doc drift on the order of months. 14_pricing_framework.md is queued for reconciliation per the ADR-018 follow-on list.

The MCP server does not exist anywhere in the portfolio as production code. The conversation's earlier belief that the current MCP server lived in the legacy-design-tools repo was wrong. The only MCP-server-shaped artifact anywhere is the starter implementation in `doc_repo/MCP Server/`, currently gitignored. That clarification matters because it strengthens the case for Decision 2 (dedicated repo migration now): the migration carries no production code; it is a four-file move from gitignored to a proper repo home; pure infrastructure setup, not refactor.

The atom contract is mature. Fully type-enforced (`register()` rejects widened entity types, forces `defaultMode` membership in `supportedModes`, forces ContextSummary completeness). Five rendering modes defined as a literal union. 19 of 24 expected atoms registered. Zero `@hauska-sdk/*` dependency. The contract is ready for extraction at M2-C; the only thing changing as a result of today's session is the target package name.

The Hauska SDK and legacy-design-tools repos have opposite activity profiles. SDK is parked at six weeks no activity (last commit 2026-04-05). legacy-design-tools is the engine room at 572 commits in 120 days. Worth noting for sequencing: when M2-C extraction lands, the contract package extraction work is in legacy-design-tools (active repo, cheap to coordinate); the MCP server starter migration is to an entirely new repo (no existing activity, cheap to set up); the SDK consumes the contract via published npm dependency only once both other moves complete (parked repo wakes up minimally, only to pick up the renamed dependency).

Four atoms (sheet, decision-event, submission, submission-classification) do not implement all five rendering modes per the recon. This is a contract-completeness gap that will block their `.atom` export per ADR-012 when renderers ship. Not urgent (no renderer ships yet); listed in the ADR-018 follow-on list.

The ATOM_CONTEXT_V2 doc claim is stale. The 2026-04-18 archived strategic record claims the flag gates four-layer behavior in production. The flag is not referenced anywhere in legacy-design-tools code; the four-layer behavior is on unconditionally. Doc claim is stale, not a missing feature. Probably leave the archived doc alone per "retire via status flip, never delete" but flag in case future agents read the archived record as current.

## What's still open

ECI internal registry naming. Canon today is `@empressaio/atom-internal` per CLAUDE.md line 91 and [`60_eci_atomization.md`](../60_eci_atomization.md). ECI atoms are Empressa-internal product memory; the Empressa namespace is structurally correct. ADR-018 explicitly defers the exact name to the ECI atomization sprint kickoff.

Public jurisdiction atom-collection packages naming (e.g., `@hauska/atoms-bastrop`, `@hauska/atoms-grand-county`). Deferred. The decision today fixes the contract package name; collections are downstream and out of scope for this session.

Doc-set sweep across 25, 26, 27, 11, 14, 51, ADR-001 per the ADR-018 Known follow-on doc updates checklist. Substantial work; treat as own session. 14_pricing_framework.md SDK-payment-substrate reality check is the most load-bearing of the queued items because it represents months of doc drift behind code reality.

Contract-completeness gap on 4 atoms (sheet, decision-event, submission, submission-classification) missing `focus` rendering mode. Will block their `.atom` export per ADR-012 when renderers ship. Listed as a follow-on; needs author with legacy-design-tools repo access to extend each atom's `supportedModes` array.

MCP server repo creation. Awaits Nick action to run `gh repo create empressaioemail-tech/hauska-mcp-server --private` (or web UI equivalent). Once the repo exists, agent can complete the file-move: delete the four starter files plus package.json in `doc_repo/MCP Server/`, update the scaffold-location pointer in [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) "Cross-references" section, surface the new repo URL in [`00_current_state.md`](../00_current_state.md) Cross-cutting watch list.

Hand-off snippet for the legacy-design-tools repo. After today's commit lands, paste the following into the Cursor terminal at `P:\legacy-design-tools`:

> Open `lib/empressa-atom/README.md`. Locate the line declaring the package as "the in-repo staging ground for `@empressaio/atom` v1.0.0, the SDK extraction planned for milestone M2-C." Replace with: "This package is the in-repo staging ground for `@hauska/atom-contract` v1.0.0, the substrate extraction planned for milestone M2-C. (Renamed from `@empressaio/atom` on 2026-05-18 per doc_repo ADR-018; atom contract is Hauska commercial substrate, not Empressa product, per the four structural commitments and the corp-split work landed 2026-05-16.)" Commit on a feature branch (not main per the repo's branch policy), open a PR titled "docs(empressa-atom): rename M2-C extraction target to @hauska/atom-contract per doc_repo ADR-018", reference the ADR file path in the PR body. No code changes; one line in one README only.

## Suggested canonical doc updates

For mechanical execution in future sessions:

1. [`25_atom_architecture_reference.md`](../25_atom_architecture_reference.md) — body sweep plus title update. Doc title is "@empressaio/atom — Architecture reference"; needs to become "@hauska/atom-contract — Architecture reference". 11 in-body references. Bump last_updated.
2. [`26_atom_upgrade_guide.md`](../26_atom_upgrade_guide.md) — body sweep plus title update. Doc title is "@empressaio/atom — Upgrade & Consumption Guide"; needs to become "@hauska/atom-contract — Upgrade & Consumption Guide". 15 in-body references. Bump last_updated.
3. [`27_engine_evolution_plan.md`](../27_engine_evolution_plan.md) line 226 — single `@empressaio/atom` consumer-coordination reference. Bump last_updated.
4. [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) lines 90 and 133 — minor-version-bump coordination references. Bump last_updated.
5. [`80_adrs/adr_001_atom_architecture.md`](../80_adrs/adr_001_atom_architecture.md) — 5 references to `@empressaio/atom` plus the v1.3 ownership-correction note that ADR-018 supersedes. Add revision-history entry pointing at ADR-018. Bump last_updated.
6. [`11_roadmap.md`](../11_roadmap.md) line 275 — `@empressaio/atom` commercial-posture revisit trigger reference. Update to `@hauska/atom-contract`. Bump last_updated.
7. [`14_pricing_framework.md`](../14_pricing_framework.md) — separate finding from this session's SDK recon: SDK payment substrate described as phased; code reality is Phase 1 and Phase 2 substantially built (x402 + USDC on Base+ETH+Polygon + Circle, 56 tests green, only Circle checkout URL is a real TODO). Reconcile doc with code state, update phasing language, surface what's actually built. Bump last_updated.
8. ECI internal registry naming revisit at the ECI atomization sprint kickoff (per ADR-018 Open decisions deferred section).
9. Contract-completeness gap on 4 atoms (sheet, decision-event, submission, submission-classification) missing `focus` rendering mode (per recon section 4). Will block their `.atom` export per ADR-012 when renderers ship.

## References

- [`80_adrs/adr_018_atom_contract_substrate_layer.md`](../80_adrs/adr_018_atom_contract_substrate_layer.md) — new ADR formalizing the substrate-layer split and namespace choice.
- [`80_adrs/adr_008_engine_factor_out.md`](../80_adrs/adr_008_engine_factor_out.md) — revised in this session.
- [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) — repo-placement section added in this session.
- [`_decisions/2026-05-18_atom_contract_hauska_namespace.md`](../_decisions/2026-05-18_atom_contract_hauska_namespace.md) — companion decision record.
- [`_decisions/2026-05-18_hauska_mcp_server_dedicated_repo.md`](../_decisions/2026-05-18_hauska_mcp_server_dedicated_repo.md) — paired decision record.
- `RECON_2026-05-18.md` (in `p:\Hauska SDK`) — Hauska SDK recon report.
- `RECON_2026-05-18_codex.md` (in `P:\legacy-design-tools`) — Codex / design-tools recon report.
