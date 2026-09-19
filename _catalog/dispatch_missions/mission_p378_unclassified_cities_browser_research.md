## Mission — P-378: the 8 unclassified cities and Thrall, read at source with a real browser

You launch no sub-agents (FAN-DEPTH 0). This lane writes NO code and touches NO store. Its output is a
classification table, handed back as a file in your close
(`_inbox/<date>_p378-unclassified-cities_table.json` in your doc_repo worktree; the seat copies it).

**Operator ruling (2026-09-19, `_decisions/2026-09-19_unclassified_cities_research_then_declared_refusal.md`):**
this lane is option A. Whatever it cannot settle at source gets a declared refusal (option C, P-379). So a
city you cannot settle is a legitimate answer: say what was read and what would settle it. Never guess a
class to avoid that outcome. No phone calls.

### Read first

`_inbox/2026-09-19_p300-city-classification_close.json` (`unclassifiedCitiesAndWhatWouldSettleEach`, the
traps, the rule this table keeps) and `_inbox/2026-09-19_p300-city-classification_table.json` (the row
shape). Ruling 5 as amended by A-224 (`_decisions/2026-09-18_phase0_closeout_rulings.md`): each city is
classified from its OWN law into (a) zoned, layer never acquired; (b) unzoned, the ordinance sets a
city-wide line; (c) unzoned, no city-wide line; or `unclassified`. Every class but `unaccounted` is sticky
in the writer, so a wrong class freezes a wrong answer onto real parcels.

### The cities (parcels; what blocked the first lane)

- `mart-tx` 1,495 (McLennan): codepublishing.com/TX/Mart and codelibrary.amlegal.com/codes/mart answer
  403 (Cloudflare) to non-browser requests. That was never a "no code" result. TRAP: Martindale (Caldwell)
  is a different city.
- `crawford-tx` 459 (McLennan): only a 2022 utility ordinance was reachable. TRAP: Crawford, Nebraska.
- `hallsburg-tx` 335, `leroy-tx` 320, `ross-tx` 242 (McLennan): no source found; try the McLennan County
  record of each city's adopted ordinances.
- `webberville-tx` 245 (Travis/Bastrop): TRAP: Webberville, Michigan.
- `golinda-tx` 95 (McLennan): a page needs a browser read.
- `thorndale-tx` 4: lowest value; do it last.
- **`thrall-tx` 487 (Williamson), class (b), row not coded:** read the CURRENT city-wide setback text. The
  packet is an image-only scan with more than one amendment to Ordinance 2009-1501 (the side line moved
  from 5 ft to 10 ft; a later amendment added minimum square footage). MOST-CURRENT SOURCE WINS: find the
  amendment in force, with its adoption and effective dates, and the exact values (front, side, rear,
  corner street side) with the verbatim text. This is the input a corpus row will be coded from; do not
  code it.

### Method

Use a real browser (an MCP browser tool, Playwright, or equivalent) where a host blocks plain requests.
Record, for each read: the URL, the date read, the section, and a verbatim quote of the decisive text.
Pre-register per city, before you read, what reading would put it in each class. A search summary is not
a source; a planning commission's existence is not a zoning ordinance; a parcel's district code is not
evidence.

### Close

Declare: the table's path; per city its class (or `unclassified`) with its source; for Thrall the values
in force with the amendment and its dates and the verbatim text; the parcel totals per class; the cities
still unsettled and exactly what would settle each (these become P-379's declared refusals); and
`leave_behind`.
