## Mission — P-225: which zoning districts have a codified setback row, and which draw nothing

### The finding you are acting on

Measured live on production 2026-09-15, Bastrop, by discrimination across six adjacent Old
Town parcels:

```
48021:34873  SF-1   POST buildable-envelope -> 200, real Polygon      envelope DRAWS
48021:34849  GC     -> 404 "No authoritative setback source covers this district"
48021:34833  GC     -> 404          48021:35017  GC  -> 404
48021:34769  GC     -> 404          48021:34825  MU  -> 404
```

An uncodified district returns `404 no-district` and **no buildable envelope is drawn at
all**. The customer sees an empty map with no explanation of why.

Cause, read in the write path rather than inferred from output:
`getSetbackTableForZoning` (lib/adapters/src/local/setbacks/index.ts) routes every known BDC
district to `bastrop-development-code`, which carries only SF-1/SF-2/SF-3/RR. `mapDistrict`
then falls through to `fallback-conservative`, and `resolveAuthoritativeSetbacks`
(artifacts/api-server/src/lib/buildableEnvelope/authoritativeSetbackSource.ts) returns null.

**The part that matters most.** The atom chain HOLDS usable GC setbacks — 20/5/20 from GIS
layer 23, served today by the facets route — and the resolver can never reach them, because
the atom candidate list is built AFTER the codified-table gate returns null. Capability
present, control order makes it unreachable. That is the documented Bastrop parcel-node class
repeating in a different file.

### What this row is

**A census, not a build.** Enumerate EVERY zoning district in EVERY city across the six
onboarded counties and record, per district, whether a codified setback row exists. The
point is to make the gap countable instead of discovered one parcel at a time by a customer.

For each district: the jurisdiction key it resolves to, the table it routes to, whether a row
exists, and — where no row exists — a disposition from exactly three: **acquire** (a real
codified source exists and should be added), **serve from the atom chain** (a usable
per-parcel value already exists and the gate order is what blocks it), or **ruled out of
scope** (with the reason).

### Done looks like

A per-district codified/uncodified census covering all six counties, each uncodified district
carrying one of the three dispositions, and the census naming the instrument that produced it
so it can be re-run. Plus a count: how many districts, and how many parcels behind them, are
currently unable to draw an envelope. The parcel count is the number that tells the operator
how much of the product is dark.

### Falsifiers, pre-register your answers before you run anything

1. If your census says a district is codified, pick one of its parcels and confirm the live
   derive returns a Polygon. If it 404s, your census is measuring the table and not the
   serve, and it is wrong.
2. If your census says a district is uncodified, confirm the live derive 404s for one of its
   parcels. If it draws, something else is resolving it and your model of the path is
   incomplete.
3. If the six counties' district lists come out suspiciously round, or a county returns zero
   uncodified districts, suspect your enumeration before believing it.

### Known traps

- **Do not fix this by widening a table.** Adding a setback row with a value you did not read
  from a real codified source is fabrication, and it converts an honest refusal into a
  confident wrong answer a customer can act on to their own detriment. NO setback value is
  invented in this row. NO setback value is changed in this row.
- **`district_name` matching takes the FIRST TOKEN.** `C-2 General Commercial` matches code
  `C-2`, never `GC`. Two districts that mean the same thing in prose are different codes to
  this resolver. Do not assume a semantic match is a resolver match.
- The setback resolver ranks date-first through `@empressaio/setback-corpus/resolve` (R-1,
  most-current-source-wins). A district can have a row and still resolve oddly. Record what
  you observe.
- Never pipe an enumeration through `tail`. It truncates silently and a zero reads as
  "nothing is wrong".

### Do not

- Do not change any setback value, add any table row, or edit any jurisdiction mapping.
- Do not reorder the resolver's gate. That is the fix, it is real, and it belongs to a
  follow-on row this census will scope — not to the census.
- Do not deploy. Merging to legacy-design-tools main does NOT auto-deploy (push builds an
  image only), but deploys are planner-owned regardless.
- Do not spawn sub-agents that themselves spawn sub-agents. You own your fan.

### Close

Close to `_inbox/` on doc_repo main and PUSH it, with the census as a committed artifact
rather than prose in the close. Declare `leave_behind` explicitly. State your snapshot
(repo, branch, commit).
