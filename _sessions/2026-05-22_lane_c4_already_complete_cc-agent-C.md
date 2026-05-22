---
date: 2026-05-22
agent: cc-agent-C
repo: legacy-design-tools
session_type: finding
rolled_up: true
rolled_up_into: [00_current_state, 42_design_accelerator_program_plan, _dispatches/2026-05-19_cc-agent-C_l_surface_ui]
---

> Filed by the doc_repo planner from the cc-agent-C `_inbox/` courier
> drop per HR-11. This is cc-agent-C's HR-11 close-out for the Lane C.4
> dispatch: no work performed, C.4 was found already shipped. It
> confirms the planner correction already committed (`803a967`) plus
> the 2026-05-22 `42` Lane-C reconciliation. The drop's two asks are
> both done: (1) the dispatch `2026-05-19_cc-agent-C_l_surface_ui.md`
> carries a `COMPLETE — do not execute` banner and `status: complete`
> frontmatter; (2) `00_current_state.md` shows C.4 closed and cc-agent-C
> idle. The genuine open follow-ons it lists (cc-agent-M post-Amendment-8
> MCP tools, the Group 4 e2e runbook, legacy task #29 dual-auth) are
> tracked; CDX-9 is being scoped separately as cc-agent-C's next work.

# Lane C.4 dispatch re-activated 2026-05-22, but C.4 already shipped 2026-05-20

**Status: NO WORK PERFORMED. Nothing changed in any repo. Surfacing per
HR-11. The Lane C.4 dispatch should be marked closed, not executed.**

## The finding

The dispatch `_dispatches/2026-05-19_cc-agent-C_l_surface_ui.md` carries an
"Activation update 2026-05-22" block instructing cc-agent-C to build the
L1-L6 endpoints + UI as its next work, one PR per surface. That work was
already completed and merged to `legacy-design-tools` main on 2026-05-20.
The activation update is stale: it sequenced C.4 to run after the Codex
Phase 2 reviewer surfaces (CDX-3/4/5) without accounting for the fact that
cc-agent-C had already shipped C.4 out of order, before the Codex work.

The dispatch itself already flags that it carries stale content (the
closing C.6 cutover paragraph). The activation block is a second stale
element in the same file.

The canonical contract doc agrees C.4 is done. `_research/2026-05-19_l_surface_endpoint_contracts_cc-agent-M.md`
status line reads: "GROUP 3 + LANE C.4 COMPLETE ... legacy routes live on
legacy-design-tools main (PR #46 L1 + PR #51 L2-L6, merged 2026-05-20)."

## Verbatim evidence

PRs merged (`gh pr view 46 / 51 --json number,title,state,mergedAt`):

```
{"mergedAt":"2026-05-20T02:53:09Z","number":46,"state":"MERGED","title":"feat(C.4.1): L1 response-task endpoints + UI"}
{"mergedAt":"2026-05-20T10:25:27Z","number":51,"state":"MERGED","title":"feat(C.4): Cortex L-surface endpoints + UI — L2–L6 (consolidated)"}
```

C.4 commit chain on `origin/main` (`git log --oneline origin/main`):

```
ffd3ffe chore(cloud-run-deploy): add SERVICE_API_KEY + ICC_ES_REPORT_URL_TEMPLATE (Sprint Amendment 8) (#52)
ca62858 feat(C.4): Cortex L-surface endpoints + UI — L2–L6 (consolidated) (#51)
dee4ce9 feat(api-server,design-tools): C.4.1 L1 response-task endpoints + UI (#46)
c41df4c feat(api-server): service-token bearer-auth middleware for L-surface routes (C.4) (#45)
eb7dbd8 feat(atoms-l-surface): mirror Cortex L1-L6 atom shapes (C.4 foundation) (#44)
```

All six surfaces are present on `origin/main` as endpoints + UI:

```
L1 response-task            routes/responseTasks.ts            ResponseTasksTab.tsx
L2 sheet-content/attached   routes/sheetContent.ts             plan-review side
L3 deliverable-letter       routes/deliverableLetters.ts       DeliverableLettersTab.tsx
L4 detail-callout-spec      routes/detailCalloutSpecs.ts       DetailCalloutSpecsTab.tsx
L5 product-spec-reference   routes/productSpecReferences.ts    ProductSpecReferencesTab.tsx
L6 deliverable-letter render routes/deliverableLetterRenders.ts RendersTab.tsx
```

Backed by DB schema + migrations (`0009_add_response_tasks.sql`, `0012`,
`0013`), the `lib/atoms-l-surface/` package, and `lib/api-zod` generated
types. Each UI tab has a matching test under
`artifacts/design-tools/src/components/engagement-detail/__tests__/`.

## The one real deviation, already ratified

The dispatch asked for "six PRs, one per surface." C.4 actually shipped as
two PRs: #46 for L1, #51 consolidating L2-L6. That deviation was already
accepted in the contract doc under Sprint Amendment 8 (which also added the
L3 list/get and L6 download endpoints, the `BaseAtomInstance` provenance
field convention, and the dot-form event casing). No outstanding gap from
the PR-count difference.

## What I did NOT do, and why

- Did not re-build L1-L6. Re-executing the dispatch would create duplicate
  routes, duplicate Postgres tables and migrations, and conflicting PRs
  against work already on main. That is a destructive action on a false
  premise.
- Did not branch or touch the working tree. The clone sits on the merged
  branch `codex-reviewer-qa/cdx-5-jurisdiction-switcher` (PR #71, MERGED).
  Operator confirmed the close-it-out path before this drop was written.

## What the planner should do

1. Mark `_dispatches/2026-05-19_cc-agent-C_l_surface_ui.md` closed.
   Recommend a `status: closed` note pointing at PRs #46 + #51 and this
   drop, so the stale activation block cannot re-trigger.
2. Confirm `00_current_state.md` reflects C.4 as closed in the fleet
   assignment / sprint section.

## Genuine open follow-ons (not cc-agent-C's, surfaced for tracking)

Per the contract doc, the remaining L-surface work belongs elsewhere:

- cc-agent-M post-Amendment-8 dispatch: extend `legacy-client.ts` and add
  three MCP tools (`cortex_deliverable_letter_list`, `_fetch`,
  `_render_download`) to match the added L3/L6 endpoints.
- Group 4 e2e cross-client runbook fires after that extension + cutover.
- legacy-design-tools task #29: dual-auth (`requireServiceTokenOrSession`)
  tightening. Prod is fail-closed in v1, so this is non-blocking.

## Re-entry state for cc-agent-C

```
$ git status --short --branch
## codex-reviewer-qa/cdx-5-jurisdiction-switcher...origin/codex-reviewer-qa/cdx-5-jurisdiction-switcher
 M artifacts/design-tools/src/pages/__tests__/BriefingDivergencesPanel.test.tsx
 M artifacts/design-tools/src/pages/__tests__/EngagementDetail.test.tsx
 M artifacts/design-tools/src/pages/__tests__/SiteContextTab.test.tsx
 M lib/db/src/__tests__/integration/schema.integration.test.ts
?? (untracked agent scratch: .claude/, .cursor/, RECON_*, _research/*, debug.log, pr-body.md)

$ git rev-parse --short HEAD
4342c42
```

The four modified test files are the known pre-existing stray modifications
the dispatch warned to keep out of any branch. No durable in-repo copy of
this note was committed; per `_inbox/README.md` section 5 the `_inbox/`
drop is the one required artifact and the merged PRs #46 + #51 are the
durable record of the underlying C.4 work.
