---
id: 2026-05-18_51_phase_0_close_claude_code
title: Session — Substrate v1 sprint Phase 0 close (51)
date: 2026-05-18
agent: claude_code
repo: docs
session_type: planning
rolled_up: true
rolled_up_into: [51_substrate_v1_sprint, 50_hauska_mcp_server, 72_hauska_inc_operations, _decisions/2026-05-18_substrate_v1_phase_0_close, CLAUDE.md, 00_current_state]
---

## What was done

Closed Phase 0 of [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md). Sixteen consolidated decisions ratified or resolved. Twelve items adopted inline-recommended defaults from 50 and 51: BD ownership N/A under Scenario B; Cloud Run hosting; tool surface trim with `search_permit_atoms` rename and parcel path drop; Postgres-plus-GCS logging; Route A backend coupling; manual key issuance with Phase 8 auto; Postgres job table plus Cloud Run jobs orchestration; Claude vision plus Tesseract OCR; 90/100/95 quality bar; LLM-generate plus human-review-first-20 curated query authoring; human-review-gate-first-20 pre-publish; TX-first 25-city tier structure. Three binary calls landed: substrate v1 ingest budget funded from Hauska Inc. equity; `hauska.dev` registration deferred to Nick as pre-launch action; 25-city TX list approved with Tier-3 M9 slot kept "Nick to name" deferred to batch-time. Plus revenue model already resolved 2026-05-16 (Scenario B).

Session originated from operator redirect earlier this turn. ECI atomization kickoff was the original hand-off topic; the operator deferred it behind 51 so that M2-C extraction publishes `@hauska/atom-contract` before ECI Phase 3 needs it. The ECI kickoff plan stays in conversation history; the next ECI session re-derives it from [`60_eci_atomization.md`](../60_eci_atomization.md).

## What was learned

No new ground truth surfaced in canonical docs beyond what was already inline-recommended. The three binary-call answers (cost source from Hauska Inc. equity; `hauska.dev` not yet registered; M9 deferred) are operator-direct knowledge that did not previously exist in the canonical doc set; both new items now live at [`72_hauska_inc_operations.md`](../72_hauska_inc_operations.md) (Capital allocation and Domains sections).

OCR and pipeline orchestration: 51's recommendations sharpen [`49_code_ingestion_pipeline.md`](../49_code_ingestion_pipeline.md) §Open decisions which were left explicitly open. Both picks are conservative v1 defaults (Anthropic-stack consistent for OCR; simplest viable for orchestration). Reversal triggers captured in the decision record.

## What's still open

`hauska.dev` registration is a Nick action item tracked at [`72_hauska_inc_operations.md`](../72_hauska_inc_operations.md) Domains section; gates Phase 5 deploy and Phase 7 launch. M9 Tier-3 city name deferred to batch-time. Stream-level dispatch (Tracks 1A through 1D, 2A through 2D) is unblocked by this close but is itself the next session's work; cc-agent assignments pending in [`00_current_state.md`](../00_current_state.md) agent-fleet section.

Sprint dependencies external to Phase 0 (Bastrop UDC A.1 corpus load; Bump 1 atom-contract coordination; Texas IP attorney memo for non-Bastrop ingestion; Tech E&O insurance routing) remain tracked at their canonical homes and unchanged by this session.

ECI atomization kickoff deferred per operator redirect; planning content from this conversation's earlier turns is not committed and will be re-derived from [`60_eci_atomization.md`](../60_eci_atomization.md) when the ECI session runs.

## Suggested canonical doc updates

All applied this session.

- [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md): Phase 0 sixteen-item checklist flipped to resolved with per-item resolution notes; Phase 0 closure paragraph added; revision history; `last_updated` bump.
- [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md): Open decisions 2 through 7 flipped to resolved with strikethrough plus bold pattern matching the existing decision-1 resolution; header line updated to "all resolved"; revision history; `last_updated` bump.
- [`72_hauska_inc_operations.md`](../72_hauska_inc_operations.md): Capital allocation section added (Hauska Inc. equity funds substrate v1 first-30-cities ingest budget); Domains section added (`hauska.dev` open / Nick action; `mcp.hauska.dev` is the v1 MCP subdomain); revision history; `last_updated` bump.
- [`00_current_state.md`](../00_current_state.md): recent session summaries gains this session entry at top; Hauska MCP Server v1 watch-list entry updated to reflect Phase 0 closure; Bizops 70-band watch-list entry extended to mention new 72 sections; `last_updated` bump.
- [`CLAUDE.md`](../CLAUDE.md): What-is-settled gains Phase 0 closure bullet; What-is-open gains `hauska.dev` registration action item.
- [`_decisions/2026-05-18_substrate_v1_phase_0_close.md`](../_decisions/2026-05-18_substrate_v1_phase_0_close.md): combined decision record covering the umbrella Phase 0 close and the three binary calls plus pointers to 51 for the twelve ratifications.
