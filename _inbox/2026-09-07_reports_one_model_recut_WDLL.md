---
id: 2026-09-07_reports_one_model_recut_WDLL
title: Reports — one model, product manifests (WDLL re-cut)
date: 2026-09-07
status: proposed 2026-09-07, awaiting operator ratification
plan_row: P-120 (OPS-16). This re-cuts the existing row rather than adding one; the row's description in the AMENDMENTS table needs updating to match, which is an operator edit.
owner: planner (doc_repo, integration seat), executing in hauska-engine
supersedes: _inbox/2026-09-07_reports_courthouse_program_WDLL.md (item list retired, see "What this retires")
snapshot: hauska-engine main at e1c14e3 plus df96f57 (both merged this session); structural claims below were read from that tree on 2026-09-07, not carried over from the superseded card. hauska-map claims read from P:/hauska-map working tree. Nothing in this card is verified against a deployed service; engine-api's serving revision predates both merges.
related:
  - _inbox/2026-09-07_reports_courthouse_program_WDLL.md
  - _decisions/2026-09-03_p32_feasibility_unfrozen.md
  - _decisions/2026-09-04_p32_wave1_customer_done.md
  - 61_enforcement_doctrine.md
---

# Reports — one model, product manifests

## Why this card replaces the last one

The superseded card was a list of symptoms. Operator call, 2026-09-07: "why
cant we have one pdf engine that can produce both reports based on the data
we have availble in the platform. one report is simply more comprhenvis than
the other the feasibility study at its core is an X-ray plus a site plan plus
a flood study."

That is correct, and six of the previous card's acceptance items exist only
because it is not true yet. Every one of them is two derivations of the same
fact disagreeing. Working them individually buys a reconciliation that has to
be maintained forever. Removing the second derivation deletes them.

The planner had drifted the other way and was about to make it worse: the
previous plan for item 7 was a bridge function plus a parity instrument to
check the bridge. A parity checker is what gets built when duplication is
accepted as permanent and now needs a machine to police it. The correct
answer to self-inflicted duplication is deletion, not measurement.

## What is actually there today

Verified by reading the tree at the snapshot above, not inferred.

Four product assemblers: `author.ts` (Site Plan), `dossier-author.ts`
(X-Ray), `feasibility-author.ts`, `flood-drainage-author.ts`.

Four product PDF emitters: `pdf/render.ts`, `pdf/dossier.ts`,
`pdf/feasibility.ts`, `pdf/flood-drainage.ts`.

**The shared PDF primitive layer already exists and all four already use
it:** `pdf/layout.ts`, `pdf/format.ts`, `pdf/line-box.ts`,
`pdf/provenance.ts`, `pdf/template-tokens.ts`, `pdf/annotation-placement.ts`,
`pdf/aerial.ts`. "One PDF engine" is therefore not a rewrite. The engine is
built. What is duplicated is the four assemblers sitting on top of it.

**Three of the four already compose the same substrate.** Site Plan, X-Ray
and Feasibility each call `composeSitePlanModelForParcel`. The convergence
this card proposes is already most of the way present by accident; nobody
made it the structure, so three assemblers re-derive and drift.

**Sections already exist as a concept.** `feasibilityModelToBriefSections`
emits twelve identified sections: jurisdiction, parcel-ownership,
zoning-envelope, flood, special-districts, wells-pipelines, terrain,
utilities, hoa, footprint, data-quality, open-items. It has exactly one
caller, the Feasibility PDF. X-Ray never touches it.

**X-Ray's facts come from a second, independent derivation.**
`dossier-author.ts` renders caller-supplied `content.brief` verbatim after
sanitization. hauska-map builds that payload in `assembleDossierExportBody`
from its own `ResearchBriefPayload`, via its own `flattenBriefForDossier` and
its own `composeBriefVerdict`. So the two customer documents about one parcel
are computed by two different systems with nothing reconciling them. That is
the whole of items 7, 9 and 10.

**`floodStudyAvailable` is a fake field.** It is an optional boolean on
`AuthorParcelFeasibilityExportOptions`, supplied by the caller, written
straight into the model as `studyAvailable`. Feasibility never reads a study,
never runs one, never verifies one exists. The "not on file" line a customer
sees means the caller did not pass a flag. Under
`61_enforcement_doctrine.md` this is a caller-asserted claim about the world
that nothing checks, and it should not exist in any form. This is the whole
of item 11, and it is worse than the previous card described it.

## Done looks like

One composition reads the parcel once and produces one model in which every
fact family carries its own present or absent state with provenance. One
section renderer draws any section from that model, including its declared
absence. A product is an ordered list of section ids plus a cover policy, and
nothing else. Feasibility is the manifest that contains everything, including
the real drainage study and the package layer. X-Ray is a shorter manifest
over the identical model. Site Plan and Flood are shorter still.

Two products cannot disagree about a shared fact, and the reason they cannot
is that there is one field, not because a checker compares two of them.

Clicking Feasibility runs the site plan, the fact composition and the flood
study, assembles them into one document, and then adds the package layer over
the collection: the narrative, the open items derived from every section's
absences, the verdict, and the data-quality note.

## The shape

    composeParcelReport(parcelNodeId)
      -> ParcelReportModel
           geometry        (site-plan model: ring, setbacks, envelope, contours, street)
           facts           (jurisdiction, ownership, zoning, flood, districts,
                            wells/pipelines, terrain, utilities, hoa, footprint,
                            discharge point)
           drainage        (the real persisted-or-run study, never a boolean)
           package         (narrative, open items, verdict, data quality)

    renderReport(model, manifest) -> PDF

    manifests
      site-plan     [drawing, summary, aerial]
      x-ray         [cover, fact digest, drawing, summary, aerial]
      flood         [flood cover, catchment, ponding, flow paths]
      feasibility   [everything, plus the package layer]

The manifest names sections. It cannot carry fact values. That constraint is
the control, and it is a type, not a check: a product physically cannot
supply its own version of a fact, so the disagreement class is unreachable
rather than policed. Per the doctrine's own preference, a type the compiler
enforces at every call site has no trigger to be missing and no call site to
be absent.

## What this retires

From the superseded card, by number:

| Item | Was | Disposition |
|---|---|---|
| 7 | X-Ray as a subset view, via a bridge | DELETED as written. True by construction under one model; the bridge and the parity instrument are not built |
| 8 | Superseded-run arbitration | DELETED. One composition, one run. The scenario it arbitrates has no manifestation |
| 9 | Buildable-area self-disagreement | DELETED. One field |
| 10 | X-Ray verdict self-contradiction | DELETED. Verdict derives from the model; PE stops computing its own |
| 11 | Drainage-study integration gap | REPLACED by R3 below. It is not an integration gap, it is a fake boolean to remove |
| 12 | Open-items under-generation | DELETED. One generator over one model, which is already how `generateOpenItems` works; it just needs every section |
| 13 | Existing-structures wiring | DELETED. One resolver |
| 6 | Narrative from the briefing engine | DONE, merged df96f57, and it improves here: the facts payload becomes the whole package rather than Feasibility's slice. Same client, wider input |
| 14, 19 | QA batch, discharge point | KEEP. Independent of this re-cut, already merged |
| 15, 16, 17a-c | Courthouse | KEEP UNCHANGED. Untouched by this card |
| 18, 20 through 26 | Comprehensiveness | KEEP, and they get cheaper: a new fact family becomes one section added to the model plus one manifest entry, not four assembler edits |
| 27 | MCP exposure | DONE, serving |

Net: six items deleted, one replaced, none of the courthouse or
comprehensiveness work lost.

## Acceptance items

No timeframes. Order and dependencies only.

| # | Item | Depends on | Check |
|---|---|---|---|
| D0 | Deploy engine-api carrying e1c14e3 and df96f57 | none | A real Feasibility PDF for the narrow Bastrop parcel that previously returned 422. Production is broken until this runs; it is not part of the re-cut but it gates every live verification below |
| R1 | `composeParcelReport`: one read, one geometry composition, every fact family in a uniform present/absent shape | D0 | Two products built from one composition return the identical object for a shared fact, asserted by identity, not equality |
| R2 | Section-level failure isolation: a section that cannot compose becomes a declared absence and never fails the document | R1 | Verified by violation: force each section to throw in turn; the document still renders and names the absence. This is tonight's outage fix generalised |
| R3 | Delete `floodStudyAvailable`. Composition reads the real persisted study, runs it when stale, declares honest absence when there is none | R1 | A parcel with a persisted study shows it; a parcel without one says so and says why. Verified by violation: the boolean cannot be reintroduced because it no longer exists on the type |
| R4 | Manifest type that names sections and cannot carry fact values | R1 | A product attempting to supply its own fact value fails to compile. Verified by writing that code and confirming the compiler refuses |
| R5 | Feasibility renders from a manifest, including the drainage sheets and the package layer | R2, R3, R4 | One PDF containing the site plan, the fact digest, the real flood study, and package-level narrative/open-items/verdict |
| R6 | X-Ray becomes a manifest. Caller-supplied brief facts and verdict no longer accepted; chat summary and notes still are | R5 | X-Ray and Feasibility for one parcel state the same buildable area, the same zoning, the same verdict basis. Cross-repo: PE stops sending facts |
| R7 | Site Plan and Flood become manifests | R5 | Byte-comparable output to today's, or a named and justified difference per sheet |
| R8 | Retire the four product assemblers the manifests replace | R7 | The old entry points are gone, not merely unused. A CI check fails if they reappear |
| R9 | Retire hauska-map's `flattenBriefForDossier` and `composeBriefVerdict` | R6 | Property seat, compiled dispatch. Named here because the retirement rule requires the read-from-X change to carry the retirement of Y in the same card |

R8 and R9 are the half that normally gets dropped. Doing R1 through R7 and
stopping leaves both derivations alive with a new one on top, which is
strictly worse than today.

## Complications, named up front

Feasibility gets more expensive. The drainage study is the costly part of the
platform: a second DEM at coarser resolution over a padded catchment, flow
accumulation, a NOAA fetch. The study already persists, so composition reads
a fresh one and runs only when stale. That is a cache, not a new concept, but
a cold parcel's first Feasibility will be noticeably slower and that is a
product decision, not an implementation detail to discover in production.

Two DEM fetches are legitimate, not duplication. The sheet wants roughly a
metre per pixel over the lot; drainage wants coarser over a much larger
catchment. One composition fetches both deliberately and shares them. This is
exactly where the 2026-09-07 outage came from: two call sites, one had
learned to pad the bbox and the other never did.

Chat summary and notes stay caller-supplied. They belong to the app and are
not in the atoms. Facts and verdict do not. That split removes the second
derivation without losing anything real.

X-Ray could get thinner. PE's brief payload is partly chat and research
derived and may carry material the model does not have. R6 must diff the two
on a real parcel before the swap, and anything genuinely missing becomes a
fact family in the model rather than a reason to keep the second derivation.

## Reversal criteria

Abandon this shape and return to separate assemblers if, at R5, composing the
whole model to render a three-sheet Site Plan proves to cost materially more
than composing the site plan alone and caching does not close the gap. That
would mean the products have genuinely different substrate needs and the
duplication was load bearing. Nothing read so far suggests it, since three of
the four already compose the same substrate today.

## Corrections to the superseded card

Item 14 is recorded there as merged-not-deployed. `hauska-engine-api` is
serving revision `hauska-engine-api-p120batch` at 100 percent, read from
traffic JSON by field name on 2026-09-07. The revision's image digest was not
matched to a commit, so which code it runs is not asserted here.

Item 6 is recorded there as "hauska-engine side UNOWNED". It is merged as
df96f57.

The site-plan outage that prompted this session is not in the superseded card
at all. Root cause and fix are in hauska-engine PR #401.
