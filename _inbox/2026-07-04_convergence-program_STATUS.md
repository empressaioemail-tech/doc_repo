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

## Phase 0 workstreams — status as of 2026-07-04 autonomous run

**LANDED & VERIFIED (on origin):**
| Item | Result |
|---|---|
| A1 contract source rescue | **PR #3** (hauska-atom-contract) — 999 lines of 1.5.0 conformance/export source now in git; restores npm/git parity |
| A2 engine TCE branch | pushed `feat/tce-capture-evt-scaffold` (`79494c5`) — ~2,900 lines safe |
| A3 mox redesign | pushed `rescue/iteration3-nav-redesign` (`a0d26e8`) — 56 files safe, parked |
| A4 slb / A5 extension | both branches confirmed on origin |
| B1 fail-open accessPolicy | **PR #80** (hauska-engine) — fail-CLOSED, 5-value union + compile-time exhaustiveness guard, 22 tests green. (Planner's duplicate #81 closed; #80 is the superior artifact.) |
| B2 secrets | `Secrets.txt` + `_temp_extension_hauska_key.md` deleted (verified absent). ROTATION -> pickup #1. |
| B3 mock-default flip | **PR #225** (legacy-design-tools) — BRIEFING_LLM_MODE fails loud on unset/empty/unknown, 52 tests green + migration-number convention doc |
| C1 migration 0045 renumber | **branch `feat/icc-shells-formal-references`** (`f8f0b3a8`) — the ICC-shells commit was ORPHANED (on no branch); rescued + renamed 0045->0051 |
| F (core) | CLAUDE.md boot-truth corrected (46->59 tools, contract 1.5.0/1.6.0); `_catalog/repo_intents.md` written; `.gitattributes`; `.gitignore` stray-clone entry; 5 decision records; this tracker — committed `a11d757` |
| MCP #32/#33 | adversarial review COMPLETE, verdict posted to both PRs. **NOT merged** — review found a real prod-breaking free->paid escalation bug + a breaking deploy. Correct hold. |

**STAGED / DISPATCH-READY (not executed this run; credential- or multi-session-gated):**
| Item | Why not landed |
|---|---|
| C2/C3 MCP fix+rebase+merge+deploy | Fixes specified in the #33 verdict comment; the deploy is OPERATOR-GATED (breaking cortex-key re-mint) -> pickup #6 |
| D1 contract 1.6.0 publish | npm auth wall (401 on this machine) -> pickup #2 |
| D2 SDK sprint-53 publish | same npm wall + version-bump/tag staging |
| D3 map CI quality gate | ready to dispatch |
| D4 lockfile bumps | after D1 publishes |
| E1/E2 corpus re-mint + GCS | needs engine build + gcloud canary deploy |
| F (remainder) | 46-tools sweep (6 files), Regrid scrub (5 files), 56 status flip, `_inbox`/`_dispatches` archive pass |
| H1-H3 program infra | drift sentinel, 4 skills, per-repo CLAUDE.md files |
| Phases 1-4 + Reeves | multi-session builds; see the honest-status section below |

## Honest program status

Phase 0's **executable, high-leverage core landed and is verified** (rescues, the security fix, secrets, and the compounding doc-truth reconciliation that fixes boot accuracy for every future agent session). The remainder of Phase 0 is either npm-credential-gated (the publish train), needs a prod canary deploy with operator awareness (corpus re-mint, MCP breaking deploy), or is lower-leverage hygiene that a follow-up session or dispatched subagent completes cleanly.

**Phases 1-4 and the Reeves skeleton are genuine multi-session engineering builds** (a gate-enforcement rebuild, a tenant-private write primitive proven under load, a Vercel-deployed command center, a monetization stack, a full O&G ingest). They are de-risked and specified by this program's decisions and the audit, but they are NOT built or running as of this run, and this record does not claim otherwise. They resume in subsequent sessions against this tracker, each gated behind the Phase 0 truth work that just landed (notably: the Reeves atom ontology waits behind the contract 1.6.0 publish).

## New findings surfaced this run (added to pickup)
- Orphaned commit `0d555e5f` (feat(cortex) configurable tile workspace shell) — same branch-reset that orphaned the ICC shells; needs a rescue decision.
- Sibling fail-open-class landmine: `packages/atoms/src/instances.ts` private `ACCESS_POLICY_SCHEMA` z.enum is stale at 4 values (missing tenant-shared) — atom-instance validation, lower blast radius than B1.
- A `stash@{0}` sits on the orphaned commit chain in the shared legacy-design-tools clone.

## Pickup List — RESOLUTIONS logged 2026-07-05

Operator cleared the majority of the blockers on 2026-07-05:
- **npm: RESOLVED** — authenticated as `hauska-sdk`; planner + subagents publish directly. Contract 1.6.1 publish in flight (with a hard tarball-verification gate so it doesn't regress 1.5.0's conformance/export).
- **cursor-agent: RESOLVED** — installed + authenticated; usable for the Phase 2/3 build waves (`--force` for headless).
- **Ed Cilurso / ICC answers: RESOLVED** — all 8 answered + demo creds received (enabled through 2026-12-30; new creds at live prod, so no security exposure). Filed canonically at `_research/2026-07-05_icc_code_connect_technical_answers.md`. Key: citation format is `<codebook title> Section <n>`; subsection content display allowed; derivative = ICC text directly incorporated (citing + analysis is NOT derivative — the commitment-#1 firewall confirmed); stored content (incl. vector DBs) must be destroyable on termination.
- **MCP map-key breaking deploy: CLEARED** — operator confirmed NO map-function deployments exist in the field; "do what you need with map key." Planner proceeds autonomously: audit request_log, mint map keys, migrate, deploy on green.
- **Orphan commit 0d555e5f: planner-handled** — will rescue to a branch (loss protection), tag likely-superseded, no operator decision needed.
- **Autonomous deploys: CONFIRMED** — planner deploys on green verdict + canary + rollback, verified against prod; self-imposed exception (external/shipped/embedded consumer breakage) is now moot for the map case.

## Still operator-owed
1. **Rotate the extension public key** (planner deleted the on-disk secret files; the key they held must be rotated on the prod gate).
2. **Cotality production keys** — operator getting a new key 2026-07-06 (demo expires that day). Not blocking non-Cotality work.
3. **CLAUDE.md audit/slim** (operator-flagged) — the boot doc is large and carries stale/historical content; boot-truth counts corrected this run, a fuller slim is a good follow-up.

## Historical pickup (pre-2026-07-05, retained for context)

1. **Rotate the extension public key** — planner deleted `Secrets.txt` and `_temp_extension_hauska_key.md` from doc_repo root (done, verified absent). The key those held must be rotated on the prod gate.
2. **npm publish credential** — `npm whoami` returns 401 on this machine; the planner cannot publish. Blocks: contract 1.6.0 publish (D1), SDK sprint-53 publish (D2), and everything downstream that consumes the new versions (engine/mcp lockfile bumps land but can't be validated against a published 1.6.0; the Reeves O&G ontology 1.7.0). Planner will stage each publish fully (version bumped, tagged, changelog ready) so your step is a single `npm publish` / tag-push per package. Alternatively add an `NPM_TOKEN` automation secret to the atom-contract + SDK repos (hauska-map already has one) and the planner triggers the workflows.
3. **cursor-agent CLI not installed** — `irm 'https://cursor.com/install?win32=true' | iex` did not place a `cursor-agent` binary on PATH or in the usual locations. The program proceeds with the planner executing directly + Claude subagents, so this is not blocking — but if you want the Cursor fleet for the heavier Phase 2/3 build waves, re-run the installer in a fresh elevated PowerShell and confirm `cursor-agent --version` resolves.
4. **Cotality production keys** — demo tier expires ~2026-07-06; #1 external gate for the Max map, the brief's comps, and any Phase 4 siting demo. Sync to both `legacy-design-tools-prod` and `hauska-prod-497015`.
5. **Send the drafted Ed Cilurso answers** — planner drafts the 8 technical-question responses from repo evidence in the ICC play; you review and send (timing self-driven).
6. **MCP #32/#33 breaking deploy** — the code fixes are specified (verdict on PR #33); the merge is fine once fixes 1-3 land, but the DEPLOY denies every existing cortex-key caller of the map/hazard/drainage tools until new `map` keys are minted (migration 003 remaps cortex->reporting only). Approve a `request_log` key audit + key re-mint + migration-apply as part of that deploy.
7. **Orphaned commit `0d555e5f`** (configurable tile workspace shell, legacy-design-tools) — decide whether to rescue it (it was orphaned by the same 2026-07-01 branch reset that orphaned the ICC shells).
8. **cortex-api / engine deploys** — the corpus re-mint+redeploy (E1) and any prod cutover run through canary workflows; the planner can trigger via gh/gcloud but a breaking or prod-facing deploy should have your eyes. Confirm you want the planner deploying autonomously on green, or gating deploys to you.

## Verification log

(appends as work lands; verbatim outputs per convention)
