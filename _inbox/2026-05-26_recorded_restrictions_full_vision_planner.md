---
date: 2026-05-26
agent: planner
repo: doc_repo
type: recon
topic: recorded_restrictions_full_vision
related: [49_code_ingestion_pipeline, 27_engine_evolution_plan, 46_smartcity_parcel_intelligence, 08_tiered_access_model, _sessions/2026-05-24_claude_parallel_planning_carryover_claude_code]
---

# Recorded restrictions full vision — planner recon

> **Status:** Planning artifact only. Not canonical. Filed in `_inbox/` for laptop pull; planner sweeps to `_research/` or a 10-band doc when operator locks scope.

> **Origin:** 2026-05-26 strategic conversation — extending Cortex Code Library thinking into deed restrictions, CC&Rs, and private encumbrances. Full vision depth, not MVP-only.

## North star

An agent (or architect, or city planner) opens **430 Evergreen Trl, Cedar Hill** and gets one **constraint lattice**:

1. **Public law** — adopted IRC/IBC + city UDC/zoning (`code-section` atoms, Layer 1/2).
2. **Public overlays** — FEMA, zoning district from Regrid/CAD, aquifer, etc. (`constraint-overlay`).
3. **Private recorded encumbrances** — deed restrictions, CC&Rs, plat notes, easements, HOA architectural rules (`recorded-restriction` and related types).
4. **Operational history** — permits, adjudications, firm precedent (`permit-precedent`, `adjudication-record`).

The "library" experience splits into two catalogs that **compose at the parcel**:

| Catalog | Question | Browse axis |
|---------|----------|-------------|
| **Code catalog** (today's Code Library) | What does the jurisdiction require? | State → city → edition → section |
| **Encumbrance catalog** (new) | What did prior owners and subdivisions bind this parcel to? | Engagement/parcel → subdivision → instrument → clause |

Full vision test (from dossier carryover): send **one `.hatom` bundle** for an address; any Hauska-aware agent renders plans, approvals, **and** the private restriction set with provenance, without re-scraping county sites.

## Why this is not "extend Code Library"

Municipal code is jurisdiction-wide, published via Municode/AmLegal/PDF ingest ([`49_code_ingestion_pipeline.md`](../49_code_ingestion_pipeline.md)). Deed restrictions are parcel- or subdivision-scoped, sourced from county recorder/title/HOA, and almost never `public-free`. Regrid (Cortex site-context baseline per `_decisions/2026-05-23_partnership_first_scoping.md`) does not replace full CC&R text.

Existing registry direction: dossier **layer atoms** include deed records (`_sessions/2026-05-24_claude_parallel_planning_carryover_claude_code.md`); `constraint-overlay` in [`27_engine_evolution_plan.md`](../27_engine_evolution_plan.md) is **regulatory** (FEMA, zoning overlays), not private CC&Rs.

## Taxonomy (instrument classes)

| Instrument class | Typical source | Scope | Plan-review relevance |
|------------------|----------------|-------|------------------------|
| Subdivision plat restrictions | County clerk plat / CAD | All lots in plat | Setbacks, use limits, building lines |
| Declaration of CC&Rs | HOA recording | Subdivision or phase | Use, maintenance, architectural control |
| Supplemental deed restrictions | Owner-to-owner recording | Often one lot | Height, materials, outbuildings |
| Easements | Plat or separate instrument | Appurtenant or utility | Build-over, access, drainage |
| HOA rules & design guidelines | HOA management (often unrecorded) | Subdivision | Aesthetic; weaker legally |
| Master development agreements | City + developer | District | Sometimes stricter than zoning |

Model: **`recorded-instrument`** parent (identity + recording metadata + wet PDF CID) plus **`restriction-clause`** children (enforceable snippets). Unrecorded HOA guidelines: **`administrative-rule`** with `legalWeight: advisory | recorded | municipal-code`.

Findings must distinguish **code violation** vs **covenant violation**; UI must not imply municipal authority for private rules.

## Atom architecture

### Place spine

```
place (parcelDid, geometry, cadastralRef, jurisdictionTenant)
  ├── subject-to → recorded-instrument[]
  ├── overlaid-by → constraint-overlay[]     (public regulatory)
  ├── governed-by → jurisdiction-corpus     (public code)
  └── history → permit-precedent[], finding[], adjudication-record[]
```

`parcel-record.currentZoningCid` links public zoning; private restrictions link via `subject-to`.

### Instrument atoms

**`recorded-instrument`**

- `instrumentType`: plat-restriction | cc-r-declaration | deed-restriction | easement | lien | other
- `recording`: book, page, date, county, instrument number
- `issuerDid` (HOA, developer, county — ADR-015 `actor-record`)
- `sourceDocumentCid` (wet PDF on IPFS per ADR-010)
- `appliesTo`: parcelDid | platId | legalDescription pattern
- `accessPolicy`: tenant-private or engagement-scoped; not `public-free` for full text
- `legalWeight`: recorded
- `supersedes` / `amendedBy` for amendments

**`restriction-clause`**

- Parsed unit: article/section + text + structured fields where extractable
- `parentInstrumentCid`, `confidence`, `extractedBy`, `humanVerifiedAt`
- `constrains` edges to spatial scope when geometry exists
- `references` → `code-section` when CC&R references zoning/code

**`restriction-corpus`** (subdivision-level)

- One ingest per development; many parcels inherit
- `.atompack` export analog: subdivision restriction pack for title/HOA channels

### Constraint lattice resolution

Engine primitive (ADR candidate): **effective constraint set** = compose(model code + amendments, zoning overlays, restriction clauses, precedence rules).

Precedence (must be explicit in ADR, not LLM-implied):

1. More restrictive wins when domains overlap (private can be stricter than zoning; cannot legalize what code forbids).
2. Municipal code wins on life-safety and adopted building code.
3. Recorded instrument wins on purely private covenants where code is silent.
4. Later recording/amendment supersedes earlier clause where indexed.

Output: **`constraint-resolution`** atom or embedded briefing section with `basis`, `precedenceReason`, `confidence`.

### Legal weight and procedure-execution

- DID on clause = derivation attestation, not recorder replacement; wet PDF always alongside (dossier pressure test #2).
- ADR-013 `procedure-execution` for ingest, human verify, findings, adjudication.
- `constrains` edges gate procedure-execution (e.g. approval blocked until variance-record linked).

## Ingest and partnership

| Track | Source | Partnership | Pattern |
|-------|--------|-------------|---------|
| R1 | County clerk / official records | County MOU + API/bulk | Discover by APN → PDF → OCR → clause atoms |
| R2 | Title plants | Stewart / First American / Fidelity (`18_stakeholder_graph.md`) | Nationwide summaries + doc images |
| R3 | HOA / management | Per-subdivision | CC&R + guidelines |
| R4 | User / firm upload | None | Engagement-scoped extract + verify queue |
| R5 | Title commitment PDFs | Via project | Same as R4 |

Partnership-first applies to R1–R3. Regrid scoping does not cover R1.

Pipeline (parallel to code B.1–B.6, not Municode fork):

```
discover → fetch PDF → normalize → atomize → link → eval → index
```

**Eval harness:** coverage, parse fidelity sample, conflict flags (clause vs zoning vs code). Ship with `verificationStatus: machine | human | title-company`.

### Cost model (separate from $200/jurisdiction)

| Unit | Proposed target (needs decision record) |
|------|----------------------------------------|
| Subdivision CC&R corpus (once) | < $500 compute + 2 hr review ~200 lots |
| Single-lot supplemental deed | < $50 + 15 min when corpus exists |
| Net-new subdivision, no corpus | R1 partnership or R4 upload only |

Hard kill: three consecutive parcels need full manual transcription with no R1/R2 partnership → stop scaling that county.

## Tier and commercial

Per [`08_tiered_access_model.md`](../08_tiered_access_model.md):

| Content | Tier |
|---------|------|
| "This parcel has N recorded instruments" (metadata) | Layer 2 or engagement-private |
| Full clause text + reasoning | Layer 2 paid or product-embedded |
| Restriction-aware plan review findings | Layer 3 (Codex/Cortex) |
| Subdivision `.atompack` for title | Embedder / enterprise |

SDK revenue share to issuer: recorder, title plant, or HOA when data drives paid query.

## Product surfaces

**Cortex:** Site/Parcel → Encumbrances tab; briefing constraint lattice; plan review `[[RESTRICTION:clauseCid]]`; Code Library cross-links only.

**Codex:** Code vs covenant findings; different comment-letter language; precedent including HOA variances.

**SmartCity OS:** Parcel Intelligence pre-app briefing includes recorded encumbrances ([`46_smartcity_parcel_intelligence.md`](../46_smartcity_parcel_intelligence.md)).

**Hauska MCP:** `get_encumbrances_for_parcel`, `get_restriction_clause`, `resolve_constraints`, `search_restriction_corpus`; `list_jurisdictions` stays code-only.

**Export:** `.hatom` / `.atompack` with place + instruments + clauses + wet PDFs + constraint-resolution snapshot.

## Plan review engine (full vision)

Same pass that cites IRC also:

1. Loads effective constraint set for `parcelDid`.
2. Extracts plan facts from IFC/sheets.
3. Dual citations where code and covenant both apply.
4. Adjudication on both `code-section` and `restriction-clause`.
5. Lineage on property with `procedure-execution` + attachment CID.

Severity extension: `code-violation` | `covenant-violation` | `conflict-unresolved` | `advisory` (unrecorded HOA guideline).

## Phased delivery

| Phase | Scope |
|-------|--------|
| 0 | ADR scaffold: place, instruments, clauses, constraint-resolution, precedence; premortem + catalog-thesis-check |
| 1 | Upload + atomize; Encumbrances tab; briefing; human verify |
| 2 | Subdivision corpus + inheritance; MCP get_encumbrances |
| 3 | Plan review findings + citations + adjudication lineage |
| 4 | R1 county partnership (one county) |
| 5 | R2 title plant + commercial |
| 6 | Shared `resolve_constraints` in engine (SmartCity + Codex + Cortex) |

**Full vision shipped** when: verified clauses + wet PDF on any engagement parcel; covenant finding with adjudication trail; MCP resolves without UI; one R1 county live; one title/HOA partnership in 73/74.

Queues **after** code catalog stability and Cortex QA close; not substrate v1 / Sync 5.

## Canonical doc set when locked

- ADR: place / parcel spine
- ADR: recorded instruments + restriction clauses
- ADR: constraint resolution + precedence
- ADR: `constrains` + procedure-execution gating
- ADR: dossier `.hatom` manifest
- `49b` or `52_*` encumbrance ingestion pipeline
- 10-band dossier thesis doc
- Updates to `73_partnerships.md`, `27_engine_evolution_plan.md`

## Load-bearing risks

1. Partnership surface area (cities + counties + title + HOAs per market).
2. Legal weight — atoms are substrate, not recorder replacements.
3. HOA unrecorded rules modeled separately from municipal code.
4. False conflicts from bad OCR — human verify before Layer 2 promotion.
5. Focus queue — multi-quarter; sequence explicitly vs Dallas E2E, Sync 5, 40h.

## Operator next cut

Bastrop walk: one platted subdivision, instruments on one lot, R1 vs R4 for first corpus, then Phase 0 ADR scaffold.
