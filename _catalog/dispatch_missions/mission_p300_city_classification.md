## Mission — P-300, city classification: the remaining 19 cities, classified at source

You launch no sub-agents (FAN-DEPTH 0). This lane writes NO code and touches NO store. Its only output is
a classification table, handed back as a file in your close (`_inbox/<date>_p300-city-classification_table.json`
in your doc_repo worktree; the seat copies it). You do not merge, deploy or write anything else.

This is the research half of the P-300/P-338 writer, split out on the first writer lane's own
recommendation. Read, in order: `_inbox/2026-09-18_p300-p338-setback-residual-writer_close.json`
(`whyThisIsAPartialCloseRatherThanAFinish`, `leave_behind`, `recommendedNextLaneShape`) and
`_inbox/2026-09-18_p300-p338-setback-residual-writer_city-classification.json` (the 21 cities already
classified, and the rule this table keeps).

### The rule, and why it has teeth

Ruling 5 as amended by A-224 (`_decisions/2026-09-18_phase0_closeout_rulings.md`): each no-layer city is
classified from its OWN law into exactly one of (a) zoned, layer never acquired; (b) unzoned, the
ordinance sets a city-wide line; (c) unzoned, no city-wide line. A class is a claim about what a city's
own ordinance says: never inferred from a search summary, and never from a parcel carrying a district
code. `unclassified` is a legitimate answer. The reason this matters more than usual: the setback writer
releases only `unaccounted` cells, so every cell written as refused, absent-verified or a default value
is permanent. A city wrongly classed (b) freezes a fabricated line onto real parcels.

### The 19 cities

**Six unresolved by the first lane** (parcels, county, blocker):

- `thrall-tx` 487, Williamson: **read this one first.** It is the only city whose evidence points away
  from (a): development standards (setbacks, minimum living space) with no published district list or
  zoning map. It may be (b) or (c).
- `mart-tx` 1,495, McLennan: every search result is Martindale (Caldwell), a different city. Needs a
  direct read of Mart's code or a call to Mart City Hall.
- `granger-tx` 784, Williamson: a Planning and Zoning Commission exists (implies zoning), no ordinance
  text located. Probable (a); do not act on "probable".
- `crawford-tx` 459, McLennan, and `creedmoor-tx` 335, Travis: search returns a same-named city in
  another state.
- `hallsburg-tx` 335, McLennan: no ordinance located; one real-estate field says "Zoning: R",
  unconfirmed.

**Thirteen not yet examined** (parcels): leroy 320, coupland 302, san-leanna 288, mountain-city 249,
webberville 245, ross 242, weir 214, bear-creek 195, hays 117, golinda 95, valley-mills 41, thorndale 4,
staples 1.

### What to produce

One row per city, in the first lane's table shape: the class (a/b/c) or `unclassified`, the ordinance
section read, its URL, the date read, and a quote carrying the decisive text. For (b), the line's values
with their section. For (c), what was read that sets no city-wide line. A phone call counts as a source
only if you record who, when and what was said, and it is marked as such. A city you cannot classify
at source stays `unclassified`, named, with what would settle it.

### Verify

Pre-register, per city, what reading would make you choose each class, before you read. Report any city
whose class differs from what the first lane expected (Granger, Hallsburg) and why.

### Constraints

- No code, no store access, no guessing. A search summary is not a source. Martindale's districts must
  never be attributed to Mart.
- The writer build (P-300/P-338, a separate dispatch) waits for this table.

### Close

Declare: the table's path, the per-city classes with their sources, the cities left `unclassified` and
what would settle each, the parcel totals per class across all 40 cities (this lane's 19 plus the first
lane's 21), reconciled to BOTH of the first lane's denominators: 49,855 parcels in no-ruled-table cities
(what the 40 rows sum to) and 48,829 in P-300's own population, with the 1,026-parcel gap explained
(the first lane's table and P-326's measurement name Woodcreek), and `leave_behind`.
