---
title: RPT1 — Existing report surface inventory (grounding for the feasibility study)
status: active
last_updated: 2026-08-12
owner: planner
type: inventory
scope: hauska-map (property-explorer), hauska-engine (site-plan), hauska-mcp-server, legacy-design-tools
---

# RPT1 — Existing report surface inventory

Grounding inventory for the proposed multi-page FEASIBILITY STUDY report and the later COMPARISON report. This is not a design. It establishes what exists today so a spec can reuse it rather than reinvent it.

The operator's hard constraint governs the whole document: do not regress the styling in the site plan and flood study. That styling IS the template.

**Headline answer: the styling can be reused wholesale, and the reuse is already proven twice. The real obstacles to a feasibility study are not visual at all — they are data reach and delivery plumbing.**

## Repo staleness (checked first, as instructed)

Three of four checkouts were not on main. Every finding below was read from `origin/main` via `git show`, never the working tree.

| Repo | Local branch | Local HEAD | origin/main | On main |
|---|---|---|---|---|
| hauska-map | fix/console-derive-rail-list | 31b4534 | 848b6e2 | no |
| legacy-design-tools | feat/s1-instrument-hardening | 10069854 | 48c4eb89 | no |
| hauska-engine | DETACHED HEAD | 89d4c08 | 8d8e880 | no |
| hauska-mcp-server | main | b5f26de | b5f26de | yes |

The engine working tree does not contain PRs #315, #316 or #317. Anyone reading that checkout directly would give wrong answers about the flood PostGIS path.

## 1. The download menu as the user sees it

The surface is `P:\hauska-map\apps\property-explorer\src\workbench\tools\ReportsTool.tsx`. It is not a flat list. It is one dock bubble holding three independently gated sections, and there is a ninth artifact on a different surface entirely.

| Item | Format | Section | Gate |
|---|---|---|---|
| PDF site-plan sheet | pdf | Site-plan | property unlock ($15) or Pro |
| DXF site plan (layered) | dxf | Site-plan | property unlock or Pro |
| IFC site plan (layered, solid terrain) | ifc | Site-plan | property unlock or Pro |
| Export PDF sheet (Flood and Drainage) | pdf | Flood | property unlock or Pro |
| GLB mesh | glb | Terrain | PRO ONLY |
| IFC4 triangulated | ifc | Terrain | PRO ONLY |
| DXF 3DFACE surface | dxf | Terrain | PRO ONLY |
| DXF contour polylines | dxf | Terrain | PRO ONLY |
| Export dossier PDF | pdf | NOT in Reports — dossier detail view | property entitlement |

Site-plan formats come from `SITE_PLAN_FORMAT_OPTIONS` at `sitePlanExportClient.ts:16-20`; terrain from `TERRAIN_FORMAT_OPTIONS` at `terrainExportClient.ts:12-20`. The flood export has no picker at all, its format is pinned to `pdf-flood-drainage` at `floodDrainageClient.ts:16`.

Terrain being Pro-only while site-plan and flood sit in the $15 unlock is explicit, not incidental: `ReportsTool.tsx:47` and the `terrainProLocked` gate at `ReportsTool.tsx:133`. Where a feasibility study lands is an unmade pricing call.

No handler in this menu is a stub. Every one traces to a live MCP tool and a live engine emitter.

### The plumbing constraint nobody would guess from the UI

Site-plan, flood-drainage and dossier all ride ONE Vercel serverless function, `api/pe-site-plan-export.ts`, dispatched by query parameter (`?report=flood-drainage`, `?kind=dossier`). The reason is recorded in code at `pe-site-plan-export.ts:17-19`: the Vercel 11/12 function cap. `apps/property-explorer/vercel.json` confirms only `pe-site-plan-export` and `pe-terrain-export` have rewrites.

A new report must fold into that same function as a third query-param leg. It cannot claim its own route. This also means one function now carries three reports, so a dispatch regression takes out all three at once.

## 2. The existing sheets and how they are generated

All three are generated server-side in the engine, in `packages/engine-core/src/site-plan/pdf/`.

**Site plan** — `render.ts:2596 emitPdfSitePlan`. Three sheets is a FLOOR, not a count. `render.ts:193-194` warns explicitly: use `countSitePlanSheets(model)` (`render.ts:2767`), never assume 3, because overflow pagination inserts summary continuation sheets. Sheet 1 drawing, sheet 2 summary, sheet 3 summary/continuation. Triggered by the Export site plan button at `SitePlanExportSection.tsx:190` through MCP `refresh_parcel_site_plan_export` to `author.ts:481`.

**Flood study** — `flood-drainage.ts emitPdfFloodDrainage`. Exactly two sheets (`FLOOD_DRAINAGE_TOTAL_SHEETS = 2`, `flood-drainage.ts:118`): sheet 1 is the drawing over an aerial backdrop, sheet 2 the summary. Fixed, no overflow.

**Property dossier** — `dossier.ts emitPdfDossier`. Variable page count. This is the one that matters most for the spec, because it is already the multi-section composed document the feasibility study wants to be: cover with verdict line and contents manifest, then brief facts, then an optional AI research summary, then optional owner notes, then **the entire site-plan sheet set appended and renumbered "Sheet N of TOTAL" across the whole document** via the render.ts numbering seam.

The dossier is the precedent. A feasibility study is the same move with a different section list.

## 3. The styling system — the most important finding

**It is fully centralised, it is written down, and it is defended by tests.** Nothing here is duplicated per sheet.

The binding standard is a written document: `packages/engine-core/src/site-plan/pdf/SHEET_STANDARD_v1.html`, 177 lines across 21 numbered sections. The tokens live in exactly one module, `template-tokens.ts`, whose header states the rule directly: these tokens are ported verbatim from `ds-industry.css`, the operator's site-plan template, and this is the single place the renderer resolves colour, spacing and type from — never hard-code a hex, font size or letter-spacing that a token already carries.

**Fonts.** Barlow (body, Regular and Medium) and Barlow Condensed (display, Medium and SemiBold), all OFL, vendored at `packages/engine-core/assets/fonts/` and embedded via `@pdf-lib/fontkit`. Vertical metrics are read from the font file itself (`fontVerticalMetrics`, `render.ts:122-131`), never guessed, so a font swap retunes the whole vertical rhythm automatically.

**Page setup.** US Letter, 612 x 792 PDF points. The design source is an 816 x 1056 px sheet at 96dpi, converted by `PX_TO_PT = 0.75`. Margins: top 48px, sides 46px, bottom 36px at 96dpi. Portrait.

**Colour.** Eleven neutrals from `#f5f5f8` sheet ground down to `#1d1f20` text ink, plus ONE accent hue — steel `#5980a6` with a nine-step ramp. The single-accent discipline is stated in the token file and enforced in practice: when the dossier needed to distinguish its AI-summary section it used a muted rule and a suppressed label rather than a new colour.

**Type scale.** Roles, not sizes: eyebrow 11px tracked 0.22em, address 30px condensed uppercase, subline 13px, stat label 10px, stat value 22px, group heading 10.5px tracked 0.2em, row label 11.5px, row value 13px, table head and cell 11px, legend 11px, fine print 8.2px, chip 9.5px. A hard floor of 10px rendered for any drawing string.

**Vertical rhythm.** Line heights 1.6 body, 1.1 display, 1.55 fine print, consumed through a real line-box model (`line-box.ts`) with a `RhythmCapture` auditor. Rows are placed by `placeRowBelowRule()`, not by hand-tuned y values, and `vertical-rhythm.test.ts` guards it.

**Header, every page.** Accent eyebrow reading `BRAND · ROLE · SHEET N OF M` (the brand kicker is `SMART SITE`, `render.ts:203`; flood uses `FLOOD & DRAINAGE`; dossier has its own), then the address in 30px condensed uppercase, then a city/parcel/county subline, then a right-aligned stats row (LOT / BUILDABLE / ZONING), then a full-width 1px full-ink rule that closes the header. The rule's y position is deterministic via `headerRuleY()` so imagery can be sized before the header is drawn. No drawing mark may cross it.

**Footer, every page.** Rows hang from a footer rule. A legend block (swatch, sentence-case label, inline reason) sits above a fine-print band. The fine print is composed per sheet by `buildFinePrint()` as a sentence list — honesty line, disclaimers, provenance, and a trailing "Sheet N of M". **The page number is a sentence in the fine-print run, not a separate stamp.** A new report that stamps its own page numbers would double-number the composed document.

Every sheet carries the honesty line verbatim: "Derived from public GIS records. Not a boundary survey. Not for legal record."

**Tables.** The canonical table is the three-column provenance panel — layer, source, confidence, one row per layer (`provenance.ts`). Header row is tracked condensed-medium caps. Confidence is a fixed six-value enum plus at most one qualifier: asserted, rule, sample, centerline accurate, honest absence, honest unavailable. Machine identifiers are permitted in the source column only.

**Honest absence.** Three layered mechanisms, all already factored out. First, chips — `UNAVAILABLE`, `FIXTURE LABEL`, `NO ADDRESS`, drawn by `drawChipOnLineBox()`. Second, a fixed `REASON` map of eleven plain sentences: "No zoning record on file for this parcel.", "No setback rule on file; setbacks not specified or verified.", "No road node attaches to this parcel.", "Flood data was not queried on this run.", and so on. Third, a prose-hygiene gate: `sheetReason()` accepts an upstream reason only if `isCleanReasonSentence()` passes — must end in a period, twelve words or fewer, no colon anywhere, no machine-code pattern, no nested parentheses. Otherwise the fixed fallback substitutes. The no-colon rule was added after a live sheet leaked a machine string on 2026-07-28.

Section 5 of the standard puts it plainly: empty layers must look intentional. An absent layer gets a legend row with a swatch and a reason, and a provenance row reading source "unavailable", confidence "honest absence". Never a blank.

### The reuse seam already exists by name

`render.ts:2802-2807` carries an explicit export block, commented:

> `@internal` shared sheet primitives for sibling assemblers in this directory (the property-dossier assembler, dossier.ts). These are the Standard's building blocks — tokens ride in template-tokens.ts; these are the drawing and rhythm helpers that keep a sibling document in the SAME design language instead of re-inventing it.

It exports `LB`, `METRICS`, `MarkRegistry`, the page and margin constants, `drawChipOnLineBox`, `drawFinePrint`, `drawHairlineRule`, `drawHeaderStats`, `drawSectionHeading`, `drawTrackedText`, `drawRing`, `drawFilledRing`, `drawPolyline`, `drawNorthArrow`, `loadFont`, `streetOnly`, `cityFromAddress`, `trackedWidth`, `wrapTextToWidth`, and the `Fonts` and `HeaderStat` types.

A feasibility study is exactly a "sibling assembler". The architecture already anticipates it.

Eleven regression tests guard the standard, including a harness that decodes emitted PDF text so assertions run against the real bytes.

## 4. The site plan model

`site-model.ts:262`, composed once at `author.ts:412`. Slots: parcelNodeId, ringLocal, propertySegments, setback (with per-axis notSpecified, honest absence, degenerate state and front-edge basis), contours, contourIntervalMeters, elevationLabels, streets (anchors with optional ROW edges, plus honest absence), north, scaleBar, verticalDatum, crsConvention, summary (address, zoning, lot area, buildable area with display vocabulary, elevation range, flood zone), and citations.

Notably, zoning, floodZone, envelopeOutcome, descriptor, streetAnchors and boundaryEdges are all optional inputs, and each carries an explicit honest-absence variant in its input union. The model was designed for partial data.

**Footprint: confirmed absent.** `git grep -iE 'footprint'` across the entire `site-plan/` directory on current origin/main returns zero hits — not in the model, layout, emitters, renderer, tests, fixtures, or the standard document. The prior scope's finding holds. `building-footprint` is a registered property atom type but has no consumer in any deliverable. For a report aimed at architects and engineers this is the most consequential absence and it is invisible from the docs.

## 5. Flood computation

Confirmed real and stronger than the operator's description.

`flood-drainage-study.ts:runFloodDrainageStudy`, authored and persisted by `flood-drainage-author.ts:59`, rendered by `flood-drainage.ts`. Method is D8 flow accumulation over the public USGS 3DEP elevation model, run in a hydrology worker.

Inputs: the parcel ring, a 3DEP DEM over a padded catchment bbox (pad factor 2.5, floor 250m, ceiling 1500m), rainfall depth from a live NOAA Atlas 14 point estimate with a documented 9.5 inch fallback and a `rainfallSource` field recording which was used, resolution 10m default with a 3m floor, and a 100-year design storm.

Outputs: catchment, drainage zones, ponding, flow lines, flow paths and catchment swaths, a gradient raster (this is what draws on the main map), flow exits with bearings, a stats block (catchment area, ponded area, flow exit count, pour point and method), a prose briefing, a computation block naming the library and routing with a fallback flag, DEM provenance, and three distinct honest-empty reasons (computation, DEM void, flat terrain).

**Warm is not required.** The author calls the study first and only afterwards touches storage, and only to find an existing `parcel-terrain-model` atom to update — if none exists it mints one. The only real precondition is that the geometry resolver returns a parcel ring.

It persists two artifacts: `pdf-flood-drainage` and `json-flood-drainage-study`. **A feasibility study should read that persisted JSON rather than re-run the DEM fetch.**

This derived per-parcel study is a different thing from the statewide `flood-hazard-fact` atom apply (178 counties) and from the PostGIS PIP plan backend merged as engine PR #315. Do not conflate them.

## 6. CAD export — one model drives everything

The answer the operator hoped for. In `author.ts`, one model is composed at line 412 and that same binding is passed to all three emitters: DXF at line 500, IFC at line 501, PDF at line 593.

The invariant is stated in code twice. `emitters.ts:51-53`: the DXF worker payload is built straight from the shared model, no re-derivation. `layout.ts:22-27`: the PDF drawing renders the same ring, setback, contour and street points every DXF and IFC entity is built from — CAD and PDF cannot diverge, and no function in the layout file re-derives geometry. Section 18 of the standard is titled "ONE GEOMETRY, TWO SHEETS". Four parity tests enforce it.

Consequence: any slot added to `SitePlanModel` reaches PDF, DXF and IFC simultaneously. A footprint layer, once modelled, would appear on all three for free — but would also inherit the full parity-test burden.

The only divergence is deliberate and presentational: the CAD emitters see full DEM contours and full street centerlines, while the PDF layout clips both to a parcel buffer for readability.

Terrain exports (GLB, IFC4, DXF 3DFACE, DXF contour) are a separate leg through `/api/pe-terrain-export`, not driven by the site-plan model.

## 7. Report run persistence — the charter claim does not hold here

A `report_run` table genuinely exists: `legacy-design-tools/lib/db/src/schema/reportRun.ts`, migration `0054_report_run.sql`, with real insert/upsert/delete helpers and a watchdog.

But it is not the parcel report ledger. Two disqualifying facts:

Its primary key is `(engagement_id, report_type)` — keyed by engagement, the AEC-cortex plan-review path, not by parcelNodeId. Its report-type vocabulary is the plan-review set only: compliance, topography, drainage, hydrology, hazard, encumbrances, brief, subsurface, avm. None of the PE download-menu artifacts appear in it.

And its own doc comment states: "This table is run STATE, not a result store." It exists to fix a multi-instance Cloud Run bug where a status GET landing on the wrong instance saw "not-run". It is not an audit trail.

Searching the MCP server for `report_run`, `reportRun` or `report-run` across all of `src` returns zero hits.

What does persist on the PE path: the `parcel-terrain-model` atom's artifacts map (dxf/ifc/pdf site-plan, pdf and json flood-drainage), a client-side dossier `exports[]` entry per kind and format holding a re-download path and never bytes, and the Reports dock's per-property terminal snapshot.

So there is artifact persistence but no run-level ledger. **A feasibility-study spec must not assume it inherits report-run persistence.** The Cortex charter sentence is true for the plan-review surface and false for the parcel surface.

## 8. Atom chain slots — the single largest gap

The prior scope's finding is confirmed unchanged on current main.

`hauska-mcp-server/src/property-atom-chain.ts` exposes **three slots**: zoning-fact, setback-rule, buildable-envelope. Four entity types including the parcel-node anchor. And the DID regex at line 98 hardcodes those same four names, so the constraint is double-encoded — widening the slot list alone would not widen DID resolution.

The engine registers **sixteen** property entity types (`packages/atoms/src/property-instances.ts:188-206`, count asserted at 16 in `parcel-node-registration.test.ts:64`).

Reachable through the chain: zoning-fact, setback-rule, buildable-envelope (plus parcel-node as anchor).

Not reachable: parcel-terrain-model, building-footprint, utility-easement, flood-hazard-fact, cad-parcel-roll, land-use-fact, owner-fact, rail-corridor-fact, well-fact, special-district-fact, road-node, rrc-pipeline-fact. **Twelve of sixteen.**

One nuance worth holding: unreachable through the chain tool is not unreachable everywhere. The export authors reach `parcel-terrain-model` directly engine-side via `listPropertyAtomsByParcelNodeId()`, and `road-node` via `resolve-attaching-roads.ts`. But for a report composer consuming the MCP property-atom-chain — the documented composition path — only three families are addressable.

Every atom family this program has spent recent weeks writing statewide is on the unreachable list. **A feasibility study is precisely the document that wants those.**

And the list is hand-maintained. The MCP literal is declared independently of the engine's, with no cross-repo test binding them. The engine grew to 16 while MCP stayed at 4 and nothing detected it. Same failure shape as the `has_writer` hand-declaration finding.

## Reuse assessment

**Can a new multi-page report be composed from the existing styling and model without restyling? YES — and with high confidence, because it has already been done twice.**

`dossier.ts` imports fifteen primitives from `render.ts`, all tokens from `template-tokens.ts`, rhythm from `line-box.ts`, chips from `format.ts` and the honesty line from `provenance.ts` — and its own header states it is governed by the same binding SHEET_STANDARD_v1.html as the site-plan renderer it sits beside. `flood-drainage.ts` does the same. Two shipped sibling documents, zero restyling.

### What to reuse

The token module `template-tokens.ts` for every colour, size, space, stroke and tracking value. The shared-primitives export block at `render.ts:2808`. `buildFinePrint` and `headerRuleY` at `render.ts:2799`. The line-box rhythm model. The `format.ts` chip, confidence, reason and number-formatting vocabulary. `provenance.ts` for the honesty line and the three-column panel builder. `countSitePlanSheets` plus the `SheetNumbering` seam for cross-document page numbering. `aerial.ts` for a backdrop. `layout.ts` if the study reproduces the site drawing. The persisted `json-flood-drainage-study` artifact rather than a fresh DEM run.

And structurally: **copy `dossier.ts`.** It is the reference implementation of exactly this document shape.

On the PE side: copy `SitePlanExportSection.tsx` for the section shape (format picker, honest 401/402/422/502 handling, source citation and confidence lines, honest-absence notices, honesty line, persisted snapshot), and fold the BFF leg into `pe-site-plan-export.ts` as a third query-param branch.

For the later comparison report, `compare-facts.ts:118` already holds `COMPARE_ROWS` — a seven-row, two-slot comparison model with honest-absence cells and per-fact source captions.

### What would force a restyle (the operator's red line)

Introducing a second accent hue. The standard is one accent, steel. When the dossier needed visual separation it used a muted rule and a suppressed label rather than a colour.

Hard-coding any hex, size or tracking instead of resolving a token. Rule 10 of the standard forbids it and the token file says so in its header.

Hand-placing y coordinates instead of using the line-box model. `vertical-rhythm.test.ts` would fail.

Drawing any stroke at or above the property line's 1.6pt weight. Section 3 makes the property line the heaviest mark on any sheet.

Rendering an unavailable field as a blank, a dash or "N/A" instead of a chip plus a reason sentence.

Letting a machine identifier onto the sheet outside the provenance source column.

Emitting a standalone page-number stamp instead of flowing through `buildFinePrint` and the `SheetNumbering` seam — that double-numbers a composed document.

Bypassing `MarkRegistry`, which reintroduces the double-bearing-tag bug section 14 exists to prevent.

And the sharpest one: **adding a new colour or type token to `template-tokens.ts` to serve the feasibility study specifically.** That mutates the shared template and propagates straight into the site plan and flood study — the literal thing the operator said not to touch.

### The real blockers

Ranked by severity, none of them visual.

**Atom reach, high.** Three slots of sixteen types. Every recently-built atom family is unreachable to a report composer. Without widening this, a feasibility study can be little more than a restyled site plan.

**No footprint, medium-high.** Zero hits across the whole site-plan surface. No existing-structure layer on PDF, DXF or IFC. Material for an architect and engineer audience.

**Vercel function cap, medium.** The new report must fold into `pe-site-plan-export.ts` as a query-param leg, not claim a route.

**No report-run ledger on this surface, medium.** If the study needs an audit trail, that is new work.

**Terrain is Pro-only, low but a decision.** Site-plan and flood are in the $15 unlock; terrain is not. Where the feasibility study lands is an unmade pricing call enforced in three places.

### Comparison report groundwork

Partial. `CompareTool.tsx` and `compare-facts.ts` ship a working two-slot, seven-row comparison (zoning district, setbacks F/S/R, buildable, flood, land use, acreage, snapshot) with present/absent/pending cell states, per-fact source captions, and honest `not verified here` copy in place of blanks.

But it is UI only. No PDF, no engine-side assembler, capped at two slots. The comparison report inherits a data model and a vocabulary, not a document. Do not let "we already have compare" read as "we already have a comparison report".

## Adversarial notes

Per the standing instruction, every capability above is cited to a code path rather than a doc or comment. Three claims did not survive that test.

**Report-run persistence for the parcel surface does not exist.** The table is real but engagement-keyed, plan-review-scoped, and self-described as run state rather than a result store. The MCP server has zero references to it. Quoting the Cortex charter as a live parcel capability would be an instrument-not-data defect.

**The atom-chain slot list is a hand-maintained literal with no cross-repo guard,** and the constraint is double-encoded in a regex. This is the same failure shape as `has_writer`.

**"Three-page site plan" is wrong as a fixed number.** It is a floor; the renderer explicitly warns against assuming it. A spec that hard-codes 3 will mis-number every appended page.

Two claims proved stronger than stated. The flood computation is a genuine D8 hydrology run with live NOAA rainfall and a machine-readable persisted artifact, requiring no warm parcel. And the styling system is, unusually for this program, exactly what it claims: a written standard, one token module, font metrics read from the font, a deliberate sibling-assembler export seam, eleven regression tests, and two documents already built on it without restyling.

The operator's constraint is not at risk from adding a report. It is at risk only from someone adding a token or hard-coding a hex.
