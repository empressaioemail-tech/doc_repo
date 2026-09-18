# SmartCity OS — Citizen lens

**Artifact:** not published. DRAFT of 2026-09-18, produced under OPS-17 G-142, lane
`g142-citizen-lens`. Publication and ratification are the planner's call, not this lane's.
**Decision:** none yet. The ratifying decision belongs in `_decisions/` and should link back here.
**Status:** DRAFT 2026-09-18, awaiting ratification. Drawn after the 2026-09-17 blanket approval, so
that approval does not cover it.
**Source:** `smartcity-dashboards` at `origin/main` `7487d7c0a55deeefc286c4a1047545757b802c5b`, read by
`dump-source-state.mjs` — the product's own modules imported, its own markup parsed, extracted with
`git archive` from the commit so no working tree is involved. Every state word, panel title, sentence
and count on these boards comes from `source-state.json`. None is typed by hand.

The dispatch named `96fdafbb`. `origin/main` had moved to `7487d7c0a55d` by the time this lane ran, and
this folder is drawn against `7487d7c0`. The drift is **4 commits and 31 files**, and it was measured
rather than assumed: `git diff 96fdafbb 7487d7c0` returns **0 lines** mentioning `citizen`, and every
fact this design pins was separately read at BOTH refs and is identical — the lookup basis and its
`ui.test.mjs` assertion, `citizen` in `src/lenses.mjs`, `Citizen` in `src/staff-review.mjs`, **0**
occurrences of `citizen` in `src/domains.mjs`, and the twelve-tile-grid line in `src/shell-homes.mjs`.
`dump-source-state.mjs` re-derives every Citizen fact from the named ref rather than carrying a claim
across the drift.

## Regenerate and check

    node dump-source-state.mjs --repo P:/smartcity-dashboards   # re-read the product at origin/main
    node gen.mjs                                                # rewrites the 3 boards + canvas.json
    node check.mjs                                              # 54 self-tests, then 13 rules on the boards
    node violate.mjs                                            # 16 plants, each caught by its own rule

`gen.mjs` throws if a premise of this design moves — if the Citizen lens acquires a registered domain
in `DOMAIN_REGISTRY`, or a composer route in `server.mjs` — because at that moment the boards are wrong
rather than merely stale, and a silent regeneration would hide it. `check.mjs` independently refuses a
verdict on the same two facts, on the shipped badge vocabulary, and when `canvas.json` and
`source-state.json` name different product commits.

`_kit.css` is a byte-identical copy of every other copy in `_design/`, sha256
`e63b9014d4d150ac1b54d2b5ab361bcbce157fa9227768ec4e9553fccee66336`. No token was invented.

## The lens this is drawn against

The Citizen lens is the only surface a resident ever sees, and it is the one with the least behind it.
Measured at the ref above:

- `citizen` is a lead lens (`src/lenses.mjs`), `accessPolicy: "public-free"`, `payments: false`,
  `skuName: null`, audience `resident`. `src/ui.test.mjs:319-321` asserts all three.
- `DOMAIN_REGISTRY` carries **0 of 11 domains** whose `lensId` is `citizen`. `src/server.mjs` carries
  **0 route literals** naming it. There is nothing a grant could attach to, which is the difference
  between this lens and every other one: the others have sources that have not connected yet.
- It appears in `NINE_LENSES` and **not** in `DEPARTMENT_ROLES`. Nobody at a city is the citizen
  department, which is the right shape for a public lens and is why no per-resident count is
  measurable by any grant on any city.
- The shipped page declares four regions: `Look up an address`, `Your requests`, `Pay permit fees`,
  `Public meetings`.

**One of the four is already right, and this design is mostly an argument for copying it.** The address
lookup is deliberately DISABLED with its basis printed underneath rather than hidden
(`web/index.html:1117`, asserted verbatim by `src/ui.test.mjs:343`). That is the treatment the other
three regions should get, and the design's job is to extend it rather than to regress it. Both boards
that render the shipped surface carry that sentence verbatim because `check.mjs` refuses a board where
it has been softened or paraphrased.

**And one word is outside the product's own vocabulary.** "Your requests" ships with a quiet pill
reading `None on file`. The product's badge vocabulary is `Empty / Not built / Not read / Preview /
Not connected` — five words, declared in `src/ui.test.mjs` — and `None on file` is not among them. Two
mechanical objections, neither stylistic:

1. It is a word nobody defined, in the one place a reader looks for the state of a region.
2. It is a **zero about a subject the lens has never established**. It says this resident has no
   requests, on a surface that by design does not know who is reading. That is a claim, and it is the
   exact collapse this design exists to prevent: absent, zero and unmeasured rendered as one thing.

The honest word is `Not read`, and the honest sentence is why. `check.mjs` proves the rule can fire by
finding `None on file` **outside** the vocabulary on the shipped side of the comparison, not on the
design side — a rule observed only passing has not been observed working.

## The four distances, kept apart

The design's only structural rule: a region prints a state word, a distance, and a basis — or it prints
none of the three. The distance is a closed set of four, and each is a different sentence to a reader:

| Distance | What it says | Why it is not the others |
|---|---|---|
| `no-region` | there is nowhere to attach a source | the surface is not in the registry. No grant changes it; registering the domain does |
| `no-capability` | the product does not do this on any city | a city-scoped sentence here would be false. `payments` is `false` on every lead lens |
| `no-source` | the product does this and this city has not connected it | the only distance that varies by city, and the only one a grant closes |
| `no-identity` | no grant can measure it, on any city, ever | the lens is public-free and holds no account, so a per-resident count has no subject |

`Main.dc.html` carries all four, exactly once each, and `check.mjs` refuses a board where two regions
collapse onto one distance. `Distances.dc.html` draws them side by side with the one measured zero the
product actually supports: **0 of 11** entries in `DOMAIN_REGISTRY` carry `lensId citizen`. That is a
reading taken by counting the module, with a counting rule, and the board says so. The same zero appears
as `Not read` on the four regions of `Main`, and the two renderings are deliberately not
interchangeable: a zero is a measurement, `Not read` is the absence of one.

## The boards

| Board | What it shows |
|---|---|
| `Main.dc.html` | The un-fed lens: four regions, four distances, four bases, and the one word changed. Every region figure is UNMEASURED and there is no region-scoped measurement anywhere on it; the only measurements are product-scoped facts (registry census, route literals, regions on the shipped surface) |
| `Distances.dc.html` | Five cards: the four distances and the measured zero, each with its basis, its instrument and what would change it |
| `Filled.dc.html` | The contract board, DEMO FIXTURE badged in three places. What a fed region owes the reader, drawn with a measured `1` and a measured `0` beside two regions no fixture can fill |

`Filled.dc.html` is a fixture board **on purpose**, and the instrument is two-sided because of it: the
un-fed lens may carry no region-scoped measurement at all, and the fixture board must carry at least one,
including at least one measured **zero** and at least one region still unread. Neither half is
satisfiable by a sentinel, and a "clean pass" is not available to a board that fills every region — a
fixture that could supply an identity or a payment processor would be flattering the design, since the
product has neither on any city.

## The twelve-tile grid was dropped once already

`src/shell-homes.mjs:146` records it verbatim: `{ table: "other", job: "Citizen service requests",
home: "Citizen lens. The twelve-tile grid was dropped.", disposition: "Mounted" }`. It is **not
re-proposed**, and the reason is stronger than the fact that it was dropped: a tile is a measured
figure, and there is no measurement on this lens to put in one. `check.mjs` refuses a `data-tile`
attribute and a `class="metrics"` strip on any Citizen board by name. A large figure is still allowed —
`data-figure-lead="1"` marks one — because the objection is to the grid as a rendering of measurements
nobody took, not to typography.

## The instrument

`check.mjs` — 54 self-tests in both directions, then 13 rules on the real boards. Every rule compares a
board against `source-state.json`, so one party acting alone cannot satisfy both sides.

**The scope is structural.** Every read except two is scoped to the content inside
`<main data-lens-body="citizen">`, so the nav's own `Not built` and `Not read` badges — which are the
shipped values and belong there — neither satisfy nor violate a rule about the Citizen page. A
whole-document scan would pass on the wrong evidence, which is its own way of checking nothing.
Removing the marker makes the check ABORT for that board rather than fall back to the whole document.
The two document-wide reads are named as such in the file: the Citizen nav badge tie (chrome, and a
shipped value) and the DEMO FIXTURE marker (a badge, which belongs in chrome).

**It refuses rather than returning a verdict it cannot support.** Exit 2, not exit 1, for: a moved
product premise; boards and snapshot naming different commits; a self-test failing; and a predicate that
matched nothing. Vacuity is filed as its own rule (R13) rather than under the rule it would have
disabled, because "this board gave that rule no input" and "this board broke that rule" are different
statements and filing one as the other is how a hole hides inside a pass.

**It reports matched inputs.** 21 figures, 8 regions, 5 distances, 13 bases, 19 cells, 2 fixture rows,
12 verbatim sentences, and it refuses a verdict if any of those counts reaches zero.

`node violate.mjs` makes 16 plants into throwaway copies of the folder, one at a time. Each must be
caught, by the rule that exists for it:

| Plant | Caught by |
|---|---|
| a board whose scope marker is gone | R1, and it is added as a COPY because breaking the real Main makes the instrument refuse for want of inputs first — both behaviours are correct, and the finding is what this case tests |
| a region printing `None on file` | R2 — the shipped page's own defect, fired on the design side |
| two regions collapsed onto one distance | R3 |
| a state word with its basis deleted | R4 |
| a measured figure with its counting rule deleted | R5 |
| a `data-tile`, i.e. the twelve-tile grid coming back | R6 |
| the pinned shipped sentence paraphrased | R7 |
| the retired product name `CitizenConnect` on the page | R8 |
| a fixture board with its DEMO FIXTURE marker removed | R9 |
| a fourth board nobody classified | R10 |
| a region-scoped number invented on the un-fed lens | R11 |
| the Citizen nav badge drifting from the shipped `Preview` | R12 |
| every data-cell deleted | R13 |
| a registered citizen domain appearing in the product | exit 2, premise |
| the boards and the snapshot naming different commits | exit 2, commit tie |
| the fixture board deleted, leaving a predicate no inputs | exit 2, vacuity |

Two rules were relaxed only after they were measured doing harm, and both relaxations are recorded here
so nobody re-tightens them by accident. **R7:** the pinned sentences belong to the board that renders the
shipped surface, so requiring them on the distances board was requiring copy it does not display; the
fixture board answers for the two shipped panels it renders unchanged instead. **R8:** the product's
tests forbid the word `Compose`, and the first draft of `Main`'s metric strip read "Composer routes
naming this lens", so a plain substring rule fired on `Compose` inside `Composer`. Both sides were
wrong and both were fixed: the label now names the route literals it counts, and the matcher now matches
a forbidden WORD as a word and a forbidden TOKEN as a substring. Both directions are self-tested — a
standalone `Compose` is refused and `Composer` is not. The first version of that rule would have been
noise, and noise gets disabled rather than fixed.

## Absent, zero and unmeasured

Nobody is named on any board, and `check.mjs` refuses a person-shaped cell in two shapes, plus any money
figure, plus any string the product's own tests forbid. A fixture row names a generated identifier
instead. The three states never collapse:

    Not read        the region has not been read. No number, and the figure element carries NO count
                    attribute at all — not a zero
    0               a reading was taken and it produced nothing. The number is present, and the rule
                    that produced it is present beside it
    not-registered  the surface does not exist. A fact about the product, not about a reading

## Carved out, deliberately

The applicant precheck (`_design/smartcity-applicant-precheck/`, RATIFIED 2026-09-17) is the
applicant-facing surface and its own index line records that it does not cover this lens. Compass is
G-147's. Neither is absorbed here. What the Citizen lens looks like **once a source is connected** is
drawn only as a contract, badged as a fixture, and never as a roadmap: the two regions no fixture can
fill stay visibly unfilled on the board that could most easily have filled them.

## Not registered in all-canvas

`_design/all-canvas/build.mjs` carries a hardcoded surface list and does not name this folder, so these
three boards do not appear on the combined canvas yet. That list is the planner's file and this lane did
not edit it. Registering the Citizen lens there also means refreshing all-canvas's declared count, which
is a planner-owned line in `_design/INDEX.md`.

## Unestablished

Whether `bastrop_tx` has a citizen-facing address lookup bound to any of its seven live grants is
**UNESTABLISHED** from `smartcity-dashboards` at this ref: the registry carries no citizen domain, so
nothing in the repository answers it either way, and this folder states that rather than assuming it.
If it does, the `no-region` distance on `Main.dc.html` is the line that changes first.
