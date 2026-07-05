---
id: 52_mcp_offer_and_buildout
title: MCP offer and build-out roadmap (current surface, Tier 1/2 build-out, SDK completion)
status: active
last_updated: 2026-07-05
applies_to: hauska
related: [50_hauska_mcp_server, 51_substrate_v1_sprint, 16_commercialization_roadmap, 14_pricing_framework, 72_hauska_inc_operations, 09_post_saas_substrate_thesis, 08_tiered_access_model, 28_mcp_first_product_design, _research/2026-06-06_cross_repo_recon, _decisions/2026-06-06_v1_tier_pricing_decision_b, _catalog/ops/gtm_launch_channel_plan_v1.yaml]
---

# MCP offer and build-out roadmap

> **Architecture-homes reframe (2026-06-21).** The gate surface here predates the Track C rework. The gate is now four products (public, codex, reporting, map), 62 tools, with atom_trace, atom_export, and read_atom_calibration added and 1.6.1 read-contract conformance (PR #35 merged 2026-07-05, so the four-gate 62-tool model is now live) ([`50_hauska_mcp_server.md`](50_hauska_mcp_server.md), [`_architecture_homes/03_mcp_gate_and_agent_surface.md`](_architecture_homes/03_mcp_gate_and_agent_surface.md)). Agent-operator onboarding/key-issuance and metering-to-payment (on the Circle rail, not Stripe) are designed in `_architecture_homes/03` for phase-3 build. "Cortex" means the reporting function package. Read the offer below through that lens; full rewrite owed in the doc scrub.

> **Purpose.** Capture what the Hauska MCP surface actually offers today, the engines that are built but not yet exposed, the functionality build-out that turns shipped work into sellable Layer 2 surface, and the Hauska SDK completion plan that makes paid revenue possible. Written 2026-06-06 because a wave of cortex-api and engine work has shipped that the commercial surface does not yet express. The recommended sequence at the end is the agreed order: build and test before public launch. Decision C (GTM channels) is ratify-ready but pinned until this build-out lands (`_catalog/ops/gtm_launch_channel_plan_v1.yaml`).
>
> **Sourcing.** The current tool inventory is read directly from the `hauska-mcp-server` tool registry (grep of `src/`, 2026-06-06), not from the doc set. Corpus and SDK ground truth from [`_research/2026-06-06_cross_repo_recon.md`](_research/2026-06-06_cross_repo_recon.md). Pricing from [`_decisions/2026-06-06_v1_tier_pricing_decision_b.md`](_decisions/2026-06-06_v1_tier_pricing_decision_b.md).

## 1. What the offer is today

The shipped surface is now 62 tools across four gated products (public, codex, reporting, map) after the Track C gate rework merged (PR #35, 2026-07-05); the diagram and enumerations immediately below reflect the earlier 2026-06-06 registry snapshot of the three-product 46-tool surface and have not been re-enumerated tool-by-tool. Tools are gated at call time by `X-Hauska-Key` (no header resolves to the public tier; a malformed or unknown key returns 401). Deployed on Cloud Run in `hauska-prod`; the `mcp.hauska.dev` domain mapping is still pending.

```
                    AGENT / MCP CLIENT  (Cursor, Claude, SDK agents)
                               |   X-Hauska-Key   (no key -> public tier; bad key -> 401)
                               v
   +---------------------------------------------------------------+
   |  hauska-mcp-server  ·  GATING BOUNDARY  ·  Cloud Run · 62 tools (four gates) |
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
| Site-context adapters (FEMA, USGS DEM, EPA, Cotality parcel; Regrid purged 2026-06-17) | only inside the brief path | `get_flood_zone`, `get_parcel`, `get_elevation`, `get_site_context` |
| Site topography (2D.1 merged): DEM, contours | atom only | `get_site_topography` |
| Cotality 8-adapter pack (merged, creds-pending): property, parcel polygon, climate, hazard/flood-depth, replacement cost, O&G mineral, utility | inert | a Layer 2 data tier: `get_property_detail`, `get_replacement_cost`, `get_hazard_profile`, `get_parcel_polygon` |
| Encumbrances (ADR-020/021 atoms) | atoms exist | `search_encumbrances`, `get_restrictions` |
| Code intelligence depth (engine: cross-reference, definition, amendment, edition atoms) | only `get_atom` / `search_atoms` | `get_code_definition`, `traverse_cross_references`, `get_code_amendments`, `compare_code_editions` |

## 3. Build-out, in two tiers

**Tier 1, lift the built engines into gated tools.** Mostly wrapping existing engine functionality in MCP tool definitions with the right product and tier gate, not net-new engineering. It converts shipped work into sellable Layer 2 surface. The keystone is `generate_property_brief`: it makes the wedge itself an agent-callable product rather than only a Chrome extension. The Cotality tier unlocks the moment the credential blocker clears (CoreLogic-side activation, see recon).

**Tier 2, net-new substrate functionality.** Skill and behavior atoms (ADR-014, queued) and fuller execution atoms (ADR-013) move the surface from data and documents to actions. Stream subscriptions deliver the Pro-tier ($199) stream-to-a-jurisdiction promise from Decision B, which currently has no delivery mechanism. Cross-jurisdiction reasoning (compare codes and requirements across cities) is a capability only the substrate can offer. Per-call metering and billing wired through the gate ties directly to the SDK in section 4.

## 3a. Tier 1 tool specs (verified against the live engine surface, 2026-06-06)

Specced after a direct read of the engine surfaces, not from the §2 gap table, because the doc set lags the code. Two findings reshaped the build-out and are load-bearing for the dispatches:

First, the site-context adapter set is already exposed at place granularity. The shipped public tools `get_place_layers` and `get_place_dossier` already run `fetchBrokerageSiteContext` over the FEMA, USGS, EPA, and Cotality parcel set (verified `legacy-design-tools/artifacts/api-server/src/routes/brokeragePlace.ts:105-230` at the 2026-06-06 read; Regrid was purged 2026-06-17 and Cotality is the sole parcel spine). The §2 gap row proposing net-new `get_flood_zone`, `get_parcel`, `get_elevation`, and `get_site_context` is therefore narrower than written: those layers are already Layer 1 public surface. Building single-purpose duplicates would add a bare-data Layer 2 SKU that the sell-reasoning commitment does not want and that the existing place tools already serve. They are de-scoped (see the de-scoped row below).

Second, the brief endpoint exists but is not wrapped. `POST /api/brokerage/v1/brief` is live (`brokerageBrief.ts:323`, mounted at `/api/brokerage/v1` via `brokerageBrief.ts:903`) and already produces `reasoningSummary`, `laySummary`, and a cited-atom projection persisted to `brokerage_brief_runs`. But the MCP server's `legacy-client.ts` has `resolvePlace`, place, and workspace methods and no brief method (verified). So the brief wrap is a real Tier 1 item, and it carries a cross-repo seam: the endpoint sits behind `brokerageAuth` plus a wallet paywall (402 at `brokerageBrief.ts:370`), so the MCP gate must call it on a service path, not the extension-public install-id path. That seam is the cortex-api dispatch (cc-agent-C).

Tier placement follows the product-gated tier model in `29_mcp_surface_tier_model.md`: the anonymous and public-product tier stays Layer 1; reasoning and product tools sit behind a `cortex` or `codex` product key at Layer 2. Code intelligence over public-free corpora stays Layer 1 because code is public substrate. No bare Layer 2 data tool is added. This reconciles the stale "Layer 1 only" line in `50_hauska_mcp_server.md` (see that doc's current-offer reconciliation note).

| Tool | Wraps (verified) | Product / Tier | Atom shape returned | Owner | Gate / status |
|---|---|---|---|---|---|
| `generate_property_brief` (keystone) | cortex-api `POST /api/brokerage/v1/brief` | cortex / Layer 2 metered | `brief-run` atom (`did:hauska:brief-run:<runId>`) plus the cited code-section and site-context atom projection; `reasoningSummary`, `laySummary`, `siteContext`, `workspaceDid` | cc-agent-M (tool + `legacyClient.generateBrief`); cc-agent-C (service-auth + metering hook) | `requireProduct(...,"cortex")`; charge activates when SDK metering lands |
| `get_property_brief_run` | cortex-api `GET /api/brokerage/v1/brief/{runId}` (`brokerageBrief.ts:687`) | cortex / Layer 2 | `brief-run` atom by id | cc-agent-M | read companion to the keystone |
| `simulate_site_drainage`, `get_site_drainage` | cortex-api `POST/GET /api/engagements/:id/site-drainage(+/design-storms)` (`siteDrainage.ts`) | cortex / Layer 2 | `site-drainage` atom (tenant-private) | cc-agent-M (tools); cc-agent-C (place-scoped entry, fast-follow) | engagement-scoped today; needs an engagement_id. PR #142 (hydrology) merged; full fidelity needs the pysheds sidecar in the Cloud Run image, TS D8 fallback works without |
| `get_site_topography` | cortex-api `POST/GET /api/engagements/:id/site-topography` (`siteTopography.ts`) | cortex / Layer 2 | `site-topography` atom | cc-agent-M; cc-agent-C (place-scoped entry, fast-follow) | engagement-scoped today, same caveat |
| `search_encumbrances`, `get_restrictions` | cortex-api `brokerageEncumbrances` router under `/api/brokerage/v1/workspaces` (`brokerageEncumbrances.ts:29,83`) | cortex / Layer 2 | `recorded-instrument`, `restriction-clause`, `restriction-corpus` (ADR-020/021) | cc-agent-M (tools + `legacyClient` methods) | workspace-scoped |
| Cotality data tier: `get_property_detail`, `get_replacement_cost`, `get_hazard_profile`, `get_parcel_polygon` | Cotality 8-adapter pack (dist-verified: parcels, zoning, property, climate, hazards, replacementCost, mineral, utility) | cortex / Layer 2 metered | adapter layer atoms; data-cost pass-through affects the Layer 2 floor per Decision B reversal criteria | cc-agent-M (tools); cc-agent-C (adapter exposure) | DESIGNED, INERT: blocked on CoreLogic OAuth activation (`Invalid client identifier`, operator-mechanical fix per `00_current_state.md`). Build the definitions, keep them returning credential-pending until creds clear |
| De-scoped (already Layer 1): `get_flood_zone`, `get_parcel`, `get_elevation`, `get_site_context`, `get_flood_risk` teaser | already served by the shipped public `get_place_layers` / `get_place_dossier` | n/a | n/a | n/a | do not build; redundant with the existing public place tools |
| Tier 1.b (engine, deferred): `get_code_definition`, `traverse_cross_references`, `get_code_amendments`, `compare_code_editions` | atoms exist in the corpus (3,257 cross-reference, 36 code-edition); engine retrieval client today exposes only `searchAtoms`/`getAtom`/`listJurisdictions`/`queryJurisdiction`/`searchPermitAtoms` | public / Layer 1 | `code-cross-reference`, `code-definition`, `code-edition` atoms | cc-agent-E (engine retrieval-API endpoints + client methods) | partly served today via `get_atom` + `search_atoms` with `entity_type`; lower priority than the wedge, sequenced as a separate engine dispatch after the cortex wraps |

The two priority dispatches cover the cortex-api wraps (cc-agent-M) and the cortex-api service seam (cc-agent-C). The Cotality tier rides the same cc-agent-M dispatch but ships dark until the credential clears. The Tier 1.b engine code-intelligence tools are noted here as a deferred follow-on engine dispatch, not in the priority wave, because the wedge is the brief.

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
2. **Tier 1 MCP build-out.** Wrap the property/parcel and hydrology engines as Layer 2 tools, starting with `generate_property_brief`. Specs in §3a; dispatches filed for cc-agent-M (tool wraps) and cc-agent-C (cortex-api service seam).
3. **Finish the SDK commerce rail.** Circle rail, revenue routing, metering, tested. Plan in [`53_hauska_sdk_completion_sprint.md`](53_hauska_sdk_completion_sprint.md); dispatch filed for the hauska-sdk owner.
4. **Unpin Decision C and launch.** Onto a surface that works and can take money. Decision C is already drafted in `_catalog/ops/gtm_launch_channel_plan_v1.yaml`.

## 6. Open questions, resolved

The three §6 questions resolved in the 2026-06-06 build-out pass.

**Where the SDK completion plan lives.** Its own doc, [`53_hauska_sdk_completion_sprint.md`](53_hauska_sdk_completion_sprint.md), in the open slot adjacent to the 50/51/52 commercial-substrate band. A sequenced punch list with acceptance criteria is sprint material, not pricing-framework or corporate-ops material; `14_pricing_framework.md` already carries the substrate-state analysis (what exists) and `72_hauska_inc_operations.md` carries regulatory posture, so a third standalone sprint doc matches the 51 and 76b precedent rather than overloading either.

**Product-repo ownership for the Tier 1 tool wraps.** cc-agent-M owns the MCP tool definitions and `legacy-client.ts` methods in `hauska-mcp-server`. cc-agent-C owns the cortex-api side: the service-auth and metering hook that lets the MCP gate call the wallet-paywalled brief endpoint, and the place-scoped drainage/topography entry points as a fast-follow. cc-agent-E owns the deferred Tier 1.b engine code-intelligence endpoints. Dispatches filed for M, C, and the SDK owner; the engine code-intelligence dispatch is a later follow-on.

**Whether any Tier 1 tool should be public-tier versus Layer 2.** No new public teaser is needed. The `get_flood_risk` teaser and the site-context single tools are redundant with the already-public `get_place_layers` and `get_place_dossier`, which run the same adapter set at Layer 1 (verified, §3a). Code intelligence over public-free corpora stays Layer 1 because code is public substrate. The reasoning and product tools (`generate_property_brief`, drainage, topography, encumbrances, Cotality) are Layer 2 behind a cortex product key. This keeps the sell-reasoning line clean: no bare-data Layer 2 SKU.

## 7. Structural-commitment check

Pre-mortem run 2026-06-06 on the build-out (tool tier placement and metering touch the sell-reasoning tier model, load-bearing). Green across the four structural commitments and the three decision rules, with two items handled in the deliverable rather than flagged in passing: the redundant bare-data tools de-scoped (keeps commitment 1 clean), and the stale "Layer 1 only" line in `50_hauska_mcp_server.md` reconciled to the product-gated tier model (`29_mcp_surface_tier_model.md`). The moat holds: the anonymous and public tier stays Layer 1, Layer 2 reasoning sits behind product-key plus paid-tier gates, and the moat-bearing Layer 2 atoms (adjudication-records, per-reviewer-pattern, comparable-project-precedent) stay unexposed. Partnership-first is not touched: the brief's site-context set (FEMA, USGS, EPA, Regrid) and Cotality are national public-records aggregation, explicitly out of scope per the 2026-05-23 partnership-first scoping clarifier. Cost-per-jurisdiction is untouched: Tier 1 onboards zero jurisdictions.

## Revision history

- **2026-06-06 (build-out pass):** Fleshed §3a with verified Tier 1 tool specs (engine surfaces read directly; site-context found already exposed via the public place tools and de-scoped; brief endpoint found unwrapped with a wallet-paywall service seam). Resolved the three §6 open questions: SDK plan lives in new `53_hauska_sdk_completion_sprint.md`; ownership split across cc-agent-M / cc-agent-C / cc-agent-E; no new public teaser. Added §7 structural-commitment check (pre-mortem green). §5 sequence pointers updated to the new dispatches and 53.
- **2026-06-06 (origin):** Captured the current 46-tool MCP offer (verified from the live registry), the built-but-not-offered gap, the Tier 1/Tier 2 build-out, the SDK completion punch list, and the recommended build-before-launch sequence. Decision C pinned pending this work.
