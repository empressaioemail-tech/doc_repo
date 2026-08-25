---
id: 2026-08-25_factory_memory_wave_handoff
title: Handoff — factory + memory wave for the next planner
date: 2026-08-25
status: filed
plan_row: P-78
from: integration planner
to: fresh doc_repo planner
---

# Handoff: factory + memory wave

Filed: 2026-08-25
From: integration planner on `P:\doc_repo` (`main`)
To: a fresh planner in a registered seat worktree
Re: Run one bounded autonomous wave. Sub-agents write artifacts. You commit. You verify.

Paste everything below the line into a fresh planner session.

---

You are the doc_repo planner. Track A (PE hold) has landed. Track B is yours. Run **one wave** of reasonable size with sub-agents. Do not open Waves 4 through 6. Do not rebuild the factories.

## Snapshot (re-verify before you act)

- Declare your own seat, worktree, branch, and commit. Integration `P:/doc_repo` on `main` is not a planner seat. If you are in another seat's checkout, stop.
- This handoff assumes the factory/memory commit is on `origin/main`. If it is not, stop and say so.
- P-75 #475 and P-76 #476 serve on `cortex-api-00579-teh` @100%, SHA `403d8010`. Do not re-merge them. PE chip is leave_behind.
- Manifest dump fetched 2026-08-25T04:13:26Z, `computedAt` 04:10:25Z, 667 / 3556. Refresh with `node scripts/county-manifest-canvas-dump.mjs --live`. Do not rematerialize.
- Atom write grammar is P-55 engine PR #356 `29ab77c`. Not the 2026-08-08 DATA_MODEL proposal. Not padded `entity_id`. Not jsonb verify.

## Read this order, then stop reading and execute

0. `node scripts/two-track-union-pin.mjs --check` must PASS.
1. `node scripts/factory-routing-readiness.mjs --check` must PASS.
2. `node scripts/enforcement/fleet-memory-travel.test.mjs` must PASS (14 checks).
3. `_STATE.md` then `MEMORY.md` then `_scratch/parcel-facts-write-path.md` then `_scratch/factory-routing-readiness.md` then `_scratch/ident-p55.md`
4. `_inbox/2026-08-25_factory_operating_instructions.md` (factory law + atom/node/edge pointer)
5. `_inbox/2026-08-24_parcel_facts_write_path_game_plan.md`
6. `_inbox/2026-08-24_factory_routing_pin.json`
7. Canvases (outside git). Factory health is in the family.
   - `C:\Users\cente\.cursor\projects\p-doc-repo\canvases\factory-health.canvas.tsx`
   - `C:\Users\cente\.cursor\projects\p-doc-repo\canvases\parcel-facts-write-path.canvas.tsx`
   - `C:\Users\cente\.cursor\projects\p-doc-repo\canvases\county-manifest.canvas.tsx`
   - `C:\Users\cente\.cursor\projects\p-doc-repo\canvases\parcel-public-facts-deficit.canvas.tsx`
   - `C:\Users\cente\.cursor\projects\p-doc-repo\canvases\recalibration-and-design-systems.canvas.tsx`
8. P-78 spec `_inbox/2026-08-24_p78_cad_property_merge_SPEC.md` and `node scripts/p78-merge-fixtures-selftest.mjs`
9. `90_runbooks/AGENT_CONTRACT.md` and `90_runbooks/DEV_PROCESS.md`

If a board disagrees with the game plan on ingest order, the game plan wins.

## Wave (do this, then stop)

Fan one level. First line of every sub-agent prompt is `DO NOT SPAWN SUB-AGENTS`. They do not commit. You read every diff. You verify by violation before you trust a green.

### A. Confirm the revised atom/node/edge is the write target

Isolated engine tree from `origin/main`. Confirm `packages/atoms/src/parcel-write-identity.ts` exists and PR #356 `29ab77c` is an ancestor. Confirm writers call the helper, not `body.parcelNodeId`. Confirm verify paths use `atom_did IN`. File `_inbox/2026-08-25_p55_write_target_probe.json` with commit, path, and the command you ran. If the helper is absent, stop. Do not apply atoms on the old grammar.

### B. Arm main memory (planner-owned)

Live gate is 85 untriaged > pin 64. The compiler now injects FLEET MEMORY (M0). Canon-gate M6 is the travel control.

Do not raise `.github/memory-backlog-pin.json`.

Triage **eight factory-relevant** scratch files only. Suggested set (drop any already in `_catalog/memory_promotion_log.jsonl`):

- `l2_factory15_front.md`
- `l9_cama_routing.md`
- `l20_factory15_zoning_sweep.md`
- `l21_cross_vintage_keys.md`
- `autonomous-run-bastrop-factory.md`
- `parcel_node_writer_sweep.md`
- `ident-p55.md`
- `parcel-facts-write-path.md`

For each: promote (prefer a mechanical guard) or decline. One JSONL line per file. Lower `maxUntriagedLessonFiles` by the number you actually cleared, in the same commit. Do not promote factory folklore that the routing pin already fails-closed. Do not touch the other 77 files this wave.

Compile one real OPS-16 row (P-78) and confirm the dispatch carries `FLEET-MEMORY v` plus `FLEET MEMORY (M0):`. That is the arm. The self-test already exists.

### C. Compile and execute P-78 only

Isolated LDT tree from `origin/main`. Property seat owns LDT. Do not write `P:/legacy-design-tools` or the property-seat checkout if you are not that seat. Request the owning seat or use `P:/tmp/ldt-p78`.

Acceptance is the P-78 spec + fixtures F1 through F8. Last-wins must fail F1/F3. `YEAR_BUILT` is first-valid-YYYY. `GIS_AREA_U` refuse-or-convert. No value columns on `txgio_parcel`. No CAMA zip. No atoms `--apply`. No rebase onto a serving who-serves/city-limits PR.

Close on: product rewrite on a branch, fixtures green, leave_behind named (rebake still `tax_year DESC`, P-25 still held, PE chip leftover). Code-done is not customer-done. Do not deploy cortex unless the operator names it.

### D. Refresh instruments, do not invent rails

After A through C:

- `node scripts/factory-routing-readiness.mjs --check`
- `node scripts/two-track-union-pin.mjs --check`
- `node scripts/enforcement/memory-promotion-gate.mjs` (expect exit 0 only if you lowered the pin past the new untriaged count)
- Optional Manifest `--live` if you need a freshness read. Who-serves is still not a rail.

Do not mark P-25, P-09, or roads `ready:true`.

## What not to do

Do not start CAMA, footprint, Harris PBF, COVER, Factory 2 warm, or Travis join serve. Do not rematerialize. Do not flip `sk_live`. Do not import the SmartCity kit onto PE. Do not raise the memory pin. Do not quote Phase 2 "196 parcel-node atoms" as live geometry. Do not emit `WouldAffectEdge` or obligation atoms. Do not `git add` all.

## Done looks like

1. P-55 helper confirmed on engine `origin/main` with a file-based probe.
2. Eight named scratch files triaged, pin lowered in the same commit, M0 present on the P-78 compile.
3. P-78 product on an isolated LDT branch, fixtures green, no `--apply`.
4. Routing pin still holds P-25 / P-09 / roads at `ready:false`.
5. Your close names leave_behind. Sub-agents did not commit.

Stop there. Present the next compile (P-25 or P-74) only after this wave's close is filed.
