# SmartCity Finance lens

**Artifact:** https://claude.ai/artifact/X3wFv3PfAh8aehLrjUbWL6
**Decision:** none yet, operator review owed
**Status:** draft, 2026-09-15. Not ratified, not dispatched.
**Relation to `_design/smartcity-finance-filings/`:** that folder is ONE tab of this lens, the
Localgov filings reconciliation, and it is under an AMEND ruling. This is the lens itself.

Five artboards: the lens today, departments, permit fee revenue, what has to land, and the
target state once the fund ledger arrives.

## The brief, and it is an operator correction

The planner proposed that v2 is "the same information with the fabrications removed." The
operator corrected it on 2026-09-15 and the correction is the design:

> That is just what we need to fill in to actually get to version two.

So removing the v1 fabrications is the **gap analysis**, not the product. This lens is therefore
drawn at its **full shape**: every cell it will ever hold exists on the page from the start, each
one either measured or countably unaccounted, and every unaccounted cell carries a named
acquisition path.

A missing column is invisible. An unaccounted cell is countable. That is why the empty regions
are drawn rather than omitted, and it is why there is a whole artboard for the gap.

## Regenerate and check

    node gen.mjs
    node check.mjs

`check.mjs` self-tests in both directions, then enforces the rule that matters on a lens about
a real city budget: **every money figure rendered must be traceable to `capture-figures.json`,
or sit on an artboard that declares itself ILLUSTRATIVE on the page.** Verified by violation:
injecting one untraceable figure into a real artboard exits 1.

That check exists because of the specific defect class this folder set has already shipped
twice: a tax rate attributed to a city ordinance, and a code section cited six times inside an
issued letter. Both traced to nothing. Both were plausible, which is why they survived review.

## Sources

`capture-figures.json` holds what was read from **`SmartCity OS Screenshots (2).pdf`**, 25 pages
of the v1 live Finance tab, supplied by the operator 2026-09-15, cited by page.

**Read this caveat before quoting anything from it.** Every figure in that file was read off a
compressed screenshot. Digits are legible at the magnitudes that matter and the defects below
survive any plausible OCR error, but no figure there is a reading of the source system. Nothing
from it reaches a customer artefact without verification against OpenGov and MyGov directly.

The v2 skeleton is read from `smartcity-dashboards` `origin/main` `f776b4bf`,
`web/index.html:892-938`.

## Four states, and they are not interchangeable

| State | Meaning |
|---|---|
| `MEASURED` | Read from a source, carrying that source and the date it was read |
| `UNACCOUNTED` | The cell exists and nothing has been acquired for it. Legitimate at rest, fatal at publish |
| `REFUSED` | A derived figure whose input is unaccounted. Not a zero, not a blank |
| `CONFLICT` | Two independently derived readings disagree, and the disagreement is the output |
| `PARTIAL` | Some of the record reads and the rest does not, and the split is named |

v1 has one state: a number. That is the defect, expressed once.

## What the capture shows, and why each one is a design move

**Actual Spent is the Budget column copied.** Pages 11 and 12: ten departments, ten identical
Budget and Actual Spent pairs, 100% burn on every one. The product states it in a caution banner
on that one sub-tab and then consumes the figures as measured everywhere else, including an
alarm derived from the fabricated equality: *"Non-Departmental is approaching budget cap at
100%, only $0 remaining."* Here, appropriation reads, actuals are unaccounted, and variance and
burn are refused. Four numbers become one honest absence.

**Budget pace is an identity, not a result.** Page 5 reports *"Budget pace: 94% spent at 94% of
fiscal year (+0% vs expected)."* Spent equals budget by construction and elapsed drives the
expectation, so the two track each other necessarily and the variance is always zero. A figure
that cannot come out any other way is not a measurement, and it reads as the most reassuring
number on the page.

**A collection rate of 157% is not a reachable state.** Collected cannot exceed charged. Page 23
prints it in green with a success mark. The surplus traces to one partition: Unassigned, read as
collecting $450.9M against $170.9M charged, roughly $280M unattributed, and the second largest
line in the breakdown. The magnitudes are impossible for the city regardless: $664.7M collected
against a $69.6M total operating budget, and about $231,000 per permit on Building Department.

**The permit counts do not tie, and the two capture pages disagree with each other.** Header
1,877. Department rows sum to 3,138 on one page and 4,052 on another. Building Department is
1,055 permits on one and 1,970 on the other, with different totals to match. Three populations,
one label. The lens refuses the count rather than picking the one that looks right.

**SPENT YTD is revenue.** Page 1 shows Total Budget $69.6M and Spent YTD $74.6M. Page 2 labels
the same figure REVENUE against EXPENSES $69.6M, and the page-1 insight text agrees: *"projects
$64.6M annual expenditure on $74.6M budgeted revenue."* A mislabeled field feeds the most
prominent card on the lens and renders as spending over budget with a positive variance.

**Departments on track reads 1/1** while the same product lists 29 departments. The denominator
is revenue-bearing departments and the card does not say so.

**The fund rows sum to roughly double the total budget.** Fifteen funds summing to about $128M
against a stated $69.6M. Even allowing generous OCR error the gap does not close. This one is a
counting-rule question, and the lens refuses a fund total until the rule is declared rather than
printing whichever figure looks right.

**And the most expensive shape.** The Scenario Modeler, pages 13 to 22, runs three-year
projections with conservative, expected and optimistic ranges, stamps them `HIGH CONFIDENCE`,
and shows `3/3 connected` beside them. Its expense baseline is the budget column copied. This is
the screen a city manager takes into a council meeting. Confidence asserted about a simulation
whose baseline was never measured is worse than no simulation, because it is actionable.

## The correspondence that makes this a design rather than a critique

The shipped v2 register names four required sources. The capture maps onto them exactly:

| Required source | v1 state | v2 state here |
|---|---|---|
| Adopted budget | genuinely connected, OpenGov ERP API | `MEASURED` |
| Fund ledger | absent, and v1 says so in a caution | `UNACCOUNTED` |
| Permit fee revenue | connected and corrupted | `CONFLICT` |
| Department spend | absent | `UNACCOUNTED` |

v1 reads one of four, corrupts one, and fabricates two. **One acquisition, the fund ledger,
fills four regions that are refused today**, and it is a request to the city finance director
rather than a build. That is the highest-leverage item on the lens and it is on the Acquisition
artboard with a named owner.

## Pinned, deliberately not designed here

The Localgov filings tab, which is its own folder and under an AMEND ruling.

Scenario modelling. It cannot be designed honestly before the fund ledger lands, because every
projection it produces is a function of a baseline that does not exist yet. Designing it now
would be designing the confident wrong number in a new typeface.

The account code reference and the reports and transparency lists from the capture. Both are
real v1 surfaces and neither is a claim about money, so they are lower risk and lower value than
the four regions above.

Fund-level actuals. The target artboard shows department-level fill because that is what the
fund ledger unlocks first; fund-level rollup is the same source and its own pass.
