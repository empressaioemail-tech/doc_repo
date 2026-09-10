# CTX-B7 — three more leaves take the stale claim while their siblings take the declared roll

repo: legacy-design-tools

## What CTX-B6 established, merged as 9ae49246

One tier-1 payload carried two vintages. Dollars, landUse, yearBuilt, legal description and
exemptions come from `fetchCountyCadPropertyRoll`, filtered `WHERE tax_year = declared.taxYear`.
`situsAddress` came from the cad-parcel-roll **atom claim**, which holds stale content.

Worked example, verified at source and in the store: Travis `48453:224793` served
`marketValue` at vintage 2026 beside a situs of `", TX 78756"` taken from the 2025 StratMap
drop, while the declared 2026 roll carried `4709 SHOALWOOD AVE` for that same prop_id.

B6 fixed that one leaf with `resolveConformantSitusAddress`: declared roll, then claim, then
an earned absence. The roll wins even over a usable claim, because mixing vintages across
leaves is itself the defect. It needed no new query: the row was already loaded and keyed by
prop_id for the dollar path, and only the column was missing from the `SELECT`.

## What it found and deliberately did not fix

Three more leaves are recoverable from that same already-loaded row:

    acreage      103,913 cells
    situsCity     78,428 cells
    situsZip      17,674 cells
                 -------
                 200,015 cells

B6 left them because `situsCity` feeds `resolveZoningJurisdiction`, so changing it moves
zoning-jurisdiction assignment for roughly 78,000 parcels. It judged that too large to slip
into a card about a different leaf. That judgement was correct and it is why this card exists.

## The question this card exists to answer

**Whether the roll-over-claim precedence B6 established for `situsAddress` is right for these
three, and what it moves if it is.**

Do not assume the answer is yes because B6 did it. Each leaf has its own consumer.

`situsCity` is the one that matters. Work out, and state with counts:

- how many parcels change zoning jurisdiction if `situsCity` prefers the declared roll;
- which direction those moves go, that is, how many gain a jurisdiction, lose one, or move
  between two;
- whether any of them currently serve a zoning district that would become wrong, since a
  parcel whose city changes may carry a stamp from the old city;
- whether that is a correction or a regression, with the evidence for your reading.

If that answer needs an operator ruling rather than an engineering judgement, **say so and
stop at the boundary**. Report what you would do and why, and leave it unimplemented. A
correct refusal to decide is a successful close for that leaf.

`acreage` carries a specific trap. CTX-LEAVES2 made bare-null acreage an earned `refused`, and
a 2026-09-10 re-bake wrote 15,542 Bastrop rows as `refused` on exactly that path. If acreage
is recoverable from the declared roll for some of those, then the program is serving a
declared refusal over data it holds. State how many of the 103,913 are currently served as
`refused` versus bare null, per county. That number is the finding.

`situsZip` is the smallest and probably the simplest. Say whether anything consumes it beyond
display.

## Constraints

- Ruling A1: do not convert usable data into an absence. The inverse also binds now: do not
  serve a declared absence or refusal over a value the declared roll holds.
- CTX-SITUS-SKIP (#648) and B6's earned-absence machinery stand. Genuinely absent stays absent.
- `48055:1` must keep grading RECORD_RETIRED and returning 200. Regression control.
- B6 added `provenance.situsAddressSource` and `situsAddressSupersededClaim` plus per-run
  counters so a re-bake that silently stopped preferring the roll is visible. Follow that
  pattern for whatever you change; an allowlist pin test will fire on new provenance keys and
  that control working is expected, not a problem.

## Verify by violating

B6 built `--grade-stored`, which grades rows as served today against the contract, and
`--violate` and `--self-test`. Extend them rather than writing new ones. A leaf you change must
fail before and pass after against real prop_ids you name.

## Scope

`legacy-design-tools` only. No writes to hauska-factory, hauska-engine or hauska-map. No
deploys, no Cloud Build, no Cloud Run job, no bake, publish or walk. The integration seat owns
every execution, and nothing you do changes a stored row until it re-bakes.

Register your worktree before working. Declare seat, branch and commit.

## Close contract

Standard lane close JSON, plus: per-leaf disposition with counts; the zoning-jurisdiction
movement analysis with its direction breakdown; the acreage refused-over-recoverable count per
county; anything you stopped at a ruling boundary and what you would do; violation runs with
real prop_ids; `48055:1` proof; and `leave_behind`. Push and open a PR. Do not merge. Report
the PR number and head SHA.
