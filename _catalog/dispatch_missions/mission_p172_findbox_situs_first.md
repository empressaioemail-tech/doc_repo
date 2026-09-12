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
