---
id: 76d_gtm_data_package_go_to_market
title: GTM data-package go-to-market and launch readiness (Decision C pinned)
status: active
last_updated: 2026-06-07
applies_to: hauska
owner: nick
related: [08_tiered_access_model, 14_pricing_framework, 16_commercialization_roadmap, 52_mcp_offer_and_buildout, 55_spine_data_intelligence_stack, 76b_gtm_engine_polish_sprint, 07a_smartcity_product_positioning, _catalog/ops/gtm_launch_channel_plan_v1.yaml, _catalog/ops/gtm_public_capability_matrix_v1.yaml, _decisions/2026-06-07_full_engine_extraction_and_data_packages, _prospects/vertosoft/2026-06-07_vertosoft_channel_and_offer]
---

# GTM data-package go-to-market and launch readiness

> **Purpose.** Translate the composable data-package tier model ([`08_tiered_access_model.md`](08_tiered_access_model.md)) into a buildable agent-operator go-to-market, and enumerate the single gate list that unpins Decision C. Written while Decision C stays pinned ([`52_mcp_offer_and_buildout.md`](52_mcp_offer_and_buildout.md) §5): everything here is launch pre-staging, none of it fires a channel. Anything that fires a channel is authored QUEUED-on-deploy.
>
> **Scope.** The Hauska substrate / agent-operator GTM (Decision B economics, agent-builder ICP, the 46-tool MCP surface). The separate Layer-3 government / SmartCity motion through Forrest and Vertosoft is its own track ([`07a_smartcity_product_positioning.md`](07a_smartcity_product_positioning.md), [`_prospects/vertosoft/2026-06-07_vertosoft_channel_and_offer.md`](_prospects/vertosoft/2026-06-07_vertosoft_channel_and_offer.md)); this doc cross-references it and does not duplicate it.
>
> **Honesty discipline (load-bearing, enforced throughout).** Any external corpus or coverage number carries the public-vs-internal split. The public-free Layer 1 catalog is ~478 atoms across 2 jurisdictions (Bastrop 193 on the B3 edition, Grand County/Moab 285) plus the new `federal-accessibility-standards` tenant (ADA 2010 + FHA Design Manual, public-free). The other 32 of 34 ingested jurisdictions are `platform-internal` and are never marketed as public. Confidence scores are the raw LLM number, uncalibrated; arrow-two ([`04a_arrow_two_calibration_capture.md`](04a_arrow_two_calibration_capture.md)) is the mechanism that earns calibration, and it has not landed. Do not claim calibration in any messaging.

## 1. Frame

The composable data-package model reshaped the entitlement unit from persona to package crossed with access layer (Decision B reshape, [`08`](08_tiered_access_model.md) and [`_decisions/2026-06-07_full_engine_extraction_and_data_packages.md`](_decisions/2026-06-07_full_engine_extraction_and_data_packages.md)). Buyers overlap (a landman is also a broker; a city operator is also a reviewer), so GTM cannot target a persona and call it a segment. It targets a package, names the overlapping buyers who compose it, and routes each to the agent-builder channels Decision C already ratified.

The binding constraint is structural commitment 1. Each package's Layer 2 sells reasoning over the domain, cited, with a confidence score and timestamp. The raw national and federal data underneath stays Layer 1 free. A package is never a raw-data resale SKU. The whole of this doc holds that line.

## 2. Data-package go-to-market

Five packages, each translated to: the verified spine state today, the overlapping buyers, the channel, and the reasoning-first message. The "what stays free / what we do not sell" line on each package is the sell-reasoning guardrail made concrete.

### Subsurface

Spine state: SSURGO soils + USGS geology/groundwater/seismic adapters landed (PR #145 merged, 2026-06-07), deploy pending. Cotality mineral and utility (SpatialRecord) built but inert pending CoreLogic OAuth. Edwards Aquifer (TCEQ) gated. So the free federal baseline is real and the paid reasoning is the gap-closer.

Overlapping buyers: geotechnical, civil, landman, oil-and-gas diligence agents.

Channel: Anthropic MCP directory + awesome-mcp-servers (discovery), Show HN for the subsurface-reasoning angle once a callable tool exists.

Message: "Soils, geology, seismic and groundwater context for any US site, reasoned and cited." Sell the reasoning verb: assess bearing, shrink-swell, hydric, liquefaction and karst risk for a parcel, with the source layer cited. What stays free / not sold: raw SSURGO map units and USGS geology rasters are Layer 1 federal public-records baseline, not a resale SKU; the paid surface is the site-level subsurface assessment over them.

### Hydrology / flood

Spine state: D8 drainage + NOAA Atlas 14 design storms + FEMA NFHL live (PR #142 merged); pysheds sidecar not yet baked into the Cloud Run image (deploy gap, TS fallback works); Cotality flood-depth overlay inert (`useCotalityForcing=false`). The four-inches-of-rain demo is the proof artifact.

Overlapping buyers: civil engineers, insurers, developers, diligence agents.

Channel: Show HN (the four-inches-of-rain demo travels well), Anthropic MCP directory, hauska.dev blog.

Message: "What happens to this site when it rains, reasoned from the terrain." Sell the reasoning: simulate site drainage and flood exposure from the DEM and design-storm forcing, cited to NOAA and FEMA. What stays free / not sold: FEMA flood-zone lookup and NOAA design-storm tables are Layer 1; the paid surface is the drainage simulation and the cited flood-risk reasoning, not the raw federal layers.

### Parcel / property

Spine state: Regrid live; Cotality is the chosen primary parcel/property spine but inert pending OAuth; encumbrance atoms (ADR-020/021: recorded-instrument, restriction-clause, restriction-corpus) exist; the Property Brief pipeline produces reasoningSummary + laySummary + cited atoms today (UI/extension only until `generate_property_brief` wraps). This is the wedge.

Overlapping buyers: brokers, landmen, appraisers, real-estate diligence agents.

Channel: Property Brief extension upsell ("build on this data, Hauska MCP"), Anthropic MCP directory, Cursor/coding-agent communities (real-estate diligence agents).

Message: "Everything that bears on a parcel, reasoned into a brief." Sell the reasoning: the property brief and encumbrance/restriction reasoning, cited. What stays free / not sold: Regrid parcel geometry and public-records baseline are not resold as a tile SKU; the paid surface is the brief reasoning and the restriction analysis. Note the partnership-first scope clarifier: Regrid/Cotality are national public-records aggregation, out of the refusal scope; no city operational data is in this package.

### Code / plan-review

Spine state: the richest package after the spine-robustness wave. 34 jurisdiction municipal/zoning corpus (32 platform-internal, Bastrop + Grand County public-free); accessibility standards ADA 2010 (901 sections) + FHA Design Manual (212 sections) ingested public-free under the new `federal-accessibility-standards` tenant (PR #66 merged); A117.1 + IRC 2021 wired credential-pending (ICC OAuth); the precedence/reconciliation engine landed (PR #147, `reconcileStandardPrecedence`, the combine-A117.1-ADA-FHA demo works, FHA 24in governs latch-side clearance with all three standards cited at conf 0.91); plan-set decomposition landed (PR #146).

Overlapping buyers: architects, plan reviewers, AHJs, AEC compliance agents.

Channel: Anthropic MCP directory + awesome-mcp-servers (the accessibility-standards corpus is a clean public-free hook), the EntreArchitect community (the multi-standard reconciliation ask originated there), hauska.dev blog.

Message: "Free ADA and FHA atoms; paid is the reconciliation that tells you which standard governs at this door." Sell the reasoning: most-stringent-governs precedence resolution across accessibility standards and the I-Code family, cited. What stays free / not sold: ADA 2010, FHA Design Manual, and public-free city code are Layer 1; the paid surface is the precedence reasoning and the per-discipline plan-set findings. Calibration honesty applies hard here: the conf-0.91 number on the demo is the raw LLM emission, not a calibrated probability; message it as a cited confidence score, calibration in progress.

### Environmental

Spine state: thinnest package. EPA EJScreen live (CalEPA mirror, frozen, so freshness honesty applies); FCC broadband gated off (WAF-blocked); no wetlands / species / air adapters built. Effectively an EJ-context teaser today, not a full package.

Overlapping buyers: planners, ESG / environmental-diligence agents.

Channel: hold from headline launch; list as roadmap on the capability matrix. Do not feature in registry copy until it has more than a frozen EJScreen mirror.

Message (when built): "Environmental-justice and habitat context, reasoned and cited." For now the honest claim is EJ context only, sourced and timestamped, with the frozen-mirror freshness caveat surfaced. What stays free / not sold: EPA EJScreen is Layer 1 federal data; nothing here is a paid SKU yet.

### Package summary

| Package | Sellable today | At launch (deploy + creds) | Lead channel | Reasoning verb |
|---|---|---|---|---|
| Subsurface | adapters merged, deploy-pending | + Cotality mineral/utility on creds | MCP directory + awesome-mcp | assess subsurface risk |
| Hydrology / flood | live (sidecar deploy gap) | + Cotality flood-depth | Show HN + blog | simulate drainage / flood |
| Parcel / property | brief pipeline live (UI only) | + `generate_property_brief` wrap + Cotality | extension upsell + directory | reason a parcel brief |
| Code / plan-review | richest; precedence + ADA/FHA live | + A117.1 / I-Codes on ICC creds | directory + EntreArchitect | reconcile precedence |
| Environmental | EJ teaser only | roadmap | hold | (deferred) |

## 3. Capability-matrix refresh

The public capability matrix ([`_catalog/ops/gtm_public_capability_matrix_v1.yaml`](_catalog/ops/gtm_public_capability_matrix_v1.yaml)) is refreshed to v1.1 against the now-richer verified spine ([`55`](55_spine_data_intelligence_stack.md)) and the 46-tool surface ([`52`](52_mcp_offer_and_buildout.md)). Key deltas captured there: the surface is 46 tools (11 public + 4 Codex + 31 Cortex), not 40; the public-free corpus split is stated as ~478 atoms / 2 jurisdictions plus the federal-accessibility-standards tenant; the new spine capabilities (accessibility corpus, precedence engine, plan-set decomposition, subsurface adapters, hydrology) are mapped to sellable-today vs at-launch with their deploy/credential gates; and the calibration caveat is a first-class field so no tool is marketed as calibrated. The matrix is the single source the registry copy and docs must not exceed.

## 4. Launch-readiness checklist (the Decision C unpin gate)

Decision C unpins when all of the following are true. This is the single gate list; it composes the build-out sequence in [`52`](52_mcp_offer_and_buildout.md) §5 and the 76b sprint exits, framed as the operator's go/no-go.

Deploy and surface:
- Build-out wave deployed to prod (the 2026-06-07 merged leg is live, not just merged): MCP Tier-1 wraps incl. `generate_property_brief`, brief-service seam, hydrology, SDK rail. Prod currently runs prior revisions.
- pysheds sidecar baked into the Cloud Run image (hydrology full fidelity) OR hydrology marketed on the TS-fallback honesty.
- M-Stabilize Phase 2C cutover deployed (the SmartCity-Neon revision), per the deferred-deploy posture.

Credentials cleared:
- Cotality / CoreLogic OAuth activated (the `Invalid client identifier` operator-mechanical fix) so the Cotality-backed Layer 2 packages (parcel, subsurface mineral, hydrology flood-depth) ship live rather than credential-pending.
- ICC Code Connect onboarding + creds so A117.1 + I-Codes go live in the code/plan-review package (or that package launches on ADA/FHA + public-free city code only, with A117.1/I-Codes marked roadmap).

Commerce live:
- Hauska SDK metering wired into the MCP gate so a Layer 2 paid call actually meters and charges (Circle fiat rail + revenue routing per [`53_hauska_sdk_completion_sprint.md`](53_hauska_sdk_completion_sprint.md)). Until this is live, paid tiers cannot transact.
- Hauska Inc. regulatory posture cleared enough to take money (banking, Tech E&O, KYC/AML thresholds per [`72_hauska_inc_operations.md`](72_hauska_inc_operations.md)). E&O binding also gates any outbound automation per the 76b kill criteria.

Offer and collateral ready:
- Capability matrix v1.1 matches the deployed tool gates (76b E7).
- `hauska.dev/mcp` docs live with the data-package framing + `llms.txt` + `.well-known/agents.txt` (76b E1, E2).
- Decision C channel plan owners + dates filled (76b E8); the YAML is drafted and pinned.
- Capability claims do not exceed the matrix; no calibration claim anywhere.

Operator-gated inputs (flagged, not invented): the Decision C unpin timing itself is the operator's call once the above are green; the per-package Layer 2 prices are an open operator decision, floored by the spine COGS in [`14`](14_pricing_framework.md) (and, for any Cotality-backed package, by the Cotality production tier) per the Decision B reshape, so this doc invents no prices; the government pricing that gates the separate Vertosoft/SmartCity motion is a distinct operator decision and does not gate this substrate launch.

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
| [`_dispatches/2026-06-07_cc-agent-M_gtm_launch_collateral_refresh_QUEUED.md`](_dispatches/2026-06-07_cc-agent-M_gtm_launch_collateral_refresh_QUEUED.md) | cc-agent-M | hauska-mcp-server | DONE, PR #26 held. Collateral refreshed to the data-package framing; passed all honesty gates (no "calibrated", corpus split on every number). Nothing published (operator-gated). Surfaced two matrix-staleness flags, now reconciled into v1.1 (§3). |

Matrix reconciliation from PR #26 (folded into [`_catalog/ops/gtm_public_capability_matrix_v1.yaml`](_catalog/ops/gtm_public_capability_matrix_v1.yaml) v1.1): the deployed surface is 46 tools but the merged code carries 57 (the +11 Tier-1 Layer 2 wraps are deploy-pending, not marketable until prod); the six place/workspace tools are flipped from `gtm_sprint_planned` to `shipped` (they are in the deployed 11-public surface). Marketing copy uses 46; 57 stays code-only until the build-out deploys per §4.

## 7. Premortem and focus-queue

Pre-mortem (premortem-check, 2026-06-07) cleared GREEN. The one load-bearing concern, sell-reasoning messaging, is resolved structurally: every package in §2 leads with a reasoning verb and names what raw layer stays Layer 1 free, so no package becomes a raw-data resale SKU. Partnership-first is clean (all baselines are national/federal public-records, out of the refusal scope; the 32 platform-internal jurisdictions are never marketed public). Cost-per-jurisdiction is untouched (zero onboards). The second guardrail, calibration honesty, is enforced as a matrix field and a per-message caveat: confidence is the raw LLM number, uncalibrated, arrow-two pending.

Focus-queue (CLAUDE.md focus-queue rule): this workstream queues nothing new and kills nothing. It is launch pre-staging that runs while Decision C is pinned, so it consumes no execution cycles that compete with the build-out or the tenant leg. What it explicitly does not do, and what therefore stays queued: firing any channel (operator-gated unpin), building Tier 1 outbound workers (E&O-gated), and the Layer-3 government / SmartCity / Vertosoft motion (separate track, separate operator pricing decision).

## Cross-references

- [`08_tiered_access_model.md`](08_tiered_access_model.md) - the composable data-package model this doc takes to market
- [`52_mcp_offer_and_buildout.md`](52_mcp_offer_and_buildout.md) - the 46-tool surface and the build-before-launch sequence
- [`55_spine_data_intelligence_stack.md`](55_spine_data_intelligence_stack.md) - the verified spine the capability matrix is refreshed against
- [`14_pricing_framework.md`](14_pricing_framework.md) - Decision B economics + spine COGS the package prices are floored by
- [`16_commercialization_roadmap.md`](16_commercialization_roadmap.md) - step 5 GTM motion this doc operationalizes
- [`76b_gtm_engine_polish_sprint.md`](76b_gtm_engine_polish_sprint.md) - the GTM engine sprint whose exits feed the §4 gate
- [`07a_smartcity_product_positioning.md`](07a_smartcity_product_positioning.md) - the separate Layer-3 government motion (cross-ref, not duplicated)
- [`_catalog/ops/gtm_launch_channel_plan_v1.yaml`](_catalog/ops/gtm_launch_channel_plan_v1.yaml) - Decision C channel plan (pinned)
- [`_catalog/ops/gtm_public_capability_matrix_v1.yaml`](_catalog/ops/gtm_public_capability_matrix_v1.yaml) - the honesty matrix refreshed to v1.1 here

## Revision history

- **2026-06-07 (dispatch reconciliation):** Both QUEUED dispatches ran early (operator-fired): cc-agent-C PR #148 (Tier-0 gtm-loop, observation schema confirmed pre-landed, outbound provably disabled) and cc-agent-M PR #26 (collateral refresh, all honesty gates passed). Folded PR #26's two matrix-staleness flags into the capability matrix v1.1: the 46-deployed vs 57-merged split (the +11 Tier-1 wraps are deploy-pending) and the six place/workspace tools flipped to `shipped`. §6 updated with PR/status. PRs held for operator merge; publish/observe still gated on §4. Slot moved 76f -> 76d (gap-fill vs 76e observability).
- **2026-06-07 (origin):** Filed as the GTM data-package go-to-market + launch-readiness doc while Decision C stays pinned. Translates the composable data-package model (08) into per-package buyer/channel/reasoning-first messaging (Subsurface, Hydrology/flood, Parcel/property, Code/plan-review, Environmental); enumerates the single Decision C unpin gate (deploy + Cotality/ICC creds + SDK metering + offer/collateral); refines the gtm_loop into a buildable Tier-0 v1 spec with Tier 1 outbound held behind E&O + consent; indexes two QUEUED-on-deploy dispatches; refreshes the public capability matrix to v1.1. Premortem GREEN. Honesty discipline (public-vs-internal corpus split; no calibration claim) enforced throughout.
