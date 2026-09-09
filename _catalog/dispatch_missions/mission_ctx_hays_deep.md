# CTX-HAYS-DEEP — the operator does not believe Hays CAD is missing 30,000 properties, and he should not have to take our word for it

Repo: `legacy-design-tools`. Reuse the registered worktree
`P:/seat-worktrees/property/legacy-design-tools-ctx-hays` on branch
`fix/ctx-hays-2026-cad-reacquire`. Read-only measurement; a code diff is not expected.

## Why this exists

Two prior lanes have looked at Hays and both concluded the same thing, and the operator's
instinct is pushing back on it. That instinct is the reason for this lane. Every
measurement so far has been taken against sources we chose, using our own parsing logic,
compared against our own store. Nothing external has ever confirmed the account count.

Read first, in this order:

- `_inbox/2026-09-09_hays_2026_cad_roll_is_incomplete_finding.md` (the original alarm)
- `_inbox/2026-09-09_ctx-hays_acquisition_mechanism_resolved_finding.md` (mechanism B)
- `_inbox/2026-09-09_ctx-hays-split_close.json` (the lineage split)

## The two readings of the operator's doubt, and you test both

The operator said: "I don't see the appraisal district missing 30k+ properties on their
roll."

**Reading 1 — is 134,606 the whole Hays roll?** Maybe our export covers only part of what
Hays CAD actually appraises. This is the reading that would reopen mechanism A and it has
never been tested against anything outside our own pipeline.

**Reading 2 — did Hays actually lose 30k accounts?** On the current evidence, no. The
prior lanes' own numbers say the 2025 CAD-only population was 131,246 and the 2026 roll is
134,606, which is GROWTH of about 3,360, entirely normal. The apparent 21.8 percent shrink
came from our own 2025 baseline having been padded with 116,421 StratMap land-parcel rows,
40,870 of them net new, applied 2026-08-25 as a coverage fallback. If that holds, the
answer to the operator is that the appraisal district is not missing anything and we
inflated our own baseline.

**Confirm or refute reading 2 explicitly and state it in one sentence a non-technical
reader can act on.** It may already be the whole answer, and if so it should be said
plainly rather than buried under a third investigation.

## The independent authority, which is the point of this lane

Everything so far is one derivation: our fetch, our parser, our store. Get a second one
that Hays CAD and this program do not both control.

Candidates, in rough order of authority. Use at least two:

1. **Texas Comptroller.** The Property Tax Assistance Division publishes per-CAD data
   including the Property Value Study and biennial Methods and Assistance Program reviews.
   These carry account or parcel counts per appraisal district from an authority that is
   neither us nor Hays CAD. This is the strongest available check.
2. **Hays CAD's own published totals.** Certified totals, annual report, or board
   materials on `hayscad.com` typically state a roll size and a property-type breakdown.
   A number they publish in prose is independent of the file they publish as data.
3. **Property-type composition.** A CAD roll is not only real property. It carries
   personal or business property, mineral and industrial accounts, and exempt accounts.
   Establish what property types the Orion record-1 Property file contains and whether any
   category is published in a separate file we never fetched. **This is the single most
   likely mechanism for an undercount and it is cheap to check.**
4. **Per-capita and per-county sanity.** Compare accounts against population and against
   the five other counties already in the store (48021, 48055, 48309, 48453, 48491). A
   Hays figure wildly out of line with its neighbours is a signal; one in line is weak
   confirmation. Weak confirmation, stated as weak, is still worth having.

## Also check the mundane failure modes, because they are the most common

- Does `hayscad.com/data-downloads/` publish more than one 2026 file set, or a file we
  have never fetched? The prior lane fetched three and all agreed, but agreement among
  three files of the same kind does not rule out a fourth of a different kind.
- Is the record-1 Property file paginated, split, or truncated in any of the drops?
- Does our Orion parser drop rows silently on a schema it does not recognise? The
  2026-07-18 Certified export used a different schema entirely and the prior lane counted
  it as raw rows (R=123,429 P=8,682 M=2,479 N=10). **Those record-type letters look like
  they encode property class. Establish what R, P, M and N mean.** If M is mineral and P
  is personal property, that breakdown may be the answer to the whole question.

## Pre-register your falsifier

Before you fetch anything, state what result would prove reading 2 wrong and mechanism A
right. Name the number you expect from the independent authority and what you will
conclude at each of: near 134,600, near 172,000, or something else.

If an external authority reports Hays at roughly 172,000 accounts, mechanism A is back and
this program has a real acquisition gap on a launch county. Report that loudly. Being
wrong twice is cheaper than being confidently wrong once.

## What you must NOT do

Do not re-acquire, apply, or write anything to `cad_property`.

Do not touch `MAX_MISS_RATE` or any gate threshold.

Do not bake, publish, walk, deploy, submit a Cloud Build, or run a Cloud Run job.

Do not write to hauska-factory, hauska-engine or hauska-map.

Do not manufacture a code diff. Two prior lanes in this worktree correctly shipped nothing
and said so. Do the same if that is the honest outcome.

Fetching a public page needs a browser User-Agent; a bare fetch gets a 403 WAF block. That
is a header, not an auth bypass. Do not attempt anything that requires credentials, and do
not crawl on borrowed logins.

## Close contract

Standard lane close JSON, plus:

- The independent authority figures, each with its source URL, publication date and what
  exactly it counts.
- The property-type composition of the export, and what R, P, M and N denote.
- A plain-language verdict on reading 2 in one sentence.
- Whether mechanism A is reopened, and if so what the real acquisition gap is.
- Your pre-registered falsifier and whether it fired.
- `leave_behind`.

Write the close so the operator can read the verdict without reading three prior closes
first. He is the audience for this one.
