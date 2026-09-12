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

PLAN-ROW: P-172 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-map

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


## Mission — P-172 FIND BOX: the situs index first, the geocoder as a labelled fallback

You are the deepest worker in OPS-23 wave 2. You do not spawn sub-agents. The dispatch
planner supervises you, reviews your design at CP1 and your first pilot at CP2, and runs the
surface probe itself after your deploy; your own probe run is evidence, not the close.

Exit-bounded verification: every command you run must terminate on its own; wrap anything
that could hang in `timeout`; never leave a watch, a tail or a dev server running.

### Where you work

Two repos, both property seat, both registered in `_catalog/seat_register.json`. Create each
from `origin/main` and declare its start commit before you write anything:

- `empressaioemail-tech/hauska-map`, worktree `P:/seat-worktrees/property/hauska-map-p172-findbox`, branch `feat/p172-findbox-situs-first`.
- `empressaioemail-tech/legacy-design-tools`, worktree `P:/seat-worktrees/property/legacy-design-tools-p172-situs-search`, branch `feat/p172-situs-search-route`.

Other people's checkouts (`P:/hauska-map`, `P:/legacy-design-tools`) are never built in.
P-152 lane 2 and P-167 also change Property Explorer this wave: different files, same app;
rebase before your PR and re-green on the current base. cortex-api deploys only from
`origin/main` after merge and only under the planner's traffic lease for `cortex-api`.

### The finding and the ruling

F16: after the P-151 deploy the operator typed `414 SPILLER LN` into the Find box on
smartsite.cloud and got nothing (2026-09-11 21:05Z), while the same parcel's card, reached by
id or by clicking the map, seals with its header and all seven rows. Ruling
(`_decisions/2026-09-12_find_box_reads_the_situs_index.md`, OPS-16 P-172): the address form
resolves from the situs index first, composing split-situs rows as situs plus city plus state;
the parcel-id form resolves directly; the geocoder runs only when the index has no row, and
its result is labelled geocoded. P-27 (OPS-16 line 72) is the situs-index ruling; A-018
disputes its "99.3 percent populated" figure, so carry no coverage claim you did not measure.

### What is true today, verified 2026-09-12 at hauska-map `8b44f68` and LDT `6b579020` (`_inbox/2026-09-12_ops23_wave2_verify_panel_and_findbox.md`)

- The Find box is `apps/property-explorer/src/browse/SearchBar.tsx` (placeholder at 536).
  Typeahead (`src/lib/geocodeClient.ts:56-87 fetchMergedSearchSuggestions`) fires in parallel
  `GET /api/pe-situs-search?q&limit=7` (`situs-search-client.ts:29`) and
  `GET /api/pe-geocode?q&limit&lat&lon&zoom` (`geocodeClient.ts:33-42`, with extra
  `q Street` / `q Drive` calls for a bare house-plus-street query, 69-71), merging situs first.
- Submit (Enter or Find with no highlighted row) calls `runParcelLookup`
  (`browse/ExplorerMap.tsx:2208, 1002`) then `resolveLookupToParcelNodeId`
  (`src/lib/parcel-lookup.ts:141`), in this order: (1) parcel-node-id form returned directly
  (156-162); (2) a bare place query refused with "Pick a row from the list" (164-169); (3) a
  bare house-plus-street query REFUSED AS AMBIGUOUS (170-172); (4) the address form via
  `fetchUniqueSitusPin` against `/api/pe-situs-search` with `situsQueryVariants` (174-190,
  269-300; the variants at `search-kinds.ts:274-310` strip a trailing state and a trailing
  non-suffix token); (5) a current-subject situs match (192-204); (6) `POST
  /brokerage/v1/place/buildable-envelope { address }` through cortex, whose ladder ends in a
  fuzzy geocode (206-236); (7) an honest miss (247-250). The geocoder fallback is UNLABELLED:
  `source: "address"` is returned for both the situs hit (185) and the envelope-derived id (259).
- Client-side hazard: `fetchUniqueSitusPin` applies `cityHintFromQuery` (285-289, 303-315)
  and keeps only hits whose `situsAddress` contains the last query token (`hills` for the
  city-qualified form).
- Server: `/api/pe-situs-search` (`api/pe-situs-search.ts`) proxies cortex
  `GET /api/brokerage/v1/place/situs-search` (`pe-situs-search-core.ts:53-61`). LDT
  `routes/brokeragePlaceSitusSearch.ts:28-70`: a parcel-id regex branch (43-53), then
  `searchPlaceByPrefix` (55-58); no geocoder in that route or in `lib/txgioAddressResolve.ts`.
  Inside `searchPlaceByPrefix` (1090-1216): out-of-coverage short-circuit (1133-1139),
  `searchSitusByStreetKeys` on `txgio_parcel.situs_address` (1141-1155), a prefix ILIKE
  fallback (1156-1179), then `txgio_address` address points fill remaining slots (1197-1216).
- The situs index is `txgio_parcel` with the functional index `txgio_parcel_situs_norm_idx`
  on `(county_fips, normalised first-comma segment of situs_address)`
  (`lib/db/drizzle/0058_txgio_situs_addr_norm_idx.sql:48-50`; normaliser
  `txgioAddressNormalize.ts:649-663`). `situs_address` and `situs_city` are separate columns
  for every county including Travis (`nodeFacetTier1ParcelJoin.ts:157`), but the search never
  reads `situs_city`: the locality filter is `strpos(upper(situs_address), city) > 0`
  (`txgioAddressResolve.ts:199-203`), and the bake records that Travis "leaves `situs_city`
  null on most of its roll" (`nodeFacetBakeTier1Conformant.ts:1742-1744`).
- Normalisation: `414 SPILLER LN` yields street key `414 SPILLER LN` and no locality;
  `414 SPILLER LN, WEST LAKE HILLS, TX` yields the same key plus `{city: WEST LAKE HILLS, state:
  TX}` (`parsePlaceSearchLocality` 348-354), which adds the `strpos` predicate.
- **Measured live by the overseer, 2026-09-12 03:25Z, through `GET https://smartsite.cloud/api/pe-situs-search?q=<q>&limit=7`
  (fixtures `scripts/fixtures/surface-probe/situs-search-*_48453-113408.json`):**
  `414 SPILLER LN` returned HTTP 502 `{ "error": "situs_search_unreachable", "message": "cortex
  timed out after 5000ms" }` in 5.4 s; `414 SPILLER LN, WEST LAKE HILLS, TX` returned 200 with
  `hits: []` in 0.9 s; `48453:113408` returned 200 with one hit
  `{ "parcelNodeId": "48453:113408", "situsAddress": ", TX", "countyFips": "48453", "latitude":
  null, "longitude": null }` in 0.2 s; the control `2601 STERLING PANORAMA CT` also returned
  502 after 5.1 s. Three things follow. (a) The index row for the anchor parcel exists and its
  street line is EMPTY: `txgio_parcel.situs_address` for `48453:113408` is `", TX"`, so no
  search logic can find `414 SPILLER LN` there until the index carries it; the panel's header
  gets the address from the CAD roll through cortex (`baseFacts.situsAddress`), not from this
  index. (b) A bare street-key search across the whole state times out at cortex's 5 s
  budget; the county is not known for a bare query, so the index is scanned statewide. (c) The
  operator's earlier successful Find for `2601 STERLING PANORAMA CT` therefore landed through
  the typeahead's geocoder suggestions or the envelope rung, unlabelled: F12, geocoding
  demoted by ruling and still reached.

### The change

1. **Measure first, by request.** With the browser's network tab, submit each of
   `414 SPILLER LN`, `414 SPILLER LN, WEST LAKE HILLS, TX`, `48453:113408` and the control
   `2601 STERLING PANORAMA CT`, and record which lookup branch fired (the numbered list above)
   and what `/api/pe-situs-search` and `/api/pe-geocode` returned for each. Read
   `txgio_parcel.situs_address` and `situs_city` for `48453:113408` and for `48453:474034` on
   the cortex store, and count Travis rows whose `situs_address` is blank or `", TX"` against
   the county's row count. Paste all of it in CP1. The overseer's live reads above already
   show the index row is empty for the anchor; your measurement confirms it and sizes it.
2. **Fill the index from the source the card already trusts.** The Travis street line the
   card prints comes from the CAD roll (`cad_property` situs fields, the same source P-151
   composed `situsAddress` plus `situsCity` from). Derive `situs_address` and `situs_city` for
   Travis rows in `txgio_parcel` whose street line is blank from `cad_property` joined on
   `(county_fips, prop_id)`, as a one-shot, idempotent job or migration that runs on staging
   first and then production through the deploy path, never from a laptop (the freeze). The
   job leaves a record: rows examined, rows filled, rows still blank, with the denominator.
   Never overwrite a non-blank TxGIO street line; report disagreements between the two sources
   as a count, do not resolve them here.
3. **Bound the bare search.** A bare street-key query must answer or refuse inside the
   5 s budget: scope it by the viewport county when the client knows one (the map has a
   county for its centre), and when it does not, return a declared "add a city or county"
   refusal after the index lookup, never a 502 from a timeout. Measure the statewide index
   lookup's time before and after and paste both.
4. **Locality matches the record, not a substring.** In `txgioAddressResolve.ts` the locality
   predicate consults `situs_city` when the row carries one and falls back to the
   `situs_address` substring only when it does not; a locality that matches nothing never
   filters out a unique street-key hit; the city-qualified and bare forms of the same address
   resolve to the same row. On the client, `cityHintFromQuery` stops discarding a unique hit
   whose `situsAddress` lacks the city token.
5. **A unique situs hit resolves; ambiguity is measured, not assumed.** The bare
   house-plus-street refusal at `parcel-lookup.ts:170-172` runs the situs search first and
   refuses only when the index returns more than one hit or none; one hit resolves. The
   parcel-id form keeps resolving directly.
6. **The geocoder is a labelled last resort.** The buildable-envelope address rung (206-236)
   runs only after the situs search has returned no row, and the lookup result carries
   `source: "geocoded"` with the UI saying so on the card it lands on; the situs hit keeps
   `source: "situs"`. `/api/pe-geocode` suggestions in the typeahead are labelled the same way
   and sort after situs rows. Do not remove the geocoder; label it.
7. **Non-vacuity and refusal.** Tests: a fixture Travis row filled from the roll resolves from
   both query forms; a row with a bare `situs_address` and a null `situs_city` resolves from both; a row with a composed `situs_address` still
   resolves; two rows on the same street key refuse as ambiguous with both candidates named; a
   query the index cannot resolve reaches the geocoder and comes back labelled; the parcel-id
   form is untouched.

### Verification, and the falsifier you pre-register

Write down at CP1 before any code: *if after the deploy the Find box on smartsite.cloud does
not resolve `414 SPILLER LN` and `414 SPILLER LN, WEST LAKE HILLS, TX` to `48453:113408`, or
resolves either through the geocoder without labelling it, the row is not done.* And: *if the
measurement in step 1 shows the index has no row for `48453:113408` at all, the fix is
acquisition, not search; stop and report.*

Deploy: Property Explorer through the Vercel CLI (live bundle confirmed); cortex-api from
`origin/main` after merge under the planner's lease, serving revision read by field. The
planner runs `node scripts/surface-probe.mjs --rows P-172 --observations <file>`: the P-172
predicate has a machine leg (`GET /api/pe-situs-search` through smartsite.cloud for the bare
and the city-qualified form must each return a hit whose parcel node id is `48453:113408`) and
an observed leg (`findBoxResolves`: the operator types both forms into the Find box and lands
on the card; `resolvedVia`: `situs` or `geocoded` as the UI labels it), each with `observedBy`
and `observedAt`.

### Close

`_inbox/<date>_p172-findbox_close.json` per AGENT_CONTRACT §6 plus the OPS-23 four fields.
`leave_behind` must carry: the measured branch and the `txgio_parcel` row for the anchor
parcel; the count of Travis rows with null `situs_city` if you measured it (with the
denominator) or "not measured"; and any other county whose situs shape the fix did not cover.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-12_p172-findbox_cp1.json
  CP2: _inbox/2026-09-12_p172-findbox_cp2.json
  CLOSE: _inbox/2026-09-12_p172-findbox_close.json

CLOSE SKELETON (the fields the enforcement gate reads; spell them exactly, or the gate refuses
the commit rather than guessing what you meant):
  {
    "lane": "p172-findbox",
    "planRows": ["P-172"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
