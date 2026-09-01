# Mission — zoning for every city in the six counties, ingested and baked

## Why this card exists

**The setback engine is only as good as the zoning under it.** Today Hays and Williamson
are **100 percent placeholder** setback rules out of 188,103 placeholder atoms, and
McLennan carries **65,814 envelopes derived from zero setback rules**. Setbacks, edges and
envelope all inherit their scope from zoning. Without accurate zoning per city, every
downstream calculation is arithmetic over nothing.

The roadmap names this as an orphan in its own words: *"zoning stamps and roads have no
home in any collect card"* and *"need a home — absent from the collect card entirely."*
This card is that home.

**Zoning is a bulk ingest of public record into the pipeline.** It is not a user-level
reasoning task and it is not derived from CAD or land use. The eCode360 partnership was
retired 2026-08-04 in favour of acquiring zoning as public record by scrape or citizen
portal; that ruling stands and applies here.

## Step 1: establish per-city truth, because nobody currently knows it

**Enumerate every city in the six counties from the roster** — roughly 72 territory-touching,
69 primary — and for each one report, from the store: is a zoning layer ingested, from what
source, at what vintage, with how many features, and does any parcel in that city actually
serve a `zoning.district`.

**Report presence per city, never a coverage percentage.** Two reasons, both measured:

- The ledger measures **whether a scorer ran**, not whether data exists. Travis **serves
  zoning live** while the ledger scores it 0.00 percent. Written, served and scored-zero is
  a real state, so read the store rather than the ledger.
- Low coverage means a **stamp gap, not missing data**. A percentage conflates "we never
  acquired it" with "we have it and never stamped it", and those need opposite fixes.

**The denominator is in-city parcels, not all parcels.** Counties do not zone unincorporated
land, so unincorporated is `not-applicable` and is not a gap. A percentage over all parcels
will read as failure where the truth is structural.

Output a per-city table: city, county, in-city parcels, layer present, source, vintage,
features, parcels serving a district. **That table is the deliverable of step 1** and it
sizes everything after it.

## Step 2: one city end to end, before any wave

Pick one city with **no** zoning layer and take it all the way: acquire, ingest, stamp, bake,
and confirm a parcel in that city serves the right district and a setback derived from a
real rule rather than a placeholder.

**Do not scope a wave before this completes.** The L2 acquisition work found five blockers
serially, each only visible after the previous one cleared, because scope was set before one
unit had run end to end. Expect the same here and find them on one city rather than on
seventy.

Report every blocker you hit, including the ones you solve, because the next city inherits
them.

## Step 3: only then, size the wave

With step 1's table and step 2's blocker list, say what the remaining cities cost and in
what order. Do not run them on this card.

## Mechanics already established — use them, do not reinvent

Stamping goes through the `ZONING_LAYERS` config plus the stamp CLI, same-DB, **dry-run
first**, and the match contract is leading-token. Read that path before writing anything
new.

`Tier1FacetPayload.zoning` already declares `district`, `jurisdictionKey` and `provenance`,
and the envelope facet declares `citationUrl` and `disclosure`. **The shape exists.** This
card fills it; it does not redesign it.

## Distinguish a real rule from a placeholder, everywhere

188,103 `setback-rule` atoms are placeholders under `storage-port-proof/phase-1a`. A count
that does not separate them will report coverage that is not there.

**Every number in your close states whether it counts real rules, placeholders, or both.**
A city whose parcels serve a district but whose setback rule is a placeholder is not done,
and reporting it as done is the failure this card exists to prevent.

## Store discipline

`cortex-prod` holds `hauska_mcp` and `neondb` on one compute. Take the store token, one
heavy operation at a time, and never inside a Tuesday 05:00 to 06:00 UTC Neon maintenance
window.

Landmines that return confident wrong answers: the atoms store is database **`hauska_mcp`**,
not `neondb`; factory `runs.status` is `success`, not `succeeded`; `landing.method` is `ring`
on every persist row; a county's latest factory success may be a `persist:false` measure run;
and **`jurisdiction_tenant` is not a FIPS scope**, so scope by half-open `entity_id` ranges.

## Do not

- Do not derive zoning from CAD, land use, or any inference. It is acquired public record.
- Do not report a coverage percentage in place of per-city presence.
- Do not count unincorporated parcels as a zoning gap.
- Do not count placeholder setback rules as coverage.
- Do not scope or run a multi-city wave on this card.
- Do not trust the ledger for whether zoning exists; read the store.
- Do not re-run acquisition for a city that already has a current layer.
- Do not touch any repository other than the registered worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare snapshot
and `current_database()` in the first output. Report the per-city table, the one city taken
end to end with every blocker encountered, whether its served setback derives from a real
rule or a placeholder, and the sized order for the remaining cities. Name what contradicted
this card, or say plainly that nothing did. `leave_behind` named. Subagents do not commit.
