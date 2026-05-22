---
date: 2026-05-22
repo: legacy-design-tools
agent: cc-agent-R
kind: session-summary
phase: Phase A.1 — audit (boundary)
dispatch: 2026-05-22_cc-agent-R_cortex_rendering_build
sprint: 40c_cortex_rendering_sprint
status: BLOCKED — dispatch premise contradicted by codebase; operator decision requested
---

# cc-agent-R — Phase A.1 audit: the Cortex render feature is already built and merged

## TL;DR — stop-and-surface

The dispatch and `40c_cortex_rendering_sprint.md` task cc-agent-R with
**building the mnml.ai render engine** into Cortex and **replacing the
placeholder Renders tab**. Phase A.1 ("audit the existing
`routes/renders.ts` placeholder, report what is there before replacing
it") found that **`routes/renders.ts` is not a placeholder** — it is a
complete 1,474-line implementation, and the entire mnml.ai render
feature (backend *and* frontend) **is already built, tested, and merged
to `origin/main`.**

Per agent operating rules and the dispatch's own clause ("if the
existing placeholder code … contradicts this dispatch, make the
reasonable call, document it"), cc-agent-R **did not replace anything
and did not start a build.** Replacing a complete, tested, merged
feature on the strength of a dispatch that calls it a placeholder would
be destructive. The reasonable call is to report and request an
operator decision. **No code was written, no branch created, no commit
made.** Phase A.1's deliverable — the audit — is this document.

## What the dispatch assumed vs. what is on `main`

| Dispatch / 40c assumption | Reality on `origin/main` |
|---|---|
| `routes/renders.ts` is an early placeholder | Complete 1,474-line implementation: kickoff, status, list, cancel, sweep routes; fire-and-forget polling worker; elevation-set 4-way fan-out; video path; GCS mirror; feature flag |
| Renders tab is a placeholder to rebuild | `RendersTab.tsx` is a real component wrapping shared `RenderGallery` + `RenderKickoffDialog` from `portal-ui` |
| Build a generic mnml client | `lib/mnml-client/` exists — `MnmlClient` interface, `HttpMnmlClient`, `MockMnmlClient`, env-driven factory, cost helper, boot-time env validation, full test suite |
| Build a durable render-job model + polling worker | `viewpoint_renders` + `render_outputs` tables, schema files, polling worker with restart re-hydration via the sweep route, all present |
| Create `render-output` / `render-set` atoms | `render-output.atom.ts` and `viewpoint-render.atom.ts` both registered (parent atom is named `viewpoint-render`, not `render-set`) |
| Take drizzle migration 0016+ | Renders schema already migrated; current migration head is `0014`; PR #73 adds `0015` |

The dispatch was written with **partial** awareness — it correctly
anticipated that `render-output` and `viewpoint-render` atom *type
names* might already be registered (40c A.3 says "reconcile against the
existing types"). It did **not** know the full feature — client,
routes, worker, schema, frontend, tests — was already implemented and
merged.

## What exists on `origin/main` (the audit)

**Backend (`api-server`)**
- `routes/renders.ts` — 1,474 lines. `POST /engagements/:id/renders`
  (kickoff: `still | elevation-set | video`), `GET /renders/:id`,
  `GET /engagements/:id/renders`, `POST /renders/:id/cancel`,
  `GET /render-outputs/:id/file` (durable streaming), `POST
  /admin/renders/sweep`. Wired into `routes/index.ts`.
- `RENDERS_PROD_ENABLED` flag — implemented exactly as the dispatch
  describes: `rendersProdGateOpen()` permits mock mode in
  dev/CI/staging, requires the flag in production.
- Polling worker — capture → trigger → poll → mirror → terminal,
  fire-and-forget, exponential-ish cadence (3s first, 5s steady), 10-min
  wall-clock cap, atom-event emission per transition.
- Elevation-set fan-out — one parent `viewpoint_renders` row + 4 child
  mnml calls, per-direction state in `mnml_jobs` JSONB, any-child-fail
  → parent fail with `elevation_set_partial`.
- `rendersSweep.ts` — stuck-render recovery / in-flight re-hydration.
- `rendersObjectMirror.ts` — downloads mnml outputs into GCS before the
  ephemeral CDN URLs expire.
- `bimViewportCapture.ts` — Puppeteer GLB viewport capture.
- Error contract — `MnmlError` with 7 coarse kinds; 429/5xx handling;
  `insufficient_credits` surfaced (HTTP 402).

**mnml client (`lib/mnml-client`)**
- `HttpMnmlClient` covers `POST /v1/archDiffusion-v43`, `POST
  /v1/video-ai`, `GET /v1/status/{id}`.
- All six expert types (`exterior, interior, masterplan, landscape,
  plan, product`) and all eight render styles (`raw, photoreal,
  cgi_render, cad, freehand_sketch, clay_model, illustration,
  watercolor`) are already in the request type union.
- Built to "Spec 54 v2" (`docs/wave-2/04-mnml-api-spec-v2.md`),
  verified live against `mnmlai.dev/docs` on 2026-05-02.

**Atoms / schema**
- `render-output.atom.ts`, `viewpoint-render.atom.ts` registered;
  `accessPolicy` tenant-private; all five render modes.
- `viewpointRenders.ts`, `renderOutputs.ts` schema; migration ≤ `0014`.

**Frontend (`design-tools` / `portal-ui`)**
- `RendersTab.tsx`, plus `RenderCard.tsx`, `RenderGallery.tsx`,
  `RenderKickoffDialog.tsx` in `portal-ui` with their own tests.
- Generated `api-zod` types for the whole render surface.

**Tests** — `renders-worker.test.ts`, `renders-sweep.test.ts`,
`renders-object-mirror.test.ts`, `render-output-atom.test.ts`,
`viewpoint-render-atom.test.ts`, mnml-client unit tests, design-tools
e2e specs.

Provenance: built by the "V1" / "Wave 2" / "Spec 54 v2" sprint
(commits `V1-4 Step 1…8.5`, `Task #327`, `Task #422`, `Task #516`).
The `sprint/V1-*` branches are **fully merged** into `main` (0
unmerged commits) and last touched 2026-05-01/02; `main` has since
moved 190+ commits past them. No live V1/renders agent — those
worktrees are stale, not active. No collision risk there.

## Gap analysis — what 40c adds that is NOT on `main`

The core of 40c is delivered. The genuine, additive delta:

1. **`GET /credits`** — the mnml client has no standalone credits call;
   `triggerRender` only returns `remainingCredits` from the trigger
   response. 40c B.6 wants a credit-balance display.
2. **Prompt Generator** — `prompt-generator` endpoint is not in the
   client. 40c includes it for the concept-imagery flow.
3. **Concept-imagery intent** — 40c wants the Renders tab to open on an
   explicit "deliverable render vs. concept imagery" choice. The engine
   already supports the `plan` expert and the sketch/illustration/clay/
   watercolor styles; this is a **UI-affordance** addition, not an
   engine change.
4. **Power-tool endpoints** typed-but-not-surfaced (enhancer, upscaler,
   eraser, inpainting, style-transfer) — not in the client.
5. **`render-set` parent atom** — 40c proposes this name; the merged
   implementation uses `viewpoint-render` as the parent atom. A
   naming/model reconciliation, not new capability. 40c A.3 explicitly
   anticipated reconciling against `viewpoint-render`.

None of items 1–4 require a DB migration. Item 5 is a doc/registry
reconciliation. So 40c is roughly **85–90% already shipped**; the
remainder is a small, additive, flag-gated gap-fill.

## Decision made autonomously

- **Did not replace `renders.ts`; did not start a build.** Overwriting
  a complete, tested, merged feature on a dispatch that mis-describes it
  as a placeholder would be destructive and is exactly the
  "surface, don't proceed" case.
- **Did not switch branches or modify the working tree.** The primary
  clone sits on `fix/p1-5-architect-review-audience` (PR #77, another
  agent's branch); cc-agent-R left it untouched.

## Operator decision requested

The doc set (`40c_cortex_rendering_sprint.md`, the dispatch, and
`_decisions/2026-05-22_cortex_rendering_activation.md`) is **desynced
from the codebase** — all three were written 2026-05-22 as if rendering
is unbuilt. Three paths:

- **A — Gap-fill only (cc-agent-R recommends).** cc-agent-R builds just
  the 40c deltas missing from `main`: `GET /credits` + balance display,
  Prompt Generator, the concept-imagery UI affordance (and optionally
  the typed-not-surfaced power tools). Additive, behind
  `RENDERS_PROD_ENABLED`, no DB migration. Leaves the merged feature
  intact.
- **B — Stand down.** Treat 40c as already satisfied by the V1 effort;
  cc-agent-R stops; the planner reconciles 40c and the activation
  decision against the codebase.
- **C — Rebuild per dispatch.** Replace `renders.ts` and rebuild from
  40c as written. Discards working, tested, merged code — not
  recommended.

## cc-agent-C overlap

None hit. cc-agent-C owns the IFC migration (PR #73, migration `0015`)
and WS-G QA. cc-agent-R touched no shared files (no work was done).
Note for the planner: the dispatch's collision-avoidance plan named
only cc-agent-C and scoped overlap to "migrations + atom registry" — it
did not account for the V1/renders lineage because it did not know that
effort existed. That lineage is merged and dormant, so no live
collision, but it is the reason the premise check failed.

## Reporting / housekeeping

- PRs opened: none. PRs merged: none.
- Migrations prepared: none (the gap-fill in path A needs none).
- Branch created: none.
- Next action: await operator decision (A / B / C) before any code.
