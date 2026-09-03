---
decision_id: 2026-09-03_p90_engine_pdf_honesty_customer_done
date: 2026-09-03
owner: Nick (go-ahead), planner (execution)
status: active
related_canonical:
  - _inbox/2026-08-28_p90_engine_pdf_WDLL.md
  - _inbox/2026-09-03_p90-engine-honesty_close.json
  - _inbox/2026-09-03_p90-engine-honesty_cp1.json
  - _inbox/2026-09-03_p90-engine-honesty_cp2.json
  - _decisions/2026-09-03_p89_leftover_fixed_gate_cleared.md
  - _dispatches/2026-09-03_p90-engine-honesty_dispatch.md
---

## Decision

P-90 (engine PDF honesty: X-ray and Flood & Drainage) is CUSTOMER-DONE. All 9 acceptance items graded MET on live PDF bytes from the currently-serving `hauska-engine-api` revision, for two real parcels plus a flood-drainage report.

## Context

Approved 2026-09-03, gated on P-89 (cleared earlier the same session per `_decisions/2026-09-03_p89_leftover_fixed_gate_cleared.md`). The operator's instruction "yes do what you need to to get it done" was taken as authorization for the planner to execute the full dispatch end to end — implement, deploy, and live-grade — rather than only compile a dispatch for a separate lane, consistent with the standing CANON-PREAMBLE line "DEPLOYS ARE PLANNER-OWNED."

## What was done

Four code changes landed in `hauska-engine` (PR #379, merge `c379c8f`): the property dossier now appends exactly one site-plan sheet instead of three-plus; a dead, unconditional `CAPTURED` chip stub on the aerial sheet header was removed; a caller-forwarded `liveViewUrl` now prints verbatim on both the X-ray and Flood & Drainage PDFs when supplied; and the engine's own `GET /dossier-export/download` now refuses a present-but-hollow stored artifact instead of streaming it, closing the same class of defect fixed on the MCP side earlier this session. Three items (verdict packet, address title, envelope refuse) needed no engine code change — confirmed already correct by code read and then verified live rather than assumed. Deployed via `cloudbuild.engine-api.yaml` from a clean post-merge checkout, canary-tagged and live-verified before promoting to 100% production traffic (revision `hauska-engine-api-00178-xez`), preserving the service's full 22-variable env/secret configuration unchanged. Full detail, every command, and the live-probe artifact are in `_inbox/2026-09-03_p90-engine-honesty_close.json`.

## Reasoning

The dispatch's own "done looks like" and item 9 (violation suite) require grading on live PDF bytes, never a merged PR — the same discipline this thread applied to the P-89 leftover. Each of the four code-change items was proven wrong before the fix (either by direct code read showing an unconditional or unwired defect, or, for item 7, an explicit before/after live probe on the same parcel), and each was then re-verified live after deploy, including a final re-check on the production base URL after traffic promotion, not only on the pre-promotion canary.

## Reversal criteria

Revisit if a future live probe finds any of the nine items regressed on a later serving revision, or if the operator judges the item-8 evidence (cited from a 2026-08-30 record rather than freshly re-derived this session, since the fix lives in hauska-map, out of this lane's repo) insufficient and wants a fresh live re-derivation.

## Dependencies

None outstanding for P-90 itself. Out-of-scope items named in the dispatch (Hauska MCP code / P-115, PE viewer rebuild, W8 Site Constraints, Stripe, Feasibility/Comparison generate, P-32 assembler, Valuation, Factory, P-114) are unaffected and remain separately tracked.

## Counterparties

Internal: Nick (approval and go-ahead), property seat (this lane, `hauska-engine`), substrate seat (P-89 leftover, fixed earlier the same session), hauska-map maintainers (item 8's own already-merged fix, unowned by this lane).
