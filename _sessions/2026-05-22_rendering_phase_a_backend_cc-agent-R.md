---
date: 2026-05-22
repo: legacy-design-tools
agent: cc-agent-R
kind: session-summary
phase: Phase A — backend (boundary)
dispatch: 2026-05-22_cc-agent-R_cortex_rendering_build
sprint: 40c_cortex_rendering_sprint
pr: 79
status: Phase A complete, PR open, CI running
---

# cc-agent-R — Phase A complete: mnml.ai credits + Prompt Generator

## Recap — the dispatch premise was wrong

Phase A.1 found the Cortex render feature already built and merged to
`main` by the earlier V1 / Spec-54 sprint (full detail in
`2026-05-22_legacy-design-tools_cc-agent-R_phase-a1-audit.md`). The
operator chose **gap-fill only**: build just the doc 40c deltas missing
from `main`, additively, behind `RENDERS_PROD_ENABLED`. Nothing was
replaced.

## What Phase A delivered (PR #79)

`feat/cortex-render-gap-fill` → branch off `main`, opened as
[PR #79](https://github.com/empressaioemail-tech/legacy-design-tools/pull/79).

**mnml client (`lib/mnml-client`)**
- `getCredits()` — `GET /v1/credits`, the account balance (doc 40c B.6).
- `generatePrompt()` — `POST /v1/prompt-generator`, synchronous
  image→optimized-prompt for the concept-imagery flow (doc 40c B.1).
- Added to `MnmlClient`, `HttpMnmlClient`, `MockMnmlClient`. Both
  endpoints verified live against `mnmlai.dev/docs` on 2026-05-22 —
  the captured shapes: `GET /v1/credits` → `{status, credits}`;
  `POST /v1/prompt-generator` multipart `{image, prompt?}` → `{status,
  message, prompt}` where `message` is the generated prompt.

**api-server (`routes/renders.ts`)**
- `GET /renders/credits` — architect-gated, prod-flag-gated. Registered
  before `/renders/:id` so the literal segment wins over the parametric
  UUID route.
- `POST /renders/prompt-generator` — Busboy multipart upload (`image`
  ≤8MB + optional `keywords`), architect-gated, prod-flag-gated.

**Spec + codegen** — OpenAPI extended; api-zod / api-client-react
regenerated; `customFetch` exported from `api-client-react` (Phase B
needs it for the multipart upload).

**Tests** — `getCredits` / `generatePrompt` unit coverage in the
mnml-client suite (78 tests green locally); a PG-backed route suite
`renders-gap-fill-route.test.ts` (runs in CI — the Windows build box
has no Postgres).

## Decisions made autonomously

1. **Did not replace the existing implementation.** Surfaced the
   premise break; operator chose gap-fill. The audit doc records this.
2. **No DB migration.** Credits and prompt-generator are stateless —
   no `viewpoint_renders` row, no schema change. The dispatch's
   "take migration 0016+" instruction does not apply to this gap-fill.
3. **Power-tool endpoints not typed.** The dispatch asked for "typed
   but not surfaced" signatures for the five deferred power tools. The
   vendor docs index gives only navigation links, no verified request
   shapes — typing them would be guesswork. Deferred until they are
   actually surfaced (they were already deferred per doc 40c). Noted
   as a follow-on, not a silent drop.
4. **Multipart file part kept out of the OpenAPI schema.** The codegen
   (orval) has no DOM lib, so a `format: binary` File/Blob body type
   does not compile. The `image` part is prose-only in the spec,
   mirroring the existing snapshot multipart upload. The FE builds the
   multipart body by hand via the exported `customFetch`.

## Operator return-tasks

- **None for Phase A.** `MNML_API_KEY` / `MNML_API_URL` Cloud Run
  secrets already exist from the V1 sprint and are reused as-is.
  `RENDERS_PROD_ENABLED` keeps the surface dark in production.

## cc-agent-C overlap

None. No shared files; no migration (cc-agent-C owns migration 0015 in
PR #73 — this PR adds none). The only files touched are the renders
surface (cc-agent-R territory) and the shared OpenAPI spec + generated
clients (additive only).

## Workspace note

cc-agent-R worked the primary `legacy-design-tools` clone on a fresh
branch off `main` — single-agent, sequential, no shared working tree.
The primary tree's prior branch (`fix/p1-5-architect-review-audience`,
PR #77) was left untouched. The autocrlf phantom-diff effect (known
issue) flagged ~90 api-zod generated files as modified with no real
content change; only the 19 genuinely-changed files were committed.

## Next — Phase B (frontend)

Credit-balance display in the Renders tab; concept-imagery intent
affordance + expert/style selects + the Prompt Generator button in the
kickoff dialog. Separate PR off `main` once #79 merges.
