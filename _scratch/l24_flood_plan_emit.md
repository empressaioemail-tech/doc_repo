# L24 flood plan pre-emission scratch

## OPEN
- METROS HOLD until L16 pipelines leg close artifact. Then one-at-a-time in Ector gap.
- Close owed `_inbox/2026-08-14_l24_close.json` after metros.

## DONE
- Remainder 77/77 NDJSON READY (P-08). Resume 7 complete 2026-08-14T18:28:58Z incl. 48491 feature-budget OK.

## OPERATOR RULINGS (2026-08-14)
- Zone-X digest ACCEPTED: post-#325 plans correct; L15 stale; no further reconciliation.
- Contention ACCEPTED: L16 shared-PostGIS applies = heavy-window occupants (operator → L16 + contract).
- Harris abort correct. Metros HOLD to pipelines close.
- 48491 feature-based budgets: calibrated (376s wall vs 888 budget).

## GROUND-TRUTH
- Manifest flood_remainder.status=READY; flood_metros=HOLD_FOR_L16_PIPELINES_CLOSE @ 2026-08-14T18:29Z.
- Worktree `P:/hauska-engine-worktrees/l24-flood-plan-emit` @ e65baf9.

## OPERATOR RULINGS (2026-08-14)
- Zone-X digest adjudication ACCEPTED: post-#325 plans are correct; L15 summaries are pre-fix stale. Mismatch cause recorded; no further reconciliation owed.
- Contention finding ACCEPTED: L16 applies with shared-PostGIS reads (pipelines/wells/footprint joins) count as heavy-window occupants. Operator carrying into L16 + contract at close.
- Harris abort correct (12 min zero-CPU = starvation). Metros HOLD to leg boundary.
- 48491 false-halt: feature-based budgets (already in resume runner).

## FINDING (closed adjudication)
- L15 digests != L24 digests where outside-zone parcels exist: Zone-X fail-closed (#325). L15 stamped PRESENT `_outside`; current writer ABSENT `no-flood-coverage`. READY gates on current NDJSON.

## LESSON
- L15 runner false-fail on stdout `--apply` substring — judge artifacts only.
- Statewide `readParcelRoster` GROUP BY times out under concurrent load; single-county + statement_timeout=0 (L24 worktree local).
- Default remainder budget (~216s) false-halts ~280k-feature counties mid-batch — size from live feature count.

## GROUND-TRUTH
- 48039 plan-only OK wallMs=340604 digestMatchPrior=true @ 2026-08-14T17:47Z.
- 48261 digest `f682a5f9…` format flood-plan-ndjson-v1.
- Worktree `P:/hauska-engine-worktrees/l24-flood-plan-emit` @ e65baf9.
- Mutex `P:/tmp/plan_farm_20260813/progress.json` heavyScan.
