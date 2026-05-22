---
id: 2026-05-22_cc-agent-R_cortex_rendering_build
title: Dispatch — cc-agent-R Cortex rendering build (mnml.ai render engine)
date: 2026-05-22
agent: cc-agent-R
repo: legacy-design-tools
kind: dispatch
related: [40c_cortex_rendering_sprint, 40b_advanced_capture_features, 42_design_accelerator_program_plan, 43_cortex_qa_backlog, 20_agent_operating_rules]
---

# cc-agent-R dispatch — Cortex rendering build

You are cc-agent-R, a build agent spun up for the Cortex rendering
feature. This dispatch builds the mnml.ai render engine into Cortex,
replacing the placeholder Renders tab, covering both photorealistic
deliverable renders and early-design concept imagery. Full scope, atom
shape, and rationale are in
[`40c_cortex_rendering_sprint.md`](../40c_cortex_rendering_sprint.md);
this dispatch is the execution brief.

## Run now, in parallel — workspace isolation

The operator authorized this build to start immediately (2026-05-22), in
parallel with cc-agent-C's IFC-ingest migration and WS-G Cortex QA
build, rather than waiting for them to clear. The doc-set sequencing
gate (doc 40b activation-gate condition 5) is consciously overridden by
the operator.

Work a dedicated clone of `legacy-design-tools` per
[`90_runbooks/agent_workspace_hygiene.md`](../90_runbooks/agent_workspace_hygiene.md).
cc-agent-C is concurrently active in its own clone. The Renders tab and
`artifacts/api-server/src/routes/renders.ts` are yours alone; nothing
else touches them. Two overlap points need care:

- **Drizzle migrations.** You and cc-agent-C both add migrations. Pull
  `main` before creating one, take the next free number, expect to
  rebase. Never renumber an existing migration.
- **The atom registry.** Both builds may touch the engine atom
  registry. Reconcile `render-output` / `render-set` against existing
  types as Phase A.3 requires; if cc-agent-C's WS-G work has touched the
  registry on `main`, rebase onto it.

Conflicts resolve at PR-merge. Flag any you cannot cleanly resolve in
your `_inbox/` summary. Do not touch `chat.ts` — the chat-initiated
concept-imagery follow-on is cc-agent-C territory.

## Autonomy

Build autonomously through Phase A and Phase B. Do not stop for operator
sign-off. Open PRs and self-merge them to `main` once CI is green — the
`RENDERS_PROD_ENABLED` flag keeps all of this dark in production, so
merging incomplete work to `main` is safe by construction. Where a real
product decision is genuinely required, make the most reasonable call,
record it in the PR body and your session summary, and continue; the
operator will QA and correct. The one thing you do not do autonomously:
apply a database migration to the production DB. Prepare the migration,
keep it in the PR, and list it in your `_inbox/` summary as an operator
return-task. The feature does not need the prod migration applied to be
code-complete.

## Vendor API

mnml.ai. Base URL `https://api.mnmlai.dev/v1/`, auth header
`Authorization: Bearer <key>`. Every generation endpoint is
asynchronous: POST returns a job id, poll `GET /status/{id}` with
exponential backoff. The full surface table is in
[`40c`](../40c_cortex_rendering_sprint.md) under "mnml.ai API surface";
treat it as captured-from-docs reference dated 2026-05-22 and verify
each endpoint against the live API and the vendor docs at
`https://mnmlai.dev/docs` as you build.

Three load-bearing properties: async POST then poll, so build a durable
job model, not fire-and-forget; output URLs expire, so download every
output into GCS before finalizing the atom; the render engine is one
endpoint parameterized by `expert_name`, so the client is generic and
all six expert types come nearly free.

## Phase A — backend (api-server)

A.1 Audit the existing `artifacts/api-server/src/routes/renders.ts`
placeholder and the `RENDERS_PROD_ENABLED` flag. Report what is there
before replacing it. Build a generic typed mnml client covering
`archDiffusion-v43`, `video-ai`, `status/{id}`, `credits`, and
`prompt-generator` (surfaced), plus typed but not surfaced signatures
for the remaining power-tool endpoints. `MNML_API_KEY` binds as a Cloud
Run secret. Implement the error contract: 429 and 5xx exponential
backoff honoring `retry_after`, a three-retry cap, and
`insufficient_credits` surfaced as a clean caller-facing error.

A.2 Durable render-job model and a polling worker. The worker polls with
exponential backoff, reconciles status, and re-hydrates in-flight jobs
on process restart. On `success`, download every output from the mnml
`message` URLs into GCS before the URLs expire; store our GCS reference.

A.3 The `render-output` atom and the `render-set` parent atom. Per
ADR-001 and ADR-012, five render modes, `accessPolicy: tenant-private`
per ADR-017. Fields per [`40c`](../40c_cortex_rendering_sprint.md).
Reconcile against the existing `render-output` and `viewpoint-render`
registry types first; if `render-output` already exists, extend, do not
duplicate, and treat any registry change as a single coordinated bump.
The atom must carry the full generation parameter set, engine version,
seed, and an AI-origin marker, the reproducibility provenance the
quality-gate rule requires.

A.4 Four-direction elevation set: a batch of four render jobs, one per
camera direction, under one `render-set` parent atom with four
independently addressable child render-output atoms.

A.5 Video AI path through the same job model and worker.

Phase A exits with the full server-side render lifecycle testable via the
API.

## Phase B — frontend (design-tools)

B.1 New-render flow. The flow opens on an intent choice: **deliverable
render** or **concept imagery**. Deliverable render defaults to the
exterior/interior experts and photorealistic styles. Concept imagery
defaults to the `plan` expert for floor-plan concepts and the
sketch/illustration styles, and offers the Prompt Generator so the
architect can describe design intent in plain language and get a usable
prompt. Below the intent choice, a parameter-driven picker for expert
type, render style, and the per-expert parameter set, generated from the
mnml parameter schema rather than hand-coded per expert.

B.2 Source image input. First verify whether the Three.js GLB viewer
component exposes, or can be extended to expose, programmatic camera
control and frame export; report the finding before building. Two paths:
model-capture from the viewer at camera presets, and manual upload or
engagement-sheet pick. Manual upload is the concept-imagery source path
(a hand sketch, bubble diagram, or massing image).

B.3 Four-direction batch UI, capturing four model angles in one action.

B.4 Video UI.

B.5 Render gallery with live job status driven by the polling worker.

B.6 Credit-balance display from `GET /credits`.

Phase B exits with the Renders tab rebuilt and the full flow,
deliverable and concept, usable on a real engagement.

## Run posture

One feature branch is fine. Do not hold one long-lived never-merged
branch: merge to `main` in phase increments behind the existing
`RENDERS_PROD_ENABLED` flag. Phase A backend lands on `main` fully dark,
then Phase B. Extend `RENDERS_PROD_ENABLED` to gate the UI tab as well,
so a half-built Renders tab never shows in production. The binding
constraint is `main` drift, not agent collision. A drizzle migration for
the render-job and atom tables is expected; the cortex-api deploy does
not run migrations (the QA-04 lesson), so the migration is an operator
return-task per Autonomy above. If the existing placeholder code or the
atom registry contradicts this dispatch, make the reasonable call,
document it, and continue.

## Quality gate

Every render-output atom carries source attribution (source image
reference and type), full generation provenance (parameters, engine
version, seed), a timestamp, and an AI-origin marker. Renders and
concept imagery are AI-generated; the AI-origin marker is not optional.

## Reporting

Write a session summary to `P:\doc_repo\_inbox\` as
`<date>_legacy-design-tools_cc-agent-R_<topic>.md` per HR-11 in
[`20_agent_operating_rules.md`](../20_agent_operating_rules.md), at the
end of each working session and at every phase boundary. Do not commit
to the doc repo. The planner is on a monitoring loop and sweeps
`_inbox/` to roll your summaries into the doc set. List in every
summary: PRs opened and merged, any decision you made autonomously, any
migration prepared for the operator, and any cc-agent-C overlap you hit.
