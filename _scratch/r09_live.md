# R-09 live scratch

## GROUND-TRUTH (2026-08-21T14:50:17Z)
- Seat checkout: P:/doc_repo main e022436908248c9d378fd9358f062a0b39cf5bee (hook: integration). R-09 live worker. No product-repo writes. P:/legacy-design-tools not touched.
- Digest on cortex-api-00525-bev: sha256:fb022229b5b2d59a7d56d549e1e01f8cb6d51ce40299fdda7806b4d1694a2141 (spec.containers[0].image and status.imageDigest). Pin matched before traffic shift.
- Traffic after shift: cortex-api-00525-bev percent 100 (tag canary retained). cortex-api-00522-row absent from status.traffic[] (0). cortex-api-00524-pit unused.
- computedAt before: 2026-08-21T12:48:59.242Z. After POST: 2026-08-21T14:50:08.678Z. Live GET same stamp.
- POST serving URL probe=skip applied true HTTP 200 in 1.67s. Request log resource.labels.revision_name=cortex-api-00525-bev trace 690c06e03c777dd5542d73ffdc19391a.
- Named: 48001:easement hasWriter false. 48001:geometry atomFamilyState partial. 48027:zoning isPartial true.
- Not-green cells: 3066 / 3556. Rule: count cells that are not (hasWriter true AND atomFamilyState present AND isPartial false). Denominator summary.totalCells.
- DC-4 displayState no-atom: 0. DC-5 displayState no-writer: 0. derivation-indeterminate: 3048. Do not fold.

## DEAD-END
- Node fetch to serving POST failed in 242ms (TypeError: fetch failed) and left an AbortController timeout handle. curl.exe worked. Do not retry node fetch.

## LESSON
- Traffic JSON after update-traffic --format=json was an operations array, not the service object. Confirm with a second services describe --format=json and read status.traffic[] by name.
- 00522-row at 0 percent disappears from the traffic array rather than appearing as percent 0.

## OPEN
- DC-4/DC-5 still cannot fail on this snapshot (both 0). Indicator fields fire. Criterion change is an OPS-16 amendment, not this row.
