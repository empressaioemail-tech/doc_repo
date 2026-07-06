# Consolidated to-do + drift steer (2026-07-05)

Companion to `_inbox/2026-07-05_fable_sessions_synopsis_and_state.md`. Drift analysis of the built state against the two founding Fable sessions (2026-07-03 O&G, 2026-07-04 audit/convergence), plus one consolidated execution-ordered list. Live-verified 2026-07-05 evening: T1 PRs #37/#84/#227 MERGED 22:53Z (coordinated landing by a concurrent session); GATE_CONTEXT_SIGNING_KEY mounted on hauska-mcp-server + hauska-engine-api, NOT yet cortex-api; extension PR #5 still open; engine PRs #75/#76 stale-open since 06-22; ldt #226 + atom-contract #4 open awaiting operator framing.

> **Reconciliation (2026-07-05 late, the T1/ICC session):** since this file was written: T1 signing key IS mounted on cortex-api (00290-qol) and log-mode was live-verified (gate_context_verified in cortex logs); item 4's remaining legs are the soak + enforce + plain-header removal, gated on the producer product-resolution bug. Item 5 is DONE (icc-model-code minted via engine #85 - IBC complete, IPMC adapter follow-up; retrieval serving 29,857 atoms; extension PR #5 MERGED; public demo live at icc-demo.vercel.app). Command-center workspace is at full 47-tile parity (cortex-tiles 0.1.1 published via ldt CI - the npm path in item 7 is proven for ldt; SDK/atom-contract token legs remain). Items 6, 9, 10 remain the Phase 1 exit gap per D1 and are the agreed next lane.

## Drift verdict

Architecturally: no drift. Everything built since 07-04 expresses the two visions (one spine, accessPolicy splits, gate as chokepoint, shared surfaces, truth convergence). Four named drifts in emphasis and sequencing:

**D1 — Phase-order inversion against the audit vision.** Phase 1 "Own the layer" carried the exit gate "an outside agent can discover, call, and pay for a Layer-2 tool without talking to a human." Not met: metering unwired, atom spec unpublished (PR #4 held), no MCP registry listing or llms.txt, eval scores unpublishable. Meanwhile Phase 2 (T1) and Phase 3 (command center, console unification) completed. The GTM pivot's core (own the MCP market) is the least-finished phase. Steer: finish Phase 1's exit before opening new lanes.

**D2 — The O&G skeleton lost its first-check surfaces. RESOLVED 2026-07-05 by operator ruling.** The 07-03 session resolved the first check as landman obligations + title, pulled a 2-3 tract Reeves title slice INTO the skeleton after Herbert's reply, ruled the adjudication admin panel core infrastructure, and ruled water/injection (H-10) an upfront build. The 07-05 activation draft's six-step path had narrowed to twin plumbing plus visualization: title not activated, admin panel absent, H-10 unnamed. Nick ruled full scope, no narrowing ("the viz can't exist accurately without the rest"). The activation draft's execution path was rewritten same day to eight steps: H-10 in the adapter set, the admin panel as a parallel lane from first atoms (skeleton cannot exit without it), and the bounded aggregator-sourced title slice in scope with its per-tract cost feeding the buy-or-aggregate checkpoint. ADR-025 needed no change; the ontology already carried the title, obligation, and injection shapes.

**D3 — The calibration gate is being routed around and the roadmap carries a retracted claim.** The M1 gate ("nothing downstream resources until M1 returns go," 06-25) has been passed by four programs. `00d_portfolio_roadmap_reference.md` still headlines arrow-two as DONE / I3 satisfied, which was retracted 2026-06-25 (04a bannered; commitment #2 NOT currently satisfied). Steer: run the M1 dispatches or file a re-sequencing decision record; correct 00d either way.

**D4 — GTM support structure unbuilt while the pivot is declared.** The 07-04 ask was doc_repo supporting product/bizdev/marketing. The GTM band, archive pass, and launch chain (Radar Web Store, landing origin) are untouched by convergence. Steer: give the Radar launch chain a lane the moment Cotality keys land; decide the GTM band explicitly.

Minor: the activation draft ran premortem-check where the 07-03 ruling was adversarial review instead (operator called the logged premortem stale); O&G repo name unresolved (og-twin recommended over empressa-land to avoid brand pre-decision); empressa-trading still consumes the Empressa brand with no decision record.

## Consolidated to-do (execution order, dependencies named, no timeframes)

**Dated / immediate**
1. Nick: Cotality production keys — operator handling directly (ruled 2026-07-05: not a planning blocker; planner treats it as resolved-in-flight and does not gate or re-raise). When keys land, sync to BOTH legacy-design-tools-prod and hauska-prod-497015.
2. Nick: rotate the extension public key (owed since the 07-04 secrets deletion).
3. Planner: commit the untracked _inbox artifacts (O&G activation draft, ADR-025 draft, synopsis, this file) at session close.

**T1 flip — in progress, verify not duplicate**
4. Concurrent session finishing: mount GATE_CONTEXT_SIGNING_KEY on cortex-api (mcp + engine done), log-mode soak, review gate_context_mismatch logs, enforce, remove plain-header trust. Then T2 (tenant-private write primitive) per the tenancy plan.

**Phase 1 exit — own the layer (D1 fix; the GTM-pivot core)**
5. ICC corpus ingest (IBC2018P6 + IPMC2018P2) + eval + snapshot re-mint + retrieval data deploy; then merge extension PR #5.
6. MCP metering wire-up: layer2_call meter events at the tool-call layer (Stripe test products exist). ICC contract acceptance criterion, not discretionary.
7. Nick: NPM_TOKEN automation secrets into SDK + atom-contract (refresh map's); planner adds the atom-contract publish workflow. Unblocks 8, SDK sprint-53, all future publishes.
8. Nick framing reviews, then coordinated landings: atom-spec PR #4 (merge + publish as the open standard) and rename PR #226 (@hauska/* to @empressaio/* + CI republish + consumer updates). Depends on 7.
9. Discoverability motions: MCP registry listing, llms.txt, public catalog page. Proposed 07-04, never started; this IS owning the MCP market.
10. Eval-scores: per-jurisdiction curated queries; publish only non-vacuous. Feeds 9 and commitment #2.

**Calibration (D3 fix)**
11. Run the M1 dispatches (cc-agent-E edition-bundle ingest, then cc-agent-C K2 retrodiction Austin+SA, then the M1 gate) OR file a decision record formally re-sequencing M1. Correct 00d's retracted arrow-two claim either way.

**Revenue surfaces (D4 fix)**
12. Radar launch chain: map QA against the 75k bar, Chrome Web Store listing, Vercel landing origin (hauska.io still 525s post-checkout). Cotality-dependent pieces proceed on the operator-handled key; the Web Store and landing-origin legs have no Cotality dependency and can start now.
13. ICC two-screen PoC assembly (extension cited-reasoning screen + command-center revenue meter). Depends on 5 + 6. Timing self-driven.

**O&G vertical (D2 fix)**
14. Nick: ratify the activation decision + ADR-025 (D2 resolved — full-scope path now in the draft); settle the repo name (planner recommendation stands: brand-neutral `og-twin`); create the GitHub repo.
15. Herbert recorded review; corrections fold into ADR-025 before the 1.7.0 freeze; pooled-units question routed.
16. Then the dependency path: RRC adapters Reeves-first, Reeves mint (non-vacuous eval + commitment-3 cost capture), LAYER_REGISTRY keys, thin BFF + O&G MCP tools (MCP-first), 3D lateral lens.

**Hygiene / code-clean (bounded, dispatch-ready)**
17. Close-or-land stale engine PRs #75 (calibrated-spine wave-2 — check for unlanded corpus work first) and #76 (ICC PoC fixtures — likely superseded by merged #83).
18. Engine: delete the retired Regrid adapter; fix the stale 4-value ACCESS_POLICY_SCHEMA zod in packages/atoms/src/instances.ts (sibling of the #80 class); move the 56MB snapshot to GCS; decide zero-caller pipeline-runner + packages/workspace.
19. legacy-design-tools: remove the false "Regrid is the active provider" runtime message; delete dead map-embed/codewarm; split the 88KB brokerageBrief.ts router; resolve the stash on the orphaned commit chain.
20. Contract: dedupe the duplicated ACCESS_POLICY zod enums; demote drizzle from hard dep. SDK: CNS-era identity scrub + sprint-53 publish (behind 7). hauska-map: tests, README, CI quality gate.
21. Upstash: recreate the rate-limit db and update env/secret, or record acceptance of per-instance memory fallback.
22. Doc set: CLAUDE.md slim/audit; 00d roadmap refresh (stale 06-15: contract 1.3.0, 57 tools, retracted arrow-two claim, pre-reframe rows); _inbox (275 files) + _dispatches (226) archive pass; scrub-tracker deep rewrites; empressa-trading brand/governance decision record.
