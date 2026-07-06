# Convergence Program — live tracker

Started 2026-07-04. Planner-run, autonomous per operator greenlight (decision: `_decisions/2026-07-04_convergence_program_execution_model.md`). Operator involvement: none until completion notification; operator-owed items accumulate in the Pickup List below. This file is the cross-context state anchor: any continuation session reads this first.

## Operating rules for this program

1. Execution by Cursor agents (cursor-agent CLI, headless) where the work is repo code; planner does git rescue ops, doc work, verification, review, merges, deploys directly.
2. Every merge requires an adversarial review verdict (planner or Claude subagent, prompted to refute). Verification against live systems (gh, npm, gcloud, prod endpoints), never executor self-report.
3. Deploys follow the recorded per-service methods (cortex-api canary workflow; engine-api Cloud Build + tag repoint; mcp via cloudbuild-mcp). Canary + rollback handles on everything.
4. Nothing destructive without a captured-elsewhere check. smartcity-os: absolute no-touch. Local folder/clone sweep: out of scope.
5. Commit messages per convention; doc_repo commits batched at phase boundaries (concurrent-commit hazard rules apply).

## OPERATOR ANSWERS 2026-07-06 (unblocks the handoff's open gap; read with the 2026-07-06 handoff doc)

**Demo-page expectation ANSWERED.** The ICC walkthrough is NOT a standalone demo page. It is the actual selling surfaces: (1) the Property Brief extension, FIXED and caught up to the revised architecture (four-gate keys, ICC formal citations, current packages), consuming capabilities through the gate that the Empressa command center administers; (2) the command center workspace examples (plan-review compliance run citing minted IBC sections, property/architect views); (3) the revenue-meter leg showing ICC content generating metered Layer-2 calls. icc-demo.vercel.app stays as the agent-market leg; the walkthrough is extension + command center.

**NEW QUALITY FLAG (operator, 2026-07-06): the Cortex workspace mount in the command center is not acceptable as-is.** Operator verbatim: not testable at this point, does not match the look, needs a ton of work. This amends the "47-tile parity" claim — parity was capability count, not presentability or testability. The workspace needs a real QA/quality pass (against the design-tokens look and a testability bar) BEFORE it can carry the ICC walkthrough. Operator can supply more detail; the pass should start with its own audit and collect his notes.

**Revised close-the-gap order (supersedes handoff next-lane item 1):** (a) verify/wire plan-review findings against the IBC corpus (unchanged, still first); (b) metering wire-up + revenue-meter panel; (c) workspace quality pass to the operator's bar; (d) extension catch-up pass to the revised architecture; (e) walkthrough assembly across extension + command center. Ratification package for the operator-owed decision stack: `_inbox/2026-07-06_operator_ratification_package.md`.

## LIVE STATE 2026-07-05 SESSION 2 (continuation spine — read this first on any resume)

**Deploy chain COMPLETE (2026-07-05 second session, planner-run, all verified live):**
- **MCP four-gate DEPLOYED to prod.** Migrations 004 (tenant columns) + 005 (cortex->reporting remap, four-value CHECK) applied to prod Neon and verified; pre-migration request_log audit found ZERO map-tool callers in 30d (mint-and-go confirmed). Serving 100% on `hauska-mcp-server-00010-zuq` (rollback handle `00008-mcr`). Gate matrix verified live on prod: anon->public 200, malformed key 401, reporting key denied map tools at call time with a product-denial message, map key reaches map tools 6/6, catalog = 63 tools. NOTE: tools/list intentionally shows the full catalog to all callers; enforcement is call-time `requireProduct` (first line of every gated handler, verified in code).
- **Prod incident found + fixed by the canary probes:** the Upstash Redis rate-limit backend no longer exists (DNS NXDOMAIN) — every KEYED request was 503ing (latent on the old revision too; masked by zero keyed traffic). Fix: `ResilientRateLimitStore` (circuit breaker -> in-memory fallback, 60s primary retry, never throws) — PR #36, built by cursor-agent, planner-verified (326/326 tests, tsc clean), merged + deployed. **Pickup: recreate an Upstash db (or accept per-instance memory limits) and update `UPSTASH_REDIS_REST_URL` + secret; env still points at the dead instance (harmless — degrades to memory).**
- **cortex-api redeployed** via the canonical canary sequence (deploy-canary -> run-migrations -> shift): serving 100% on `cortex-api-00288-lab` at main `9e69d6e` (picks up #225 fail-loud). Rollback: `00286-xic`.
- **engine-api redeployed**: serving 100% on `hauska-engine-api-00031-rap` at main `301f145`; envelope-canary/docingest/persist tags all repointed to it. Picks up the atom-contract 1.6.1 bump AND ICC secrets v2 (mounted `:latest`, resolved at revision creation). Rollback: `00029-buy`.
- **retrieval-api redeployed**: serving 100% on `hauska-retrieval-api-00008-ber` (picks up #80 fail-closed accessPolicy). Healthz: db up, corpus 21,126 atoms; search smoked with the engine key. Rollback: `00007-fsk`.

**Engine 1.6.1 bump MERGED (PR #82).** Both hold conditions cleared: planner re-ran typecheck (clean, 15 packages) and an adversarial consumer check verified SAFE-TO-MERGE (BriefRunAtomInstance is emitted only from tests, never serialized on any production wire; legacy computes its own scalar brief confidence; MCP brief types carry no confidence field). Forward note: a future ingest path pushing scalar confidence into emitBriefRun fails producer-side validation by design.

**ICC BACKEND LIVE END-TO-END (the OAuth gate is CLEARED).** The real token endpoint is `https://api.iccsafe.org/auth/token` (NOT /oauth2/token) — client_credentials with creds in the FORM BODY (not Basic auth), scope `content-read`; content API base `https://api.iccsafe.org` with `/v1/books|book/{id}/chapters|chapter/{id}/sections|content/{xmlId}` + `/v2/search`. Found via ICC's own OpenAPI spec (api.iccsafe.org/docs/open.json) + live probes. Demo creds verified live: entitled to IBC2018P6 + IPMC2018P2 through 2026-12-31. **Adapter reconciled to the real contract and merged (hauska-engine PR #83, `ccf3d6a`)**: planner ran the full live e2e — IBC2018P6 (20.6 MB) -> 14,428 normalized blocks -> 4,966 code-section atoms with ICC deep links and reasoning-layer bodyText (ADR-019 derivative boundary held; no verbatim text hosted). The live run caught real bugs fixtures missed (live nodes omit content/children/title/ordinal — types made optional, walk + extractor hardened, regression test added; 102/102 tests). Remaining ICC work: actual corpus ingest run + eval + snapshot re-mint (deliberate, next cycle), and the extension-side PoC branch merge (`extension/icc-poc-formal-citation`).

**Command center WIRED + REBRANDED (Phase 3 exit quality pass done).** https://cmdcenter-blush.vercel.app now: title/brand "Empressa Command Center"; a Vercel serverless same-origin proxy (`api/spine.ts` + `/api/spine/(.*)` rewrite) holds ALL service keys server-side (browser never sees them) — routes cortex (Bearer SERVICE_API_KEY), mcp (X-Hauska-Key, a dedicated `reporting`+platform_internal key minted for this surface, key_id c1fcfe13), retrieval; GET-only allowlist + POST only to the MCP JSON-RPC path; /admin/* blocked outright. Verified live through the proxy: cortex healthz 200, tile-registry real data, MCP tools/list 63 tools. hauska-map PR #5 MERGED (main `93bee7d`). Deploy gotchas recorded: Vercel `[...path]` catch-alls only matched one segment on this deployment (query-based rewrite used instead); stdin-piped `vercel env add` appends a newline (function trims env values now).

**Eval-scores artifact: NOT publishable as-is (commitment #2).** The branch (pushed: `eval/per-jurisdiction-scores` on hauska-engine) shows 32/34 jurisdictions "passing" top-3 with `queriesEvaluated: 0` — a vacuous pass presented as a perfect score. Only Grand County + Bastrop have real curated queries (Bastrop fails on a query-set edition mismatch, not retrieval). Needs per-jurisdiction curated queries before any external use. Section-retrievability + crossref sampling (100 each) are real.

**Probe-key hygiene:** all four probe keys minted during gate verification were revoked (DELETE 200 each). The command-center key (c1fcfe13) is the only key minted this session that remains active, held only in Vercel env.

**SESSION-2 CLOSE ADDENDUM (later same day; session record `_sessions/2026-07-05_convergence_autonomous_run_claude_code.md`):**
- **Tenancy T1 BUILT AND STAGED across all three repos (no prod flip, per ruling).** Producer: hauska-mcp-server **PR #37** (gate-context.ts, HMAC-SHA256 signed context on every upstream call, 349/349 tests). Consumers (log-only default, byte-identical prod behavior until the flip): hauska-engine **PR #84** (60/60 tests) and legacy-design-tools **PR #227** (all six gate-fronted routes; +12 tests, zero regressions vs a main baseline run). Wire contract cross-checked across all three (seconds-epoch iat/exp, constant-time compare). `GATE_CONTEXT_SIGNING_KEY` v1 staged in Secret Manager (hauska-prod-497015), NOT mounted anywhere yet. **The coordinated flip (mount key -> log mode soak -> enforce -> remove plain-header trust) is the operator-approved next step; all three PRs are marked DO-NOT-MERGE-IN-ISOLATION.**
- **Console unification MERGED + LIVE (hauska-map PR #6, main 6538365).** The root vanilla-JS spine console retired; five capabilities ported as React panels (McpInspector, ParcelTrace, AgentView, LayerRegistryView, Settings); redeployed to cmdcenter-blush.vercel.app and smoked (Empressa title + proxy healthz 200). Executes the 2026-07-04 master-map/console-unification decision.
- **Phase 4 Stripe test-mode pricing CREATED** (Decision B, test key verified sk_test_ before any write): products Hauska Layer 2 Builder ($49/mo, prod_UpYRs5Df4yO18R) + Pro Stream ($199/mo, prod_UpYRnNRCeNnFCA); billing meter `layer2_call` (mtr_test_61UzHInRw5N1hYEjh41FjAepSMTX7ItU); metered overage prices $0.04 (Builder) / $0.02 (Pro) per call. Idempotent creation scripts in the session scratchpad; metering wire-up (MCP -> meter events) queued behind T1.
- **Phase 4 doc drafts FILED to _inbox for operator framing review** (the program never defined these artifacts; each draft says so): `2026-07-05_draft_proof_of_record_spec.md` (rec. slot 62), `2026-07-05_draft_certification_scaffold.md` (rec. slot 63; bakes in a non-vacuousness floor motivated by the eval-scores incident), `2026-07-05_draft_siting_spike_memo.md` (scope self-proposed from the 77 place-graph data-center signal — correct scope first if "siting" meant something else).

**SESSION-3 CLOSE ADDENDUM (2026-07-05 evening, operator-interactive; session record `_sessions/2026-07-05_operator_session_t1_icc_workspace_claude_code.md`):**
- **T1 FLIPPED (log mode), operator-approved.** PRs #37/#84/#227 merged; GATE_CONTEXT_SIGNING_KEY replicated to both projects, IAM granted to all three runtime SAs, mounted on all three services; MCP `00013-hej`, engine `00036-hiv` (tags repointed), cortex `00290-qol` all at 100%. **Live-verified: `gate_context_verified` in cortex logs on a real MCP call.** Two enforce-blockers found honestly: (1) the producer stamped `product:"public"` on a map-key call (subject resolution outside request context on some paths — fix before enforce); (2) #227 was merged before its CI finished and shipped a red test (fixed in #229; merges now always wait for CI, memory saved).
- **ICC LIVE END TO END.** Ingest unit merged (engine PR #85) + corpus minted: snapshot = prior 34 jurisdictions byte-identical + `icc-model-code` (8,731 atoms, IBC2018P6 complete at 4,966 sections; **IPMC2018P2 content fetch returns empty body — adapter follow-up**). Full-rebuild path abandoned after sustained Municode 500s killed two runs (splice composition in provenance.splice). retrieval-api serving 100% on `00010-bif` (29,857 atoms, ICC search verified, Bastrop regression-checked). **Public demo LIVE with real data: https://icc-demo.vercel.app** (Codex-branded, key-holding proxy, Ed-spec citations, deep links). Extension PR #5 merged (`72dc491`). NOTE from operator: the demo page is NOT the ICC pitch — the pitch is the workspace walkthrough (reviewer/architect/property surfaces + code-treatment + metering story); the page is the MCP-first/agent-market leg.
- **Command center = the single working surface (operator-ratified) at FULL 47-tile parity.** Phase A (branding EMPRESSA · COMMAND CENTER, PROXY AUTH badge, panels auto-load; PR #7) + Phase B (Cortex Workspace mounted via ADR-024 packages; PR #8) + parity (PR #9): audit found the mount had 17 of 47 tiles and a gutted Plan Review preset; fixed by packaging the three app-resident report tiles (`@hauska/cortex-tiles@0.1.1`, ldt PR #228, published via CI) and deriving the registry from TILE_CAPABILITIES (real components for 20, status-aware stubs for 27, contract ids restored, Print View space back). All deployed to cmdcenter-blush.vercel.app.
- **O&G vertical ACTIVATED (operator: "Reeves OG needs to ship soon").** Drafts filed to _inbox: `2026-07-05_draft_og_activation_decision.md` + `2026-07-05_draft_adr_025_og_atom_ontology.md`. Operator rulings stamped on the ADR: separate mineral-lease/rrc-lease types, ownership-interest single discriminated type, **obligation goes DOMAIN-NEUTRAL (core contract, not ./og)**, DOI tenant-private, Empressa Land stays a working name. Pooled-units question routed to Herbert (brief in the session record); his answer on Reeves pooling share decides whether ADR-025 revs before the mint.
- **npm publishing path proven:** NPM_TOKEN set by operator; `@hauska/cortex-tiles@0.1.1` published via ldt CI. hauska-sdk publish FAILED on a pre-existing main build error (tsc exit 2 after adapters-storage-redis) — fix queued; metering still unpublished.

**QUEUE (next cycle, dependency order):**
1. ICC corpus ingest run (IBC2018P6 + IPMC2018P2) + eval + snapshot re-mint + retrieval-api data deploy — then merge extension PR #5 (hauska-brief-extension, ICC formal citation).
2. Tenancy T1 coordinated flip (operator-approved sequencing): merge #37/#84/#227, mount GATE_CONTEXT_SIGNING_KEY on all three services, soak in log mode, review gate_context_mismatch logs, then enforce + remove plain-header trust. Then T2 (tenant-private write primitive) per the tenancy plan.
3. MCP metering wire-up: emit `layer2_call` meter events at the tool-call layer for Layer 2 paid calls (Stripe test products exist; @hauska-sdk/payment consumption per 14/29).
4. Coordinated landings held for operator: component-library rename PR #226 (ldt) + atom-spec PR #4 (atom-contract, framing review); npm CI publish path (NPM_TOKEN secrets for SDK + atom-contract).
5. Eval-scores: build per-jurisdiction curated queries before any external publication (branch eval/per-jurisdiction-scores preserved).
6. Upstash replacement (or accept per-instance memory limits): recreate db, update UPSTASH_REDIS_REST_URL env + token secret, redeploy MCP.



Execution model CONFIRMED + validated: **cursor-agent (Cursor's limits) executes code; planner (Claude/Max) verifies, reviews, merges, deploys.** cursor-agent invocation: refresh PATH, then `cursor-agent --print --force --model sonnet-4.5 "<task>"` in the target repo dir (background via run_in_background). Verified working on the engine bump.

**DONE + on main/npm:** contract 1.6.1 LIVE; engine fail-open (#80) merged; ldt mock-flip (#225) merged; MCP four-gate (#35) merged (deploy pending); all doc-truth (CLAUDE.md, repo_intents, hygiene sweep, ICC spec) committed+pushed; all at-risk work rescued.

**engine 1.6.1 bump: STAGED, NOT merged (planner judgment).** Branch `fix/atom-contract-1.6.1` at `34d42e5` (pushed) — Cursor bumped to 1.6.1 + fixed the WidthedConfidence breakage (workspace-instances.ts, registry.ts, emit.ts); Cursor reports typecheck+build clean on all 15 packages. HELD from merge because the fix changes `BriefRunAtomInstance.confidence` from scalar `number` to structured `WidthedConfidence` — a LIVE atom-schema change. Before merge: (a) planner re-runs typecheck; (b) assess whether any out-of-engine consumer (cortex-api brief generation, retrieval wire) reads brief-run confidence as a scalar — if so, coordinate the shape change. NOT critical path (engine runs fine on 1.3.0), so no rush; merge deliberately after the consumer check.

**Phase 1 atom-spec: STAGED as PR #4** (hauska-atom-contract) — language-neutral open standard (7 JSON schemas + SPEC.md + README, additive-safe, planner-reviewed). Held as a PR for operator framing-review since it's a PUBLIC-facing standard (per autonomy grant); merge + external promotion (registries/announcement) gated on operator.

**Phase 3 component-library rename: STAGED as PR #226** (legacy-design-tools) — hauska/* -> empressaio/* for the five packages; grep-verified zero old refs, typecheck clean. Held for coordinated Phase 3 landing (rename + republish under @empressaio via CI + update external consumers). Not for isolated merge (changes published package identity).

**Phase 3 command center: LIVE ON VERCEL (verified).** apps/command-center deployed to **https://cmdcenter-blush.vercel.app** (HTTP 200, app shell loads, verified). Fix that unblocked it: the pnpm workspace needs a root vercel.json (`pnpm install` + `pnpm --filter ./apps/command-center build`, output apps/command-center/dist) — plain npm-install-from-subdir failed on `workspace:*`. That config is committed to PR #5 (hauska-map) at `afdd282` for reproducible redeploys. CAVEATS (operator quality pass owed): shell loads but backend calls (cortex-api/MCP) need CORS/auth wiring to be functional; several panels stubbed; title/branding still says "Hauska" (should be Empressa per canon). This is the named Phase 3 exit — stable URL off the operator machine — delivered as a first version for visual review, not final.

**PUBLISHING MECHANISM CORRECTED (2026-07-05):** The blocker was NEVER token type — the operator's tokens bypass 2FA. The LOCAL `npm publish` CLI forces an interactive web-auth flow regardless of token; **CI (GitHub Actions) does NOT** (it feeds the token via `NODE_AUTH_TOKEN` and publishes headless). SDK `publish.yml` already does this on `v*.*.*` tag push. THE AUTONOMOUS PUBLISH PATH = push a version tag via gh -> CI publishes with the repo's `NPM_TOKEN` secret. Setup needed: (1) operator confirms/refreshes the bypass token as `NPM_TOKEN` secret in SDK+map (SDK's is dated 2026-04-05) and adds it to atom-contract; (2) planner adds a publish workflow to atom-contract + makes workflows tolerate the "already published" 409. Then all publishing is a gh tag-push, zero interaction. `@hauska-sdk/payment@0.1.1` LIVE (operator manual); `@hauska-sdk/metering` still unpublished (goes via CI once the path is set, or operator's end batch).

**ICC creds STORED (2026-07-05).** Operator provided the ICC Code Connect demo creds (PoC-only, expire 2026-12-30). Stored securely as **version 2 of the existing GCP secrets `ICC_CODE_CONNECT_CLIENT_ID` + `ICC_CODE_CONNECT_CLIENT_SECRET` in project hauska-prod-497015** (client-id 32 chars, secret 14 chars; via temp-file not pipe per the truncation hazard; temp files removed; creds never in any repo/file). **Remaining to make ICC live end-to-end (focused next step, NOT rushed):** (1) the OAuth endpoint — the adapter's assumed `https://api.iccsafe.org/oauth2/token` returns 404; the real endpoint is in ICC's Postman collection (api.iccsafe.org root is a JS portal shell, not plain-fetchable) — need the actual token URL + flow, then set `ICC_CODE_CONNECT_TOKEN_URL`/`_BASE_URL` if they differ from defaults; (2) confirm hauska-engine-api mounts these two secrets as env + redeploy to pick up version 2; (3) run scripts/probe-icc-gate.mjs end-to-end. Operator can shortcut step 1 by sharing the Postman collection or the token endpoint.

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
