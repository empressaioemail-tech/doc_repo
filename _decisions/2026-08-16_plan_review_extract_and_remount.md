---
decision_id: 2026-08-16_plan_review_extract_and_remount
date: 2026-08-16
owner: nick
status: active
related_canonical: [80_adrs/adr_023_cortex_reporting_repo_designation, 80_adrs/adr_008_engine_factor_out, _decisions/2026-08-15_capability_mount_composition, _decisions/2026-08-15_smart_files_independent_module, 48_cortex_reporting_plan_review_spec, 90_operations/OPS-17_govtech_stack_plan_of_record, _inbox/2026-08-16_icc_demo_program_WDLL, _inbox/2026-08-16_plan_review_cortex_callable_inventory]
---

# Decision

Plan-review functions that currently live on cortex-api are pulled into the `plan-review` product (own repo, Neon, Cloud Run). Cortex then remounts them: `/api/plan-review` on cortex-api becomes a proxy to that service, not a second implementation. Existing callable BFF routes and the tile registry are elevated. They are not rewritten from empty stubs. Calibration is left as-is (partial tile, separate topic).

## Context

Lane A already proved the pattern on Smart Files: isolate the product, then other surfaces mount it. Lane C was still serving from `legacy-design-tools/artifacts/api-server/src/routes/planReviewBff.ts` mounted at `/api/plan-review`. Operator 2026-08-16: elevate what already exists, pull it into plan-review as a whole, remount on cortex. That is stronger than housing-only isolation (A-025). It is the same mount-composition decision as Smart Files, applied to Codex plan review.

This is not a git subtree of LDT. Contract and behavior copy/adapt. Cotality-shaped intake/geocode is stripped on the way. Sheet bytes go to Smart Files, not cortex object storage. Calibration scoring is not rebuilt on this card.

## Structural commitment check

- Sell reasoning, not data: aligned. Findings, letter, and briefing keep atom IDs, citations, confidence objects. Verbatim ICC body stays forbidden.
- Confidence is earned, not asserted: partial, named. The calibration tile is already `status: partial` in `TILE_CAPABILITIES`. Operator ruled leave it. Do not present its numbers as earned.
- Dual interface (28): aligned. UI on `plan-review-app` plus existing `codex_*` MCP tools retargeted at the same Cloud Run. One Hauska MCP server.
- Brand (ADR-008): aligned. Codex / plan review is an Empressa product. Cortex remains the reporting compose layer and becomes a consumer mount, not the product home. Hauska stays engine, contract, MCP gate.
- Catalog thesis: aligned as product isolation plus remount. Yellow only if we 404 `/api/plan-review` on cortex the way files were 404'd, which would break CC, PE tiles, cortex-client, and MCP legacy-client that already call that path.
- MCP v1 (51): aligned. Remount plus Codex retarget. No second MCP server.

## Reasoning

ADR-023 named LDT as the cortex-reporting function package because that is where the BFF, reviewer QA, and findings engine already were. The callable surface is real: `planReviewBff.ts` plus `@empressaio/cortex-client` methods (queue, intake, engagements, submissions, findings, compliance-run, reports, sheets, letter, documents, annotations, spaces, admin/functions, tile-registry). MCP `codex_finding_generation`, `codex_findings_fetch`, `codex_override_write`, `codex_briefing_fetch`, `codex_snapshot_ingest` already call it through `legacy-client.ts`.

Rewriting F1-F7 as empty 501s would discard that surface and the clients pointed at it. Smart Files unmounted with a 404 because files did not belong on cortex-prod and no durable client contract depended on `/api/smart-files` staying. Plan review is the opposite: Command Center already falls back to plan-review, cortex-tiles POST to `/plan-review/engagements/:id/reports/:type/run`, and the Codex gate is those five tools. Pull the implementation into `empressaioemail-tech/plan-review`. Keep the cortex URL as a mount so existing callers do not fork.

Calibration stays a later card. The tile says the backend is live via other surfaces and the workspace tile UI is a stub. Rebuilding it here would smuggle an unearned-confidence rewrite into an extract.

## Reversal criteria

Reverse the remount (leave functions only on cortex-api) if a named consumer cannot attach plan-review Cloud Run and that blocker is accepted in writing. Reverse "elevate, do not rewrite" if live probes show the BFF cannot satisfy spec 48 F1-F7 without a Cotality path and a replacement is cheaper than a strip. Do not 404 cortex `/api/plan-review` unless every caller (CC, PE, MCP, cortex-tiles, codex-reviewer-qa) has been retargeted and graded. Do not drop cortex-prod engagement/findings tables during L26.

## Dependencies

Depends on G-58/G-59 (files mount for sheets). Depends on `_decisions/2026-08-15_capability_mount_composition.md`. Amends ADR-023 on serving home only; the ADR body is not edited. OPS-17 A-026. G-60 WDLL A-006. Inventory `_inbox/2026-08-16_plan_review_cortex_callable_inventory.md`. Cortex proxy PR waits until Cloud Run `GET /` is 200 and the elevated routes are live. Dirty LDT is not the remount vehicle.

## Counterparties

Internal: operator, G-60 planner. Consumers after remount: cortex-api, Command Center, Property Explorer / SmartSite tiles, Hauska MCP Codex gate, `artifacts/codex-reviewer-qa`. Not SmartCity OS (still no-touch). Not G-50 SaaS.
