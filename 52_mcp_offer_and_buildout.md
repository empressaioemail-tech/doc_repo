---
id: 52_mcp_offer_and_buildout
title: MCP offer and build-out roadmap (current surface, Tier 1/2 build-out, SDK completion)
status: active
last_updated: 2026-06-06
applies_to: hauska
related: [50_hauska_mcp_server, 51_substrate_v1_sprint, 16_commercialization_roadmap, 14_pricing_framework, 72_hauska_inc_operations, 09_post_saas_substrate_thesis, 08_tiered_access_model, 28_mcp_first_product_design, _research/2026-06-06_cross_repo_recon, _decisions/2026-06-06_v1_tier_pricing_decision_b, _catalog/ops/gtm_launch_channel_plan_v1.yaml]
---

# MCP offer and build-out roadmap

> **Purpose.** Capture what the Hauska MCP surface actually offers today, the engines that are built but not yet exposed, the functionality build-out that turns shipped work into sellable Layer 2 surface, and the Hauska SDK completion plan that makes paid revenue possible. Written 2026-06-06 because a wave of cortex-api and engine work has shipped that the commercial surface does not yet express. The recommended sequence at the end is the agreed order: build and test before public launch. Decision C (GTM channels) is ratify-ready but pinned until this build-out lands (`_catalog/ops/gtm_launch_channel_plan_v1.yaml`).
>
> **Sourcing.** The current tool inventory is read directly from the `hauska-mcp-server` tool registry (grep of `src/`, 2026-06-06), not from the doc set. Corpus and SDK ground truth from [`_research/2026-06-06_cross_repo_recon.md`](_research/2026-06-06_cross_repo_recon.md). Pricing from [`_decisions/2026-06-06_v1_tier_pricing_decision_b.md`](_decisions/2026-06-06_v1_tier_pricing_decision_b.md).

## 1. What the offer is today

46 tools across three gated products, gated at call time by `X-Hauska-Key` (no header resolves to the public tier; a malformed or unknown key returns 401). Deployed on Cloud Run in `hauska-prod`; the `mcp.hauska.dev` domain mapping is still pending.

```
                    AGENT / MCP CLIENT  (Cursor, Claude, SDK agents)
                               |   X-Hauska-Key   (no key -> public tier; bad key -> 401)
                               v
   +---------------------------------------------------------------+
   |  hauska-mcp-server  ·  GATING BOUNDARY  ·  Cloud Run · 46 tools |
   +---------------------------------------------------------------+
        |                       |                          |
   PUBLIC (~11)            CODEX (4)                  CORTEX (31)
   catalog + place         plan review                design accelerator
        |                       |                          |
        v                       v                          v
   hauska-engine           cortex-api                 cortex-api
   retrieval API           finding engine             briefing + product engines
   (read-only, 34 juris)
```

**Public (catalog + place), enumerated from the registry:** `get_atom`, `search_atoms`, `search_permit_atoms`, `list_jurisdictions`, `resolve_place`, `get_place_dossier`, `get_place_layers`, `get_property_workspace`, `list_property_workspaces`, `list_workspace_share_edges`. (Ten enumerated; the recon counts eleven public.)

**Codex (4):** `codex_briefing_fetch`, `codex_finding_generation`, `codex_override_write`, `codex_snapshot_ingest`.

**Cortex (31):** deliverable letters (10: create, fetch, list, render, render_download, renders_list, send, update_section, attach_provenance, completeness_check), detail-callout spec (5), product-spec reference (4), response task (4), attached document (2), sheet content extraction (2), plus `cortex_bim_model_query`, `cortex_ifc_ingest`, `cortex_briefing_emit`, `cortex_snapshot_register`.

**The honest read.** The public tier is a real catalog-and-place surface. Codex is a thin four-tool plan-review hook. Cortex is deep but inward-facing: it is mostly document production and project-management plumbing, which is what a design-tools client needs but not what an outside agent operator buys. The functionality that is actually valuable to an external agent (flood, parcel, and property reasoning) is barely exposed.

## 2. The gap: built but not offered

These engines run in cortex-api or the engine today and have zero MCP surface. This is the wave of shipped work the commercial surface does not yet express.

| Built feature (where) | Today | Build-out target |
|---|---|---|
| Property Brief pipeline (cortex-api `/brokerage/v1/brief`): geocode, corpus retrieve, site-context, reasoning + lay summary | UI / extension only | `generate_property_brief` (Layer 2 reasoning tool, the wedge made agent-callable) |
| Hydrology / drainage (PR #142, merged 2026-06-06): D8 drainage, NOAA rainfall sim, four-inches-of-rain | inside cortex-api | `get_flood_risk` (public teaser) + `simulate_site_drainage` (Layer 2) |
| Site-context adapters (FEMA, USGS DEM, EPA, Regrid) | only inside the brief path | `get_flood_zone`, `get_parcel`, `get_elevation`, `get_site_context` |
| Site topography (2D.1 merged): DEM, contours | atom only | `get_site_topography` |
| Cotality 8-adapter pack (merged, creds-pending): property, parcel polygon, climate, hazard/flood-depth, replacement cost, O&G mineral, utility | inert | a Layer 2 data tier: `get_property_detail`, `get_replacement_cost`, `get_hazard_profile`, `get_parcel_polygon` |
| Encumbrances (ADR-020/021 atoms) | atoms exist | `search_encumbrances`, `get_restrictions` |
| Code intelligence depth (engine: cross-reference, definition, amendment, edition atoms) | only `get_atom` / `search_atoms` | `get_code_definition`, `traverse_cross_references`, `get_code_amendments`, `compare_code_editions` |

## 3. Build-out, in two tiers

**Tier 1, lift the built engines into gated tools.** The seven rows above. This is mostly wrapping existing engine functionality in MCP tool definitions with the right product/tier gate, not net-new engineering. It converts shipped work into sellable Layer 2 surface. The keystone is `generate_property_brief`: it makes the wedge itself an agent-callable product rather than only a Chrome extension. The Cotality tier unlocks the moment the credential blocker clears (CoreLogic-side activation, see recon).

**Tier 2, net-new substrate functionality.** Skill and behavior atoms (ADR-014, queued) and fuller execution atoms (ADR-013) move the surface from data and documents to actions. Stream subscriptions deliver the Pro-tier ($199) stream-to-a-jurisdiction promise from Decision B, which currently has no delivery mechanism. Cross-jurisdiction reasoning (compare codes and requirements across cities) is a capability only the substrate can offer. Per-call metering and billing wired through the gate ties directly to the SDK in section 4.

## 4. Hauska SDK completion plan

The SDK is the commerce backbone and it is unfinished. Recon ground truth: 12 packages at v0.1.0, dormant since 2026-04-05, built in a roughly two-day sprint. Punch list to finish, test, and polish:

1. **Circle fiat rail, replace the stub.** `generateFiatCheckoutUrl()` returns a placeholder `checkout.circle.com` URL with a TODO. There is no checkout creation, no webhook handling, no payment verification. This gates first paid revenue.
2. **Revenue routing and splitting, build it.** Source-actor revenue share has zero code today; collection is a single facilitator wallet. This is the substrate-enforced revenue-share promise to partner cities, currently contractual rather than enforced in code.
3. **Wire the SDK into the MCP gate.** Nothing consumes the SDK except a scaffold `command-center`. Layer 2 paid calls do not meter or charge yet; the SDK and the MCP server must connect so a paid call actually transacts.
4. **Test pass.** The crypto rail (USDC on-chain verification) is real but untested since April; the new fiat and routing code needs coverage before it touches money.
5. **Polish.** Reconcile the internal "CNS Protocol SDK" branding with Hauska naming; confirm and automate npm publish (`publish.yml` exists but publish state is unverified).

## 5. Recommended sequence

The agreed order, which respects build-and-test before public:

1. **Capture** (this doc). Make the shipped enhancements visible and give the fleet a target list.
2. **Tier 1 MCP build-out.** Wrap the property/parcel and hydrology engines as Layer 2 tools, starting with `generate_property_brief`.
3. **Finish the SDK commerce rail.** Circle rail, revenue routing, metering, tested.
4. **Unpin Decision C and launch.** Onto a surface that works and can take money. Decision C is already drafted in `_catalog/ops/gtm_launch_channel_plan_v1.yaml`.

## 6. Open questions for the operator

Where the SDK completion plan lives (its own doc, or folded into `14_pricing_framework.md` or `72_hauska_inc_operations.md`). Product-repo ownership for the Tier 1 tool wraps (cc-agent-M owns `hauska-mcp-server`; the engine wrappers may need cortex-api work, which is cc-agent-C territory). Whether any Tier 1 tool should be public-tier (a `get_flood_risk` teaser) versus Layer 2 from the start.

## Revision history

- **2026-06-06 (origin):** Captured the current 46-tool MCP offer (verified from the live registry), the built-but-not-offered gap, the Tier 1/Tier 2 build-out, the SDK completion punch list, and the recommended build-before-launch sequence. Decision C pinned pending this work.
