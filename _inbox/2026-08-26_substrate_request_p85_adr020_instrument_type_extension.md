---
id: 2026-08-26_substrate_request_p85_adr020_instrument_type_extension
date: 2026-08-26
from_seat: property
to_seat: substrate
plan_row: P-85
status: open
blocking: P-85 WDLL item 8 (classification); workaround is instrumentType `other` + documentKind until extension ships
---

# Substrate seat request: ADR-020 `instrumentType` enum extension (P-85)

## Ask

Extend `@empressaio/atom-contract` / ADR-020 `recorded_instruments.instrumentType` (and the wire shapes consumers use) with the document kinds P-85 Records Request must classify:

- `deed`
- `deed-of-trust`
- `release`
- `notice` (covers lis pendens, trustee sale notices, association notices where indexed as notices)
- `affidavit`
- `memorandum-of-lease`
- `mineral-or-royalty`
- `power-of-attorney`

Existing types used unchanged: `easement`, `plat-restriction`, `cc-r-declaration`, `deed-restriction`, `lien`, `other`.

## Property-seat interim (until substrate merges)

P-85 writes `instrumentType: "other"` with `extractMetadata.documentKind` set to one of the strings above. Item 8 refuse fixtures must not pass `other` without `documentKind`. Substrate extension removes the workaround; property does **not** edit the contract repo.

## Acceptance for substrate close

1. Enum extended in atom-contract with ADR amendment or ADR-020 addendum.
2. MCP reporting gate and encumbrance wire types accept the new values.
3. Published npm version property seat can pin.

## References

- `_decisions/2026-08-26_p85_records_request_scope.md` (ruling 2)
- `_inbox/2026-08-26_p85_central_texas_easements_WDLL.md` item 8
- `_research/2026-05-26_recorded_restrictions_full_vision.md`
