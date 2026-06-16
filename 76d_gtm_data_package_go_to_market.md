---
id: 76d_gtm_data_package_go_to_market
title: GTM data-package go-to-market and capability honesty
status: active
last_updated: 2026-06-15
applies_to: hauska
owner: nick
related: [08_tiered_access_model, 14_pricing_framework, 16_commercialization_roadmap, 52_mcp_offer_and_buildout, 55_spine_data_intelligence_stack, 58_gtm_readiness_sprint, 59_spine_moat_and_high_value_features, 61_property_intelligence_master_plan, 76b_gtm_engine_polish_sprint, 07a_smartcity_product_positioning, _catalog/ops/gtm_launch_channel_plan_v1.yaml, _catalog/ops/gtm_public_capability_matrix_v1.yaml, _decisions/2026-06-07_full_engine_extraction_and_data_packages, _prospects/vertosoft/2026-06-07_vertosoft_channel_and_offer]
---

# GTM data-package go-to-market and capability honesty

> **2026-06-15 refresh (the world moved on; read this first).** This doc was authored on the 2026-06-07 snapshot and is now refreshed against current reality. Since then: the engine extraction is DONE (all four reasoning engines live on the spine `engine-api`, [`56`](56_engine_extraction_sprint.md)/[`61`](61_property_intelligence_master_plan.md)); Cotality is SOLVED end-to-end (#181 merged, #182 open, all three products minting HTTP 200 live); the gate now registers 57 tools, not 46; Regrid is DROPPED (Cotality is the sole parcel/property spine); the precedence primitive is now wired into the production finding path (no longer test-fixture-only); and a single convergent cortex-api deploy (#178 bake, #179 thin BFF, #180 auth/leak fix, #181+#182 Cotality) gates prod. **The launch execution sequence and the launch gate now live in [`58_gtm_readiness_sprint.md`](58_gtm_readiness_sprint.md)** (the architect-community launch: engine lift app-by-app QA + Texas/Austin-2024 code library + per-user auth). This doc is the complementary layer: the data-package positioning, per-package buyer/channel/messaging, capability-matrix honesty, and the gtm_loop spec. It does NOT maintain a competing launch gate; §4 defers to 58.
>
> **Purpose.** Translate the composable data-package tier model ([`08_tiered_access_model.md`](08_tiered_access_model.md)) into a buildable agent-operator go-to-market, and hold the capability/honesty line the launch collateral must not exceed. Decision C (channel plan) is ratify-ready in [`_catalog/ops/gtm_launch_channel_plan_v1.yaml`](_catalog/ops/gtm_launch_channel_plan_v1.yaml); the firing gate is 58's launch gate, not a separate list here.
>
> **Scope.** The Hauska substrate / agent-operator GTM (Decision B economics, agent-builder ICP, the 57-tool MCP surface). The separate Layer-3 government / SmartCity motion through Forrest and Vertosoft is its own track ([`07a_smartcity_product_positioning.md`](07a_smartcity_product_positioning.md), [`_prospects/vertosoft/2026-06-07_vertosoft_channel_and_offer.md`](_prospects/vertosoft/2026-06-07_vertosoft_channel_and_offer.md)); this doc cross-references it and does not duplicate it.
>
> **Honesty discipline (load-bearing, enforced throughout).** Any external corpus or coverage number carries the public-vs-internal split. The verified public-free Layer 1 catalog is ~478 atoms across 2 jurisdictions (Bastrop 193 on the B3 edition, Grand County/Moab 285) plus the `federal-accessibility-standards` tenant (ADA 2010 + FHA Design Manual, public-free). The other 32 of 34 originally-ingested jurisdictions are `platform-internal` and are never marketed as public. The Texas library has since deepened (Austin 2024 web-warmed, web-verified rate uplifted per [`58`](58_gtm_readiness_sprint.md) B-rewarm), but the public-vs-internal split for the new web-warmed atoms must be re-verified before any of it is marketed as public-free; do not assert a refreshed headline count without that check. Confidence: the calibration engine computes `effectiveConfidence` but the live read path does not yet consult it (2026-06-11 robustness audit: confidence is asserted-not-earned, briefing/code-atom hardcode 1.0). The uniform provenance envelope riding 58's app-by-app cut is the fix. Do not claim calibration in any messaging.

## 1. Frame

The composable data-package model reshaped the entitlement unit from persona to package crossed with access layer (Decision B reshape, [`08`](08_tiered_access_model.md) and [`_decisions/2026-06-07_full_engine_extraction_and_data_packages.md`](_decisions/2026-06-07_full_engine_extraction_and_data_packages.md)). Buyers overlap (a landman is also a broker; a city operator is also a reviewer), so GTM cannot target a persona and call it a segment. It targets a package, names the overlapping buyers who compose it, and routes each to the agent-builder channels Decision C already ratified.

The binding constraint is structural commitment 1. Each package's Layer 2 sells reasoning over the domain, cited, with a confidence score and timestamp. The raw national and federal data underneath stays Layer 1 free. A package is never a raw-data resale SKU. The whole of this doc holds that line.

## 2. Data-package go-to-market

Five packages, each translated to: the verified spine state today, the overlapping buyers, the channel, and the reasoning-first message. The "what stays free / what we do not sell" line on each package is the sell-reasoning guardrail made concrete.

### Subsurface

Spine state (2026-06-15): SSURGO soils + USGS geology/groundwater/seismic adapters landed (PR #145) and now ride the lifted `engine-api` adapter pack. Cotality mineral and utility (SpatialRecord) are SOLVED end-to-end (OAuth fixed; #181 merged, #182 open with adapter tests green; all three Cotality products mint HTTP 200 live), deploy-pending on the convergent cortex-api deploy. Edwards Aquifer (TCEQ) gated. So the free federal baseline is real, the Cotality layer is no longer blocked, and the paid reasoning is the gap-closer.

Overlapping buyers: geotechnical, civil, landman, oil-and-gas diligence agents.

Channel: Anthropic MCP directory + awesome-mcp-servers (discovery), Show HN for the subsurface-reasoning angle once a callable tool exists.

Message: "Soils, geology, seismic and groundwater context for any US site, reasoned and cited." Sell the reasoning verb: assess bearing, shrink-swell, hydric, liquefaction and karst risk for a parcel, with the source layer cited. What stays free / not sold: raw SSURGO map units and USGS geology rasters are Layer 1 federal public-records baseline, not a resale SKU; the paid surface is the site-level subsurface assessment over them.

### Hydrology / flood

Spine state (2026-06-15): now LIVE on the spine `engine-api` with REAL pysheds (the engine cut moved hydrology to `engine-api`, where pysheds is pip-installed in the image; the broken native-D8 fallback the cortex image silently used is gone on the spine path). NOAA Atlas 14 design storms + FEMA NFHL live. Cotality flood-depth forcing can now activate (Cotality solved), deploy-pending on the convergent cortex-api deploy. The four-inches-of-rain demo is the proof artifact (drainage ~100s latency is the lone logged outlier).

Overlapping buyers: civil engineers, insurers, developers, diligence agents.

Channel: Show HN (the four-inches-of-rain demo travels well), Anthropic MCP directory, hauska.dev blog.

Message: "What happens to this site when it rains, reasoned from the terrain." Sell the reasoning: simulate site drainage and flood exposure from the DEM and design-storm forcing, cited to NOAA and FEMA. What stays free / not sold: FEMA flood-zone lookup and NOAA design-storm tables are Layer 1; the paid surface is the drainage simulation and the cited flood-risk reasoning, not the raw federal layers.

### Parcel / property

Spine state (2026-06-15): Regrid is DROPPED; Cotality is the sole parcel/property spine (plus minerals/O&G, flood-depth forcing, insurability per [`61`](61_property_intelligence_master_plan.md)) and is now SOLVED end-to-end (deploy-pending on the convergent cortex-api deploy). Encumbrance atoms (ADR-020/021: recorded-instrument, restriction-clause, restriction-corpus) exist; the Property Brief pipeline produces reasoningSummary + laySummary + cited atoms, and `generate_property_brief` is now among the 57 gated tools. This is the wedge.

Overlapping buyers: brokers, landmen, appraisers, real-estate diligence agents.

Channel: Property Brief extension upsell ("build on this data, Hauska MCP"), Anthropic MCP directory, Cursor/coding-agent communities (real-estate diligence agents).

Message: "Everything that bears on a parcel, reasoned into a brief." Sell the reasoning: the property brief and encumbrance/restriction reasoning, cited. What stays free / not sold: Cotality parcel geometry and public-records baseline are not resold as a tile SKU, and Cotality is a metered third-party cost priced at floor as pass-through (the binding COGS constraint); the paid surface is the brief reasoning and the restriction analysis. Note the partnership-first scope clarifier: Cotality is national public-records aggregation, out of the refusal scope; no city operational data is in this package.

### Code / plan-review

Spine state (2026-06-15): the richest package. Municipal/zoning corpus across the Texas set plus the deepened Austin 2024 library (the launch hero metro per [`58`](58_gtm_readiness_sprint.md)); accessibility standards ADA 2010 (901 sections) + FHA Design Manual (212 sections) public-free under the `federal-accessibility-standards` tenant; A117.1 + IRC/I-Codes credential-pending (ICC OAuth). The `reconcileStandardPrecedence` primitive is now WIRED INTO THE PRODUCTION finding path (S1 soft-gate folded into the Cortex cut), no longer test-fixture-only; plan-set decomposition is live. Grounding is web-first: Layer 1 is the reasoning layer + working deeplinks, not a re-hosted I-Code base; the web-warmed Austin atoms verify section-level after the B-driver fix (verified rate uplifted, ICC-gated codes excepted).

Overlapping buyers: architects, plan reviewers, AHJs, AEC compliance agents.

Channel: Anthropic MCP directory + awesome-mcp-servers (the accessibility-standards corpus is a clean public-free hook), the EntreArchitect community (the multi-standard reconciliation ask originated there), hauska.dev blog.

Message: "Free ADA and FHA atoms; paid is the reconciliation that tells you which standard governs at this door." Sell the reasoning: most-stringent-governs precedence resolution across accessibility standards and the adopted model code + local amendments, cited. Honesty scope (from 58/59): the wired claim is federal accessibility + adopted model code + local amendments on the same dimension; zoning/CC&R cross-layer reconciliation is unbuilt and must NOT be marketed. What stays free / not sold: ADA 2010, FHA Design Manual, and public-free city code are Layer 1; the paid surface is the precedence reasoning and the per-discipline plan-set findings. Calibration honesty applies hard here: confidence is a raw LLM emission, not a calibrated probability; message it as a cited confidence score, calibration in progress.

### Environmental

Spine state: thinnest package. EPA EJScreen live (CalEPA mirror, frozen, so freshness honesty applies); FCC broadband gated off (WAF-blocked); no wetlands / species / air adapters built. Effectively an EJ-context teaser today, not a full package.

Overlapping buyers: planners, ESG / environmental-diligence agents.

Channel: hold from headline launch; list as roadmap on the capability matrix. Do not feature in registry copy until it has more than a frozen EJScreen mirror.

Message (when built): "Environmental-justice and habitat context, reasoned and cited." For now the honest claim is EJ context only, sourced and timestamped, with the frozen-mirror freshness caveat surfaced. What stays free / not sold: EPA EJScreen is Layer 1 federal data; nothing here is a paid SKU yet.

### Package summary

| Package | Sellable today (2026-06-15) | After the convergent deploy | Lead channel | Reasoning verb |
|---|---|---|---|---|
| Subsurface | adapters on engine-api; Cotality mineral/utility solved, deploy-pending | Cotality layer live in prod | MCP directory + awesome-mcp | assess subsurface risk |
| Hydrology / flood | live on engine-api with real pysheds | + Cotality flood-depth forcing | Show HN + blog | simulate drainage / flood |
| Parcel / property | brief pipeline live; `generate_property_brief` gated; Cotality sole spine, solved | Cotality live (Regrid dropped) | extension upsell + directory | reason a parcel brief |
| Code / plan-review | richest; precedence WIRED in prod + ADA/FHA public-free + Austin 2024 | + A117.1 / I-Codes on ICC creds | directory + EntreArchitect | reconcile precedence |
| Environmental | EJ teaser only | roadmap | hold | (deferred) |

## 3. Capability-matrix refresh

The public capability matrix ([`_catalog/ops/gtm_public_capability_matrix_v1.yaml`](_catalog/ops/gtm_public_capability_matrix_v1.yaml)) is the single source the registry copy and docs must not exceed. Refreshed to v1.2 against current reality: the live gate registers **57 tools** (the prior 46-vs-57 deployed/merged split is resolved; the +11 Tier-1 Layer 2 wraps are now registered), so any "46-tool surface" line in shipped collateral (the #26 GTM draft) is a known stale residue to correct. The public-free corpus split holds (~478 atoms / 2 jurisdictions + the federal-accessibility-standards tenant), with the Austin-2024 web-warmed deepening flagged as needing a public-vs-internal re-verification before it is marketed. The spine capabilities map to current state (engine extraction done, Cotality solved/deploy-pending, precedence wired in prod, hydrology live on pysheds). The calibration caveat stays a first-class field: confidence is asserted-not-earned on the read path (06-11 audit), so no tool is marketed as calibrated. **Note: prod still runs `cortex-api-00169-jep`; the convergent deploy gates full prod functionality even though the gate already registers 57.**

## 4. Launch readiness (defers to 58; this is the GTM-positioning view of it)

The launch execution sequence and the authoritative launch gate live in [`58_gtm_readiness_sprint.md`](58_gtm_readiness_sprint.md) (the architect-community launch: engine lift app-by-app QA, Austin-2024 code library, per-user auth, uniform provenance on architect-facing surfaces). This doc does NOT maintain a competing gate. What remains true from the GTM-positioning angle, as of 2026-06-15:

The one technical gate that now blocks the most is the **convergent cortex-api deploy** (prod still `cortex-api-00169-jep`): #178 (spine-flag bake), #179 (C3 thin BFF), #180 (auth + data-leak fix), #181 + #182 (Cotality). Sequenced Option A, canary-gated. **The #180 auth/data-leak fix is a hard precondition for any external demo** (unauthenticated `GET /api/engagements` currently returns real engagements; the exposed data is company dogfood, not a paying customer's, but it cannot be live during a launch). This single deploy closes the leak, activates C3, and lights up Cotality in one verified shot.

Already cleared since the 06-07 framing: engine extraction DONE; pysheds baked (hydrology real on engine-api); Cotality OAuth SOLVED (#182 merge + deploy remaining); precedence wired into prod. The ICC creds for A117.1 + I-Codes remain open (the code/plan-review package launches on ADA/FHA + public-free city code + Austin 2024, with A117.1/I-Codes marked roadmap until creds clear).

Commerce/metering is NOT a gate for the architect launch: per [`58`](58_gtm_readiness_sprint.md), payment/metering routes to the ICC cutover as the first paid Layer-2 surface, and the self-serve is free-tier-first. The 53a non-custodial settlement rail is the substrate item to watch on the capital axis, not a launch blocker.

The GTM-positioning offer readiness (what this doc owns):
- Capability matrix v1.2 matches the live gate (57 tools) and the launch collateral does not exceed it.
- `hauska.dev/mcp` docs carry the data-package framing + `llms.txt` + `.well-known/agents.txt`; the #26 collateral's stale "46-tool" line is corrected to 57.
- Decision C channel plan owners + dates filled; capability claims do not exceed the matrix; no calibration claim anywhere.

Operator-gated inputs (flagged, not invented): the per-package Layer 2 prices are an open operator decision, floored by the spine COGS in [`14`](14_pricing_framework.md) (and, for any Cotality-backed package, by the Cotality production tier) per the Decision B reshape, so this doc invents no prices; the government pricing that gates the separate Vertosoft/SmartCity motion is a distinct operator decision and does not gate this substrate launch.

## 5. GTM-loop buildable spec

The gtm_loop ([`90_runbooks/diagrams/gtm_loop.mermaid`](90_runbooks/diagrams/gtm_loop.mermaid)) is the full autonomous discovery-to-outreach engine. Refined here to a buildable v1 that respects the 76b scope boundary (no Tier 1+ outbound email workers in v1) and the consent / E&O kill criteria. The loop is built QUEUED-on-deploy; it observes a live surface, so it cannot meaningfully run before the surface is deployed.

v1 buildable components:

1. Sensors (v1 subset): MCP tool calls and connects (external `key_hash`, not internal), docs/`/mcp` page hits, the Property Brief extension "build on this data" click, coverage-API hits. The extension and brief events already flow; the MCP-side fields are the 76b Track M usage-logging deliverable.
2. Telemetry plane: extend `gtm_events` per the 76b migration (`source_surface` in {extension, api, mcp, docs, share_page}; event types `mcp_tool_call`, `mcp_connect`, `mcp_error`, `mcp_docs_clicked`; fields `tool_name`, `error_class`, `jurisdiction_key`, `api_key_hash` with no raw key). Consent flags first-class. Verify against live source whether this migration already landed before re-specifying it.
3. Triage: classify each external-caller signal into intent/lead-score, persona/package signal (which data package the caller's tools imply), conversion opportunity, and friction (errors, no-coverage pills). Read-only classification; writes only to the observation log.
4. Workers (v1 = Tier 0 only): steward daily digest, content-gap drafts, persona/package enrichment. No outbound send in v1.
5. Policy tier check: Tier 0 auto (digest, drafts, enrichment); Tier 1 (outbound send, content publish) HELD behind E&O bound + consent present; Tier 2/3 always operator-proposed. This gate is the hard line that keeps v1 inside the 76b kill criteria.
6. Steward: single human interface; daily digest + weekly KPI (3 MCP metrics into [`79a_weekly_moat_scoreboard.md`](79a_weekly_moat_scoreboard.md)) + drift watch. Operator approves, redirects, tunes thresholds.
7. Verify / drift loop: post-action verify (open, reply, click, convert) feeds back; underperform-vs-baseline pauses a segment. Inert in v1 until Tier 1 outbound is unlocked.

What v1 explicitly defers: all Tier 1+ outbound workers, paid-signup automation, any per-data-package outbound campaign. Those unlock only after E&O is bound and the first external caller signal is real.

## 6. QUEUED-on-deploy dispatches

Authored fire-ready but QUEUED; do not fire until the §4 deploy gate clears and the operator unpins. **Both ran early (operator-fired 2026-06-07); the build-side work is code-complete with PRs held for merge, and the publish/observe side stays gated on §4.**

| Dispatch | Owner | Repo | Status (2026-06-07) |
|---|---|---|---|
| [`_dispatches/2026-06-07_cc-agent-C_gtm_loop_discovery_automation_QUEUED.md`](_dispatches/2026-06-07_cc-agent-C_gtm_loop_discovery_automation_QUEUED.md) | cc-agent-C | legacy-design-tools | DONE, PR #148 held. Tier-0 loop built (triage, scoreboard metrics, outbound provably disabled). Confirmed the 76b observation schema already landed (migrations 0028 + 0032), built only the delta. E5 external-caller validation still waits on prod deploy. |
| [`_dispatches/2026-06-07_cc-agent-M_gtm_launch_collateral_refresh_QUEUED.md`](_dispatches/2026-06-07_cc-agent-M_gtm_launch_collateral_refresh_QUEUED.md) | cc-agent-M | hauska-mcp-server | DONE, PR #26 held. Collateral refreshed to the data-package framing; passed all honesty gates (no "calibrated", corpus split on every number). Nothing published (operator-gated). Surfaced two matrix-staleness flags, since reconciled into v1.2 (§3). |

Matrix reconciliation (matrix now v1.2): as of 2026-06-15 the live gate registers **57 tools** (the prior 46-vs-57 deployed/merged split is resolved; the +11 Tier-1 Layer 2 wraps are registered), and the six place/workspace tools are `shipped`. **Open residue:** the cc-agent-M PR #26 collateral shipped a stale "46-tool surface" line (flagged in [`00_current_state`](00_current_state.md) as a deploy residue); it needs a re-refresh to 57 before publish. A follow-up collateral pass is authored QUEUED-on-deploy: [`_dispatches/2026-06-15_cc-agent-M_gtm_collateral_rerefresh_to_57_QUEUED.md`](_dispatches/2026-06-15_cc-agent-M_gtm_collateral_rerefresh_to_57_QUEUED.md) (cc-agent-M) corrects 46 -> 57, re-syncs the data-package sections to current spine state (Cotality solved, precedence wired, Regrid dropped, Austin 2024), and re-runs the honesty grep, gated on the convergent deploy so it describes live prod.

## 7. Premortem and focus-queue

Pre-mortem (premortem-check, 2026-06-07) cleared GREEN. The one load-bearing concern, sell-reasoning messaging, is resolved structurally: every package in §2 leads with a reasoning verb and names what raw layer stays Layer 1 free, so no package becomes a raw-data resale SKU. Partnership-first is clean (all baselines are national/federal public-records, out of the refusal scope; the 32 platform-internal jurisdictions are never marketed public). Cost-per-jurisdiction is untouched (zero onboards). The second guardrail, calibration honesty, is enforced as a matrix field and a per-message caveat: confidence is the raw LLM number, uncalibrated, arrow-two pending.

Focus-queue (CLAUDE.md focus-queue rule): this workstream queues nothing new and kills nothing. It is the GTM-positioning layer over the 58 execution sprint, so it consumes no execution cycles that compete with the engine work or the launch sprint. What it explicitly does not do, and what therefore stays queued: firing any channel (rides 58's launch gate), building Tier 1 outbound workers (E&O-gated), and the Layer-3 government / SmartCity / Vertosoft motion (separate track, separate operator pricing decision).

## Cross-references

- [`08_tiered_access_model.md`](08_tiered_access_model.md) - the composable data-package model this doc takes to market
- [`58_gtm_readiness_sprint.md`](58_gtm_readiness_sprint.md) - the governing launch-execution sprint; §4 here defers to its launch gate
- [`61_property_intelligence_master_plan.md`](61_property_intelligence_master_plan.md) - the engine/data board (Cotality every-SKU, Regrid dropped, seam-first waves)
- [`59_spine_moat_and_high_value_features.md`](59_spine_moat_and_high_value_features.md) - the moat features (uniform provenance, precedence) the messaging leans on
- [`52_mcp_offer_and_buildout.md`](52_mcp_offer_and_buildout.md) - the MCP surface (now 57 gated tools) and the build-before-launch sequence
- [`55_spine_data_intelligence_stack.md`](55_spine_data_intelligence_stack.md) - the verified spine the capability matrix is refreshed against
- [`14_pricing_framework.md`](14_pricing_framework.md) - Decision B economics + spine COGS the package prices are floored by
- [`16_commercialization_roadmap.md`](16_commercialization_roadmap.md) - step 5 GTM motion this doc operationalizes
- [`76b_gtm_engine_polish_sprint.md`](76b_gtm_engine_polish_sprint.md) - the GTM engine sprint whose exits feed the §4 gate
- [`07a_smartcity_product_positioning.md`](07a_smartcity_product_positioning.md) - the separate Layer-3 government motion (cross-ref, not duplicated)
- [`_catalog/ops/gtm_launch_channel_plan_v1.yaml`](_catalog/ops/gtm_launch_channel_plan_v1.yaml) - Decision C channel plan (pinned)
- [`_catalog/ops/gtm_public_capability_matrix_v1.yaml`](_catalog/ops/gtm_public_capability_matrix_v1.yaml) - the honesty matrix refreshed to v1.2 here

## Revision history

- **2026-06-15 (reality refresh):** Refreshed off the stale 2026-06-07 snapshot against current state. Engine extraction DONE (engines live on `engine-api`); Cotality SOLVED end-to-end (#181 merged, #182 open), so the Cotality-backed packages move from inert to deploy-pending; gate now registers 57 tools (was 46); Regrid DROPPED (Cotality sole parcel spine); precedence primitive WIRED into the production finding path; hydrology live on real pysheds; Austin 2024 is the launch hero metro (web-first grounding). Reframed §4 to defer the launch gate to [`58_gtm_readiness_sprint.md`](58_gtm_readiness_sprint.md) (the convergent cortex-api deploy #178/#179/#180/#181/#182, with the #180 auth-leak fix a hard demo precondition) rather than maintain a competing list; reconciled against 58 so the two GTM docs are complementary (58 = execution sprint, 76d = data-package positioning + capability honesty). Matrix bumped toward v1.2 (57 tools); flagged the #26 collateral's stale 46-line for a re-refresh. Calibration honesty strengthened with the 06-11 audit finding (asserted-not-earned on the read path). Title generalized; related extended (58, 59, 61); last_updated bumped.
- **2026-06-07 (dispatch reconciliation):** Both QUEUED dispatches ran early (operator-fired): cc-agent-C PR #148 (Tier-0 gtm-loop, observation schema confirmed pre-landed, outbound provably disabled) and cc-agent-M PR #26 (collateral refresh, all honesty gates passed). Folded PR #26's two matrix-staleness flags into the capability matrix v1.1: the 46-deployed vs 57-merged split (the +11 Tier-1 wraps are deploy-pending) and the six place/workspace tools flipped to `shipped`. §6 updated with PR/status. PRs held for operator merge; publish/observe still gated on §4. Slot moved 76f -> 76d (gap-fill vs 76e observability).
- **2026-06-07 (origin):** Filed as the GTM data-package go-to-market + launch-readiness doc while Decision C stays pinned. Translates the composable data-package model (08) into per-package buyer/channel/reasoning-first messaging (Subsurface, Hydrology/flood, Parcel/property, Code/plan-review, Environmental); enumerates the single Decision C unpin gate (deploy + Cotality/ICC creds + SDK metering + offer/collateral); refines the gtm_loop into a buildable Tier-0 v1 spec with Tier 1 outbound held behind E&O + consent; indexes two QUEUED-on-deploy dispatches; refreshes the public capability matrix to v1.1. Premortem GREEN. Honesty discipline (public-vs-internal corpus split; no calibration claim) enforced throughout.
