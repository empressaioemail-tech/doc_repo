# cc-agent-C close — investor radar Cotality depth (legacy-design-tools)

**Date:** 2026-06-17  
**Branch:** `cortex/investor-radar-cotality-depth`  
**PR:** https://github.com/empressaioemail-tech/legacy-design-tools/pull/185  
**Base:** `main` @ `a31218b5`  
**Dispatch:** `_dispatches/2026-06-17_cc-agent-C_investor_radar_cotality_depth.md` (supersedes 2026-06-16 backend dispatch; lead engine CUT)

---

## Dependency set vs live main

| Area | Change |
|------|--------|
| **Adapters** | Regrid removed from `FEDERAL_ADAPTERS`; `COTALITY_INVESTOR_DEPTH_ADAPTERS` registered; new export `./national/cotalityInvestorDepth` |
| **api-server** | Cotality-only `brokerageSiteContext`, tier gate, parcel-key, pencils-at-$X, investor verdict, OZ adapter, MUD/PID registry fixture, auth signup/reset UI, brief route integration |
| **DB** | Migration `0041_brokerage_user_profiles.sql` + fixture refresh |
| **Deploy** | `cloud-run-deploy.yml` adds `BROKERAGE_DEV_API_KEY` + `BROKERAGE_EXTENSION_PUBLIC_KEY` to `--set-secrets`; `docs/deploy.md` Regrid → Cotality |
| **Deferred** | Task 11 map-data consume (waits cc-agent-E layer capability + cc-agent-M gate) |
| **Out of scope** | Coverage warm (61a) — queued track after this dispatch |

---

## Migration

**`0041_brokerage_user_profiles`** — tenant-private investor profile keyed by `owner_user_id`: package tier, buy-box JSON, dialogue-by-CLIP JSON, depth meter remainder.

---

## New adapter keys

**Registry (`lib/adapters/src/national/cotalityInvestorDepth.ts`):**

| Key | Purpose |
|-----|---------|
| `cotality:rent-avm` | Rent AVM + rental trends |
| `cotality:liens-mortgage-tax` | Liens/mortgage/tax + per-parcel MUD/PID scan |
| `cotality:permits` | Permits depth |
| `cotality:propensity` | Propensity depth (not a feed) |
| `cotality:owner-occupancy` | Owner-occupancy depth |
| `cotality:sinkhole` | Karst/sinkhole |
| `cotality:foundation` | Foundation type |

**api-server local (not in `FEDERAL_ADAPTERS`):**

| Key | Purpose |
|-----|---------|
| `national:opportunity-zone` | OZ 1.0 tract fixture (`oz-1.0.geojson`) |

Existing Cotality spine unchanged: `cotality:parcels`, `cotality:zoning`, `cotality:property`, extended pack (`climate`, `hazards`, `replacementcost`, etc.).

---

## MUD/PID finding

1. **Per-parcel (task 3):** `extractMudPidAssessmentFlags` in `cotalityInvestorDepth.ts` scans Cotality tax/assessment payload for MUD/PID/special-district strings; surfaced on `cotality:liens-mortgage-tax` layer summary and investor verdict `mudPidLine`.
2. **Horizontal (task 10 / 61a):** `mudPidRegistry.ts` + `data/tx-special-districts.json` — **sample fixture only**, not live TX Comptroller ingest. `summarizeMudPidExposure` joins county/name when registry matches.

---

## Precedence status

**Not wired to Property Brief.** Brief response includes:

```json
"precedenceStatus": {
  "wired": false,
  "note": "Plan-review precedence resolver is not yet wired on the Property Brief path — 61 audit gap; reasoning cites code atoms only."
}
```

LLM prompts flag precedence gap when `corpusStatus` is not `ready`.

---

## Tasks completed

| Task | Status |
|------|--------|
| 1 Regrid purge + G1 brokerage-key secrets | Done |
| 3 Cotality investor depth on /brief | Done |
| 4 Rehab-reality + can-I-add-a-unit reasoning | Done |
| 5 Pencils at $X | Done |
| 6 Verdict reframe + profile + dialogue | Done |
| 7 Parcel-key capture + `POST /parcel-key` | Done |
| 8 Signup + styled extension-login + reset request | Done |
| 9 Free/Pro/Max tier + depth meter | Done |
| 10 OZ ingest + MUD/PID horizontal fixture | Done (OZ fixture; MUD/PID registry sample) |
| 11 Map-data consume | **Deferred** (E/M) |

---

## Verbatim test output

### `pnpm --filter @workspace/adapters test`

```
 Test Files  19 passed (19)
      Tests  283 passed (283)
   Start at  12:41:41
   Duration  2.17s (transform 1.60s, setup 0ms, collect 4.92s, tests 2.06s, environment 3ms, prepare 3.11s)
```

### `pnpm --filter @workspace/api-server test -- brokerage investorRadar`

```
 Test Files  13 passed (13)
      Tests  52 passed (52)
   Start at  12:41:44
   Duration  31.70s (transform 3.08s, setup 405ms, collect 12.69s, tests 121.56s, environment 2ms, prepare 2.05s)
```

### `pnpm --filter @workspace/db test -- schema.integration`

```
 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  12:41:13
   Duration  21.16s (transform 247ms, setup 0ms, collect 746ms, tests 20.00s, environment 0ms, prepare 85ms)
```

### `pnpm run typecheck`

Exit code 0 (all 7 artifact scopes + libs).

Full adapter/brokerage logs also captured locally at `scripts/_adapters-test-output.txt` and `scripts/_brokerage-test-output-final.txt` (not committed).

---

## Notes

- Free-tier depth meter excludes baseline `cotality:parcels` / `cotality:zoning` from COGS metering (fix: meter applies only to paid depth adapters).
- `brokerageGtm.test.ts` gained `@workspace/db` ctx.schema proxy (was missing; caused 500s against wrong schema).
- No hand-deploy; merge via PR #185 → CI → Cloud Run workflow.
