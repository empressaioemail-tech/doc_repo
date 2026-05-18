---
id: 72_hauska_inc_operations
title: Hauska Inc. operations â corporate state tracker
status: active
last_updated: 2026-05-18
applies_to: portfolio
related: [00_current_state, 14_pricing_framework, 50_hauska_mcp_server, 51_substrate_v1_sprint, 70_bizops_overview, 80_adrs/adr_008_engine_factor_out, 80_adrs/adr_018_atom_contract_substrate_layer]
owner: nick
---

# Hauska Inc. operations

> **Corporate state tracker.** Hauska Inc. is the separate C-corp carrying the commercial substrate (Hauska Engine, Hauska SDK, Hauska MCP Server, atom contract, public catalog, eventual payment substrate). This doc tracks its operational readiness across entity separation, banking, IP posture, insurance, regulatory posture, and settlement rails. State only; CLAUDE.md keeps legal and corporate execution items routing to Nick. Per CLAUDE.md, this band tracks state and does not work the items inside strategic sessions.

## Entity status

| Item | Status | Last updated | Notes |
|---|---|---|---|
| **Incorporation** | Established | Pre-2026-05-18 | Separate C-corp; confirmed in CLAUDE.md identity section. Date of incorporation not yet logged here â add when surfaced. |
| **Brand / IP placement** | Settled | 2026-05-18 | Per [ADR-008](80_adrs/adr_008_engine_factor_out.md) and [ADR-018](80_adrs/adr_018_atom_contract_substrate_layer.md). Hauska Inc. carries: Hauska Engine, Hauska SDK (`@hauska-sdk/*`), Hauska MCP Server, atom contract (`@hauska/atom-contract`), public catalog, payment substrate. Empressa is a Legacy Group ATX LLC product brand. |
| **Github org** | Open | â | Repos currently in `empressaioemail-tech` org (per [Hauska MCP Server repo](https://github.com/empressaioemail-tech/hauska-mcp-server) and [Hauska SDK](https://github.com/hauska-sdk/hauska-sdk)). Per ADR-008 P3 roadmap entry, future migration to a Hauska Inc. github org pending. |

## Banking

| Item | Status | Notes |
|---|---|---|
| **Operating bank account** | Open / not yet established | Gates [`14_pricing_framework.md`](14_pricing_framework.md) Open-question #5 (regulatory posture). Resolves money-transmitter posture work alongside the IP attorney memo. Routing date TBD per CLAUDE.md "What is open." |
| **Capital structure** | Not tracked in this band | If structural decisions emerge, log here; legal execution stays with Nick per CLAUDE.md "What is out of scope." |

## Capital allocation

State of declared capital allocations against Hauska Inc. operations.

| Item | Status | Notes |
|---|---|---|
| **Substrate v1 first-30-cities ingest budget** | Allocated 2026-05-18 | $1-2K LLM compute + 60-100 person-hours per [`51_substrate_v1_sprint.md`](51_substrate_v1_sprint.md) Phase 0 close. Funded from Hauska Inc. equity per [`_decisions/2026-05-18_substrate_v1_phase_0_close.md`](_decisions/2026-05-18_substrate_v1_phase_0_close.md). Cost ceiling enforced by the cost-per-jurisdiction structural commitment ($200 compute + 1 hour human review per jurisdiction) and the 3-county hard-kill checkpoint at [`51_substrate_v1_sprint.md`](51_substrate_v1_sprint.md) Stream 1D. |

## IP attorney memo

| Item | Status | Notes |
|---|---|---|
| **Texas IP attorney memo** | Open / routing date TBD | Per CLAUDE.md "What is open" and [`51_substrate_v1_sprint.md`](51_substrate_v1_sprint.md) sync point #6. Memo delivery gates non-Bastrop ingestion (Bastrop + Grand County stay unblocked; rest of Texas county pipeline gated). Joint dependency with [`14_pricing_framework.md`](14_pricing_framework.md) Open-question #5 regulatory-posture gating. |

## Tech E&O insurance

| Item | Status | Notes |
|---|---|---|
| **Tech E&O insurance routing** | Open / routing date TBD | Per CLAUDE.md "What is open." Required before paid Layer 2 surfaces ship first revenue; same compliance pre-revenue work as banking and IP memo. |

## Regulatory posture

Gated on memo + banking. Listed for visibility; not active work until the two upstream items clear.

| Item | Status | Notes |
|---|---|---|
| **Money-transmitter registration** | Gated | Per [`14_pricing_framework.md`](14_pricing_framework.md) Open-question #5. Requirements per state; Texas-first per the Texas-anchored ingest pipeline. |
| **KYC / AML thresholds** | Gated | Thresholds set when first paid Layer 2 surface readies for production; framework decision then. |

## Settlement rails

State carried here for cross-band visibility; the substrate decisions are in [`14_pricing_framework.md`](14_pricing_framework.md).

| Rail | Status | Notes |
|---|---|---|
| **Fiat (Stripe Connect)** | v1 candidate pinned 2026-05-18 | Per [`14_pricing_framework.md`](14_pricing_framework.md) close-the-loop pass. Implementation deferred; revisit trigger is first paid Layer 2 call from a fiat-preferring counterparty pulling Stripe Connect implementation off the queue. |
| **Crypto (USDC on Base / Ethereum / Polygon)** | Built and tested | Per `@hauska-sdk/payment` v0.1.0; 56 tests green; on-chain verification via ethers v6. Circle fiat checkout URL at `packages/payment/src/payment-request.ts:253` is the sole production code TODO blocking the Circle-checkout fiat half. |

## Domains

Hauska-namespaced internet domains required for production substrate.

| Domain | Status | Notes |
|---|---|---|
| **`hauska.dev`** | Open / Nick action | Registration not yet completed. Gates [`51_substrate_v1_sprint.md`](51_substrate_v1_sprint.md) Phase 5 (deploy) and Phase 7 (public launch). `mcp.hauska.dev` is the planned v1 MCP launch subdomain per [`_decisions/2026-05-18_substrate_v1_phase_0_close.md`](_decisions/2026-05-18_substrate_v1_phase_0_close.md). |

## Cross-references

- [`14_pricing_framework.md`](14_pricing_framework.md) â regulatory-posture and settlement-rail decisions; this doc tracks state, 14 owns the framework.
- [`51_substrate_v1_sprint.md`](51_substrate_v1_sprint.md) â sync point #6 (IP memo gates non-Bastrop ingestion) reads memo-status from here.
- [`50_hauska_mcp_server.md`](50_hauska_mcp_server.md) â MCP server is a Hauska Inc. commercial surface; deployment readiness depends on regulatory posture clearing for paid tiers.
- [`80_adrs/adr_008_engine_factor_out.md`](80_adrs/adr_008_engine_factor_out.md) â brand and entity placement.
- [`80_adrs/adr_018_atom_contract_substrate_layer.md`](80_adrs/adr_018_atom_contract_substrate_layer.md) â substrate-layer placement; atom contract is Hauska Inc. commercial substrate.

## Revision history

- **2026-05-18 (origin):** doc seeded as part of the 70-band design session. Entity-separation status from CLAUDE.md; banking / IP memo / Tech E&O insurance status from CLAUDE.md "What is open"; regulatory posture and settlement rails from [`14_pricing_framework.md`](14_pricing_framework.md) close-the-loop pass landed same session.
- **2026-05-18 (Phase 0 close):** Capital allocation section added (Hauska Inc. equity funds substrate v1 first-30-cities ingest budget per [`_decisions/2026-05-18_substrate_v1_phase_0_close.md`](_decisions/2026-05-18_substrate_v1_phase_0_close.md); cost ceiling enforced by the structural commitment and the 3-county hard-kill checkpoint at [`51_substrate_v1_sprint.md`](51_substrate_v1_sprint.md) Stream 1D). Domains section added (`hauska.dev` open / Nick action; gates Phase 5 deploy and Phase 7 launch; `mcp.hauska.dev` is the v1 MCP subdomain).
