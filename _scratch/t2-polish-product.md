# T2 polish + product — scratch (Tier 2)

## GROUND-TRUTH (2026-08-05)

- Product-surface smoke suite landed: `90_runbooks/product_surface_smoke_suite.md` + `scripts/product-surface-smoke.mjs`. Linked from `factory_onboarding_runbook.md` §5.
- Dry-run live 2026-08-05T19:29Z: **16/16 PASS** on engine/retrieval health, `/health/search`, 3 Bastrop parcels card-vs-sheet setbacks + envelope sanity. Artifact `_scratch/product-surface-smoke-last.json`.
- Paywall operator E2E runbook: `90_runbooks/pe_paywall_e2e_operator.md` (4 actions: unlock price secret, dev-role, promo E2E, claim smoke). Operator still owes the four actions; code/deploy already live.

## OPEN

- Operator run of pe_paywall_e2e_operator.md actions 1–4 → re-grade WDLL 1–3, 8.
- Optional: wire RETRIEVAL_API_KEY into CI/local for full `/search` Bearer probe (health/search already covers functional search).
