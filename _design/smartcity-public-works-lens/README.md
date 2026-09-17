# SmartCity OS — Public works lens

**Artifact:** not published. DRAFT of 2026-09-15, produced under OPS-17 G-145, lane
`g145a-department-lenses`. Publication is the planner's call, not this lane's.
**Decision:** none yet. This folder holds the artefact and its source; the ratifying decision
belongs in `_decisions/` and should link back here.
**Status:** RATIFIED 2026-09-17, `_decisions/2026-09-17_design_ratification_all_approved.md`. Not dispatched; implementation row to allocate.
**Source:** `smartcity-dashboards` at `origin/main` `f776b4bf24114ed4061609d28c0429f84eb431b7`,
read directly: `src/domains.mjs`, `src/domains/cip-projects.mjs`, `src/domains/call-analytics.mjs`,
`src/fixture-seam.mjs`, `src/adapters.mjs`, `src/city-pack.mjs`, `src/staff-review.mjs`,
`src/vendor-live.mjs`, `src/server.mjs` and `web/index.html`.

## Regenerate and check

    node gen.mjs
    node check.mjs

`source-state.json` is not a transcription. It is the OUTPUT of the product's own composers,
produced by importing `composeDomainById` from that commit and running it against
`template-city`, `empty-city` and `bastrop_tx`. Every row, count, basis sentence and counting
rule on these boards comes from it. Re-dump it rather than editing it, then re-run `gen.mjs`.

`_kit.css` is a byte-identical copy of `_design/smartcity-dev-services/_kit.css`,
md5 `58a68730e051b1ee2ffa21f08eae6752`. No token was invented.

## What this lens is

`src/domains.mjs` registers exactly two domains under `lensId: "public-works"`.

| Domain | Region | Gated by | Unit |
|---|---|---|---|
| `cip-projects` | Capital projects | `powerbi` | one row per project |
| `call-analytics` | Call analytics | `goto` | one bucket per queue per relative day |

Both are granted on the demo pack (`TEMPLATE_CITY.fixtureGrants` carries `powerbi` and `goto`),
so both generate: 16 capital projects and 25 call buckets at `f776b4bf`.

## The design argument

**Two regions of different units, so they switch rather than stack.** The product stacks both on
one page. At 1040px a sixteen-row register above a twenty-five bucket grid puts the second region
below the fold, and the staff who live in call handling never reach their own page. Peer regions
get a strip, the same pattern `DS_TABS` already uses for seven tabs, so the lens shape stays one
shape across the product. **This is a proposed change, not a copy of what ships.**

**The second axis on Capital projects is a matrix with forbidden cells.** The domain states that
phase and status are two questions, and `STATUS_PHASES` declares which pairs cannot occur: a
complete project is in closeout and nothing else; a stalled one is anywhere except closeout. So
of twenty cells, eight carry a count, four are a measured zero and eight **cannot occur by rule**
and render hatched. Absent, zero and unmeasured are three different states; this grid needs a
fourth, and drawing the eight forbidden cells as zeros would put eight invented readings on the
page and make the register look like it has holes in it.

**The second axis on Call analytics is the same grid read twice.** The domain emits one record per
queue per relative day. The product renders "By queue" and "By relative day" as two tables; they
are the row margin and the column margin of the same twenty-five buckets and both sum to 2,365.
Two numbers that must agree and are never shown agreeing is a reconciliation nobody performs, so
the grid is drawn once with both margins and the corner total.

**A blocked region states four things and never fewer.** Its state, its basis verbatim, what KIND
of thing would move it, and when that was last read. "Not read" alone is the sentence that has
made every blocked region on this product look alike.

## The boards

| Board | Pack | What it shows |
|---|---|---|
| `Main.dc.html` | `template-city` | the register at 10 of 16 rows, the six attention tiles with their denominators, the phase-against-status matrix, the money refusal, the flood screening mount |
| `Calls.dc.html` | `template-city` | the queue-by-day grid with both margins and the reconciliation, the three excluded families, the measured zero, and what the live feed can actually supply |
| `Blocked.dc.html` | `bastrop_tx` | one vendor answering and one declining, each with its obstacle named by kind |
| `Empty.dc.html` | `empty-city` | both regions built with no source, and the five-state legend that is the bridge to Parks |

## Findings, from comparing two sources rather than re-reading the canvas

**Three lenses, three obstacles, three kinds.** `src/vendor-live.mjs` is wired into `server.mjs`
through `REAL_LIVE_DOMAINS` for all three regions in this lane, and its own header records a
verification dated 2026-09-03: Power BI returns real data, GoTo returns `goto_not_authorized`
because the OAuth consent flow has never been completed by a human, and FirstDue returns a 403
because the credential lacks the apparatus and assets scope. Parks has no vendor at all. A
consent, an entitlement and a missing source are three different asks and only one of them is
ours. That is the spine of all three designs and it did not come from the dispatch.

**The live call feed is one aggregate record, not a queue breakdown.** `composeRealCallAnalytics`
maps a single "all queues, today" summary. The five-by-five grid is a property of the generated
pack and does not survive the cutover. The board says so on the page; shipping it silently would
promise staff a breakdown the vendor does not expose.

**The two paths disagree about a ratio.** `src/domains/call-analytics.mjs` refuses to put an
answer rate on a record, in its own words, because a ratio without its denominator beside it is
the figure DEV_PROCESS 1.1 exists to stop. `mapRealCallSummaryRecord` carries `answerRate`
straight from the vendor. One product, two paths, opposite rules.

**The same two paths name one class two ways.** The generated record carries `callsAbandoned`;
the live mapper carries `callsMissed`. Recommendation: `callsAbandoned` on both, with the live
mapper reading `summary.missedCalls` into it and carrying a basis saying the vendor calls it
missed. A rename is cheap now and expensive after a city has both on one screen.

**The shipped table declares a column the generated record cannot fill.** `web/index.html` gives
the capital projects table a `Completion` header; only the live mapper has a completion field. The
board omits the column rather than blanking it, because a blank cell in a percent column reads as
zero percent complete.

**The live `recordId` for a project is the project NAME.** `mapRealCipProjectRecord` sets
`recordId: String(row.name)`, so when the feed lands the Project and Subject columns collapse into
one and the table needs a different first column. Named on the Blocked board.

**The relative window points forwards on a measure that has already happened.** `dayLabelFor`
produces `today`, `in 1 day` ... `in 4 days`, and the call domain applies it to call volumes.
Recommendation: a past-facing label vocabulary for any historical slice, and keep `dayLabelFor`
for forward-looking ones. Raised, not settled: it is a product-line copy call.

**The money gate refuses the words "per cent".** `FORBIDDEN_CONTENT` in `src/fixture-seam.mjs`
matches the standalone word `cent`, so British two-word spelling on any surface trips the
product's own money rule. The product writes `percent`. This folder now does too. Found by
`check.mjs`, not by reading the board.

## The instrument

`check.mjs` self-tests in **both directions** and aborts rather than reporting a verdict it cannot
support. It reports a **matched-input count** per predicate and refuses a verdict if any predicate
matched nothing across every board, because a check with no inputs is worse than no check.

It refuses: a domain/gate pair the registry does not carry for this lens; an uncatalogued vendor
kind; a state word outside the shipped vocabulary; a composer status the product does not define;
a money token anywhere on this lens; a person-shaped name in any table cell; record ids that are
not the composer's own in the composer's own order; a queue reference the composer never produced;
and any of eight composer sentences going missing from the set of boards.

Verified by violation on 2026-09-15, six planted defects, all six caught, every artboard restored:

| Violation | Result |
|---|---|
| `gatedBy powerbi` → `gatedBy sparkline` | caught: uncatalogued vendor kind |
| a subject cell → `R. Garner-Lozoya` | caught: table cells name people |
| a count → `1.4 million` | caught: a money token reached this lens |
| first record id swapped with the third | caught: ids out of composer order |
| badge `Empty` → `Syncing` | caught: invented state word |
| `status: no-fixture-source` → `status: stale` | caught: invented composer status |

## Conventions honoured

Nobody is named on any board. Fixture data is badged as fixture on the page and the fixture place
vocabulary announces itself in the data. Absent, zero and unmeasured stay apart, and the matrix
adds a fourth state rather than collapsing it. There is no figure of money anywhere on this lens.
The word "twin" appears nowhere: externally this is the record, the asset, current state.

## Raised, not settled

**Naming the vendor on a lens panel is a change.** The shipped panel chip says "Reporting output
contract" and "Phone output contract" and names no vendor; vendors are named on Connections. The
blocked cards and the provenance foot name them, because a member of staff looking at their own
empty page needs to know whose credential is missing. This needs an operator ruling before build.

**The region switcher is a change.** See the design argument above.

## Carved out, deliberately

Police and Fleet: in scope as of the operator ruling 2026-09-15, but a separate lane. The flood and
drainage study itself: designed and ratified at `_design/smartcity-flood-study`; this lens shows
the mount, not the report. The live-read mode of either region: it needs a vendor that answers, and
drawing rows we have not read would be fabrication.

## Unestablished

Whether Power BI, GoTo or FirstDue answer **today** is unestablished. The 2026-09-03 readings in
`src/vendor-live.mjs` are the only evidence in the repository and are badged as recorded, with
their date, on the board. No live probe was run and no credential was used by this lane.
