---
id: 2026-07-14_cotality_mcp_eval_agreement_signed
title: Cotality/CoreLogic MCP Server Evaluation Agreement — fully executed 2026-07-06
date: 2026-07-14
kind: inbox
related: [_decisions/2026-07-13_cotality_swap_public_record_migration, 77b_cotality_integration_strategy, 74_commercial_agreements]
---

# Cotality MCP Server Evaluation Agreement — executed

Signed evaluation agreement between **CoreLogic Solutions, LLC** and **Legacy Group ATX, LLC** (Valerie Thompson, CEO, signed 7/6/2026; Eric Wrobel, Executive, CoreLogic, 7/6/2026; Michelle Taylor CC'd). Doc ref 00162678.0 / 2010-00115029.0-T, effective 2026-07-01. Operator received it 2026-07-13 as "the one thing I got from Cotality."

## Scope (MCP Server, streamable HTTP, max 100 requests/day total)

CLIP: Find_Property_by_CLIP, Find_Property_by_Full_Address. Analytics: CoreLogic_HPI, HPI_Forecast, Listing_Trends, Market_Trends, Rental_Trends. Risk: Age_of_Roof_by_CLIPs, Climate_Risk_by_CLIPs, Combined. Property Characteristics: property details by CLIPs.

## Binding constraints (load-bearing for product use)

- **100 requests/day** evaluation cap.
- **AI clause**: Services may enter an AI platform only as a "Closed Secure System" — input AND output accessible solely by Company; no automated decision-making affecting individuals. **Outputs cannot ship to end users** — no public briefs, no map layers, no customer-visible slots on this agreement.
- Governed by cotality.com evaluation terms (URL in the agreement).

## What this changes / doesn't

- Does NOT reopen consumer-facing slots (rent-heat, comps, insurance chip stay on the 2026-07-13 public-record posture; swap decision unchanged).
- DOES unblock: the 77b §5 MCP federation evaluation (build the Hauska MCP → Cotality MCP adapter against a contracted endpoint), internal ground-truthing of CAD-store values / climate risk / rental trends at 100/day, and a priced-against-free negotiating baseline for any production deal.
- **No credentials were delivered** — the agreement is legal-only. Operator action: request endpoint URL + client credentials + docs from Michelle Nguyen (minguyen@cotality.com) / Michelle Taylor (draft provided in session chat 2026-07-14).
- Timing note: signed the same day the REST demo keys expired — the vendor moved the relationship to the MCP eval track; the REST-key darkness was not (only) neglect.

Route to: `74_commercial_agreements.md` (bizops filing), 77b §5 status update, and the eval-adapter dispatch once creds land.

## Update 2026-07-14 (later): UAT credentials arrived and are live-verified

Michelle Taylor delivered UAT creds (client HAUSKA-UAT). Stored in Secret Manager (hauska-prod-497015: COTALITY_MCP_UAT_CLIENT_ID / COTALITY_MCP_UAT_CLIENT_SECRET). Live-verified: JWT mints at api-uat.cotality.com/jwt-auth/token (product list Edgemicro Auth + mcp-gateway); the MCP server itself mints its own opaque token at mcp-uat.cotality.com/oauth/token and answers full streamable-HTTP JSON-RPC at mcp-uat.cotality.com/mcp (initialize handshake OK, protocol 2025-03-26). BLOCKER: tools/list returns EMPTY - zero of the 11 contracted SKUs are provisioned to the UAT account. Operator emailing Michelle to provision. Once tools appear, the federation-eval build (next-wave lane 3) unblocks.
