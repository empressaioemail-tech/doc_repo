---
id: 2026-08-24_two_track_handoff
title: Handoff — recalibration/design track + data-quality track
date: 2026-08-24
status: filed
plan_row: P-75
from: integration planner
to: fresh doc_repo planner
---

# Two-track handoff

Filed: 2026-08-24
From: integration planner on `P:\doc_repo` (`main`)
To: fresh planner in the same repo
Re: Close P-75 / P-76. Hold PE. Do not revive the old Lane 3 stack.

Paste everything below the line into a fresh planner session.

---

You are the doc_repo planner. Two tracks share one PE surface and must not steal each other's order.

**Track A (recalibration / design).** Hold live Smart Site. Finish Lane 2 leftover only if you are on that card. Do not restyle. Do not import the SmartCity kit onto PE.

**Track B (data quality).** Execute the write-path program. Last two items in flight are P-75 and P-76. Close them to a live gold probe. Do not start CAMA, footprint, Travis join fix, or REST harvest.

If a board disagrees with the write-path game plan on ingest order, the game plan wins. The recalibration Lane 3 table is a pointer, not a queue.

## Snapshot (re-verify before you act)

- doc_repo `main` at handoff time included `36aaafe` (Manifest dump) plus uncommitted Read-with / two-track edits. Declare your own seat, worktree, branch, and commit.
- Integration `P:/doc_repo` on `main` is not a planner seat. Planner writes go from a registered worktree.
- PE serving: hauska-map **#220** `54f55a1`, smartsite.cloud, bundle `index-NLDSTywB.js`. Cortex **`cortex-api-00577-baf` @100%**, LDT **#474** `fdb6849`. Operator landed phase-close + Reports 4a/4b.
- Manifest dump fetched 2026-08-25T04:13:26Z, `computedAt` 04:10:25Z, **FRESH**, p47 PASS, **667 / 3556**. Refresh with `node scripts/county-manifest-canvas-dump.mjs --live`. Do not rematerialize.
- P-75 LDT **[#475](https://github.com/empressaioemail-tech/legacy-design-tools/pull/475)** OPEN on `fix/lane3-wave1-p75-p76`. Typecheck SUCCESS. **Test FAILURE** is schema fixture drift: refresh `lib/db/src/__tests__/__fixtures__/schema.sql.template` for `tx_utility_territory_staging`, then commit that file. Empty store is unmeasured, not miss.
- P-76 LDT **[#476](https://github.com/empressaioemail-tech/legacy-design-tools/pull/476)** OPEN on `fix/lane3-p76-city-limits`. Typecheck SUCCESS. Test was still in progress at 2026-08-25T04:21Z. Table live 1222/1222 geo_id. ETJ stays `unresolved`. No buffer.
- LDT pin remains `origin/main` @ `244567a50ae62334984b3f990d776872e1c206ea` for Wave 1 trees. Do not use property-seat LDT or the A2 PE tree.
- Lane 2 leftover (Track A, not Wave 1): 4242 on the pricing popup, then hosted-kill, wallets/promo, billing portal. Test-mode keys. Do not flip `sk_live`.

## Read this order, then stop reading and execute

1. `_STATE.md` then `MEMORY.md` then `_scratch/parcel-facts-write-path.md` then `_scratch/lane3-wave1.md`
2. This file
3. `_inbox/2026-08-24_parcel_facts_write_path_game_plan.md` (Track B authority)
4. `_inbox/2026-08-24_parcel_facts_write_path_WDLL.md` (Wave 1 go is items 4-5; item 13 is Manifest)
5. All four canvases (outside this repo). Read them. Do not execute from the recalibration Lane 3 table.
   - `C:\Users\cente\.cursor\projects\p-doc-repo\canvases\recalibration-and-design-systems.canvas.tsx`
   - `C:\Users\cente\.cursor\projects\p-doc-repo\canvases\parcel-facts-write-path.canvas.tsx`
   - `C:\Users\cente\.cursor\projects\p-doc-repo\canvases\county-manifest.canvas.tsx`
   - `C:\Users\cente\.cursor\projects\p-doc-repo\canvases\parcel-public-facts-deficit.canvas.tsx`
6. `_inbox/2026-08-24_county_manifest_dump.json` then `--live` if you need a new health read
7. `_inbox/2026-08-24_write_path_planner_handoff.md` (Wave 1 execute detail)
8. Lane cards: `_inbox/2026-08-24_lane3_p75_who_serves_WDLL.md`, `_inbox/2026-08-24_p75_CP1.md`, `_inbox/2026-08-24_lane3_p76_city_limits_WDLL.md`, `_inbox/2026-08-24_p76_CP1.md`
9. `90_runbooks/AGENT_CONTRACT.md` and `90_runbooks/DEV_PROCESS.md`

## What each surface is for

| Surface | Question it answers | It does not own |
| --- | --- | --- |
| Recalibration board | Is PE holding? What chrome leftover is still open? Which design system binds pricing/Reports? | Ingest order. Manifest rails. |
| Write-path board | What writes next, and what is blocked? | PE restyle. Stripe 4242. |
| County Manifest | Is the ledger snapshot fresh, and which of 14 rails are present / not-yet? | Who-serves. City-limits. Inspect hops. |
| Deficit register | Which hop/field is missing for a named fact? | Wave sequence. Ledger freshness. |

Who-serves and city-limits never appear as Manifest rails. Travis cad not-yet @ 59.47 on Manifest is the same hole as deficit T48453 / M02. P-77 measure already scored that hole 10 hit / 1 miss. The join fix stays held.

## Decisions that already bind

1. Write-path dependency order replaced effort-tier and the old recalibration Lane 3 stack (field-map, Travis join, ETJ adapter, who-serves, footprint then CAMA). Owner: planner. Reversal: operator amendment to the WDLL, not a canvas edit.
2. P-76 is incorporated / unincorporated / ETJ-unresolved. It does not close ruling 3. Owner: operator go A-027. Reversal: a later ETJ derivation card with its own plan row.
3. County Manifest canvas is first-class for freshness and gap ID, equal to Wave 1. Same GET as Command Center. Refresh is dump then replace DATA. Retire after a trusted CC push. Owner: operator 2026-08-24. Reversal: CC push the operator trusts.
4. PE is out of the SmartCity Empressa kit. Gold is mark only. Brand-blue is the interactive accent. Owner: 2026-08-17 ruling plus pe-tokens.css. Reversal: a named PE kit-import decision.
5. Phase-close + Reports 4a/4b are customer-done on #220. Assembler stays parked. Owner: operator landed 2026-08-24 22:59. Reversal: a new Reports card.

## Open questions

1. Will #475 / #476 merge this session? Open because Test is red or was still running. Route: Wave 1 closer. Next: fixture refresh on #475, re-read #476 Test, then merge, cortex deploy, live gold.
2. Does PE copy `whoServesFact` / `cityLimitsFact` on origin/main? Open because PE chip is leave_behind unless an isolated hauska-map tree from origin/main exists. Route: after cortex gold, not in the same LDT PR.
3. When does Lane 2 4242 resume? Open because it is Track A leftover, not a write-path row. Route: only if the operator names that card. Do not mix it into a P-75 close.

## What to do now (Track B)

1. Re-read #475 and #476. Do not trust this file's CI line after a new push.
2. Fix #475 schema fixture drift. That is the named fail. Do not rewrite who-serves.
3. If #476 Test is red, fix that fail the same way: read the log you cite.
4. Merge your own branches when green. Cortex deploy is planner-owned. Grade WDLL items 4 and 5 on a live gold probe, not a merged PR.
5. Refresh Manifest after deploy if a new rail could have appeared. It will not. Who-serves is still not a rail. The dump is for freshness and cad/owner/landuse movement, not for a new who-serves cell.
6. Stop. Present P-74 / P-78 as the next compile. Do not absorb Wave 3.

## What not to do (Track A unless named)

Do not rebuild the pricing popup from taste. Do not flip live Stripe keys. Do not write `P:/seat-worktrees/property/hauska-map`. Do not start the feasibility assembler. Do not import `--sc-*` onto PE.

## Artifacts

- `_inbox/2026-08-24_two_track_handoff.md` (this file)
- `_inbox/2026-08-24_write_path_planner_handoff.md` (Wave 1 execute prompt)
- `_inbox/2026-08-24_parcel_facts_write_path_game_plan.md`
- `_inbox/2026-08-24_parcel_facts_write_path_WDLL.md`
- `_inbox/2026-08-24_county_manifest_dump.json`
- Four canvases under `C:\Users\cente\.cursor\projects\p-doc-repo\canvases\`

## Close this handoff when

P-75 and P-76 are customer-done or an honest blocked close: serving cortex revision named, live gold probe, WDLL items 4-5 graded, leave_behind declared (PE chip, P-74 tree, P-78 product, Lane 2 4242). Waves 3-6 untouched. No `--apply`. No CAMA zip. Both boards and Manifest DATA updated at close.

Re: Close Wave 1 P-75 / P-76; hold PE; do not remake either track
