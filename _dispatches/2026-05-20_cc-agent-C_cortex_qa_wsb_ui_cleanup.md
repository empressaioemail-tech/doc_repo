---
id: 2026-05-20_cc-agent-C_cortex_qa_wsb_ui_cleanup
title: Dispatch — cc-agent-C cortex QA WS-B (UI and UX cleanup batch)
date: 2026-05-20
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [43_cortex_qa_backlog, 2026-05-20_cc-agent-C_cortex_qa_wsa_audit, 40_design_accelerator, CLAUDE.md]
---

# WS-B — cc-agent-C dispatch (UI and UX cleanup batch)

You are cc-agent-C continuing on the `legacy-design-tools` repo. This dispatch handles WS-B of the Cortex QA backlog: a batch of low-risk UI and UX cleanup items surfaced during the post-cutover QA verification window. WS-B covers five QA items: QA-01, QA-02, QA-11 (page-glitch portion only), QA-12, and QA-14. See [`43_cortex_qa_backlog.md`](../43_cortex_qa_backlog.md) for the full backlog and workstream map.

## Why this exists

The post-cutover QA pass surfaced a set of UI rough edges that are independent of each other and independent of the WS-A data-integrity work. They are batched here because they are all low-risk frontend cleanup in the same repo and the same agent owns them. The EngagementDetail split landed in legacy-design-tools PR #43; WS-B is post-split follow-on UI work, not a re-open of that dispatch.

## Read first

In order:

1. [`CLAUDE.md`](../CLAUDE.md) — operating instructions.
2. [`43_cortex_qa_backlog.md`](../43_cortex_qa_backlog.md) — backlog and workstream map.
3. [`40_design_accelerator.md`](../40_design_accelerator.md) — Cortex production target.

## Sequencing note

cc-agent-C is a single Cursor terminal. This dispatch is the next sequenced dispatch after [`2026-05-20_cc-agent-C_cortex_qa_wsa_audit.md`](2026-05-20_cc-agent-C_cortex_qa_wsa_audit.md) (WS-A). Do not interleave with WS-A. WSB.1 and WSB.3 touch engagement-detail tab components that WS-A's WSA.4 also touches, so running WS-A to completion first avoids overlap. Within this dispatch the five sub-tasks are independent and can be done in any order.

## Scope

### WSB.1 — Engagement-detail tab reorganization (QA-01)

Context. The engagement-detail view carries ten tabs: Snapshots, Sheets, Site, Site context, Submissions, Findings, Response tasks, Deliverable letters, Detail callouts, Product specs. The tab row is crowded. Separately, the building model 3D view is currently a "View in 3D" button on the Sheets tab; the operator wants it promoted to its own tab.

Work.

- Add a dedicated tab for the building model 3D view. The "View in 3D" button becomes that tab; keeping or removing the button is cc-agent-C's discretion, the tab is the requirement.
- Reduce tab-row crowding. Recommended lighter-touch approach: keep flat tabs but group them into visual sections (model and source, site, review outputs, specs, submissions) with separators, or move the least-used tabs into an overflow menu. A heavier merge into roughly five grouped tabs with sub-navigation is acceptable if it reads cleaner, but is not required by this dispatch.
- Build on the EngagementDetail split already merged (legacy-design-tools PR #43). Do not regress that structure.
- Keep the tab structure config easy to change; the operator reviews the final grouping.

Test. All ten existing tabs plus the new 3D tab are reachable and render. Deep-link `?tab=` params still resolve. The new tab structure is surfaced in the session summary for operator review.

### WSB.2 — Project archive and sidebar collapse (QA-02)

Context. Projects cannot be archived, so the projects list grows unbounded. The left sidebar sections (Workspace, Projects, Dev) do not expand or collapse.

Work.

- Add an archive action to projects (archive and unarchive), an archived state, and a list filter so archived projects are hidden by default with a show-archived toggle. Match the existing "Show only in-pilot" filter pattern on the Projects page.
- Make the left sidebar sections collapsible (Workspace, Projects, Dev), with collapse state persisted per the app's existing UI-state persistence pattern.

Test. A project can be archived, disappears from the default list, reappears under show-archived, and can be unarchived. Sidebar sections collapse and expand and the state persists across reload.

### WSB.3 — Snapshots tab cleanup (QA-12)

Context. The Snapshots tab shows a large raw JSON block prominently and the 3D model sits low on the page. The tab reads as a data dump rather than an actionable view.

Work.

- Demote the raw JSON block: collapsed by default, or behind a developer or details toggle. It should not be the default-visible content.
- Move the 3D model higher on the page.
- Lead the tab with the snapshot summary stats and the model, with raw JSON available but secondary.

Test. The Snapshots tab loads with the model and summary visible first and raw JSON collapsed.

### WSB.4 — Deliverable-letters page fix (QA-11, page-glitch portion)

Context. The Deliverable-letters page is glitchy and unusable; the "New letter" form renders incorrectly (overlapping or clipped layout). This dispatch covers only the rendering and usability fix. The separate request to push code-review findings into a response task and from chat is WS-C and out of scope here.

Work.

- Diagnose the rendering glitch on the Deliverable-letters page and the New-letter form.
- Fix so the page and form are usable: a letter can be created and listed.

Test. The Deliverable-letters page renders cleanly and a new letter can be created end to end.

### WSB.5 — Header alert bell (QA-14)

Context. The notification bell in the header does nothing.

Work.

- Determine whether a notifications backend or data source exists.
- If it exists, wire the bell to it (open a notifications panel, show unread state).
- If no notifications system exists, do not leave a dead control. Hide or disable the bell and flag in the session summary that notifications are unbuilt, so the planner can scope a notifications feature separately.

Test. The bell either opens a working notifications panel, or is removed from the header pending a notifications feature.

## Dependencies

- Sequenced after WS-A in the same cc-agent-C terminal. Do not interleave.
- The five sub-tasks are independent of each other.

## Hand-off

Session summary documents all five sub-tasks with fixed or flagged state. WSB.1 surfaces the new tab structure for operator review. WSB.5 flags whether a notifications feature needs scoping. Any item that turns out larger than a cleanup, notably WSB.1 if a heavier tab merge is chosen, is noted for planner re-scoping.
