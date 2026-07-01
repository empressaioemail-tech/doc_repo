---
id: 48_cortex_reporting_plan_review_spec
title: cortex-reporting — white-label plan review surface spec
status: active
last_updated: 2026-07-01
applies_to: legacy-design-tools, cortex-reporting
owner: nick
related: [adr_023, 47_codex_plan_review, 11a_bastrop_live_roadmap, 75n_icc_code_connect_catalog, endstate_E_spine_console]
---

# cortex-reporting: white-label plan review surface spec

Analogous to `endstate_E_spine_console.md` for the command center. This document specifies what the plan review white-label interface must do, how it connects to the Hauska spine, and what it must prove before any product surface (SmartCity OS, AEC-cortex) calls its functions.

The surface lives at `legacy-design-tools/artifacts/plan-review`. The repo is the `cortex-reporting` function home per ADR-023. The build posture is function over form: no product design, white background, every surface proves a spine function.

## Pattern: what the command center established

The command center (hauska-map E1-E7) proved each spine function in isolation before product surfaces consumed it: atom browser proves atom retrieval, layer registry proves the spatial registry, parcel trace proves graph traversal, run monitor proves warming state. The plan review white-label follows the same pattern: each review function gets its own proving surface before SmartCity OS calls it.

The E6 floating map renderer is shared. cortex-reporting composes it into the plan review surfaces the same way the command center uses it.

## What is already built

The artifact at `artifacts/plan-review` already has these pages and components:

Pages: ReviewConsole, ComplianceEngine, FindingsLibrary, CodeLibrary, EngagementsList, EngagementDetail, CannedFindings, Approved, Rejected, InReview, QueueBucketPage, OutstandingRequests.

Components: AIBriefingPanel, BimModelTab, DecideModal, EngagementContextTab, KpiTile, ReviewerQueueList, ReviewerQueueTriageStrip, SheetCard, SubmissionDetailModal, DevSessionSwitcher, DisciplineBadge, PresenceChips, ReclassifySubmissionDialog.

Lib: findingsApi.ts, session.ts, useSubmissionLiveEvents.ts, findingUrl.ts.

The build task is not reconstruction. It is connection: wire these surfaces to the Hauska spine via MCP tools, add the E6 floating map, and add atom write-back for adjudicated findings.

## The seven function surfaces

### F1 — Engagement queue

Pages: EngagementsList, QueueBucketPage, OutstandingRequests.

What it proves: the cortex-reporting layer can hold a pipeline of plan review applications by stage and expose them to the operator without coupling to any product shell.

Acceptance criterion: given any number of active applications, the queue renders them bucketed by stage (Submitted, In Review, Approved, Approved with Conditions, Denied) with correct counts. Clicking through to an engagement loads F2.

### F2 — Application intake and triage

Pages: ReviewConsole, SubmissionDetailModal.

What it proves: structured intake (project type + parcel + scope description) is sufficient to initiate the applicability engine. Document upload is not required.

Acceptance criterion: given project type and parcel APN, the system maps the parcel to a jurisdiction and retrieves the applicable code corpus atoms via MCP tool call. The APN resolves via Cotality (parcel centroid) and the matching jurisdiction's atom set loads within the response SLA.

### F3 — Applicability matrix

Page: ComplianceEngine (first half: the applicable sections list).

What it proves: given a project type + parcel, the system can derive which code sections apply and make an automated determination (Pass / Fail / Uncertain / Unchecked) per section.

Acceptance criterion: at least one code section carries a system determination derived from atom-chain reasoning rather than a static rule. The determination cites the atom ID and confidence object. Uncertain and Unchecked sections are visually prominent; Pass sections are visually minimal.

MCP tools called: code corpus retrieval (applicable sections by project type + jurisdiction), atom fetch (atom chain for each section).

### F4 — Reviewer adjudication

Pages: ComplianceEngine (second half: reviewer override), DecideModal, InReview, Approved, Rejected.

What it proves: the reviewer can accept or override any system determination. The override reason is captured as an adjudication atom and is auditable.

Acceptance criterion: reviewer override (with reason text) persists as an adjudication atom with: the original system determination, the reviewer's determination, the reason text, the reviewer ID, and the timestamp. The adjudication atom's accessPolicy inherits from the code section atom it resolves against (platform-internal for ICC content). The atom is retrievable via the MCP atom fetch tool after write.

### F5 — Findings library and canned findings

Pages: FindingsLibrary, CannedFindings.

What it proves: findings accumulate as a searchable library that the reviewer can query to pull prior determinations on the same code section. Canned findings (pre-authored standard findings) are selectable as templates.

Acceptance criterion: a finding saved in one engagement is retrievable by code section in the FindingsLibrary in a subsequent engagement. Canned findings are selectable and auto-populate the finding text field in the adjudication flow.

### F6 — Code library

Page: CodeLibrary.

What it proves: the reviewer can navigate the code corpus at section granularity inside the review flow without leaving the surface.

Acceptance criterion: IBC 2018 and IPMC 2018 sections are navigable by chapter and section ID. Each section displays the canonical citation format ("2018 International Building Code Section X.X") alongside the system's analysis of that section. Verbatim section body text is not reproduced in the display (per ICC license constraint in 75n_icc_code_connect_catalog.md). Bastrop UDC sections are also navigable.

### F7 — AI briefing and atom-chain drill-through

Component: AIBriefingPanel.

What it proves: the reviewer can see the atom chain behind any system determination and trace it to the source citation.

Acceptance criterion: clicking "Show reasoning" on any determination opens the AIBriefingPanel with the full atom chain: source atom (code section), reasoning atoms (the derivation), confidence object {n, width, provenance}, source citation, and retrieval timestamp. No bare confidence scalars. The panel does not fabricate chain steps; it renders only what the atom graph returns.

## Map integration: E6 floating map

The E6 floating map renderer from hauska-map is the shared spatial primitive. It composes into the plan review surface at two points:

In F2 (application intake): on parcel resolution, the floating map centers on the parcel and renders the parcel boundary plus the active spatial overlays (zone, flood, setback, utility corridor where available).

In F3 (applicability matrix): as the reviewer steps through code sections, the floating map highlights the spatial constraint each section applies to (e.g., a drainage section lights up the relevant flood/hydrology overlay).

The E6 renderer is not rebuilt. It is imported from hauska-map as a package dependency or via a shared component extraction. The map does not navigate when the reviewer tabs through sections; it updates overlays in place.

## Atom write-back contract

All reviewer adjudications from F4 write to hauska-engine as atoms. The write contract:

```
{
  family: "adjudication",
  jurisdiction: <resolved from parcel>,
  claim_type: "plan-review.adjudication",
  valid_from: <decision timestamp>,
  confidence: { n: 1, width: 0, provenance: "reviewer" },
  accessPolicy: <inherited from the code section atom>,
  derived_ok: false,
  provenance: {
    source: "cortex-reporting.plan-review",
    engagement_id: <engagement UUID>,
    code_section_atom_id: <atom ID>,
    reviewer_id: <reviewer identity>,
    original_determination: <system determination>,
    override_reason: <text if override>
  }
}
```

The write goes to hauska-engine via the atom ingest API (not via MCP). The atom is then retrievable via MCP atom fetch.

## Acceptance criteria for the white-label surface overall

Before any product surface calls cortex-reporting plan review functions:

1. F1 through F7 each pass their individual criterion above.
2. An end-to-end review of one application (intake to decision letter) completes using live spine data, no mock data.
3. IBC and IPMC sections display with canonical citation and no verbatim reproduction.
4. Adjudication atoms write successfully to hauska-engine and are retrievable via MCP.
5. The E6 map renders the parcel and updates overlays without page navigation.
6. No bare confidence scalars anywhere in the UI (E2 reviewer checklist rule applies here).
7. The white-label surface operates without any SmartCity OS dependency (standalone dev server, no SmartCity OS session required).

## What the white-label surface does NOT do

It does not serve applicants. The applicant-facing portal is a second wave.

It does not host the Bluebeam integration (Codex 1a invited mode). That is post-Bastrop-live.

It does not have visual design, color palette, or product branding. White background, standard typography, function over form.

It does not manage SmartCity OS tenant sessions. Reviewer identity is a cortex-reporting session, separate from the SmartCity OS session model. SmartCity OS will bridge sessions in the second pass.

## SmartCity OS integration: second pass

After all seven functions pass their acceptance criteria in the white-label surface, the SmartCity OS integration is a consumer pass only:

- SmartCity OS calls the cortex-reporting plan review API to initiate an engagement from a MyGov permit record.
- The reviewer opens the cortex-reporting surface from within SmartCity OS (embedded frame or deep link).
- Adjudication atoms write from cortex-reporting to hauska-engine; SmartCity OS reads them via the atom query API.
- No plan review function logic is duplicated in SmartCity OS.

