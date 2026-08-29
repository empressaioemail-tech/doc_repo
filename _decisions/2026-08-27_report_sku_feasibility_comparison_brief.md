---
decision_id: 2026-08-27_report_sku_feasibility_comparison_brief
date: 2026-08-27
owner: Nick
status: active
related_canonical:
  - Master Collateral Folder/2026-08-25_edw_gtm_qa/01_positioning.md
  - Master Collateral Folder/2026-08-25_edw_gtm_qa/04_faq.md
  - Master Collateral Folder/2026-08-25_edw_gtm_qa/05_glossary.md
  - _smartsite_masters/00_README.md
  - _smartsite_masters/01_smart_site_positioning.md
  - _inbox/2026-08-27_smartsite_qa_program_WDLL.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md
---

## Decision

The locked Smart Site report menu is X-ray, Flood and Drainage, Feasibility, and Comparison. Comparison is also a tool (the live Compare dock). Brief is a tool (the inspect dock). Records stays a tool (P-85). Site plan and terrain stay exports.

## Context

Inbound QA found the live Reports picker still named Feasibility, Comparison, Brief, and Records while positioning said only X-ray and Flood were reports. A SKU here is a named thing a customer can generate or buy, not a Stripe price id. Nick ruled on 2026-08-27: Feasibility is a report; Comparison is a report and a tool; Brief is a tool. Records was already a P-85 verb and is not reopened as a report.

## Structural commitment check

Sell reasoning, not data: aligned. Each report is a composed answer, not a dump of rows.
Confidence is earned: aligned. Hollow X-ray refuse (W4.P0 / P-89) stays; no new report may ship as chips.
Cost per jurisdiction: not triggered.
Dual interface / MCP-first: partial. Feasibility and Comparison must eventually have Hauska MCP tools when their generate paths are built. This decision does not open those paths. P-32 stays SCOPED, do not start.

## Reasoning

X-ray and Flood remain the live generate reports on smartsite.cloud. Feasibility and Comparison join the locked menu so agents stop treating those names as extras to flag or delete. Comparison already has a live tool surface (W5 Compare). Brief is the property dock, not a downloadable report. Records is the courthouse request verb. Site plan and terrain stay exports so the menu does not grow a fifth generate class by costume. Pricing for Feasibility and Comparison is not set here. They are not live generate paths today. Do not pitch them as live until a named card ships them.

## Reversal criteria

Revisit if Nick retracts any of the four names, if Feasibility is priced as an export rather than a report, or if Comparison-the-report is dropped because the Compare dock is enough.

## Dependencies

P-32 report engine stays do-not-start. Feasibility assembler remains parked from P-60. P-89 is the Hauska MCP X-ray fail-closed card. P-90 is the engine PDF honesty card. W8 stays blocked on W4.P1. Collateral 01/04/05 and the matching masters refresh with this decision.

## Counterparties

Internal: Nick, Val (GTM register), substrate seat (P-89), property seat (P-90, future generate).
