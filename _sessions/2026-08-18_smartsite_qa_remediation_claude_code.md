---
date: 2026-08-18
agent: claude_code
repo: portfolio
session_type: execute
memory_graded: none
rolled_up: false
---

## What was done

The operator filed a 21-item QA pass against smartsite.cloud. Traced to source,
it was six defects, not twenty-one. OPS-16 amendment A-018 opened six Layer 5
rows (P-39 through P-44); a parcel fact-sheet contract was frozen before
dispatch; six lane agents ran in parallel under the compiled-dispatch machinery;
every lane was reviewed adversarially at source by the planner.

Six PRs opened, all green, none merged during the working session. Both repo
mains untouched throughout.

## The six defects behind the twenty-one items

There was no single subject. The search box, inspect card, compare panel and each
export panel held independent parcel targets, so a drainage report returned
parcel 48027:498770 when 498778 was selected and a DXF export targeted text left
in the search box. Every fact was computed independently in five places, so one
X-ray PDF printed Zone AO on sheet 1 and Flood zone AE on sheet 4, and said the
buildable envelope was not derived while another sheet measured it at 6,325 sq
ft. Internal engineering language shipped to consumers, including a hardcoded
work-item note and a dev mount probe. Honest absence was styled as failure, so a
correctly-working Travis card read as an error box. The map could not say where
you were or what you were looking at: satellite mode has zero street labels by
construction, and real Texas district codes fell through a hardcoded ladder. The
tools were demos, with one measurement possible and no undo.

## What the sweep settled

The P-27 figure of 99.3% populated situs and the operator's missing addresses
were both true. The rule counted a string being present, never an address.
Against 13,071,975 parcels, 99.45% are non-null and 89.90% carry a street;
1,248,412 are counted populated with no street. The defect is a concatenation
sentinel in the TxGIO source column: Bastrop serves `", ,"` and Travis serves
`", TX 78660"`. Planner-verified live on production for 48021:36521.

Larger, and on nobody's brief: `mergeBakedBaseFacts` never copies `tier2` into
the served facets, so 608,414 baked FEMA flood determinations reach no user
while the write-side ledger scores that rail complete. Confirmed live: the
served payload has no `tier2` key.

The County Manifest's three tag controls are dead. `hasWriter`, `atomFamilyState`
and `isPartial` are uniform across all 3,556 cells, so NO WRITER, NO ATOM and the
partial treatment can never fire. Nothing recomputes the ledger; there is no
recompute route.

## The contract, and what four amendments taught

The contract was frozen before dispatch so five lanes could build against a fixed
interface rather than serialise behind one. It took four amendments and six type
defects across five rounds, every one found by an implementer filling a type from
a real payload rather than by the planner reading code to write it.

The invariants never moved. They came from observed product failures. The types
moved six times. They came from reading source. A model built by reading is a
hypothesis; it is only tested by being filled. That argues for freezing an
interface early and letting an implementer hit it hard, not for freezing it more
carefully.

Amendment 4 records a planner error worth keeping: Amendment 3 declared the
sentinel class closed after auditing by grepping for `Measurement`, when the
property that matters is semantic. That is the P-27 situs bug one level down, a
rule counting the wrong thing and reporting a number that is true and useless.

## The through-line

Every finding this session was the same defect in a different costume: something
that looks like an answer and is not. Honest absence styled as an error. Three
ledger flags pinned constant. A shared package whose 98 tests ran in no workflow.
A test asserting a phantom `X500` zone code, holding the bug in place rather than
catching it. `", ,"` passing a non-null address test 1.25 million times. A
planner audit grepping a type instead of asking the question. A flood share of 1
inferred from a set of length one.

Seven instances, found by six agents and the planner, none of them on any brief.

## State at close

Six PRs open and green: hauska-map #167 #168 #169 #170 #171, hauska-engine #347.
Merge order is #167, #170, #171, #168, #169, then #347 independently; #170 stacks
on #167 and the only real collision is a barrel file shared by #168 and #171.

## Open, and not fixed by any of these PRs

Reconcile the two disagreeing flood stores BEFORE fixing the `tier2` merge, or we
begin serving one of two contradictory answers with no basis for choosing.

The address fix is a different join per county and must not be scoped as one
backfill. Bastrop's `cad-parcel-roll` atom carries the address and the adapter
reads it for 6.43% of rows; Travis's roll is null on all 492,848 rows while
`txgio_address` holds the address with coordinates and is read by nothing.

Every lane reported code-done, not customer-done. Nothing has been seen on a
deployed surface.
