# Convergence Program — live tracker

Started 2026-07-04. Planner-run, autonomous per operator greenlight (decision: `_decisions/2026-07-04_convergence_program_execution_model.md`). Operator involvement: none until completion notification; operator-owed items accumulate in the Pickup List below. This file is the cross-context state anchor: any continuation session reads this first.

## Operating rules for this program

1. Execution by Cursor agents (cursor-agent CLI, headless) where the work is repo code; planner does git rescue ops, doc work, verification, review, merges, deploys directly.
2. Every merge requires an adversarial review verdict (planner or Claude subagent, prompted to refute). Verification against live systems (gh, npm, gcloud, prod endpoints), never executor self-report.
3. Deploys follow the recorded per-service methods (cortex-api canary workflow; engine-api Cloud Build + tag repoint; mcp via cloudbuild-mcp). Canary + rollback handles on everything.
4. Nothing destructive without a captured-elsewhere check. smartcity-os: absolute no-touch. Local folder/clone sweep: out of scope.
5. Commit messages per convention; doc_repo commits batched at phase boundaries (concurrent-commit hazard rules apply).

## Tailored premortem (program-level; replaces boilerplate for this run)

| # | Failure mode | Mitigation (built into the run) |
|---|---|---|
| 1 | Prod breakage from landing stranded work (#32/#33 are 12+ days stale vs main) | Rebase + full adversarial review before merge; canary deploy with rollback handle; gate probes (401/anon/tool-count) post-deploy |
| 2 | Published-package divergence worsens mid-program (contract 1.6.0/1.7.0, SDK, renames) | Publish train is strictly ordered; every publish verified via `npm view` before dependents bump; Reeves ontology waits behind 1.6.0 |
| 3 | Migration number collision (ldt 0045 vs 0046-0050) | Renumber on the branch BEFORE any ICC-shells merge; claim convention filed in repo |
| 4 | cursor-agent (beta) damages a working tree | Smoke test first; agents run in task clones/branches, never operator's persistent clones on main; push-after-first-commit rule in every dispatch |
| 5 | Context loss across planner compaction | This tracker + per-phase close notes in _inbox/ are the durable state; todos mirror it; every phase exit updates this file |
| 6 | Secret exposure during cleanup/publish | Secrets deleted not moved; rotation goes to Pickup List (operator-only); no keys in dispatches or logs |
| 7 | Silent quality drift from executor fleet | No self-certified closes; verification checklist per dispatch; failed verification = redispatch, not patch-over |
| 8 | Operator-gated items silently stall a phase | Gated items route to Pickup List immediately and the phase proceeds on everything not gated; nothing waits silently |

## Phase board

- [ ] Phase 0 — Rescue & truth (IN PROGRESS)
- [ ] Phase 1 — Own the layer (+ ICC PoC play)
- [ ] Phase 2 — Tenancy
- [ ] Phase 3 — Surfaces (exit requirement: command center deployed to Vercel, stable, independent of operator machine)
- [ ] Phase 4 — Monetization capture
- [ ] Parallel: Reeves skeleton (contract ontology gated behind Phase 0 D1)

## Phase 0 workstreams

| Item | Status | Notes |
|---|---|---|
| A1 contract source rescue | in progress | commit published-but-untracked conformance/export |
| A2 engine TCE branch push | in progress | ~2,900 lines, branch verbatim |
| A3 mox redesign branch push | in progress | 39 files, branch verbatim, then park |
| A4 slb docs push | in progress | one commit |
| A5 extension ICC branch | in progress | ensure pushed; PR in ICC play |
| B1 fail-open accessPolicy fix | queued | engine retrieval-api |
| B2 secrets delete + rotate | queued | delete planner-side; ROTATION -> pickup |
| B3 mock-default flip | queued | ldt briefing-engine |
| C1 ldt 0045 renumber | queued | before ICC-shells merge |
| C2 MCP #32/#33 review+merge+deploy | queued | longest pole |
| C3 MCP README/matrix regen + contract bump | queued | after C2 |
| D1 contract 1.6.0 publish | queued | try local npm auth; else pickup |
| D2 SDK sprint-53 publish | queued | version bump + tag -> workflow |
| D3 map CI quality gate | queued | |
| D4 lockfile bumps | queued | engine + mcp after D1 |
| E1 corpus re-mint + redeploy | queued | |
| E2 snapshot -> GCS | queued | |
| F1-F8 doc truth + hygiene | queued | incl. repo_intents.md from 2026-07-04 rulings |
| H1-H3 program infra | queued | drift sentinel, skills, per-repo CLAUDE.md |

## Pickup List (operator-owed; grows during the run)

1. **Rotate the extension public key** — planner deleted `Secrets.txt` and `_temp_extension_hauska_key.md` from doc_repo root (done, verified absent). The key those held must be rotated on the prod gate.
2. **npm publish credential** — `npm whoami` returns 401 on this machine; the planner cannot publish. Blocks: contract 1.6.0 publish (D1), SDK sprint-53 publish (D2), and everything downstream that consumes the new versions (engine/mcp lockfile bumps land but can't be validated against a published 1.6.0; the Reeves O&G ontology 1.7.0). Planner will stage each publish fully (version bumped, tagged, changelog ready) so your step is a single `npm publish` / tag-push per package. Alternatively add an `NPM_TOKEN` automation secret to the atom-contract + SDK repos (hauska-map already has one) and the planner triggers the workflows.
3. **cursor-agent CLI not installed** — `irm 'https://cursor.com/install?win32=true' | iex` did not place a `cursor-agent` binary on PATH or in the usual locations. The program proceeds with the planner executing directly + Claude subagents, so this is not blocking — but if you want the Cursor fleet for the heavier Phase 2/3 build waves, re-run the installer in a fresh elevated PowerShell and confirm `cursor-agent --version` resolves.
4. **Cotality production keys** — demo tier expires ~2026-07-06; #1 external gate for the Max map, the brief's comps, and any Phase 4 siting demo. Sync to both `legacy-design-tools-prod` and `hauska-prod-497015`.
5. **Send the drafted Ed Cilurso answers** — planner drafts the 8 technical-question responses from repo evidence in the ICC play; you review and send (timing self-driven).
6. (items append as discovered)

## Verification log

(appends as work lands; verbatim outputs per convention)
