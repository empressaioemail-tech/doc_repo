---
id: 2026-05-21_cc-agent-C_qa22_site_context
title: Dispatch — cc-agent-C QA-22 Part 1 site-context layer reliability
date: 2026-05-21
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [43_cortex_qa_backlog, 11_roadmap, 20_agent_operating_rules, CLAUDE.md]
---

# cc-agent-C dispatch — QA-22 Part 1 site-context layer reliability

You are cc-agent-C owning the `legacy-design-tools` repo. This dispatch is QA-22 Part 1: the site-context layers still fail. It is a focused engineering session toward the M-CortexQA milestone.

## Activation gate

This dispatch fires after the full Cortex QA close-out is merged. QA-16 (#59), QA-19 (#61), and QA-23 (#60) are merged; QA-18 lands once the QA-18 PR #62 conflict-resolution dispatch ([`2026-05-21_cc-agent-C_qa18_conflict_resolution.md`](2026-05-21_cc-agent-C_qa18_conflict_resolution.md)) completes. Also gated on the QA-04 operator-supervised canary resolving. Until then `legacy-design-tools` carries two concurrent agents; do not start this in parallel. Sequence it ahead of the codex-reviewer-qa scaffold ([`2026-05-21_cc-agent-C_codex_reviewer_qa_scaffold.md`](2026-05-21_cc-agent-C_codex_reviewer_qa_scaffold.md)): QA-22 is a user-facing reliability bug, the scaffold is net-new feature work, so the bug goes first.

## Why this exists

QA-22 in [`43_cortex_qa_backlog.md`](../43_cortex_qa_backlog.md): the site-context layers still fail after the WSA.4 diagnosis. WSA.4 established that the EPA, FCC, and Grand County "cancelled by the caller" failures are the 15-second server-side adapter-runner timeout firing on slow upstreams, not a wiring bug. The ugrc:dem ArcGIS 400 was a separate constructed-URL bug, already fixed in PR #55. The diagnosis is done; the fix is not.

## Scope — QA-22 Part 1 only

Make the site-context layers reliable. The known failure mode is the adapter-runner's fixed 15-second timeout firing on slow upstreams and surfacing as "cancelled by the caller," which also leaves the site 3D view rendering nothing.

Diagnose the current adapter-runner behavior, then engineer the fix. Candidate directions, not prescriptive: isolate each layer fetch so one slow or failed layer does not cancel the others; tune or make configurable the per-layer timeout; cache successful layer results so repeat views do not re-hit slow upstreams; degrade gracefully so the layers that loaded render while slow ones are marked still-loading or unavailable rather than failing the whole set. Pick the approach the diagnosis supports.

Success criterion: the site-context layers (EPA EJScreen, FCC broadband, Grand County data) and the site 3D view render reliably on a real engagement, and a slow upstream degrades that one layer gracefully rather than failing the layer set or the 3D render.

## Out of scope — QA-22 Part 2

Installing the site-context capability into Bastrop's SmartCity OS dashboard. That is a separate cross-product decision tied to M-PropIntel, carrying its own catalog-thesis-check and pre-mortem per [`11_roadmap.md`](../11_roadmap.md) M-PropIntel and [`43_cortex_qa_backlog.md`](../43_cortex_qa_backlog.md) WS-F. Do not start it here.

## Run posture

Operator-supervised, not maximum-autonomy. Open a PR for review. Do not self-deploy cortex-api.

## Workspace ownership

cc-agent-C owns the `legacy-design-tools` working tree. Branch under `qa-22/*`. Cross-repo work uses `git worktree add` from a separate clone.

## Reporting

At every session break-point, write your session summary and any decision-relevant finding to `P:\doc_repo\_inbox\` as `<date>_legacy-design-tools_cc-agent-C_<topic>.md`. The `_inbox/` write is the one explicitly permitted cross-repo write per HR-11 in [`20_agent_operating_rules.md`](../20_agent_operating_rules.md); it supersedes any older "no cross-repo doc writes" instruction. Do not draft the summary into `legacy-design-tools/_research/`. Do not commit to the doc repo. Keep committing the original in your own repo.
