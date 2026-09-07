---
date: 2026-09-07
agent: planner
repo: docs
session_type: execute
memory_graded: none
rolled_up: false
---

# Reports outage, P-120 re-cut, and three lanes

## What was done

Started as "the report function is down" with three screenshots. Ended as a
re-cut of the reports program, three dispatched lanes, and a finding about a
control that fails open across every county.

### The outage, found and fixed

One root cause explained all three screenshots. `composeSitePlanModelForParcel`
called `selectAdaptiveResolutionMeters` on the raw parcel bbox. The adapter
refuses any raster below 16 px per axis at its finest 1 m/px, so any parcel
with an axis under about 16 m threw. The throw escaped the composer, the route
caught it blind as a 422, and Feasibility failed closed on the missing site
plan. Every parcel narrower than 16 m had no site plan, no X-Ray sheets and no
Feasibility report. Not a regression: `git log -L` returns PR #116, the commit
that created the file.

Flood and Drainage had already solved this with `paddedCatchmentBbox` and
site-plan never inherited it. Two call sites, one lesson, one outage.

Fixed in hauska-engine PR #401 (`e1c14e3`) by widening only the deficient axis,
only to the required extent, from real 3DEP data over a wider window. No-op for
every parcel that already worked. Deployed and verified live before and after
on real parcel 48021:52726: production returned the exact 422, the canary
returned 201 with real artifacts. Re-verified post-shift against the production
base URL on a different unit (48021:52727) so it could not be a cached artifact.
Serving revision `hauska-engine-api-00184-pef`, digest `sha256:2697d928`.

A second defect in the same read: `sitePlanUnavailableReasonFromError` existed
twice, copied verbatim, and both copies discarded the underlying error, so the
precise cause was laundered into a generic sentence on the way to the operator.
Now one shared module returning both a sheet-safe summary and the verbatim
detail.

### P-120 item 6

Built hauska-engine's consuming side of `legacy-design-tools`' merged
narrative-section endpoint. PR #402 (`df96f57`). Contract read from the shipped
route, not from a description of it. Two refusals worth keeping: the server's
own no-content apology (`generatedBy: "rules-v1"`) is treated as unavailable
rather than printed, and a narrative that marks no category is refused in
favour of the skeleton, which is cited by construction.

Then PR #403 (`5d85228f`) fixed a defect doc-repo-26 found in that same code:
with no config the client was never called, so the report returned
`narrativeIsDeterministicSkeleton: true` naming no cause. Silent degradation.
It also starved `not-configured`, which was unreachable in production by
construction.

### The re-cut

Operator ruling: the program had drifted and was over-engineered. Correct, and
the planner had been about to make it worse by proposing a bridge function plus
a parity instrument to police the bridge. A parity checker is what gets built
when duplication is accepted as permanent; the answer to self-inflicted
duplication is deletion.

New card at `_inbox/2026-09-07_reports_one_model_recut_WDLL.md`, superseding the
reports half of the previous one. One composition, one PDF engine, products as
section manifests. Retires items 7, 8, 9, 10, 12 and 13 outright and replaces
11. Courthouse and comprehensiveness rows carried over unchanged.

Two structural findings strengthened the operator's case beyond how it was
first put. `floodStudyAvailable` was a caller-supplied boolean written straight
into the report as `studyAvailable`, with nothing ever reading a study. And the
shared PDF primitive layer already existed and all four products used it, so
"one PDF engine" was promotion of existing structure, not a rewrite.

### Three lanes, all landed

Compiled through `scripts/dispatch.mjs`, gate verified in both directions.

**R-01** (composition root) delivered PR #406. `composeParcelReport`,
section-level failure isolation generalising the outage fix, `floodStudyAvailable`
deleted and replaced with real drainage state, and `ReportManifest` as a closed
union with no index signature. Verified: the compile-check proving R4 lives in
`src/` proper, deliberately NOT in `__tests__/`, because that directory is
excluded from tsconfig and vitest strips types without checking them. A lane
that saw the dormant-mechanism trap and avoided it.

**R-02** (courthouse) closed items 15 and 17c and answered 17b-gate. Detail
below; it produced the session's most important finding.

**R-03** (fact families) delivered PR #404, items 18, 20 and 21.

### The fail-open finding

`_inbox/2026-09-07_records-worker_fabricated-zero-guard-fails-open_finding.md`.

Found while verifying R-02's close, not by R-02 and not by the lane that wrote
the guard. The whole refuse-rather-than-fabricate protection rests on a regex
for the literal string "N Total Results" against `document.body.innerText`. It
fails open three ways, each landing on `status: "complete"` with zero records:
different vendor wording, a swallowed exception, or an absent method behind
optional chaining.

Worse, the behaviour is asserted green and named after Hays. The test
hard-codes `portalId: "hays-erss"` and titles itself "no regression for portals
without the signal, e.g. Hays". So the county the gate was commissioned to
investigate is written into the suite as the example of why the unsafe branch
is fine, and a correct fix reads as a regression.

Nothing counts it. A `complete` with zero hits and a null hint is
indistinguishable downstream from a genuine zero. Unobserved, not merely
unfixed.

## Errors made and corrected

Three, all mine, recorded because the pattern matters more than the instances.

**Propagated a stale claim into a dispatch.** R-02's mission asserted PR #597
was "merged and NOT serving, a real undone step". It was already serving.
cente-c1 had established that and recorded it in `_catalog/seat_register.json`,
a file read at the start of this session and present in the session's own grep
output. Took the WDLL's status at face value while criticising that same card
for carrying stale claims.

**Pinned a defect as a specification.** `feasibility-narrative-wiring.test.ts`
asserted the unconfigured fallback emitted no reason, under a heading about
preserving pre-existing behaviour. The suite was asserting the bug, so a
correct fix would have read as a regression. Caught by doc-repo-26 in review;
the suite structurally could not have caught it.

This is the second instance of that exact error found in one day, in two repos,
by two authors. The records-worker test above is the other. Both green, both by
careful authors. One is an incident; two in a day is a practice. The fix is not
"be more careful" but that a test for a degradation path must be written
against the rule, never against what the code currently returns.

**Framed a hypothesis too narrowly.** Told R-02 to look for a county-specific
code branch. There is none, and the finding is that suppression depends on the
page, not on a branch. Also stated the engine deploy as "a one-commit window,
P-120 only" when it was five commits across two programs; corrected by
doc-repo-26 and verified.

## Cross-session coordination

doc-repo-26 held cross-thread coordination. Two things worth carrying.

**`seat_register.json` is a last-writer-wins shared blob.** It clobbered a
registration twice in one night, once by a restore-from-backup that reverted
past another seat's edit, once by writing nine entries without `path` so eight
of nine lanes would have been refused every git write. The symptom is the
problem: a registration vanishes, nothing complains, and the seat reads as
misconfigured later. The second was caught only by running a deliberately
unregistered control alongside the nine, so that `unregistered_worktree` versus
`product_index_foreign` became the discriminator.

**Interlock is not authorization.** A coordination seat can clear an interlock;
only the operator authorizes a production deploy. doc-repo-26 wrote "deploy it,
do it now" to a lane, then corrected its own wording unprompted and adopted the
distinction as standing form. Two lanes correctly refused relayed
authorizations tonight.

## Open

- **engine-api deploy.** Main is five commits ahead of production across two
  programs, including R-01's composition root. The "small window" framing no
  longer applies; see the operator note below.
- **Population count** for the fail-open finding: stored jobs terminal
  `complete`, zero hits, no `portalDeclaredResultCount`. Needs DB access this
  seat does not have. Cheapest possible next step and it converts a code
  reading into a number.
- **LDT narrative-section deploy** plus `BROKERAGE_API_BASE_URL` and
  `SERVICE_API_KEY`, which belong in the workflow rather than a console because
  workflow deploys revert manually-set env vars.
- **R6 through R9** of the re-cut, including the hauska-map retirement of
  `flattenBriefForDossier` and `composeBriefVerdict`.
- **Doc-comment pointer defect**, minor: `report-manifest.ts` cites
  `__tests__/report-manifest.type-test.ts`, which does not exist. The real proof
  is `report-manifest.compile-check.ts` in `src/`. Ironic, since that file's own
  comment explains why `__tests__/` would not work.

Hays authorizations confirmed by the operator: both runs were his.

P-124 runs in parallel; its resumption contract is OPS-16 amendment A-115.
