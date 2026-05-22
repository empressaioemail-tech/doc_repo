---
id: 2026-05-22_cc-agent-D_cortex_functionality_fix_session
title: Dispatch — Cortex / Design Tools functionality fix session (2026-05-22 QA)
date: 2026-05-22
agent: cc-agent-D
repo: legacy-design-tools
kind: dispatch
related: [43_cortex_qa_backlog, 42_design_accelerator_program_plan, 48_codex_program_plan, _decisions/2026-05-21_codex_reviewer_qa_surface_location, 45_codex_qa_scenarios, 90_runbooks/cloud_run_canary_deploy, 90_runbooks/neon_schema_migration_via_cloud_shell, 00_current_state, 20_agent_operating_rules]
---

# Fix session — Cortex / Design Tools functionality (2026-05-22 QA)

You are cc-agent-D, a fresh fix-session agent on `legacy-design-tools`. The 2026-05-22 deploy put all merged work live on `cortex-api-00017-gex` (production, `cortex-api-tds7av26va-uc.a.run.app`). The operator's QA pass found the app is not yet functional enough to QA: the architect customer-zero loop (push a Revit model, see it on the site in 3D, run analysis, run a compliance review, submit) is broken at multiple points. This dispatch is the fix session for those breaks.

The operator will append further QA items they have outstanding; this dispatch covers what the 2026-05-22 QA pass surfaced. Work it as a sequenced fix session, a PR per fix or per coherent cluster.

Test engagement: Musgrave_Residence_B, engagement id `977b5469-4b26-4bd0-895e-71ec752b7409`, address 1144 North Kayenta Dr, Moab UT 84532.

## The target — the customer-zero loop must work

The architect's loop, end to end, is the success bar: push the Revit model from the add-in, the model and its IFC land in the app, the engagement geocodes, site context (terrain, parcel, zoning) loads, a 3D site assembles (terrain plus building), the architect runs site analysis (the canonical question is "what happens when 4 inches of rain falls"), then runs a pre-submittal compliance review, sees findings, and submits to the jurisdiction. Today it breaks at the IFC push, the geocode, the site-context render, the 3D site, the map, and the review. Fix until the loop runs.

## Diagnose-first

One bug below has a verified root cause (P0-1, IFC). The rest have precise symptoms and screenshot evidence but not confirmed root causes. Diagnose each against the source and the Cloud Run logs before fixing; do not prescribe from the symptom. The production logs are readable via `gcloud logging read 'resource.labels.service_name="cortex-api" ...'` against `legacy-design-tools-prod`; that is how P0-1 was diagnosed.

## P0 — the core loop

### P0-1. IFC upload fails (HTTP 500). Root cause VERIFIED.

A Revit IFC push to `POST /api/snapshots/{id}/ifc` returns 500. The production log shows `column materializable_elements.superseded_at does not exist`, thrown from `ingestSnapshotIfc` (`artifacts/api-server/src/lib/ifcIngest.ts:389` and `:394`).

The production database is missing the `superseded_at` column on `materializable_elements`, a schema-migration gap. The column comes from PR #33 (supersede-and-append on re-ingest). The QA-04 session applied migrations 0009-0014 manually; the migration that adds `superseded_at`, and everything since, was never applied. The cortex-api deploy does not run migrations.

Fix: audit the production DB's applied-migration state against the drizzle migration head on `main`, and apply the full gap, per [`90_runbooks/neon_schema_migration_via_cloud_shell.md`](../90_runbooks/neon_schema_migration_via_cloud_shell.md). The prod DB is likely under-migrated for more than IFC alone. This was separately scoped in [`2026-05-22_cc-agent-C_ifc_ingest_schema_migration.md`](2026-05-22_cc-agent-C_ifc_ingest_schema_migration.md); that dispatch is folded into this session. Operator-supervised: surface the migration plan for operator approval before any prod-DB write. Verify: a real Revit IFC push returns 201.

### P0-2. Geocoding does not complete.

The test engagement has an address but the Site tab shows COORDINATES "—", JURISDICTION "—", GEOCODED "Not yet". No geocode means no coordinates, which cascades into a blank map, a blank 3D site, and degraded site context. Yet the site-context Generate Layers run did resolve a lat/lng (ugrc:dem, ugrc:parcels, grand-county-ut:roads returned ok). So either the geocode runs inside the layer pipeline but is never persisted back to the engagement, or there are two geocode paths that disagree. Diagnose the geocode path: when and where it runs, where it persists, why the Site tab and the map read "not yet". Fix so an engagement with an address geocodes and the coordinates persist where every consumer (Site tab, map, 3D, site-context) reads them.

### P0-3. The 3D site does not assemble or render.

With IFC fixed (P0-1) and geocode fixed (P0-2), the 3D site must actually assemble: terrain (the DEM the `ugrc:dem` adapter returns) plus the parcel plus the pushed building model, rendered in the Site context 3D view. Today the 3D view is blank. Diagnose why the 3D site does not render once its inputs exist, and fix it through to a visible 3D site. The operator's canonical use is a drainage question, "what happens when 4 inches of rain falls": the 3D site must carry real terrain geometry, not a placeholder, because that surface is the substrate for the analysis. If the rain or drainage analysis itself is a missing capability rather than a bug, do not build it here; flag it for the planner with what exists.

## P1 — site context and map

### P1-1. Site context does not render despite being logged.

The Generate Layers run logs adapter results in the run detail (ugrc:dem ok, ugrc:parcels ok, grand-county-ut:roads ok, and so on), but the site-context views do not surface that data. Data is fetched and logged, not displayed. Diagnose the wiring between the layer-run results and the Site context map and 3D views; fix so a successful adapter result renders.

### P1-2. Map view is blank.

The Site context map view shows "Add an address on the Site tab to load the parcel map" even though the engagement has an address. Largely downstream of P0-2 (no persisted geocode). Confirm it resolves once geocoding persists; if not, diagnose the map's data dependency separately.

### P1-3. Site-context adapter timeouts.

Some adapters fail with "did not respond in time" (grand-county-ut:parcels, grand-county-ut:zoning, intermittently the UGRC adapters). QA-22 Part 1 (#63) widened the per-adapter timeout floors; these upstreams still time out. Determine whether #63's floors are deployed and sufficient or whether the GIS upstreams need a longer budget or a different reliability treatment. Lower priority than P1-1: a degraded layer set should still render the layers that did succeed.

## P1 — the compliance review belongs in the app

### P1-4. Relocate "Run review" into the Design Tools app.

The Codex review surface shipped as a standalone artifact at `/codex-reviewer-qa` (streams CDX-3/4/5/9). The operator's ruling: that placement is wrong. The pre-submittal compliance review is an architect-workflow feature and belongs in the architect's Design Tools dashboard, surfaced through the existing **Findings** tab on the engagement, not at a separate URL. Bring the run-review trigger, the finding cards, and the accept / edit / reject adjudication into the Design Tools app's Findings tab. This reverses CDX-Phase1-1 ([`_decisions/2026-05-21_codex_reviewer_qa_surface_location.md`](../_decisions/2026-05-21_codex_reviewer_qa_surface_location.md)); the planner will reconcile that decision record and `48`. The L-surface and the engine review path are shared, so this is a UI relocation, not an engine rebuild; diagnose what the standalone artifact does and surface the same capability in-app.

### P1-5. "Run review" errors out.

In the current surface, Run review fails with "Could not start the review run. Try again." Diagnose the review-run trigger (`POST /api/submissions/{id}/findings/generate` and its status path) against the logs; fix so a review run starts and completes.

### P1-6. Review corpus and jurisdiction resolution.

The review surface warns "No indexed code corpus matches this jurisdiction label" for a Moab / Grand County engagement, even though a Grand County corpus exists in the substrate. Diagnose the corpus resolution from the engagement location (`keyFromEngagement`) and why the Grand County corpus is not matching; fix so a Moab engagement resolves to the Grand County corpus and findings carry real citations.

## Deploy and verification

Code fixes ship as PRs; the operator merges and deploys per [`90_runbooks/cloud_run_canary_deploy.md`](../90_runbooks/cloud_run_canary_deploy.md) (canary, smoke, traffic shift). The schema migration (P0-1) is an operator-supervised prod-DB apply. After the session, the customer-zero loop runs end to end on the Musgrave engagement. CI is authoritative for tests.

The deploy not running migrations is the root mechanism behind P0-1 and likely more. Recommend, in your report, folding migration application into the deploy process so this stops recurring; do not build that here.

## Run posture

Operator-supervised. PRs for review, no self-deploy. The prod-DB migration plan is surfaced for operator approval before any write. Confirm no other agent is active in `legacy-design-tools` before starting (the operator reports the fleet idle); use a clean clone.

## Reporting

Session summary and per-bug diagnosis to `P:\doc_repo\_inbox\` as `<date>_legacy-design-tools_cc-agent-D_<topic>.md` per HR-11 in [`20_agent_operating_rules.md`](../20_agent_operating_rules.md). Do not commit to the doc repo.
