---
id: 2026-08-24_factory_routing_readiness_WDLL
title: WDLL — factory routing readiness and memory travel
date: 2026-08-24
status: draft
operator_approval: verbal 2026-08-24 (create WDLL and fan instruments; no factory --apply)
plan_row: P-73
related:
  - _inbox/2026-08-24_parcel_facts_write_path_WDLL.md
  - _inbox/2026-08-24_p73_ingest_bound_field_map.md
  - _inbox/2026-08-24_factory_routing_pin.json
  - scripts/factory-routing-readiness.mjs
  - 90_runbooks/fleet_memory_practice.md
  - canvases/factory-health.canvas.tsx
  - _inbox/2026-08-25_factory_operating_instructions.md
  - _inbox/2026-08-25_factory_memory_wave_handoff.md
---

# WDLL: Factory routing readiness and memory travel

Date: 2026-08-24  Status: draft  Operator approval: verbal 2026-08-24 for instruments only.

## Done looks like

A dispatcher can say whether a named factory write is READY to move a County Manifest cell, and the answer comes from a file-based instrument that has been shown to fail, not from a canvas caption. No Factory 1 `--apply` and no CAMA zip has run. Fleet memory travels in every compiled dispatch as the verbatim M0 block. The memory promotion gate is still a backlog ratchet; nobody raised the pin to go green.

## Acceptance items

1. **Memory travel.** `node scripts/dispatch.mjs` emits the verbatim FLEET MEMORY (M0) block from `90_runbooks/fleet_memory_practice.md`. A compiled dispatch missing that block is refused by the same canon-gate that already refuses a missing AGENT-CONTRACT marker. | check: compile a real plan row; strip the block and observe the gate fail; restore and observe pass | grade: [met] compile `_dispatches/2026-08-25_p73-m0_dispatch.md` carries `FLEET-MEMORY v2a98086b` plus the verbatim M0 line; canon-gate Agent payload exit 0 on the full text, exit 2 after the block is stripped (`M6`), exit 0 on restore. Proof `_inbox/2026-08-24_fleet_memory_travel_violation.json`. Instrument `scripts/enforcement/fleet-memory-travel.test.mjs` 14/14.

2. **Memory gate honesty.** Live `node scripts/enforcement/memory-promotion-gate.mjs` is measured and quoted. Pin stays 64 unless triage decisions land in `_catalog/memory_promotion_log.jsonl` in the same commit that lowers it. Do not raise the pin. Do not promote factory lessons to MEMORY.md from this card. | check: gate stdout with snapshot; pin file unchanged or lowered with log lines | grade: [met] live run at `cd885521` exit 1; lessonFiles 97, triaged 12, untriaged 85, pin 64 unchanged. JSON `_inbox/2026-08-24_memory_gate_live.json`. No promotion log lines. The standalone CI step in `.github/workflows/enforcement.yml` is permanently red at 85>64.

3. **Routing pin exists.** A JSON pin names every Manifest rail plus who-serves and city-limits (not-a-rail). Each row has factory, source, dest, join, serving hop, plan row, and `ready: false|true`. No row is `ready: true` unless dest, join, serving hop, and plan row are all non-empty AND the named product defect is absent or waived with a detector. | check: file exists; empty dest cannot be ready; who-serves ready never implies a Manifest rail | grade: [met] `_inbox/2026-08-24_factory_routing_pin.json` 16 rows. Planner re-ran `--check` at `cd885521`. who-serves and city-limits are `manifestRail: false`.

4. **Routing instrument.** `node scripts/factory-routing-readiness.mjs --self-test` fails an invented who-serves rail, a ready row with empty dest, and a vacuous empty phrase. `--check` grades the live pin. | check: both directions; `--check` PASS while every ingest row is `ready: false` except any hop already serving on a named revision | grade: [met] F1-F5 PASS. Live `--check` PASS. `ready:true` is already-serving only: geometry P-01, flood P-08, envelope P-60. That is not write-allowed.

5. **No silent turn-on.** Factory 1 `--apply`, P-25 CAMA zips, P-09 footprint apply, and COVER restart are still held. A READY lie on those rows fails item 4. | check: pin rows for P-25 / P-09 / roads COVER are `ready: false` | grade: [met] cad/owner P-25, footprint P-09, roads P-17 all `ready: false`.

6. **Product leftovers named, not absorbed.** P-75 #475 OPEN, P-76 #476 merged `f2b6987d` deploy UNMEASURED, P-78 last-wins still the writer, bake `tax_year DESC`, footprint bbox on engine main. Those stay leave_behind for the owning seat. This card does not write LDT or engine. | check: pin defects cite those facts; no LDT/engine commit from this WDLL | grade: [met] leftover phrases required by the instrument. No LDT/engine write from this card.

## Amendments

- 2026-08-24: opened as instruments-only. Reason: operator asked whether factories can be turned on; they cannot; the missing piece is a fail-closed READY signal and memory travel, not a rebuild.
- 2026-08-24: `ready:true` means already serving on a named hop. It does not mean write-allowed or turn-on. Envelope `ready:true` is PE gold setbacks on #220, not Factory 2 envelope ingest (Manifest envelope still 254 not-yet). Flood `ready:true` is 162 present; remainder apply stays held.

## Finish card (graded at close)

Not yet.
