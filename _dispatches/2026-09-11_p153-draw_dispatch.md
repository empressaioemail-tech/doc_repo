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

AGENT-CONTRACT v1890f0bb — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
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

PLAN-ROW: P-153 (90_operations/OPS-16_texas_market_plan_of_record.md)
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


## Mission — P-153 DRAW: Ruling B reversed for the polygon only

You may fan sub-agents exactly one level deep per AGENT_CONTRACT §1. Verification stays with
you. Sub-agents produce diffs and evidence; you read every diff and run every check yourself.

### Where you work

Two repos, both property seat, both registered in `_catalog/seat_register.json`:

- `empressaioemail-tech/hauska-map`, worktree `P:/seat-worktrees/property/hauska-map-p153-draw`,
  branch `feat/p153-envelope-polygon-draw`. **Cut this branch from `origin/main` only after
  P-151 has merged**; both lanes edit `fact-sheet-resolver.ts`. Declare the start commit and
  confirm it contains the P-151 merge.
- `empressaioemail-tech/legacy-design-tools`, worktree
  `P:/seat-worktrees/property/legacy-design-tools-p153-draw`, branch
  `feat/p153-mcp-draw-polygon`, from `origin/main`.

### The ruling you are implementing

`_decisions/2026-09-11_ruling_b_reversed_polygon_only.md`. Read it in full. In one sentence:
the map and the MCP draw block both draw the modelled buildable envelope polygon, from the same
`place/buildable-envelope` call, carrying that call's disclosure, wherever a zoning district and
a setback table exist; the buildable area figure and percent stay refused on every surface until
a `buildable-envelope` atom backs them.

Ruling B (`_decisions/2026-08-28_p91_o1_envelope_xray_must_refuse.md`) stands for the number.
Its reason was that two surfaces must not disagree. After your change they agree on a polygon
and agree on refusing the number.

### What is true today, verified 2026-09-11 at hauska-map `fb41c05` and LDT `489f428c`

```
POST /api/spine/cortex/api/brokerage/v1/place/buildable-envelope {"address":"1109 PECAN ST, BASTROP, TX 78602"}
  -> status "ok", parcel_node_id 48021:34049, payload.geojson Polygon with 6 vertices,
     setbacks {front 30, side 10, rear 30, side_corner 20, district SF-1},
     properties.disclosure "Estimated buildable area. Front edge inferred from the situs-named street
     centerline (OpenStreetMap). Corner lot ... Not survey grade ...", buildableAreaSqFt 16386 (this NUMBER stays refused)
```

The panel's facets for the same parcel carry `envelope.status:"ok"` with setbacks and a
disclosure that says "geometry from live derive". `sheetEnvelopeIsAtomPathPending`
(`apps/property-explorer/src/lib/fact-sheet-resolver.ts:216-241`) returns true on that
disclosure, `envelopeValue` (same file, ~1861) returns `{ kind: "not-derived", reason:
"atom_path_pending" }`, `sheet-to-card-model.ts:808-820` maps that to `envelopeStatus:
"declined"`, `normalizeEnvelope` (`browse/envelope-overlay.ts`) returns `kind: "none"`, and
`ExplorerMap.handleEnvelope` (`browse/ExplorerMap.tsx:1583-1625`) sets no overlay. The Buildable
row shows "Not stamped here" because the absent-uncovered branch has no label
(`InspectCard.tsx:495`).

On the MCP side, `get_smart_site` for the same parcel returns
`draw.overlays[id="envelope"] = { geom: "none", draw: "suppress-setback-line", state:
"refused", reason: "atom_path_pending", reasonDisplayText: "Withheld, setbacks unruled" }`
in the same payload whose `setbacks-envelope` section is `present` with 30/10/30/20. That
display text is false for this parcel and goes away with your change.

### Blast radius, enumerated (read each before you change any)

```
hauska-map     apps/property-explorer/api/_lib/pe-property-atoms.ts
               apps/property-explorer/src/lib/baked-facets.ts
               apps/property-explorer/src/lib/buildable-display-vocab.ts      <- parity-locked with the engine copy
               apps/property-explorer/src/lib/fact-sheet-resolver.ts
               apps/property-explorer/src/lib/live-envelope-augment.ts
               apps/property-explorer/src/lib/sheet-to-card-model.ts
               apps/property-explorer/src/browse/envelope-overlay.ts
               apps/property-explorer/src/browse/ExplorerMap.tsx
               apps/property-explorer/src/browse/InspectCard.tsx
LDT            artifacts/api-server/src/lib/buildableEnvelope/derive.ts
               artifacts/api-server/src/lib/nodeFacetBakeTier1.ts
               artifacts/api-server/src/lib/nodeFacetBakeTier2.ts
               artifacts/api-server/src/lib/nodeFacetTier1Assemble.ts
               artifacts/api-server/src/lib/parcelDrawFromReads.ts
               artifacts/api-server/src/lib/parcelDrawStub.ts
               artifacts/api-server/src/nodeFacetBakeTier1Cli.ts
               artifacts/api-server/src/routes/brokeragePlaceBuildableEnvelope.ts
               artifacts/smartsite-mcp/src/mcp-app.ts
               artifacts/smartsite-mcp/src/tool-honesty.ts
               artifacts/smartsite-mcp/src/vocabulary.ts
hauska-engine  packages/engine-core/src/site-plan/__fixtures__/buildable-display-vocab.parity.lock.json
               (fails if the hauska-map vocab file changes shape; you do not own the engine repo -- if the
                lock must move, say so in leave_behind and do not edit the engine)
```

### The change — hauska-map

1. **Split geometry from figure in the sheet contract.** `ParcelFactSheet["envelope"]` gains a
   variant for "polygon present, figure refused": carry `rings` (or the GeoJSON) and the
   endpoint's `disclosure` and `setbacksUsed`, with `areaSqFt` and `pct` absent by type, not by
   sentinel. `envelopeValue` returns that variant when `sheetEnvelopeIsAtomPathPending` is true
   AND the facets carry live-derive geometry. It returns `not-derived` as today when there is no
   geometry at all.
2. **Project it.** `sheet-to-card-model.ts`: the new variant maps to an envelope the map can
   draw (`geojson` set) while `buildableDisplayKind` stays the refused kind and the Buildable
   row keeps its refusal wording (`buildable-display-vocab.ts` already has "setbacks present ·
   buildable % pending" and "unavailable" kinds; use the one whose customer string says the
   figure is withheld and the drawing is modelled; if none says that, add ONE token and update
   the engine parity fixture copy in `__fixtures__/buildable-display-vocab.peer.fixture` in
   hauska-map only, then name the engine lock in `leave_behind`).
3. **Draw it.** `handleEnvelope` already draws `kind: "ok"` with an inset polygon; confirm the
   new variant reaches it as `ok` with geometry, and that `insetParcelBySetbacks` (the client
   uniform-inset fallback) stays unused. The entitlement gate (`mayDraw = isEntitled(snap)`) is
   NOT yours: leave it and record in the close which tiers see the drawing.
4. **Panel copy.** The Buildable row must not say "Not stamped here" for this variant. It
   says the figure is withheld pending an envelope atom and that the drawn envelope is modelled,
   not survey grade. The X-ray/brief print path (`brief-print-html`, `brief-view-model`) must
   print no percent for this variant; add the test that fails if it does.

### The change — legacy-design-tools

5. **MCP draw block carries the same polygon.** `parcelDrawFromReads.ts` emits
   `overlays[id="envelope"]`. For a parcel where the buildable-envelope route resolves `ok` with
   geometry, emit `geom` in the draw frame (the block already declares `frame.units: "ft",
   origin centroid, yAxis true-north`; convert the polygon the same way the ring is converted),
   `state: "present"` with a `basis` that says modelled from setbacks, not survey grade, and the
   route's disclosure. Keep `derivedFigures.denies` including `buildable_area`. Where the route
   declines (no district, no table, `no-district`, unincorporated), keep the refusal and make
   `reasonDisplayText` name the actual reason; "Withheld, setbacks unruled" is only correct
   when setbacks are in fact unruled. `vocabulary.ts` and `tool-honesty.ts` gain the one token
   the panel gained, with the same display text.
6. **Same call, not a second derivation.** The draw block must obtain the polygon from the
   same code path `brokeragePlaceBuildableEnvelope.ts` uses (`deriveBuildableEnvelope` through
   `reconcileAtomEnvelope`), not from a re-implementation. If you find yourself writing inset
   geometry, stop.

### Verification, and the falsifier you pre-register

Write down before running: *if for `48021:34049` the polygon the MCP draw block carries and
the polygon the map draws differ in vertex count, or in area by more than one percent, then
there are two implementations and the change is wrong; stop and report.* Also: *if any surface
prints a buildable figure or percent for this parcel after the change, the change is wrong.*

- Unit tests for the new sheet variant, the card projection, the print path's no-percent
  guarantee, and the MCP draw block's frame conversion (compare the converted polygon's area to
  the endpoint's `buildableAreaSqFt` within one percent as a geometry check only; never print it).
- Non-vacuity: a test proving the new variant is constructed for at least one real fixture.

Deploy per the standing decision: Property Explorer through the Vercel CLI and confirm the live
bundle; smartsite-mcp and cortex-api through their workflows, then read the serving revisions
by field name (the smartsite-mcp workflow's env list is authoritative-replace; confirm
`/health/dependencies` still reports `hauska_mcp: ok` after your deploy).

Then the probe, raw output in the close:

```
POST .../place/buildable-envelope {"address":"1109 PECAN ST, BASTROP, TX 78602"}   -> vertex count N
get_smart_site 48021:34049 depth node (operator runs it; you paste it)             -> draw.overlays[envelope].geom present, N vertices, state present, no figure
get_smart_site 48453:474034                                                        -> envelope refused, reason names unincorporated / no district
GET  .../property-atoms/48021%3A34049/facets                                       -> unchanged setbacks; no buildableArea printed on the panel
```

plus the operator's screenshot of `48021:34049` on smartsite.cloud, signed in on an entitled
account, showing the amber inset polygon. The screenshot is part of the predicate.

### Close

AGENT_CONTRACT §6 artifact plus the OPS-23 preamble's four fields. `leave_behind` must name
the engine parity lock if the vocab shape moved, and must name any surface you found that still
prints a percent from the side door.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-11_p153-draw_cp1.json
  CP2: _inbox/2026-09-11_p153-draw_cp2.json
  CLOSE: _inbox/2026-09-11_p153-draw_close.json
