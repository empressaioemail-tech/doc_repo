---
date: 2026-08-24
agent: claude_code
repo: doc_repo
session_type: planning
memory_graded: [sdk-metering-seam-unwired:HARMED, mcp-rate-limit-upstash-dead:HARMED, dispatches-are-compiled-not-authored:HELPED, cloud-run-traffic-trap:HELPED, doc-repo-concurrent-commit-hazard:HELPED, text-search-cannot-answer-structural-questions:HELPED]
rolled_up: false
rolled_up_into:
---

## What was done

Opened the govtech thread on operator instruction: SmartCity Dashboards, the ICC demo, and plan review. These are OPS-17 lanes B, C and D, which had been paused since 2026-08-20 with the product line clear and zero open PRs.

Nine read-only code reviews ran against fresh depth-1 clones at `origin/main` in a scratch directory, so no seat working tree was read and every claim carries a snapshot. A five-agent remediation pass followed. Claims that reached durable artifacts were re-verified by the planner at source; several agent claims were corrected in the process and those corrections are recorded rather than dropped.

**A live data exposure was found and closed.** An unauthenticated request to `plan-review-app-ten.vercel.app/api/backend?path=/api/smart-files/folders&scopeType=tenant&scopeId=<tenant>` returned 200 with `tenant-private` folder listings for any tenant named. Reproduced across `icc-demo`, `template-city` and `acme`. Two independent defects composed it: the BFF attached the Smart Files service token for any caller, and Smart Files enforces scope on writes only. Closed by plan-review PR #6, merged and **deployed**, then verified on the live surface in six cases: anonymous 401, cross-org 403 both directions, own-org 200 both, malformed persona 401. Only demo tenants existed, which was timing rather than a control.

**A govtech seat was created and registered.** `smartcity-dashboards`, `smart-files`, `plan-review` and `icc-portal` moved off property. `smartcity-os` deliberately stayed with property and stays absolute no-touch: it is this seat's subject, not its property. No branch is pinned on the product entries because a product seat ships through per-PR feature branches. The register named worktrees that did not exist; creating them was part of the work.

**Shipped, all merged and green:**

| repo | PR | what |
|---|---|---|
| plan-review | #6 | Smart Files BFF scope gate, plus the repository's first CI |
| plan-review | #7 | code lookup refuses instead of citing a neighbour; IRC-as-IBC seed deleted; client-side citation synthesiser removed |
| smartcity-dashboards | #39 | five read-path fail-opens closed; 437 to 455 tests |
| hauska-engine | #361 | accessPolicy fail-closed at the writer (property seat) |
| hauska-mcp-server | #75 | ICC meter bypass and detector split (substrate seat) |
| hauska-sdk | #3, #4 | publish glob, and a check that was not total (substrate seat) |

**Five operator rulings were taken**, plus three more during the session. PermitFlow extinguished. Intake is staff upload. Wave 1 runs on `template-city`, not Bastrop. The finding engine migrates out of `hauska-engine` into `plan-review`. Smart Files serves the whole city and must not depend on buying plan review, with plan review and SmartCity as peer consumers. One app acceptable if each product stays independently deployable and sellable. SmartSite parked. Fourth demo pack approved. `source_obligation_ledger` is authoritative. The architect plan-review surface is deferred, not retired.

Artifacts produced: `_inbox/2026-08-24_govtech_program_scope.md` (five scopes, roughly ninety items, six ordering constraints), `_state/govtech/STATE.md`, an S5-1 transaction contract and an S2-1 migration plan (both still in scratch, not yet filed).

## What was learned (changes to ground truth)

**One defect class runs through five repositories.** Enforcement and provenance are written on the write path and absent on the read path, and defaults are fabricated rather than refused. Ten instances, found independently by reviews that were not told to look for it. This is the single most important finding of the session and it is what the integration scope now owns, because a lane that fixes its own instance leaves the class unowned.

**Bastrop v2 is a product capability build, not a data migration.** `composeDomain` in smartcity-dashboards has exactly two outcomes: generate fixtures, or state an absence. `grantedAdapters` is validated, stored and counted, and read by one consumer. `origin: "feed"` is a declared enum value nothing produces. A staging pack returns `no-fixture-source` on all eleven domains. **The product has never read a real record**, which is precisely why finishing the template first would never have surfaced it.

**A pack selects and re-seeds; it does not author.** A generator receives `(pack, seedFor)` and reads two fields, and `cityKey` is itself the seed. The fourth demo pack cannot deliver a full demo city; all richness lives in `src/domains/*.mjs` and the UI.

**PermitFlow has no document handling at all.** All 141 dependencies enumerated: no multer, no busboy, no GCS, no S3. `pf_documents` is a metadata row with a `fileUrl` nothing uploads to. Plan review is a first implementation, not a migration with rollback risk. This materially de-risked the sequencing.

**Live Bastrop dashboard numbers include fabricated constants.** `ai-assistant.ts:3449-3452` renders `"706"`, `"84"`, `"142"` and `"$47.2M"` as fallbacks that are byte-identical in presentation to measured values. The G-18 inventory recorded "Open Work Orders 142" from a live probe; 142 is the literal. "Fleet Vehicles 84" is unfalsifiable from outside because 84 is both the fallback and what Samsara returns.

**There are four homes for plan review logic and the one that is sold is the weakest.** The plan-review service duplicates rather than delegates: its only outbound hosts are the ICC API, a map embed, the MCP server and its own app, and it explicitly refuses cortex-api as a backend. Its code lookup resolved `IBC_SEED.find(...) || chapterHits[0] || IBC_SEED[0]`, so any section outside a two-element array returned 200 with a neighbouring section as the answer, on a surface ICC sees.

**The engine's only production consumer is not plan-review.** It is `legacy-design-tools/api-server/routes/findings.ts`. The migration moves the engine away from its only caller. The ruling still stands on the layer rule, but this reverses the network hop rather than removing it, and it creates a canon conflict: ADR-023 designates `legacy-design-tools` as holding the plan review engine.

**There are two ICC ledgers.** `plan_review_activity` works, carries a `0.01` fixture rate, and is what the live ICC portal renders. `source_obligation_ledger` is the designated source of truth, lands `amount_minor NULL`, and had zero readers. The gap is that the future source of truth sees none of it, not that nothing is counted, and a naive fix double-counts on reconciliation.

**The access-policy fail-open was never ICC-specific.** Pre-fix `atomize()` applied its `accessPolicy` option to one atom, the jurisdiction-corpus, so an ingest that correctly declared a non-public policy stamped one atom and let everything beneath it default. Pre-fix `extractModelCodeAtoms` stamped `platform-internal` on `code-section` only; edition, definition and cross-reference carried no policy. The exposure is the code corpus, **not** the roughly 100M-row store, because parcel, road and flood data is public-record and the default happened to be right there.

**Absent I-Code bodies are the licence working, not a gap.** The serving surface states `bodyVerbatim=false`, and the contracted posture per `75n` is deep-link display. An earlier planner statement to the contrary was wrong.

**Two services already spell the same absence oppositely.** Smart Files writes `absent-verified`; plan-review writes `verified-absent`. Each satisfies its own vocabulary, so no check catches it. That is the S5-1 failure mode already realised between two lanes, and it is the strongest argument for writing the contract before the lanes build.

**Branch protection is absent on every govtech repo.** `plan-review`, `smartcity-dashboards`, `smart-files`, `smartcity-kit` and `icc-portal` all read `protected: false` with no rulesets, verified by two instruments against a positive control. Stage 1 on 2026-08-20 covered six repos and never covered these. **The 2026-08-20 VPAT scope map states protection is present on all four product repositories; that sentence is wrong.** It does not require a correction to the shipped ACR, whose stated conclusion was that green is a courtesy and nothing blocks a release.

**Control observations, three, none acted on unilaterally.** The canon gate cannot distinguish an in-seat read-only subagent from a hand-carried executor dispatch, and it resolved repo names out of "do not read this path" warnings. The seat gate blocks `Write` but not `Edit`, and keys on cwd rather than the write target. The `CLOSE_OVERRIDE` hatch has no reason field, only `target=` and `cwd=`, which is the documented weakness; it was used once this session, deliberately and after checking what it records.

## What is still open

**Blocked on property:** migration 010 is not applied and the accessPolicy backfill has not run, both needing a DSN to `hauska_mcp`. Until then old code-corpus rows stay mis-stamped and the ICC withhold at `hauska-mcp-server/src/access-policy.ts` is load-bearing. Substrate is correctly parked behind it and said so in its close.

**Residual found after property's merge:** `packages/storage/scripts/load-snapshot-into-pg.mjs:107,197` writes atoms to Postgres directly and bypasses the new `resolveAccessPolicyOrRefuse`. Three references in the repo. Not in property's leave-behind; should be. Two further `?? "public-free"` defaults in `road-intake` and `depth-warm` are SmartSite territory and were relayed to that thread rather than ruled on here.

**Not deployed.** plan-review #7 and dashboards #39 are merged and **not deployed**. plan-review's two halves must deploy together: the server now refuses unknown sections, and the pre-#7 UI synthesises a citation whenever the server sends none, so deploying the service without the app would reinstate the fabrication one layer out.

**Owed by the planner, not done:** file the S5-1 contract and S2-1 migration plan into the doc set (both sit in scratch, which is not a durable read path); correct S2-2 in the scope doc, which still says "retire home A" against a ruling of defer; add the OPS-17 amendment rows so this work compiles through `dispatch.mjs`; compact `MEMORY.md`, which is over its size limit.

**Open rulings, none blocking:** the ICC rate model (planner recommends flat per-reference), spireon and `patrol-vehicles` (recommends keeping it ungranted, since it is the only running proof that `ungranted` is implemented), the Stage 2 reliability-report gate, the ADR-023 canon conflict, and the definition of the six Connections disposition values, which nobody could find anywhere.

**Carried from the seats:** `chat.ts` still accepts `mode: "mock"`, a fourth door E-2 did not close. Substrate's violation runs produce ledger-shaped events that must be excluded from any production obligation count. Substrate's registered `_state/substrate` doc_repo worktree does not exist, the same defect the govtech seat hit; worth sweeping all five seats rather than fixing one at a time.

## Suggested canonical doc updates

`90_operations/OPS-17_govtech_stack_plan_of_record.md` needs amendment rows for this session: the govtech seat, the eight rulings, PRs #6, #7 and #39, and the five scopes. Without them this work has no plan row and cannot compile through `scripts/dispatch.mjs`.

`_inbox/2026-08-20_vpat_scope_map.md` should be corrected: its branch-protection sentence is false. Note explicitly that the shipped ACR needs no correction, so nobody re-opens the Vertosoft artifact.

`80_adrs/adr_023_cortex_reporting_repo_designation.md` needs an amendment or a superseding record. It designates `legacy-design-tools` as holding the plan review engine; the 2026-08-24 ruling moves it to `plan-review`. Both currently stand on the record.

`_smartcity_masters/31_smartcity_dashboards.md` should record that Finance and Citizen are static markup with no data path, since `SCOS-DASH-DEP` sells all four lead lenses at 65,000 dollars.

`61_enforcement_doctrine.md` may warrant an instance entry for the read-path defect class: ten instances in five repos, found by reviews not looking for it, which is a stronger form of the pattern the doctrine already names.

`00_current_state.md` fires 2 and 3 are stale. Fire 2 named the ICC demo path as stopped; this session reopened and advanced it. Fire 3 named the dirty tree; it is now 1,655 untracked files from several sessions and wants its own decision rather than a standing note.
