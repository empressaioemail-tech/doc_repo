# Mission — eight cities already have zoning layers and are not stamped

## Free coverage, no acquisition

`ZONING-INGEST` measured the store: 72 unique cities, 23 with a real staging layer, 49 with
none. **Six of the 23 have a layer and effectively zero in-city stamps**, and two more are
partially stamped:

| city | staged features | in-city parcels | stamps |
|---|---|---|---|
| Smithville | 91 | 2,406 | 0 |
| Luling | 140 | 2,898 | 0 |
| Martindale | 17 | 618 | 0 |
| Woodcreek | 3,165 | 1,030 | 0 |
| Lakeway | 749 | 8,259 | 0 |
| Robinson | 6,340 | — | 2, both Waco bleed |
| Leander (48491) | — | 26,587 | 2,150 |
| Taylor | — | 8,541 | 2,576 |

**A stamp gap is the opposite fix from an acquire gap**, and these are stamp gaps. Nothing
here needs a portal, a scrape or a partnership. This is step 2 of the parcel-record ruling —
ingest what we already have — and it is the cheapest coverage on the board.

## The repo is LDT, not engine

Blocker B1 from `ZONING-INGEST`: **the stamp CLI and `ZONING_LAYERS` live in
`legacy-design-tools`**, not `hauska-engine`. That is why this card targets LDT.

Mechanics already established: a `ZONING_LAYERS` config row per city, the stamp CLI, same-DB,
**dry-run first**, leading-token match contract. Read that path before writing anything.

## Robinson is not like the others

Robinson has 6,340 staged features and exactly **2 stamps, both Waco bleed**. It needs its
own layer wired **and** the bleed stopped. Do not count a Waco stamp on a Robinson parcel as
coverage.

Foreign-jurisdiction bleed is a broader defect (B6) and this card is where it first has to be
handled: Bellmead, Beverly Hills, Hewitt, Woodway and Robinson serve `waco_tx`; Bee Cave,
Manor, Rollingwood, Sunset Valley and West Lake Hills serve `austin_tx`; a Round Rock 48453
sliver serves `pflugerville_tx`.

**Report all the bleed you find. Fix it only for the cities on this card** — the rest is a
separate card and mixing them makes neither reviewable.

## A served district is not a finished city

**Smithville needs its own ratified setback table.** Bastrop-city BDC rules are **not**
Smithville rules, and applying them would be a fabricated authority.

Across the program, 188,103 `setback-rule` atoms are placeholders under
`storage-port-proof/phase-1a`; Hays and Williamson are 100 percent placeholder and cannot
satisfy a real-rule setback without minting new atoms, which is frozen and out of scope here.

So the honest close for a Band 1 city is: **district served from a real layer, setback state
stated honestly.** A placeholder-derived setback is not a `value`. Say which of the eight
reach a real rule and which serve a district over a placeholder.

## Verify

Per city: in-city parcels, stamps before and after, and a named sample parcel serving the
right district from the **right jurisdiction**. A stamp that serves a neighbour's district is
a defect, not coverage.

Then the bake. Blocker B2 says the bake is a county-wide Factory publish rather than
city-scoped, so say what that costs for eight cities across four counties and whether it
should be batched by county.

## Do not

- Do not acquire anything. Every city here already has a layer.
- Do not re-acquire Austin, Bastrop, Elgin, Waco or Pflugerville.
- Do not apply Bastrop-city setback rules to Smithville or any other city.
- Do not count a placeholder-derived setback as a value.
- Do not count a foreign-jurisdiction stamp as coverage.
- Do not fix bleed for cities outside this card.
- Do not mint setback-rule atoms.
- Do not touch any repository other than the registered LDT worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare snapshot in
the first output. Report per-city stamps before and after with a named sample parcel and its
jurisdiction, which cities reach a real setback rule versus a placeholder, the bleed found
and what you fixed, and the bake cost for eight cities across four counties. Name what
contradicted this card, or say plainly that nothing did. `leave_behind` named. Subagents do
not commit.
