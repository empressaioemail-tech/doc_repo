You MAY spawn sub-agents. A sub-agent MUST NOT spawn, commit, merge, or deploy. You MUST NOT git add / commit / push. You MUST NOT deploy. You MUST NOT atoms --apply. You MUST NOT backfill existing rows. You MUST NOT rewrite 100 million atoms. You MUST NOT mint verified-absence pairs to close A2. You MUST NOT occupy P:/hauska-engine or P:/seat-worktrees/property/hauska-engine.

Plan row P-55. Seat: property (hauska-engine is property-owned; there is no engine seat). Occupancy: isolated worktree P:/hauska-engine-worktrees/ident-p55 branch ident-p55 tracking origin/main. Doc_repo writes: your _inbox JSON only.

WDLL: P:/doc_repo/_inbox/2026-08-21_ops18_all_board_WDLL.md item 11 and item 13. Defect classes: OPS-18b Wave C. Grade: `_inbox/2026-08-21_r07_store_grade.md` Q8a/Q8b pins (flood 16/100, special-district 20/100). Do not raise those pins.

## Mission

New writes only. COVER holds the `--apply` slot. You change writers and tests so the next apply cannot mint the old defects.

C1. Canonical `entity_id` for parcel-keyed facts is `{fips}:{integer}`. Padded StratMap form goes in `externalKeys`, not in `entity_id`.

C2. `:outside` and `:primary` must not appear in new `entity_id`. Move them to a body field or a typed edge. Special-district and building-footprint writers are the known sources (Q8c, Q4c).

C3. `externalKeys` is written on the same call as C1. A writer that mints a canonical key and drops the source key is a fail.

C4. Write `applies-to` from the fact atom to the parcel-node at the same moment as the fact. `body.parcelNodeId` is not the edge. Today `atom_links` `applies-to` is starved (0). Do not fake a count with a SELECT you did not write.

C5. Do not implement. Do not widen typed `absence` to count as the verified pair. Leave a named leftover.

Recurrence (must exist in this tree, even if the storage-port trigger is still dormant on atoms):

- Writer unit tests: integer grammar in `entity_id`, source key in `externalKeys`, no sentinel in `entity_id`, at least one `applies-to` row for the written DID.
- A reject helper for decimal-padded parcel `entity_id` and for `:outside` / `:primary`. If the storage port still has no trigger, the helper is called from the writer path and the test proves a write that skips it would mint the old shape. Name the bypass (COPY / raw SQL).

Do not run a store-wide Q8 sample that scans 100M rows. A bounded fixture sample is enough. Do not start a backfill job.

Leave the diff uncommitted.

## Return

CP1 before edits: occupancy SHA, writers you will touch, C1-C4 contract, what you will violate. CP2 after tests. CLOSE quotes files, tests, and a statement that zero `--apply` ran. leave_behind: planner merge; backfill waits until COVER yields the slot.
