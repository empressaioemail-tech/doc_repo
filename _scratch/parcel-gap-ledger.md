# parcel-gap-ledger scratch

Closed 2026-09-01T20:12Z. Report `_inbox/2026-09-01_parcel_gap_ledger.md`.

## GROUND-TRUTH
- 2026-09-01T19:55:07Z to 20:03:27Z FACTORY neondb: 981407 records, 981405 at 65 cells, leftovers 48021:0 and 48021:10005 at 52. NA 18 x unincorporated. absent-verified 0. CAD-join rate 1.0 all six.
- 2026-09-01T19:59:05Z PRODUCTION landing 981405. Williamson landing 282569 R + PRIVATE ROAD. CAD 282569 R + 319480 numeric.
- 2026-09-01T20:07:36Z Bastrop 8712 living-not-landing, 0 in txgio, 0 zeropad. Williamson numeric CAD $0 68483 / living 245591; R-prefix $0 0 / living 0.
- 2026-09-01T20:08:10Z NFHL EXISTS AO true, AE true, FLOODWAY subtype true.

## LESSON
- 21.24 was CAD-universe NA / landing unincorporated. Live is 18.00.
- Williamson identity join is 1.0. Dollars/living live on the numeric CAD scheme. Prefix-strip mis-joins.
- Bastrop 8712 are accounts without txgio features, not a key-format bug.
- Six-county cell GROUP BY times out; per-county chunk works.

## DEAD-END
- One-shot six-county census (180s timeout).
- hauska_mcp flood-hazard-fact family scan (60s timeout).
- btrim on exemption_codes text[].
- Prefix-strip Williamson R-keys.

## OPEN
- Crosswalk card, then CAD re-ingest. No prefix-strip.
- cad-null-verified only for true CAD nulls (Travis living, McLennan assessed/living).
- Leftovers stay until operator delete.
- Flood atoms still unmeasured.
