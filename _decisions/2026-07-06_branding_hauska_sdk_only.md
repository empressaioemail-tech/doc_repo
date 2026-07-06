---
decision_id: 2026-07-06_branding_hauska_sdk_only
date: 2026-07-06
owner: Nick
status: active
related_canonical: [_decisions/2026-07-04_branding_canon_hauska_substrate_only.md, 80_adrs/adr_008_engine_factor_out.md, 80_adrs/adr_018_atom_contract_substrate_layer.md, _catalog/repo_intents.md]
---

## Decision

The Hauska brand narrows to the SDK only (`@hauska-sdk/*`). Everything else in the portfolio carries Empressa branding with descriptive product names: Empressa Map, Empressa Land (working name), the Empressa command center, and Empressa branding on the engine, the MCP gate, the atom contract, and the public atom spec. Operator verbatim: "hauska is the sdk only - all else empressa branding + description i.e. empressa map, empressa land etc"; confirmed 2026-07-06 as "wider rename needed" when the planner flagged that this is narrower than the 2026-07-04 canon.

This AMENDS `_decisions/2026-07-04_branding_canon_hauska_substrate_only.md`, which held Hauska = the substrate set (SDK, engine, MCP server, atom contract). Only the SDK survives under the Hauska name.

## Entity note (brand is not entity)

Hauska Inc. remains the C-corp carrying the commercial substrate; entity separation is unchanged. What changes is product BRANDING: Hauska Inc.'s products ship under Empressa product names except the SDK. CLAUDE.md, the thesis docs, and ADR-008/018 brand language join the scrub tracker for reconciliation; the entity/ownership statements in those docs remain true.

## Staged execution (rename wave)

**R1 — brand-visible surfaces (in the three-lane program):** the atom spec content (PR #4) rebrands BEFORE merge and publishes as the Empressa atom spec; the component-package rename (@hauska/* to @empressaio/*, PR #226) proceeds as planned; `@hauska/atom-contract` renames to `@empressaio/atom-contract` at the 1.7.0 publish (consumers bump imports with the version bump they already need); UI strings, README/product descriptions, "Powered by Hauska Engine" brand string retires in favor of Empressa equivalents; "Hauska Verified" certification concept renames in the certification scaffold before promotion.

**R2 — infrastructure identifiers (deliberately lag):** GitHub repo names, Cloud Run service names (hauska-engine-api, hauska-mcp-server, hauska-retrieval-api), GCP secret names, and internal env vars are internal identifiers, not brand surfaces; renaming them is operational risk with no brand payoff. They rename opportunistically or not at all. Domains (hauska.dev / mcp.hauska.dev were pending registration; never launched) — the v1 public endpoint decision moves to an Empressa domain; routed to the operator as a pickup item.

## Reversal criteria

Revisit if the agent-market motion shows the machine-facing substrate needs a brand identity distinct from the human-facing Empressa products (the original rationale for the two-brand split), or if Hauska Inc. commercial/legal considerations require products sold by the entity to carry its mark.
