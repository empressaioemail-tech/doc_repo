---
id: 2026-09-18b_HANDOFF_integration_seat
title: Handoff to a fresh integration-seat planner, 2026-09-18 afternoon
date: 2026-09-18
last_updated: 2026-09-18 (16:20Z)
status: active handoff
kind: handoff
owner: nick
from: integration seat, 2026-09-18 16:20Z (the session that ran the seat's Wave 1, integrated the six Wave 1 lanes, and compiled the first Wave 2 dispatches)
programs: [OPS-24, OPS-16]
related:
  - _inbox/2026-09-18_phase0_closeout_REGISTER.md (THE durable list; read it second)
  - _decisions/2026-09-18_phase0_closeout_rulings.md (A-215, A-216, A-218, A-220)
  - _inbox/2026-09-16_texas_scaleup_ROADMAP.md (the live queue)
  - _sessions/2026-09-18_seat_wave1_and_wave2_compile_claude_code.md
  - _inbox/2026-09-18_HANDOFF_integration_seat.md (CONSUMED by this session; its traps still apply)
snapshot: doc_repo main 0e80b351 or later; hauska-map 163fde32, legacy-design-tools 25d1782f, hauska-engine c41a1482, hauska-factory 0f4558a4; Property Explorer m6wqid8u7; cortex-api 00841-jeh; factory record-fill, flood, r4 and gate-scheduler jobs sha256:7152d3b0 (85d63e8); retrieval-api 00102-ciz (PINNED), engine-api 00253-qan (FOLLOWS LATEST); smartsite-mcp 00134-wad; read 2026-09-18 16:16Z
---

# Handoff: the integration seat, 2026-09-18 afternoon

You are the integration seat in `P:/doc_repo` on `main`. You plan, review, merge, deploy and grade;
lanes build; the operator fires the dispatches you compile. Commit only after showing the operator the
batch; push before a dispatch is handed out; add, commit and push as separate calls.

**The operator's standing instruction:** everything on the Phase 0 list gets done, properly, in waves.

## Read first

1. `CLAUDE.md`, `ENFORCEMENT.md`, your memory index.
2. `_inbox/2026-09-18_phase0_closeout_REGISTER.md`: the exit's legs with measured state, every ruling,
   every row with its wave and state, what the operator owes.
3. `_decisions/2026-09-18_phase0_closeout_rulings.md`: now including A-218 (roads accepted; Georgetown
   served from its adopted rewrite) and A-220 (destructive-write threshold 0.05 program-wide; P-335's
   pair authoritative; P-323's tag deletion stands).
4. OPS-16 A-217 to A-221 and rows P-352 to P-362.

## 0. Where things stand (all read by field 2026-09-18 16:16Z)

| Leg | Measured | Instrument |
|---|---|---|
| Ledger | **55 open, 12 unmeasured, 1 false-earned** at 13:52Z. The 12 unmeasured road cells are now accepted by A-218 through `_inbox/2026-09-18_p264_road_residual.json` (not yet re-run). Open: 18 mid-cutover (P-336), 30 setback, 6 Williamson, 1 McLennan (P-352); false-earned Hays `48209:88885` (P-352) | `scripts/six-county-completeness.mjs` |
| Customer | **23 PASS / 15 FAIL / 7 UNMEASURED of 45; XD/X 6 open / 10 closed / 7 unmeasured; PDF 52/52; MCP 52/52 signed in** | `_inbox/2026-09-18_155840_surface_probe.json` |
| Coverage | P-210 PASS 3/3; P-205 MCP half PASS 4/4, map half FAIL 4/4 (P-353) | same |
| Roads | Ruled (A-218); Phase 1 P-355, P-356 | |
| Walk | Not started | |

**Deployed and graded today:** dblink dropped; #175 (gate cycle reproduced 390/390, trigger resumed
15:24:53Z); P-332 (panel, both parcels graded both ways); LDT `25d1782f` to cortex-api `00841-jeh`
(canary 90/90 against production). Rollback handles: Property Explorer `1qrscbkcf`, cortex-api
`00824-qay` (tagged `staging`).

**Merged, not deployed:** P-327 (factory #177; the publish-lane image, whose LDT bake pin is also stale),
P-335 (factory #178; the record-fill image, which the #175 deploy at `85d63e8` does not carry), P-342
(engine #475; migration 018 not applied).

**Held:** hauska-engine #474 (P-328). A-220 set the program threshold to 0.05; P-361 moves the
factory's declaration and re-pins #474, which merges only then.

## 1. What the operator fires next (compiled and pushed)

| Lane | Dispatch |
|---|---|
| P-354 | `_dispatches/2026-09-18_p354-future-dated-rule-rows_dispatch.md` (Georgetown names both dates) |
| P-339/340/341 | `_dispatches/2026-09-18_p339-p341-surface-agreement_dispatch.md` |
| P-353 | `_dispatches/2026-09-18_p353-find-box-coverage_dispatch.md` |
| P-270 address half | `_dispatches/2026-09-18_p270-address-half_dispatch.md` |
| P-336 | `_dispatches/2026-09-18_p336-ledger-cutover-ab_dispatch.md` |

Four touch hauska-map: merge them one at a time, each re-greened against the base it merges into.

## 2. Your first job: finish compiling Wave 2, then the seat's own Wave 2

**Compile** (each mission from source and the run of record, the way today's were):
P-333, then P-334/P-329/P-330 (factory controls), P-352 (situsState conflict and the phantom record;
its dependencies, #175 deployed and P-335 merged, are met), P-361 (the 0.05 threshold and #474's re-pin),
P-351 (the bake's retirement arm, now wider: P-327 found a second writer inside the bake, and 1,385 Hays
retired rows are served parcel keys), P-331, P-358 (the PDF's ETJ literal), P-359 (ETJ rings), P-362
(the LDT shift job's post-shift check), and re-compile P-324 and P-286/P-317 to today's hashes.
**Factory merge order:** P-333, then P-334/P-329/P-330, then P-300/P-338's writer half, then P-336's
writer half, with P-352 and P-361 slotted after P-333; one at a time.

**Seat Wave 2, one production write at a time, each recorded:**
1. San Marcos coverage re-check (ruling 19): the 2026-09-07 check was a live area-weighted group-by on
   `ZONECODE` at `smgis.sanmarcostx.gov` (covered districts 12.93 percent against legacy 0.90); re-run
   it against corpus 1.4.0's San Marcos table. If it holds, P-258's re-run may proceed.
2. P-258's re-run: the live setback writer image already pins corpus 1.4.0, so a Hays run IS San
   Marcos's switch; Williamson may run now (A-218 accepts Georgetown's rewrite). Then the P-255 census,
   then fire P-300 with P-338.
3. P-342: apply migration 018 (hauska-engine `packages/storage`), then P-263's apply county by county,
   dry run first, each capped at its measured share (ruling 11).
4. P-321's watch scheduled hourly once P-334 lands; P-294's dry cycle; the Austin stamp; the Hays
   join-miss delta read.
5. The next rebuild of `cloudbuild.parcel-record-fill.yaml` (for P-335 and P-352, before P-350) repeats
   the gate-scheduler procedure: pause, baseline, deploy, one graded cycle with
   `scripts/gate-cycle-compare.mjs`, resume.

## 3. Standing facts that override older records

- **P-347 is partial on one clause:** the tier graded at is NOT recorded on either signed-in run. The
  probe now also asks `list_purchased_records`; the next signed-in run should record it.
- **Signing in:** the probe prints an AuthKit URL and opens a browser; the operator signs in with the
  paid Solo account. Client `client_01M2TETZ4K9N2Z48KBJRD46ABF`. Tokens live 5 minutes; the probe asks
  for `offline_access` and refreshes in memory. A "refused to connect" page on a second load of the
  callback is harmless (the one-shot listener has closed).
- **The deploy workflow's post-shift P-279 step always fails and says "violation"** (no checkout,
  P-362). After a cortex-api shift, check the tags by hand: every tagged revision's env and secret
  names against the serving revision's, read by field.
- **Grade a cortex-api canary with `scripts/cortex-canary-compare.mjs`**, and calibrate it first by
  running it with production on both sides (it must read zero differences).
- **Williamson's R-keyed parcels read `record_retired` on the MCP** (XD-6) until P-350 republishes.
- **The publish lane's LDT bake pin is stale** (`ldt-pin-staleness` fails on every factory push). No
  bake publish (P-349's Hays bake, P-350) until P-351 moves it.
- hauska-engine-api FOLLOWS LATEST; retrieval-api is pinned. Deploy engine-api with `--no-traffic`.
- **Hays is not an incident:** its 56,629 `txgio_parcel`-authority retired rows are hollow account
  nodes, measured against the served keys; the 1,385 `cad_property`-authority retired served keys are
  P-351's to settle.

## 4. Traps found today

- **Lane closes sit on pushed `lane/*` branches.** Five lanes' artifacts had never reached main. Before
  citing a close, sweep `origin/lane/*` for `_inbox` files main lacks (P-357 carries the control).
  P-206's close is still held untracked: it declares no fan depth and the FAN-DEPTH gate refuses it; it
  is not to be edited to pass.
- **Lanes write artifacts in UTF-16** from PowerShell; convert to UTF-8 (content unchanged) before a
  JSON reader or gate reads them.
- **The probe-close gate's ranges must match `_catalog/plan_registry.json`.** They drifted once today
  and the whole of Wave 1 was ungated; its self-test catches it. Extend both together when you card
  county-to-serving rows.
- **`vercel link` writes `.env.local`** into the clone; remove it before `vercel deploy`.
- Another writer (the SmartCity and GCP-exit planners) commits in this clone; nothing staged is safe
  from a pathspec-less commit, so stage only immediately before committing. The GCP exit
  (`_decisions/2026-09-18_gcp_full_exit_rulings.md`) waits for this program to agree freeze windows
  (OPS-25 D-15): it names this seat as the Texas planner.

## 5. Owed by the operator

Fire the five dispatches above. Sign in when the probe re-runs. P-350's production publish go (after
P-327, P-333 and P-351). The walk (ruling 18). Off the exit path: P-294's first automated run, Burnet
address points, P-278 rotation, the P-243/P-244a account check, `_STATE.md`'s stale lines.

## Starter prompt

"You are the integration seat in P:/doc_repo. Read _inbox/2026-09-18b_HANDOFF_integration_seat.md,
then _inbox/2026-09-18_phase0_closeout_REGISTER.md. Finish compiling Wave 2 in the order section 2
gives, then run the seat's own Wave 2 production work one write at a time, each recorded, starting with
the San Marcos coverage re-check. As lanes close, bring their artifacts into P:/doc_repo, review, merge
in order and deploy. Do it properly, not fast."
