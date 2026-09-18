## Mission — P-300 and P-338, writer half: every remaining setback cell says what is true about its city

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-setback-corpus` (default rows) and
`hauska-factory` (the setback writer and router), one PR per repo, each from current `origin/main` with
the SHA declared (factory `0f4558a4` at compile). You hand back the doc_repo ledger-policy diff in your
close; the seat commits it. You do not merge, publish the corpus, deploy, apply or write any store; the
integration seat does all of them. The surfaces (map, MCP, PDF) are a separate lane
(`_dispatches/2026-09-18_p338-refusal-surfaces_dispatch.md`) that reads the cells you write.

### The rulings

- **Ruling 6** (`_decisions/2026-09-18_phase0_closeout_rulings.md`): a district-miss parcel carries a
  declared refusal that names its district and its city and says to verify with the city. That is an
  accepted Phase 0 terminal state. Acquiring the missing rows is Phase 1 (P-346).
- **OT-10** (`_decisions/2026-09-17_setback_corpus_flag_state_and_default_line_rulings.md`): a table
  may carry one jurisdiction-default row, marked as such and never a district, applied only to that
  jurisdiction's parcels that have no district, always with the disclosure that a recorded plat or
  another ordinance may set a different line. Gholson (McLennan, 840 parcels, Sec. 3.01.002: 25 front,
  15 rear, 10 side, 25 corner street side) is the first case.
- **Ruling 5 as amended by A-224** (same file, "Ruling 5 amended"): the default serves only where the
  city's own ordinance sets one. Each of the 40 no-layer cities is classified at source into exactly
  one of three:
  - **(a) zoned, layer never acquired:** a declared refusal naming the city ("zoning district not
    acquired; verify with the city"). Accepted for Phase 0 like ruling 6; acquisition is P-364.
  - **(b) unzoned, the ordinance sets a city-wide line:** the default row with its plat disclosure.
  - **(c) unzoned, no city-wide line:** a checked absence naming what was read.
  Manor (Chapter 14, zoning map and PUD districts) and Lago Vista (Chapter 14, Table A by district) are
  zoned, measured 2026-09-18. They are 20,826 of the 48,829 parcels, and neither gets a default.

### The population (measured, `_inbox/2026-09-18_p255_census_regrade_RECORD.md`)

After P-256's apply, 58,339 parcels in the six counties carry `unaccounted` on all five setback rails.
P-326's classifier (`_inbox/2026-09-17_p326-setback-residual-composition_measurement.json`) splits
them into:

- **9,510 need a district row their city's table lacks.** That is 8,484 district misses in ruled
  cities, plus 1,026 Woodcreek parcels whose district is on file in a city with no table. By county:
  Hays 3,669, Williamson 2,292, Travis 1,743, Bastrop 1,295, Caldwell 402, McLennan 109. These take
  ruling 6's refusal.
- **48,829 are in 40 cities with no district on file.** 48,825 of those are because the city's zoning
  layer was never acquired. The byCity table in that measurement names all 40 with their counts
  (Lago Vista 12,745, Manor 8,081, Lacy-Lakeview 2,628, Wimberley 2,273, Bee Cave 2,261, ...,
  Gholson 840, ...). These take A-224's classification.

### What the writer does today (`src/jobs/parcel-setback-cells.mjs` at `0f4558a4`)

- `classifyRouterMiss` (~line 485) writes `unaccounted` with the reason `the setback table router found
  no district row for "<code>" in <table>`.
- `buildNoRuledTableCells` (~533) writes `unaccounted` naming the acquisition need.
- The P-256 gate releases only `unaccounted` cells and this job's own false absences (P-363 will widen
  it in parallel; see Constraints).

### What to build

1. **The city classification, at source, as data.** A committed table of the 40 cities. Each row
   gives the class (a, b or c), the ordinance section read and its URL, the date it was read, and for
   (b) the line's values with their section. The writer reads this table; it does not keep a second
   list. A city you cannot classify at source stays `unaccounted`, named, and is reported. It is never
   guessed into a class.
2. **Corpus (b) rows.** A jurisdiction-default row per class (b) city, marked as a default in the
   schema (not a district name the router could match), with per-value provenance and the plat
   disclosure. Bump the corpus version per its conventions. Say whether gate rule G7 or any other gate
   needs to learn the new row kind.
3. **The router.** A default row applies only to a parcel of that jurisdiction with **no district on
   file**. A parcel with a district code never falls through to the default, including a code that
   misses the table: that is ruling 6's case. Show the two cases apart.
4. **The cells.**
   - District miss (the 9,510): `refused`, with a reason naming the parcel's district code and its
     city and saying to verify with the city.
   - Class (a): `refused`, naming the city and saying the zoning district was not acquired and to
     verify with the city.
   - Class (b): the default values, with the disclosure in the cell's reason and basis.
   - Class (c): `absent-verified`, with a basis naming the ordinance read and that it sets no
     city-wide line.
   - The P-256 guard `assertNoFalseAbsence` must still hold: a class (c) absence carries what was
     checked, or it does not ship.
5. **The ledger policy (a doc_repo diff, handed back).** `scripts/six-county-completeness.mjs`
   accepts exactly two refusal classes on the setback rails. Ruling 6's district miss is coupled to
   P-346. A-224's zoning-not-acquired is coupled to P-364. Each is matched by its exact reason
   signature, not by "refused". The self-test gains cases showing each accepted and a differently
   worded refusal rejected.

### Verify by violation

Pre-register your falsifiers. Fixtures: a district-miss parcel writes the ruling 6 refusal naming its
code and city; a Manor-shaped parcel (class a) writes the class (a) refusal and never a default value;
a Gholson parcel (class b) writes 25/10/15/25 with the disclosure; a parcel with a district in a class
(b) city does NOT take the default; a class (c) parcel writes a checked absence with its basis; an
unclassified city stays `unaccounted`. Show each on the pre-change code where it should fail.

Then a read-only dry run per county under the heavy-scan lease on the direct host. Report counts per
outcome beside the seat's predictions: district-miss refusals 9,510; classes (a) + (b) + (c) + still
unaccounted = 48,829, with (b) exactly the class (b) cities' parcel counts (Gholson 840 if it is the
only one). A difference is a finding: explain it before you close.

### The three-question gate

Answer in your close: what executes the classification and the default, what triggers them, what fails
when a zoned city's parcel receives a default value or a district-miss parcel receives an unnamed
refusal, and what bypasses it (a hand UPDATE, a city added to the corpus without a classification row,
a zoning layer acquired later for a class (a) city).

### Constraints

- No store writes, no corpus publish, no deploys, no merges.
- Factory merge order this wave (the seat serializes): P-333, then P-334/P-329/P-330, then P-352 and
  P-361, then P-363, then yours, then P-336's writer half. P-363 changes the same write gate (it
  releases older-corpus values). Rebase onto it and keep the two releases distinct.
- Williamson 48491 republishes only under P-350; dry-run it, never write it.

### Close

Declare: the start commits and PRs, the 40-city classification table with its sources, the corpus
version, the per-county dry-run counts beside the predictions, the ledger-policy diff, the falsifiers
with both directions shown, the three-question gate answers, and `leave_behind`.
