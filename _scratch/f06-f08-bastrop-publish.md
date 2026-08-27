# F-06/F-07/F-08 Bastrop publish scratch

## Wrong instrument (filed 2026-08-27T22:00Z per planner A-011)

Probe and conformant tier1 bake used **entity_id prefix**, not **jurisdiction_tenant**:

```sql
-- WRONG (returned 0 conformant-v1 on staging MCP 2026-08-27 ~20:00Z)
SELECT count(*)::int AS n FROM atoms
 WHERE entity_type = 'cad-parcel-roll'
   AND entity_id LIKE '48021:%'
   AND coalesce(body->>'shape', '') = 'conformant-v1';
```

Also filed as `WRONG_CONFORMANT_COUNT_SQL` in `hauska-factory/src/lib/conformant-store-predicate.mjs`.

**Correct predicate (V11 grader / planner 21:50Z):**

```sql
SELECT coalesce(body->>'shape', '(none)') AS shape, count(*)::int AS n
  FROM atoms
 WHERE entity_type = 'cad-parcel-roll'
   AND jurisdiction_tenant = '48021'
 GROUP BY 1 ORDER BY n DESC;
-- conformant-v1: 77,799 rows; applies-to links: 77,799 (production hauska_mcp)
```

Old-shape rows do not carry `jurisdiction_tenant = '48021'`. Staging branch (post 17:00Z reset) carries the same conformant rows.

## Ground truth

GROUND-TRUTH (2026-08-27T22:00Z): Item 2 MET (planner verified). Cortex staging `cortex-api-00606-loh` tagged `staging`; STAGING_* secrets v3/v4 in legacy-design-tools-prod; hauska-prod `STAGING_NEONDB_URL` + `STAGING_HAUSKA_MCP_URL` secrets created for publish jobs.

LESSON (A-011): No bake or walk from laptop against any store. Publish bakes run via `factory-bastrop-publish` Cloud Run job (LDT in `Dockerfile.publish`).

LESSON: Item 6 verify-walk grades **conformant-v1 provenance per layer** (`BP-CONFORMANT-01`); old-shape `node-facets-tier1-v1` / cad-roll baseline is production only.

## Open

GROUND-TRUTH (2026-08-27T22:50Z): Cloud Build `890e89f1` then `1ed42f0e` SUCCESS — publish image with LDT bakes deployed. `factory-bastrop-publish-8fffp` failed in 5s: ENOENT on `.bin/tsx`; fixed to `node node_modules/tsx/dist/cli.mjs`, rebuild redeployed.

GROUND-TRUTH (2026-08-27T22:55Z): `factory-bastrop-publish-5jlgs` failed in ~26s, exit 1. tsx ENOENT gone. Cloud log shows only `1` — `bastrop-publish.mjs` / tier1 CLI catch blocks print `err.code` (numeric exit code) not stderr. Failure is tier1 conformant bake subprocess, not job startup.

OPEN: Surface bake stderr in bastrop-publish; diagnose tier1 failure (likely serve guard or DB write on conformant row).

OPEN: Item 8 production publish — operator go withheld.
