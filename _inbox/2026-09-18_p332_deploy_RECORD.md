---
id: 2026-09-18_p332_deploy_RECORD
title: P-332 deployed to Property Explorer production and graded on the customer surface
date: 2026-09-18
last_updated: 2026-09-18 (15:30Z)
status: done; graded PASS in both directions
kind: production-write record
owner: nick
maintained_by: integration seat
programs: [OPS-24, OPS-16]
plan_rows: [P-332]
snapshot: hauska-map main 163fde32 (#419), fresh clone P:/tmp/hauska-map-p332-deploy-0918; Vercel project property-explorer
---

# P-332 deploy, 2026-09-18

**Source.** hauska-map `163fde32` (PR #419 merged after `gh pr update-branch` onto `facd3927`, all three
checks `SUCCESS` on the updated head `a0721a0a`). Fresh clone, clean tree; the `.env.local` that `vercel
link` writes (it held only `VERCEL_OIDC_TOKEN`) was removed before the deploy so it could not be uploaded.

**Rollback target.** `property-explorer-1qrscbkcf` (the production deployment before this one, 14h old).

**Deploy.** `vercel deploy --prod --yes` from the repo root (the project's Root Directory setting
builds `apps/property-explorer`). New production deployment `property-explorer-m6wqid8u7`
(`dpl_CtkVJ9wKJhocGnEc7j5MzZJihdhC`), `● Ready`, 42 s. The CLI printed the known per-function
TS2339 typecheck noise (`api/auth.ts`, `pe-share-instrument.ts`, `pe-site-plan-export-core.ts`,
`pe-share-grant.ts`), which is non-blocking; exit 0. `vercel inspect smartsite.cloud` names
`m6wqid8u7`.

**Grade: the lane's named probe, conflict case last.** Route
`https://smartsite.cloud/api/spine/property-atoms/<id>/facets`, field `cityLimitsFact`.

| Parcel | Before (15:10:52Z, `1qrscbkcf`) | After (15:28:27Z, `m6wqid8u7`) | Expected (P-332 close) |
|---|---|---|---|
| `48209:97658` | `etjStatus: unresolved`, no `etjFact`, no `etjConflict` | `etjStatus: absent`, `etjFact.coveredBy ["san-marcos-tx"]`, `ringsConsulted 1`, no `etjConflict` | absent, coveredBy san-marcos-tx, 1 ring, no conflict |
| `48453:134392` | `etjStatus: unresolved`, no `etjConflict` | `etjStatus: conflicting`, `etjConflict` naming `cityLimits` (incorporated, Austin, `tx_city_boundary`, basis `landing_parcel_jurisdiction`) and `etj` (present) | conflicting, both sources and both bases named |

Both directions hold: the pre-deploy reads are the defect, the post-deploy reads are the fix, on the
same parcels and route. **P-332 is customer-closed on the panel.** The PDF still hardcodes the answer
(P-358); the probe has no ETJ leg yet (P-360).
