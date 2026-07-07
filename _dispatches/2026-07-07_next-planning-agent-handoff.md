# Next planning agent — handoff (2026-07-07 close)

You are the planning agent continuing the three-lane program in `P:\doc_repo`. Read order: (1) this file; (2) `_inbox/2026-07-06_three_lane_program_STATUS.md` — the live tracker and verification log, your state anchor; (3) `_sessions/2026-07-07_section1_walkthrough_and_stack_run_claude_code.md` for the narrative (and 07-06's for the prior day). Verify every steering claim against live gh/npm/gcloud before acting. Concurrent sessions share this clone: `git log -3` + explicit-path staging before every doc_repo commit. Execution model: cursor-agent builds in fresh `P:\tmp\lane-*` clones (CURSOR_TASK.md pattern, EXIT-BOUNDED verification only); planner verifies/reviews/merges/deploys; verification never delegated; every deploy gets a live probe; merge only on green CI **and never in the same command chain as the check**.

## Operator-gated (do NOT nag; state for context)

- **A5 is Nick's #1 command-center ask** (his QA is blocked on it): set a project/address once and it is active across ALL cortex workspaces and his saved workspaces — persona-lens views ("this is what 123 Main looks like for a plan reviewer / architect / property investor"). Design-first, then build.
- og-twin UI/design: externally gated — Chris delivers a design update before any design work; Herbert delivers UX/flow direction (collecting field opinions). Do not queue og-twin UI rounds.
- Reeves runsheet: Nick self-sources (C7's graded-truth leg waits on it). Cotality keys: Nick's, never a blocker. Stripe: test-mode; mount STRIPE_SECRET_KEY (test) on the MCP only when billed-counts display is wanted.

## Queued stack (dependency order)

1. **Durable enforce fix (small, do first):** add `GATE_CONTEXT_MODE` to the cortex-api deploy workflow's `--set-env-vars` (ldt `.github/workflows/cloud-run-deploy.yml`) — today every workflow deploy silently reverts T1 enforce to log mode (bit us once; caught by env inspection). While in there, consider pinning `image_tag` required (the `:latest` default deployed a stale image while the push-build raced).
2. **hauska-map consumer bump:** `@empressaio/cortex-tiles@0.1.2` + `@empressaio/cortex-client@0.1.1`, then `vercel deploy --prod --yes` from repo root (LINK FIRST in a fresh clone: `vercel link --project cmdcenter --yes` — an unlinked deploy creates a stray project; that happened and was deleted). Exit: the IntakeQueue tile shows the 37 live engagements on cmdcenter-blush.vercel.app.
3. **A5 workspace active-context** (top Lane A, gates operator QA): plan the context store spanning cortex workspaces + saved workspaces; likely spans @empressaio packages (cortex-client state) + command-center shell + saved-space schema. Worth a design pass before dispatching.
4. **ICC walkthrough assembly:** metering + reviewer queue are in place. Seed a SCRATCH engagement + submission (never probe-write a real one), run compliance through the cmdcenter proxy, verify an IBC citation labeled "(ICC model code)" (B1 wiring deployed and waiting since 07-06). Then the extension leg (B2/B3 catch-up + live QA loop).
5. **C3b RRC adapters** (engine, one merge queue): production PDQ/EBCDIC (oil-at-lease/gas-at-well), H-10 injection/disposal. Plus: obtain the REAL Reeves W-1 counts (fix the og-sources form client or run the manual steps committed in `reeves_w1_ratio_report.md`) — the current report honestly says UNOBTAINED.
6. **Reeves mint C6** (cites the 63_empressa_certification_program non-vacuousness floor; cost capture per commitment #3) → og-twin flips seeded→live behind the TwinDataSource seam. C7 title slice waits on Nick's runsheet.
7. **M1 calibration run** (operator ruled RUN; engine queue free): 06-25 drafted dispatches — edition-bundle ingest → K2 retrodiction Austin+SA → M1 measure.
8. **Hygiene:** gtm_mcp_event 400 (MCP→cortex telemetry schema drift, logged every tool call); metering-summary anon returns 403 not the contract's 401 (auth layer resolves anonymous to a public ctx — align or amend contract); engine-api enforce decision (needs a caller inventory first); engine #75 close-or-land (check for unlanded corpus work); extension #3 folds into B2; eval-scores curated queries; discoverability (llms.txt + MCP registry listing = Phase-1 GTM exit); Upstash replacement.

## Live state snapshot (verify before relying)

- MCP: `hauska-mcp-server-00022-zeh` @100% (metering + summary endpoint + engine URL + fixed GCS sink; rollback `00019-yiz`). Gate probes: anon→63 tools, malformed→401; product stamping verified. Migrations through 007 applied to prod Neon.
- cortex-api: `cortex-api-00198-wcx` @100% — reviewer endpoint + GATE_CONTEXT_MODE=enforce (rollback `00196-qbz` = enforce on the older image). Enforce semantics live-verified. engine-api (`00036-hiv`) log-mode by design.
- cmdcenter-blush.vercel.app: Revenue Meter panel + `/api/spine/mcp-metering/summary` (traversal-pinned) + reviewer listing (37 engagements) all probed live.
- npm: `@empressaio/atom-contract@1.7.0`, `@hauska-sdk/metering@0.1.1`, `@empressaio/cortex-client@0.1.1`, `@empressaio/cortex-tiles@0.1.2` — all via CI tag-push/dispatch; publishing needs no operator.
- Probe-key hygiene: every probe key minted today was revoked (DELETE 200 each). Mint fresh per probe session via `POST /admin/keys` with `x-hauska-admin-key` (Secret Manager `HAUSKA_ADMIN_BOOTSTRAP_KEY`); map-layer calls need `jurisdiction_tenant` ON THE KEY ROW.

## Traps added today (beyond the 07-06 list)

`gh pr checks --watch` after a push latches onto the PREVIOUS run — always compare `headRefOid` before merging. Cloud Run traffic tags do NOT follow new revisions — `--update-tags` explicitly, and a bare `gcloud run services update --no-traffic` output line naming a tag URL can lie about which revision the tag serves. Workflow deploys revert manually-set env vars their `--set-env-vars` omit. `vercel deploy` in an unlinked clone creates a new project named after the directory. node-postgres returns `DATE()` columns as JS Date objects (string-cast in SQL). A dispatch's committed "report" may present failed-query zeros as real data — read generated artifacts, not just code.
