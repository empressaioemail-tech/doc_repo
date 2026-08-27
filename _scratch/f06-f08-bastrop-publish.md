# F-06/F-07/F-08 Bastrop publish scratch

GROUND-TRUTH (2026-08-27T19:05Z): cortex-api revision `cortex-api-00603-biq` tagged `staging` at 0% traffic; digest `sha256:67b09026…` (LDT main bd0ff0b); staging secrets `STAGING_DEPLOYMENT_DATABASE_URL` + `STAGING_ATOMS_DATABASE_URL` created empty in legacy-design-tools-prod; `/api/healthz` 200 on staging tag URL.

GROUND-TRUTH (2026-08-27T19:05Z): property-explorer-staging VERCEL production `https://property-explorer-staging.vercel.app` (prebuilt deploy dpl_5hJaijT128); CORTEX_API_URL=staging cortex tag; Factory `/site` → staging PE live (`Smart Site - Explore your property`); `GET /tiles.json` serves manifest on staging PE.

GROUND-TRUTH (2026-08-27T19:05Z): factory-verify-walk job deployed with STAGING_SITE_URL=https://smart-site-factory.vercel.app/site.

GROUND-TRUTH (2026-08-27T17:05Z): migration 0003 via factory-publish-migrate-b4wdp; PRs #11/#235/#493 merged.

LESSON: Vercel staging PE needs rootDirectory `apps/property-explorer` in project settings + `vercel build`/`vercel deploy --prebuilt` from monorepo root; CLI remote build with root `.` serves command-center.

LESSON: PowerShell splits unquoted `--set-env-vars=a,b,c` on commas.

GROUND-TRUTH (2026-08-27T20:22Z): NEON_API_KEY in hauska-prod-497015; staging-reset succeeded; STAGING_* secrets v3 with direct branch hosts; cortex-api-00606-loh tagged staging; tier1 scoped bake (4 walk parcels) on staging neondb; manual verify-walk PASS at Factory /site.

OPEN: conformant-v1 bakes wrote 0 rows — no shape=conformant-v1 on staging MCP (77k legacy cad-parcel-roll only); needs factory-conformant --apply against staging ATOMS URL before conformant tier1 path works.

OPEN: factory-verify-walk Cloud Run job fails FK 23503 (walk_results before verify_walks) — fixed insert order locally; job image rebuild pending.

OPEN: Item 8 production publish — operator go withheld.
