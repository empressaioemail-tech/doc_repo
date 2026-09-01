---
id: 2026-08-25_w5a_cad_owner_landuse_steward
title: W5-A cad/owner/landuse steward (slot check, no apply)
date: 2026-08-25
last_updated: 2026-08-25
status: active
plan_row: P-47
operator_approval: verbal 2026-08-25 named W5
related:
  - _inbox/2026-08-25_factory_operating_instructions.md
  - _inbox/2026-08-24_factory_routing_pin.json
  - _inbox/2026-08-25_leftover_queue.md
  - _inbox/2026-08-25_texas_complete_wave_plan.md
  - _inbox/2026-08-24_county_manifest_dump.json
  - _dispatches/2026-08-25_w5a_dispatch.md
  - _inbox/2026-08-25_w5_slot_check_close.json
---

# W5-A steward

Seat: integration on `P:/doc_repo` `main` `9753b83`. Not a planner seat. Did not write `_state/property`. Did not commit. Did not run atoms `--apply`. Did not rematerialize. Did not take a DB lease. Did not write hauska-engine or LDT product code.

Operator named **W5**. One slot. One writer.

Naming:

- **W5-A** cad then owner then landuse
- **W5-B** flood remainder
- **W5-C** mud not-yet

This file is the live slot check plus the apply steward. Apply has not started.

## Slot verdict: FREE

`_STATE.md` L16B still says the atoms bulk-writer slot is held (taken 2026-08-15T01:52:20Z). That paragraph is stale. File, watch, and PID evidence now:

| Holder | Evidence path | Last heartbeat | Last expires | Now |
| --- | --- | --- | --- | --- |
| L16B | `P:/tmp/l16_drain_20260813/lease_heartbeat.log` | 2026-08-15T12:33:20.723Z | 2026-08-15T16:33:20.723Z | expired. No release line. Watch `l16b-lease-heartbeat` paused. |
| L26 | `P:/tmp/l26_flood_drain_20260815/lease_heartbeat.log` | 2026-08-18T01:06:47.023Z | 2026-08-18T05:06:47.023Z | expired. Watch `l26-lease-heartbeat` paused. |
| P02 | `P:/tmp/p02_ector_20260821/lease_heartbeat.log` | 2026-08-21T18:04:56.966Z | 2026-08-21T22:04:56.966Z | released in `_inbox/2026-08-21_p02-ector_close.json` at 2026-08-21T18:05:04.647Z `lease: null`. Watch paused. |
| P17 | `P:/tmp/cover_p17_roads/lease_heartbeat.log` | 2026-08-22T13:18:22.513Z | 2026-08-22T17:18:22.513Z | released in `_inbox/2026-08-22_cover-roads_close.json` at 2026-08-22T13:21:27.109Z `lease: null`. Watch paused 2026-08-22T13:24:30Z. |

No inbox `atoms-writer-lease.taken` after the P17 release. Named heartbeat PIDs 21364, 22096, 88832, 72424, 70480 are dead. Five live `node.exe` processes are Cursor language servers only. No apply, lease, heartbeat, factory, drain, cover, flood, or cad-ingest command line.

Unpaused watches `s4-geom-48135` and `cover-p56-geom-48135` are score logs, last write 2026-08-21T13:27:13-05:00 and 2026-08-21T18:37:45-05:00. Not an atoms `--apply`.

doc_repo has no lease CLI. The status script lives at `P:/seat-worktrees/property/hauska-engine/packages/storage/scripts/atoms-writer-lease.mjs` (`status` is read-only; `take` / `heartbeat` / `release` mutate). This seat did not run it and did not set `DATABASE_URL`. Last documented DB status remains the P17 post-release `lease: null`.

Second mechanism that would look the same: a silent writer took a new lease with no heartbeat file and no PID on this machine. Rejected because every bulk `--apply` must register a watch before start, no apply watch is live, leftover farm writes `cad_property` (slot-free), and no take artifact exists after 2026-08-22T13:21:27Z.

`.mjs` files under `P:/tmp/l16_drain_20260813/` show LastWriteTime 2026-08-25T14:30:46-05:00. Those are script copies. The heartbeat log itself was not written today.

## Readiness

`node scripts/factory-routing-readiness.mjs --check` at 2026-08-25T23:51Z **exit 1**.

Self-test ok. Live status FAIL. Failure: `missing required phrase (403d8010)`. CP-1 restamp removed that SHA from the pin after serving moved to `46e1a5a1`. The instrument still requires the old phrase. That is a pin/instrument drift, not a write-go.

cad / owner / landuse are `ready:false` on `_inbox/2026-08-24_factory_routing_pin.json`. Defects all say P-78 `#477` `72cffc8` on main and **live merge probe pending**. ready:true means already serving. It is not write-allowed. Factory 1 `--apply` stays in the pin `held` list.

What must be true before `--apply`:

1. Slot still FREE at take time. Take one lease. One writer.
2. `--check` exit 0. Today it is 1.
3. cad / owner / landuse pin defects cleared after the named live merge probe, or Nick names apply while those rows stay `ready:false` and records why.
4. P-55 grammar on the writer (below).
5. Counties picked from leftover KEEP that are Manifest `not-yet`. Never leftover Dallas 48113 / Tarrant 48439.

## First apply family (W5-A)

Order: **cad, then owner, then landuse**. Then stop the family. W6 GET. Do not start W5-B flood or W5-C mud in the same writer session.

Manifest SNAPSHOT `_inbox/2026-08-24_county_manifest_dump.json` `fetchedAt` 2026-08-25T23:47:00.427Z `computedAt` 2026-08-25T23:40:18.231Z: cad / owner / landuse each **13 present / 241 not-yet**. Dump names only seven watch counties. Do not invent the other ten present cells.

Leftover KEEP already green on the watch dump (do not spend the first apply here):

- 48021 Bastrop cad/owner/landuse `satisfied-present`
- 48055 Caldwell cad/owner/landuse `satisfied-present`
- 48491 Williamson cad/owner/landuse `satisfied-present`

Leftover KEEP that is Manifest `not-yet` on the watch dump (first):

- 48453 Travis cad/owner/landuse `not-yet`

Other leftover KEEP not in the watch dump (treat as first-apply candidates; statewide pool is 241 not-yet): 48013 Atascosa, 48019 Bandera, 48029 Bexar, 48031 Blanco, 48053 Burnet, 48085 Collin, 48091 Comal, 48121 Denton, 48139 Ellis, 48149 Fayette, 48163 Frio, 48171 Gillespie, 48187 Guadalupe, 48209 Hays, 48221 Hood, 48231 Hunt, 48251 Johnson, 48255 Karnes, 48257 Kaufman, 48259 Kendall, 48265 Kerr, 48287 Lee, 48299 Llano, 48325 Medina, 48367 Parker, 48397 Rockwall, 48425 Somervell, 48493 Wilson, 48497 Wise.

Never leftover, even when a Manifest cell is `not-yet`:

- 48113 Dallas
- 48439 Tarrant (watch dump cad/owner/landuse `not-yet`; leftover gate still refuses)

Pick FIPS ascending from the not-yet KEEP list. One writer. Score after the family so a cell can move. Wiring inspect does not green a CC column.

## P-55 grammar reminder

Engine PR **#356** merge `29ab77c744a3efc21a59dcb6af06ca6ae9e43e28`. Helper `packages/atoms/src/parcel-write-identity.ts`.

Node identity is `{fips}:{integer}`. Shared reject refuses decimal-padded second tokens and `:outside` / `:primary`. Padded StratMap form lands in `externalKeys` on the same object.

`applies-to` is written in the same `writePropertyAtomsBatch` call as the fact. It is the graph edge from fact DID to parcel-node DID. It is not `body.parcelNodeId`.

Verify stored bytes by `atom_did IN`. Never a jsonb expression. A new Factory 1 apply that skips the helper mints the old shape. That is a fail.

Ector 48135 `keyKind` is `geo_id_crosswalk`. A default `prop_id` apply re-collapses that county. Do not put Ector on this first family unless a named card says so.

## W6 GET after the family

After W5-A lands, run `node scripts/county-manifest-canvas-dump.mjs --live`. Replace dump DATA. Quote `computedAt` by field name. Do not rematerialize. Do not POST ledger recompute to pretty a canvas.

W5-B flood remainder (92 not-yet) and W5-C mud not-yet (45) wait until that GET is filed.

## Do not

- Leftover apply (farm done 33/33; Wise 48497 last KEEP)
- Rematerialize
- Second writer
- P-09 footprint
- COVER / Harris PBF
- Dallas 48113 leftover
- Tarrant 48439 leftover
- L17 flip
- Factory 2 zoning warm
- Start W5-B or W5-C before W6 GET

## Dispatch

Compiled, not hand-assembled:

`node scripts/dispatch.mjs --plan OPS-16 --lane W5A --plan-row P-47 --title "W5-A cad/owner/landuse" --mission-file _catalog/dispatch_missions/mission_w5a_cad_owner_landuse.md`

Wrote `_dispatches/2026-08-25_w5a_dispatch.md`. P-47 accepted via amendment A-020 (`P-47 ADDED`). Close for the later apply card is `_inbox/2026-08-25_w5a_close.json`. This steward's close is `_inbox/2026-08-25_w5_slot_check_close.json`.
