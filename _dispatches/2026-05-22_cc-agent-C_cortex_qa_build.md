---
id: 2026-05-22_cc-agent-C_cortex_qa_build
title: Dispatch — Cortex / Design Tools QA build (2026-05-22 fix run plus features)
date: 2026-05-22
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [43_cortex_qa_backlog, 42_design_accelerator_program_plan, 48_codex_program_plan, 44_mcp_cortex_architecture_map, 28_mcp_first_product_design, _decisions/2026-05-22_codex_review_surface_relocation, 90_runbooks/cloud_run_canary_deploy, 90_runbooks/neon_schema_migration_via_cloud_shell, 00_current_state, 20_agent_operating_rules]
---

# Cortex / Design Tools QA build — 2026-05-22

You are cc-agent-C, the single owner of `legacy-design-tools` for this run. The 2026-05-22 deploy put all merged work live on `cortex-api-00017-gex` (production, `cortex-api-tds7av26va-uc.a.run.app`). The operator's QA pass found the app is not yet functional enough to QA: the architect customer-zero loop is broken at multiple points. This dispatch is the full QA build — three phases, run in order, exclusive ownership of the repo throughout.

This dispatch consolidates and supersedes three earlier 2026-05-22 dispatches: the cc-agent-D fix session, the cc-agent-AC `cloud-run-deploy.yml` shift-traffic dispatch, and the cc-agent-C IFC-ingest schema-migration dispatch. The "cc-agent-D" agent name is retired; all `legacy-design-tools` work in this run is cc-agent-C. Take a fresh session per phase and re-orient from this dispatch plus your `_inbox/` reports each session. The operator reports the fleet idle; confirm no other agent is active in `legacy-design-tools` and work from a clean clone.

## The three phases, in order

1. **Phase 1 — the customer-zero loop.** Make the broken loop work end to end. Highest priority; the app is not QA-able until this lands.
2. **Phase 2 — the deploy workflow.** Add shift-traffic, rollback, and migration jobs so deploys are agent-runnable and stop drifting the prod DB.
3. **Phase 3 — the feature build.** QA-27 link-drop intake, QA-28 in-app letter generation, QA-29 client presentations.

The phases are sequential and may not be reordered. The features in Phase 3 build directly on the loop in Phase 1, and Phase 2 must land before Phase 3 so feature schema changes migrate automatically instead of drifting prod the way the last fix session did. End each phase with an `_inbox/` report and hold for the operator before starting the next.

Test engagement: Musgrave_Residence_B, engagement id `977b5469-4b26-4bd0-895e-71ec752b7409`, a Moab / Grand County UT engagement.

## Diagnose-first

One bug in Phase 1 has a verified root cause (P0-1, IFC). Everything else has precise symptoms and screenshot evidence but no confirmed root cause. Diagnose each against the source and the Cloud Run logs before fixing; do not prescribe from the symptom. The last fix session did not land because fixes shipped in code while the prod environment lagged — verify every fix against the deployed app on the Musgrave engagement, not green CI. The production logs are readable via `gcloud logging read 'resource.labels.service_name="cortex-api" ...'` against `legacy-design-tools-prod`; that is how P0-1 was diagnosed.

---

## Phase 1 — the customer-zero loop

The architect's loop, end to end, is the success bar: push the Revit model from the add-in, the model and its IFC land in the app, the engagement geocodes, site context (terrain, parcel, zoning) loads, a 3D site assembles (terrain plus building), the architect runs site analysis (the canonical question is "what happens when 4 inches of rain falls"), then runs a pre-submittal compliance review, sees findings, and submits to the jurisdiction. Today it breaks at the IFC push, the geocode, the site-context render, the 3D site, the map, and the review. Fix until the loop runs.

### P0-1. IFC upload fails (HTTP 500). Root cause VERIFIED.

A Revit IFC push to `POST /api/snapshots/{id}/ifc` returns 500. The production log shows `column materializable_elements.superseded_at does not exist`, thrown from `ingestSnapshotIfc` (`artifacts/api-server/src/lib/ifcIngest.ts:389` and `:394`).

The production database is missing the `superseded_at` column on `materializable_elements`, a schema-migration gap. The column comes from PR #33 (supersede-and-append on re-ingest). The QA-04 session applied migrations 0009-0014 manually; the migration that adds `superseded_at`, and everything since, was never applied. The cortex-api deploy does not run migrations.

Fix: audit the production DB's applied-migration state against the drizzle migration head on `main`, and apply the full gap per `90_runbooks/neon_schema_migration_via_cloud_shell.md`. The prod DB is likely under-migrated for more than IFC alone — identify every migration since 0014, not only the `superseded_at` one. This round's apply is the manual operator-supervised cloud-shell path; Phase 2 P2-2 builds the workflow job that automates it for every deploy after. Operator-supervised: surface the migration plan for operator approval before any prod-DB write. Verify: a real Revit IFC push returns 201.

### P0-2. Geocoding does not complete.

The test engagement has an address but the Site tab shows COORDINATES "—", JURISDICTION "—", GEOCODED "Not yet". No geocode means no coordinates, which cascades into a blank map, a blank 3D site, and degraded site context. Yet the site-context Generate Layers run did resolve a lat/lng (ugrc:dem, ugrc:parcels, grand-county-ut:roads returned ok). So either the geocode runs inside the layer pipeline but is never persisted back to the engagement, or there are two geocode paths that disagree. Diagnose the geocode path: when and where it runs, where it persists, why the Site tab and the map read "not yet". Fix so an engagement with an address geocodes and the coordinates persist where every consumer (Site tab, map, 3D, site-context) reads them.

### P0-3. The 3D site does not assemble or render.

With IFC fixed (P0-1) and geocode fixed (P0-2), the 3D site must actually assemble: terrain (the DEM the `ugrc:dem` adapter returns) plus the parcel plus the pushed building model, rendered in the Site context 3D view. Today the 3D view is blank. Diagnose why the 3D site does not render once its inputs exist, and fix it through to a visible 3D site. The operator's canonical use is a drainage question, "what happens when 4 inches of rain falls": the 3D site must carry real terrain geometry, not a placeholder, because that surface is the substrate for the analysis. If the rain or drainage analysis itself is a missing capability rather than a bug, do not build it here; flag it for the planner with what exists.

### P1-1. Site context does not render despite being logged.

The Generate Layers run logs adapter results in the run detail (ugrc:dem ok, ugrc:parcels ok, grand-county-ut:roads ok, and so on), but the site-context views do not surface that data. Data is fetched and logged, not displayed. Diagnose the wiring between the layer-run results and the Site context map and 3D views; fix so a successful adapter result renders.

### P1-2. Map view is blank.

The Site context map view shows "Add an address on the Site tab to load the parcel map" even though the engagement has an address. Largely downstream of P0-2 (no persisted geocode). Confirm it resolves once geocoding persists; if not, diagnose the map's data dependency separately.

### P1-3. Site-context adapter timeouts.

Site-context adapters fail intermittently across engagements, in two observed error modes. On production engagement 343 E 200 N: `epa:ejscreen`, `fcc:broadband`, `grand-county-ut:parcels`, and `grand-county-ut:zoning` failed with "request was cancelled by the caller during attempt N". On the canary Musgrave engagement: `ugrc:dem`, `ugrc:address-points`, `grand-county-ut:parcels`, and `grand-county-ut:zoning` failed with "ArcGIS did not respond in time — the request exceeded its time budget". QA-22 Part 1 (#63) widened the per-adapter timeout floors; these upstreams still fail. Diagnose whether #63's floors are deployed and sufficient, whether the "cancelled by the caller" mode is a different bug from the timeout mode, and whether the GIS upstreams need a longer budget, a retry, or a different reliability treatment. Lower priority than P1-1: a degraded layer set should still render the layers that did succeed.

### P1-4. Relocate the compliance review into the Design Tools app.

The Codex review surface shipped as a standalone artifact at `/codex-reviewer-qa` (streams CDX-3/4/5/9). The operator's ruling: that placement is wrong. The pre-submittal compliance review is an architect-workflow feature and belongs in the architect's Design Tools dashboard, surfaced through the existing **Findings** tab on the engagement, not at a separate URL. Bring the run-review trigger, the finding cards, and the accept / edit / reject adjudication into the `design-tools` artifact's Findings tab. This reverses CDX-Phase1-1 per `_decisions/2026-05-22_codex_review_surface_relocation.md`. The L-surface and the engine review path are shared, so this is a UI relocation, not an engine rebuild; diagnose what the standalone artifact does and surface the same capability in-app. Do not delete the standalone `codex-reviewer-qa` artifact — it stays as the reference for the eventual smartcity-os production reviewer surface (Codex Phase 4).

### P1-5. "Run review" errors out.

In the current surface, Run review fails with "Could not start the review run. Try again." Diagnose the review-run trigger (`POST /api/submissions/{id}/findings/generate` and its status path) against the logs; fix so a review run starts and completes.

### P1-6. Review corpus and jurisdiction resolution.

The review surface warns "No indexed code corpus matches this jurisdiction label" for a Moab / Grand County engagement, even though a Grand County corpus exists in the substrate. Diagnose the corpus resolution from the engagement location (`keyFromEngagement`) and why the Grand County corpus is not matching; fix so a Moab engagement resolves to the Grand County corpus and findings carry real citations.

### Phase 1 exit

The customer-zero loop runs end to end on the Musgrave engagement against the live deployed app: a Revit push lands, the engagement geocodes, site context renders, the 3D site assembles, a compliance review runs from the Findings tab and produces cited findings. Report to `_inbox/` and hold for the operator before starting Phase 2.

---

## Phase 2 — the deploy workflow

Phase 2 makes the cortex-api Cloud Run deploy fully runnable as an operator-supervised agent dispatch, and closes the schema-drift mechanism behind P0-1. It is small and isolated — `.github/workflows/cloud-run-deploy.yml` plus `docs/deploy.md` — but it must land before Phase 3 so feature schema changes migrate cleanly instead of drifting prod.

### P2-1. Shift-traffic and rollback jobs.

Today `build-and-push` runs on every push to `main` (image only, no deploy); `deploy-canary` is `workflow_dispatch`-only and deploys a 0%-traffic `canary`-tagged revision. The traffic shift that promotes the canary is a manual `gcloud run services update-traffic` a human runs, per `90_runbooks/cloud_run_canary_deploy.md`. An agent cannot run that — it needs local GCP credentials no agent has. The deploy workflow itself authenticates via workload-identity-federation.

Add an `action` input on `workflow_dispatch` — a choice of `deploy-canary` / `run-migrations` / `shift-traffic` / `rollback`, default `deploy-canary`. Each `workflow_dispatch` job gates on `inputs.action`, so one dispatch runs exactly one job. The existing `deploy-canary` job keeps its behavior, now gated on `action == 'deploy-canary'`. Add a `shift-traffic` job that reuses the same GCP auth steps and runs `gcloud run services update-traffic cortex-api --to-tags canary=100 --region us-central1`, then echoes the resulting traffic split and curls `/api/healthz` on production. Add a `rollback` job that takes a `rollback_revision` input and runs `gcloud run services update-traffic cortex-api --to-revisions <rollback_revision>=100`, echoing the result.

### P2-2. The migration job.

The cortex-api deploy ships code and never runs database migrations. Every schema-touching PR since the cutover has drifted the prod DB behind the code; the P0-1 IFC 500 is that drift surfacing. Add a `run-migrations` job, `workflow_dispatch`-only, gated on `action == 'run-migrations'`: it authenticates with the same credentials and applies outstanding drizzle migrations to the cortex-api production database. Echo the pending-migration list before applying and the applied state after. Diagnose the correct migrate invocation from the repo (the drizzle-kit migrate command or the project's migration script). Update `90_runbooks/cloud_run_canary_deploy.md` so `run-migrations` is a mandatory step in the canary sequence: deploy-canary, then run-migrations, then smoke, then shift-traffic.

### Hard constraints.

Never auto-shift traffic or auto-run migrations on push. `build-and-push` stays push-triggered and image-only. `shift-traffic`, `rollback`, and `run-migrations` are `workflow_dispatch`-only, never reachable from a `push` event. Preserve and extend the existing workflow comment that forbids coupling a traffic shift to push. The canary discipline stays: deploy-canary, run-migrations, smoke, shift-traffic are separate deliberate operator-triggered actions. Do not change `deploy-canary`'s deploy flags, env vars, or secrets.

### Phase 2 exit

The cortex-api deploy is runnable end to end through `gh workflow run` with no local `gcloud`, and the prod DB no longer drifts behind the code on deploy. `docs/deploy.md` documents the `action` input and the deploy / migrate / shift / rollback flow. Report to `_inbox/` and hold for the operator before starting Phase 3.

---

## Phase 3 — the feature build

Phase 3 builds three product features the operator flagged in the 2026-05-22 QA pass. All three depend on the customer-zero loop working (Phase 1) and on Phase 2's auto-migrating deploy. They are built UI-first in the Design Tools app, correct for an existing UI-first product; each new capability is logged in `43_cortex_qa_backlog.md` as a tracked Cortex MCP-retrofit follow-on per `28_mcp_first_product_design.md` — you build the in-app surface here, the MCP retrofit is a separate roadmap line, not this dispatch. Build QA-27, then QA-28, then QA-29.

### QA-27. Start a project from a dropped link.

Today a Design Tools engagement is created by the Revit add-in push — model-first. The operator wants the inverse: start a project in the app by dropping in the raw material of a client interaction (a listing link, an image, pasted text, an email thread), have the in-app agent synthesize it into engagement context, and create the engagement — with the Revit model attached later. The operator's framing: most client interactions start with links, images, text, and email that can be synthesized before any drafting begins.

Build: (1) an intake entry point in the Design Tools app to create a new engagement from dropped or pasted material; (2) chat.ts tool-surface additions — a controlled fetch-and-parse tool for an external URL or uploaded document, and an engagement create/populate tool — extending the WS-C in-app agent tool set (the in-app agent today cannot fetch external URLs); (3) engagement creation that does not require a Revit model, so a model can be allocated to the engagement afterward.

Quality-gate guardrail, hard requirement: synthesized intake is draft. Every fact the agent extracts (address, lot size, project type, client note) carries the source it came from, is marked AI-origin, and is flagged unverified until the operator confirms it. This mirrors the QA-23 grounding guardrail and the WSC.5 agent-write guardrails (source attribution, timestamp, AI-origin marker, reversible, agent-action log). The agent must not present synthesized intake as confirmed fact. Reuse the WSC.5 pattern; do not re-derive it.

### QA-28. In-app letter generation.

The in-app agent today cannot generate a client letter or export a document — it reports the function is not in its toolset. The L3 deliverable-letter atom and the L6 DOCX/PDF render pipeline already exist and are proven (CDX-9 composed adjudicated findings into an L3 deliverable-letter and rendered it via L3/L6).

Build: a generate-deliverable-letter tool on the in-app chat (chat.ts), wired to the existing L3/L6 pipeline, so the architect can ask the in-app agent to compose an engagement's analysis or findings into a client letter deliverable.

Quality-gate guardrail: the generated letter carries code citations for every code claim and the standard feasibility caveats; it is a draft deliverable the architect reviews and edits before sending. The in-app agent itself surfaced the right checklist on the 343 E 200 N engagement — firm name and license number, a caveat that key dimensions need confirmation, a recommendation to engage the jurisdiction early, and an explicit statement that the output is a feasibility assessment and not a legal approval. The letter template prompts for or includes those.

### QA-29. Client presentations.

A new deliverable type: a branded, exportable client presentation packet. Client work moves from intake (QA-27) through analysis to a presentation the architect gives the client.

Build: a presentation-packet deliverable that assembles selected engagement artifacts — a cover, the project summary, site context, selected sheets or renders, and feasibility findings — into a branded PDF, generated through the existing L6 render pipeline, as a draft the architect reviews and edits. Scope it as a deliverable peer to deliverable-letters, not a new engine capability.

Planner pre-clearance: QA-29 is a Cortex / Design Tools product feature on the Empressa product surface, a deliverable export peer to letters, free at Layer 1. The planner has cleared it against the catalog thesis — it is a product UX feature, not a metered catalog product — so no separate catalog-thesis gate blocks the build. Same quality-gate guardrail as QA-28: code and site claims in the packet carry citations and caveats; the packet is a draft.

### Phase 3 exit

QA-27, QA-28, and QA-29 each work on the deployed app: a dropped link creates a populated draft engagement, the in-app agent generates a draft client letter, and an engagement exports a draft presentation packet. Report to `_inbox/`.

---

## Deploy and verification

Code fixes ship as PRs; the operator merges and deploys per `90_runbooks/cloud_run_canary_deploy.md` (canary, run-migrations, smoke, traffic shift). The schema migration in P0-1 is, this round, a manual operator-supervised prod-DB apply via `90_runbooks/neon_schema_migration_via_cloud_shell.md`, because P2-2's workflow job does not exist yet; P2-2 then automates it. CI is authoritative for tests, but the success bar is behavioural: each phase verifies against the live deployed app on the Musgrave engagement, not green CI. The last fix session merged correct code that never took effect because the prod environment lagged — do not repeat that.

## Run posture

Operator-supervised throughout. PRs for review, no self-deploy. The prod-DB migration plan (P0-1) is surfaced for operator approval before any write. cc-agent-C is the exclusive owner of `legacy-design-tools` for the whole run; confirm no other agent is active before each phase. Work from a clean clone; re-orient onto `main` and pull first at the start of each session.

## Reporting

At every session break-point, write your session summary and per-bug diagnosis to `P:\doc_repo\_inbox\` as `<date>_legacy-design-tools_cc-agent-C_<topic>.md` per HR-11 in `20_agent_operating_rules.md`. Do not commit to the doc repo; keep the durable record in your own repo. Diagnose-first reports (a diagnosis before the fix) are expected for every item except P0-1. If a diagnosis finds a missing capability rather than a bug — the P0-3 rain/drainage analysis is the flagged candidate — report it to the planner and do not build it in this dispatch.
