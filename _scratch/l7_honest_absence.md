# L7 honest absence — scratch

## GROUND-TRUTH
- 2026-08-12T23:16:47Z — live GET `/api/county-ledger`: `satisfiedAbsentCells=1` (was 0). Donley 48129 geometry `displayState=satisfied-absent` with absenceBasis + verifiedByInstrument + source. Geometry: 251 present / 1 absent / 2 not-yet.
- 2026-08-12 — three geometry not-yet cells verified by SQL+ledger: 48129 Donley, 48135 Ector (5%), 48201 Harris (null facet → instrumented 0%).
- 2026-08-12 — Harris parcel-node atoms = 0 (body index + entity_id `>=48201 <48202`); txgio features = 1,523,641. Not a scorer keying bug alone — atoms never landed for Harris.

## LESSON
- Serve path for satisfied-absent existed; write path did not. Schema+tests ≠ production path. Score by whether a scorer can emit the state under fail-closed provenance.
- Single-county geometry score must not full-scan 11M atoms; use entity_id prefix range.
- Zero features without a named determination must stay not-yet (fail closed). Auto-absent under `--all` is forbidden.

## DEAD-END
- Treating Harris/Ector as honest-absence: rejected — source data exists; missing/wrong atoms are apply/re-key work (P-02 / parcel-node apply), not absence.

## OPEN
- P-02 Ector re-key; Harris parcel-node apply; promote Donley decision to active.
