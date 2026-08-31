# QA2 — site-plan PDF craft samples

Branch: `qa/site-plan-craft` (hauska-engine).

## Samples

| Parcel | File | Notes |
|---|---|---|
| Big (Chestnut) | `48021_34785_site_plan.pdf` | Live TxGIO ring + synthetic DEM |
| Small dense | `qa2_dense-small_site_plan.pdf` | Crowded synthetic ring for label QA |

## Regenerate

```
cd P:/hauska-engine/packages/engine-core
npx tsx scripts/generate-site-plan-gold-34785.mjs P:/doc_repo/_inbox/2026-07-27_qa2_site_plan_craft_samples
npx tsx scripts/generate-site-plan-gold-dense-qa2.mjs P:/doc_repo/_inbox/2026-07-27_qa2_site_plan_craft_samples
```

Planner + operator: open both PDFs before grading MET. Builder does not self-grade craft.
