# Dispatch: T5 Williamson PARCELID — engine PR (string CAD fetch + registry)

**Date:** 2026-08-05  
**WDLL:** `90_operations/T5_factory_throughput_track.md` (acceptance item 2 follow-on; cert lane blocked on main without this)  
**Acceptance items:** 2 (engine #254 adoption — Williamson amendment)  
**Repo:** `empressaioemail-tech/hauska-engine`  
**Base:** `origin/main` @ `90dea02` (includes merged #254 `31aa37e`)

## Authorization

Planner follow-up to [Williamson 48491 cascade+cert](706b9155-0936-4596-91a4-cc893c0bdc02). Cert **20/20** was graded with **local uncommitted fixes**; main without this PR cannot re-run Williamson cert/roster CAD ring fetch. Merge and CI green required before calling Williamson durable on main.

## Ground truth

- Williamson StratMap node ids are **`R*` PARCELID** strings (157,936/157,937 cascaded parcels), not numeric `PropertyID`.
- Merged #254 threads `propIdField` but stock `fetchBcadParcelRings` only built numeric `IN (...)` — roster/cert ring resolution returned empty for `R*` ids.
- Local diff (uncommitted on executor checkout, 2026-08-05):
  - `packages/engine-core/src/boundary-primitive/lot-line-scrub.ts` — quoted string `IN` when ids are non-numeric; numeric path unchanged.
  - `packages/engine-core/src/registry/jurisdiction-registry.ts` — Williamson `propIdField: "PARCELID"` (was `"PropertyID"`).
- Cert artifact with local fixes: `_inbox/2026-08-05_williamson_cert_20of20.json` (20/20 blockPass).
- Cascade apply on main (no cert dependency): dry=apply **282,570 / 157,937 / 0** — already verified.

## Tasks

1. Branch from main: `fix/williamson-parcelid-string-cad-fetch` — **PR #261** https://github.com/empressaioemail-tech/hauska-engine/pull/261
2. Apply the two-file diff above (or equivalent); do **not** commit probe/roster helper scripts under `packages/engine-core/scripts/_*`.
3. Add/adjust unit test: `fetchBcadParcelRings` where clause uses quoted strings when prop ids are non-numeric (mock or fixture acceptable).
4. Open PR; gate on CI conclusion string **success**.
5. After merge: re-run block13 regression (expect same 6/7 pre-existing on `48021:34177` — not Williamson-induced).

## Status (2026-08-06)

- **PR #261 MERGED** `634a2a4` — CI success
- **Main re-cert:** 20/20 blockPass — `_inbox/2026-08-05_williamson_cert_main_repro.json` (engine SHA pinned in artifact `when`)
- **Ledger:** cert-grade ingest POST ok

## Out of scope

- Bexar sharded cascade (separate dispatch; uses `PropID` per #254).
- OPS-1 registry doc update (planner will flip `48491` row to `PARCELID` on merge).

## Evidence to attach

- PR URL
- CI green screenshot or `gh pr checks` output
- Optional: one-liner cert re-run on main post-merge confirming roster rings resolve (same 20/20)
