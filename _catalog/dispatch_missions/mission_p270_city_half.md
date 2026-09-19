## Mission — P-270, city half: the address line names the city the ledger licenses

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-map` and `legacy-design-tools`, one PR per
repo from current `origin/main` with the SHA declared (map `b08f4b89`, LDT `2e7ca7c4` at compile). You
do not merge or deploy; the integration seat does.

P-270's address half shipped (map #424, LDT #721; live on Property Explorer `fohg2os70` and cortex-api
`00843-yir`). Read `_inbox/2026-09-18_p270-address-half_close.json` and
`_inbox/2026-09-18_wave2_deploys_RECORD.md` section 1 first.

### What is wrong (measured live, 2026-09-18)

The ZIP now reaches the line; the city does not. The probe's `X2-address` row opens on 11 of 40
subjects (`_inbox/2026-09-18_221332_surface_probe.json`, `ops24.ledger`), and they are two classes:

- **Four drop a licensed city from a line that exists** (this row): `48453:445501` "21404 GRAND
  NATIONAL AVE, TX 78660" (Pflugerville), `48453:157574` "308 CARGILL DR, TX 78669" (Briarcliff),
  `48453:959606` "18529 SPOTTED EAGLE LN, TX 78621" (Elgin), `48453:941831` "14413 PRAIRIE SOD LN, TX
  78621" (Elgin).
- **Seven serve no composed address at all** (`48021:51735`, `48021:70907`, `48021:13722`,
  `48309:342715`, `48453:855924`, `48453:352594`, `48055:21992`). That is the absent-situs class the
  ledger counts as X6/XD-7; name it in your close and do not build it here.

**Why the city is missing.** map `pe-record-to-facets.ts` `composeBaseFactsSitus` licenses the
city-limits city only when the RECORD-served `situsCity` cell is `absent-verified`. On these parcels the
record reader serves `situsZip`, `situsCity` and `situsState` as `legacy-transitional`, not `record`
(read on `48453:445501`: `recordRailStates`), so the licence never fires. Yet the payload's
`baseFacts.situsCity` carries the same verdict from the bake: an object with
`verdict: "absent-verified"`, its authority the county's CAD roll, and `cityLimitsFact` (served from the
record) names the incorporated city. The ZIP on the line came from the bake too
(`mergeBakedBaseFacts`), not from the ledger rail.

### What to build

1. **Decide the licence and say why.** Either the fallback also accepts the payload's own
   `absent-verified` declaration of the roll's situs city (whatever path served it), or the three situs
   rails are cut over to the record path. The first is local; the second is a ledger decision. State
   which, and what the other would have needed. Whichever you choose, a city is still named only as "the
   city whose limits contain this parcel" (`situsCityBasis: "city-limits"`), and only for an
   incorporated `cityLimits` answer.
2. **Every composing path carries the label.** The fact-sheet path adds the provenance note; the baked
   card-model path (`baked-facets.ts` `deriveBakedCardModel`) composes the line without it (a finding
   from the seat's review). Make both say it.
3. **The MCP label.** LDT `smartSiteStub.ts` reads `baseFacts.situsCity` only as a string, so the same
   declaration leaves the MCP label without a city. Apply the same licence there.
4. **A shared rule, pinned.** The composer now exists in map, LDT and the probe. If P-331 has merged its
   cross-repo pins, add this rule to them; if not, name the three copies.

### Verify by violation

Pre-register your falsifiers: the four parcels carry their city after the change and did not before; a
parcel whose roll names a city keeps the roll's city (never the city-limits city); an unincorporated
parcel with no roll city names no city; a `legacy-transitional` rail with NO absent-verified declaration
names no city. Grade after deploy with `node --use-system-ca scripts/surface-probe.mjs --rows
P-270,P-254 --mcp-sign-in` (the operator signs in): `X2-address` must read closed on the four.

### The three-question gate

What executes the licence, what triggers it, what fails when an unlicensed city is named, and what
bypasses it (a surface composing its own line; the PDF, which this row does not touch).

### Constraints

- No merges, no deploys. Never invent a city or a ZIP; never present a city-limits city as the roll's
  mailing city.

### Close

Declare: the start commits and PRs, the licence decision with its reason, the falsifiers with both
directions shown, the three-question gate answers, and `leave_behind`.
