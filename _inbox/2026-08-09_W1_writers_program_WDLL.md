# WDLL: W1 writers program (the launch-gate ceiling breaker)

Date: 2026-08-09  Status: draft
Operator approval: pending
Governs: OPS-14 workstream W1. Executing brief: Handoff D (dispatched 2026-08-09); D-lane numbers map to acceptance items below. Adversarial review is in-process per OPS-14 dispatch model: every item's evidence includes both reviewer artifacts (post-build and post-apply), never the builder's word alone.

## Done looks like

Every one of the 12 rails in `county_rail` has a live writer, so no ledger cell anywhere in Texas reads `no-writer`. The three merged writers (cad-parcel-roll, land-use-fact, flood-hazard-fact) have run statewide over the data that exists, with typed honest absence where it does not, and their atoms serve to a customer surface with provenance. Every new family carries an accessPolicy assigned at mint. The completeness number moves because measurement happened, and every count quoted traces to a pasted query.

## Acceptance items

1. Parcel-node sweep CLOSED with artifact: two identical `SELECT count(*)` reads 10 minutes apart on the atoms store, final county and atom counts recorded in a close artifact file | check: the artifact file plus the two timestamped query outputs | grade: [ ]
2. Geometry scorer re-run (dry then apply); ledger `satisfiedCells` and `texasCompletenessPct` rise | check: before/after county-ledger summary JSON pasted | grade: [ ]
3. accessPolicy assigned per family BEFORE its first statewide write, recorded per family; any public-tier proposal flagged to operator | check: close artifact lists family to policy mapping | grade: [ ]
4. cad-parcel-roll run over every county with `cad_property` data; typed join-hold or absence elsewhere; per-county counts match pre-registered source SQL | check: count table plus reviewer checkpoint artifacts | grade: [ ]
5. flood-hazard-fact run statewide (txgio joined to `tx_fema_nfhl_flood_zone`); empty-zone counties produce typed absence, never silent zero | check: count table, absence-state distribution, reviewer artifacts | grade: [ ]
6. land-use-fact run over the txgio-to-cad_property join counties | check: same evidence shape as item 4 | grade: [ ]
7. Rail refresh applied after runs; ledger displayState deltas reflect the new atoms | check: county-ledger before/after displayState breakdown | grade: [ ]
8. Footprints writer BUILT and proven on one county (ML-derived default, `sourceTier=ml-derived` per ADR-029) | check: dry-run artifact, both reviewer artifacts, one-county apply, serve probe | grade: [ ]
9. Easements writer BUILT; provenanced honest absence is the primary output; McLennan CAD linework and City of Bastrop polygons written as the present-data exceptions | check: absence atoms carry provenance; exception counties show data | grade: [ ]
10. Owner writer BUILT after its accessPolicy ruling lands (owner names at scale need an explicit policy) | check: ruling recorded, writer proven on one county | grade: [ ]
11. RRC and MUD writers BUILT, gated on their W2 acquisition lanes delivering source data | check: proven on one county each once data exists | grade: [ ]
12. Roads writer LAST, gated on the roads statewide ingest (Handoff F lane F5, all six unblockers) | check: dependency respected in dispatch order; writer proven post-ingest | grade: [ ]
13. Joint E2E probe per family: one full write, read, serve trace on a real parcel through cortex/retrieval to the customer surface, verbatim | check: one artifact per family | grade: [ ]
14. `county_rail` shows `has_writer=true` on all 12 rails | check: pasted SQL result | grade: [ ]
15. Every lane carries BOTH adversarial reviewer artifacts (post-build with pre-registered expectations, post-apply from an independent frame) | check: reviewer files exist per lane; a lane without them is not graded met | grade: [ ]

## Amendments

(none yet)

## Finish card (graded at close)

(pending)
