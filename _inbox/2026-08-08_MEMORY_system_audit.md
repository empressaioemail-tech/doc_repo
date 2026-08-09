---
id: 2026-08-08_memory_system_audit
title: Memory system audit — inventory, accuracy, and whether the feedback loop closes
status: active
last_updated: 2026-08-08
applies_to: portfolio
kind: audit
related: [90_runbooks/fleet_memory_practice, 90_runbooks/session_close_template, 64_recursive_loop/04_instantiations, _STATE, CLAUDE]
---

# Memory system audit — 2026-08-08

Read-only audit of the persistent memory system at `C:\Users\cente\.claude\projects\p--doc-repo\memory\` plus the fleet-side `.cursor/rules/*.mdc` install across reachable repos.

## Headline

The memory STORE is in good shape: 86 files, high accuracy on the operationally load-bearing technical claims, and the standing-decisions carrier has genuinely improved since 2026-07-28 (`_STATE.md` now holds a STANDING DECISIONS block and `.cursor/rules/read-state-first.mdc` makes reading it an always-apply rule for every Cursor seat).

The LEARNING LOOP does not close. Three specific breaks, all evidenced below:

1. The L3 grading rung (FIRED / HELPED / HARMED + trap-recurrence + divergence check) is fully specified in `90_runbooks/session_close_template.md` § 2C-bis and has been executed **zero times in 215 session summaries**. Grep for `HARMED` across `_sessions/` returns nothing. The selection pressure the whole design rests on has never once been applied.
2. The structural coherence carrier is still not built. `_dispatches/_template.md` (`last_updated: 2026-05-27`) contains no standing-decisions block, no fleet-memory block, and no authorization/no-nesting clause. Injection is hand-carried and inconsistent: of 312 dispatches only 18 carry a STANDING DECISIONS block; of 11 August dispatches, 2 carry standing decisions, 3 carry an Authorization section, 5 carry the no-nesting clause, and **0 carry the FLEET MEMORY block** that `fleet_memory_practice.md` says must be pasted verbatim into every sprint dispatch. The `FLEET-L3-GAP-template-replication-not-enforced` memory's claim that this was DECIDED-not-BUILT is **still true**.
3. Nothing writes memory from a failure automatically. Every memory file is hand-written by the planner. `fleet_memory_practice.md` rule 4 forbids autonomous promotion by design, which is defensible, but the planner-side promotion step it substitutes has no trigger, no checklist entry outside § 2C-bis, and § 2C-bis has never run.

Net: the system is a well-curated **reference library** with a real always-apply read path. It is not yet a **learning loop**, because nothing grades a memory against outcome and nothing forces a memory to travel to the seat that needs it.

## PART A — Inventory and accuracy

### Counts

86 memory files plus `MEMORY.md`. Type distribution from frontmatter `metadata.type`:

| type | count |
|---|---|
| project | 33 |
| feedback | 28 |
| reference | 18 |
| (missing type field) | 2 |
| MEMORY.md (index, no type) | 1 |

Two files carry no `metadata.type`: `bastrop_pioneer_narrative.md` and `eci_internal_app.md`. Both are the two oldest files in the store (May 12 / May 15) and predate the type convention. Neither declares `type: user` — so the `user` type in the documented schema (user|feedback|project|reference) is **unused across the entire store**.

### Verification table (checkable claims)

Marked N/A where the memory is pure preference, judgment, or an operator ruling with no live-state referent.

| file | type | checkable claim | verdict | evidence |
|---|---|---|---|---|
| hauska-mcp-auth-header | reference | auth header is `X-Hauska-Key`, not Bearer | VERIFIED | `hauska-mcp-server/src/auth.ts:75` `const HEADER_KEY = "x-hauska-key";`; `src/gate-probe.ts:8` comment "Authorization: Bearer would silently…" |
| hauska-mcp-gate-enum | reference | four gates public/codex/reporting/map; legacy `cortex` normalizes to `reporting` | VERIFIED | `src/product-gates.ts:106` `if (REPORTING_TOOLS.has(tool)) return "reporting";` and `:108` `if (tool.startsWith("cortex_")) return "reporting";`; `src/gate-front.ts:45` `reporting: "cortex",` |
| engine-api-deploy-method | project | build with `services/engine-api/Dockerfile`; root Dockerfile is retrieval-api; project `hauska-prod-497015` | VERIFIED | `hauska-engine/services/engine-api/Dockerfile` exists; root `Dockerfile:1` `# Lane E Phase E0 — retrieval-api Cloud Run image.` |
| sdk-metering-seam-unwired | project | gate has ZERO `@hauska-sdk/*` deps; money hook POSTs to `api.stripe.com/v1/billing/meter_events`; fix = `McpMeteringGate.authorizeCall` | **SUPERSEDED (partly STALE)** | `package.json:22` now declares `"@hauska-sdk/metering": "^0.1.1"` — the "ZERO deps" claim is false. `src/sdk-metering.ts` exists and its header says "Paid product-gated tools authorize via McpMeteringGate.authorizeCall BEFORE serve." Grep for `api.stripe.com` / `billing/meter_events` in `src/` returns **nothing** — the Stripe meter POST is gone. **Residual truth:** `recordLayer2Call` still exists (`src/metering.ts:27`) and is still called at `src/read-attribution.ts:126`, and the memory's prescribed **CI conformance dep-test does not exist** (no test greps for the `@hauska-sdk/*` dep). So ~70% of this memory shipped and was never written back. |
| zoning-stamp-roll-mechanics | project | `ZONING_LAYERS` in `lib/cad-ingest/src/txgio/zoning-layers.ts`; CLI `zoning-stamp`; `districtMapping.ts` normalizes | VERIFIED | file `legacy-design-tools/lib/cad-ingest/src/txgio/zoning-layers.ts` exists; `lib/cad-ingest/package.json:18` `"zoning-stamp": "tsx src/txgio/zoning-cli.ts"`; `artifacts/api-server/src/lib/buildableEnvelope/districtMapping.ts` exists |
| ldt-esbuild-conditions-narrow | reference | conditions must stay `["workspace"]` | VERIFIED | `legacy-design-tools/artifacts/api-server/build.mjs:50` `conditions: ["workspace"],`; same in `vitest.config.ts:20,28` |
| empressaio-packages-authored-in-ldt | reference | `@empressaio/*` packages authored in legacy-design-tools | VERIFIED | `ldt/packages/*/package.json` names: `@empressaio/cortex-client`, `cortex-tiles`, `design-tokens`, `document-viewer`, `tile-shell` |
| cortex-tile-registry-endpoint | reference | `GET /api/plan-review/admin/tile-registry` | VERIFIED | `ldt/artifacts/api-server/src/routes/planReviewBff.ts:1912` and `:1928` register `/admin/tile-registry`; test at `routes/__tests__/tileRegistry.test.ts` |
| path-to-regexp-v8-named-splat | reference | `'*'` must become `'/{*splat}'` | VERIFIED | `ldt/artifacts/api-server/src/middlewares/spaStatic.ts:53` `r.get("/{*splat}", …)` |
| vercel-monorepo-second-app-deploy | reference | PE lives at `apps/property-explorer` in hauska-map | VERIFIED | `hauska-map/apps/` contains `command-center/` and `property-explorer/` |
| cc-deploy-cmdcenter-blush-not-command-center-jade | reference | CC deploys to `cmdcenter` / `cmdcenter-blush.vercel.app` | VERIFIED | `_STATE.md` LIVE INFRA: "CC: `cmdcenter-blush.vercel.app`"; `_sessions/2026-08-04_ops9_wave_execution_claude_code.md:36` "cmdcenter LIVE with the v2 County Ledger (bundle index-DE1wozNI…)" |
| mcp-rate-limit-upstash-dead | project | Upstash rate-limit db dead, memory fallback active, replacement is a pickup | **STALE** | `_STATE.md` LIVE INFRA: "MCP: `hauska-mcp-server-00040-ctj` @100% tag `postgres-limiter` (T4 catch-up 2026-08-05: Postgres `ResilientRateLimitStore` PR #58 @ `b5f26de`; `/health` `rate_limit_store.state=ok`, `detail=postgres`; migration `010_rate_limit_counters` applied)". The pickup was DONE 2026-08-05 and the store moved to Postgres, not Upstash. Memory still says memory-fallback + pending pickup. |
| cloud-run-source-deploy-rotates-api-key | reference | `gcloud run deploy --source` rotates the API key, silent 401 downstream | VERIFIED | `_inbox/2026-08-03_DEPLOY_state_and_two_open_defects.md:44` "The `gcloud run deploy --source` of retrieval-api (rev 00054-wex) rotated `RETRIEVAL_API_KEY`… PE->retrieval 401" |
| cotality-hit-means-decommission-not-credential | feedback | Cotality is gated dormant; a live hit is wrong routing | VERIFIED | `_inbox/2026-08-01_fan_readiness_audit_VERDICT.md:54` "`readCotalityAppCredentials` → `no-coverage`, zero network | **CONFIRMED** — no live Cotality hit on default path" |
| regrid-purged-cotality-sole-spine | project | "Cotality is the sole parcel and property data spine" (headline) | **CONTRADICTED BY ITS OWN BODY + retired index** | body carries a 2026-07-13 update conceding "'Cotality for everything' no longer describes the active plan"; not in the index (orphan). See Contradictions §. |
| cotality-demo-quota-production-gate | project | "Production Cotality keys are the #1 launch blocker" | **SUPERSEDED** | Cotality is extinguished per the 2026-07-27 memory and `_STATE.md` standing decisions; keys are not a blocker because the vendor path is dead. Orphan (not in index). |
| cotality-oauth-three-keys | reference | per-product token hosts + Basic-auth shape | UNVERIFIABLE (and moot) | cannot probe a dead vendor; retained value is historical only. Orphan. |
| cotality-two-data-paths-map-cache-gap | project | Path A/Path B split, Path B cache now live | UNVERIFIABLE (and moot) | the Cotality paths are gated dormant; the memory's own header already flags the gap as HISTORICAL. Orphan. |
| cotality-swap-program-2026-07 | project | swap executed to production 2026-07-13/14; Cotality MCP eval agreement signed | VERIFIED (as history) | decision record `_decisions/2026-07-13_cotality_swap_public_record_migration.md` cited; the swap is reflected in the current county-GIS routing. Orphan. |
| feedback_premortem_skill_discipline | feedback | premortem-check RETIRED 2026-07-13 | VERIFIED as a ruling, but **CONTRADICTS CLAUDE.md** | see Contradictions § |
| agent-auth-and-fleet-state | project | cursor-agent binary at `C:\Users\cente\AppData\Local\cursor-agent\cursor-agent.ps1`, version 2026.07.01 | UNVERIFIABLE in this audit | did not probe the operator's local binary; version string is a month old and version claims of this kind rot fast |
| cc-agent-m-no-doc-repo-access | project | cc-agent-M cannot see `P:\doc_repo` | UNVERIFIABLE / likely OBSOLETE | evidence cited is from 2026-06-17. The current fleet model per `agent-auth-and-fleet-state` and observed August dispatches is planner-run Cursor + Claude subagents, not named cc-agent-* seats; no August dispatch is addressed to cc-agent-M. Framing is stale even if the underlying access fact was once true. |
| inbox-sweep-loop | feedback | `/loop 10m` inbox sweep, per-session | N/A (operator preference) | verbatim loop command recorded; nothing to verify against live state |
| doc-repo-concurrent-commit-hazard | project | shell CWD persists; check `git log -1` before committing | VERIFIED (behavioral) | confirmed live this session: bash tool CWD resets between calls in agent threads, absolute paths required |
| crlf-phantom-dirty | reference | autocrlf shows committed files as modified with zero diff | VERIFIED | session-start `git status` shows 35+ modified files against a clean recent commit — the exact phantom-dirty signature |
| stale-clone-rewind-trap | project | check `00_current_state` date + origin/main tip | N/A (procedure) | procedural rule, no live referent |
| merge-only-on-green-ci | feedback | gate merges on the conclusion STRING; src must never import `scripts/*.mjs` | N/A / partly checkable | the CI-string rule is procedure; the import ban would need a dep-test to be mechanical — none found |
| deploys-are-planner-owned | feedback | deploying and fixing failed deploys is the agent's job | N/A (operator ruling) | also restated in `_STATE.md` STANDING DECISIONS and `fleet_memory_practice.md` line 59 |
| standing-decisions-must-travel-in-dispatches | feedback | memory reaches planner only; must be pasted into dispatches | **VERIFIED — and still being violated** | 2/11 August dispatches carry the block. See Feedback Loop §. |
| FLEET-L3-GAP-template-replication-not-enforced | feedback | no mechanism enforces template replication; coherence carrier documented not built | **VERIFIED — STILL TRUE** | `_dispatches/_template.md` unchanged since 2026-05-27, contains no standing-decisions pull; 0/215 sessions carry the grade. See Feedback Loop §. |
| post-mortem-scan-fix-loop-drift | feedback | fail-closed gates + complete CC console; fewer agents tighter contracts | N/A (directional) | no single checkable referent |
| nested-agent-fan-orphan-trap | feedback | a coordinator that fans workers and returns abandons them | N/A (behavioral) | — |
| executor-dispatch-authorization-and-no-nesting | feedback | bake authorization context + no-nesting into every executor prompt | **PARTIALLY ADOPTED** | 5/11 August dispatches carry a no-nesting clause; 3/11 an Authorization section. e.g. `_dispatches/2026-08-05_76j_C1_rate_limit_store_replacement.md` "Deploys are planner-owned. Do the work in YOUR OWN context — do NOT spawn nested subagents." |
| area-sweep-not-parcel-sample | feedback | cert by sweeping every parcel, not sampling | VERIFIED as active practice | Wave-1 county certs in `00_current_state.md` are 20/20 cohort certs with cascade dry-runs, not spot samples |
| zoning-coverage-is-wired-city-not-data | project | low coverage % = stamp gap, not missing data | VERIFIED as a live class | `00_current_state.md` 2026-08-04 entry: "Bastrop's 50 = **48 REAL in-city district-stamp gaps**" — the memory correctly predicted the diagnosis class |
| bastrop-county-cities-scope-smithville-ecode360 | project | Smithville next via the scrape ruling | **SUPERSEDED** | `00_current_state.md` 2026-08-04: "**Smithville LIVE on prod /search** (#244 fix → full rebuild 47 units / 23,257 sections, Smithville 836 @ 1.00 eval → … 27,019 atoms)". Memory still says "Smithville next". |
| icc-contract-unblocks-icodes | project | eCode360 partnership retired 2026-08-04; scrape posture | VERIFIED | decision cited: `_decisions/2026-08-04_ecode360_partnership_retired_scrape_posture.md`; consistent with the Smithville outcome above |
| smart-site-rebrand-live-pe-prod | project | deployed 2026-08-03; title/favicon/landing deferred | UNVERIFIABLE without a live probe | no live fetch performed in this read-only audit |
| factory-product-serve-disconnect | project | RETRACTED — PE does serve certified atoms for warmed parcels | VERIFIED as retraction | consistent with the R6 gate verification in `_inbox/2026-08-03_DEPLOY_state_and_two_open_defects.md:44` ("34137 atom-chain ok F25/S5/R25") |
| vercel-cli-exit-code-vs-deployment-state | reference | exit 255 != deploy failed; judge by live alias/bundle | N/A / behavioral | consistent with the bundle-marker discipline used in `_STATE.md` LIVE INFRA |
| hauska-map-vercel-no-autodeploy | project | Vercel does NOT auto-deploy hauska-map on merge | VERIFIED | `_STATE.md` LIVE INFRA closes with "NOTE: Vercel does NOT auto-deploy on merge." |
| gcloud-uptime-path-mangle-msys | feedback | MSYS rewrites leading-slash `--path`; create from PowerShell | N/A (tooling gotcha, not re-probed) | plausible and consistent with this environment's Git Bash primary shell |
| cloud-run-traffic-trap / cloud-run-secret-and-traffic-gotchas / latest-tag-deploy-race / stale-watch-and-tag-traps / workflow-deploys-revert-manual-env / smartcity-api-deploy-canary-form / cortex-api-canary-deploy-and-set-secrets | mixed | Cloud Run deploy/traffic/secret mechanics | N/A to STALE-RISK | these are vendor-behavior claims, not repo claims; not re-probed. `smartcity-api-deploy-canary-form` is the highest stale risk — smartcity is under an absolute no-touch ruling per `repo-intent-rulings-2026-07`, so the memory is unlikely ever to be exercised or corrected |
| migration-merged-not-applied-to-deployment-neon | project | merged != applied; verify live schema | **VERIFIED — and recurred after the memory existed** | `_sessions/2026-08-04_ops9_wave_execution_claude_code.md:36` "migration 0065 hand-applied after the merged-not-applied class hit". Memory written 2026-06-10; class recurred 2026-08-04. |
| replit-neon-migration-gotchas | reference | lean/raw split + canary cutover | N/A / likely dormant | Replit is not in the current active stack |
| ldt-schema-fixture-and-hardcoded-lists / ldt-api-server-tests-local-baseline | project | ldt CI/test mechanics | N/A (procedural, CI-authoritative by design) | — |
| auth-deploy-orphans-anonymous-data | project | auth flips need anonymous path + claim flow | N/A (design rule) | still forward-looking; the tenancy leg is open per CLAUDE.md |
| radar-entitlement-install-id-not-user-aware / standalone-deep-dive-portal-direction / re-apps-inline-atom-chip-ux-catchup | project | Radar/PE product direction | PARTLY SUPERSEDED | `_STATE.md` C7 section: C7b LDT #366 and C7a extension #35 MERGED, "deploy + live verify owed". The entitlement memory reads as pending work; the code shipped. |
| aps-auth001-account-entitlement | reference | APS AUTH-001 is account entitlement, not app/secret | UNVERIFIABLE | external vendor claim, not re-probed |
| moodys-cre-declined / mox_prospect / fund-etf-ambition / skip-tx-ip-attorney-as-gate / gtm-pivot-2026-07 / repo-intent-rulings-2026-07 / partnership-first-retired / no-special-data-access / bastrop_pioneer_narrative / eci_internal_app / check-substrate-placement-against-decoupling / brief-coverage-websearch-fallback / command-center-is-the-spine-console | mixed | positioning, rulings, relationships | N/A (judgment/ruling) | no live-state referent to check |
| feedback-* (no-timeframes, md-diagrams-default, explore-mode, recalibrate, flag-naming, always-copy-paste-ready, explicit-placeholder, cloud-shell-is-bash, dispatch-no-nonexiting-commands, tmp-clone-recycle, premature-background-notification) | feedback | operator communication + working-style preferences | N/A | pure preference; correctly typed `feedback` |
| verify-identifiers-against-live-source | feedback | `gh pr list` for real state; docs lag | N/A (procedure) — and endorsed by this audit's own findings | every STALE verdict above is an instance of docs/memory lagging live state |
| hauska-npm-scope-publish-gated | reference | npm publish autonomous since 07-07, no operator gate | VERIFIED (consistent) | `agent-auth-and-fleet-state` records npm authed as `hauska-sdk` in the user `~/.npmrc`, inherited by subagents. Note the FILENAME still says "gated" while the content says autonomous — a naming trap for index-scanners. |

Summary of verdicts on checkable claims: **13 VERIFIED**, **2 STALE**, **4 SUPERSEDED**, **1 partially superseded (sdk-metering)**, **5 UNVERIFIABLE**, remainder N/A.

Accuracy on repo-level technical claims (paths, headers, enums, config keys) is excellent — 11 of 11 checked resolved exactly. Every failure is a **shipped-but-not-written-back** failure: the memory described a gap, the gap got fixed, and nobody went back to retire the memory.

## Contradictions

### 1. premortem-check: memory retires it, CLAUDE.md still mandates it

`CLAUDE.md` line 39, verbatim:

> Every architectural and strategic move checks against these. Use the `premortem-check` skill before any commitment.

`CLAUDE.md` line 75, verbatim:

> For load-bearing commitments, never let a yellow from premortem-check slide.

`memory/feedback_premortem_skill_discipline.md`, verbatim:

> **Superseded 2026-07-13 (operator ruling, Cotality-swap program session).** Nick: "ignore our formal premortem its outdated... whats more important is that you run adversarial reviews on the plan and the subagents work and coordinate pulling it together."
> - Do NOT invoke premortem-check unless Nick explicitly asks. Do not present green/yellow/red commitment scorecards.

Also `CLAUDE.md` line 73, verbatim: "Three are stress-tested (premortem-check, source-required, decision-log)". This is a direct, unresolved conflict that has stood for 26 days. A fresh planner reading CLAUDE.md top-down will run the retired skill. The memory's own rule 4 ("When a decision is reversed, RETIRE/rewrite the memory AND its index line same-session") was applied to the memory but not to CLAUDE.md.

### 2. Cotality spine: orphan memory vs standing decision

`memory/regrid-purged-cotality-sole-spine.md` description field, verbatim:

> Regrid was purged 2026-06-17; Cotality is the sole parcel and property data spine. Do not reintroduce Regrid.

`_STATE.md` STANDING DECISIONS, verbatim:

> - COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.

The memory body does carry a 2026-07-13 correction, but the **description field** — the line an agent sees first when a file is surfaced — still asserts Cotality is the sole spine. This is precisely the failure mode `standing-decisions-must-travel-in-dispatches` rule 3 names: "a stale index line (e.g. 'Cotality is sole spine' after it was reversed) actively misleads." The index line was fixed by removing the row entirely; the file's own description was not.

### 3. `sdk-metering-seam-unwired` vs live hauska-mcp-server

Memory, verbatim:

> hauska-mcp-server (the gate) has ZERO `@hauska-sdk/*` dependencies

Live `hauska-mcp-server/package.json:22`, verbatim:

> `"@hauska-sdk/metering": "^0.1.1",`

The memory is titled "unwired" and is still indexed as an open violation of ADR-018. It shipped.

### 4. Filename vs content: `hauska-npm-scope-publish-gated`

Filename asserts "publish-gated". Index line and content assert "npm publish is autonomous everywhere — autonomous since 07-07; no operator gate." Not load-bearing, but it is the exact class `flag-naming-inconsistencies-early` exists to catch, present inside the memory store itself.

## Index integrity

- Index rows: **81**. Memory files (excluding `MEMORY.md`): **86**.
- Dangling rows (index points at a nonexistent file): **0**. Clean.
- Orphan files (file exists, no index row): **5**, all Cotality/Regrid:
  - `cotality-demo-quota-production-gate.md`
  - `cotality-oauth-three-keys.md`
  - `cotality-swap-program-2026-07.md`
  - `cotality-two-data-paths-map-cache-gap.md`
  - `regrid-purged-cotality-sole-spine.md`

Read charitably, this was a deliberate de-indexing when Cotality was extinguished on 2026-07-27. But `standing-decisions-must-travel-in-dispatches` rule 4 says "RETIRE/rewrite the memory AND its index line same-session" — the index line was removed and the file was left intact and un-annotated. The files are still loadable and still contain live-sounding assertions ("Production Cotality keys are therefore the **#1 launch blocker**", "Cotality is the sole parcel and property data spine"). Half-retirement: invisible to an index scan, fully visible to a filename or semantic search. That is worse than either full deletion or a clearly-stamped RETIRED header.

Other index observations:
- Frontmatter is inconsistent. Only 18 of 86 files carry a `metadata.modified` timestamp — the other 68 have no in-file date at all, so age can only be inferred from filesystem mtime. There is no `created` field anywhere. A memory cannot be aged out on a rule if its own age is not recorded.
- The `user` type in the documented schema is unused (0 files).
- 2 files lack `metadata.type` entirely.

## PART B — Feedback loop assessment

### B1. Is there a mechanism that auto-injects standing decisions into dispatches?

**No. It is purely a human/planner copy step, and it is applied inconsistently.**

`_dispatches/_template.md` frontmatter: `last_updated: 2026-05-27`. Its full contents are model selection (HR-12), atoms to resolve, read-first list, workspace ownership, scope, acceptance criteria, reporting. There is **no standing-decisions block, no fleet-memory block, no authorization block, no no-nesting clause, and no frozen-artifact list**. The template is 73 days older than the memory that says the template must carry these.

Measured injection rates (grep over `_dispatches/*.md`):

| block | August dispatches (11) | all dispatches (312) |
|---|---|---|
| STANDING DECISIONS | 2 | 18 |
| Authorization section | 3 | — |
| no-nesting clause | 5 | — |
| FLEET MEMORY block | **0** | 17 |

The FLEET MEMORY block is the sharpest signal. `90_runbooks/fleet_memory_practice.md` line 49 says, verbatim: "cc-agent dispatch rule block (paste verbatim into every sprint dispatch)". Zero August dispatches contain it. The Tier-2 capture practice — the thing that is supposed to feed Tier-1 promotion — is not reaching executors at all in the current month.

**Verdict on `FLEET-L3-GAP-template-replication-not-enforced`: STILL TRUE, unchanged.** Its "how to apply" item (3) reads, verbatim:

> (3) A structural coherence carrier: dispatch templates that PULL the current standing-decisions + the frozen-artifact list, so an executor literally cannot start without them. Until these exist, EVERY handoff is exposed to this failure.

Those templates do not exist. `64_recursive_loop/04_instantiations.md:87` names this same rung as "The DIVERGENCE GATE (structural coherence carrier + operate-don't-rebuild enforcement)" and calls it "the rung whose absence caused the 2026-08-02 incident." It is still absent.

**Partial credit where earned.** `_STATE.md` now carries a STANDING DECISIONS block (5 rules), and `.cursor/rules/read-state-first.mdc` is `alwaysApply: true` and instructs every Cursor seat to read `_STATE.md` then `MEMORY.md` before any substantive work, restating the five standing decisions inline. That is a real structural improvement over 2026-07-28 and it does reach Cursor seats automatically. Two gaps remain: (a) it does not reach Claude subagents, which do not read `.cursor/rules/`, and this audit's own dispatch is proof — the parent had to paste context manually; (b) an always-apply rule that says "go read a file" is weaker than content physically present in the prompt, which is exactly the distinction the memory draws ("Do NOT assume the agent will read the doc repo or memory — it won't reliably").

### B2. Are `.cursor/rules/fleet-memory.mdc` present in the product repos, and are they current?

**Present in all four reachable product repos.** Contents are near-identical.

| repo | file | size | mtime | delta vs doc_repo |
|---|---|---|---|---|
| `P:\doc_repo` | fleet-memory.mdc | 1569 B | 2026-07-25 | canonical; adds "Full practice: `90_runbooks/fleet_memory_practice.md`" and the M0/27-master framing |
| `P:\hauska-engine` | fleet-memory.mdc | 1444 B | 2026-08-02 | identical 5 rules, doc_repo path references stripped |
| `P:\hauska-map` | fleet-memory.mdc | 1444 B | 2026-08-02 | identical |
| `P:\hauska-mcp-server` | fleet-memory.mdc | 1444 B | 2026-08-05 | identical |
| `P:\legacy-design-tools` | fleet-memory.mdc | 1428 B | 2026-08-05 | identical (minor whitespace) |

They are **current, not stale copies** — the five rules match the canonical practice doc. Note this itself supersedes `fleet_memory_practice.md` line 47, verbatim: "cc-agent half (product repos ldt/engine/map — **which have no `.cursor/rules/` today**)". They now do. That doc line should be corrected.

Only `P:\doc_repo` carries the other two rules (`read-state-first.mdc`, `wdll-practice.mdc`). Product repos get fleet-memory only — so an executor working in hauska-engine is told to capture to `_scratch/` but is **not** told to read `_STATE.md` or the standing decisions first. That is the coherence-carrier hole restated at the rules layer. `hauska-engine` does have a `_scratch/` directory, so Tier-2 capture is at least physically wired there.

### B3. Is there any mechanism that captures a lesson from a FAILURE and writes it back automatically?

**No. Every memory is hand-written by the planner, and this is by design.**

`90_runbooks/fleet_memory_practice.md` rule 4, verbatim:

> Do NOT promote to durable memory (MEMORY.md, tests, docs) yourself. Leave the LESSON in the scratch file; the planner gates promotion. An autonomous memory-writer is the drift shape this practice exists to kill.

The design is defensible — an unsupervised memory-writer would pollute the store. The problem is the substitute has no trigger. Promotion is specified as "The planner reviews at session close (or when a scratch file accumulates promotable lessons)". There is no checklist item outside § 2C-bis, no queue, no count of pending promotions, and § 2C-bis has never run (B4). So promotion happens when the planner happens to remember.

Evidence it happens ad hoc and does work when it fires: `_inbox/2026-08-03_DEPLOY_state_and_two_open_defects.md:44` ends "Lesson captured: memory cloud-run-source-deploy-rotates-api-key" — a real failure produced a real memory the same day. That is the loop working, once, manually.

Evidence of the counter-case: `_STATE.md` FD5b section contains, verbatim:

> - **LESSON (mold candidate): a paid report's headline number needs a TWO-SIDED live honesty probe against an independent authoritative signal, not just a one-sided sanity bound.**

That LESSON is dated 2026-07-30, is explicitly flagged as a promotion candidate, is a high-value generalizable gate ("belongs in the mold as a gate for every modeled headline stat"), and **there is no corresponding memory file for it 9 days later**. It sits in `_STATE.md` where it will be edited away when the FD5 section closes. That is a promotion queue with no drain.

Tier 2 capture is alive: `_scratch/` holds 11+ active workstream files (`t1-data-accuracy.md`, `t5-factory-throughput.md`, `t6-roster-recon.md`, `76j-workstream-c.md`, etc.), most touched within the last three days. The capture half works. The promotion half is unstaffed.

Also missing: `fleet_memory_practice.md` ranks a MECHANICAL GUARD above prose as the promotion form. The store is **100% prose** — 86 markdown files, 0 tests. Two memories explicitly prescribe a CI guard that was never built: `sdk-metering-seam-unwired` ("add a CI conformance test that fails if the `@hauska-sdk/*` dep or import disappears" — no such test in `hauska-mcp-server`) and `merge-only-on-green-ci` ("src must never import scripts/*.mjs" — no dep-test found). The strongest promotion form has been used zero times.

### B4. Do the session-close protocol docs require a memory-write step?

**Yes — `session_close_template.md` does, in detail. It has never been executed.**

`90_runbooks/session_close_template.md` § 2C-bis, verbatim (lines 126-140):

> ### 2C-bis. Grade the fleet memory (fired / helped / harmed + trap-recurrence)
>
> The fleet's L3 retirement rung (per `64_recursive_loop/04_instantiations`): a memory or rule that is never graded against outcome can silently rot into a HARMFUL un-retired memory (e.g. the three-gate MCP enum asserted a month after the four-gate rework). Selection pressure on the memory set is what keeps it honest. At session close, the planner records two things — cheap, and the prerequisite for every L3 memory behavior:
>
> 1. FIRED / HELPED / HARMED — a one-line stamp per memory or standing rule that actually influenced this session:
>    - `FIRED` — it came up and was applied.
>    - `HELPED` — it prevented a mistake or saved rediscovery (name the mistake avoided).
>    - `HARMED` — it was wrong, stale, or misleading and cost the session something (name the cost). A HARMED memory is RETIRED or corrected same-session (delete/fix the memory file + its MEMORY.md line), never left to rot.
>    A memory that neither helped nor harmed and keeps not-firing is a candidate for retirement (it may be dead weight).
>
> 2. TRAP-RECURRENCE QUESTION — "did any recorded trap class recur this session, and which memory should have prevented it?" ...
>
> 3. DIVERGENCE / REBUILD CHECK (the fleet L3 gate, per `_decisions/2026-08-02_operate_the_factory_never_rebuild_it`) — "did any executor this session BUILD NEW machinery when a FROZEN, PROVEN artifact already existed...?"
>
> Record these in the session summary (Stage 2A). This is a protocol step, not a build — but it is the selection pressure that makes the memory system L3 instead of an ever-growing pile of unverified prose.

Execution check:

```
grep -rl "HARMED" _sessions/   ->  0 files
total sessions in _sessions/   ->  215
```

The most recent session summary, `_sessions/2026-08-08_master_planner_session_close_claude_code.md`, contains no match for `memory`, `graded`, `HARMED`, `trap-recur`, `rebuild check`, or `divergence`.

`90_runbooks/current_state_protocol.md`: no memory step (grep for memory/remember returns nothing).
`01_doc_conventions.md`: no memory step (same).

So exactly one of three protocol docs requires it, it is the last substantive step before the commit gate, and it is skipped every time. Its own text predicted the exact failure it was meant to prevent — "the three-gate MCP enum asserted a month after the four-gate rework" — and this audit found the same class three more times (mcp-rate-limit-upstash-dead, sdk-metering-seam-unwired, bastrop-county-cities-scope).

### B5. Evidence of memories written and then VIOLATED anyway

Yes, three clear instances.

**1. `migration-merged-not-applied-to-deployment-neon` (written 2026-06-10) — recurred 2026-08-04.**
`_sessions/2026-08-04_ops9_wave_execution_claude_code.md:36`, verbatim:

> cortex-api 00477-sir serving the full v2 wire (migration 0065 hand-applied after the merged-not-applied class hit; both image-race deploys corrected with build-wait guards).

The memory names the class exactly. It fired 55 days later anyway. The same line also records "the ingest-route 404 image race" — the class covered by `latest-tag-deploy-race-verify-endpoint` and `stale-watch-and-tag-traps`. Two recorded trap classes recurred in one session, and neither was recorded as a HARMED/trap-recurrence signal because § 2C-bis was skipped.

**2. `cloud-run-source-deploy-rotates-api-key` — the memory's own index line records recurrence.**
`MEMORY.md` line 79, verbatim:

> — silent 401 downstream; sync keys on deploy; verify service-to-service path; fail-loud on 401 (bit cortex-api again 2026-08-03 — chat citations outage).

"bit cortex-api **again**" is the memory documenting its own failure to prevent recurrence, in its index line.

**3. `FLEET-L3-GAP-template-replication-not-enforced` — the meta-case.**
The memory's own text, verbatim:

> memory + explicit instructions + a frozen template were ALL in place and it STILL diverged — because none of them were a MECHANISM that fails closed on divergence.

And `64_recursive_loop/04_instantiations.md:85`, verbatim:

> the recursive-loop framework (64_recursive_loop) ALREADY DIAGNOSED this exact gap ~a month prior and it was never built... Operator: "clearly we didn't implement it in our own dev fleet."

Six days after that memory was written, the gate it demands still does not exist and the grading rung it demands has still never run. The memory about the memory system not enforcing itself is itself not enforced. That is the loop failing at its own meta-level, and it is the single most important finding in this audit.

**Adjacent evidence — `standing-decisions-must-travel-in-dispatches` was written after exactly this failure** (2026-07-27: a QA agent hit Cotality with no extinguish context and drifted into "rotate the credential"; memory text: "The operator was furious — justifiably — because this exact gap was named many times and not fixed"). The corrective is MANDATORY per the memory. Adoption in August: 2 of 11 dispatches. The memory did not prevent its own recurrence condition; it only documented it.

### Does the loop close? — plain answer

**No.**

A learning loop needs four legs: capture, promotion, distribution, and grading-with-retirement. Current state:

| leg | status | evidence |
|---|---|---|
| Capture (Tier 2) | **working** | 11+ live `_scratch/` files, updated within 3 days; `fleet-memory.mdc` installed in all 4 product repos |
| Promotion (Tier 2 → Tier 1) | **manual, untriggered, backlogged** | promotion fires ad hoc (08-03 key-rotation lesson) but the 07-30 two-sided-honesty-probe LESSON sits unpromoted 9 days on; 0 mechanical guards ever produced |
| Distribution (memory → executor) | **partial** | `read-state-first.mdc` reaches Cursor seats; dispatch injection is 2/11 for standing decisions, 0/11 for fleet-memory; `_dispatches/_template.md` unchanged since 05-27 |
| Grading + retirement | **NEVER RUN** | 0/215 sessions carry a FIRED/HELPED/HARMED stamp; 4 SUPERSEDED and 2 STALE memories found in this audit, all shipped-but-not-written-back |

Legs 2 and 4 are the ones that make it recursive rather than merely archival. Both are prose-only protocol steps with no mechanism and no trigger, and leg 4 has a 0% execution rate over the entire history of the repo. The system currently learns only when the planner personally remembers to make it learn — which is the definition of the drift shape `FLEET-L3-GAP` names.

The cheapest thing that would change this: § 2C-bis is already written and costs a few lines per session. It has never been run once. Running it would have caught every STALE and SUPERSEDED memory in Part A, because each was fixed during a session that closed without grading.

## WHAT I COULD NOT DETERMINE

- **Live service state.** No HTTP probes were made (read-only audit, no live curl against Cloud Run/Vercel). Every claim about serving revisions, `/health` bodies, tool counts, and deployed bundles is taken from `_STATE.md` and session records, not from live introspection. `_STATE.md` itself says "verify before quoting; they churn". Specifically unverified live: the 63-tools/four-gates count in CLAUDE.md, MCP `/health` `rate_limit_store.state=ok`, the Smart Site rebrand surface, PE bundle hashes.
- **Whether the five Cotality orphans were de-indexed deliberately or lost.** No decision record was found that says "de-index but retain these five files." The pattern (all five, one topic, coinciding with the 07-27 extinguish memory) strongly implies deliberate, but I could not confirm intent, and therefore could not determine whether leaving the files intact was a choice or an oversight.
- **Actual memory-injection rate into Claude subagent dispatches.** I measured `_dispatches/*.md` files. Many subagent dispatches this fleet runs are pasted directly into the Agent tool prompt and never written to `_dispatches/`, so the true injection rate could be higher or lower than 2/11. The `_dispatches/` sample is the only auditable surface.
- **Whether `.cursor/rules/` files are actually loaded by the Cursor seats in practice.** The files are present and marked `alwaysApply: true`, but I cannot observe whether a given Cursor agent run actually ingested them, or whether agents run in worktrees (`P:\hauska-engine-e-*`, `P:\ldt-*`, ~40 sibling clones exist) that lack the `.cursor/rules/` directory. This is a material gap: if executors typically run in worktrees rather than the canonical clone, the rules install may reach far fewer seats than the four-repo check suggests. I did not enumerate `.cursor/rules/` across the ~40 worktree directories.
- **Memory age and firing frequency.** 68 of 86 files carry no in-file date and there is no `created` field, no `last_fired` field, and no usage telemetry. I could not determine which memories have never fired — the "dead weight" retirement candidates § 2C-bis is designed to surface. Filesystem mtime is a poor proxy (it reflects last edit, not last use).
- **`agent-auth-and-fleet-state` cursor-agent version/binary.** Not probed; the operator's local install state was out of scope for a read-only repo audit.
- **Whether the named cc-agent-* seat model is still live at all.** No August dispatch addresses a cc-agent-* by name, which suggests the model changed to planner-run Cursor/Claude subagents, but I found no decision record retiring the seat naming, so `cc-agent-m-no-doc-repo-access` could not be conclusively marked obsolete.
