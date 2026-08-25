# P-25 Tarrant (48439) cad_property drift classify

**Measured:** 2026-08-25 (read-only SQL on cortex-prod `neondb` via `CORTEX_DATABASE_URL`, gcloud project `hauska-prod-497015`).

**Baseline:** `_inbox/2026-08-14_P25_full_loads_reconcile.md` — **883,954** rows upserted (2026 CAMA full load).

**Current:** **975,885** rows where `county_fips='48439'` and `tax_year=2026` (matches prior probe).

**Delta:** **+91,931** (`975,885 − 883,954`).

## Answers

1. **Row count delta breakdown**
   - Duplicate `(county_fips, prop_id, tax_year)` upserts adding rows: **0** (PK blocks row growth).
   - Net new `prop_id` at `tax_year=2026`: **91,931**.
     - `tad_propertydata_full` cohort net vs baseline: **91,349** (`975,303 − 883,954`).
     - `propertydata(delimited)` cohort (582 keys not in tad_full): **582**.
   - Other tax years in this delta: **0** (scoped to 2026).

2. **`source_vintage` on +delta rows (identifiable)**
   - All **91,931** carry `tier:cad-export;adapter:county-run;drop:` prefix.
   - **91,349** → `…drop:tad_propertydata_full` (ingested **2026-08-25** UTC).
   - **582** → `…drop:propertydata(delimited)` (ingested **2026-08-14** UTC; untouched by Aug-25 reload).

3. **`evidence_class` / tier columns**
   - **Not present** on `public.cad_property`.
   - Tier signal: **`tier:cad-export`** in `source_vintage` on all **975,885** rows.

4. **Re-upsert vs net new keys**
   - **Mostly net new keys:** **91,931** new keys drove the count increase.
   - **~883,954** existing keys were re-upserted on **2026-08-25** (metadata/`ingested_at` refresh) with **no** row-count effect.

## Artifact

Full measure: `_inbox/2026-08-25_p25_tarrant_drift_classify.json`

Git snapshot: `main` @ `9842ed2a038109a66f657a34cb1f07f5620d5d8d`
