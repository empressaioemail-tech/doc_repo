---
date: 2026-05-21
agent: cc-agent-C
repo: legacy-design-tools
session_type: engineering
rolled_up: true
rolled_up_into: [43_cortex_qa_backlog, 11_roadmap, 00_current_state]
---

# Cortex QA close-out — QA-16, QA-23, QA-19, QA-18

## What was done

All four items in the Cortex QA close-out dispatch shipped as four PRs
against `main`, one per item, none self-deployed.

| Item | PR | What shipped |
|---|---|---|
| QA-16 isolate IFC parse | #59 | IFC parse moved off the Node main thread into a one-shot `worker_threads` worker |
| QA-23 agent honesty guardrail | #60 | Agent flags ungrounded code answers for uncovered jurisdictions |
| QA-19 chat auto-scroll | #61 | Chat panel sticks to bottom while streaming, suppressed on scroll-up |
| QA-18 client document upload | #62 | Engagement-scoped PDF/photo/note upload + agent read tools |

QA-16: `parseCore.ts` / `ifcParseWorker.ts` / `workerClient.ts` run the
parse in a fresh worker per IFC. A hang is killed by a timeout via
`terminate()`; an OOM/crash is a non-zero worker exit. The api-server
event loop and `healthz` stay live either way. Also wrapped the three
unguarded `await db.*` calls the QA-04 session flagged. Verified:
typecheck + build green; a smoke test driving the built worker confirmed
the parent survives empty- and garbage-IFC runs.

QA-23: `coverageGuardrail.ts` + a `countAtomsForJurisdiction` query.
Zero atoms for a jurisdiction (the Pagosa Springs case) appends a hard
guardrail block to the system prompt; fails safe to "no coverage" if
the check errors.

QA-19 / QA-18: frontend in `ClaudeChat.tsx`. QA-18's backend reuses the
existing L2b `attached_documents` table — the operator-driven producer
C.4.2 explicitly deferred.

Testing: per-artifact `pnpm run typecheck` green; new tests pass
(8 + 4 + 3 + 18 + 5).

## What's open / flagged

QA-16 does NOT close QA-04 by merging #59. Per the dispatch, the canary
deploy + traffic shift are operator-supervised: deploy the revision
carrying PRs #57 + #58 + this isolation as a canary, confirm a real
Revit IFC returns 201, then shift traffic. A revision with a live
un-isolated parse path must not take production traffic.

HR-11 reporting wrinkle: the dispatch directed the session summary to
`P:\doc_repo\_inbox\`, but cc-agent-C, citing a standing "no cross-repo
doc writes" instruction, drafted it locally at `legacy-design-tools/
_research/2026-05-21_qa_close_out_cc-agent-C.md` instead. HR-11 makes
the `_inbox/` write the one explicitly permitted cross-repo write; that
supersedes the older instruction. cc-agent-C should write to `_inbox/`
going forward. This doc_repo `_sessions/` copy was assembled by the
planner from cc-agent-C's report.
