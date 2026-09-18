## Mission — P-339, P-340, P-341: every surface tells the customer the same thing about one parcel's envelope

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-map` and `legacy-design-tools`, one PR per
repo, each branched from that repo's current `origin/main` with the SHA declared. You do not merge or
deploy; the integration seat does both. Any doc_repo change is handed back as a diff in your close.

### The rulings you are implementing (`_decisions/2026-09-18_phase0_closeout_rulings.md`)

- **Ruling 15 (P-339):** the drawing route (`POST /api/brokerage/v1/place/buildable-envelope`) owns the
  envelope's reason. The panel and the MCP read it; neither composes its own.
- **Ruling 14 (P-340):** where the card's setback table and the draw route's table differ, the most
  current source wins; a date that cannot be read produces a conflict row carrying both, never a
  silent pick.
- **Ruling 16 (P-341):** where two impervious-cover figures apply, the stricter one governs and both
  are cited, each with its source, on every surface.

### What is wrong, measured on the live surfaces

The customer-leg probe (`scripts/surface-probe.mjs --rows P-254`, artifact of record named by the seat
in the dispatch notes below) reads the panel payload, the draw route and the MCP's `get_smart_site`
for the same parcel in one pass. Three classes fire:

1. **A surface contradicts its own route (P-339).** `SAYS-RULES-UNRULED-BESIDE-RULED-TABLE`: a
   surface says "setbacks unruled" / `atom_path_pending` while the same payload serves a ruled table.
   `SAYS-GEOMETRY-WITHHELD-BESIDE-DRAWN-GEOMETRY`: the panel says "depth-warm geometry withheld" while
   the draw route returns a polygon. And XD-2/X5 on Waco `48309:187374`: the panel declines what its
   route draws. Where the text is composed, read at hauska-map `163fde32` and LDT `25d1782f`:
   - hauska-map `apps/property-explorer/api/_lib/atom-chain-to-facets.ts` composes its own envelope
     disclosure (near line 2503: "Codified setback table (...); depth-warm geometry withheld"), and
     `pe-property-atoms.ts` near line 549 writes the panel's envelope.
   - legacy-design-tools: the MCP's `draw.overlays` envelope reason comes from the tier-1 bake
     (`artifacts/api-server/src/lib/nodeFacetBakeTier1.ts` near line 116, `atom_path_pending`) and
     `parcelDrawFromReads.ts` / `parcelDrawEnvelopeModel.ts`, not from the live draw route.
2. **Two tables for one parcel (P-340).** `PANEL-DRAW-TABLE-DISAGREE`: the card's table and the draw
   route's table differ on the same parcel in the same pass.
3. **Two impervious figures (P-341).** `IMPERVIOUS-DUAL-FIGURE`: the panel's zoning-table
   `maxImperviousPct` beside the watershed fact's `percent` (Travis `48453:367134`: zoning 45,
   watershed 30).

**The subjects, from the run of record `_inbox/2026-09-18_155840_surface_probe.json`** (15:58:40Z,
signed in, after the 2026-09-18 LDT deploy `cortex-api-00841-jeh` and Property Explorer `m6wqid8u7`):

| Class | Parcels |
|---|---|
| Ruled table called unruled (9) | `48055:27929`, `48209:145880`, `48309:103015`, `48453:239852`, `48453:367134`, `48453:445501`, `48491:R405006`, `48491:R483884`, `48491:R580151` |
| Geometry called withheld beside drawn geometry (5) | `48021:51735`, `48309:103015`, `48453:239852`, `48453:367134`, `48453:445501` |
| Panel declines what its route draws, XD-2 (1) | `48309:187374` (Waco) |
| Card and draw route tables disagree (7) | `48209:140047`, `48209:142415`, `48209:145880`, `48209:166141`, `48209:97658`, `48453:239852`, `48453:367134` |
| Two impervious figures (1) | `48453:367134` |

Separately, 7 codified buckets where the draw route itself does not draw (Kyle, Austin's Hays part,
Leander, Cedar Park, Round Rock and Buda in Travis, San Marcos's Caldwell part). Say for each whether it
is a reason-ownership problem (this row) or a route that genuinely cannot draw (not this row: name it
and leave it).

A trap for the probe itself, already fixed on the seat's side: every MCP answer carries a
`smartSiteVocabulary` glossary that lists "Withheld, setbacks unruled"; that is a dictionary, not a
claim, and the probe no longer scans it. Do not "fix" the glossary.

### What to build

1. **One owner for the reason (P-339).** Find every place on the panel path and the MCP path that
   composes an envelope reason, status or disclosure on its own, and make it read the drawing route's
   answer (or the field the drawing route itself writes) instead. Name each site and what you did.
   A surface that cannot reach the route's answer says so as a declared state; it never falls back to
   its own composition.
2. **One table (P-340).** Where the card and the draw route resolve different tables, both read the
   same resolution: most-current source wins (the effective date read at source, P-270's vintage
   module where a citation carries one); an unreadable date on either side produces a conflict row
   naming both tables and both sources.
3. **Both impervious figures, the stricter governing (P-341).** Every surface that shows impervious
   cover shows the governing figure (the lower percentage) and cites both, each with its source.

### Verify by violation

Pre-register your falsifiers before you run them, and state what result would prove each wrong.

- Revert-and-run on fixtures built from live payload shapes for each class: the pre-change code
  produces the contradiction, the post-change code does not, and a parcel that was honest before
  (the outline-drawn, figure-withheld shape of `48309:103015`) reads byte-identical.
- A fixture where the route declines: every surface declines with the route's reason, never its own.
- A fixture with two tables of different dates: the newer serves; with an unreadable date: a conflict
  row with both.
- Name the exact probe runs and expected results for after the seat deploys: the three classes read
  zero on the P-254 fixture set, and XD-2 CLOSED.

### The three-question gate

Answer in your close: what executes the single reason, what triggers it, what fails when a surface
composes its own again, and what bypasses it (the PDF, the share view, the bake's own text).

### Constraints

- No store writes, no deploys, no merges.
- County 48491 (Williamson): its R-keyed parcels read `record_retired` on the MCP until P-350
  republishes; that is XD-6, not this row. Do not touch any Williamson store.
- hauska-map main carries P-332 (#419) in `atom-chain-to-facets.ts`, `pe-property-atoms.ts` and
  `pe-record-to-facets.ts`; branch from current `origin/main` and keep its ETJ changes intact.
- P-354 (future-dated rule rows) is in flight on the citation vintage modules in both repos. If you
  must touch `setback-citation-vintage.ts` / `setbackCitationVintage.ts`, say so in your close so the
  seat can order the merges.

### Close

Declare: the start commits and PRs, every reason-composing site found and changed, the fixtures with
both directions shown, the probe runs you name for after the deploy, the three-question gate answers,
and `leave_behind`.
