---
decision_id: 2026-09-03_p90_approved_gate_still_open
date: 2026-09-03
owner: Nick
status: superseded
superseded_by: _decisions/2026-09-03_p89_leftover_fixed_gate_cleared.md
supersession_note: The reversal criteria named below ("substrate-owned leftover lands and is itself live-verified on the serving revision") were met the same day. Fixed, merged (PR #80, hauska-mcp-server), deployed, and live-verified on the serving revision per _inbox/2026-09-03_p89_leftover_fix_close.json, on operator instruction "yes do what you need to to get it done." Mechanism and reasoning sections stand as the historical record of why P-90 did not start immediately on approval.
related_canonical:
  - _inbox/2026-08-28_p90_engine_pdf_WDLL.md
  - _inbox/2026-09-03_p89_gate_reverify_close.json
  - _inbox/2026-08-28_p89_serving_close.json
  - _decisions/2026-08-27_report_sku_feasibility_comparison_brief.md
  - _inbox/2026-09-03_p114_report_brand_polish_WDLL.md
---

## Decision

P-90 (engine PDF honesty: X-ray and Flood & Drainage) is approved. It was not started this session, because its own item 1 gate — P-89 customer-done, a live refuse on the serving Hauska MCP revision — was re-verified and found not satisfied.

## Context

The WDLL sat draft with approval pending since 2026-08-28, unopened across roughly 310 doc_repo commits. The operator approved it 2026-09-03 and asked for it to be dispatched and completed. Per P-90's own text ("Starts only after P-89 customer-done") and the standing instruction from this thread's opening ("P-90 item 1 is a GATE, not a formality... Run it by violation before anything else"), the planner ran that gate check before compiling any dispatch.

## What the re-verification found

Confirmed live and via code read (`_inbox/2026-09-03_p89_gate_reverify_close.json`): the currently serving Hauska MCP revision (`hauska-mcp-server-00055-8pz`, built from git commit `40e48d4`, confirmed the tip of `main` and confirmed to include the P-89 merge `1ae9f287` in its ancestry) correctly refuses on missing-verdict, placeholder-verdict, and null-brief. It does not correctly refuse a stored-hollow download when the artifact record is entirely absent — `isStoredDossierArtifactHollow(undefined)` still returns `false` (not hollow) rather than failing closed, unchanged since the same defect was found on 2026-08-28. The customer-visible failure mode is an inconsistent 404 rather than a fabricated success, but it is a real, unfixed gap against P-90's own named gate.

## Reasoning

P-90's gate condition is binary as written — it does not carve out a severity exception for a narrow defect. Starting P-90 (hauska-engine, property seat) against an unmet gate would mean the ordering argument this whole thread carried — fix the source sheets honestly before anything composes them into something bigger — rests on a premise that was never actually true. The fix for the open gate is small, well-understood, and lives in a different repo and seat (substrate, `hauska-mcp-server`) than P-90 itself (property, `hauska-engine`), so it does not block P-90's own worktree or dispatch from being prepared in parallel — it blocks P-90's own item 1 from being graded MET, and P-90's WDLL treats that as a start condition, not a mid-card check.

## Reversal criteria

Revisit once the substrate-owned leftover (`isStoredDossierArtifactHollow` fail-closed fix) lands and is itself live-verified on the serving revision — not merged, per the same discipline this gate was just re-applied under. Alternatively, revisit if the operator explicitly rules the narrow defect an acceptable residual risk and wants P-90 started against the open gate anyway; that has not been asked for here.

## Dependencies

P-90 (property seat, `hauska-engine`) dispatch is prepared and ready to compile once the gate clears. P-114 (report brand + formatting polish, also property seat, also touching `render.ts`'s header block) remains a separate, ungated decision — its own accent-color and status-color questions are unaffected by this finding.

## Counterparties

Internal: Nick (approval), substrate seat (owns the leftover fix), property seat (owns P-90 and P-114 once dispatched).
