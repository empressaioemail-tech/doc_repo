---
id: 2026-09-11_MIDSESSION_ops23_capture
title: MIDSESSION CAPTURE — OPS-23, written before a context compaction so the successor picks up cold
date: 2026-09-11
status: active
owner: integration
applies_to: OPS-23
plan_rows: [P-151, P-152, P-153, P-160, P-168]
snapshot: doc_repo main 0acc23f6 pushed; six uncommitted paths listed below await the operator's go. Written at ~20:15Z. Re-run the instruments before trusting any state below.
---

# MIDSESSION CAPTURE — read this first after the compaction

The durable card is `_inbox/2026-09-11_ops23_ledger_serving_path_WDLL.md`. The plan is
`90_operations/OPS-23_surface_completion_program.md`. This file is only the live position at
20:15Z on 2026-09-11 and what the next action is.

## Commits today, all on origin/main

```
0acc23f6  docs(OPS-23): the durable card - WDLL for every row, ruling, finding and owed item
627e5853  docs(P-160, P-168): surface probe and close gate; dispatch preambles scoped by program
1e174bcc  test(P-160): violation run of probe-close-gate, expected to be refused   <- it was NOT refused; see below
4c8d18ef  docs(OPS-23): the ledger as the serving path - ADR-031 amended, seven steps rowed, two dispatches compiled
```

## Uncommitted, awaiting the operator's go (explicit pathspec)

```
_catalog/dispatch_missions/mission_p152_record_reader.md      new
_catalog/seat_register.json                                   +2 worktrees (hauska-engine-p152-reader, legacy-design-tools-p152-cortex-consumer)
_dispatches/2026-09-11_p152-reader_dispatch.md                compiled, program preamble by row membership, 23,583 bytes
scripts/surface-probe.mjs                                     P-151 point predicate accepts a declared refusal (503 resolution_timeout inside 10 s); bare 504 still fails; self-test 18/18
_inbox/2026-09-11_ops23_ledger_serving_path_WDLL.md           status rows for P-151 (serving) and P-152 (lane 1 dispatched)
_inbox/2026-09-11_201111_surface_probe.json                   P-151 machine legs on the deployed code
_inbox/2026-09-11_MIDSESSION_ops23_capture.md                 this file
message: docs(P-152): reader dispatch compiled; probe accepts declared refusals; P-151 serving
```

## Lane board at this snapshot

```
P-151 SEAM    MERGED AND SERVING. hauska-map #383 6ab69147, LDT #657 3950ce9b (19:45Z). Live PE bundle
              index-D1MJSpcc.js carries "no municipal zoning applies" and the "Land use" label; cortex-api
              00770-puy (built from 3950ce9b) at 100 percent. Probe machine legs PASS-shaped: point route
              200 declined in 1.2-1.7 s, record point present, ring matches by id. CLOSE PENDING on two
              inputs: the operator's screenshot observation (sheetSealed for 48453:113408 and the
              unincorporated string for 48453:474034) and the lane's close JSON at
              _inbox/2026-09-11_p151-seam_close.json. Observation template:
              scratchpad obs_p151.json (C:/Users/cente/AppData/Local/Temp/claude/p--doc-repo/<session>/scratchpad/).
P-153 DRAW    dispatch compiled (_dispatches/2026-09-11_p153-draw_dispatch.md). Branches from origin/main
              AFTER P-151 merged, which it now has. Not yet carried.
P-152 READER  lane 1 of 2 dispatch compiled (_dispatches/2026-09-11_p152-reader_dispatch.md). Not yet
              carried. The lane STOPS for operator approval before mounting the parcel_record_ro secret
              (FACTORY_DATABASE_URL_RO) into hauska-retrieval-api. Lane 2 (P152-PANEL) follows its close.
P-160 PROBE   closed partial. Gate live verification OWED: next session's first OPS-23 close commit, probe
              field removed then restored.
P-168 SCOPE   closed. OPS-17 / OPS-19 owners owe one confirmation on next compile.
P-154..P-159, P-161..P-167   not dispatched; see the card for dependencies and predicates.
```

## The next three actions, in order

1. When the operator reports the two screenshots: write `sheetSealed: true/false` into the
   observations file, run `node scripts/surface-probe.mjs --rows P-151 --observations <file>`,
   expect PASS on both parcels. When the lane's close lands, check it cites that artifact; run the
   hook directly (`printf '{"tool_name":"Bash","tool_input":{"command":"git commit -m x"},"cwd":"P:/doc_repo"}' | node .claude/hooks/probe-close-gate.mjs`)
   because the harness will not fire it this session; commit close plus artifact by pathspec.
2. Get the go on the six-path batch above; commit; push; verify `git log --oneline -3`.
3. Hand-carry P-152 lane 1 and P-153 (both can start now). Paste the compiled dispatch verbatim
   in a four-backtick block with the worktree setup commands first
   (`git -C <repo> fetch origin main`, `git -C <repo> worktree add <path> -b <branch> origin/main`,
   `cursor -n "<path>"`).

## Rulings taken today, do not relitigate

R-1 most-current source wins; R-2 Ruling B reversed for the polygon only; R-3 city is the
unit; R-4 surface probe is the predicate; R-5 overseer / dispatch planner / lane (proposed;
active on go); R-6 ledger is the serving path, atoms canonical, cells are accounting; R-7
cached rendering beside the cell; R-8 reader in `hauska-engine/services/retrieval-api`, never
cortex; R-9 cells-as-canonical with projected atoms REJECTED. Records in `_decisions/2026-09-11_*`.
ADR-031 amended the same day.

## Controls built today and their verification state

- `scripts/surface-probe.mjs` — verified both directions by self-test and four live runs.
- `probe-close-gate` — logic verified by direct invocation; NOT observed firing through the
  harness (hooks snapshot at session start). Owed next session.
- `standing-decisions-scope` in `generate-combined.mjs` — verified by planting `G-99` (refused).
- `dispatch.mjs` program preamble by row membership — verified by renaming `OPS-23.md` (P-152
  refused) and compiling P-131 (no program context).

## Findings the probe produced that are not yet closed

F13 WRONG-PARCEL (address form answered for `48491:R419407` when asked about `48021:33223`) →
P-152. F15 cortex's cached Bastrop county-gis layer has holes at both Bastrop probe parcels;
the county's own FeatureServer returns them → P-152 reads rings from the ledger's
`parcelGeometry`. F14 point-route hang is a rate (504 once, 200 five times).

## Planner errors this session (five), shape: a conclusion written from one read

Projection proposal (caught by the operator); id-scheme misread of the Bastrop hole (caught by
the county's own service); "the point route 504s" (caught by the probe); a violation entry
written before it ran (caught by the commit going through); the roster's city count quoted
before the factory declaration was read. All corrected in the plan and the card.

## Owed by the operator

Screenshot tier; free-tier drawing (F2); go on R-5; dispatch-planner seat when stood up;
Bastrop authority if the three dates tie; verified-absence atoms before P-164 touches absence
cells; approval of the RO secret mount for the retrieval service (P-152 lane will ask); the
four other-county probe parcels.

## Instruments

```
node scripts/surface-probe.mjs [--rows P-151] [--observations f.json] [--allow-unmeasured]
node scripts/ops23-lane-status.mjs
node scripts/surface-probe.mjs --self-test
node scripts/dispatch.mjs --lane <ID> --plan-row <P-15x|P-16x> --mission-file <f>    (program preamble attaches by row)
```
