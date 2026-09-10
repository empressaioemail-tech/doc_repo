# CTX-B5 — a record that was never on a roll did not leave it

repo: legacy-design-tools

## The claim being made today

`nodeFacetBakeTier1Conformant.ts`, `buildRecordRetirement` (around line 675, fired around
985-996): a retirement is earned when `apn != null && cadPropConsulted && cadPropRow == null`,
that is, no CAD row **at the declared vintage**. There is no check for a row at any other
vintage.

The emitted basis text asserts the account is *"not on the current roll -- split, merged,
renumbered or removed"*. That is a specific causal claim about an account's history.

## Why that is wrong for a large, measured population

CTX-B2 (hauska-factory #129, merged `ac4b314e`) scoped the cadRoll gate to the declared
vintage. Hays goes from 172,803 compared with 38,197 misses, refusing at 22.1 percent, to
134,606 compared with 0 misses, passing.

But CTX-B2 also established, by reading this source, that scoping the gate does not touch what
state those rows' baked snapshots carry. And CTX-HAYS-SPLIT measured directly, not by
subtraction, that 37,813 of those 38,197 prop_ids carry **no CAD appraisal signal at any
tax_year**. They are StratMap/TxGIO geometry-fill rows. They were never appraisal accounts.

So on the next Hays bake, roughly 37,813 records will serve an earned absence whose basis says
they were split, merged, renumbered or removed from a roll they were never on. It passes every
existing check, because nothing verifies the causal claim. That is the fabrication class
`ENFORCEMENT.md` exists to prevent, and it is being introduced by an absence rather than a
value.

## The question, not a conclusion

**Distinguish, at bake time, an account that left a roll from a record that was never on one.**

Both are absences. They are not the same absence and they must not carry the same basis.

Name at least two mechanisms that could tell them apart and say why you rejected the one you
did not take. Consider at minimum, and do not treat this list as exhaustive or as a
recommendation:

- whether a row exists for that prop_id at any other `tax_year`, which distinguishes
  "was on a roll once" from "never was";
- whether the geometry-fill lineage is itself detectable per row, noting that CTX-B1 established
  `assessed_value` presence as a discriminator that survives `p78Merge.ts`'s `ON CONFLICT`
  overwrite while `source_file` does not.

Whatever you choose must be **derived per row, never asserted**, and the basis text must say
only what the evidence supports.

## The constraint that binds the shape

CTX-B1 (#650, merged `fa7b9b67`) has already ruled the direction for the sibling problem on the
value side: a StratMap-redistributed dollar is served as a **labelled present value**, never
converted into an absence. Operator ruling A1 rejected the absence framing explicitly.

Do not resolve this one by inventing a second absence state that means "never an account" if a
more honest option exists. Say what you chose and why.

## What must not break

`isEarnedRecordRetirement` is consumed **cross-repo**. `hauska-factory`'s `verify-walk.mjs`
imports the real predicate out of the bundled `tier1-conformant-lib` entrypoint and refuses
loudly if it is not a function. CTX-B1 moved the implementation into `recordRetirement.ts` and
kept a re-export from `nodeFacetBakeTier1Conformant.ts` for exactly this reason. Any grading
change you make must keep the walk's RECORD_RETIRED path working, or must be reported as
needing a matching factory change you do NOT make yourself.

Caldwell `48055:1` is a genuine retirement and its serve-guard exemption, added by CTX-B1, must
keep working. It is your regression control.

## Verify by violating

A prop_id with rows at another tax_year but none at the declared vintage must keep the existing
retirement basis. A prop_id with no CAD row at any tax_year must not claim it left a roll.
Observe each failing before your change and passing after. Name the real prop_ids you used.

## Scope

`legacy-design-tools` only. Do not write to hauska-factory, hauska-engine or hauska-map. Do not
deploy, do not run a Cloud Build, a Cloud Run job, a bake, a publish or a walk. The integration
seat owns every execution.

Register your worktree before working and declare seat, branch and commit.

## Close contract

Standard lane close JSON, plus: the mechanisms considered and the one rejected; the exact basis
text each population now carries; both violation runs with real prop_ids; whether the walk's
RECORD_RETIRED path is affected and how you proved it; and `leave_behind`. Push and open a PR.
Do not merge. Report the PR number and head SHA.
