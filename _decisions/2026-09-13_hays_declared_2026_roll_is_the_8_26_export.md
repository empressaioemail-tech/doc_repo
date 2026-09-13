---
id: 2026-09-13_hays_declared_2026_roll_is_the_8_26_export
title: Hays' declared 2026 roll is the 2026-08-26 export, loaded as a re-ingest after P-177, with the accounts it lacks marked
date: 2026-09-13
last_updated: 2026-09-13
status: active
owner: nick
decided_by: nick (operator), 2026-09-13, "i agree with your rec"
plan_rows: [P-178, P-124, P-177]
related:
  - _inbox/2026-09-10_ctx-hays-rebind_addendum_source_reconciliation.json
  - _inbox/2026-09-10_ctx-hays-backfill_close.json
  - _decisions/2026-09-12_loaders_get_cloud_jobs_no_break_glass.md
  - _catalog/dispatch_missions/mission_p178_hays_declared_roll.md
---

## Decision

Hays County's declared 2026 CAD vintage is the 2026-08-26 property data export
(`hays.zip`, sha256 `7a4bd56dad244b0ead0a0899e082800d2ea01660129d69a3b60387602ee2b193`, PROPERTY
member `PropertyDataExport1404449.txt`, 40 columns, 134,591 distinct accounts), which post-dates
certification. The preliminary export loaded on 2026-09-02 (`2026-PRELIMINARY-DATA-EXPORT-FILES.zip`,
134,606 rows, April notice values) is superseded for tax_year 2026. Consistent with the
2026-09-12 ruling for Travis (certified 07182026 over preliminary).

## How it lands

A re-ingest through the cloud loader (`ldt-cad-ingest`, never a laptop apply), AFTER P-177 has
merged and published, so the crosswalk join is already the rule when the values change. The
390 accounts on the preliminary roll that the 8-26 export lacks are MARKED (a declared state on
the row, `absent-from-declared-drop`, with the preliminary values retained and labelled), never
silently kept as if certified and never deleted. The 375 accounts the export carries that the
preliminary roll lacked are inserted. The identifier columns the backfill wrote are re-written
from the same export by the parser and verified unchanged by digest. The dollar rows' vintage
label becomes the drop's name and date, not the load timestamp.

## Consequences

- Market value moves on 45,524 accounts (5.8 billion dollars of absolute movement, measured
  2026-09-10); situs on 509. Value history shows one 2026 entry, the certified one, with the
  preliminary retained as provenance, not as a second 2026 row.
- Until P-178 lands, every Hays dollar Smart Site prints is a notice value; the card's vintage
  label must say `2026 preliminary` so a customer comparing to hayscad.com is not misled.
- The cadRoll publish gate reads the declared vintage; the declaration is updated in the LDT
  vintage registry in the same change.

## Reversal criteria

Reversed if the appraisal district publishes a later 2026 supplement that the operator declares
instead, in which case the same lane re-runs on the new drop; or if the re-ingest's digest shows
the identifier columns changed, which stops the lane before publish.
