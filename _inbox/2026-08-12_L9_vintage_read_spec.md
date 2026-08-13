---
title: CAD vintage read spec — the rule that gates the L9 full-county loads
date: 2026-08-12
status: active-spec
plan_row: P-25
author: doc_repo planner
gates: L9 announce-approved full loads (Tarrant PropertyData(Delimited).ZIP, Dallas DCAD2026_CERTIFIED)
---

# CAD vintage read spec

## The problem it solves

The L9 pilot proved that a bulk CAD load ADDS rows at the export's tax_year rather than enriching the
StratMap rows (Tarrant: 689,838 rows at tax_year 2025 + 5,000 new rows at 2026; 4,991/5,000 prop_id
overlap). A full load therefore creates two parallel vintages per county. Undefined, that is a silent
coin-flip in every reader: which row a writer, scorer, or product facet sees depends on accidental query
shape. This spec makes the choice explicit and fail-closed BEFORE any full load runs.

## The invariant

**Every reader of `cad_property` filters to the county's single DECLARED vintage. No reader ever mixes
vintages within one county in one derivation, and no reader ever falls back to another vintage
silently.**

## Rules

1. **Declared vintage lives in the registry.** `_catalog/tx_cad_source_registry.json` gains per-county
   `current_tax_year` + `current_tier`. It is flipped ONLY at load completion (rule 4), never mid-load.
   Loading rows never changes what readers see until the flip.
2. **All readers filter on it.** Writers-that-read (owner-fact, land-use-fact, cad-parcel-roll), the
   scorer, and product facet reads take `WHERE tax_year = <declared>` for the county. The atom body
   already carries `taxYear` + the tier stamp (`source_vintage`), so provenance survives per row.
3. **Fail closed on vintage gaps.** If the declared vintage yields zero rows for a prop that exists in
   another vintage, that is an honest absence with basis `vintage-gap`, NOT a silent read from the other
   vintage. Falling back is fine only as a NAMED, recorded decision per county (same doctrine as
   source_tier_satisfied).
4. **Load sequence per county:** (a) full load at new vintage alongside old; (b) reconcile the two
   vintages — row counts, prop_id overlap, field-coverage deltas (two numbers that should agree; report
   divergence, do not tune it away); (c) flip `current_tax_year`/`current_tier` in the registry;
   (d) QUEUE the county's dependent rail re-applies (owner, landuse, cad-roll) for the atoms slot —
   existing atoms stay honest (they carry their taxYear) but stale until re-applied; (e) rescore.
5. **Old vintage rows are retained** (lineage / future time-series). Pruning is a separate ruling.
6. **Hook, not protocol:** add greppable CI on cad-ingest + readers — `ci-vintage-predicate`: any query
   touching `cad_property` without a `tax_year` predicate (or going through the one blessed
   vintage-resolver helper) fails CI. One blessed helper resolves declared vintage; everything imports
   it.

## What this unblocks

With rules 1-6 in a merged PR (helper + registry fields + CI grep + the reader swaps), the announce gate
for the Tarrant and Dallas full loads is satisfied from the read side. The loads then serialize with the
planner per the L9 close (L1 shares the Neon).

## Explicitly out of scope

Cross-vintage time-series products; pruning; changing which vintage the 15 already-applied counties
serve (they stay 2025 until their re-apply is queued and run).
