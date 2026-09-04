---
id: 2026-09-04_ctx_pipeline_wrapup_scope_audit
title: Central Texas data pipeline wrap-up — adversarially-reviewed execution scope
status: active
last_updated: 2026-09-04
applies_to: portfolio
owner: nick
related:
  - 90_operations/OPS-19_factory_plan_of_record
  - 90_operations/OPS-16_texas_market_plan_of_record
  - _inbox/2026-09-02_parcel_program_review
  - _decisions/2026-09-02_step7_consumer_c_then_b
  - _inbox/2026-09-04_hauska-map-acquire-wave12-frontend_shape-reconciliation_close
purpose: Full scope audit closing out the ACQUIRE-GIS wave 1 / PARCEL wave 2 / serve-cutover
  effort. Produced by a 19-agent workflow (4 branch/PR orphan sweeps across every touched
  repo, 7 thematic deep-dives, adversarial batch review challenging every raw finding, one
  synthesis pass). 34 raw findings collapsed to 19 actionable items across 2 dependency-
  ordered waves, 1 item held pending an operator ruling, 8 items confirmed already resolved
  (listed so nothing silently disappears from the record), 6 items verified clean.
---

# Central Texas Data Pipeline — Wrap-Up Execution Scope

This synthesizes the raw findings and adversarial verdicts as given; no new live checks were run in this pass. Where an adversarial verdict corrected a raw finding's evidence, the corrected version is used below. Items an adversarial verdict marked `ALREADY_RESOLVED` are dropped from the execution scope and listed separately so nothing disappears from the record.

**On the recurring PR-base-pointed-at-sibling-branch defect specifically:** a full sweep this week found it in exactly one place — legacy-design-tools PR #601 — despite clean full-history sweeps of hauska-factory (86 PRs), hauska-engine (378 PRs), and hauska-map (350 PRs), all 100% base=main. It is not a fleet-wide pattern; it is one lane's (wave12-serve, LDT) stacked-PR convention, and even there the content landed safely on main via a downstream PR's retarget. What remains open is process hygiene (dangling branches, no CI guard against recurrence), not data loss. 34 raw findings collapse to 19 distinct actionable items (18 in Wave 1, 1 in Wave 2), 1 item that needs an operator ruling before it can be scoped as agent work at all, 6 verified-clean/informational items worth keeping on record, and 8 items dropped as already resolved.

## Wave 1 — no dependency on any other item in this list

| # | Item | Repo | Status | Owner | Citation | Blocked by (external, not a list item) |
|---|------|------|--------|-------|----------|------------------------------------------|
| 1 | legacy-design-tools PR #601 orphaned merge record — dangling branches + no CI guard | legacy-design-tools | Content safe on main (blob-hash confirmed); branch/audit-trail cleanup and a base≠main CI guard still open | property seat | PR #601 (base=`feat/b-acquire-wave12-serve-utilityservice`, never reaches main); PR #602 (base=main, merged 2026-09-04T13:03:09Z, carries content); commit 88b5fe51 | none |
| 2 | valueHistory rail: serve-side cutover (adapter + allowlist) | legacy-design-tools | Open — no adapter exists, `parcelRecordAllowlist.test.ts` asserts valueHistory stays legacy for every county | property seat, follow PARCEL-B-SLATE1 template | `gh search code valueHistory` (1 hit, negative-only test); `gh pr list --search valueHistory` (0) | none — prior data-quality blocker (S6-COLLISION-class) closed via PR #81 |
| 3 | exemptionCodes / landUseSource / acreageMethod stampText type-gap | hauska-engine (`ingest-existing.ts`) + hauska-factory (vendored, report-only) | Open, confirmed unfixed since 2026-09-01 | planner / future parcel-record card | `ingest-existing.ts` lines 51-58, 135-138, 149-155, 168-173; `parcel-record-fill.mjs` lines 168-223 | needs a planner/operator ruling on fix shape (companion-row vs widening stampText) |
| 4 | B3-GEOMGAP statewide undivided-interest sweep (5 non-Bastrop counties) | hauska-factory | Open — method never re-run outside Bastrop; the ~938-parcel Bastrop gap itself confirmed still missing (981,405 unchanged post-refresh) | planner / follow-on card | `_inbox/2026-09-01_parcel-b3-geomgap_close.json`; `_inbox/2026-09-03_parcel-refresh-apply_close.json` | vintage-gap half only: no fresher StratMap vintage published for any of the 6 counties (external, verified 2026-09-03) — the undivided-interest sweep itself has no blocker |
| 5 | Queue-claim mechanism: no server-side check tying a Cloud Run execution's identity to a live claim | doc_repo (`scripts/queue/lib.mjs`/`cli.mjs`) + hauska-factory (consumer) | Open — advisory-only since 2026-09-01, produced two real concurrent-writer incidents | Nick / queue tooling | `_inbox/2026-09-02_parcel_program_review.md` finding #7; last touch to queue scripts a827e4b (2026-09-01) | operator/tooling design decision (not yet scoped as a card) |
| 6 | parcel_record store has no reporting-safe read path (queries time out under writer load) | infra (Neon `FACTORY_DATABASE_URL`) | Open — the RO-role fix (2026-09-02) is privilege isolation, not a performance fix; same-day queries still timed out | planner / infra | `_inbox/2026-09-02_parcel_program_review.md` finding #8; `_inbox/2026-09-02_parcel-ro-role_close.json` | design decision: materialized rail-liveness table vs read replica |
| 7 | SIGTERM guard redeploy sweep — 12 Cloud Run job resources still running pre-fix images | hauska-factory (GCP deploy only, no source change) | Open — root cause fixed and live on main (PR #79/#80); redeploy of these 12 named resources never swept | next property-seat claimant | `_inbox/2026-09-02_factory-reaper-phantoms_close.json` (12 named resources); `src/control/runs.mjs`/`reaper.mjs` fix confirmed live on main | none |
| 8 | Card H residue figures (232,770 unstamped / Travis 119,389 no-row / Hays / Williamson) — confirmed stale | doc_repo script (`scripts/ctx/post-h-residue-recount.mjs`) against factory store | Open — instrument repaired 2026-08-31, `--live` never re-run since; figures unreproducible by inspection | integration seat | `_inbox/2026-08-31_recount_repair_handback.md`; `_inbox/2026-08-30_ctx_w0_residue_recount.json` (unchanged mtime) | needs a live DB-access session (operational only) |
| 9 | overlayDistricts / maxImperviousCoverPct writers never emit a `not-applicable` cell state — gate can structurally never read "pass" | hauska-factory | Open — verified against current writer code; not yet firing in production only because neither rail is in `SLATE_1_RAIL_KEYS` today | whoever next scopes `gate-rail-cli.mjs` / property-factory seat | `parcel-overlay-districts.mjs` 41-43,284,296; `parcel-max-impervious-cover.mjs` 50-70,290; `cell-state.js` `EARNED_CELL_KINDS` | none now; must land before either rail is ever added to a gate slate |
| 10 | owner rail: dedicated reconciliation needed (parcel_record CAD pipeline vs atom `owner-fact-writer.ts`, two independently-derived sources) | hauska-factory + hauska-engine | Open — deliberately held out of wave12 serve cutover pending a PARCEL-S6-COLLISION-style card | next session/planner | `_inbox/2026-09-04_ldt-acquire-wave12-serve_cp1.json` lines 20,45,49; `parcel-owner.mjs`, `owner-fact-writer.ts` | none |
| 11 | `factory-publish-gate-sched` has no Cloud Scheduler trigger — every verdict manually dispatched | hauska-factory / GCP infra | Open — live-verified 2026-09-04, zero scheduler jobs target it in any region of `hauska-prod-497015` | whoever next scopes gate-evaluator scheduling/cadence | `gcloud scheduler jobs list` (live, all regions); `_inbox/2026-09-02_parcel-b-gate-sched_close.json` leave_behind | none for current SLATE_1; if slate is later expanded to include item 9's rails, item 9 must land first |
| 12 | PR #445 — retire geometry denominator until re-derived (S-22) | legacy-design-tools | Open, OPEN 15 days, Typecheck CI FAILURE, zero activity | property/factory seat | `gh pr view 445` | see Wave 1 conflicts below |
| 13 | PR #446 — pin landuse-cad-join write key, prepare land-use retirement | legacy-design-tools | Open, OPEN 15 days, Typecheck CI FAILURE, zero activity | property/factory seat | `gh pr view 446` | see Wave 1 conflicts below |
| 14 | PR #440 — zoning denominator: incorporated parcels, not-measured as own class (SS-W15/P-47) | legacy-design-tools | Open, OPEN 16 days, all CI green, zero review | property seat | `gh pr view 440` | see Wave 1 conflicts below |
| 15 | PR #554 — ctx-w1 last bake inputs (tax year, landUse, honest point, alias read) | legacy-design-tools | Open, OPEN 5 days, all CI green, zero review | property seat | `gh pr view 554` | see Wave 1 conflicts below |
| 16 | hauska-map: utilityServiceFact never reads the `electric` slot the backend now serves | hauska-map | Open — backend shipped the slot today (LDT PR #608, merged 2026-09-04T14:10:29Z); frontend resolver/type contract not updated | hauska-map / property-explorer lane | `fact-sheet-resolver.ts` ~1100-1167 ("No electric slot exists — never invent one," dated pre-#608); `atom-chain-to-facets.ts` line 531 | none |
| 17 | hauska-engine `feat/permits-field` — real orphaned parcel_record work, diverges from main's companion-shape design | hauska-engine | **Held out of Wave 1 — see "Held out" section below** | operator (Nick) to rule, then whichever seat owns parcel_record rails | branch `feat/permits-field` (2e60094, 5c7e491), never PR'd; `rail-keys.js` on main uses plain companion-shape instead | operator ruling: was this deliberately dropped, or still wanted |
| 18 | P-114 report PDF logo/brand-polish — confirmed unbuilt anywhere, correctly matches pending-approval WDLL state | hauska-engine (target) | Open, not yet dispatchable | Nick (approval), then hauska-engine lane | `_inbox/2026-09-03_p114_report_brand_polish_WDLL.md` (status: draft, operator_approval: pending); zero code trace confirmed in both hauska-map and hauska-engine | operator approval of WDLL + OPS-16 plan-row opened |

### Wave 1 conflicts (same repo / same files — sequence, don't blind-parallelize)

- **legacy-design-tools rail-scoring/denominator family (items 12-15):** PR #445 and #446 both sit in the rail-scoring/gate-denominator subsystem and both currently fail Typecheck CI after 15 days untouched — most likely because both have drifted against a main that has since absorbed the wave12 rail merges (#600-604). Land #440 and #554 first (clean CI, just need review), then rebase #445 and #446 against the post-merge main before attempting to fix their Typecheck failures — trying to fix them against the stale base first risks re-diverging the moment #440/#554 land.
- **Item 1 (PR #601 cleanup) vs items 2, 12-15 (other open LDT PRs):** if item 1's remediation includes adding a CI check that rejects a merge whose base isn't `main`, land it early in the wave — items 2 and 12-15 should be opened/merged under that guard rather than before it, so the guard gets exercised rather than grandfathered around.
- **hauska-factory parcel_record writer family (items 4, 9, 10):** different files (undivided-interest sweep script vs `parcel-overlay-districts.mjs`/`parcel-max-impervious-cover.mjs`/`cell-state.js` vs `parcel-owner.mjs`/`acquire-wcad-owner.mjs`) — no direct edit conflict, genuinely parallelizable.
- **Read/write contention on the single Neon `parcel_record` primary (item 6):** until item 6 lands, any two of {item 4's sweep, item 9's fix verification, item 10's investigation queries, item 8's `--live` recount, manual gate-verdict dispatch under item 11} running concurrently will contend and likely time out (per the review's own reproduced 15-60s timeouts) — not a correctness risk, a throughput one. Serialize the heavy read/backfill passes if item 6 isn't fixed first.
- **hauska-map (item 16) and everything else:** fully independent repo, no conflict.
- **Items 3, 5, 7, 11 (stampText, queue-claim, SIGTERM redeploy, scheduler wiring):** each touches its own distinct file/config surface — no conflict with each other or with anything above.

## Wave 2 — depends on Wave 1

| # | Item | Repo | Status | Owner | Citation | Depends on |
|---|------|------|--------|-------|----------|------------|
| 19 | Wave R execution (OPS-19: landUse projection, situs recovery, tax-year selection, ADR-029 rail-absence row, fail-closed upsert for ~58,461 inherited centroids) | hauska-factory / OPS-19, cross-repo | Not executed — explicitly deprioritized | operator (routing/sequencing), then property seat (execution) | `00_current_state.md` line 65 (unchanged since 2026-09-03); `_decisions/2026-08-30_ctx_one_more_bake.md`; `_decisions/2026-09-01_parcel_record_is_the_gate_to_everything.md` ("outranks Wave R... and every card currently queued behind them") | (a) its own external prerequisite chain — W0b review, determinism gate, S1-S12 checks, six staging bakes, none confirmed complete anywhere; (b) explicit operator-ruled ordering behind Wave 1 items 1, 2, 3, 4, 9, 10, 11 (the active parcel_record wave-12 program) |

No conflict flag needed — single item, and it cannot start until Wave 1's parcel_record items are substantially resolved or Nick explicitly re-sequences.

## Held out — needs a human ruling before it can be scoped as agent work

**hauska-engine `feat/permits-field` branch.** The investigator's own words: "This could be deliberately-abandoned exploratory work superseded by the simpler companion-shape choice, or accidentally orphaned work from the heavy PARCEL-wave-2 week — cannot tell which from git history alone." Every git fact is independently confirmed (2 commits ahead / 7 behind, never PR'd, 183+146 line PermitsCellState design diverges from main's plain companion-shape rail) — the gap is a design call, not a fact-finding gap. Route to Nick: keep the CellState-narrowed design, or confirm the companion-shape rail on main is final and delete the branch. Do not dispatch either direction until ruled.

## Dropped — marked ALREADY_RESOLVED by adversarial review

1. **txgio_parcel.geom native-column silent-wipe defect** — closed via legacy-design-tools PR #595 (merge 4e592c1d, confirmed ancestor of main, fix content verified live). Distinct from, and does not touch, item 4 above (B3-GEOMGAP row-count gap), which remains open.
2. **FactSheetResolver / ParcelFactSheet implementation existence** — confirmed real, actively maintained (984-line contract package + 2475-line resolver, 13 production consumers, extended today via commits bd05d96/268f755/58d6648/ab142c4). Not a gap.
3. **brokerageNodeFacetsRouter as a contract bypass** — confirmed to be the documented backend wire format, consumed only through the resolver's `xxxFromInspectWire` conversion layer. One disclosed exception (compare-facts.ts per-cell values) already tracked as finding F7 in the SS-W1 close, not hidden.
4. **valueHistory rail S6-COLLISION-class data-quality defect** — fixed via hauska-factory PR #81 (mergeSha e6edb85f, 777 accounts reset, verified corpus-wide zero remaining). The still-open item is the separate *serve-side cutover* (item 2 above).
5. **Three dangling 2026-08-03 rebrand branches** in hauska-map (accent-swap/brand-mark/combined) — confirmed superseded same-day by PR #145; no production impact, stale pointers only.
6. **hauska-map's existing brand assets as P-114's reference point** — confirmed present, correctly scoped out of PDF-report work per hauska-map's own brand README. Informational only.
7. **hauska-map full-history PR base-branch check** — confirmed zero non-main-base merges across all 350 PRs, three independent counts agree.
8. **PR-base-sibling-branch trap checked against the stampText/txgio-geom-fix PR chains specifically** — confirmed clean within that narrow scope; superseded as a general claim by item 1 above, which found the real instance elsewhere (LDT wave12-serve).

## Verified clean — informational, no action needed

- hauska-factory: 86 PRs, 85 merged + 1 legitimately open (#37), all base=main.
- hauska-factory: `quarantine/r2-unauthorized-f83361c` is a documented, already-quarantined seat-collision incident; the risky `--delete-place` flag never reached main; PR #64 is the legitimate replacement (mergedAt correction: 2026-09-02T12:55:35Z, not 13:56:03Z as originally cited).
- hauska-engine: all 378 PRs (2 numbers unused) base=main among merged PRs; the 4 historical non-main-base attempts (#76, #142, #143, #194) were all closed unmerged and correctly re-landed via #195, #146, #83/#85.
- hauska-engine: 8 additional stale, never-PR'd branches (eval/per-jurisdiction-scores, feat/eval-scores-artifact, feat/neon-warmup-pilot-load, feat/phase-a-foundation-v3, feat/tce-capture-evt-scaffold, fix/verify-by-atom-did, fix/ws1-stale-edge-retire-export-guard, stream-1d/migrate-legacy-codes) — low-priority abandoned prototypes, no action absent operator interest.
- legacy-design-tools: comprehensive sweep beyond PR #601 found no other sibling-base instance in the roughly 2026-07-20-onward window (not literal full 607-PR history); PR #458 confirmed an ordinary superseded duplicate, not an orphan.
- Doc_repo parcel-fact-sheet contract: no formal retirement/amendment ruling exists, but none is needed — the contract is live, unretired, and actively catching real bugs (e.g. the same PR #608 utilityService fix chain).

This is a scope document, not a dispatch. Per the compiled-dispatch requirement, each Wave 1 / Wave 2 item still needs a named PLAN-ROW under OPS-16 or OPS-19 before `node scripts/dispatch.mjs` will compile it — several (valueHistory, owner reconciliation, not-applicable gap, gate-sched wiring) don't have one yet and should get one before dispatch.
