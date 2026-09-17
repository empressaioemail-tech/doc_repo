---
id: 2026-09-17b_HANDOFF_integration_seat
title: Handoff to a fresh integration-seat planner, 2026-09-17 afternoon
date: 2026-09-17
last_updated: 2026-09-17
status: active handoff
kind: handoff
owner: nick
from: integration seat, session 06a91261 (operator-called close, 2026-09-17 about 14:35Z)
programs: [OPS-24, OPS-16]
related:
  - _inbox/2026-09-16_texas_scaleup_ROADMAP.md (the live state and the queue; read it second)
  - _sessions/2026-09-17_serving_cutover_and_lane_integration_claude_code.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md (A-201 to A-206; rows P-301 to P-305)
  - _catalog/program_preambles/OPS-24.md
  - _inbox/2026-09-17_HANDOFF_integration_seat.md (consumed; its "Traps" section still applies)
snapshot: doc_repo main at the close commit; engine 1d9e4752 (retrieval 00098-cat, engine-api 00249-kiw); LDT c40423a5 (cortex 00820-jex); map 93f832b6 (Property Explorer k8hha93vj); factory c7bd819b; corpus 1.4.0
---

# Handoff: the integration seat, 2026-09-17 afternoon

You are the integration seat in `P:/doc_repo` on `main`. You plan, review, merge, deploy and
grade; lanes build; the operator (Nick) fires the dispatches you compile. You are the only
planning session. Work in active program management mode: drive, decide, report. Commit only
after showing the operator the batch.

## Read first

1. `CLAUDE.md`, `ENFORCEMENT.md` (auto-loaded) and your memory index.
2. `_inbox/2026-09-16_texas_scaleup_ROADMAP.md`. It was rewritten at this close and carries the
   live services with rollback targets, what is in flight, the ordered queue and what the operator
   owes. Update it whenever a row changes state, with a change-log line, and take timestamps
   from `date -u`.
3. OPS-16 amendments **A-201 to A-206** and rows **P-301 to P-305**.
4. The traps in the consumed handoff (`_inbox/2026-09-17_HANDOFF_integration_seat.md`, section 5),
   plus the new ones below.

## 1. Do these first

1. **Travis production publish** `factory-bastrop-publish-g68rt` (project `hauska-prod-497015`,
   region `us-east4`; started 12:48Z; its staging run took 2h14m). When it ends, grade it on the
   authoritative row. Read `place_layer_snapshots` (`adapter_key='node-facets:tier1'`,
   `place_key='node:48453:367134'`) on the production neondb (`PRODUCTION_NEONDB_URL`, read-only)
   and check that `payload_json->>'bakedAt'` is later than 12:48Z. Also read `get_smart_site` for
   that parcel.
2. **Williamson republish: check whether it started.** The closing session queued it from a
   background script that may not have survived. If `factory-bastrop-publish` has no
   `--county=48491` execution after Travis, start it (one county at a time; the staging reset is
   county-agnostic):
   `bash P:/tmp/integration-handoff/republish-county.sh 48491 <probe> 48491:76149`.
   The probe must be a **non-retired** Williamson parcel; `R352566` is retired, so pick one whose
   `node-facets:tier1` row carries no `recordRetirement`. The walk should now be green, because
   the publish image carries P-301. If it is red, the script accepts it only with
   `ACCEPT_WALK_FAILED=1` (the operator allowed that for Williamson).
3. **Hays production-only re-grade (grades P-301):**
   `bash P:/tmp/integration-handoff/production-only.sh 48209 48209:135570` after Williamson.
   Pass condition: the walk record for that run reads `verdict: pass`, and
   `declinedRetirement.accepted` is 16 with `byRefusalError.record_retired` 16. Then P-301 is
   graded.
4. **Six-county republish close:** when Travis and Williamson are graded, record A-190's
   republish as done in the roadmap. **P-294's next step** is to create its schedule without
   enabling it (`scripts/create-republish-on-change-scheduler.mjs --print`), run one dry cycle of
   `factory-republish-on-change`, and grade it.

## 2. The lanes (the operator reports their closes)

Closes land in the lane's own doc_repo worktree (`P:/seat-worktrees/<lane>/doc_repo`), the
dispatch-planner worktree, `P:/doc_repo`, or `C:/Users/cente/doc_repo`. Search all of them and
copy the files into `P:/doc_repo/_inbox`. The glob `P:/seat-worktrees/*/doc_repo` over all seats
can time out, so search named paths.

| Lane | Repo | When it lands |
|---|---|---|
| P-259b (fired) | LDT #712 | Review. Merge `main` into it if behind, and let CI run on the integrated tree. Merge, deploy cortex (canary, lease, shift), then apply the Austin stamp after its dry run and rerun the P-255 census |
| P-266 with P-268 (fired) | factory | Review, merge, rebuild the writer images that change, run each writer per county (staging first where supported). Then run `factory-publish-gate-sched` once by hand and rerun `scripts/six-county-completeness.mjs` |
| P-275 (fired; **rooted in `P:/doc_repo`**) | engine | Review. Any reactivation is a mass state change: bring the per-county count to the operator before applying. While its claim is live, the FAN-DEPTH gate refuses sub-agents from `P:/doc_repo` |
| P-256b (fired) | factory #160 | Review, merge, rebuild the setback and envelope writer images. Dry-run each county and apply only within A-199's ceilings (Bastrop 5,518; Caldwell 5,116; Hays 18,904; McLennan 43,305; Travis 103,283; Williamson 43,346 parcels; more than 2 percent over goes back to the operator). Then re-run P-258's writer, re-grade the census, and fire P-300 |
| P-303 (compiled, **not fired**) | hauska-map | Review, merge, deploy Property Explorer (Vercel CLI from the repo root, `vercel deploy --prod`). Grade: Waco `48309:103015` draws on smartsite.cloud |
| P-304 (compiled, not fired) | LDT (and map) | Review, merge, deploy. Grade: an anonymous POST to the envelope route for an unverified parcel returns no area figure |
| P-305 (compiled, not fired) | hauska-map / doc_repo | Review; commit its instrument and runbook change; run the check once |

## 3. The queue after that

The roadmap's "Owed by the integration seat" table is the order. Main items: the P-276 drift-check
venue (an IAM grant for the operator), the empty `utilityService` value-cell measurement (once no
lane holds the factory store), P-296's dispatch (its migration `0102` is still unapplied; do not
run cortex `run-migrations` until P-296 stages it), the engine corpus bump to 1.4.0, the engine
slate re-vendor (P-282), P-254 and P-286, then the rest of Phase 0.

## 4. Owed by the operator

Firing P-303, P-304 and P-305. The IAM grant for P-276's venue. A decision on the uncommitted
state files: someone's 13:28Z DigitalOcean standing decision is in the working tree, and the
Cotality line in `_state/shared/STANDING_DECISIONS.md` still reads "EXTINGUISHED", so any
`_STATE.md` regeneration reverts the 09-16 ruling. P-278, Cotality (P-267, P-283), the P-243 and
P-244a account check, and the first automated production run of P-294.

## 5. New traps measured this session

- **The panel's `bakedAt` is not a bake time.** Grade a republish on the `node-facets:tier1` row
  and `get_smart_site`, never on `smartsite.cloud/api/spine/property-atoms/<id>/facets`.
- **Walk gold parcels:** only Bastrop has one registered. Every other county's publish needs
  `--gold=<county>:<prop_id>` (Caldwell `48055:20478`, McLennan `48309:176914`, Hays
  `48209:135570`, Williamson `48491:76149`, Travis `48453:493738`). Without it the run refuses
  `GOLD_REQUIRED` before any store work.
- **`factory-verify-walk --target=production` refuses `TARGET_ENV_MISSING`.** Its template has no
  production store secrets. Grade a production walk by a production publish instead.
- **Staging has no atoms store.** The cortex `staging` revision reads the production atoms store.
  Proofs run on a no-traffic canary with production data read-only.
- **LDT images for a non-main branch** are built with Cloud Build and BuildKit (the Dockerfile
  needs `DOCKER_BUILDKIT=1`). LDT's workflow builds only on push to main, and `deploy-canary`
  needs the full 40-character sha.
- **engine-api export grading** needs the gate-front headers (`x-hauska-product`,
  `x-hauska-tenant-id`, `x-hauska-package-id`, `x-hauska-gate-credential-id`,
  `x-hauska-access-tier`, `x-hauska-request-id`) plus the Bearer key. The route prefix is
  `/v1/property-nodes/<id>/feasibility-export`, and the refresh POST needs a JSON body (without
  one the response is 411). Build the engine-api image with a unique tag
  (`_IMAGE=...:<sha>`), not `:latest`. Its `envelope-canary` tag follows the latest revision.
- **Vercel:** `vercel env pull` returns sensitive values empty, so compare keys by behaviour.
  After an alias switch there is a 5 to 20 second window where the HTML names the other build's
  asset.
- **The dirty-tree close gate** blocks a push while `_STATE.md` is dirty. The logged escape hatch is
  `CLOSE_OVERRIDE=1 git push ...` (it logs to `_catalog/override_logs/integration.log`); use it only
  when the dirty state is not yours.
- **Scripts from this session** are in `P:/tmp/integration-handoff/`: `republish-county.sh`,
  `production-only.sh`, `record-compare.mjs` (retrieval `/record` before and after, self-test),
  `p249-proof.mjs` (envelope route grader, self-test), `p249-pe-leg.mjs` (panel facets compare),
  `bakedat-probe.mjs`.
- **A lane that roots itself in `P:/doc_repo`** (P-275 did) writes its claim there, and the
  FAN-DEPTH gate then refuses your sub-agents.

## Starter prompt for the fresh session

"You are the integration seat in P:/doc_repo. Read _inbox/2026-09-17b_HANDOFF_integration_seat.md
and do what it says: the republish items in section 1 first (Travis grade, Williamson, the Hays
re-grade for P-301), then handle the lane closes as I report them."
