---
id: 2026-08-27_w4_p0_adversarial
title: Adversarial review — W4.P0 PE hollow X-ray refuse
status: filed
last_updated: 2026-08-27
---

# W4.P0 review

Branch `fix/qa-p0-xray` on `P:/tmp/hauska-map-qa-p0`. Planner reviewed the diff, not the agent narrative.

## What holds

Client and BFF both call `refuseHollowXrayExport` before `fetch` / `callMcpTool`. Missing verdict or zero brief facts returns 422 `pipeline_output_absent`. Missing notes omit the field. A label-only world fact still clears. Tests violate by requesting with no verdict and asserting fetch is never called. 34 tests passed in this worktree.

Reports dock was assembling `brief: null`, which would 422 even on a resolved parcel. Planner wired `runBriefResearch` there, same as Properties.

Placeholder sentence is now `XRAY_VERDICT_PLACEHOLDER`, bound to `VERDICT_UNRESOLVED.line` by a meaning-shaped test.

## Second mechanism rejected

A convenient passing export could have been "we still generate, just with better chips." Rejected: the write path still called MCP. The PE refuse is the one that matches WDLL item 28 for the customer click.

## What does not hold

Engine `emitPdfDossier` still chips UNAVAILABLE. MCP `refresh_parcel_dossier_export` still treats verdict/brief as optional. GET download still streams a previously stored hollow artifact. Those are property/substrate leave-behinds. Do not start P1 until the generator refuses, or accept that PE-only is a costume on any non-PE caller.

## Grade

WDLL item 28: met on the PE click path. Partial on the PDF writer. P1 not started.
