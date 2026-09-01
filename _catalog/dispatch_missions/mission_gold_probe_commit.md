# Mission — push the gate8 extension, then correct the card that produced it

## Push first. Third occurrence in one day.

`P:/tmp/hauska-factory-gold-probe` on `feat/gold-probe` holds **7 files with zero commits
and nothing on origin**:

```
 M scripts/gate8/assert.mjs
 M scripts/gate8/run.mjs
?? scripts/gate8/field-state.mjs
?? scripts/gate8/fixtures/card-surface-48021-34137.json
?? scripts/gate8/golds-gold-probe.json
?? scripts/gate8/pe-bundle.mjs
?? test/gate8-gold-probe.test.mjs
```

Third time today after `covers-fastpath` and the `a3`/`a4` trees. **The planner cannot
commit these** — SEAT-01 gives product repos one owning seat and refuses the planner at the
gate, so a close that defers a product commit to the planner defers it to nobody. Committing
your own branch is self service.

Stage by explicit pathspec, confirm the content is staged rather than the paths, commit,
push, and report the SHA before anything else. Then open a PR.

The extension is the right shape and should land: `computeDayOne` untouched so P4 is not
retargeted, default `golds.json` untouched so nothing regresses, K1 to K6 behind
`--golds scripts/gate8/golds-gold-probe.json`, 36 of 36 factory tests.

## Then correct the card that produced it

Six premises in `_catalog/dispatch_missions/mission_gold_probe.md` were **stale or wrong**
and the probe found that out. Fix them in the mission file so the next run does not
re-derive them:

- `yearBuilt` **is** assigned and renders `1910 (structural-fact)`. The card said never
  assigned.
- `landUseLabel ?? landUseCode` is gone from the `landUseFact` path. The surviving mint is
  the **cad-roll `description ?? code`** default.
- `inspectHighLevelLabel` returns `Land use` in current source, but **the shipped bundle
  still carries the `Zone` fallback**. Source-fixed and bundle-stale are different states
  and only one of them is what a user sees.
- "in this area" is gone; the footer now collapses a per-row uncovered state into
  "We have not stamped … for this parcel" instead.
- `buildableAreaPct` **56.1 is on the wire** for `48021:34137`. The card listed it absent.
- Hays `48209:135570` is **`joined-situs`** on the CAD roll, not `gate-blocked`.

## The contract gap, and this one is not a correction

> "Unmeasured `cityLimits` was folded into `absent-verified` because the four-state table
> has no `unmeasured` slot."

**That is two different states being collapsed, which is the exact defect the probe exists
to catch, forced by the probe's own vocabulary.** `absent-verified` means we looked and it
is not there. `unmeasured` means we have not looked. A user shown "not present" when the
truth is "not yet checked" has been told something false.

The roadmap treats `unmeasured` as a pre-serve state that probing converts
(`unmeasured -> absent-verified on probe`), which implies **nothing served should ever be
`unmeasured`**. The probe found one anyway, so either the serve path emits an unprobed
state or the contract is short a slot.

**Do not resolve this by widening the four-state contract on your own.** Report which fields
on which golds are genuinely unmeasured at serve time, and recommend whether the answer is
that the serve path must never emit them or that the contract needs a fifth state. That is a
ruling, not a code change.

## Do not

- Do not close before the branch is pushed.
- Do not change `computeDayOne` or the default `golds.json`.
- Do not fix any K1 to K6 defect on this card. Finding and fixing are separate cards and
  mixing them makes neither reviewable.
- Do not widen the four-state contract.
- Do not re-run the probe against staging; production is the baseline.
- Do not touch any repository other than the registered Factory worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare snapshot in
the first output and **report the pushed SHA before anything else**. Report the corrected
mission premises, the serve-time `unmeasured` fields, and your recommendation on the
contract gap. Name what contradicted this card, or say plainly that nothing did.
`leave_behind` named. Subagents do not commit.
