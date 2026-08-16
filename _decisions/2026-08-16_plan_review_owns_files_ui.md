---
decision_id: 2026-08-16_plan_review_owns_files_ui
date: 2026-08-16
owner: nick
status: active
related_canonical: [_decisions/2026-08-16_plan_review_is_smart_files_first_consumer, _inbox/2026-08-16_icc_demo_program_WDLL, 90_operations/OPS-17_govtech_stack_plan_of_record]
---

# Decision

Plan review owns the files UI, including the applicant view. Smart Files is the backend file-management store, not the product surface for this flow. `smart-files-app` stays the G-59 QA UI. Planner must not seed more objects into the files store for this demo.

## Context

A-027 still holds: plan-review documents are Smart Files file-shaped atoms, not a second blob table on plan-review Neon. A-009/A-030 sent the submitter to `smart-files-app/#share=`. Operator 2026-08-16: that function lives as part of plan review; load a file in plan review; Smart Files is the backend; plan review has its own UI; there is an applicant view; we should not have written to Smart Files yet.

## Structural commitment check

- Sell reasoning, not data: aligned. Plan-review still cites atoms. Files are CIDs, not ICC bodies.
- Tenant sovereignty: aligned. Rooms stay tenant-private on the files store.
- Dual interface: aligned. Plan-review HTTP is the human door. MCP Smart Files tools remain the agent door against the same store.
- Brand: aligned. Smart Files is the Empressa files product and store. Codex plan review is the review product that mounts it. The QA app is not the review data room.
- Catalog thesis: aligned. Do not merge stores. Do not send the applicant to the files QA app.

## Reasoning

A reviewer loading a sheet, and an architect/homeowner/contractor opening that room, are plan-review jobs. If the share URL is `smart-files-app`, plan review is not the product. If the planner keeps POSTing probe files, the files store fills with demo residue before the UI contract is right. Existing `icc-demo` folders and `site-plan-sheet.txt` / `mcp-g60-probe.txt` are premature writes. Leave them in place (no silent DELETE). Do not add more from the planner. Operator upload through the plan-review UI is the first legitimate write.

## Reversal criteria

Reverse only if the operator names `smart-files-app` as the customer data-room for plan review, or if a named document type cannot be a Smart Files atom (A-027 reversal). Do not put file bytes on plan-review Neon to avoid the files service.

## Dependencies

Amends A-009/A-030 UX. Does not reverse A-027 (store). OPS-17 A-031. G-60 WDLL A-010. Applicant view is a token room on plan-review-app, not SmartCity MyGov (G-52) and not a full applicant portal.

## Counterparties

Internal: operator, G-60 planner. Product UI: plan-review. File store: smart-files. QA UI only: smart-files-app.
