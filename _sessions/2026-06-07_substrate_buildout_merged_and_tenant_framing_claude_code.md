---
id: 2026-06-07_substrate_buildout_merged_and_tenant_framing
title: Session — substrate build-out wave merged; Mox/SmartCity tenant framing
date: 2026-06-07
kind: session
agent: claude_code (planner)
related: [00_current_state, 00c_portfolio_master_map, 52_mcp_offer_and_buildout, 53_hauska_sdk_completion_sprint, 04a_arrow_two_calibration_capture, _prospects/mox/2026-06-07_mox_engagement_plan, 30a_smartcity_stabilization_sprint, 31a_bastrop_maintenance_sprint]
---

# Session — substrate build-out wave merged; Mox/SmartCity tenant framing

Long multi-day session (2026-06-06 into 2026-06-07). Took the portfolio from "spine deployed" to "spine that sells reasoning, earns confidence, and can transact," merged the whole build-out wave, and established the scoped-tenant framing that unifies Mox and SmartCity.

## What landed (all merged to main 2026-06-07)

- **Cortex hydrology** (legacy-design-tools #142): D8 drainage + NOAA Atlas 14 rainfall sim + `site-drainage` atom. Root-cause chase resolved a grid-relative-threshold bug (ingest used USGS request dims, not the parsed DEM grid; fix `96b81bf`). Native D8 fallback; pysheds Dockerfile bake owed.
- **Cotality data layer** (#141): 8-adapter pack merged, inert. Empirically diagnosed the OAuth blocker: keys (three demo apps from developer.corelogic.com) return `oauth.v2.InvalidClientIdentifier` across every gateway (prod/UAT/MCP, body + Basic). Not wiring, not host: a CoreLogic-side activation issue. Six secrets wired into cortex-api (`legacy-design-tools-prod`, rev 00119); Gene escalation + PUC one-pager drafted (`_research/cotality/2026-06-06_cotality_puc_data_protection_one_pager.md`).
- **MCP Tier-1 build-out** (hauska-mcp-server #25): `generate_property_brief` (the wedge made agent-callable) + hydrology/topography/encumbrance wraps; Cotality wraps built dark (credential-pending).
- **Brief service seam** (legacy-design-tools #144): service-auth + metering path so the MCP gate calls the wallet-paywalled brief without an install id; place-scoped hydrology entry.
- **Arrow two Phase 1** (legacy-design-tools #143): tier-1a adjudication-to-atom evidence ledger (zero schema; joins `atom_events` to `findings.citations[].atomId`, tenant-partitioned). The deposit loop is live. Phase 0 recon found code atoms carry no confidence field and the corpus is rebuilt-immutable, so Phase 1 is a ledger, not a confidence write-back.
- **Hauska SDK completion** (hauska-sdk #1): Circle fiat rail (sandbox), revenue routing/source-actor split, MCP-gate metering, money-path tests green. cc-agent-S confirmed as the dedicated hauska-sdk seat.
- **SmartCity M-Stabilize restart** (smartcity-os): operator DB hold released 2026-06-06 (Neon target us-east-2 `tiny-art-63602898`); WS-1 Phase 2A.0 migration reconcile (#21) merged, unblocking Phase 2A schema sync.

## Decisions and corrections

- **Decision B (pricing) confirmed already ratified** 2026-06-06 (Free $0 / Builder $49 / Pro $199). Decision C (GTM channels) **pinned** until the build-out + test is done; launch is premature.
- **Doc reconciliation to ground truth**: corpus corrected to 34 jurisdictions / ~21,126 atoms (2 public-free ~478, 32 platform-internal) across CLAUDE.md, 00c, and both external-facing docs (investor brief, commercialization vision); fiat rail corrected to Circle in CLAUDE.md; cross-repo recon (`_research/2026-06-06_cross_repo_recon.md`) filed. Source: six-repo recon.
- **Engine extraction (ADR-008) unfrozen**; the build-out leg is now complete.
- **cc-agent-S** established as the hauska-sdk fleet seat.

## Strategic framing established

- **Scoped-tenant pattern.** SmartCity OS, Mox, and the brokerage extension are three instances of one shape: a scoped tenant with custom surfaces on the shared, gated spine, one theology (calibration + sovereignty, the deposit loop, the gate). Operator framing: Mox's custom/finance pieces are like building a SmartCity dashboard, custom components with the same theology. SmartCity should consume the spine like Mox (it is an island today).
- **The next leg is the tenant leg.** Both Mox and SmartCity force the same critical path: ADR-005 multitenancy + ADR-008 engine decoupling + arrow-two Phase 2/3. Stand it up once, both tenants ride it. Captured in the Mox engagement plan's substrate-readiness section and in 00c.
- **Mox engagement** logged at `_prospects/mox/2026-06-07_mox_engagement_plan.md` (re-homed from a 42_ slot; cross-refs reconciled) with collateral manifest and a substrate-readiness analysis.

## State and what is next

- **Code-complete, deploy pending.** All merged but prod runs prior revisions. Operator deferred deployment until ICC + Cotality are ready and the relevant fixes/builds are done.
- **External blockers:** Cotality credential activation (Gene/CoreLogic); ICC onboarding/creds.
- **Next leg:** the tenant leg (ADR-005 + ADR-008 + arrow-two Phase 2/3), SmartCity-on-spine (31a Phase 3 atom-backed context, now unblocked), Mox Phase 0 scoping. **Operator gate before more building:** sharpen the SmartCity product line (add the Mox-style browser extension as a SmartCity product alongside plan review and other surfaces) and refine the Vertosoft offer.

## Artifacts created/updated this session

New: `04a_arrow_two_calibration_capture.md`, `52_mcp_offer_and_buildout.md`, `53_hauska_sdk_completion_sprint.md` (parallel planner), `_research/2026-06-06_cross_repo_recon.md`, `_research/cotality/2026-06-06_cotality_puc_data_protection_one_pager.md`, `_prospects/mox/2026-06-07_mox_engagement_plan.md` (+ collateral manifest, parking doc), `90_runbooks/diagrams/mcp_tenant_consumption.mmd`, and the dispatch + inbox records for hydrology, Cotality, MCP Tier-1, SDK, arrow-two, brief seam, SmartCity restart. Updated: CLAUDE.md, 00c, 00d, 00_current_state, EXECUTIVE_SUMMARY, HAUSKA_INVESTOR_BRIEF, HAUSKA_COMMERCIALIZATION_VISION, 14_pricing_framework (Circle, prior session).
