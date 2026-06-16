---
id: 2026-06-11_cotality_mcp_integration_call_log
title: Cotality MCP integration call log (Hannah / MCP product)
date: 2026-06-11
kind: meeting-record
status: active
related: [80_meetings/transcripts/2026-06-11_cotality_mcp_integration_hannah_call_otter, 2026-06-06_cotality_puc_data_protection_one_pager, 2026-06-11_hauska_ai_engine_and_protection_for_cotality, 77b_cotality_integration_strategy, 90_runbooks/cotality_mcp_setup, 71_pipeline]
---

# Cotality MCP integration call log

> Meeting record for the follow-up Cotality (CoreLogic) call. Raw transcript at [`80_meetings/transcripts/2026-06-11_cotality_mcp_integration_hannah_call_otter.txt`](../../80_meetings/transcripts/2026-06-11_cotality_mcp_integration_hannah_call_otter.txt). Follow-up to the 2026-06 Gene sales-engineer call. Call date per operator; logged 2026-06-11.

## Attendees

Cotality: Hannah (product manager for MCP servers; Cotality MCP launched very beginning of April), Michelle and Jean/Gene (account team, bulk and API data), a sales engineer (owns the eval and the Salesforce quote), Brandon (referenced, owns the UAT load). Hauska/Empressa: Nick.

## What Cotality offers and how it is sold

Cotality has three relevant surfaces. The MCP server is new (launched early April) and carries less data than the standard APIs. The REST APIs span several property-intelligence families including location intelligence (geospatial, Carto-style resolutions) and the core property repository (Hannah cited roughly 16 petabytes). MLS exists but live MLS is not in the trial. Separately there is AI-ready bulk data (the bulk file with an added semantic layer for agents); Hannah is only the MCP PM and would connect Nick to the bulk-data owner if that path is wanted.

Monetization for the APIs is a small monthly minimum drawdown bucket, smallest is about $100/month, which Hannah said functions in practice like the pay-per-call model Nick wants. Cotality receives the funds; Nick downstreams COGS to his consumers. The pay-per-call MCP monetization (and Nick's SDK as a monetization rail for Cotality's own MCP) was floated as ongoing R&D, parked as a separate conversation.

Geography: APIs and MCP are not geo-restricted under pay-per-call, so Nick self-restricts to Central Texas. Bulk data can be geo-restricted (entire property file for Central Texas, or N counties). Nick reconfirmed the model is API/MCP keyed, not bulk-dependent.

## What Nick committed Hauska to

The use case as Hannah read it back for general counsel, Nick-confirmed close: an AI-native stack (not a traditional web platform) that pulls in Cotality property data alongside building codes, runs a custom AI orchestrator that determines why the data matters for a specific property and compresses it into localized contextual units (atoms), and uses a blockchain SDK to distribute micropayments back to data providers. Nick stated the data is not collected or stored as raw data; the company stores the compounded intelligence over the data, exposes and collects deep links, and warms atoms on first query so repeat queries hit the atom.

Test scope: Central Texas as deep as possible, the same area where the ICC code-council integration and the connected cities and corporate consumers already sit. Prove the framework, fix bugs, get a scalable model before going wider.

## IP-protection bar (the gating concern)

Cotality slots Hauska as an AI company, which triggers an internal review by the Permissible Use Guidance Committee (PUC) for any AI-enabled data. The committee reviews on Tuesdays and approves roughly nine out of ten times when the request is detailed enough. From general counsel the two load-bearing concerns are: the data is not used to train models, and the data is not scraped in any irregular way. Michelle's added fear: data getting into the public domain because it was loaded into an AI environment where someone clicked through a user agreement, turning the data public. The committee wants architectural protection behind a firewall, and wants to know which AI environments and which versions are in use.

## Action items

Cotality, Michelle: ping the integrations team with Nick's email to extend and turn the API trial back on (it returned unauthorized after sign-up). Start the permissible-use writeup, targeting submission before Tuesday (start Monday). Hold a five-minute call with Nick to verify the writeup before submission.

Cotality, sales engineer: get from Hannah what to hit in Salesforce for the eval quote; the account is in UAT now (Brandon loaded it).

Cotality, Hannah: loop the sales engineer in for the MCP path; submit the PUC paperwork (earliest review Tuesday next week); repeat the use case back to general counsel.

Nick: send Michelle the AI-engine writeup (what it is and how it is protected), promised off the call. Re-ping the API trial once authentication is restored. Can provide a data map of the Cotality coverage wanted. The deliverable is filed at [`2026-06-11_hauska_ai_engine_and_protection_for_cotality.md`](2026-06-11_hauska_ai_engine_and_protection_for_cotality.md).

## State and next gate

Two parallel tracks. API trial is near-immediate (dev-portal self-serve, 30 days, ~100 calls/day) and only blocked on Cotality re-authorizing the existing sign-up. MCP trial is gated on the PUC approval, which is gated on the permissible-use writeup, which Michelle drives off Nick's AI-engine writeup plus this transcript plus the email Nick already sent. Earliest PUC review is Tuesday next week. The credential-activation thread (the three demo apps and the `api1.cotality.com` token host) is the separate technical unblock tracked in the Cotality OAuth notes; resolved per vendor that the Property app is active and the token host is `api1.cotality.com`.

## Cross-references

- [`2026-06-06_cotality_puc_data_protection_one_pager.md`](2026-06-06_cotality_puc_data_protection_one_pager.md) — the prior outbound attestation for the same PUC, drafted off the Gene call; the new writeup is the tightened, send-ready successor scoped to Michelle's ask.
- [`2026-06-06_cotality_api_documentation_comet.md`](2026-06-06_cotality_api_documentation_comet.md) — API/MCP documentation capture.
- [`71_pipeline.md`](../../71_pipeline.md) — funnel state.
