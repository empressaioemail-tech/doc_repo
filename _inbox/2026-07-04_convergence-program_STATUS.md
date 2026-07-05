# Convergence Program — live tracker

Started 2026-07-04. Planner-run, autonomous per operator greenlight (decision: `_decisions/2026-07-04_convergence_program_execution_model.md`). Operator involvement: none until completion notification; operator-owed items accumulate in the Pickup List below. This file is the cross-context state anchor: any continuation session reads this first.

## Operating rules for this program

1. Execution by Cursor agents (cursor-agent CLI, headless) where the work is repo code; planner does git rescue ops, doc work, verification, review, merges, deploys directly.
2. Every merge requires an adversarial review verdict (planner or Claude subagent, prompted to refute). Verification against live systems (gh, npm, gcloud, prod endpoints), never executor self-report.
3. Deploys follow the recorded per-service methods (cortex-api canary workflow; engine-api Cloud Build + tag repoint; mcp via cloudbuild-mcp). Canary + rollback handles on everything.
4. Nothing destructive without a captured-elsewhere check. smartcity-os: absolute no-touch. Local folder/clone sweep: out of scope.
5. Commit messages per convention; doc_repo commits batched at phase boundaries (concurrent-commit hazard rules apply).

## LIVE STATE 2026-07-05 (continuation spine — read this first on any resume)

Execution model CONFIRMED + validated: **cursor-agent (Cursor's limits) executes code; planner (Claude/Max) verifies, reviews, merges, deploys.** cursor-agent invocation: refresh PATH, then `cursor-agent --print --force --model sonnet-4.5 "<task>"` in the target repo dir (background via run_in_background). Verified working on the engine bump.

**DONE + on main/npm:** contract 1.6.1 LIVE; engine fail-open (#80) merged; ldt mock-flip (#225) merged; MCP four-gate (#35) merged (deploy pending); all doc-truth (CLAUDE.md, repo_intents, hygiene sweep, ICC spec) committed+pushed; all at-risk work rescued.

**engine 1.6.1 bump: STAGED, NOT merged (planner judgment).** Branch `fix/atom-contract-1.6.1` at `34d42e5` (pushed) — Cursor bumped to 1.6.1 + fixed the WidthedConfidence breakage (workspace-instances.ts, registry.ts, emit.ts); Cursor reports typecheck+build clean on all 15 packages. HELD from merge because the fix changes `BriefRunAtomInstance.confidence` from scalar `number` to structured `WidthedConfidence` — a LIVE atom-schema change. Before merge: (a) planner re-runs typecheck; (b) assess whether any out-of-engine consumer (cortex-api brief generation, retrieval wire) reads brief-run confidence as a scalar — if so, coordinate the shape change. NOT critical path (engine runs fine on 1.3.0), so no rush; merge deliberately after the consumer check.

**Phase 1 atom-spec: STAGED as PR #4** (hauska-atom-contract) — language-neutral open standard (7 JSON schemas + SPEC.md + README, additive-safe, planner-reviewed). Held as a PR for operator framing-review since it's a PUBLIC-facing standard (per autonomy grant); merge + external promotion (registries/announcement) gated on operator.

**Phase 3 component-library rename: STAGED as PR #226** (legacy-design-tools) — hauska/* -> empressaio/* for the five packages; grep-verified zero old refs, typecheck clean. Held for coordinated Phase 3 landing (rename + republish under @empressaio via CI + update external consumers). Not for isolated merge (changes published package identity).

**Phase 3 command center: LIVE ON VERCEL (verified).** apps/command-center deployed to **https://cmdcenter-blush.vercel.app** (HTTP 200, app shell loads, verified). Fix that unblocked it: the pnpm workspace needs a root vercel.json (`pnpm install` + `pnpm --filter ./apps/command-center build`, output apps/command-center/dist) — plain npm-install-from-subdir failed on `workspace:*`. That config is committed to PR #5 (hauska-map) at `afdd282` for reproducible redeploys. CAVEATS (operator quality pass owed): shell loads but backend calls (cortex-api/MCP) need CORS/auth wiring to be functional; several panels stubbed; title/branding still says "Hauska" (should be Empressa per canon). This is the named Phase 3 exit — stable URL off the operator machine — delivered as a first version for visual review, not final.

**PUBLISHING MECHANISM CORRECTED (2026-07-05):** The blocker was NEVER token type — the operator's tokens bypass 2FA. The LOCAL `npm publish` CLI forces an interactive web-auth flow regardless of token; **CI (GitHub Actions) does NOT** (it feeds the token via `NODE_AUTH_TOKEN` and publishes headless). SDK `publish.yml` already does this on `v*.*.*` tag push. THE AUTONOMOUS PUBLISH PATH = push a version tag via gh -> CI publishes with the repo's `NPM_TOKEN` secret. Setup needed: (1) operator confirms/refreshes the bypass token as `NPM_TOKEN` secret in SDK+map (SDK's is dated 2026-04-05) and adds it to atom-contract; (2) planner adds a publish workflow to atom-contract + makes workflows tolerate the "already published" 409. Then all publishing is a gh tag-push, zero interaction. `@hauska-sdk/payment@0.1.1` LIVE (operator manual); `@hauska-sdk/metering` still unpublished (goes via CI once the path is set, or operator's end batch).

**Phase 1 ICC PoC (extension side): STAGED on branch extension/icc-poc-formal-citation (`f772add`).** Formal-citation display now matches Ed's spec exactly ("<codebook title> Section <n>"), ICC-attributed as a source link, no full-text reproduction (derivative boundary), build clean, tests pass incl. new ICC-format assertions, added scripts/probe-icc-gate.mjs. REMAINING (pickup): engine icc-code-connect adapter wired with the ICC demo credential VALUES (in Ed's email attachment — operator to provide) + gate headers for jurisdiction `icc-model-code`. Extension display done; backend integration gated on creds.

**RUNNING (background Cursor):** Phase 1 eval-scores generation (per-jurisdiction retrieval quality as a publishable "confidence is earned" artifact). Additive; publish gated.

**PROGRESS LOG (this session, chronological):** contract 1.6.1 published + provenance restored; engine fail-open #80 merged; ldt mock-flip #225 merged; MCP four-gate #35 merged (deploy staged); doc-truth + repo_intents + hygiene sweep + ICC binding spec committed; SDK sprint-53 built+staged (OTP-gated); engine 1.6.1 bump built+staged (wire-compat hold); atom-spec staged as PR #4; component-library rename running. Cursor-execution model validated + in use for build work; planner verifies/merges/deploys.

**QUEUE (planner drives; Cursor executes code):**
1. Verify+merge the engine 1.6.1 bump once the WidthedConfidence fix reports green.
2. **MCP four-gate DEPLOY** (planner; breaking migration 005 — runbook below): request_log audit → apply migration → mint map keys → canary → verify. Authorized (map key cleared).
3. cortex-api + engine redeploys to pick up #225 / #80.
4. Phase 1 (own the layer): gate single-chokepoint; metering wired; **atom spec generated** (publish gated on npm token); ICC PoC two-screen build (extension ICC branch + a surface); eval scores generated.
5. Phase 2: tenancy — BUILD-AND-STAGE only (no prod flip).
6. Phase 3: command center build + Vercel deploy (Vercel authed); component library rename @hauska/*→@empressaio/* + hardening; Cortex console extraction from ldt.
7. Phase 4: Stripe test-mode pricing; proof-of-record spec; siting spike memo; certification scaffold.

**OPERATOR-GATED (pickup; do NOT block the run):**
- **npm publishing NOT autonomous** (planner's "bypass confirmed" was a FALSE POSITIVE — see memory). Needs a **Classic → Automation** npm token in ~/.npmrc. Blocks: SDK sprint-53 (built+staged in `P:\tmp\hauska-sdk-publish`, one command from done), atom-spec publication, future contract/Reeves publishes. Does NOT block build work.
- Rotate extension key; Cotality new key 2026-07-06; tenancy prod flip; Stripe live.

## Autonomy grant (2026-07-05, operator)

Operator authorized a sustained autonomous run of Phases 0-4 while away, with these rulings:
- **Gate behavior: best judgment.** Default = skip-and-continue (log the blocked item to pickup, proceed with everything else). Never fake a result; never do a dangerous irreversible op without cause.
- **Tenancy: BUILD-AND-STAGE, do NOT flip live prod.** The cortex-api anonymous->per-tenant cutover is built, tested, staged with a runbook; the actual prod flip waits for the operator (orphaned-anonymous-data hazard).
- **Deploys: autonomous on green** (canary + rollback + live verify). Breaking/irreversible prod ops get a read-only blast-radius check first.
- **Stripe: test-mode only**, live gated to operator.
- **npm: autonomous** (automation token, 2FA-bypass proven). **Vercel: pending `vercel login`** (command center deploy blocked until then).
- Publishing, doc work, PRs, safe deploys: proceed. Money-live, prod-auth-flip, external-account submissions: stage + pickup.

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
- **npm + contract 1.6.1: RESOLVED / LIVE** — `@hauska/atom-contract@1.6.1` PUBLISHED 2026-07-05 (operator OTP), verified live (`dist-tags.latest` 1.6.1, conformance/export advertised, tag `v1.6.1` pushed). Unblocks engine+mcp lockfile bumps and the Reeves 1.7.0 ontology. **Note: the account enforces 2FA-on-publish, so autonomous publishing needs an npm AUTOMATION token in CI (operator to create; then SDK sprint-53 + future publishes run without OTP).**
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

## MCP four-gate: MERGED, deploy STAGED (runbook)

**Code state:** PR #35 MERGED to `hauska-mcp-server` main (`feat(gate): four-product gate rework — clean rebase + review fixes (#35)`). #32/#33 closed as superseded. Verified: 320 tests pass; planner spot-checked the free-tier fix (`resolveGateAccessTier` final return is `public-free`) and the migration renumber (`005_api_keys_product_gate_split.sql`, no stray 003) on the branch before merge. MCP does NOT auto-deploy on merge (only `ci.yml` in Actions; deploy is Cloud Build via `cloudbuild-mcp.yaml`), so main now carries the verified code un-deployed — safe.

**Why the deploy is staged, not fired:** migration 005 is BREAKING — it remaps `product='cortex'`→`'reporting'` and tightens the CHECK to `('public','codex','reporting','map')`. Map tools then require a `map` key that existing (now `reporting`) keys lack. Deploying safely needs a live blast-radius audit first. Not to be fired on an exhausted context.

**Deploy runbook (execute deliberately, fresh context):**
1. **request_log audit (read-only, do FIRST):** query the MCP prod Postgres `request_log` for callers of the map tools (`get_parcel_polygon`, `get_hazard_profile`, `assemble_map_layers`, `simulate_site_drainage`, `get_site_drainage`, `get_site_topography`) in the last 30d, grouped by product/key. Determines whether the migration is truly mint-and-go (no current gate callers) or needs a key swap. Operator confirmed no FIELD/shipped keys hold map access, so any callers are our own server-side surfaces (likely cortex-api).
2. **Apply migration 005** to the deployment's Neon (watch the merged-vs-applied gotcha — a merged migration is NOT auto-applied to the live Cloud Run Neon). Apply via the repo's migrate script against the prod DATABASE_URL.
3. **Mint `map` keys** for any surface the audit found calling map tools, and update that surface's config (its X-Hauska-Key). If the audit finds zero current map-tool gate callers, skip.
4. **Canary deploy** the new MCP revision via `cloudbuild-mcp.yaml` (per the recorded deploy method); do NOT shift 100% until smoke passes.
5. **Verify prod (verbatim):** gate probes — anonymous→public still resolves; malformed/unknown key → 401; a `reporting` key reaches reporting tools; a `map` key reaches map tools; a `reporting` key is DENIED map tools (the intended split); tool count = 63 (62 + compose_workspace). Roll back on any red.

Everything else about #35 is done; this is the only remaining step, and it is bounded and specified.

## Verification log

- 2026-07-05: `@hauska/atom-contract@1.6.1` published + verified (`dist-tags.latest` 1.6.1, `./conformance`+`./export` exports advertised, `v1.6.1` tag pushed).
- 2026-07-05: hauska-mcp-server PR #35 merged to main (four-gate rework, 320 tests pass, free-tier + migration fixes spot-checked pre-merge). #32/#33 closed.
- 2026-07-05: hauska-engine PR #80 (fail-open fix) MERGED to main (22 tests green). legacy-design-tools PR #225 (mock-flip fail-loud) MERGED to main (52 tests green). Neither auto-deploys (both use separate Cloud Build/canary) — code landed, prod unaffected until a deliberate deploy.

## Session checkpoint 2026-07-05 — what is on main now

- **hauska-atom-contract**: 1.6.1 LIVE on npm (conformance/export provenance restored).
- **hauska-engine main**: fail-open accessPolicy fix landed (#80).
- **legacy-design-tools main**: mock-LLM-default fail-loud landed (#225).
- **hauska-mcp-server main**: four-gate rework landed (#35) — deploy staged per the runbook above.
- **doc_repo**: boot-truth corrected, repo_intents.md, .gitattributes, 6 decision records, ICC binding spec, this tracker.
- All at-risk work rescued to branches; secrets deleted (key rotation owed).

**Deploys pending (deliberate, next cycle):** MCP four-gate canary (runbook above); optionally cortex-api + engine redeploys to pick up #225/#80 (both are safety fixes; prod unaffected until then).
**Operator-owed:** rotate extension key; npm automation-token location (for autonomous SDK/future publishing); Cotality key (2026-07-06).
