CANON-PREAMBLE v9e22f2c4
- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HOLD LIFTED 2026-08-26 for the Factory program (`_decisions/2026-08-26_factory_program_and_hold_lifts.md`); the Bastrop QA condition is cosmetic and does not gate the data path. NO PRIVILEGED DATA and the Hauska spine rule stand.
- THE FACTORY IS THE ONLY WRITER PATH (OPS-19) — one machine built to the MODEL LAW (`19_the_instrument_contract.md`, `_blueprint/10_model.md`, `_blueprint/20_pipeline.md`, `_blueprint/40_rule_register.md`, `51_ingestion_pipeline_reference.md`, `24_instrument_conformance_program.md`; package `dist/*.d.ts` is the tiebreaker); own repo `hauska-factory`, own Neon store; every publish lands on staging before the identical job runs on production; nothing reaches a serving store except through publish; laptop ingest is FROZEN (`_decisions/2026-08-26_ingest_freeze_and_cloud_loader.md`); OPTION A ruled (`_decisions/2026-08-26_factory_model_law_and_option_a.md`): no new county is written on the old shape and old-shape writes ended permanently 2026-08-27. Every lane has its own registered worktree; never build in another lane's checkout. Row-level status lives in `_catalog/program_preambles/OPS-19.md` and `_state/property/STATE.md`, never here.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- MOST-CURRENT SOURCE WINS (operator 2026-09-11) — for setbacks and every dimensional rule, in every city and county, the source with the most recent effective date supplies the value; tier breaks ties only on equal or unreadable dates; dates are read at source (ordinance effective date, ArcGIS `editingInfo.lastEditDate`), never assumed from source kind; an unreadable date produces a conflict row with both values, never a silent pick. Supersedes tier-first ranking in LDT `authoritativeSetbackSource.ts` and layer-23-first in hauska-map. `_decisions/2026-09-11_setback_source_most_current_wins.md`.
- ENVELOPE DRAWN, FIGURE REFUSED (operator 2026-09-11) — Ruling B reversed for the polygon only: map and MCP draw block draw the modelled buildable envelope from the same `place/buildable-envelope` call with its disclosure wherever a district and setback table exist; buildable area and percent stay refused until an envelope atom backs them. Entitlement gate unchanged. `_decisions/2026-09-11_ruling_b_reversed_polygon_only.md`.
- THE LEDGER IS THE SERVING PATH, ATOMS ARE CANONICAL (operator 2026-09-11) — node = identity, atom = one claim from one authority at one time, edge = an atom whose value is a node; a cell is accounting (state, atom reference, provenance, cached rendering keyed to atom version and vocabulary version), never a copied value; one reader in `hauska-engine/services/retrieval-api` walks gated cells and dereferences atoms and every surface and the Hauska MCP catalog consume it; unslated rails refuse, never fall to legacy; one writer mints atom + pointer + rendering in one transaction; one vocabulary module in the atom-contract package. Never add a read path, a vocabulary copy, or a value-holding cell. `_decisions/2026-09-11_ledger_as_serving_path_seven_steps.md`, ADR-031 amendment 2026-09-11, OPS-23 §0.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

AGENT-CONTRACT v79be86e2 — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
interruption recovery, slot law + lease, heavy-scan serialization, verification rules, close schema).
Read it before any work; where this dispatch and the contract disagree, STOP and report.

DEV-PROCESS vbb19bd34 — you are bound by 90_runbooks/DEV_PROCESS.md in full. It governs how work
is SHAPED and how a result is JUDGED: coverage figures travel with their denominator, classes are
measured never subtracted, an instrument's exclusion set is part of its contract, gating indicators are
proven able to fire, paired controls need a divergence test, guardrails that do not survive a clone are
not guardrails. Every rule in it is traced to an incident. Read it before any work.

FLEET-MEMORY v2a98086b — you are bound by 90_runbooks/fleet_memory_practice.md (M0).
The verbatim install block follows. Product-repo agents do not carry .cursor/rules; this is the install.

FLEET MEMORY (M0): As you work, capture build knowledge in a scratch block you return in your close, using four entry kinds — LESSON (a hard-won fact worth a test/note), DEAD-END (a tried-and-failed path + reason, so it is not retried), GROUND-TRUTH (a live-verified state WITH its timestamp), OPEN (a live thread the next context must pick up). Read any scratch context passed to you FIRST before re-deriving. Do NOT promote anything to durable memory yourself — return lessons in your close; the planner gates promotion. Nearing your limit, flush open threads + live ground-truths into your close so the next instance starts warm.

PLAN-ROW: P-154 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: legacy-design-tools

# PROGRAM CONTEXT — OPS-23 surface completion

You are working a lane of OPS-23. Everything below is program law for this lane. If it
conflicts with the general canon preamble, this section is narrower and wins on scope; if it
conflicts with the AGENT CONTRACT or ENFORCEMENT, those win. The plan is
`90_operations/OPS-23_surface_completion_program.md`; read sections 2, 3 and 7 before any work.

## The one goal

The Property Explorer panel, the map, the exported PDFs, and the Smart Site MCP connector show
the same facts for the same parcel, from one reader, with honest absences that name the city or
source that is missing. Six Central Texas counties first. **The customer surface is the
predicate.** A merged PR, a cortex read, a ledger count, or an MCP read alone does not close a
lane in this program.

## The five rulings (operator, 2026-09-11) — do not relitigate

- **R-1 MOST-CURRENT SOURCE WINS.** For setbacks and every dimensional rule, everywhere: the
  source with the most recent effective date supplies the value; tier breaks ties only when dates
  are equal or unreadable; dates are read from the source (ordinance effective date, ArcGIS
  `editingInfo.lastEditDate`), never assumed from source kind; unreadable dates produce a conflict
  row with both values, never a silent pick. `_decisions/2026-09-11_setback_source_most_current_wins.md`.
- **R-2 ENVELOPE DRAWN, FIGURE REFUSED.** The map and the MCP draw block draw the modelled
  buildable envelope from the same call with its disclosure wherever a district and a setback
  table exist. The buildable area number and percent stay refused until an envelope atom backs
  them. `_decisions/2026-09-11_ruling_b_reversed_polygon_only.md`.
- **R-3 THE CITY IS THE UNIT.** Zoning and setback work is scoped per city with a per-city
  predicate. Until a city is done, every absence string names the city.
- **R-4 THE SURFACE PROBE IS THE PREDICATE.** Your close cites a `surface-probe` artifact run
  after your deploy (or, until `scripts/surface-probe.mjs` lands, the raw output of the hand
  probes in OPS-23 §2 pasted verbatim) showing your change on the surface you claim to have
  changed.
- **R-5 THREE ROLES.** You are a lane. You do not commit to doc_repo; you hand artifacts back.
  You may fan one level per AGENT_CONTRACT §1 and verification stays with you.
- **R-6 THE LEDGER IS THE SERVING PATH AND ATOMS ARE CANONICAL.** A node is identity; an atom
  is one claim from one authority at one time; an edge is an atom whose value is a node. A cell
  is accounting: state, atom reference, provenance, and a cached rendering keyed to atom
  version and vocabulary version; a cell never holds a value as canon. One reader in
  `hauska-engine/services/retrieval-api` walks gated cells and dereferences atoms; every
  surface and the Hauska MCP catalog consume it; unslated rails refuse, never fall to legacy.
  One writer mints atom, pointer and rendering in one transaction. One vocabulary module in
  the atom-contract package. Never add a seventh read path, a second vocabulary, or a cell
  that copies a value. `_decisions/2026-09-11_ledger_as_serving_path_seven_steps.md`, OPS-23 §0.

## The probe set — every lane measures on these, and may add one, never remove one

`48021:34049` (1109 Pecan St, Bastrop, corner lot, improved 1906) · `48021:33223` (P-91 gold) ·
`48453:113408` (414 Spiller Ln, West Lake Hills, split situs) · `48453:474034` (2601 Sterling
Panorama Ct, unincorporated, Lake Pointe MUD) · `48453:367134` (5833 Taylor Draper Cv, Austin
SF-2). Calls: `GET https://smartsite.cloud/api/spine/property-atoms/<id>/facets`;
`POST https://smartsite.cloud/api/spine/cortex/api/brokerage/v1/place/buildable-envelope`
by address and by `{lat,lng}`; `POST .../brokerage/v1/map-data/gis-layer {"layer":"parcels","bbox":{west,south,east,north}}`.

## Facts a lane must carry (verified 2026-09-11; re-verify at source before relying)

- The panel reads facets through hauska-map's own adapter (`api/_lib/pe-property-atoms.ts`,
  `atom-chain-to-facets.ts`), `readPath: atom-chain`, not through cortex node-facets. The
  record-served setback cutover lives in LDT `nodeFacetTier1Assemble.ts` /
  `setbacksFactServeCutover.ts` and reaches `get_smart_site`, not the panel.
- The map draws an envelope only through `ExplorerMap.handleEnvelope`, fed by `InspectCard`
  from the sealed sheet (`fact-sheet-resolver.ts`); the card issues no lookup of its own
  (invariant I2). `sheetEnvelopeIsAtomPathPending` (`fact-sheet-resolver.ts:216-241`) is Ruling
  B's mechanism. `handleEnvelope` also gates drawing on `isEntitled` (Pro, unlocked, dev role);
  that gate is not yours to change.
- `resolveGeometry` (`fact-sheet-resolver.ts:2520-2660`) already accepts `hint.centroid`;
  `ExplorerMap.adoptSubject` passes only `{ geometry }`. The live parcel layer
  (`map-data/gis-layer`) returns the ring for a bbox around `cityLimitsFact.queryPoint`.
- cortex geocoding cannot find "414 SPILLER LN" with or without ", WEST LAKE HILLS, TX"
  (422 `geocode_miss` both ways). Placement must not depend on it.
- The feasibility engine (`hauska-engine-api-00198-cir`) completes Travis refreshes in 85 to
  154 s with 201; PE and smartsite-mcp abort at 55 s; the download endpoint serves the finished
  PDF in 0.2 s afterwards.
- Cell-state vocabulary is OPS-21's (`_catalog/program_preambles/OPS-21.md`). Six states. Use no other.

## What a lane in this program must not do

- Do not mint or backfill envelope atoms; that program resumes when P-152 closes.
- Do not change the entitlement gate or any pricing surface.
- Do not fix a naming mismatch by renaming; report it.
- Do not widen a check to admit a value it does not satisfy; report it.
- Do not read a working tree to verify a deploy; read the serving revision by field name and probe the surface.
- Do not write to a repository your seat does not own; request it from the owning seat via the close.

## Close requirements, in addition to AGENT_CONTRACT §6

- `probe:` the artifact path or the pasted raw output, per R-4.
- `falsifier:` the result you pre-registered that would have proved your change wrong, and what you observed.
- `contradicted:` what in the dispatch or the plan was wrong when you got there. "Nothing" is acceptable and must be said.
- `leave_behind:` per ENFORCEMENT.md.


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

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-12_p154-most-current_cp1.json
  CP2: _inbox/2026-09-12_p154-most-current_cp2.json
  CLOSE: _inbox/2026-09-12_p154-most-current_close.json
  These paths are relative to the doc_repo worktree the session RUNNING YOU is rooted in: for a
  lane spawned by the dispatch planner that is the planner's worktree; for the dispatch planner
  itself it is its own seat worktree (never P:/doc_repo, the integration seat's checkout). This
  dispatch was compiled in P:/seat-worktrees/dispatch-planner/doc_repo. Two lanes in each of waves 1 and 2 wrote
  into the property seat's worktree instead and their artifacts had to be found by hand.
  No notification arrives when a background command finishes: poll with a bounded loop and a
  timeout; a lane that ends its turn waiting for a wake-up stalls (two lanes did, wave 2).

CLOSE SKELETON (the fields the enforcement gate reads; spell them exactly, or the gate refuses
the commit rather than guessing what you meant):
  {
    "lane": "p154-most-current",
    "planRows": ["P-154"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
