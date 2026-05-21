---
id: 2026-05-21_cc-agent-C_cortex_qa_close_out
title: Dispatch — cc-agent-C Cortex QA close-out (QA-16, QA-23, QA-19, QA-18)
date: 2026-05-21
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [43_cortex_qa_backlog, 11_roadmap, 44_mcp_cortex_architecture_map, 20_agent_operating_rules, CLAUDE.md]
---

# cc-agent-C dispatch — Cortex QA close-out

You are cc-agent-C owning the `legacy-design-tools` repo. This dispatch is the Cortex QA close-out toward the M-CortexQA milestone exit. It is a sequenced queue, one terminal, run in order. All items are in [`43_cortex_qa_backlog.md`](../43_cortex_qa_backlog.md).

Production `cortex-api` is on the rolled-back revision `cortex-api-00011-xut`. PRs #57 and #58 are merged but parked at 0% traffic as the canary revision `cortex-api-00014-tab`.

## Run posture

Operator-supervised, not maximum-autonomy. Open PRs for review. The canary deploy and the production traffic shift in item 1 are operator-supervised. Do not self-deploy to `cortex-api` production.

## 1. QA-16 — isolate the IFC parse (closes QA-04)

Move the `web-ifc` and `lib/ifcParser` parse off the Node main thread into a `worker_threads` worker, or a separate Cloud Run service, so a hung, trapped, or OOM parse kills only the worker and each parse gets a fresh WASM context. Fold in the robustness follow-up: wrap the unguarded `await db.*` calls in `ingestSnapshotIfc` and `lookupSnapshotForIfc` so a DB error returns the route's clean `db_error` JSON instead of an opaque HTML 500. The revision carrying PRs #57 plus #58 plus this isolation deploys as a canary; a real Revit IFC must return 201 against it; only then does traffic shift. A revision with a live, un-isolated IFC parse path must not take production traffic. Closing QA-16 closes QA-04 and gets production off the rollback revision.

## 2. QA-23 — in-app agent honesty guardrail

Before the in-app chat agent runs a code review, it checks whether the engagement's jurisdiction has real atom coverage. If it does not, the agent says so plainly and marks the output as model-knowledge-only and ungrounded; it does not present fabricated code as a confident citation. This is load-bearing on the quality-gate rule. The in-app agent recently cited fabricated "Grand County, Colorado" codes for the Pagosa Springs Daulton)CO engagement. Ship this regardless of the broader retrofit.

## 3. QA-19 — in-app chat auto-scroll

The in-app chat panel auto-scrolls to the bottom as a response streams in, suppressed only when the user has deliberately scrolled up. Low-risk frontend fix in the chat panel component.

## 4. QA-18 — client document upload

An engagement-scoped upload path for client PDFs, photos, and notes, persisted to blob storage, reusing the L2 `attached-document` atom shape already in the engine atom-registry. Wire the in-app chat agent to read the attachments so uploaded client material is referenceable. Pasting text into chat already works; this adds file upload plus persistence.

## Out of scope

QA-17 (the Cortex MCP retrofit) is a later sprint, paired with corpus depth. QA-21 and QA-22 route to dedicated strategic sessions. Do not start them here.

## Workspace ownership

cc-agent-C owns the `legacy-design-tools` working tree. Cross-repo work uses `git worktree add` from a separate clone, never another agent's working directory.

## Reporting

At every session break-point, write your session summary and any decision-relevant finding to `P:\doc_repo\_inbox\` as `<date>_legacy-design-tools_cc-agent-C_<topic>.md`. Do not commit to the doc repo or edit anything outside `_inbox/`. Keep committing the original in your own repo. This is HR-11 per [`20_agent_operating_rules.md`](../20_agent_operating_rules.md).
