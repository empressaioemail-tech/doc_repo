---
id: 2026-09-01_p105_share_handoff_WDLL
title: WDLL — P-105: the share becomes a doorway, for a person and for a model
date: 2026-09-01
last_updated: 2026-09-01
status: open
applies_to: hauska-map (property-explorer share plane), legacy-design-tools (smartsite-mcp connector copy)
plan_row: P-105
depends_on: _decisions/2026-08-31_claude_sync_card_and_connected_signal.md, _sessions/2026-08-30_p91_v3_mcp_wave_claude_code.md, _smartsite_gtm/07_rails_by_persona_pricing_input.md
operator_go: 2026-09-01
snapshot: planner probed the live share plane 2026-09-01 and read hauska-map + legacy-design-tools origin/main
owner: property seat (lane planner); planner verifies and commits doc_repo
---

# P-105 the share handoff

Date: 2026-09-01  Status: open

## Why this row exists

A share is the highest-intent moment the product gets. A person has been handed a specific parcel, by someone they trust, inside their AI, and they care about it right now. Today that moment ends in a static document with a relative link that a foreign model cannot even resolve.

**The bridge is already built on the wrong side of the product.** Claude Sync (P-87) turns a parcel into a Claude conversation that calls `get_smart_site`, which is one of the three tools in `APP_HOST_TOOLS` that mounts the Smart Site panel through `appMetaFor`. That path works and ships. It lives on the workbench, which is the **sharer**. The **recipient**, who is the one with fresh intent, gets nothing.

The design was already written on 2026-08-30 and the lane was never started: carry the address so the chat reads naturally, the parcel node id so the tool call is exact, and the share URL as a fallback, so a user with the connector gets the full panel and a user without it still gets an answer from the fetched share link.

## Established before you start, do not re-derive

The share plane serves three formats off one instrument, verified live 2026-09-01 against a real grant: `/s/{grantId}` returns HTML on `text/html`, JSON on `application/json`, and Markdown on `text/markdown` or `?format=agent`. A bogus grant returns 403 before negotiating, which is the correct fail-closed order. `/share#token` is human-only by construction because the token sits in the URL hash and never reaches the server.

`smartsite.cloud/llms.txt` is live and documents that contract.

`claudeSync.ts` in `apps/property-explorer/src/lib/` is a pure, tested prompt builder. It carries the parcel node id as the operative half, omits an unresolved label rather than guessing, guards at 14,000 characters, and puts the prompt on the clipboard before opening the chat because Anthropic documents prefill only for the `claude://` desktop scheme. **Reuse it. A second prompt builder is the defect, not the fix.**

## The distinction this card turns on

The human share and the agent share need **different** handoffs, and giving them the same one is a category error.

A person reading the HTML view can click. They get the Sync handoff exactly as the workbench does it.

A model reading the Markdown or JSON form cannot click anything, so a `claude://` link is meaningless to it. What it needs is the connector's identity, the parcel node id, and the name of the tool that opens the parcel. That is **data plus an offer**. It must never read as an instruction the model is expected to obey, because this body runs inside somebody else's model and a share that reads as commands is one screenshot away from being a story about prompt injection.

## Done looks like

A person who receives a share and has the connector reaches the live Smart Site panel for that parcel without typing a parcel id. A person without the connector still gets the full share and a truthful account of what connecting would add. A model that receives a share can state what it can see, what it cannot, why not in each case, and what its user could do about it, without inventing anything and without being told to call a tool it cannot reach.

## Acceptance items

1. **The human share carries the Sync handoff, from the existing builder.** The HTML view of `/s/{grantId}` offers the same clipboard-then-open handoff the workbench offers, built by importing `claudeSync.ts` rather than reimplementing it. A test proves the share path and the workbench path produce an identical prompt for the same parcel. | check: fail-then-pass; a second prompt builder fails this item | grade: [ ]

2. **The agent formats carry a connector offer, not a deep link and not an instruction.** Markdown and JSON name the connector, the parcel node id, and `get_smart_site`. Phrased as availability, never as a directive. No `claude://` URL appears in either format. | check: a test asserting no `claude://` in the agent bodies, plus a reviewed copy read against the injection-shape rule | grade: [ ]

3. **Every link in every format is absolute.** The live-view link is `/share?g=...` today, which a foreign model cannot resolve. Every URL in the Markdown and JSON forms is fully qualified. | check: a test asserting no relative URL in the agent bodies | grade: [ ]

4. **Absence becomes four states, each with its own next action.** Today everything unavailable says "Not verified on this share." At minimum: the sharer did not include it; we have not measured this county; it is paid-tier; it does not exist for this parcel. Each carries guidance a model can act on. The MCP app already carries `agentGuidance` on every non-present facet from the p563 work, and that vocabulary is the source rather than a new one. | check: fail-then-pass per state; a body that collapses two of them fails | grade: [ ]

5. **The duplication goes, and the developer strings with it.** Artifacts and Withholdings currently repeat four identical lines. And the body ships raw internal errors to customers, including a literal `(404)` and an instruction to "Call `refresh_parcel_dossier_export` first to build it", which tells a foreign model to invoke a tool it has no access to. | check: a test asserting no tool name and no bare HTTP status appears in a customer-facing body | grade: [ ]

6. **One line stops asserting two contradictory facts.** "Not exported by the sharer (Dossier artifact not found (404)...)" claims both that the sharer chose not to share it and that it does not exist. Pick the true one per case and say only that. | check: fail-then-pass covering both cases separately | grade: [ ]

7. **Verify by violation, both directions.** Every check above shown failing on a deliberate violation and passing on restore, with verbatim failure text. | check: the close carries both directions per item | grade: [ ]

## Two things to measure, not assume

**Our own records disagree on whether web prefill works.** `_sessions/2026-08-30_p91_v3_mcp_wave_claude_code.md` reports the `https://claude.ai/new?q=` form was tested and Claude executed the prompt. `_decisions/2026-08-31_claude_sync_card_and_connected_signal.md` records it as undocumented with web prefill reportedly removed in October 2025, and chose clipboard-first because of it. Both are ours, six days apart. Report which is true as observed, or report it unresolved. **Do not quietly adopt either.** The clipboard-first design is correct regardless, so this changes copy, not architecture.

**Whether the panel mounts when the prefilled call is the first action in a fresh conversation.** Almost certainly yes, since it is the same tool call, but nobody has watched it happen. If it cannot be observed from this lane, say unmeasured rather than implying it works.

## Explicitly not this card

Do not build a second prompt builder. Do not change the share fidelity rule, which is locked: a share carries everything the sharer stored regardless of recipient tier. Do not add or rename an MCP tool. Do not change the connector's gates; the connector is a door and inherits the tier. Do not put owner data or tenant-private research into any share body. Do not weaken the paste-logs-the-URL warning; as the instrument gets more valuable that warning gets more important, not less. Do not wire share analytics; P-100 owns the share event spine and a second writer for the same subject fails that card too.

## Leave behind

Declared at close per the contract, `none` being a valid answer.
