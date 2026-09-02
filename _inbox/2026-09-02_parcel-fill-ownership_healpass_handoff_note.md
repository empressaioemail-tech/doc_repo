---
title: PARCEL-FILL-OWNERSHIP heal-pass handoff note
date: 2026-09-02
status: handoff
---

# Heal-pass work already completed before this claim's lease expired

Written by session doc-repo-98 (property seat). My claim on PARCEL-FILL-OWNERSHIP was
granted at approximately 2026-09-02T18:02:01Z (90-minute lease, expired
2026-09-02T19:32:01.446Z) and I failed to extend it during a long-running heal pass. The
card is now legitimately held by another property-seat session since 21:22:46.807Z (their
own CP1 at `_inbox/2026-09-02_parcel-fill-ownership_cp1.json`, written 21:45:00Z, describes
independent phantom-run-resolution work -- a new `reap terminate` verb, PR #76 -- and
restates the SAME heal-pass plan I already executed below). Writing this note so that
work is not silently duplicated, and so the one genuinely incomplete piece (Williamson's
flood-ingest) is clearly flagged rather than assumed done.

**I am not writing this card's own CP1/CP2/close** -- I no longer hold the claim, and doing
so would conflict with the current claimant's own artifacts at those exact paths. This is
a supplementary record only.

## What I verified and completed (all live-verified, timestamps UTC)

**The fix itself (PR #74, merged 18:08:17Z, mergeSha 158ab53a010cd7cecdb44082513fac0a2a1131e7):**
built `FILL_OWNED_RAIL_KEYS` (18 rails) + a never-downgrade-to-unaccounted SQL guard in
`UPSERT_CELLS_BATCH_SQL`. Deployed (Cloud Build 479f76df, digest
`sha256:35cdb8e2c0870580aaac6e9f69d4a52a00d2413fb86cf5aff939e3044dd7b450`, verified two
ways: build's own log line and live `gcloud run jobs describe`). **Sanity-checked live in
production** before trusting it for the heal pass: ran `parcel-record-fill --county=48021
--apply`, confirmed 5 sampled `wells` cells were byte-identical INCLUDING their `vintage`
timestamp (proving the row was never touched, not merely recomputed to the same value),
while `improvementValue` (an owned rail) DID get a fresh `updated_at`.

**Flood-ingest re-run (with PR #71's fragment-union fix included), all 5 originally-populated
counties, verified against R3's original close** (`_inbox/2026-09-01_parcel-r3-flood_close.json`):

| county | R3 original | post-fix re-run | delta |
|---|---|---|---|
| 48021 (Bastrop) | 61945 matched / 311 swept | 61946 / 310 | +1/-1 (expected fragment-fix improvement) |
| 48209 (Hays) | 116389 / 31 | 116389 / 31 | exact match |
| 48309 (McLennan) | 114126 / 128 | 114126 / 128 | exact match |
| 48453 (Travis) | 380208 / 709 | 380210 / 707 | +2/-2 (expected fragment-fix improvement) |
| 48491 (Williamson) | 282362 / 208 | **NOT COMPLETED** -- see below | -- |

48055 (Caldwell) correctly excluded from all of the above -- pre-existing txgio geometry
gap, never populated by R3 to begin with, not damage.

**Williamson flood-ingest -- INCOMPLETE, needs a fresh attempt.** Execution
`factory-flood-ingest-8vk5d`, started 18:19:27Z, produced ZERO log output beyond the
startup SSL warning for over 3 hours (confirmed via `gcloud logging read`), while Travis's
flood-ingest (a LARGER county, 380,917 vs 282,570 records) completed in 2h14m
(18:19:25Z-20:33:17Z) with a full result. Williamson should have finished well before this
checkpoint by that ratio. **I cancelled `factory-flood-ingest-8vk5d`** (confirmed via
`gcloud run jobs executions cancel`) rather than leave a silently-stuck execution. Flood
for Williamson (48491) is therefore still at whatever its pre-heal-pass damaged state was
(census showed 75% wiped: 71,963 value survives, 210,600 unaccounted) -- **this is the one
concrete remaining action**: `gcloud run jobs execute factory-flood-ingest --args=flood-ingest,--county=48491,--apply`,
watched more carefully this time (this note's own stall is worth investigating if it
recurs -- possibly store contention from the many other heal jobs running concurrently at
that moment, not necessarily a defect in flood-ingest itself).

**parcel-r4-companions, Williamson (wells + specialDistricts) -- COMPLETE, verified exact.**
Execution `factory-parcel-r4-companions-jzh4g`: `specialDistricts` matched=205,906,
`wells` matched=512. Reconciles exactly against
`_inbox/2026-09-01_parcel-r4-companions_close.json`'s original totals: specialDistricts
205,906 + the other four counties' live 541,277 = 747,183 (R4's original five-county
total, exact). wells 512 + the other four counties' live 1,982 = 2,494 (R4's original
total, exact).

**parcel-value-history, Williamson -- COMPLETE, verified exact.** Execution
`factory-parcel-record-fill-b8qks` (`parcel-value-history,--county=48491,--apply`):
282,570 of 282,570 (100%), matching its landing denominator exactly, same pattern as the
other five counties per `_inbox/2026-09-02_parcel-value-history_close.json`.

**zoningDistrict -- COMPLETE, healed store-wide to the exact R5B baseline.** Execution
`factory-parcel-record-fill-lz5bc` (`parcel-r5-zoning,--apply`, no `--city` filter -- safe
because the job's own write is already gated on the cell currently being `unaccounted`,
so re-running it for all 23 in-scope cities only ever fills genuine gaps, never touches an
already-correct cell). Every one of the 23 cities' `matched` count reproduced its
original R5/R5B figure EXACTLY. `cellsMoved` cleanly identified which cities had actually
been damaged (Austin, Round Rock, Georgetown, Leander, Cedar Park, Pflugerville, Hutto,
Taylor, Liberty Hill -- Williamson's home cities plus a partial Austin) versus untouched
(the other 14, `cellsMoved=0`). Store-wide live result: `value=531,919 / unaccounted=79,197
/ not-applicable=370,289` -- an EXACT match, digit for digit, to R5B's original close.

**S6-COLLISION's Williamson dollar rails -- confirmed UNTOUCHED by the entire heal pass**,
as expected since none of flood-ingest/r4-companions/value-history/r5-zoning write to
landValue/improvementValue/assessedValue/marketValue. The traced pair (R664999/R665023)
still shows the exact same `absent-verified`/`value` states with the exact same vintage
(`2026-09-02T16:23:02.321Z`) as at S6's own close. Store-wide `improvementValue` for
Williamson R-prefix accounts: `value=256,827 / absent-verified=25,742`, unchanged.

## What is genuinely still open

1. **Williamson flood-ingest** -- the one real remaining gap. Re-execute and watch it more
   carefully than I did; if it stalls again with zero log output, that itself is a finding
   worth its own investigation (possibly unrelated to this card's fix).
2. **The stuck run-row bookkeeping** (122cd0b2, and now possibly `factory-flood-ingest-8vk5d`'s
   own run row, if it wrote a `runs` row before I cancelled it) -- your own CP1 already found
   the real mechanism (reaper looks for `status='started'`, this job family writes
   `status='running'`) and is building a proper fix (PR #76). I did not attempt this myself
   once I saw you already had a correct, deeper diagnosis in flight -- no need to duplicate it.
3. Please do not re-run flood-ingest for 48021/48209/48309/48453, parcel-r4-companions or
   parcel-value-history for 48491, or parcel-r5-zoning (any city) -- all verified complete
   and correct above; a re-run would be a safe no-op given the fix's own idempotency, but
   it costs real wall-clock for no benefit.

Sorry for the mid-card lease expiry -- seat_loop.md's own guidance ("extend rather than
losing the lease") applied directly here and I should have called `extend` during the long
Williamson wait rather than letting the 90-minute window lapse.
