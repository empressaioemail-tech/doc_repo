---
id: 2026-08-26_p85_records_request_path_to_live
title: P-85 Records Request, path to live: what exists, what is in flight, what is left, in order
date: 2026-08-26
last_updated: 2026-08-27
status: active
plan_row: P-85
card: _inbox/2026-08-26_p85_central_texas_easements_WDLL.md
dispatch: _dispatches/2026-08-26_p85-easements_dispatch.md (compiled, committed ecdc2d1, hand-carried)
owner: property seat (lane on legacy-design-tools branch feat/p85-records-request); planner grades; deploys planner-owned
snapshot: doc_repo main 9656287; legacy-design-tools origin/main 46e1a5a1, lane branch feat/p85-records-request at 9f85f487 (merge-base with main 1a55566b, 6 ahead, 50 behind); hauska-map property worktree on fix/pe-pricing-a2 with 33 dirty files; verified 2026-08-26T23:05Z
---

# P-85 Records Request: path to live

This is the durable map the operator asked for. It says where every piece of Records Request lives, what state it is in as verified at the snapshot above, what each piece waits on, and the order that gets a Studio user clicking the button on a live parcel. The acceptance items are the card's; this document only sequences them and names their homes. When a state below changes, the lane's close artifact and the card's grade column are the record; this document gets a dated line in its log, not a rewrite.

## The two halves and where they live

Records Request is a backend job plus a front end. The backend is `legacy-design-tools`: the Express api-server that deploys as `cortex-api` (Cloud Run, `us-central1`, workflow `.github/workflows/cloud-run-deploy.yml`, whose `workflow_dispatch` actions are `deploy-canary`, `run-migrations`, `smoke`, `shift-traffic`, none coupled to push), the drizzle migrations under `lib/db/drizzle/`, and a new browser worker that follows the `artifacts/hydrology-worker/Dockerfile` precedent, because Playwright is not a dependency of the api-server today and a headless browser does not belong inside the serving process. The front end is Smart Site, `hauska-map/apps/property-explorer`: the Reports tool at `src/workbench/tools/ReportsTool.tsx` (two report kinds today, `site-plan` and `terrain`, behind `REPORTS_LOCKED_VALUE_LINE`), the dossier attach path in `reports-dossier.ts`, the dossier detail view, and the entitlement client at `src/lib/entitlementClient.ts` (free or paid plus the per-property unlock). Smart Site has no records or encumbrance view of any kind today (a grep over `src` for recorded instruments, encumbrances, and restriction clauses returns nothing), so the records view is net-new UI, which is what the Claude Design files are for.

## State at the snapshot

| Piece | Home | State verified 2026-08-26 | Waits on |
|---|---|---|---|
| Card, decision, dispatch | doc_repo | Approved, compiled, committed (`ecdc2d1`), hand-carried | nothing |
| Item 1 portal terms gate and registry | LDT `artifacts/api-server/src/lib/clerkPortalSearchGate.ts`, `p85ClerkPortalRegistry.ts`, schema `clerkPortalTerms.ts` | Written, untracked, uncommitted; the gate refuses `PORTAL_TERMS_UNKNOWN`, `PORTAL_AUTOMATED_SEARCH_PROHIBITED`, `PORTAL_TERMS_MISSING`; six counties in the registry with Williamson twice (TylerHost and publicsearch) | the operator's ruling per portal (six rows) |
| Item 2 live instant sources | LDT `liveEasementGisQuery.ts` | Written, untracked | a control parcel test |
| Item 4 job table | LDT `lib/db/drizzle/0083_p85_records_request.sql`, schema `recordsRequestJobs.ts` | Written, untracked; not applied anywhere | `run-migrations` dispatch on production after merge |
| Items 5 and 6 browser agent, recipes, captures, acquisition | LDT new worker (Dockerfile, Cloud Run Job) | Not started | items 1 and 4; the Tyler recipe first (Williamson, Hays) |
| Items 7 to 10 vision read, extraction by type, corridor derivation, verdicts | LDT api-server, reusing `attachedDocumentVision.ts`, `encumbranceExtract.ts`, `encumbranceService.ts` | Not started; reuse modules present at the named paths | item 6 artifacts |
| Item 11 email | LDT api-server | Not started; no transactional provider exists in LDT or Smart Site | the operator's provider choice |
| Item 12 Reports button, records view, chat and MCP citations | Smart Site `ReportsTool.tsx`, `reports-dossier.ts`, dossier detail, chat tool; MCP reporting gate | Not started; Claude Design files ready (operator); no records view exists | its own hauska-map worktree (below); api routes from item 4 |
| Item 13 Studio gate | Smart Site `entitlementClient.ts` and the api gate | Not started | Stripe live price ids from the pricing lane (`fix/pe-pricing-a2`, in another chat) |
| Item 14 cost and canary | LDT worker and api-server | Not started | item 5 |
| Item 15 graded sample | doc_repo grading artifact | Not started | ten completed runs on staging or production |
| Item 16 title-plant boundary, copy check | Smart Site copy and api | Not started; one CI copy check | item 12 |
| Items 17 and 18 letters, public promotion | operator; Factory F-15, F-16, F-18 | Deferred by ruling | nothing on this path |

## Two branch facts the lane must act on before its first commit

The lane branch `feat/p85-records-request` was cut from `seat/property`, not from `main`. Its merge-base with `origin/main` is `1a55566b`; it is six commits ahead and fifty behind. The six are the P-63 verdict-serve commits, which main already carries through PRs #459 and #460, so a PR from this branch would carry duplicate history and conflict. Because every P-85 file so far is untracked, the fix is free now and expensive later: re-cut the branch from `origin/main` (`git fetch origin && git checkout -B feat/p85-records-request origin/main`), which leaves the seven untracked files in place, then commit. PR #458 (`seat/property`, P-63) is a stale open PR and should be closed by the property seat as superseded by #459.

The Smart Site half cannot be built in `P:/seat-worktrees/property/hauska-map`: that worktree sits on `fix/pe-pricing-a2` with thirty-three dirty files belonging to the Stripe pricing lane, and the standing rule is never to commit onto it. The records UI gets its own registered worktree, `P:/seat-worktrees/property/hauska-map-records` on `seat/property-records`, the same pattern the Factory console used. The row is registered in `_catalog/seat_register.json`; creating the worktree is the lane's first act on that half (`git worktree add P:/seat-worktrees/property/hauska-map-records -b seat/property-records origin/main`).

## Order to live

1. Re-cut the LDT branch from main; commit the Phase A files; open the PR against main with the item 1 and item 2 tests.
2. Operator rules the six portal rows. Until a row is `permitted` or `tolerated` the job refuses that county by design, so this is on the critical path for every county, and the Tyler pair (Williamson, Hays) is the one to rule first.
3. Backend Phase B on LDT: item 4 routes and job rows in the api-server; the worker image with Playwright and the Tyler recipe; captures and acquisition methods; vision read, extraction by type, corridor derivation, three verdicts; run cost fields and the daily canary. Each lands as its own PR on green CI against the current base.
4. Migration 0083 applied to production through the `run-migrations` dispatch after the schema PR merges. Merged is not applied: the lane verifies `_schema_migrations` on the production database and records the row.
5. Front end on the records worktree: the Claude Design files land as the Records Request entry in `ReportsTool.tsx`, the records view in the dossier, the corridor layer on the map, the chat citation, and the item 16 copy check. Its PR is against `hauska-map` main; the path-filtered CI runs for `apps/property-explorer`, so no workflow change is needed there (the Factory console had to add its own).
6. Email provider chosen by the operator, wired, four fixture sends recorded.
7. Studio gate reads the live Stripe price ids once the pricing lane ships; until then the report resolves for nobody, but the four-caller matrix is testable against fixture ids.
8. Deploy chain, planner-owned on the operator's go: cortex-api `deploy-canary` with the image tag by SHA, `smoke`, `shift-traffic`; the worker job created and pinned by digest; Smart Site deployed by the Vercel CLI (no auto-deploy on merge) and verified by a bundle marker.
9. Ten graded runs across the six counties; precision and recall reported whatever they are.
10. Close: leave-behind declared, `notStarted` list, grades in the card, A-row in OPS-16.

## Operator inputs on the critical path

Three things only the operator supplies: the portal ruling per county (six rows, Tyler pair first), the transactional email provider, and the Stripe price ids for Studio and Team. Everything else is lane work or planner-owned deploys.

## Finish line

A Studio user on Smart Site opens a parcel in one of the six counties, chooses Records Request from the Reports area, sees the instant GIS easements in the acknowledgement, receives an email when the job finishes, and finds the recorded documents ordered by date and filterable by type in the parcel's records with the corridors on the map and the chat citing them by recording reference; or sees a stated verdict with its searched scope; never an empty list, never a count for a Free or Solo user, never a sentence asserting title.

## Log

- 2026-08-26: written after the property seat's E-1/E-2 close was relayed and the operator asked what is left. States verified by the planner at the snapshot in the frontmatter.
- 2026-08-27: plumbing deployed (worker, cortex URL, recipes scaffold, Bastrop complete). Status canvas and handoff filed. See `_inbox/2026-08-27_p85_records_request_status_canvas.md`. Product work (items 5–16) remains open.
