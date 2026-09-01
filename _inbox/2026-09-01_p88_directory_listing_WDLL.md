---
id: 2026-09-01_p88_directory_listing_WDLL
title: WDLL — P-88: the vendor directory listing, the only way Claude Sync can find anyone
date: 2026-09-01
last_updated: 2026-09-01
status: open
applies_to: legacy-design-tools (artifacts/smartsite-mcp), smartsite.cloud
plan_row: P-88
depends_on: 90_operations/OPS-16_texas_market_plan_of_record.md A-035, _decisions/2026-08-26_smartsite_product_mcp_and_ai_connector.md, _smartsite_gtm/06_consolidated_roadmap.md Wave 4
operator_go: pending
snapshot: planner 2026-09-01; P-87 shipped and the connector is live
owner: unassigned
---

# P-88 the vendor directory listing

Date: 2026-09-01  Status: open, unassigned

## Why this is worth a row when it looks like marketing

Claude Sync is the only genuinely differentiated channel Smart Site has. Every other channel in the go-to-market plan is one a competitor can also buy. Today the connector is a reason to buy and a reason to stay, and it is not a way to be found, because discovery of an MCP connector happens through the vendor directory and Smart Site is not in one.

That makes this the highest-leverage unassigned item on the board. It is also the cheapest of the Wave 4 items, and unlike the rest of that wave it does not wait on revenue.

## The precondition that already cleared

A-035 ruled that vendor directory listings happen **only after a live Claude Connect probe**. That gate existed because listing a connector that does not connect is worse than not listing. P-87 has since shipped and been walked live, so the probe condition is satisfiable now rather than hypothetical. Item 1 below re-proves it rather than citing the ruling, because the ruling is a date and the connector is a running service.

## Done looks like

A person who has never heard of Smart Site can find it from inside a directory listing, connect it, and reach a first useful answer without reading anything we wrote about ourselves. The listing describes only capabilities the connector actually has today.

## Acceptance items

1. **Re-prove the connect path live, from a cold client.** A connection made from a client that has never held our credentials, reaching a first successful tool call. Report the tool, the parcel, and the response. A connection made from a warmed client or an already-authorised session does not satisfy this. | check: a dated artifact carrying the cold-connect transcript | grade: [ ]

2. **The listing claims only what the connector serves.** Every capability sentence in the listing maps to a tool that is live and reachable at the tier the listing implies. The three not-ready tools stay out, as they already do in the capability disclosure. A listing that names a capability the product cannot deliver is the same defect class as the marketing card that promised screens. | check: a table mapping each listing claim to a live tool and its gate | grade: [ ]

3. **Tier honesty in the listing.** The connector is available at every rung including Free and mirrors the workbench gates rather than carrying its own, per the connector ruling. The listing must not imply the connector is a paid feature, and must not imply everything inside it is free. Where a capability needs a paid rung, the listing says so in the same words the product uses. | check: the copy read against `_smartsite_masters/` positioning, which wins any conflict | grade: [ ]

4. **The claims come from the masters, never from this card.** `_smartsite_masters/` governs what may be said. Any sentence in the listing that is not traceable to a master gets removed or routed for a ruling, not written fresh here. | check: per-sentence provenance | grade: [ ]

5. **Submitted, and the submission recorded.** Directory, submission date, the exact text submitted, and the review state. If a directory rejects or holds the listing, that is the finding and it gets recorded rather than retried silently. | check: the close carries the submitted text verbatim and the response | grade: [ ]

6. **A check that fails when the listing goes stale.** The listing will drift from the tool set the first time a tool is added, renamed, or gated. Name the mechanism that catches that, and if the honest answer is that no mechanism exists, say so in the close rather than implying the listing maintains itself. A listing nobody re-reads is a claim nobody re-checks. | check: name the executor, the trigger, and what fails | grade: [ ]

## Explicitly not this card

Do not build a GPT store listing, SEO parcel pages, or a Zapier integration; A-035 named all three as not carded. Do not add or rename any MCP tool to make the listing read better. Do not change the connector's gates; the connector inherits the tier and does not carry its own. Do not write new positioning claims.

## Leave behind

Declared at close per the contract, `none` being a valid answer.
