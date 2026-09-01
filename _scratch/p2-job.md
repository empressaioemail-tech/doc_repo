# p2-job (F-01) scratch

LESSON: origin/main 7f41f52 already has requireCountyFips. The missing helper was collect-complete.mjs (uncommitted on p1-controls). Copy that file; do not edit conformant.mjs on this card (P1-FACTORY owns the 48021 default removal).

LESSON: A CAD-only writer allowlist is the defect this card names. factory-conformant stays on the list; containment-persist, f11-setback, and easement-no-live-rest must be named or assertWriterAllowlistNotCadOnly throws WRITER_ALLOWLIST_CAD_ONLY.

DEAD-END: copying sql/p2-juris/03 into this tree and running it. Persist is not this card. Consume the PERSIST_SPEC columns only.

GROUND-TRUTH 2026-08-30T23:15Z: `node src/cli.mjs p2-juris` prints COUNTY_REQUIRED exit 1. `node src/cli.mjs p2-juris --county=48453 --apply --run-id=11111111-1111-1111-1111-111111111111` prints LAPTOP_WRITE_FROZEN exit 1. `node --test test/*.test.mjs` 278 pass, 0 fail, 2 skipped.

OPEN: planner commits seat/property-ctx-p2-job by explicit pathspec. P2-JURIS persist uses this stub and still must not apply from a laptop.
