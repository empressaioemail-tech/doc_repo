---
decision_id: 2026-09-04_p32_wave2_customer_done
date: 2026-09-04
owner: Nick (go-ahead), planner (review/ship), subagent (coding)
status: active
related_canonical:
  - _inbox/2026-08-24_feasibility_v1_plan_DRAFT.md
  - _decisions/2026-09-03_p32_feasibility_tier_ruling.md
  - _decisions/2026-09-04_p32_wave1_customer_done.md
  - _inbox/2026-09-04_p32_wave1_close.json
  - _inbox/2026-09-04_p32_wave2_close.json
---

## Decision

P-32 wave 2 (the Property Explorer gating leg for the Feasibility Study report, spec item 10) is customer-done. The catalog entry and dispatch leg are live on production `smartsite.cloud`, verified on real production bytes, not a merged PR alone.

## Context

Wave 1 shipped the engine-side assembler (`_decisions/2026-09-04_p32_wave1_customer_done.md`) but left the report unreachable from the actual product surface. The operator caught this directly: a screenshot of the live "Reports & Exports" panel with "i dont see feasibility as an option in the reports." Wave 2 closes that gap. The operator directed the coding be delegated this time — "yes but spwan a sub agent to do it" — while the planner remained responsible for review, testing, commit, PR, CI verification, merge, and deploy, per `ENFORCEMENT.md`'s subagents-do-not-commit rule.

## What was done

Full detail in `_inbox/2026-09-04_p32_wave2_close.json`. Summary: the `FEAS` catalog entry flipped from `coming`/hidden to `ready`/purchasable, gated Studio+Team by reusing the server-computed `studioGranted` field (per the binding instruction in OPS-16 A-087 — never a new independent tier check). A third `?kind=feasibility` leg was added to the shared `pe-site-plan-export.ts` serverless function (forced by the Vercel Hobby function-count cap), calling `hauska-engine`'s wave-1 routes directly for both refresh and download legs (mirroring the flood-drainage pattern, since no MCP tool exists for feasibility-export). `ReportsTool.tsx` gained the Studio-lock gating pattern (matching site-plan/terrain, not the property-unlock pattern X-ray/Flood use). The subagent also found and fixed two genuine pre-existing mislabeling bugs (a filed feasibility export would have displayed as "Terrain" or the raw string "feasibility" in two places) — independently verified by the planner via `git diff` before commit, not accepted on the subagent's word alone.

PR #343 merged (`3ecf549`), CI's three check-runs read as literal `conclusion: success` via `gh api` (a monitor script watching `gh pr checks --json state` produced nothing for 20 minutes due to an invalid field name — caught and worked around by reading the check-runs API directly rather than assuming CI was stuck). Deployed via `vercel deploy --prod` from a clean detached worktree at the merge commit — Cloud Run's digest-deploy mechanism from wave 1 does not apply to this repo; researched fresh this wave (native Vercel CLI, no GitHub-integration auto-deploy observed on this project).

## A build-log finding investigated, not assumed

The Vercel build log showed a large wall of TypeScript errors across many `api/*.ts` files, including two files this wave wrote. Rather than assume this was benign, the planner diffed it directly against the immediately-prior production deployment's own build log and found the identical error set in the identical files at the identical line-shape — confirmed pre-existing (a known-shape discriminated-union narrowing false positive in Vercel's own advisory per-function `tsc` pass, which does not block the build; esbuild-transpile bundling ignores type diagnostics) and unrelated to this diff. The one new file that appears in the list, `pe-feasibility-export-handler.ts`, inherits the pattern only because it was deliberately modeled on `pe-flood-drainage-handler.ts`, which already carried it.

## What was verified live, and what was not

Verified directly against production `smartsite.cloud`: the `?kind=feasibility` dispatch leg is live and returns its own distinct, correct 401 copy signed-out (not a generic or wrong gate's message); the actual served frontend bundle (hash-matched to this exact deploy's build output) contains the real catalog name and promise copy, not a stale cached response. **Not verified by this lane**: a full signed-in click-through — generating and downloading a real Feasibility PDF through the live browser UI, the exact action the operator's screenshot was checking for. That requires the operator's own authenticated session, which this lane does not hold and should not use. Left as the operator's own next step.

## Reasoning

Same discipline wave 1 used: grade on live production bytes, not a merged PR or a passing test suite alone. Two production-side facts were checked directly (the gate's live response, the live bundle's actual served content) rather than assumed from the diff. The one open item (signed-in click-through) is named rather than silently treated as done.

## Reversal criteria

Revisit if the operator's own signed-in pass finds the report does not actually generate/download correctly despite the dispatch leg and bundle both checking out live — that would mean a defect this lane's verification depth did not reach (most likely in the actual engine-api round-trip under a real session, not in anything checked here).

## Dependencies

Nothing else in this operation depends on wave 2 closing. An MCP tool for feasibility-export remains unbuilt (named as out of scope by both waves, left for `hauska-mcp-server`'s seat).

## Counterparties

Internal: Nick (the original unfreeze/tier-ruling/execute-here chain from wave 1, plus this wave's "spawn a subagent" direction), property seat (both worktrees this wave), the coding subagent (diff only, no commit/ship authority).
