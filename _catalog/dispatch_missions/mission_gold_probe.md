# Mission — click a parcel and prove the CAD and landUse data is complete

## The operator's ask, and the one word that needs defining

> "The result I am expecting is to click a parcel and see accurate and complete CAD and
> landUse data. Complete being the key word."

**Complete does not mean every field carries a value, and building it that way would make
the system worse.** Four of the six golds expect a refusal or an absence as the *correct*
output. `48021:8720522` is a PDD whose setbacks are honestly refused — it sits in the
3,747 roster and that refusal is the right answer, not a miss. Unincorporated land is not
zoned by its county, so `not-applicable` is the truth there. A probe that scores those as
failures either fails forever or creates pressure to fabricate values, which is the defect
class this whole operation exists to prevent.

**Complete means no field is silently missing.** Every CAD and landUse field on the parcel
resolves to exactly one of four states, and carries what that state requires:

| state | requires |
|---|---|
| `value` | the value, plus provenance: source and timestamp |
| `absent-verified` | a **basis** — we looked, it is not there |
| `not-applicable` | a **reason** — it structurally cannot exist here |
| `refused` | a **named refusal** |

**A blank with no state is the defect.** It is indistinguishable from "we never looked",
and that indistinguishability is the whole problem. That is what this probe exists to
find, and it is a question that can actually be answered.

## Extend the walk. Do not build a new script.

Gate 8 dayOne already exists and already emits live probe artifacts against deployed golds
(for example `_inbox/2026-08-31_gate8_live_1437_48021.json`, and the C4 close test was
"re-run Gate 8 dayOne C4 on the deployed gold"). **A-021 already gates production on a
passed walk.**

**A new standalone script would be a fifth dormant mechanism** — correct, passing, and
gating nothing. Find where dayOne lives, extend its grade set there, and say where it
lives in your close. Property owns factory, engine, map and LDT, so wherever it is, it is
yours.

If you conclude it genuinely cannot be extended and must be new, **say why before writing
it**, and name what will execute it, what triggers it, and what fails when it fails.

## Run it against PRODUCTION first, today

Not at P6. Now, against prod as it stands.

A staging walk with no baseline tells you "these six look right"; it cannot tell you "these
six changed the way we intended." **Today's production run is the before picture**, and it
also answers the operator's question immediately: it shows what a click on those parcels
actually returns right now.

Expect it to fail. That is the point. A first run that passes everything means the probe
is not looking hard enough.

## The six golds and their expected outcomes

| parcel | expected |
|---|---|
| `48021:34137` | landUse present and **not null-as-absent** |
| `48021:8720522` | PDD, setbacks **refused** — the refusal is correct output |
| `48209:135570` | `joined-situs` **or** honest `gate-blocked` |
| `48491:76149` | never `joined` |
| `48453:493738` | honest `no-row` |
| `48453:231086` | `stamp-missing` for Austin |

## Defects already known to exist. If the probe does not catch these, it is not working.

Use them as your known-violation set — the probe must fail on each, today, before you
trust a pass anywhere.

- **`"A1 — A1"`** minted inside PE by `description: landUseLabel ?? landUseCode`, a
  defaulted field then rendered again as a second datum.
- **`inspectHighLevelLabel` returns the literal string `"Zone"`** for `landUse`.
- **`yearBuilt`** occurs twice repo-wide, both type declarations, **never assigned**. Where
  it does render it must render with its source, because CAD 2021 disagrees with listing
  2022 on Driftwood and a bare number puts two contradicting figures on one screen.
- **Situs sentinels** that pass a non-null test: `", ,"` and `", TX 78660"`, plus `0,0`
  coordinates.
- **Grey box scope**: keyed on a per-row `absent-uncovered` state but printed as "in this
  area". The "setbacks" half of that string is true; do not fix the string as one unit.
- **`buildableAreaPct`** was absent while `buildableAreaSqFt` and `acreage.sqft` were both
  present. Derivable-but-absent is its own failure.

## The CAD field set

Cover the roll fields including the five CAD value fields that landed in LDT `#575`
(`1d19eb90`). Those reach the twin only through a bake, so **check whether they are served
yet and report the answer** rather than assuming either way — the merge was the
precondition, not the outcome.

Judge zero per field, not uniformly. A `$0` improvement value on vacant land is a real
value; 26,553 Bastrop parcels carry one. A `$0` land value looks like missing data. Do not
collapse zero into absent, and do not fabricate a zero for a missing value — those are
opposite errors and both are wrong.

## Output shape

**A per-parcel, per-field table showing the state of every field, not a pass/fail boolean.**
The operator wants to see it. A boolean cannot show that a field is blank-with-no-state,
which is the finding this whole card is for.

Emit it as a durable artifact under `_inbox/`, and make it re-runnable against staging
unchanged so P6 is a diff rather than a fresh judgement.

## Do not

- Do not score an honest refusal or a labelled absence as a failure.
- Do not build a standalone script without first showing the walk cannot be extended.
- Do not fabricate, default, or backfill any value to make a probe pass.
- Do not fix the defects you find on this card. Find and report them; fixing is a separate
  card and mixing them means neither is reviewable.
- Do not write to any store. This is a read-and-report card.
- Do not treat a merged PR as evidence a field is served.
- Do not touch any repository other than the registered worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare snapshot
in the first output. Report where dayOne lives and how you extended it, the per-parcel
per-field state table for all six golds against production, which of the known defects the
probe caught and which it missed, whether the `#575` CAD value fields are served yet, and
what a click on `48021:34137` actually returns today. Name what contradicted this card, or
say plainly that nothing did. `leave_behind` named. Subagents do not commit.
