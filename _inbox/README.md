---
id: inbox_readme
title: _inbox courier protocol
status: active
last_updated: 2026-05-21
applies_to: portfolio
---

# _inbox — cc-agent courier drop

This folder is the single, reliable handoff point between cc-agents and the
canonical doc repo. It exists so that work done in the product repos
(hauska-engine, hauska-mcp-server, hauska-atom-contract, hauska-sdk,
legacy-design-tools) always reaches the doc set, instead of stranding in a
session summary that lives only in the agent's own repo.

It was created 2026-05-21 after a cross-repo reconciliation found ten
cc-agent session summaries that never reached `_sessions/`, leaving the
portfolio snapshot weeks behind reality. See HR-11 in
[`20_agent_operating_rules.md`](../20_agent_operating_rules.md).

## The rule, for cc-agents

At every session break-point:

1. Write your session summary, plus any recon note or decision-relevant
   finding, as a Markdown file in this folder.
2. Name it `<YYYY-MM-DD>_<repo>_<agent>_<short-topic>.md`, for example
   `2026-05-21_hauska-mcp-server_cc-agent-M_2d-deploy.md`.
3. Include light frontmatter so the planner can file it fast:

   ```yaml
   ---
   date: 2026-05-21
   agent: cc-agent-M
   repo: hauska-mcp-server
   type: session        # session | decision | recon | finding
   ---
   ```

4. Do not commit to the doc repo. Do not edit anything outside `_inbox/`.
5. Keep a durable record in your own repo. For a recon or a finding,
   commit a note in your repo's conventional agent-notes location. For an
   engineering session, the commits and the PR are already the durable
   record, so a separate summary file is optional. Either way the
   `_inbox/` drop above is the one required artifact and must not be
   blocked on finding an in-repo home for the copy. (Surfaced 2026-05-21:
   `legacy-design-tools` has no `_sessions/` directory, and dispatches
   may forbid `_research/` as a courier substitute — neither blocks the
   `_inbox/` drop.)

That is the whole rule. Write the file, leave it, move on.

## What the planner does

At session start and session close the planner sweeps this folder:

- Files each item into `_sessions/`, `_decisions/`, or `_research/` with
  correct naming and frontmatter per
  [`01_doc_conventions.md`](../01_doc_conventions.md).
- Rolls the findings into the canonical docs and `00_current_state.md`.
- Deletes the inbox file once filed.
- Commits the whole sweep as one batch.

A non-empty `_inbox/` at session start means there is uncouriered work to
file before anything else.

## Why write but do not commit

cc-agents writing files here, but never running git in the doc repo, keeps
the doc-repo committer set to just the planner. That sidesteps the
concurrent-commit hazard that has repeatedly bitten the shared clone. An
uncommitted file sitting here is never a data-loss risk, because the
agent's own repo holds the durable copy.
