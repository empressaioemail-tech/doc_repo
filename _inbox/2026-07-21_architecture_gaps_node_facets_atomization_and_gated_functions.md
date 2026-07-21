---
id: 2026-07-21_architecture_gaps_node_facets_atomization_and_gated_functions
title: Architecture gaps — node facets are atom-shaped not atoms; paywall functions unbuilt
status: open
date: 2026-07-21
applies_to: legacy-design-tools (node-facet bake, place_layer_snapshots), hauska-map (property-explorer), atom-contract
related: [2026-07-20_provable_county_data_pipeline_design, 2026-07-20_map_first_program_launch, 01a_atom_conventions, 25_atom_architecture_reference]
owner: nick
---

# Two architecture gaps to reconcile (raised by operator at 2026-07-21 close)

Both surfaced by the operator's session-close questions. Neither is urgent-fix; both are correct "next-layer" work that would drift if only in chat. Recording so they are explicit.

## Gap 1 — node facets are atom-SHAPED, not atom-contract atoms

The map-first program built parcel-as-NODE with resolvable facets (base facts, land-use, zoning, setbacks, buildable envelope, flood) baked into `place_layer_snapshots` as a `Tier1FacetPayload` (`facetSchemaVersion: "node-facets-tier1-v1"`) + a parallel `node-facets:tier2` for flood. These payloads have atom-LIKE properties by design: provenance (source + vintage + which join key), a confidence signal (envelope confidence; the owner-match gate verdict; gate-passed), honest-absence, a monotonic high-water-mark, owner exclusion. That is why they feel atom-shaped.

BUT they are NOT `@hauska/atom-contract` atoms. The payload is a bespoke shape, not the atom envelope; it carries no `accessPolicy` (the tiered-access partition), no formal reasoning-chain/citation atom structure, and is not registered/served through the atom contract. So the parcel-node model is CONCEPTUALLY the atom model (a node whose facets carry provenance + confidence + honest-absence) implemented in PARALLEL, not literally on the substrate.

Implication for the thesis: "sell reasoning as atoms, tier access via accessPolicy" wants these facets to BECOME data atoms (or be projected through the atom contract) so they carry accessPolicy (public-free vs public-paid vs tenant-private) and the reasoning/citation envelope. Today the tiering is enforced ad-hoc at the read route (browse = anonymous public), not by an atom's accessPolicy.

The workstream: atomize the node facets — map each facet (zoning, setbacks, envelope, flood, land-use) onto the data-atom contract with accessPolicy + provenance + confidence + citation, served through the atom/MCP path, so the map's node facets ARE atoms the catalog/agents consume. Right shape, wrong substrate; converge them. NOT a mistake to unwind — a promotion of the parallel implementation onto the contract.

## Gap 2 — paywall-gated functions consume nothing yet (arrive with auth/tenant)

property-explorer consumes the spine correctly for what it does today: `@hauska/map-renderer` (Hauska substrate map), `@empressaio/cortex-tiles` (Empressa tiles), `@empressaio/cortex-client` (BFF client), cortex-api via the same-origin spine proxy — no direct-DB, no bypass. Good.

But everything it consumes is the ANONYMOUS/PUBLIC tier: the facet-read endpoint is mounted BEFORE auth, browse holds no key. The paywall-gated functions the operator flagged (save-my-properties, the AI/ask "Research this" path, premium/deeper facets) DO NOT EXIST on this surface yet. The app is SHAPED to add them (sign-up card + "Research this" are stubbed seams in place), but the gated-function consumption is net-new.

When the auth/tenant pass (sprint-54 leg, currently held) lands, the gated functions must consume the spine's ENTITLEMENT + TENANT components: user-aware entitlement resolution (currently install-keyed, must become user-aware), enforced tenant-isolated storage (currently anonymous-default-tenant), and — tying to Gap 1 — the atom accessPolicy so a paid/tenant-private facet is gated by the ATOM's policy at the catalog, not just by a route check. So Gaps 1 and 2 converge: accessPolicy on atomized facets is the clean mechanism for the paywall.

## Shared-substrate note (operator Q2)

property-explorer's map IS the same spine map substrate command-center uses (both consume `@hauska/map-renderer` workspace:*), so this session's substrate work (persistent-map rebind, crash guards, envelope dash passthrough) benefits both. But property-explorer and command-center are two DISTINCT product shells on that one substrate (consumer map-first vs operator/admin console) — not the same app; the map-first surface is NOT "showing inside command center." Correct per one-substrate-many-surfaces; stated precisely so it is not mistaken for a single unified app.
