# Next-wave planning agent — handoff (2026-07-09)

You are the planning agent executing the next wave in `P:\doc_repo`. This file is the authoritative entry point as of 2026-07-09; it supersedes `_dispatches/2026-07-07_master-planning-agent-handoff.md` as the starting document (that file and `_dispatches/2026-07-07_next-planning-agent-handoff.md` remain the trap/probe-hygiene DETAIL references).

## Read order

1. This file.
2. `_inbox/2026-07-06_three_lane_program_STATUS.md` — live tracker; the 2026-07-08 verification-log entries at the top of the log carry this wave's ground truth with evidence.
3. `_sessions/2026-07-08_ground_truth_and_demo_sprint_claude_code.md` — the session narrative behind current state.
4. `00_current_state.md` (2026-07-08 section first).
5. If touching O&G: `_decisions/2026-07-07_c7_winkler_baseline_reeves_target.md`, `_verticals/oil_gas/85c_og_app_review_meeting_digest.md`, `80_adrs/adr_025_og_atom_ontology.md`.
6. The 2026-07-07 handoff pair for per-item exit criteria, probe-key hygiene, and the accumulated trap lists — still binding verbatim.

## Execution model (unchanged, non-negotiable)

Planner plans/reviews/verifies/merges/deploys; cursor-agent (or Claude subagents) builds in fresh `P:\tmp\lane-*` clones (CURSOR_TASK.md pattern; push-after-first-commit; EXIT-BOUNDED verification only — never dev servers). Verification is never delegated: re-run suites, read generated artifacts, live-probe prod after EVERY deploy. Merge only on green CI on the exact head (compare `headRefOid`) and NEVER in the same command chain as the check — this rule was broken once on 2026-07-08 (engine #91, red proved flaky, logged as a process slip); do not repeat it. Executor reports lie under pressure: two C6 rounds were REFUSED for fabricated data (placeholder coordinates, invented well numbers); demand real-source invariants in every dispatch and check artifact numbers against independent ground truth. Concurrent sessions share this clone: `git log -3` + explicit-path staging before every doc_repo commit.

## Where we are (live-verified 2026-07-08 ~01:00, re-verify against gh/npm/gcloud/Vercel before acting)

| Area | State |
|---|---|
| Property Brief landing | **LIVE: property-brief-blue.vercel.app** (Vercel project `property-brief`, source `web/` in hauska-brief-extension, env LDT_API_URL points at cortex-api — api-server lacks SERVICE_API_KEY). Live-verified: cited brief e2e (lineage atom ids, Municode citations, confidence), commercial place-resolve 200. This is the operator's ICC demo surface |
| Command center | **Closed for heavy testing**: every tile endpoint family probes 200 through the proxy. cortex-api `00312-ceh` @100% under enforce (rollback `00308-vuj`) carrying ldt #239 (setbacks key normalization + gis-layers service tier bypass), #240 (findings-500: provenance hydration for ICC supplement citation ids), #241 (place routes service-caller auth). hauska-map #18 (PROXY_CONTRACT ground-truth rewrite — read it; the SPA-fallthrough gotcha explains "HTML 200 = wrong path, not auth") + #19 (proxy mutation allowlist for plan-review BFF sub-resources) merged + cmdcenter redeployed |
| ICC citation leg | **COMPLETE e2e on prod under enforce.** Scratch engagement `33ba88d7` (bastrop-tx) is KEPT deliberately — it is the populated walkthrough demo: geocoded parcel, uploaded demo plan PDF in the dataroom, compliance findings citing IBC 1612.3/1612.4 labeled "(ICC model code)". Do not delete it |
| og-twin | og-twin.vercel.app clean (938 mojibake sequences repaired, PR #2; the doc_repo mockup asset repaired too; root-cause class: this machine's cp1252 console). Still serving labeled SEEDED data |
| C6 Reeves mint | **Pagination SOLVED planner-direct** on branch `feat/c6-reeves-mint` (engine PR #90, OPEN, marked WIP): the EWA app is Struts; pager is plain GET links (pager.pageSize/pager.offset + searchArgs.paramValue); full fetch live-verified: 3,887 banner rows over 39 pages → 2,696 distinct permits (delta = amendment rows), 100% REEVES, 86 operators, ~31s. Parser rewritten for the real 14-column layout; `apiNumber` honestly optional; normalization REFUSES instead of fabricating. **Fabrication root cause: WELL_SCHEMA requires surfaceLocation/wellName/wellNumber the W-1 results grain cannot supply, and ./og has NO permit type — ADR-025 follow-up filed in the tracker** |
| C7 Winkler title baseline | **MERGED (engine #91)**: 99.5% parse (643/646 rows), 476 instruments scoped to S/2SW4 Sec 25 Blk B-5, explicit gaps, 8-entry variance ledger, 34/34 tests. Grade honestly **UNGRADEABLE-YET**: the certified WI report's exhibit pages are an image scan with a garbage OCR layer; grading harness is built and waits on the answer key (operator ask). WI math v0 is a declared stub |
| Extension | B2 MERGED (#6: Empressa rebrand R1, ENDPOINTS.md auth inventory, 06-18 QA classes re-verified); #3 closed as contained-in-main. B3 live browser QA NOT run |
| Publishing / MCP | Unchanged: publishing autonomous; MCP `00022-zeh` 63 tools, metering live, health "degraded" by the known dead Upstash (memory fallback) |
| Docs landed this wave | `_verticals/commercial/` (offering per the no-Moody's stack; Moody's econ DECLINED too — CRE record amended), `_decisions/2026-07-07_c7_winkler_baseline_reeves_target.md`, `_verticals/oil_gas/85c_og_app_review_meeting_digest.md` (+ transcript in assets/transcripts/) |

## THE QUEUE (dependency order; no timeframes; stack and execute)

1. **C6 finish → og-twin seeded→live flip.** The hard part is done (paginated client on the branch). Remaining, mechanical: rewrite og-mint normalize to honest **permit-grain records** (documented local type; NO contract well atoms — the schema cannot be honestly satisfied at this grain; never fabricate fields), regenerate report/sample/twin-export from a real run, eval with anti-fabrication invariants (county purity 389, zero (0,0) coords, distinct-count band vs banner, allocation+PSA ratio band vs the 53% baseline), merge #90 on green, then flip og-twin's TwinDataSource to the real export (`?source=live` default with provenance badge; keep seeded/synthetic toggles; tripwire tests). Superseded artifacts from refused rounds are still on the branch — regenerate everything.
2. **Deposit→atom citation-lineage attribution** — M1's named bottleneck, the calibration program's next build (same family as F1 atom-grain read attribution). Sources: `_inbox/2026-07-07_legacy-design-tools_m1c_case-grain.md`, `_calibrated_spine_roadmap/`. Engine/ldt merge queues serialize with item 1.
3. **B3 extension live QA loop** (06-17/18 pattern: listing → parse → cited brief → deep-dive → map) — needs a real browser session; coordinate with the operator or run against prod with the extension loaded. Extension key rotation is operator-owed AFTER this QA (standing ruling).
4. **Discoverability** (llms.txt + MCP registry listing + public catalog page = the Phase-1 GTM exit) and the **Radar launch chain** (Web Store listing + landing origin; both Cotality-independent) — these are the two standing drifts (D1/D4, three sessions running). The operator owes a re-sequencing call; if none arrives, RAISE IT at the first walk-through — do not let it slide a fourth session.
5. **OG follow-through (gated on arrivals, do not start early):** C7 grading completes when the operator/Herbert supplies a readable WI-exhibit answer key (harness ready). Role/journey skeleton + agenda pre-work for the EOG land-admin attorney and Trace calls (draft from the 85c transcript; Chris's format). TexasFile commercial evaluation (pricing/ToS/derived-atom redistribution rights) as a bizops item.
6. **Hygiene:** icc-demo SOURCE IS LOST (Vercel project is CLI-deployed, git-disconnected; repo is docs-only) — rebuild the small Vite app into the icc-demo repo with Empressa branding, then redeploy (fixes the retired "Powered by Hauska Engine — hauska.dev" footer, which is LIVE on a public page); branch close-or-land sweep (six unPR'd hauska-mcp-server branches with commits, hauska-map `feat/icc-demo-surface`, atom-contract `rescue/1.5.0-...`, engine #75); Upstash replacement; CLAUDE.md staleness (@hauska/atom-contract now 1.6.1 on npm; contract story moved to @empressaio 1.7.0); gtm_mcp_event 400; metering-summary anon 403-vs-401; engine-api enforce decision (caller inventory first); eval-scores curated queries.

## Waiting on the operator (context; do NOT nag)

| Item | Gates |
|---|---|
| C7 answer key: readable WI-report exhibit or Herbert's owner/interest table values | The first real title-method grade |
| Heavy QA of cmdcenter + landing (screenshots = defect spec) | Next command-center round |
| Cotality production keys (operator says imminent) — sync BOTH legacy-design-tools-prod AND hauska-prod-497015 | Engine map envelope 2/7 layers |
| Chris design + Herbert UX direction (meetings happened 2026-07-08; outcomes not yet relayed) | og-twin UI rounds (still externally gated) |
| Discoverability + Radar-chain re-sequencing call | Queue item 4 |
| Standing: Stripe test key (billed-counts display only); Moody's close-out reply when the rep email arrives; extension key rotation post-B3 | — |

## Parked / other threads (do not open without the operator)

- **Bastrop**: deliberately parked; separate thread (`_dispatches/2026-07-01_bastrop_plan_review_thread.md`). Folds in as a major chunk on the operator's signal only.
- **Red Sands / Garrett (trade desk, counterparty registry, carbon MRV)**: ideation with the operator in progress — NOT an execution lane. Gate: Garrett's own artifacts (deal-flow straw man, 80-item tank-farm checklist, acronym sheet, ~2 weeks from 2026-07-08). One background task is fair game if the operator asks: an independent verification pass on TradeX Fuel Exchange Inc. Hard line regardless: any build in that world stops at the workflow/verification/documents layer; never touch or route transaction funds without compliance counsel (sanctions adjacency is explicit in the transcript).
- **Brett Richard / Kopke & Marek family office**: meeting prep delivered in-chat 2026-07-09; outcome not yet captured. If the operator brings notes, file to `_prospects/`.
- **smartcity-os**: absolute no-touch (open PR #24 is the operator's).
- **`P:\tmp\lane-m1-c`** holds the M1 calibration deposit artifacts (136k rows) — do NOT delete until archived.

## Traps added this wave (beyond the 07-06/07-07 lists, which remain binding)

- This machine's console is cp1252: it is the mojibake factory. Never print non-ASCII through PowerShell/Bash pipelines into files; write files with the Write tool or explicit UTF-8; heredocs mangle non-ASCII.
- curl.exe fails TLS on this machine (exit 35) — use PowerShell Invoke-WebRequest (TLS 1.2) for probes.
- Vercel: `vercel ls <project>` to confirm target=production; the prod alias serves the latest production deployment — verify by bundle hash, and note minified bundles defeat identifier greps (grep for user-visible STRINGS, or compare a local build's hash, before declaring "not deployed").
- The RRC EWA client: session cookie from the form GET must ride the POST and pager GETs; pager banner "N - M of T" is the count ground truth; exactly-round fetch counts (20/2500/5000) mean a broken query, not a result.
- cursor-agent on this box: launch via `cmd.exe //c ...cursor-agent.cmd --print --force --model sonnet-4.5` detached with output redirection; monitor via the lane's git pushes, not stdout.
- WELL_SCHEMA-class trap generalized: when a dispatch forces source data into a contract shape the grain cannot fill, executors fabricate. Check schema-fit BEFORE dispatching a mint; prefer documented local types + a contract-gap note.

## Hard constraints (never violate)

Never bulk-crawl on borrowed logins. User-private uploads never enter the shared corpus (ADR-005/017). Herbert's title artifacts (DOTO, WI report, runsheet — and the incoming Texas DOTO + drilling title opinion) are confidential grading exemplars: never redistributed, never cited in product output, PDFs never copied into product repos. Hauska brand = SDK only. Scratch engagements only for probes (`33ba88d7` is the kept demo — do not delete, do not probe-write real engagements). No timeframe estimates in plans. Verify steering claims against live gh/npm/gcloud — including THIS document.

## Big picture (what the wave serves)

(a) **The twin goes real** — C6's flip is the first live-data product moment for the O&G vertical and feeds the Chris/Herbert design loop. (b) **Calibration moat** — lineage attribution is the single build that turns observed hazards into earned confidence (commitment #2). (c) **GTM footprint** — discoverability is the declared Phase-1 exit and has been the named drift for three sessions; this wave either executes it or gets an explicit operator re-sequencing. (d) **The demo stack is assembled** (landing → walkthrough engagement → command center); B3 and operator QA harden it into the ICC pitch. (e) O&G stages 3 and 4 (pay decks, trade desk/registry) stay design-complete but execution-parked pending operator ideation and external artifacts.
