---
title: P-60 setback perf + consumed-lot map viz
status: active
date: 2026-08-24
plan_row: P-60
parent: _inbox/2026-08-24_setback_wedge_handoff.md
---

# WDLL — P-60 setback perf + consumed-lot visualization

Operator approved 2026-08-24. Does not reopen Option C WDLL (`_inbox/2026-08-23_setback_geometry_unification_WDLL.md`).

## Observable end state

Inspect resolves with **one** live `buildable-envelope` POST per parcel when derive is needed. Parcels with setback scalars on the card and `consumed` / `no-buildable-area` envelope show a **dashed full-parcel outline** on the map (no amber fill). Gold wedge unchanged.

## Acceptance items

1. **Single derive.** `fact-sheet-resolver` calls `fetchBuildableEnvelope` at most once per `resolveUncached` when situs seed and live facet patch both need derive; result reused for geometry seed and facet patch. | check: unit test or resolver test asserting one fetch mock | grade: [ ]

2. **Consumed sealed.** Live derive returning `no-buildable-area` seals `sheet.envelope` as `consumed` (not stale table-backed `ok`). | check: `fact-sheet-resolver.test.ts` or augment test | grade: [ ]

3. **Map wire.** `envelopeStateFromSheet` consumed branch emits status `no-buildable-area` (or `normalizeEnvelope` accepts `empty`); `setbackConsumedOverlay` draws when parcel ring available from click or `sheet.geometry.rings`. | check: `envelope-overlay.test.ts` + manual 48453:280239 | grade: [ ]

4. **Gold regression.** `48021:34137` still shows amber wedge after deploy. | check: live probe or `_scratch/_probe_setback_unify.mjs` | grade: [ ]

5. **No parcel_node_id POST.** PE does not send `parcel_node_id` on buildable-envelope POST until cortex schema accepts it. | check: `buildable-envelope.request-body.test.ts` still passes | grade: [ ]

## Out of scope

- Feasibility report assembler
- Phase 2 data ingest (utilities, HOA factory)
- Option C WDLL amendment
