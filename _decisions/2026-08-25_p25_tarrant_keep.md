---
decision_id: 2026-08-25_p25_tarrant_keep
date: 2026-08-25
owner: Nick (operator), recorded by integration reviewer
status: active
related_canonical:
  - _inbox/2026-08-25_p25_tarrant_keep_or_drop.md
  - _inbox/2026-08-24_parcel_facts_write_path_WDLL.md
  - _inbox/2026-08-25_p25_tarrant_drift_classify.json
  - _inbox/2026-08-14_l21_tarrant_post_reload_residual.json
  - _decisions/2026-08-24_write_path_data_capture_order.md
---

# Decision

Tarrant `cad_property` at `tax_year=2026` is **KEEP**. The approved census is **975,885** rows. No DELETE. P-25 stays `ready:false`. L17 stays `2026/cad-export` (already set). DROP-to-log is refused. DROP-to-L21 is not this card.

## Context

Off-path Wave-4 raised the live Tarrant 2026 count from L21/preLoad **939,435** to **975,885** (+36,450). The Aug-14 ingest log is **883,954**. A first draft filed DROP-to-883,954 as undo-Wave-4. That was withdrawn: it would also delete ~55,481 keys already in the store on 2026-08-14. Operator accepted the reviewer's KEEP recommendation on 2026-08-25.

## Structural commitment check

- Sell reasoning, not data: KEEP does not invent a smaller census to match a log.
- Confidence earned: 975,885 is a filed store count, not an asserted completeness.
- Cost per jurisdiction: no tad.org fetch, no second CAMA zip, no L17 write.
- Dual interface: extras that match a map node are already structural live hits at declared vintage.

## Reasoning

Extras are not tagged by `ingested_at` or drop name. DROP-to-L21 needs a key list that does not exist. DROP-to-log restores an ingest log and deletes the L21 universe above that log. KEEP leaves the store Wave-4 already wrote, names 975,885 as the Tarrant 2026 baseline, and keeps `ready:false` so this is not a go to reload Dallas/Tarrant or flip anything. Inspect already reads `2026/cad-export`.

## Reversal criteria

- A named `tarrant_baseline_l21_20260814` prop_id set exists and a dry-run `NOT IN` count returns ~36,450, and the operator then picks DROP-to-L21.
- A live named extra `prop_id` is shown to be junk that hits a PMTiles node and serves a wrong living-area number, in which case a surgical delete of that key is a new card, not a reopen of DROP-to-log.

## Dependencies

Depends on classify JSON, L21 residual `rows2026=939435`, and Wave-4 preLoad. Unblocks a later one-county `stratmap-landuse` leftover rebake (Caldwell 48055) because no Tarrant DELETE is in flight. Does not unblock P-25 CAMA, P-80, P-79, P-09, or COVER.

## Counterparties

Internal. Operator Nick. Next agent restamps canvases to this ruling.
