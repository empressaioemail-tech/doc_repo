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


## Mission — P-154 (wave 4): the most-current resolver is shared through the corpus, and every producer uses it

You are the deepest worker in OPS-23 wave 4. You do not spawn sub-agents. The dispatch
planner supervises you, reviews your design at CP1 and your first consumer at CP2, and runs the
surface probe itself after your deploys.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### The ruling you execute

`_decisions/2026-09-13_share_the_most_current_setback_resolver.md`: the resolver becomes
`@empressaio/setback-corpus` subpath `./resolve` (1.2.0); hauska-engine, hauska-factory and
legacy-design-tools consume it; the engine's copy is retired by decline.

### Where you work (register names; create each from `origin/main`, declare the start commit)

- `hauska-setback-corpus-p154-share` at `P:/seat-worktrees/property/hauska-setback-corpus-p154-share`,
  branch `feat/p154-resolve-subpath`. There is no `P:/` checkout of this repo; clone
  `https://github.com/empressaioemail-tech/hauska-setback-corpus.git` into that path. Package
  `@empressaio/setback-corpus` 1.1.0, exports `.`, `./setbacks`, `./gate`; workflows `ci.yml`
  and `publish.yml` (read `publish.yml` before you assume what publishes).
- `hauska-engine-p154-share`, branch `feat/p154-consume-corpus-resolve`.
- `hauska-factory-p154-share`, branch `feat/p154-consume-corpus-resolve`.
- `legacy-design-tools-p154-share`, branch `feat/p154-date-first-through-corpus`.

### What is true today (P-154 close, `_inbox/2026-09-12_p154-most-current_close.json`; re-verify at your start commits)

- Resolver: hauska-engine `packages/adapters/src/local/setbacks/most-current-setback-resolver.ts`
  (exports `resolveMostCurrentSetback`, `SetbackCandidate`, `ResolvedSetback`,
  `ConflictSetback`, `parseStrictIsoDate`, `dateFromAtomSourceVintage`,
  `dateFromTableEffectiveDate`, `parseYearSequenceOrdinanceCitation`), test
  `__tests__/most-current-setback-resolver.test.ts`; imported by `index.ts`,
  `bastrop-per-parcel-record.ts`, `table-types.ts`. Merged in #424 `2221b6a6`.
- hauska-factory #141 `ba15fee5`: `src/lib/setback-writer/setback-table-router.mjs` carries the
  rule locally because it could not import the engine's module.
- legacy-design-tools `artifacts/api-server/src/lib/buildableEnvelope/authoritativeSetbackSource.ts`
  is UNCHANGED: vendors its own table JSON, ranks tier-first, date only as tiebreak. LDT does not
  depend on the corpus package today.
- Ground truth for `48021:34049` (Bastrop): layer 23 row 25/5/25/15 citing Ordinance 2019-51
  (`dataLastEditDate` 2026-08-24); layer 83 row 30/10/30/20 (`lastEditDate` 2026-07-23, no
  citation field); Ordinance 2026-06 effective 2026-04-14 (30/10/30/20). Live 2026-09-13: panel
  30/5/25/15 (front record-served, side/rear/corner legacy-transitional), endpoint and MCP
  30/10/30/20 with source date 2026-04-14. `48021:33223`: panel 20/5/20, endpoint 25/7/15/7,
  MCP absent (district GC has no ruled table).
- A sixth live producer, hauska-engine `packages/engine-core/src/property-reasoning/bastrop-per-parcel-setback.ts:75`
  (`buildBastropPerParcelSetbackDescriptor`), has no test locking its numeric output.
- The engine's `getSetbackTableForZoning` returns `SetbackTable | null` with no conflict variant;
  a conflict is disclosed through `display_meta.second_source`, not refused. Not this row's to
  change; do not widen it.

### What you build, in order

1. **Corpus.** Move the module and its test into the corpus as `src/resolve/` and export
   `./resolve` beside `./setbacks` and `./gate`; keep the public names; bump to 1.2.0; the
   package's own tests include the pre-registered falsifier and non-vacuity cases the P-154 lane
   wrote. Merge on the conclusion string `success`; publish through `publish.yml` (npm publish
   is autonomous in this portfolio); confirm `npm view @empressaio/setback-corpus version`
   reads 1.2.0 and `dist-tags.latest` too. Paste both.
2. **Engine.** Import from `@empressaio/setback-corpus/resolve`; delete the local module; a
   retirement test asserts the old relative path does not resolve (`import()` rejects). Bump the
   pin to `^1.2.0`. Add the missing test for the sixth producer (its numeric output for
   `48021:34049` equals the resolver's answer). Deploy `hauska-engine-api` from `origin/main`
   after merge under the planner's lease (P-170; one shift per service; delete the lease file on
   release).
3. **Factory.** `setback-table-router.mjs` and the S1 writer call the package; the local rule is
   deleted with a retirement test. Then re-run the Bastrop setback cells: staging first, then the
   identical job on production, verified from execution status, never a laptop `--apply`. Paste
   the cell diff counts (how many Bastrop parcels changed, from what to what) that the P-154
   close left unmeasured.
4. **LDT.** Add the dependency (`^1.2.0`; the esbuild conditions stay `["workspace"]`, see the
   fleet memory: broadening them boot-crashes pg ESM). `authoritativeSetbackSource.ts` builds
   `SetbackCandidate`s from its sources with their dates read at source and calls
   `resolveMostCurrentSetback`; the tier-first ranking is deleted; a test fails on the old
   ranking. A divergence test compares LDT's answer with the engine's for `48021:34049` and
   `48021:33223` and fails on disagreement. Deploy `cortex-api` and `smartsite-mcp` the way their
   workflows deploy, one lease each.
5. **Read.** After all four are serving, read `get_smart_site` for `48021:34049` and
   `48021:33223` and paste setbacks and `setbackSourceDate`; ask the operator once for the
   feasibility PDF of `48021:34049` after the engine deploy.

### Falsifiers, pre-registered

- If after step 4 the panel for `48021:34049` still prints 30/5/25/15 while the endpoint prints
  30/10/30/20, a consumer still ranks tier-first or reads a stale cell; name which.
- If LDT's and the engine's answers differ for either parcel, the divergence test must fail; if
  it passes while they differ, the test is vacuous.
- If the old engine path still resolves after step 2, the retirement is not proven.
- If the corpus publish leaves `dist-tags.latest` at 1.1.0, nothing downstream changed.
- If a source's date is unreadable and a value is still picked, the rule is wrong (conflict row).

### Out of scope

The conflict-shaped return type for `getSetbackTableForZoning` (a future row). New setback
tables for unstaged cities (P-156). Slating the remaining setback rails (P-152 lane 4, which
waits for your Bastrop re-run).

### Close

`_inbox/<date>_p154-share_close.json`, `planRows` `["P-154"]`, with the four PRs and merge SHAs
with conclusion strings, the npm version read, the serving revisions read by field, the cell
diff counts, the two `get_smart_site` reads, and the probe artifact the planner ran.
`leave_behind` is required.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-13_p154-share_cp1.json
  CP2: _inbox/2026-09-13_p154-share_cp2.json
  CLOSE: _inbox/2026-09-13_p154-share_close.json
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
    "lane": "p154-share",
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
