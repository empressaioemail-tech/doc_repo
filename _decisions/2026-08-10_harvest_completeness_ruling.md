---
id: 2026-08-10_harvest_completeness_ruling
title: Harvest completeness — take everything a source carries, on the pass we are already making
date: 2026-08-10
status: decided (operator-ruled)
owner: nick
type: standing decision
related:
  [
    90_runbooks/factory_onboarding_runbook,
    _inbox/2026-08-10_cad_structured_data_gap,
    _decisions/2026-08-01_scale_before_new_layers_sequencing,
    _decisions/2026-08-09_texas_flush_launch_gate,
    90_operations/OPS-15_owner_and_rrc_rail_gap_analysis,
  ]
---

# Harvest completeness

## THE RULING (operator, 2026-08-10)

> *"While we are doing this heavy backfill effort, let's make sure to grab all the data from all the sources we are already touching. If that means more cells on the manifest, so be it."*
>
> *"That goes for EVERY source."*

**When the factory touches a source, it takes everything that source carries — not only the fields a current rail happens to consume.** If the harvested data does not map to an existing rail, that is an argument for a new rail, not an argument for discarding the data.

## Why this is the right call, in one line

**The expensive part is the visit, not the payload.** Acquisition cost is dominated by finding the source, negotiating access, authenticating, paginating, and normalizing identity — all of which we pay whether we take four fields or forty. Going back later for the fields we skipped means paying the entire visit cost a second time, on a source that may have changed vintage, moved, or gone behind a new auth posture in the meantime.

We have now paid that twice-cost at least twice: the T3 recon found in 2026-08-05 that CAMA tabular carries the structural data, recorded it, and moved on without taking it; and the CAD roll ingest routed to StratMap while the registry already flagged Dallas and Tarrant as `bulk_primary: true`.

## What it means concretely

1. **Take the whole payload.** If a REST layer exposes 40 fields and the rail needs 4, persist all 40 (or the full record) with provenance. Storage is cheap — verified 2026-08-10: the entire atoms store is 20 GB and the read path serves sub-second at 10.9M rows. Re-acquisition is not cheap.
2. **Prefer the richest tier the registry knows about.** Where a bulk/CAMA export exists, it is the primary and the REST/StratMap roll is the fallback. Falling back is fine; **falling back SILENTLY is the defect.** Record which tier satisfied the county.
3. **New cells are acceptable and expected.** The operator explicitly accepted manifest growth. The R1 split rule still governs HOW to add them: split on source + geometry, subcategorize on attribute. A new field on an existing source is usually a body field, not a rail; a genuinely different source or geometry is a rail.
4. **Tier honesty in the manifest.** A `cad` cell satisfied from StratMap and one satisfied from a CAD export are not the same fact set. The cell must record which, so a 0%-structural-data county is visible rather than hidden behind a satisfied cell.
5. **This does not license scope creep into new SOURCES.** The ruling is about completeness at sources we already touch, not about adding acquisition targets. The 2026-08-01 scale ruling still governs which new layers get wired and when.

## The instance that produced the ruling

CAD structural data (`_inbox/2026-08-10_cad_structured_data_gap.md`): `cad_property` holds owner at 98.4% and market value at ~98%, but **`living_area_sqft` at 10.5%**, `year_built` at 10.2%, `land_acres` at 16.7% — and it is all-or-nothing per county. Williamson 76.9%, Hays 69.3%, Bastrop 52.7%; **Bexar, Dallas, Tarrant, Travis, Collin and Denton all 0.0%** (~3.3M parcels).

Cause is a source tier: counties with structural data came from direct CAD exports; counties without came from TxGIO StratMap, which carries geometry, owner and value but no building characteristics. Bexar: 703,258 rows, 697,088 owners, **zero** square footage.

## Where else to look — every source we already touch

The ruling says every source, so the audit is every source. Known or suspected under-harvest, to be verified per source rather than assumed:

| Source we already touch | Currently take | Plausibly also carries |
|---|---|---|
| **CAD bulk / CAMA export** | owner, value (via StratMap fallback) | **living area, year built, beds/baths, improvement detail, exemptions, deed refs, sale date + price** |
| TxGIO StratMap parcels | geometry, prop_id, owner, value, situs | legal description, acreage variants, subdivision, block/lot |
| TCEQ water districts | (mud rail, being built) | district id, type, county, acreage, status, creation date — the whole-layer ingest already ruled |
| RRC wells GIS | (wells rail, being built) | API-14, operator, status, type, spud/completion dates, field |
| NTAD rail | (corridor rail, being built) | owner railroad, track class, status, grade-crossing inventory |
| FEMA NFHL | flood zone polygons | base flood elevation, floodway designation, panel + effective date |
| Municipal code corpora | code sections, setbacks | permitted-use tables, overlay districts, PD ordinances, amendment history |
| City GIS (Bastrop pattern) | zoning polygons | future land use, overlays, ETJ, utility CCN, historic districts |
| USGS 3DEP | elevation for terrain/flood | slope, aspect, contour derivatives already computed but not persisted as facts |

**None of these are asserted as gaps.** They are the audit list. Each needs a live field-inventory probe against what the source actually exposes versus what we persist.

## What this changes operationally

- **The factory runbook needs a harvest-completeness step**: before ingesting a source, enumerate its full field list and record which fields are taken, which are skipped, and WHY. A skipped field with a stated reason is fine; a skipped field nobody noticed is the defect this ruling targets.
- **The registry gains a richest-tier routing precedence** so `bulk_primary: true` actually routes.
- **The manifest gains tier provenance** per cell.
- **Sequencing:** this is a backfill-scope expansion, not a new program. It rides the backfill that is already running rather than opening a parallel lane. The launch gate is already drifting by operator ruling, so the added scope does not break a commitment.

## Reversal criteria

Revisit if a source's full payload turns out to carry material we cannot lawfully or ethically hold (a licensed field inside an otherwise public export, or PII beyond public record). The tenant-sovereignty and no-privileged-data rules still bind: harvest completeness never overrides them. Take everything the source lawfully gives us for a no-relationship requester — nothing more.
