---
lane: OPS-21-R1
checkpoint: CP1 addendum (post adversarial review)
plan_row: P-146
---

# CP1 addendum — corrections from adversarial review

An in-process sub-agent adversarially reviewed `_inbox/2026-09-11_ops21-r1_cp1.json` per
AGENT_CONTRACT section 1 (fan model, one level deep, do-not-spawn-further clause carried,
read-only: no writes/mutations, no `--apply`). Full findings below with dispositions. No
implementation or `--apply` had occurred before this review; none of these corrections required
undoing anything.

## Finding 1 (BLOCKING) — CP2's named SUSPECT-heavy pilot city is out of scope

**Quoted defect:** CP1's `verificationPlan` named `san-antonio-tx` as "one SUSPECT-heavy city
... 21 of its 21 flagged maxHeightFt slots are SUSPECT/REAL split 4/17." San Antonio is Bexar
County (48029) — not one of OPS-21's six counties. Confirmed live: querying the actual
547,657-cell flagged population's `basis.jurisdictionKey` values returns 14 in-scope
jurisdictions, and `san-antonio-tx` is not among them (`cedar-park-tx` 21,129 and
`liberty-hill-tx` 6,056 are, and are in-scope). `parcel-envelope-cells.mjs`'s own
`IN_SCOPE_COUNTIES` filter would make a `--city san-antonio-tx` pilot either refuse
(`NO_IN_SCOPE_CITIES`) or silently match nothing.

**Disposition: ACCEPTED, corrected.** CP2's SUSPECT-heavy pilot is now `cedar-park-tx`
(maxHeightFt: 3 REAL / 6 SUSPECT live-confirmed) instead of `san-antonio-tx`. The
`san-antonio-tx` classification data stays in the checked-in table (it is real corpus data,
harmless to carry) but is out of scope for any live pilot or apply.

## Finding 2 (SHOULD-FIX) — only one of three write branches gets the current-state gate

**Quoted defect:** `design.jobChange.coreProblem` described the unaccounted/revisit/other
branching only as it applies to `resolvedCells()` (the `zd.kind === 'value'` path). The other
two branches that push the same three rail keys into `cellBatch` — `noRuledTableCells()`
(`!city.ruled`) and `refusedFromUpstreamCells()` (`zd.kind === 'refused'`) — push unconditionally
today, with no read of current state at all.

**Disposition: ACCEPTED as a real gap, closed by construction rather than by a new runtime
check per branch.** Analysis, not just the reviewer's live spot-check: `ENVELOPE_ROUTER_FIELD_NOT_SPECIFIED`
can only ever be written by `resolvedCells()` — it is the only call site that invokes
`resolveEnvelopeForParcel`. A cell carrying that exact finding therefore proves, by construction,
that this same parcel's `zoningDistrict` was `value` and `city.ruled` was true at write time.
`zoningDistrict` cells are themselves gated to never regress once `value` (same convention this
whole codebase uses), and `city.ruled`/the corpus routing are a deterministic function of a
version-pinned corpus — so a re-run cannot route this parcel through `noRuledTableCells()` or
`refusedFromUpstreamCells()` instead. **Belt-and-suspenders adopted anyway, cheaply:** the
per-field current-state read (added for `resolvedCells()`'s branch) is applied uniformly to all
three branches before any batch entry is constructed, not only where it was structurally
necessary — removes reliance on the invariant holding forever, at negligible cost (one shared
helper, one extra Map lookup per rail per parcel, no extra query).

**Also newly confirmed, closing the analysis above with the SQL layer too:** the widened
`UPDATE_ENVELOPE_CELLS_SQL` gate's added OR-term matches only `kind='absent-verified' AND
basis.finding='ENVELOPE_ROUTER_FIELD_NOT_SPECIFIED'`. `refusedFromUpstreamCells()` writes
`kind:'refused'`, never `absent-verified` — that OR-term structurally cannot match a `refused`
cell regardless of which branch runs, so Finding 2's worst case (a `refused`-shaped rewrite) was
never reachable even before this fix. The `noRuledTableCells()` case uses a dynamic
`finding: "no ruled setback table exists for ${jurisdictionKey}"` string, never the literal
`ENVELOPE_ROUTER_FIELD_NOT_SPECIFIED` constant, so it also could not have matched. The added
per-branch gate is real defense-in-depth, not a fix to a live hole.

## Finding 3 (SHOULD-FIX) — the SENTINEL_UNIFORM before/after check needs two independently-measured numbers, not subtraction

**Quoted defect:** stored `basis` on a flagged cell records `jurisdictionKey` + `districtCode`
(the raw live zoning code), never `districtName` — the classification table's own lookup key
is `(jurisdictionKey, field, districtName)`. So "which live cells are SENTINEL_UNIFORM" is not a
standalone SQL predicate over `cell_state`; it requires replaying `mapDistrict`'s code-to-name
resolution in JS. CP1's `completionPredicate` line didn't say the dry run's classification must
be captured and reused, and DEV_PROCESS 1.3 forbids deriving a reported class by subtraction
(`after = before - moved`) rather than measuring it directly.

**Disposition: ACCEPTED.** The verification plan is corrected to two INDEPENDENTLY measured
numbers, reconciled per DEV_PROCESS 1.4, never subtracted:
1. `directAfter` — `count(*) WHERE rail_key IN (maxHeightFt, maxLotCoveragePct) AND kind='absent-verified' AND basis->>'finding'='ENVELOPE_ROUTER_FIELD_NOT_SPECIFIED'`, run live, post-apply.
2. `dryRunSentinelUniformTally` — computed by a dedicated read-only pass BEFORE apply that reads every currently-flagged cell, resolves `districtName` via the same `mapDistrict` the resolver uses, classifies via the table, and sums the SENTINEL_UNIFORM bucket directly (not by subtracting the other two buckets from the 547,657 total).

These two numbers must agree exactly; if they don't, that is a finding, not a rounding
difference (DEV_PROCESS 1.4). Additionally, for the "not even a timestamp bump" claim
specifically: the same pre-apply pass captures `count` and `max(updated_at)` for the identified
SENTINEL_UNIFORM cell set; the identical query re-run post-apply must show the same count and
the same `max(updated_at)` — a changed `updated_at` on a set whose membership didn't change is
itself proof of an unwanted write, independent of the count check.

## Finding 4 (MINOR) — footprint's `blockedOn='maxLotCoveragePct'` gate doesn't encode *why* it's blocked

**Disposition: ACCEPTED, already substantially mitigated by design, tightened further.** Footprint's
new disposition is derived from maxLotCoveragePct's fresh, same-parcel, same-pass classification
result (not a separate query keyed only on the `blockedOn` string), so in practice this was
already scoped to "this run just changed maxLotCoveragePct for this exact parcel." Confirmed live
that today 100% of `blockedOn='maxLotCoveragePct'` footprint cells (324,541) correspond exactly to
maxLotCoveragePct's NOT_SPECIFIED population (324,541) — no other blocking reason exists today.
Implementation will still only touch a footprint cell when (a) its current stored state is
exactly `absent-verified` with `blockedOn='maxLotCoveragePct'`, AND (b) this run's maxLotCoveragePct
classification for the same parcel is REAL_VALUE_FLAGGED or SUSPECT — both conditions checked
explicitly rather than relying on (a) alone.

## Finding 5 (MINOR) — 7 dead rows in the classification table (`bastrop-city-tx`)

**Disposition: ACCEPTED, no removal.** `bastrop-city-tx`'s flagged rows can never be reached live
(`getSetbackTableForZoning` routes those specific codes away before any Bastrop table lookup),
confirmed live (zero live cells carry `jurisdictionKey=bastrop-city-tx`). Left in the table
un-flagged rather than deleted — it is real, accurate corpus data and removing rows from a
generated table invites exactly the kind of hand-editing 3P-15's future reader should not have to
untangle. Noted here for the record instead.

## Net effect on CP1's design section

- `verificationPlan`: CP2 pilot city swap (Finding 1); completion-predicate measurement method
  corrected to two independently-measured numbers (Finding 3).
- `jobChange`: current-state gate applied uniformly to all three write branches, not only
  `resolvedCells()` (Finding 2), as defense-in-depth over an already-sound analytic guarantee.
- No change needed to the classification table itself, the resolver change, or the SQL gate
  widening — all three held up under review.

Status: CP1 design now considered closed for implementation. Proceeding to code changes.
