---
id: 2026-09-17_serving_cutover_and_lane_integration_claude_code
title: "Session: the gate graded and made fast, cell serving and the height guard live, P-249 proven and shipped, P-302 live, thirteen lanes integrated or compiled"
date: 2026-09-17
last_updated: 2026-09-17
kind: session
session_type: integration
status: closed (operator-called close; handoff at _inbox/2026-09-17b_HANDOFF_integration_seat.md)
agent: claude_code
repo: doc_repo
owner: nick
seat: integration
programs: [OPS-24, OPS-16]
memory_graded: [served-bake-has-no-trigger:HELPED, pe-panel-reads-own-adapter-not-cortex:HARMED, cloud-run-traffic-trap:HELPED, latest-tag-deploy-race-verify-endpoint:HELPED, gcloud-source-deploy-stale-local-checkout:HELPED, cloud-run-source-deploy-rotates-api-key:HELPED, cortex-api-canary-deploy-and-set-secrets:HELPED, workflow-deploys-revert-manual-env:HELPED, engine-api-deploy-method:HELPED, hauska-map-vercel-no-autodeploy:HELPED, vercel-monorepo-second-app-deploy:HELPED, explicit-placeholder-convention:HELPED, hays-node-id-is-the-parcel-map-id:HELPED, dirty-tree-close-gate-inspects-command-string:HELPED, doc-repo-concurrent-commit-hazard:HELPED, deploys-are-planner-owned:HELPED]
related:
  - _inbox/2026-09-17_HANDOFF_integration_seat.md (consumed)
  - _inbox/2026-09-17b_HANDOFF_integration_seat.md (the next session starts here)
  - _inbox/2026-09-16_texas_scaleup_ROADMAP.md (rewritten at close)
  - 90_operations/OPS-16_texas_market_plan_of_record.md (A-201 to A-206; rows P-301 to P-305)
  - _inbox/2026-09-17_p249_canary_proof.md
  - _inbox/2026-09-17_p252_apply_grade.json
  - _inbox/2026-09-17_six_county_completeness_post_apply.json
---

# Session: the serving cutover and the lane integration

Ran from the `integration` seat in `P:/doc_repo` on `main`, from about 04:52Z to 14:35Z on
2026-09-17. It started from `_inbox/2026-09-17_HANDOFF_integration_seat.md` at doc_repo `084b650a`.
The live state and the queue are in the roadmap, which was rewritten at close.

## What was decided (operator rulings, recorded in OPS-16)

| Amendment | Ruling |
|---|---|
| A-201 | Williamson's republish runs now, accepted store-side if its walk is red. The walk defect is carded as P-301 |
| A-202 | Austin interim districts `I-<X>` read as base `<X>` with an interim disclosure. At stamp time, features with no CAD account are skipped and counted |
| A-203 | Four more lanes: P-266 with P-268, P-275, P-276, and the new P-302 |
| A-204 | P-256's pre-apply corpus pin moves to **1.4.0** (A-199 named 1.3.0 before 1.4.0 existed). The integration work is its own lane (P-256b) |
| A-205 | P-249's staging proof runs on a canary with production data read-only. Ship both halves despite the Waco failure, and card the map fix (P-303), the anonymous area exposure (P-304) and the Preview key drift (P-305) |
| Close | The state files (`_STATE.md`, `_state/shared/STANDING_DECISIONS.md`) are not touched this session |

## What shipped (all verified at the served surface or the authoritative row)

- **Gate (P-252):** the apply `8x4jk` graded PASS (390 pairs, 25 predicted flips, grader self-test 8 of 8).
- **Gate speed (P-298):** merged. The index was built on the factory store under lease (2.83 GB, 235 s) and the scheduler image deployed. A six-county apply now takes 26 to 33 minutes, down from 8h13m. The hourly trigger is back on, and the scheduler takes its own lease.
- **Cell serving (P-297), both halves:** retrieval `00098-cat` and cortex `00817-niq`, then `00820-jex`. Graded with a file instrument (self-test 7 of 7) on 7 parcels canary and 5 live.
- **Height guard and tables (P-299, P-258):** cortex live, corpus 1.4.0 published. Round Rock serves 24 districts, none at 999; before, 10 districts, all 999.
- **Envelopes (P-249):** proven on a canary, then shipped (cortex `00820-jex`, Property Explorer `k8hha93vj`). Hays draws on the live panel with the figure withheld.
- **Engine-api surfaces (P-302):** engine-api `00249-kiw`. Graded on a fresh feasibility export for `48453:941709`: setbacks and utilities read as declared refusals with their reasons.
- **Merged:** P-294 (its job deployed, dry-run), P-285 (Burnet dry run recorded), P-301 (publish image rebuilt), P-276.
- **Republish:** Bastrop, Caldwell and McLennan republished with green walks, graded on the `node-facets:tier1` row. Hays written and store-accepted. Travis staging passed.
- **Compiled:** P-301, P-259b, P-266/P-268, P-275, P-276, P-302, P-256b (all fired by the operator); P-303, P-304, P-305 (not fired at close).

## What was found

1. **The handoff's republish check could not grade anything.** It read served `bakedAt` on the smartsite.cloud panel. That field tracks a setback-cell write stamp: it equals `setbackRulesFact.sourceVintage` to the millisecond, and four counties share one value. Grade a republish on `place_layer_snapshots` (`node-facets:tier1`) and on `get_smart_site`.
2. **Two fixes broke each other (P-301).** Factory #151's walk accepted only `not_baked`, while LDT P-206 had changed the body to `record_retired`. So no production walk in Hays or Williamson could be green.
3. **Only Bastrop has a registered walk gold parcel.** Every other county needs `--gold`.
4. **`factory-verify-walk` cannot run a production walk:** its template lacks the production store secrets.
5. **The two slate copies differ:** the engine's copy (152 pairs) lacks LDT's six Hays record-overlay rails.
6. **Staging has no atoms store of its own.** The staging cortex revision reads the production atoms store, so a verified zero cannot be minted on staging.
7. **The P-249 halves disagree on the "not onboarded" class** (Waco): cortex draws it, the panel declines it (P-303).
8. **The envelope route gives the withheld area figure to anonymous callers** (P-304).
9. **The Vercel Preview retrieval key was stale** since P-251 (fixed; P-305 carries the check).
10. **A `utilityService` value cell with no payload** on `48453:941709`; the population is unmeasured.
11. **The 09-16 Cotality ruling was written only into the generated `_STATE.md`.** Its source still reads "EXTINGUISHED", so any regeneration reverts it.
12. **Lease contention showed up twice.** The first factory-store lease expired unrenewed at 02:40Z because the next session started at 04:52Z. The hourly scheduler refused twice behind lane leases, which is the design.

## Mistakes, stated

- I recorded P-259b as fired before the operator had fired it (corrected before commit).
- I squash-merged engine #465, where that repo uses merge commits. The content is identical.
- My first P-249 grader checked the area figure at the route, not the surface, and I pre-registered a Waco expectation from a fixture misread. Both are corrected in the proof record.
- One Caldwell staging run went out without `--gold` and refused cleanly.

## Open at close

- Travis production publish `g68rt` still running; Williamson not started; the Hays production-only re-grade for P-301 queued. The scripts are in `P:/tmp/integration-handoff/`.
- Lanes running: P-259b, P-266/P-268, P-275 (rooted in `P:/doc_repo`), P-256b.
- P-303, P-304 and P-305 compiled, not fired.
- P-276's drift check needs a scheduled home (an IAM grant for the operator).
- The state files hold someone else's uncommitted edit, plus the Cotality source drift.
