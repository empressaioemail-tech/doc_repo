---
id: 2026-07-24_post_breadth_three_gaps_MILESTONE
title: Milestone — post-breadth three gaps close (jurisdiction + zeros + setback emit)
status: active
date: 2026-07-24
applies_to: legacy-design-tools, hauska-engine, doc_repo
owner: nick
---

# Milestone: post-breadth three gaps closed

Date: 2026-07-24  
WDLL: `_inbox/2026-07-24_post_breadth_three_gaps_WDLL.md`  
Phase 2: not opened.

## Verbatim CI (merge on green)

### LDT #353 (Step 1 — already merged earlier this session)

```
Rubric unit tests	pass	1m16s	https://github.com/empressaioemail-tech/legacy-design-tools/actions/runs/30117648087/job/89562167388	
Test	pass	8m11s	https://github.com/empressaioemail-tech/legacy-design-tools/actions/runs/30117648038/job/89562167356	
Typecheck	pass	1m59s	https://github.com/empressaioemail-tech/legacy-design-tools/actions/runs/30117648038/job/89562167288	
```

Merged: `696c28b` (`fix(cad-ingest): Austin zoning wire + SA under-stamp paging/OCL/flush (#353)`).

### LDT #354 (Step 2 wires + paging harden)

```
Test	pass	7m39s	https://github.com/empressaioemail-tech/legacy-design-tools/actions/runs/30118780998/job/89565919853	
Typecheck	pass	2m2s	https://github.com/empressaioemail-tech/legacy-design-tools/actions/runs/30118780998/job/89565919795	
```

Merged: `3326846` (`fix(cad-ingest): wire Guadalupe/McLennan/Bell zoning + harden ArcGIS paging (#354)`).

### hauska-engine #115 (Step 3 setback emit)

```
typecheck + test	pass	1m32s	https://github.com/empressaioemail-tech/hauska-engine/actions/runs/30120289588/job/89570928664	
```

Merged: `2d5f378` (`feat(property-reasoning): emit setback-RULE from PIP cityKey table` + CI Python worker deps).

## Step 1 — per-parcel zoning jurisdiction (WDLL 1–4)

MET. Migration `0062_txgio_parcel_zoning_jurisdiction.sql` applied live. Stamp persists PIP `cityKey` as `zoning_jurisdiction`. `resolveZoningJurisdiction(parcel)` is PIP-authoritative; `wiredZoningCityKeys` returns a Set; `soleZoningJurisdictionKey` always null. Tier-1 CLI consumes per-parcel key.

Live Travis after Austin+Pflugerville re-stamp (verbatim SQL aggregate):

```json
{"county_fips":"48453","n":894657,"z":295689,"j":295684,"z_pct":"33.05"}
```

by_jurisdiction: austin-tx 269285, pflugerville-tx 26399.

## Step 2 — honest-ZERO counties re-probe (WDLL 5)

BEFORE (breadth milestone): Guadalupe / McLennan / Bell at 0% zoning. Classification was wrong: unwired published city layers, not genuine unzoned counties (same class as Bexar under-stamp, plus missing registry entries).

### Dry-run 5k match rates (before any write)

| City | County | Polygons indexed | Matched / 5k | Rate | Verdict |
|---|---|---|---|---|---|
| Seguin | 48187 | 15213 | 1618 | 32.4% | fixable |
| Cibolo | 48187 | 620 | 415 | 8.3% | fixable |
| Waco | 48309 | 6332 | 695 | 13.9% | fixable |
| Killeen | 48027 | 5479 (after paging fix) | 1539 | 30.8% | fixable |
| Belton | 48027 | 1227 | 391 | 7.8% | fixable |

Paging harden in #354: honor `maxRecordCount`, continue on `exceededTransferLimit`, fetch `f=json` rings (Killeen geojson 400s mid-layer).

### Full stamp AFTER (live Neon)

| County | FIPS | zoning % | jurisdiction rows | Wired cities |
|---|---|---|---|---|
| Guadalupe | 48187 | **30.95%** (32967/106508) | 32967 | seguin-tx 18609, cibolo-tx 14358 |
| McLennan | 48309 | **39.60%** (51735/130650) | 51735 | waco-tx 51735 |
| Bell | 48027 | **34.91%** (64391/184470) | 64391 | killeen-tx 54588, belton-tx 9803 |

### Zeros that stay zero (honest)

- **Temple TX** (Bell): no verified public FeatureServer as of 2026-07-24 (ArcGIS search empty; candidate services9 layer owned by unrelated `lvcoks`). Temple city footprint inside Bell remains zoning-null until a published layer is found.
- **Schertz TX** (Guadalupe): city open data has parcels/boundary; no public zoning FeatureServer in search. Schertz footprint remains null.
- Unincorporated / outside PIP: remain null (true fact).

Temple and Schertz are **real source gaps** (no public layer), not paging bugs. Seguin/Cibolo/Waco/Killeen/Belton were **fixable** (unwired).

## Step 3 — setback emit (WDLL 6)

MET on named live parcels. Engine bake looks up adapter setback table by `zoning.jurisdictionKey` (PIP cityKey). Emits setback-RULE with `sourceCodeAtomRef.role=rule` citing fan-gift `atom_did`. Envelope DERIVED composes from fact+rule refs; uses `provisional-front-edge` while Tier-1 stays anti-zombie (`atom_path_pending`, no embedded dims). Keeps WDLL 3.7.

Tables ported to engine adapters: `austin-tx.json`, `san-antonio-tx.json`.

### Live atom chains (verbatim emit+write 2026-07-24)

**Austin SF-3** — `48453:225513` (`zoning_jurisdiction=austin-tx`):

```json
{
  "notes": ["zoning", "setback", "envelope"],
  "atoms": [
    {"entityType": "zoning-fact", "atomDid": "did:hauska:zoning-fact:48453:225513", "district": "SF-3"},
    {"entityType": "setback-rule", "atomDid": "did:hauska:setback-rule:48453:225513", "front": 25, "side": 5, "rear": 10,
     "sourceCodeAtomRef": {"atomDid": "austin_tx/ldc/25-2-492/25-2-492", "role": "rule", "entityType": "code-section"}},
    {"entityType": "buildable-envelope", "atomDid": "did:hauska:buildable-envelope:48453:225513",
     "outcome": {"kind": "provisional-front-edge"},
     "reasoningChain": {"reasoningKind": "derived", "derivationMethod": "buildable-envelope-inset-v1",
       "inputAtomRefs": [
         {"atomDid": "did:hauska:zoning-fact:48453:225513", "role": "fact", "entityType": "zoning-fact"},
         {"atomDid": "did:hauska:setback-rule:48453:225513", "role": "rule", "entityType": "setback-rule"}
       ]}}
  ]
}
```

**San Antonio R-6** — `48029:105129` (`zoning_jurisdiction=san-antonio-tx`):

```json
{
  "notes": ["zoning", "setback", "envelope"],
  "atoms": [
    {"entityType": "zoning-fact", "atomDid": "did:hauska:zoning-fact:48029:105129", "district": "R-6"},
    {"entityType": "setback-rule", "atomDid": "did:hauska:setback-rule:48029:105129", "front": 10, "side": 5, "rear": 20,
     "sourceCodeAtomRef": {"atomDid": "san_antonio_tx/udc/35-310.01/35-310.01", "role": "rule", "entityType": "code-section"}},
    {"entityType": "buildable-envelope", "atomDid": "did:hauska:buildable-envelope:48029:105129",
     "outcome": {"kind": "provisional-front-edge"},
     "reasoningChain": {"reasoningKind": "derived",
       "inputAtomRefs": [
         {"atomDid": "did:hauska:zoning-fact:48029:105129", "role": "fact"},
         {"atomDid": "did:hauska:setback-rule:48029:105129", "role": "rule"}
       ]}}
  ]
}
```

**Honest absence** — `48453:0` (null district + null jurisdiction):

```json
{
  "notes": ["zoning-absence"],
  "flags": {"zoningPresent": false, "setbackPresent": false, "envelopePresent": false, "zoningAbsence": true},
  "atoms": [{
    "entityType": "zoning-fact",
    "atomDid": "did:hauska:zoning-fact:48453:0",
    "absence": {"kind": "no-zoning-stamp", "reason": "No zoning district observed for parcel — honest absence, no fallback district invented."}
  }]
}
```

## Cost (I-H)

| Work | Approx |
|---|---|
| Zoning stamps (5 new cities + Austin/Pflugerville/SA re-stamp) | Public ArcGIS GET + Neon UPDATEs; no LLM |
| Live demo chain write (3 parcels) | ~3.4s wall; substrate write units ≪ $1 |
| Tier-1 refresh Guadalupe/McLennan/Bell | in flight; deterministic SQL; under $200/county gate |

All under $200/county.

## WDLL re-grade

| # | Item | Grade | Evidence |
|---|---|---|---|
| 1 | `zoning_jurisdiction` column + stamp | MET | migration 0062; Travis j=295684 |
| 2 | `resolveZoningJurisdiction` + Set helper | MET | #353 code + tests |
| 3 | Tier-1 per-parcel + Travis SET tests | MET | jurisdictions.test.ts; Tier1 CLI |
| 4 | #353 green + merge | MET | checks paste above |
| 5 | Zero-county probe; stamp only fixable | MET | dry-run table; AFTER %; Temple/Schertz named stays |
| 6 | Setback emit + live chains | MET | chains above; engine #115 |
| 7 | Milestone + cost + no Phase 2 | MET | this file |

## Aside (planner; not fixed)

Regrid adapter tests still live under `lib/adapters` (regrid:parcels trial token) despite Cotality sole-spine purge 2026-06-17. Out of scope for #353/#354/#115.

## Follow-through (Tier-1 + atom re-bake)

Tier-1 refresh completed for all three. Property-atom county re-bake completed (`exit 0`, ~27 min wall). Ledgers: `breadth-ledgers/{48187,48309,48027}.json`.

| County | parcelsSeen | zoningPresent | setbackPresent | approxUsd |
|---|---|---|---|---|
| Guadalupe 48187 | 93,728 | 30,613 (32.7%) | 0 | $0.19 |
| McLennan 48309 | 114,255 | 48,441 (42.4%) | 0 | $0.23 |
| Bell 48027 | 165,574 | 61,170 (36.9%) | 0 | $0.34 |

`setbackPresent: 0` is expected: Seguin/Cibolo/Waco/Killeen/Belton have **SETBACK TABLE OWED** (no engine adapter JSON yet). Zoning-FACT emits; setback notes `setback-table-missing:<cityKey>`. Austin/SA setback tables are the ones that emit RULE (demonstrated on named parcels above). Guadalupe flagged `completed-with-spike-flags` (windowed absence spikes vs baseline) — consistent with multi-city + unincorporated mix, not a silent no-answer.

### Austin / Pflugerville / SA jurisdiction re-stamp (complete)

`exit 0`. Live Neon after:

| City | Matched | Rows updated |
|---|---|---|
| austin-tx | 252,080 | 269,288 |
| pflugerville-tx | 24,086 | 26,399 |
| san-antonio-tx | 418,604 | 436,800 |

County jurisdiction fill: Travis **j=295,684** (33.05%; austin 269,285 + pflugerville 26,399); Bexar **j=436,800** (58.46%; all san-antonio-tx).

### Travis / Bexar Tier-1 + atom re-bake (complete)

`exit 0`. Atom ledgers `48453.json` / `48029.json`:

| County | parcelsSeen | zoningPresent | setbackPresent | envelopePresent | approxUsd |
|---|---|---|---|---|---|
| Travis 48453 | 380,918 | 233,247 (**61.2%**) | **150,702 (39.6%)** | **150,702 (39.6%)** | $1.40 |
| Bexar 48029 | 703,258 | 416,454 (**59.2%**) | **406,597 (57.8%)** | **406,597 (57.8%)** | $3.14 |

Setback/envelope at scale confirms PIP `jurisdictionKey` → adapter table → RULE + DERIVED (was 0% on the prior breadth bake). Both under $200 gate. Spike flags are windowed absence monitors, not emit errors (`emitErrors: 0`).
