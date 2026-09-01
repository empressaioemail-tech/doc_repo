# ctx-totals

## LESSON
Factory `runs.status` is `success`, not `succeeded`. Filtering the English word returns an empty six-county set while the rows are sitting there.

## LESSON
`landing_parcel_jurisdiction.method` is `ring` on covers-v1 and intersection-v1 alike. Method version lives on factory chunk bodies / manifests (or implicitMethodVersion when null).

## LESSON
Latest `runs.status=success` is not the persist run. McLennan `1e5d4ae5` is a covers-v1 measure (`persist:false`). Landing is `a62e3fce`.

## GROUND-TRUTH
2026-09-01T12:52:15Z no live factory-p2-juris. Persist totals agree with store COUNT on all six. Travis payload sentinel `{excluded:true,n:1,prop_id:"0",reason:"txgio_parcel_sentinel_zero"}`. Table: `_inbox/2026-09-01_ctx-totals_table.json`.

## OPEN
P4 takes denominators from that table. Do not re-query landing for a chat number.
