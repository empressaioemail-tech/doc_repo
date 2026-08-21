# DFW onboarding scratch (Tier 2 — planner session 2026-08-04)

## GROUND-TRUTH — 9-county substrate (2026-08-04 evening)

| FIPS | County | Geometry | Land-use | Tier-1 | zoning-facts | Land-use note |
|---|---|---|---|---|---|---|
| 48397 | Rockwall | done | gap | done | 52,420 | blank STAT_LAND_ |
| 48139 | Ellis | done | gap | done | ~98,150 | blank STAT_LAND_ |
| 48257 | Kaufman | done | **75.3% / 100% owner-match** | done | 93,292 | real-at-ceiling |
| 48251 | Johnson | done | gap | done | 100,603 | blank STAT_LAND_ |
| 48367 | Parker | done | gap | done | 92,583 | blank STAT_LAND_ |
| 48085 | Collin | done | **99.4% / 100% owner-match** | done | 387,334 | real-at-ceiling |
| 48121 | Denton | done | **86.6% / 100% owner-match** | done | 351,798 | real-at-ceiling |
| 48439 | Tarrant | done | **99.4% / 100% owner-match** | done | 689,838 | tier1: 689,838 new + 67,318 upgrade |
| 48113 | Dallas | done | **92.8% / 100% owner-match** | done | 693,556 | used --batch=500 |

**Phase 1 upstream lane: 9/9 complete** (2026-08-04). All counties geometry in txgio_parcel. Central-TX baseline unchanged (48021=74,729 txgio / 62,260 zoning-facts). Tarrant + Dallas Bastrop verifies: `_inbox/2026-08-04_tarrant_bastrop_verify.log`, `_inbox/2026-08-04_dallas_bastrop_verify.log`.

**Bastrop invariant:** 62,260 zoning-facts verified after every county batch.

## LESSON

- Large counties (694k+ parcels): use `--batch=500` on tier-1 and breadth bakes — default batch=200 OFFSET pagination degrades quadratically (~80+ min vs ~55 min).
- Parallel executor agents (3-4 at a time) work when each county is county-scoped; planner adversarially verifies Bastrop count.
- Use `$env:VAR` not `$var` in PowerShell across shell invocations.
- Before resuming a stalled breadth bake, check whether the background agent is still running (terminals folder / log mtime). Tarrant got a duplicate `bake-property-atom-county` apply (planner resume overlapped [Tarrant pipeline agent](774186f8-e56a-4d4a-bedc-112d8a931879)); upsert idempotency made it harmless but ~$1.40 wasted compute.
- Verify final atom count matches dry-run target before closing a county.

## OPEN

- Phase 3 factory lane per county (registry + cadastral recon); Rockwall cadastral HOLD.
- **DONE 2026-08-05:** Kaufman full cert lane — preflight 7/8 (parcelLayerWired DECLINE expected for empty districtField), cert 20/20 blockPass, warden sweep posted (ledger 200). Artifacts: `_inbox/2026-08-05_kaufman_preflight_gate.json`, `_inbox/2026-08-05_kaufman_cert.json`, `_inbox/2026-08-05_kaufman_warden_sweep.json`.
- **NEXT:** Ellis (48139) cascade + gate + cert (registry row on PR #254; Halff `pid` layer).
- Phase 4 city source recon.
- Ledger POST to cortex-api ingest (optional at factory-lane close).

## GROUND-TRUTH (2026-08-05 Phase 3 kickoff)

- GROUND-TRUTH: engine main pulled to 498cae3 (PR #250 cost gate + #247/#248 sampling fixes).
- GROUND-TRUTH: Kaufman + Ellis Phase 1 breadth complete (93,292 / 98,150 zoning-facts) but cascade envelope declines NOT YET RUN (unzoned_declines=0 pre-cascade).
- GROUND-TRUTH: Bastrop invariant 52,726 unzoned declines unchanged after DFW Phase 1.
- LESSON: Ellis ECAD (ecgis.co.ellis.tx.us) unreachable from planner network; Halff Prairielands layer confirmed with `pid` field — requires propIdField threading (landed engine PR).
- LESSON: Kaufman BIS KaufmanCADWebService/0 layer 0 = Parcels, prop_id field, roster sample 48257:1000 resolves live.
- GROUND-TRUTH (2026-08-05T17:20Z): Kaufman warden sweep clean=false, 20 flags — neighborConsistency 0; servePathTruth 10 (zoningFactPresent served-vs-DB on unzoned — triage as Warden v1 noise, do not edit warden scripts); crossStoreConsistency 9 (cascade-missing on no-district-on-record sample picks); certFreshness 1 (artifact timestamp field mismatch on extracted JSON).
