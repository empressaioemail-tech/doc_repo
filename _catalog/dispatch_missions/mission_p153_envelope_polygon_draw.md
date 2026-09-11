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
