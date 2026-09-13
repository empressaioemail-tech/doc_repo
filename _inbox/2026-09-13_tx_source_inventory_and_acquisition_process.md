---
id: 2026-09-13_tx_source_inventory_and_acquisition_process
title: Texas source inventory, measured — and the acquisition process that follows from it
date: 2026-09-13
status: draft
kind: working-notes
owner: nick
supersedes_framing_in: _inbox/2026-09-13_national_scale_working_notes.md
related: [_catalog/tx_cad_source_inventory.json, _catalog/tx_cad_source_registry.json, _catalog/tx_cad_source_registry_coverage_summary.md, 90_operations/OPS-1_texas_source_registry, 90_operations/OPS-19_factory_plan_of_record]
---

# Texas source inventory, measured

> **NOT CANON. NO PLAN ROW.** Working notes. Every figure below is produced by
> `scripts/tx-cad-source-inventory.mjs --report` reading the 254 statewide probe
> artifacts, and is reproducible by re-running it.
>
> **Claim scope: SOURCE AVAILABILITY ONLY.** Not data-loaded, not served-to-product.
> Those are three different states per the OPS-1 doctrine note, and collapsing them is
> the exact error that produced the previous draft's wrong conclusion.

## 1. The data was already on disk

`_inbox/t6_cad_probe_<fips>.json` — **254 artifacts**, one per Texas county, written by
the statewide probe batch on 2026-08-05. Only tranche 1 (35 counties) was ever
transformed into `_catalog/tx_cad_source_registry.json`. The other 219 have sat
unaggregated, which is why "how many counties have a CAD source" kept getting argued
from memory.

```
  probe artifacts        254
  reachable at source    176      url + a successful sample query or feature count
  url present, unproven   19      endpoint exists, probe proved nothing. RE-PROBE.
  absent at source        59      no service url found
  parcels countable    9,198,711  across the 176 reachable counties
```

**Correction to the previous draft.** It reported "217 counties have no CAD landing" and
then reasoned as though that meant no source exists. `TX-LANDING-ABSENT` means *we have
not ingested it*. It says nothing about whether a source exists. 195 of 254 counties
publish an endpoint. The operator was right; the earlier framing was wrong.

## 2. The lever: one platform, not 254 integrations

```
  host class of the 195 counties that publish an endpoint
  -------------------------------------------------------
  arcgis-online   182   services*.arcgis.com  (Esri-hosted ArcGIS Online)
  self-hosted      12
  arcgis-other      1
```

**93% of Texas counties with a CAD source are on one self-describing REST platform.**

That is the whole scaling argument, and it is measured rather than assumed. An ArcGIS
FeatureServer publishes its own layer list, field list and domain codes, and answers a
uniform query API. So per-county work is not an integration. It is a **registry row**:
service url, layer id, prop_id field, field mapping.

And the probe artifacts already carry those fields. Turning 219 unaggregated probes into
registry rows is a data transformation, not engineering.

## 3. Three outcome classes, all of them honest

```
  REACHABLE (176)   one ArcGIS adapter + a registry row derived from the probe.
                    The bulk of the state. No bespoke code per county.

  UNPROVEN (19)     endpoint exists, the probe proved nothing.
                    Re-probe. Resolves into reachable or absent. Never guessed.

  ABSENT (59)       no public CAD endpoint found.
                    -> cite honest absence
                    -> StratMap geometry still applies
                    -> this county is a SmartCity OS conversation
```

**Absent does not mean the county gets nothing.** StratMap publishes parcel geometry for
253 of 254 counties, and terrain, flood, roads, footprints and soils are federal and
uniform. A CAD-absent county is missing owner, value and land-use. It is not missing a
map, a parcel boundary, a floodplain or a topo.

Worth naming: **Harris (48201) is in the absent list.** The largest county in Texas needs
its own path regardless of how well the other 194 go.

## 4. The absent list is a pipeline, not a gap

Operator ruling, 2026-09-13: a county whose appraisal district is not online is an
opportunity, not a failure. We can approach them and offer to bring it online.

That reframes 59 rows from a coverage hole into a named, evidenced prospect list for
SmartCity OS, with a probe artifact per county showing exactly what is missing. Nobody
else selling to those counties can show them that.

It also means the acquisition program and the govtech program share an input, which is
the first time those two have had a mechanical connection rather than a thematic one.

## 5. The process

```
  1. AGGREGATE          219 unaggregated probes -> registry rows.
                        Data transformation. The fields are already captured.

  2. RE-PROBE the 19    unproven -> reachable or absent. No county stays unproven.

  3. ONE ADAPTER        ArcGIS FeatureServer, driven by registry rows.
                        Covers 182. Exceptions handled after, not first.

  4. INGEST BY CLASS    not county by county. All arcgis-online counties move
                        together because they are the same shape.

  5. HONEST ABSENCE     59 counties get cited absence + geometry + federal layers,
                        and land on the SmartCity prospect list.

  6. EXCEPTIONS LAST    12 self-hosted, 1 arcgis-other, Dallas bulk-only, Harris.
                        Each is its own small piece of work, and none of them
                        blocks the other 182.
```

The ordering principle: **do the class, not the county.** The previous approach took a
county end to end and then started the next one, which is why per-county cost never fell.

## 6. What every county gets regardless of CAD

Independent of any appraisal district, and uniform in all 50 states:

```
  terrain / topography     USGS 3DEP
  flood                    FEMA NFHL
  roads                    Census TIGER
  boundaries               Census TIGER
  building footprints      Overture / Microsoft
  soils                    USDA NRCS
  pipelines                PHMSA NPMS
  parcel geometry (TX)     TxGIO StratMap, 253/254 source-available
```

That is a real product on day one in every county in America, with or without a CAD
roll, plus downloadable shapefiles. The CAD layer deepens it; it is not the gate on
having anything at all.

## 7. Already on disk versus still owed

```
  ON DISK                                     OWED
  --------------------------------------      --------------------------------
  254 probe artifacts (2026-08-05)            aggregate 219 into registry rows
  35 registry rows (tranche 1)                re-probe the 19 unproven
  reproducible inventory instrument           one ArcGIS adapter driven by registry
  9.2M parcels countable at source            Harris path
  StratMap zips, 253/254                      Dallas bulk path
  federal layers, uniform                     12 self-hosted adapters
```

## 8. What this does not claim

Nothing here says any of it is loaded or served. `txgio_parcel` held 196 of 254 counties
at last check, `txgio_address` held 6, and CAD landing covers 37. Source availability,
data loaded, and served to product remain three different states.

The 19 unproven counties are unproven, not absent and not reachable. They are counted
separately on purpose.

No cost figures appear in this document, deliberately. The previous draft's economics
were built on a number traced to a setback-depth pass over roughly 5,769 parcels, and on
a cost model that had been recalibrated to clear its own gate with the external-call term
removed. Estimates built on that are worse than no estimate.
