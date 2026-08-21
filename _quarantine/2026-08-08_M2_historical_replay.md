---
id: canon_divergence
title: Canon-vs-reality divergence report (M2)
status: ALARM
last_updated: 2026-08-09
generated_by: scripts/canon-divergence.mjs
checks: P:/doc_repo/_catalog/repo_intents_checks.2026-07-04.json
---

# Canon divergence (M2)

Generated 2026-08-09. Runtime 778 ms. Window: since=2026-07-04 until=2026-08-09. Fetch=no.

**Summary:** 2 divergent · 0 acknowledged · 5 ok · 0 skipped · 0 repos unmonitored · 0 empty-posture rows.

Alarm surface: this file. `_STATE.md` GOVERNANCE links here. Not Command Center — the watcher must not carry a five-service deploy dependency.

Cadence: `.claude/hooks/canon-divergence-run.ps1` on Read of `_STATE.md` (stale-report refresh, fail-open). Manual: `node scripts/canon-divergence.mjs`.

## ESCALATED (divergent >30d, unacknowledged)

Governance process is broken for these rows — posture not updated and no `acknowledged_until`.

- **legacy-design-tools::repo** (legacy-design-tools): first seen 2026-07-04, age ≥30d, verdict DIVERGENT-SEVERE
- **ldt-clock2-cortex-console** (legacy-design-tools): first seen 2026-07-04, age ≥30d, verdict DIVERGENT-SEVERE

## DIVERGENT

| Check | Repo | Posture | Commits | Feat | Severe-path | Since | Verdict | Note |
|---|---|---|---:|---:|---:|---|---|---|
| legacy-design-tools::repo | legacy-design-tools | retiring | 223 | 82 | 20 | 2026-07-04 | DIVERGENT-SEVERE | HISTORICAL: whole-repo retiring as declared in prose. OVERBROAD vs clock-3 'shrink by absorption' (maintenance commits expected). Load-bearing true positive is ldt-clock2 path scope. Repo-level any-commit is the coarse Failure-1 signal only. OVERBROAD: whole-repo retiring/zero-new-work alarms on any commit, including clock-3 maintenance the decision may have expected. Prefer path-scoped clocks for the load-bearing signal. 223 commit(s) since 2026-07-04 against posture 'retiring'. See _decisions/2026-07-04_ldt_decomposition_retirement_path.md. |
| ldt-clock2-cortex-console | legacy-design-tools | zero-new-work | 23 | 13 | 0 | 2026-07-04 | DIVERGENT-SEVERE | Console extracts in Phase 3 — zero new feature work in place. 23 commit(s) since 2026-07-04 against posture 'zero-new-work'. See _decisions/2026-07-04_ldt_decomposition_retirement_path.md. |

### Evidence (top commits)

#### legacy-design-tools::repo (legacy-design-tools)

- `505807aa` 2026-08-08 fix(county-rail-refresh): avoid ordinal unique-constraint collision on apply
- `079f8022` 2026-08-08 fix(county-manifest): refresh stale county_rail dimension, retire join as a rail
- `76905c0a` 2026-08-08 feat(txgio): opt-in EPSG:3857 reprojection to unblock the 202505 vintage (#397)
- `457ba565` 2026-08-08 fix(txgio): clear the three statewide-ingest blockers — projection, allowlist, write path (#396)
- `5882166e` 2026-08-08 fix(county-manifest): demote doctrine zoning cells from satisfied-absent to not-yet (#395)
- `550df72d` 2026-08-08 chore(debris): fix false Cotality/Regrid message, remove dead regrid + map-embed modules (#394)
- `85f3c370` 2026-08-08 feat(boundary): L1 statewide city and county boundary layer (#392)
- `b9807f7e` 2026-08-08 feat(county-manifest): Sprint 1 thin slice — 254x13 honest manifest grid (#391)
- `cf41c1a5` 2026-08-06 fix(cad-ingest): vertex-sweep fallback for partial-geometry stamp PIP misses (#390)
- `95639d67` 2026-08-05 feat(api-server): scoped tier1 bake via --prop-ids-file (#389)
- `b1ef76de` 2026-08-05 Merge pull request #388 from empressaioemail-tech/fix/t4-cortex-user-daily-cap
- `0f37b505` 2026-08-05 fix(cortex-api): set production CORTEX_USER_DAILY_API_LIMIT to 10000

#### ldt-clock2-cortex-console (legacy-design-tools)

- `1ba8ba16` 2026-07-18 feat(cortex-tiles): preserve parcel_node_id through to the map feature + selection (was stripped) (#290)
- `28bd573b` 2026-07-18 feat(brokerage): buildable-envelope derivation (parcel inset by setbacks) + render layer (#287)
- `6d039311` 2026-07-17 feat(cortex-tiles): promote BimModelViewport into a published GLB/BIM viewer tile (was dormant in private portal-ui) (#284)
- `698b3d21` 2026-07-16 feat(cortex-client): parcel-terrain-model tile capability (surfaces the live MCP tool) (#278)
- `b8233df4` 2026-07-16 chore(cortex-tiles): bump to 0.1.10 (publish SubsurfaceTile SSURGO overlay push, PR #275) (#277)
- `cf4c3880` 2026-07-16 feat(cortex-tiles): federal GIS layers + zoning paint + LOD honest-empty (map data completeness) (#271)
- `b278a5fc` 2026-07-16 feat(cortex-tiles): push SSURGO foundation-risk soils overlay from SubsurfaceTile (#275)
- `bcec1cd6` 2026-07-16 fix(cortex-tiles): storm-guard the live-GIS viewport loop (black-map bug) (0.1.8) (#270)
- `d26b507c` 2026-07-16 feat(cortex-tiles): brokerage address-keyed site-context + headless entry (0.1.7) (#269)
- `5e61aaac` 2026-07-16 feat(cortex-tiles): RAW-FUNCTION mode as pure callable functions (0.1.6) (#268)
- `63e73fca` 2026-07-16 chore(cortex-tiles): bump to 0.1.5 to publish LiveMapTile (#266)
- `5fa26e31` 2026-07-16 chore(cortex-tiles): bump @hauska/map-renderer to ^0.1.2 (#265)

## OK

| Check | Repo | Posture | Commits | Last verified |
|---|---|---|---:|---|
| ldt-clock1-root-spa | legacy-design-tools | zero-new-work | 0 | 2026-07-04 |
| hauska-engine::repo | hauska-engine | active | 315 | 2026-07-04 |
| hauska-map::repo | hauska-map | active | 225 | 2026-07-04 |
| hauska-atom-contract::repo | hauska-atom-contract | active | 28 | 2026-07-04 |
| smartcity-os::repo | smartcity-os | no-touch | 0 | 2026-07-04 |

## Meta

- checks_schema: 1
- as_of_intent: 2026-07-04
- unmonitored_empty_posture: 0
- unmonitored_absent_repos: 0
- per_repo_last_verified: yes (repo_intents_checks.json, not doc-level last_updated)

To acknowledge without changing posture: set `acknowledged_until: YYYY-MM-DD` on the check or repo row. Never a permanent mute. A row red >30d with no ack appears under ESCALATED.
