---
id: 2026-08-20_a11y_remediation_and_restore_instructions
title: Accessibility remediation 2026-08-20 — what changed, what broke, and how to undo any of it
status: active
last_updated: 2026-08-20
applies_to: smartcity
owner: nick
related:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _inbox/2026-08-20_vpat_scope_map,
    _inbox/2026-08-19_g96_document_generation_investigation,
  ]
---

# Accessibility remediation, 2026-08-20

Evidence record for work done by the doc_repo planner on 2026-08-20 in support of the Vertosoft
Accessibility Conformance Report. Written so that anyone, including an agent with none of this session's
context, can see exactly what changed and return any piece of it to its prior state.

Operator instruction that prompted this record: provide explicit restore instructions, and leave notes as
evidence, because other agents are working on SmartSite concurrently.

## Summary of every change made

| Repo | Change | State | Restore point |
|---|---|---|---|
| `smart-files` | PR #8, reflow + two labels | MERGED and DEPLOYED | `5de59adb8689d5cb7c68a27241d7c606981a31ba` |
| `plan-review` | PR #5, three labels + table scroll | MERGED and DEPLOYED | `156677f60134538bdb29590e0051da6fef63bdae` |
| `hauska-engine` | PR #352, six NEW files, zero modified | OPEN, NOT merged, opt-in with zero callers | `d3f37949003fae5a99a82b62956352b7dcaa1022` |
| `smartcity-os` | none. Not opened at all | unchanged | `e2fcdd14e712a61294e3bf6e64291563064de4c4` |

## The SmartSite PDF generator: why it was opened, and the constraint now on it

**Why it was in scope.** The site-plan PDF is the single Does Not Support row in the ACR, against Revised
508 criterion 504.2.2. The measured defect is that the generator draws text glyph by glyph, so 64.9 percent
of extracted lines are a single character. A screen reader reads such a file one letter at a time. That is
a real accessibility defect and it is the only thing standing between the ACR and a clean software chapter.

**What it is NOT.** It is not a functional defect. The generator produces correct, well laid out PDFs and
represents significant operator investment. Nothing about the visual output is wrong.

**Operator ruling 2026-08-20, applied mid-flight.** The generator is not to be replaced, deleted, rewritten
in place, or repointed. Any tagged-PDF work lands additively, as a new module behind an explicit opt-in,
with the product's default behaviour identical before and after. The executing agent was sent this
constraint before it had made any change, and was told not to merge, only to open a PR for review.

**Concurrency.** `hauska-engine` has an active parallel programme. PR #351 on `ss/w17-containment` was open
at the time of writing, alongside a run of `ss/*` branches. The agent was told to stay off flood,
containment, rail-scoring, duplicate-subject and statewide-audit code entirely, and to add files rather than
edit shared ones under `packages/engine-core/src/site-plan/`.

## Restore instructions

### Restore `smart-files` to its pre-change state

Revert the merge commit and redeploy. This returns both code and live surface.

    git clone https://github.com/empressaioemail-tech/smart-files
    cd smart-files
    git revert --no-edit 86975d079d503c7a8a62a3100f1eae91e12cd703
    git push origin main

Branch protection requires a pull request, so if the direct push refuses with GH006:

    git checkout -b revert/a11y-2026-08-20
    git push -u origin revert/a11y-2026-08-20
    gh pr create --fill && gh pr merge --squash

Then redeploy. **The deploy root is `web/`, not the repository root.** Deploying from the root produces a
site that returns 404 — see the incident below.

    cd web
    vercel link --yes --scope empressaioemail-techs-projects --project smart-files-app
    vercel deploy --prod --yes --scope empressaioemail-techs-projects

Faster alternative that skips the code revert and only rolls back the live surface:

    vercel promote https://smart-files-6aa6wajmp-empressaioemail-techs-projects.vercel.app \
      --yes --scope empressaioemail-techs-projects

That deployment, `dpl_8WCADkEhKByhLa6QSKEfUCbUZ3DZ`, is the last one built before today's work. Promotion
takes about two seconds and is reversible in the same way.

### Restore `plan-review` to its pre-change state

    git clone https://github.com/empressaioemail-tech/plan-review
    cd plan-review
    git revert --no-edit 2b5a713a333e5751425fca6a580cdf34f50855fe
    git push origin main        # or the PR route above if GH006

    cd web
    vercel link --yes --scope empressaioemail-techs-projects --project plan-review-app
    vercel deploy --prod --yes --scope empressaioemail-techs-projects

Live-surface-only rollback:

    vercel promote https://plan-review-4fgbadz0e-empressaioemail-techs-projects.vercel.app \
      --yes --scope empressaioemail-techs-projects

That deployment is `dpl_CKg13X2su89rQYjore9VevtfDfP9`.

### Restore `hauska-engine` (SmartSite site-plan PDF)

**Nothing on `main` changed.** The work is pull request **352**, open and marked not to be merged without an
operator decision. It adds six files under `packages/engine-core/src/site-plan/pdf/tagged/` and modifies
none: the diff is `+1107/-0`, every file `added`, verified by the planner against the GitHub API rather than
taken on the executor's word.

`render.ts` on the PR head is blob `53366de8a88e1387a274abf84ed096538f0417f8`, byte-identical to the
protected pre-change blob. The new entry point `emitTaggedPdfSitePlan` has zero callers, so merging it could
not change default behaviour even by accident.

To discard it entirely:

    gh pr close 352 --repo empressaioemail-tech/hauska-engine --delete-branch

The executor's own restore commands, including worktree and local-branch cleanup, are in
`_inbox/2026-08-20_g103_g104_pdf_render_close.json` under `restore_instructions`.

**The executor did initially violate the additive ruling** — it modified `render.ts` and `dossier.ts` in
place and had the change on by default. It reverted all of it before committing anything, then rebuilt the
same result as a post-processor over the renderer's finished bytes, which is additive by construction rather
than by discipline. It reported this itself rather than being caught. Nothing reached `main` at any point.

If anything did reach `main`, the pre-change restore point is:

    d3f37949003fae5a99a82b62956352b7dcaa1022

and the site-plan renderer at that commit is blob `53366de8a88e`, 114,397 bytes. To recover just that one
file without disturbing anything else in the repository:

    git checkout d3f37949003fae5a99a82b62956352b7dcaa1022 -- \
      packages/engine-core/src/site-plan/pdf/render.ts

Verify the restore took by confirming the blob hash matches:

    git hash-object packages/engine-core/src/site-plan/pdf/render.ts

### Restore `smartcity-os`

Nothing has been changed. Pre-change `main` is `e2fcdd14e712a61294e3bf6e64291563064de4c4`. Same PR-close
procedure as above if a pull request appears.

## Incident: both Vercel apps returned 404 for approximately ten minutes

Recorded because it happened, not because it is comfortable.

**What happened.** After merging the two fixes, the planner deployed `smart-files` and `plan-review` from
each repository root. Both Vercel projects use framework preset "Other" with output directory `.`, so a
root deploy serves the repository root, which contains no `index.html`. Both production aliases began
returning 404.

**How it was caught.** The post-deploy verification probed the live surface rather than trusting the CLI's
"Aliased" message. The CLI reported success in both cases; the site was down anyway.

**How it was fixed.** Both aliases were promoted back to their last-good deployments. Recovery took about
two seconds per app. Health was confirmed by re-running the conformance scanner and comparing output to the
pre-deploy run: identical text-node counts and identical violation counts, so the rollback was clean.

**Root cause.** The deploy root for both apps is `web/`, which holds `vercel.json`, `index.html` and the
`api/` serverless functions. The repository root holds a Dockerfile and a Node server that Vercel does not
use. Deploying from `web/` produces a correct deployment.

**The durable fix, not yet done.** This is tribal knowledge with no mechanism behind it. Neither repository
has a deploy workflow, and nothing prevents the next person or agent from making the same mistake. A deploy
workflow, or at minimum a `DEPLOY.md` at each repository root naming `web/` as the deploy directory, is
owed. Recorded here as a backlog item rather than claimed as handled.

## What was changed in the two products, precisely

**`smart-files`**, files `web/index.html` and `web/styles.css`:

- The top bar could not fit its brand block and its search box on one row at 320 CSS pixels and forced the
  page to scroll horizontally. Measured 41px of overflow on the standalone surface; the embedded surface
  hides that bar and was already at zero. A media query below 560px lets the bar wrap and gives search its
  own row.
- Two fields gained real labels, visually hidden but present in the accessibility tree. The automated scan
  had flagged neither, for two different reasons: the new-folder field carried a placeholder that satisfies
  accessible-name computation as a last resort, and the upload field is not rendered until its form opens.

**`plan-review`**, files `web/app.js` and `web/styles.css`:

- Three intake fields gained visible labels. Two of them, `parcelNodeId` and `projectType`, were axe
  violations classed critical.
- The engagements table moved into a scrollable container, closing 103px of horizontal page overflow at
  320 CSS pixels. The container carries `tabindex="0"`, a role and an accessible name deliberately: adding
  overflow without them trades a reflow failure for a keyboard failure, since a scrollable region that
  cannot be reached by keyboard is its own violation. That same defect was found and fixed eight times in
  Dashboards.

## Measured before and after, against the live deployments

    surface              reflow@320    axe violations   keyboard
    files-embed          0px   -> 0px   0 -> 0          20/20 no trap
    files-standalone     41px  -> 0px   0 -> 0          22/22 no trap
    review-embed         103px -> 0px   2 -> 0          12/12 no trap
    review-standalone    103px -> 0px   2 -> 0          16/16 no trap

Raw evidence for both runs is retained in the handoff bundle at
`P:/tmp/VPAT/vertosoft_handoff_2026-08-20/source/`, as `03_raw_external_run_BEFORE_fixes.json` and
`03_raw_external_run.json`.

## Effect on the ACR

Four rows moved from Partially Supports to Supports on measured evidence: 1.4.10 Reflow, 3.3.2 Labels or
Instructions, 4.1.2 Name Role Value, and 1.3.1 Info and Relationships. The report now stands at 56 Supports,
18 Not Applicable, 2 Partially Supports, 1 Does Not Support, with no Not Evaluated rows.

The three rows still open are all the same root cause and all wait on the SmartSite and legacy PDF work:
504.2.2 PDF Export, plus 504.2 and 504.4 which move with it.

## Leave behind

    leave_behind:
      - item: deploy documentation or workflow naming web/ as the deploy root for smart-files and plan-review
        owner: nick
        plan_row: backlog
      - item: the two new conformance scanners run only when the planner runs them; no trigger exists
        owner: nick
        plan_row: backlog
      - item: hauska-engine PR 352, tagged-PDF post-processor, open and awaiting an operator merge decision
        owner: nick
        plan_row: G-103
      - item: legacy smartcity-os jsPDF export still untagged; cannot be fixed additively
        owner: nick
        plan_row: G-103
      - item: dossier.ts and flood-drainage.ts share the site-plan defect class and remain untagged
        owner: nick
        plan_row: G-103
