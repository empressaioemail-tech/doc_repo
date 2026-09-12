## Mission — P-154 MOST-CURRENT: one setback resolver, date read at source, everywhere

You are the deepest worker in OPS-23 wave 3. You do not spawn sub-agents. The dispatch
planner supervises you, reviews your design at CP1 and your first pilot at CP2, and runs the
surface probe itself; your own runs are evidence, not the close.

Exit-bounded verification: every command you run must terminate on its own; wrap anything
that could hang in `timeout`; never leave a watch, a tail or a dev server running. Factory
data jobs run through the factory's Cloud Run jobs on staging first, then production; never
from a laptop.

### Where you work

Three repos, property seat, registered in `_catalog/seat_register.json`; the corpus package is
the substrate seat's and you request its change through the close unless the planner grants
the substrate worktree:

- `empressaioemail-tech/legacy-design-tools`, worktree `P:/seat-worktrees/property/legacy-design-tools-p154-most-current`, branch `feat/p154-most-current-setback-resolver`.
- `empressaioemail-tech/hauska-engine`, worktree `P:/seat-worktrees/property/hauska-engine-p154-most-current`, branch `feat/p154-most-current-adapter`.
- `empressaioemail-tech/hauska-factory`, worktree `P:/seat-worktrees/property/hauska-factory-p154-most-current`, branch `feat/p154-most-current-writer`.

Create each from `origin/main` and declare the start commit. Other people's checkouts are
never built in. P-152 lane 3 runs beside you in hauska-map and hauska-engine (the panel's
setback rail and the report composer); you do not touch hauska-map, and the two of you
share `hauska-engine-api` deploys under the planner's lease.

### The ruling you are implementing

R-1 (`_decisions/2026-09-11_setback_source_most_current_wins.md`): for setbacks and every
dimensional rule, in every city and county, the source with the most recent effective date
supplies the value; tier breaks ties only on equal or unreadable dates; dates are read at
source (ordinance effective date, ArcGIS `editingInfo.lastEditDate`), never assumed from source
kind; an unreadable date produces a conflict row with both values, never a silent pick. OPS-16
P-154; the first rail family through the one rule.

### What is true today, verified 2026-09-12 (`_inbox/2026-09-12_ops23_wave3_verify_p154.md`, LDT `78ad8a51`, engine `99f9146`, factory `7a94ae5`, corpus `b8020c8`, npm 1.1.0)

Five producers of setbacks for `48021:34049` (SF-1, Bastrop), and no producer reads a date:

- **LDT `artifacts/api-server/src/lib/buildableEnvelope/authoritativeSetbackSource.ts`** ranks
  TIER first (`TIER_RANK` 57-61: codified-ordinance 3, gis-per-parcel 2, atom-chain 1) and
  uses date only as a tiebreaker (148-156). It ranks exactly two candidates (182-219): the
  codified table row from `getSetbackTableForZoning` and the atom-chain `setbackRule`. The
  table date is `effectiveDate`, else an `accessed` note, else `1970-01-01` (84-93); the atom
  date is `extractedAt ?? sourceVintage` (140-146), and `extractedAt` is EMIT time (engine
  `emit-setback-rule.ts:141`), not a source date. Layer 23 is recognised only by adapter
  string (131); layer 83 is not fetched. LDT vendors its own table JSON
  (`lib/adapters/src/local/setbacks/`, `bastrop-development-code.json` `effectiveDate
  2026-04-14`, SF-1 30/30/10/20 front/rear/side/corner) and does not import the corpus
  package. The envelope endpoint (`routes/brokeragePlaceBuildableEnvelope.ts:1171-1175`) and
  the draw model print 30/10/30/20 because tier 3 wins, not because of any date.
- **hauska-map `api/_lib/atom-chain-to-facets.ts`**: for a Bastrop city parcel any rule whose
  adapter is not `bastrop-per-parcel-record-layer-23` is stale (92, 120, 141, 155); the
  atom-chain rule wins when present (1838), else the codified path; `pe-property-atoms.ts:602-621`
  fetches layer 23 live when the chain lacks a rule. No date read. The panel prints 25/5/25/15.
  This path is P-152 lane 3's to replace with the reader; you do not touch it.
- **hauska-engine `packages/adapters`** pins `@empressaio/setback-corpus ^1.1.0` and builds
  `SETBACK_TABLES` from it (`src/local/setbacks/index.ts:26,61-71`, `corpus-divergence.test.ts`).
  Bastrop precedence (`index.ts:175-199`): a supplied per-parcel record wins; without one, city
  BDC codes return null ("R13: city BDC districts require layer-23 per-parcel record").
  `bastrop-setback-currency.ts:7-9,68-69`: any non-layer-23 Bastrop rule is stale, fail-closed.
  `bastrop-per-parcel-record.ts` reads layer 23 (22-23), hard-codes the layer-83 conflict text
  (459-465), cites `Parcels_One_Click/FeatureServer/83` (456-457), WHICH DOES NOT EXIST (the
  service answers "layer 83 not found"; the live Revisions layer is
  `Zoned_Parcels/FeatureServer/83`), and requests outField `Ordinance_Link` (606) while the
  live layer carries `Ordinance_` only, so the engine's ordinance citation reads empty. The
  engine prints 25/5/25/15 with 30/10/30/20 as a disclosure string.
- **hauska-setback-corpus** `src/setbacks/bastrop-development-code.json` (b8020c8): "Bastrop
  Development Code / Ord. 2026-06", `effectiveDate: "2026-04-14"`, SF-1 30/30/10/20,
  `citation_url` the ordinance PDF, per-field `verification_state: "human-verified"`. Package
  1.1.0 on `origin/main` and on npm (published 2026-09-07). The field is
  `verification_state`, not `verificationTier`.
- **hauska-factory `src/jobs/parcel-setback-cells.mjs`** (writer `f11-setback`) ports LDT's
  routing, reads the corpus at `CORPUS_VERSION = "1.1.0"` (`setback-table-router.mjs:40`),
  maps Bastrop to `bastrop-development-code` (130); cells carry `value, jurisdictionKey,
  resolvedTableKey, source, vintage` (282-299); the companion row carries `effectiveDate =
  table.effectiveDate` (305-314); `vintage` is RUN time (414). The ledger's Bastrop SF-1 cells
  read 30/10/30/20 with `effectiveDate 2026-04-14`; the MCP prints them.

The dates, read at source on 2026-09-12:

| Source | Date at source | SF-1 values for `48021:34049` |
|---|---|---|
| Ordinance 2026-06 (the corpus `citation_url`, 236 pages) | passed on second reading 14 April 2026, effective on passage | 30 / 10 / 30 / corner 20 (p. 12, Sec. 14.02.003) |
| Layer 83 `Zoned_Parcels_Revisions_Clip`, `Zoned_Parcels/FeatureServer/83` | `lastEditDate` 2026-07-23T22:03:59Z | 30 / 10 / 30 / corner 20 |
| Layer 23 `Parcel_OneClick_Join`, `Parcels_One_Click/FeatureServer/23` | `editingInfo.lastEditDate` 2026-09-10T20:24:43Z; `dataLastEditDate` 2026-08-24T18:58:10Z; row `LASTUPDATE` null; row `Ordinance_` "2019-51" | 25 / 5 / 25 / corner 15 |

Layer 23's row carries the newest layer edit stamp and cites the OLDER ordinance. Whether the
2026-08-24 edit touched this row is unreadable from the service. This is the conflict-row case
the ruling names, and it is what the resolver must handle without a silent pick.

### The change

1. **One resolver, in one place.** The rule lives once, as a module the engine adapter and
   the factory writer both import, with LDT's `authoritativeSetbackSource.ts` reduced to a
   caller. The natural home is the corpus package (`@empressaio/setback-corpus`, substrate
   seat) as a `resolve` subpath beside the tables; if the planner cannot grant the substrate
   worktree this wave, put the module in hauska-engine `packages/adapters` and have the factory
   consume it through the engine module it already pins, and say so. Never a third copy.
2. **The rule, as code.** Each candidate carries a `sourceDate` read at source and a
   `dateBasis` naming how: an ordinance or corpus table by its `effectiveDate`; a per-parcel
   GIS row by the effective date of the ordinance the ROW cites when that citation resolves to
   a known ordinance, else by the layer's `dataLastEditDate` (never `editingInfo.lastEditDate`,
   which stamps schema edits too), with `dateBasis` saying which; an atom by its
   `sourceVintage`, never `extractedAt`. The most recent `sourceDate` wins. Tier breaks a tie
   only when dates are equal or a candidate's date is unreadable. When the winner disagrees on
   any value with a candidate whose date is unreadable, or when two candidates within the same
   `dateBasis` class disagree on dates the service cannot attribute to the row, the result is a
   CONFLICT carrying every candidate with its value, source and date, and no single value.
   For `48021:34049` this yields 30/10/30/20 with `2026-04-14` (the row's own citation, 2019-51,
   dates it earlier than the ordinance), and the layer-23 row is recorded as superseded with
   its date and citation; the conflict row fires only if the row's citation is absent or
   unresolvable.
3. **Dates travel.** The corpus tables gain per-source date fields where they are missing
   (`bastrop-tx.json` has none; `bastrop-city-tx.json` has only an accessed note); the factory
   cell carries `sourceDate` and `dateBasis` beside `vintage` (run time stays run time, named
   as such); the companion row carries the full candidate set when the result is a conflict.
4. **The engine's dead reads.** `bastrop-per-parcel-record.ts`: the layer-83 URL becomes the
   live `Zoned_Parcels/FeatureServer/83` (read its `f=json` and quote it), and the outField
   `Ordinance_Link` becomes `Ordinance_` (the field the layer carries). Both are the kind of
   read that returns empty and passes; add the test that fails if the field list and the
   service disagree.
5. **Re-run the Bastrop setback cells under the rule** through the factory's job on staging,
   then production, and paste the per-cell diff for the probe parcels: for `48021:34049` and
   `48021:33223` the values must be unchanged (30/10/30/20 already) and the new `sourceDate`
   and `dateBasis` present; report how many Bastrop cells changed value, with the denominator.
6. **Record the evidence.** The three Bastrop dates above, with the URLs and the fields read,
   go into `_decisions/2026-09-11_setback_source_most_current_wins.md` under an "Evidence"
   heading by the overseer; you paste them in the close in that shape.

### What this lane does not do

Touch hauska-map (the panel's setback rail moves to the reader in P-152 lane 3, which is
what makes the panel print the ledger's value); touch the entitlement or pricing surface;
change any Bastrop value by hand; rank by source kind anywhere.

### Verification, and the falsifier you pre-register

Write down at CP1 before any code: *if after this lane and P-152 lane 3 the four surfaces
(panel facets, `get_smart_site`, the feasibility PDF, the envelope endpoint) print different
setbacks or different dates for `48021:34049`, or any of them prints a value without a
`sourceDate`, the row is not done; and if the resolver picks a value for a parcel whose
candidates disagree and whose dates are unreadable, it is a silent pick and the change is
wrong.* Non-vacuity: a test with two candidates that differ by date where the LOWER tier is
newer, proving the newer one wins; a test where dates are equal, proving tier breaks it; a
test with an unreadable date, proving a conflict row and no value.

The planner runs `node scripts/surface-probe.mjs --rows P-154 --observations <file>`: the
P-154 predicate compares the panel's setbacks (machine) with the envelope endpoint (machine),
`get_smart_site` (`mcpSetbacks`, operator) and the PDF's setbacks (`pdfSetbacks`, lane) for
`48021:34049` and `48021:33223`, plus `setbackSourceDate` on each; all four equal, or all four
show the conflict row, is PASS.

### Close

`_inbox/<date>_p154-most-current_close.json` per AGENT_CONTRACT §6 plus the OPS-23 four
fields. `leave_behind`: where the resolver lives and who imports it; LDT's repoint state (it
still vendors its table JSON and does not import the corpus; if you did not repoint it, say
so and name the row); the corpus version published; the Bastrop cell diff counts.
