# L9 CAMA routing scratch (Tier 2) — 2026-08-12

## GROUND-TRUTH — 2026-08-12T23:10Z

- LDT PR #421 merged @ `a8a8942`; CI run `31649175093` conclusion **success**.
- Pilot Tarrant 48439: 5000 rows upserted; cad-export cohort sqft 97.92% / year_built 97.90% / acres 100%; county sqft 0.7046%.
- Live `cad_property` is on **cortex-prod** (fancy-fire-06136146 / neondb). `legacy-design-tools-prod` Neon MCP project has no cad tables.
- Tarrant join key = **GIS_Link** (not Account_Num). Overlap 4991/5000 with 2025 StratMap prop_ids.
- TAD export tax_year=2026; StratMap store rows are tax_year=2025 — upsert ADDS.

## LESSON

- L2 serial-blocker lesson held: join key, tax-year duality, wrong Neon project, DCAD URL encoding, corrupted env secret line — each visible only after prior cleared.
- Falling back silently was the defect; `--allow-stratmap-fallback` + tier stamp is the fix shape.
- Grade structural coverage on the **tier cohort**, not only county %, when multi-vintage rows coexist.

## DEAD-END

- Account_Num as prop_id for Tarrant — does not match store.
- Assuming LDT Neon = CAD store — wrong after wipe/reset.

## OPEN

- Announce + full Tarrant PropertyData(Delimited).ZIP load.
- Announce + Dallas DCAD certified zip first DB proof.
- Drain Bexar / Travis (PACS re-route) / Collin / Denton.
- Optional: `source_tier` column (H1 pattern) replacing vintage-prefix.
