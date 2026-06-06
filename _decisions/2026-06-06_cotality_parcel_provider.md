---
decision_id: 2026-06-06_cotality_parcel_provider
date: 2026-06-06
owner: Nick
status: active
related_canonical: [76c_operator_master_next_steps, 75c_property_brief_data_backlog, 00d_portfolio_roadmap_reference, 77_place_graph_strategy]
related_research: [_research/2026-05-30_cotality_property_brief_recon, 80_meetings/transcripts/2026-06-cotality_corelogic_gene_sales_engineer_call_otter]
---

## Decision

Cotality (formerly CoreLogic) is the chosen parcel and zoning data provider for the Property Brief / Cortex / Codex launch, selected over Regrid. The browser extension and Cortex/Codex are not considered launch-viable without Cotality (parcel, zoning, ownership, tax, valuation) and ICC (model code) wired in. Both apps keep being built to the integration boundary so the only remaining launch step is wiring in Cotality and ICC when the contracts land.

## Context

Property Brief prod smokes returned `regrid:parcels` / `regrid:zoning` = `no-coverage` on Round Rock. The 2026-05-30 Cotality recon mapped the vendor and recommended finishing the Regrid debug first and treating Cotality as an upsell lane, because the assessor-grade data the Brief needs (Lane A: Property Characteristics / SpatialRecord / Zoning / MCP) is sales-gated. The operator overrides that ordering: go with Cotality as the spine, because Cotality owns its data (pays escrowed property taxes for 99%+ of US counties; counties buy data back), it is fresher than Regrid (Regrid resells third-party data), it is MCP-native, and consolidating on one richer provider reduces per-query cost versus Regrid's per-parcel pricing that would blow up the $20/mo consumer tier. As of 2026-06-06 the Cotality eval is live: AE Michelle Taylor emailed the onboarding request (legal/billing info plus a one-paragraph use-case) for the MCP eval, and provided a self-serve 30-day API trial (https://developer.corelogic.com/#/sign-up, 100 property-data calls/day plus 25 AVM calls/day).

## Structural commitment check

Pre-mortem run 2026-06-06, cleared green on all four structural commitments and the quality gate. Commitment 2 (partnership-first sourcing) returns green by rule: Cotality is a national public-records aggregator, the same product-baseline category that the 2026-05-23 partnership-first scoping clarifier explicitly places out of scope, identical to Regrid. Cotality is MCP-native, which positively serves commitment 4 (dual interface). Two risks named, neither a commitment violation: (1) launch is now gated on Cotality's sales plus Permissible-Use-Committee (PUC) cycle and an extension-display license clearance, weeks not hours; (2) Lane A is sales-gated with no public schema, so it cannot be fully wired blind. Mitigations below.

## Reasoning

Cotality data ownership and freshness, MCP-native delivery, and usage-based pricing that scales with subscribership (per the sales-engineer call) fit the AI-native, cited-reasoning, agent-metered model better than Regrid's resold REST. Cotality's PUC concern (no bulk data leakage into open models) is exactly what the Hauska sovereignty / event-registration architecture answers, which the sales engineer affirmed ("better protected than any other API user"). The self-serve 30-day trial means implementation is not blocked on the full MCP eval: an adapter can be built and validated against real property-data calls now.

## Implementation posture (what we can do now)

1. **Immediate, no wait:** sign up for the 30-day API trial (developer.corelogic.com) for a working key today.
2. **Adapter scaffold (cc-agent-C):** build `cotality:parcels` and `cotality:zoning` adapters in `legacy-design-tools` behind the same `siteContext.layers[]` / `overlays.ts` GeoJSON shape as the Regrid adapter (recon §3 path 2, §4 field mapping), validated on the test address 1904 Heathwood Cir, Round Rock. Dispatch: `_dispatches/2026-06-06_cc-agent-C_cotality_adapter_scaffold.md`.
3. **Keep Regrid as interim/dev provider** behind the same port so both apps stay testable end-to-end during the build; swap Cotality to the launch provider at wire-in time. (Operator may override to Cotality-only.)
4. **Parallel production path (MCP eval):** operator returns legal/billing info plus the one-paragraph use-case to Michelle to start the MCP eval; next call with product manager Hannah; federate Hauska MCP to Cotality MCP (recon §3 path 1) for production.
5. **License clearances to confirm** (recon §6): consumer browser-extension display rights, agent retrieval metering / rev-share, attribution string, caching, sub-licensing via MCP, Texas-scoped pilot pricing.

## Reversal criteria

Revisit if Cotality's PUC or licensing terms forbid consumer browser-extension display or agent-metered usage on workable terms; if the trial shows parcel-polygon or zoning coverage no better than Regrid on the Central Texas corridor; if Cotality enterprise pricing cannot fit the $20-$40/mo consumer/pro tiers at projected query volume; or if the sales/eval cycle stalls long enough to block launch and Regrid (paid tier) proves sufficient as a fallback.

## Dependencies

Depends on the 2026-05-30 Cotality recon. Feeds `76c_operator_master_next_steps.md` §2A (Regrid debug deprioritized to interim-fallback) and §3E (Cotality lane), `00d_portfolio_roadmap_reference.md` (parcel/zoning provider row), and the Property Brief launch sequence. Parallels the ICC POC track.

## Counterparties

Cotality (CoreLogic). AE Michelle Taylor (michelletaylor@cotality.com, 817-699-8152); sales engineer "Gene"; product manager Hannah (APIs + MCP). No agreement in place; eval onboarding initiated 2026-06-06.
