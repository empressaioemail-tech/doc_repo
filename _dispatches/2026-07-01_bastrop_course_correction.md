---
id: 2026-07-01_bastrop_course_correction
title: Bastrop planning agent — course correction addendum
date: 2026-07-01
type: course-correction
applies_to: legacy-design-tools, cortex-reporting, codex
owner: nick
replaces_task: Task B in 2026-07-01_bastrop_planning_agent_handoff.md
---

# Bastrop planning agent — course correction addendum

This document supersedes the Task B description in the original Bastrop planning agent handoff (`_dispatches/2026-07-01_bastrop_planning_agent_handoff.md`). Paste the block below into the same agent session where the original handoff landed.

---

## PASTE START

**COURSE CORRECTION — read this before Task B.**

The original handoff directed you to build the Codex 1b plan review surface inside SmartCity OS. That direction is superseded by the following architectural decision (filed as ADR-023 and `_decisions/2026-07-01_cortex_reporting_repo_designation.md`).

### What changed

`legacy-design-tools` is now formally designated as the `cortex-reporting` repo in the architecture. It is the reporting function package and plan review engine. Product surfaces (SmartCity OS) call cortex-reporting functions; they do not host them.

The plan review surface already exists in `legacy-design-tools/artifacts/plan-review`. It has:
- ReviewConsole.tsx, ComplianceEngine.tsx, FindingsLibrary.tsx, CodeLibrary.tsx
- EngagementsList.tsx, EngagementDetail.tsx, CannedFindings.tsx
- Approved.tsx, Rejected.tsx, InReview.tsx, QueueBucketPage.tsx, OutstandingRequests.tsx
- AIBriefingPanel.tsx, ReviewerQueueList.tsx, SubmissionDetailModal.tsx, DecideModal.tsx
- findingsApi.ts, session.ts, useSubmissionLiveEvents.ts

These surfaces are partially built. The Task B job is NOT to build a new plan review surface in SmartCity OS. It is to connect the existing artifact to the Hauska spine and prove each function independently in the white-label surface first.

### Revised Task B: connect the existing cortex-reporting plan review surface to the Hauska spine

Work in `legacy-design-tools/artifacts/plan-review`.

The spec lives at `p:\doc_repo\48_cortex_reporting_plan_review_spec.md`. Read it. It defines the seven function surfaces (F1 through F7), the MCP tools each one calls, the E6 floating map integration, and the acceptance criteria.

The build work is connection and completion, not reconstruction:

**Step 1 — MCP wiring.** The ComplianceEngine and AIBriefingPanel need to call Hauska MCP server tools for code corpus retrieval and atom fetch. Wire these calls. The hauska-mcp-server exposes reporting gate tools; use them. No mock data.

**Step 2 — ICC content in CodeLibrary.** The CodeLibrary must be able to navigate IBC 2018 and IPMC 2018 sections retrieved from the engine. Display canonical citation format ("2018 International Building Code Section X.X"). Do NOT reproduce verbatim section body text. Read `75n_icc_code_connect_catalog.md` for the display rules before touching any ICC content.

**Step 3 — Atom write-back.** Adjudicated findings from the reviewer (DecideModal and ComplianceEngine overrides) write to hauska-engine as adjudication atoms. The write contract is in `48_cortex_reporting_plan_review_spec.md` under "Atom write-back contract." The accessPolicy inherits from the code section atom the finding resolves against.

**Step 4 — E6 map integration.** The hauska-map E6 floating map renderer must compose into the engagement intake and applicability matrix views. On parcel resolution, the map centers and renders the parcel boundary and active spatial overlays. It updates overlays as the reviewer steps through sections. Read the E6 spec in hauska-map for the renderer contract. Do not rebuild the map; import it.

**Step 5 — Standalone gate.** The white-label surface must run and prove all seven functions without a SmartCity OS session dependency. Run it on its own dev server. Confirm it operates without any SmartCity OS imports.

### SmartCity OS integration is second pass

After all seven functions pass their acceptance criteria in the white-label surface, SmartCity OS integration is a consumer pass only. SmartCity OS will call cortex-reporting functions via API; no plan review logic will be built inside SmartCity OS in this pass. Do not start the SmartCity OS integration in this wave.

### What to produce

Revised dispatch for cc-agent-C targeting legacy-design-tools/artifacts/plan-review (not SmartCity OS). The dispatch should reflect this scope: MCP wiring, ICC content in CodeLibrary, adjudication atom write-back, E6 map integration, standalone gate. The multi-agent wave loop pattern still applies: orchestrator owns commits and merges; implementer agents scope and self-test; adversarial reviewer checks all MCP write paths and confirms no verbatim ICC text reproduction.

### Questions this opens

1. Does the existing api-server in legacy-design-tools already have the adjudication write routes, or do those need to be added?
2. Is the E6 renderer packageable as a standalone import, or does the map integration require embedding the hauska-map shell?
3. What is the current session/auth model in artifacts/plan-review, and does it conflict with the standalone gate requirement?

Flag these to Nick before dispatching cc-agent-C.

## PASTE END

