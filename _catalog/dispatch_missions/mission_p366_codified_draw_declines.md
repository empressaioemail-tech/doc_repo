## Mission — P-366: the drawing route sees the zoning the card sees

You launch no sub-agents (FAN-DEPTH 0). You build in `legacy-design-tools` (the
`place/buildable-envelope` route) and open one PR from current `origin/main` with the SHA declared
(`2e7ca7c4` at compile). If the fix belongs in a data store rather than the route, report that and
stop. You do not merge, deploy or write any store; the integration seat does.

### What is wrong (measured, `_inbox/2026-09-18_221332_surface_probe.json`)

Seven P-254 buckets FAIL on "a codified district must draw". The card serves a zoning district and
jurisdiction for each parcel; the drawing route (`POST
/api/brokerage/v1/place/buildable-envelope`, keyed by the composed address or the record point)
declines. The 7 did the same at the 15:58Z run of record, so this predates tonight's deploys.

| Parcel | Bucket | Card: district, jurisdiction | Route answered |
|---|---|---|---|
| `48453:482441` | Travis, Round Rock part | SF2, round-rock-tx | declined `no-zoning-stamp` |
| `48453:812200` | Travis, Leander part | SFS, leander-tx | declined `no-zoning-stamp` |
| `48453:523600` | Travis, Cedar Park part | SU, cedar-park-tx | declined `no-zoning-stamp` |
| `48453:352594` | Travis, Buda part | R2, buda-tx | declined `no-zoning-stamp` (record point) |
| `48209:150937` | Hays, Austin part | SF-2, austin-tx | declined `no-zoning-stamp` |
| `48209:145880` | Hays, Kyle | R-1-A, kyle-tx | `geometry-validation-failed` (labelEdges+derive) |
| `48055:40428` | Caldwell, San Marcos part | P, san-marcos-tx | `no-parcel` |

Five of seven are one class: the route cannot see a zoning stamp the card serves. **All five are the
minority-county part of a city that lies mostly in another county:** Round Rock, Leander and Cedar Park
(mostly Williamson) in Travis; Buda (mostly Hays) in Travis; Austin (mostly Travis) in Hays. That points
at a stamp keyed or scoped by the city's home county, or read from a source loaded per county, while the
card's ledger rail carries the district for the parcel's own county. Test that reading first; do not
assume it.

### What to build

1. **Per parcel, name each side's zoning source.** Where the card's district comes from (the ledger's
   zoning rail, the atom chain, the bake) and where the route looks for its stamp (which table, which
   key), and why the route misses. A table, before any code.
2. **Fix the `no-zoning-stamp` class at its cause.** The ledger is the serving path and atoms are
   canonical (`_decisions` on the serving path, OPS-23). If the route reads an older or narrower stamp
   source, make it read the stamp the ledger serves. If the stamp is genuinely absent where the route
   reads and present only in a bake, say so and stop on that parcel rather than inventing one.
3. **Kyle's `geometry-validation-failed`.** Say which validation fails and whether it is the parcel
   ring, the edge labelling or the inset. A real geometry defect in the source is a finding; a
   validation that refuses a valid ring is a bug to fix.
4. **San Marcos-in-Caldwell's `no-parcel`.** The route could not match the composed address to a
   parcel. Say why (a county-boundary city part, a keyspace, the address itself) and fix or name it.
5. **A decline stays honest.** Where the route legitimately cannot draw, it keeps a named reason; this
   row never makes the route draw without the inputs a draw needs.

### Verify by violation

Pre-register your falsifiers: the five `no-zoning-stamp` parcels draw after the change and declined
before; a parcel with no district anywhere still declines with its reason; the Kyle and San Marcos cases
each either draw or carry a named, true reason. Grade after deploy with `node --use-system-ca
scripts/surface-probe.mjs --rows P-254` (doc_repo): the 7 buckets must not fail on the draw.

### The three-question gate

What executes the route's zoning read, what triggers it, what fails when the route and the card disagree
on a parcel's district, and what bypasses it (a surface drawing from its own source; the bake).

### Constraints

- No merges, no deploys, no store writes. P-340 (card and route setback tables) and P-339's MCP half run
  in parallel in LDT; keep to the route's zoning read and parcel match, and rebase if they land first.

### Close

Declare: the start commit and PR, the per-parcel source table, the fix per class, the falsifiers with
both directions shown, the three-question gate answers, and `leave_behind`.
