---
id: 2026-09-18_wave2_deploys_RECORD
title: Property Explorer and cortex-api deployed with the Wave 2 lane halves, graded on the live surfaces
date: 2026-09-18
last_updated: 2026-09-18 (21:50Z)
status: done. Both deploys serve 100 percent and are graded; P-270's city half and its MCP label remain open (below).
kind: production-write record
owner: nick
maintained_by: integration seat
programs: [OPS-24, OPS-16]
plan_rows: [P-353, P-339, P-341, P-354, P-270, P-362]
snapshot: hauska-map main b08f4b89 (fresh clone P:/tmp/hauska-map-wave2-deploy-0918); legacy-design-tools main 2e7ca7c4; Vercel project property-explorer; Cloud Run cortex-api (legacy-design-tools-prod, us-central1); read 2026-09-18 21:48Z
related:
  - _inbox/2026-09-18_wave2_merges_RECORD.md (what was merged, with review findings)
  - _inbox/2026-09-18_p332_deploy_RECORD.md and _inbox/2026-09-18_ldt_cortex_api_deploy_RECORD.md (the procedures followed)
---

# Wave 2 deploys, 2026-09-18 evening

## 1. Property Explorer: `fohg2os70` from hauska-map `b08f4b89`

Carries map #423 (P-353), #422 (P-339 map half, P-341), #421 (P-354 map half, inert until row
dates are served) and #424 (P-270 address half, map). Deployed from a fresh clone at `b08f4b89`
(clean tree); the `.env.local` that `vercel link` writes (it held only `VERCEL_OIDC_TOKEN`) was
removed before the deploy. P-324's three Property Explorer variables are set and stay unused, because
P-324's code is not merged.

**Rollback target:** `property-explorer-m6wqid8u7` (`dpl_CtkVJ9wKJhocGnEc7j5MzZJihdhC`).

**What happened.** `vercel deploy --prod --yes` built in 35 s and created
`dpl_CbtxehqkgSaQaLcneDYf2C7TkDD2`, then sat at "Completing…". Read through the Vercel API, the
deployment was `READY` with `readySubstate: STAGED` and `aliasAssigned: false`, while the project
already named it its production target. Two `vercel promote` runs timed out ("exceeded its
deadline"). Vercel's status page showed an active incident, "Elevated Errors Triggering Deployments"
(investigating as of 20:32 UTC), with Build and Deploy in partial outage. Aliases were NOT moved by
hand during the incident, so the four production domains could not be split across two
deployments. Vercel completed the promotion itself: at 21:12Z the deployment read `PROMOTED`,
`aliasAssigned: true`, holding `smartsite.cloud`, `www.smartsite.cloud`,
`property-explorer-xi.vercel.app` and the project alias, and `vercel inspect smartsite.cloud` named
it. Production served the old deployment, unchanged, until then.

Before promoting, the new deployment's own URL was read on the same routes and already served every
change below, so the promotion was the only step outstanding.

**Grade, same reader before and after, on the live alias.** Reader `pe_wave2_read.mjs` (routes
`/api/pe-situs-search` and `/api/spine/property-atoms/<id>/facets`).

| Row | Before (`m6wqid8u7`, 20:10:35Z) | After (`fohg2os70`, 21:12:11Z) | Verdict |
|---|---|---|---|
| P-353 | four coverage subjects: 0 hits and no class for all four | `no-hit` (Austin 78701); `county_out_of_coverage` Milam 48331 (Cameron); `county_out_of_coverage` Burnet 48053 (Marble Falls); `out_of_coverage` CO (Denver) | PASS both directions on the BFF |
| P-341 | `48453:367134` serves `maxImperviousPct` 45 beside a `present` watershed fact of 30 | 30 served, `maxImperviousPctSources` zoning 45 and watershed 30 | PASS |
| P-339 (map) | disclosure "Codified setback table (unknown); depth-warm geometry withheld" | "Setbacks read from the property atom chain's own setback rule; the outline is drawn for reference by the drawing route, which owns this envelope's reason"; `reasonOwner: place/buildable-envelope` | PASS on the wording |
| P-270 (map) | `48453:445501`: no `situsZip`; `situsCity` an absent-verified declaration | `situsZip` 78660 served; `situsCity` still the declaration, no city on the line | PARTIAL, see below |

**P-270's city half does not fire on the live shape, and why.** The record reader serves
`situsZip`, `situsCity` and `situsState` on `48453:445501` as `legacy-transitional`, not `record`
(`recordRailStates`, read on the new deployment). The ZIP reaches the card from the cortex bake,
which #424 now carries through `mergeBakedBaseFacts`, not from the ledger rail. The lane's
city-limits fallback fires only on a `record`-served `situsCity` cell that is absent-verified, and by
its own fail-closed rule a `legacy-transitional` rail names no city. So "Pflugerville" (the
`cityLimits` rail, which IS served from the record) never reaches the line although the baked payload
carries the verified absence. This is the lane's own named open link ("whether the live retrieval
read serves the situsZip rail with a present cell"), now measured: the situs rails are not on the
record path for this parcel. The probe's `X2-address` predicate will read FAIL on the city there.
Closing it is a choice between cutting the three situs rails over to the record path and letting the
fallback read the baked declaration; it is a card, not a patch.

## 2. cortex-api: `00843-yir` from legacy-design-tools `2e7ca7c4`

Carries LDT #722 (P-362), #721 (P-270 address half, the MCP's situs label) and #720 (P-354 LDT half,
inert: LDT pins setback-corpus 1.2.0, whose rows carry no row dates). No migration in the range
(`25d1782f` to `2e7ca7c4`), so `run-migrations` was not dispatched. Build-and-push for `2e7ca7c4`
succeeded on the push event.

**Procedure, pre-registered.** Traffic lease `_catalog/leases/cortex-api.json` (planner-granted; no
other lane in the wave intends to shift cortex-api; P-324 is not fired), taken 21:38:34Z, deleted
21:48:11Z. The canary grader (`scripts/cortex-canary-compare.mjs`, self-test 12 of 12) has its three
2026-09-18 classes hardcoded and parses no `--intended`, so for this deploy PASS was declared as
**zero differences of any class**: no change in the range touches the draw route or the node facts.

| Step | Result |
|---|---|
| Calibration, production against itself | 93 comparisons over 52 subjects (`_inbox/2026-09-18_155840_surface_probe.json`), 0 differences. Counted from the artifact's `rows` field by a counter that refuses when that field is absent; a first count read a guessed field name and reported zero vacuously, which is why the counter exists. |
| `deploy-canary`, run 35398004402 | success. Its first P-279 step, through P-362's wrapper: `RESULT=clean`. Traffic by field: `cortex-api-00843-yir` tagged `canary` at 0 percent, `00841-jeh` 100 percent. The canary's digest `sha256:1b010eb4…` carries registry tags `2e7ca7c4…` and `latest`. |
| Canary grade | 93 comparisons, 0 differences: PASS as pre-registered. |
| `shift-traffic`, run 35398447652 | success. The job now checks out `2e7ca7c4` first. Post-shift P-279 step: `p279-tagged-revision-env: RESULT=clean`, `cortex-api serving=cortex-api-00843-yir tags=4 required=39 failing=0`. Traffic by field: `00843-yir` 100 percent (tag `canary`). |

**P-362 is customer-closed.** Its completion predicate's first half, "a dispatched cortex-api
`shift-traffic` run whose post-shift step prints `RESULT=clean`", is met on run 35398447652; the
second half was met by the lane's falsifiers. This is the first time that step ran in a workflow
GitHub started.

**Rollback handle:** `cortex-api-00841-jeh` (untagged, 0 percent, still a revision).

**P-270's MCP label is not graded here.** It changes the `get_smart_site` stub label, which the
canary grader does not request. It is graded by the probe's `X2-address` row with the MCP leg, which
needs the operator's sign-in (ruling 9).
