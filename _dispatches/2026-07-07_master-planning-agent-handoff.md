# Master planning agent — comprehensive handoff (2026-07-07, third close)

You are the master planning agent for the Empressa / Hauska Inc. / Legacy Group ATX portfolio, operating in `P:\doc_repo`. This file is the authoritative entry point as of the 2026-07-07 third close; it absorbs and supersedes `_dispatches/2026-07-07_next-planning-agent-handoff.md` as the starting document (that file remains the queue/trap DETAIL reference — read it second, its per-item exit criteria and probe-key hygiene still apply verbatim).

## Execution model (unchanged)

Planner plans/reviews/verifies/merges/deploys; cursor-agent (or Claude subagents) builds in fresh `P:\tmp\lane-*` clones (CURSOR_TASK.md pattern, EXIT-BOUNDED verification only — never a non-exiting command). Verification is never delegated. Every deploy gets a live probe. Merge only on green CI, never in the same command chain as the check (compare `headRefOid`). Concurrent sessions share this clone: `git log -3` + explicit-path staging before every doc_repo commit. Verify every steering claim against live `gh`/`npm`/`gcloud` before acting — the doc set lags reality.

## Read order

1. This file.
2. `_dispatches/2026-07-07_next-planning-agent-handoff.md` — queue detail, live-state snapshot, probe-key hygiene, traps.
3. `_inbox/2026-07-06_three_lane_program_STATUS.md` — live tracker and verification log (state anchor).
4. `00_current_state.md` — three 2026-07-07 sections, newest first.
5. `_decisions/2026-07-07_cre_data_no_moodys_observation_stack.md` — the commercial data sourcing decision (new today).
6. `_verticals/oil_gas/85b_title_artifact_exemplars.md` — Herbert's title exemplars + the Winkler C7 option (new today).
7. If touching M1/calibration: `_inbox/2026-07-07_legacy-design-tools_m1c_case-grain.md`. If touching O&G: `_decisions/2026-07-06_og_activation_and_title_slice.md` + ADR-025.

## Where we are (verified live at close)

| Area | State |
|---|---|
| Tenancy T1 | ENFORCE live on cortex-api (`00198-wcx`); MCP producer verified; engine-api (`00036-hiv`) log-mode BY DESIGN (enforce decision owed a caller inventory first) |
| MCP server | `hauska-mcp-server-00022-zeh`: 63 tools, layer2_call metering live (migrations 006/007 on prod Neon), summary endpoint, GCS audit sink recovered; Stripe leg unbilled (test key mount is operator-optional) |
| Command center | cmdcenter-blush.vercel.app: A5 active-context LIVE (one address across all panels + saved workspaces, persona lenses, deep links), 47-tile parity, Revenue Meter, reviewer queue (37 engagements) — operator QA unblocked |
| ICC | E2E infra complete under enforce; citation leg needs a demo plan document through the documents flow on SCRATCH engagement `33ba88d7`; icc-demo.vercel.app live but carries a retired brand string (hygiene) |
| Publishing | Fully autonomous: `@empressaio/atom-contract@1.7.0`, `@hauska-sdk/metering@0.1.1`, `@empressaio/cortex-client@0.1.1`, `@empressaio/cortex-tiles@0.1.2` — CI tag-push/dispatch, no operator needed |
| O&G | og-twin.vercel.app live on SEEDED Reeves atoms; Reeves ratio ANSWERED with live RRC data (3,887 W-1s since 2022; 53% allocation/PSA — validates ADR-025; Herbert relay ready); C6 mint + C7 title slice pending |
| M1 calibration | First honest case-grain answer: INSUFFICIENT SLICE. Austin λ=0.339/yr, SA λ=0.400/yr observed; 136k backtest deposits; but lineage attribution reaches n=1/n=0 adjudicated atoms — **deposit→atom lineage attribution is the named bottleneck** |
| Commercial (NEW) | Moody's CRE DECLINED. Stack: CAD public record + LoopNet via the user's own extension session + Cotality trends, labeled estimates. Borrowed-login crawl REJECTED (premortem red). Moody's econ buffet = separate open evaluation only |
| Title exemplars (NEW) | DOTO (Lea Co NM, EOG) + Winkler WI report + 322-page county runsheet filed at 85b; a self-contained graded-truth package for C7 exists NOW (operator call pending) |

## Queue (dependency order — no timeframes; stack and execute)

1. **Deposit→atom citation-lineage attribution** — M1's named bottleneck and the calibration program's next build (same family as F1 atom-grain read attribution). Everything calibration funnels here.
2. **ICC citation leg** — drive a demo plan document through the documents flow on scratch engagement `33ba88d7` (never probe-write a real one); verify an IBC citation labeled "(ICC model code)"; then the extension leg (B2/B3 + live QA).
3. **A5 operator QA** — live, waiting on Nick's walkthrough; capture defects, don't redesign.
4. **Hazard-window convention alignment** — harness infers min→max event date; engine f8 uses a longer span; reconcile when lineage lands (do with item 1, not before).
5. **C7 graded-truth leg** — OPERATOR CALL: Reeves runsheet (as ruled) vs the self-contained Winkler package (85b flag). Do not start either without the call.
6. **Reeves mint C6** → og-twin seeded→live behind the TwinDataSource seam (cost capture per commitment #3; cites the 63 certification non-vacuousness floor).
7. **LoopNet extension adapter** — first commercial site adapter per the CRE decision (user's own session, ADR-022 lineage, labeled estimates). Queued Lane-A-adjacent; not dispatched.
8. **Standing hygiene:** icc-demo footer "Powered by Hauska Engine — hauska.dev" retired brand string (fold into next hauska-map dispatch: title/footer/any Hauska refs); gtm_mcp_event 400 (MCP→cortex telemetry schema drift); metering-summary anon 403 vs contract 401; engine-api enforce decision (caller inventory first); engine #75 close-or-land; eval-scores curated queries; discoverability (llms.txt + MCP registry = Phase-1 GTM exit); Upstash replacement.

## Waiting on the operator (state for context; do NOT nag)

| Item | Gates |
|---|---|
| C7 call: Reeves runsheet vs Winkler package | Queue item 5 |
| A5 walkthrough on cmdcenter-blush | Queue item 3 |
| Cotality production keys (Nick handling — never a blocker) | Engine map envelope 2/7 layers; sync BOTH ldt-prod and hauska-prod-497015 when they land |
| Chris design update + Herbert UX/flow | Any og-twin UI work (externally gated — do not queue UI rounds) |
| Herbert ratio relay (53% allocation/PSA, ready to send) | Nothing technical |
| Moody's econ quote email | Econ-buffet evaluation only — its arrival CLOSES the CRE side, does not reopen it |
| Stripe test-mode key mount | Billed-counts display only |

## Big picture (the arcs everything serves)

| Arc | Through-line |
|---|---|
| Calibration moat (commitment #2) | M1 gave the first honest answer; lineage attribution is the single build that turns observed hazards into earned confidence. This is the moat, not the corpus text. |
| MCP market footprint (GTM pivot 2026-07-04) | Metering live, 63 tools, autonomous publishing; discoverability (llms.txt + registry) is the Phase-1 exit. |
| Commercial vertical | Now has a settled, defensible data posture: public record + user-session observation, no vendor dependency, no borrowed-login shortcuts. LoopNet adapter is the first build expression. |
| O&G vertical | ADR-025 validated by live RRC data; professional ground-truth formats in hand (85b); C6/C7 make the twin real; SLB framing stays retired (operator overlay only). |
| Operator single surface | cmdcenter at 47-tile parity + A5; QA loop with Nick is the feedback engine. |

## Traps digest (full list in the prior handoff — these bite hardest)

`gh pr checks --watch` latches the pre-push run (compare `headRefOid`). Cloud Run tags don't follow revisions (`--update-tags` explicitly). Workflow deploys revert env vars their `--set-env-vars` omit (GATE_CONTEXT_MODE durable fix landed in the workflow — verify, don't assume). `vercel deploy` in an unlinked clone creates a stray project (`vercel link --project cmdcenter --yes` first). Fresh `p:\tmp` clones can be recycled mid-build (push branches immediately). A dispatch's committed report may present failed-query zeros as real data — read the generated artifacts. X-Hauska-Key header, not Bearer. Mint probe keys per session via `POST /admin/keys` (admin key in Secret Manager `HAUSKA_ADMIN_BOOTSTRAP_KEY`); revoke after; map-layer calls need `jurisdiction_tenant` on the key row.

## Hard constraints (never violate)

- Never bulk-crawl LoopNet/CoStar on Herbert's or any borrowed broker logins (premortem RED, written into the CRE decision record).
- User-private uploads (surveys, rent rolls) never enter the shared corpus (tenant sovereignty, ADR-005/017).
- The DOTO PDF is EOG attorney work product: internal grading exemplar only — never redistribute, never cite in product output.
- Hauska brand = SDK only (2026-07-06 decision); everything else is Empressa.
- Scratch engagements only for probes; no timeframe estimates in plans; no special data access for any jurisdiction.

## References

Decisions: `_decisions/2026-07-07_cre_data_no_moodys_observation_stack.md`, `_decisions/2026-07-06_og_activation_and_title_slice.md`, `_decisions/2026-07-06_branding_hauska_sdk_only.md`, `80_adrs/adr_025_revenue_allocation_unit.md`. Artifacts: `_verticals/oil_gas/85b_title_artifact_exemplars.md` (+ `assets/title_exemplars/`), `_inbox/2026-07-07_legacy-design-tools_m1c_case-grain.md`. Sessions: `_sessions/2026-07-07_cre_decision_title_exemplars_claude_code.md`, `_sessions/2026-07-07_section1_walkthrough_and_stack_run_claude_code.md`. Tracker: `_inbox/2026-07-06_three_lane_program_STATUS.md`.
