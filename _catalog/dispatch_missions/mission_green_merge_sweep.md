# Mission — five PRs are green, mergeable, and nobody is merging them

## What is sitting there

Read live 2026-09-01 at roughly 05:40Z:

```
LDT    #575  SUCCESS  MERGEABLE   feat(p91): CAD value fields on the twin
engine #371  SUCCESS  MERGEABLE   fix(p91): Option B, owner fields off cad-parcel-roll
map    #332  SUCCESS  MERGEABLE   fix(pe/P-104): enforce Studio on the web, server side
LDT    #577  SUCCESS  MERGEABLE   feat(P-104): the server computes studioGranted
LDT    #576  SUCCESS  MERGEABLE   fix(p85): portal access ruling
```

Green and unmerged is a worse state than red. Red gets worked; green gets forgotten, and
each of these ages against a base that keeps moving.

**Merge is self service.** You do not need authorisation for your own branch. What you do
need is to confirm each one is still green **against the current base** before merging it,
because a green check against a stale base is not a green check.

## Order, and two of these are not interchangeable

**1. `#575` first. It has a deadline and the others do not.** New fields reach the twin
only through a bake, and the standing ruling is one more production bake at Wave R and then
no re-bake. Merged before it, these fields ride a bake that is already happening. Missed,
they wait for a bake the operator has ruled against.

**2. `#371` second, and report its merge SHA.** It is the forward fix that stops new writes
of `ownerName` and `ownerMailingAddress` onto `cad-parcel-roll`. The `owner-backfill` card
removes the existing pool of roughly 239,000 bodies. **Neither alone closes the exposure**,
and `owner-backfill` is queued behind this card specifically so it can name this SHA. Put
the SHA in your close where the next card can read it.

**3. `#577` and `#332` are two halves of one change.** Both are P-104 studio enforcement,
one server-side in LDT and one in the map surface. Say what order they must land in and
why, or say plainly that they are independent. **Do not merge them in whichever order the
list happens to be in.** If landing one without the other leaves a window where the gate is
half-enforced, name that window.

**4. `#576` last.** Independent as far as this card knows.

## Before each merge

Re-read the check **conclusion string**. A `gh` exit code is not a CI result and has been
misread here before.

If the base has moved since the check ran:

```
gh api -X PUT repos/empressaioemail-tech/<repo>/pulls/<n>/update-branch
```

`git rebase` is blocked in this environment. Then wait for green and read the string again.

## The falsifier

**For each PR, name the base SHA its green check ran against, and confirm that is the base
it merged onto.** Two green PRs can merge red when the base moves between them, and this
card merges five in a row into three repos. If a merge turns the base red for a later PR in
this list, stop and report rather than merging the rest onto a broken base.

**Do not close `#575` as done on the merge.** Its point is reaching the twin through Wave R.
Merged is the precondition; it is not the outcome. Say what still has to happen.

## Do not

- Do not merge anything whose green is against a stale base.
- Do not judge CI by a `gh` exit code.
- Do not merge `#577` and `#332` in arbitrary order without saying why the order is safe.
- Do not touch factory `#50`, `#51`, `#52` or `feat/covers-fastpath`; those belong to the
  `factory-merges` card and merging them here would misdescribe both closes.
- Do not deploy anything. Merging is not deploying, and no card here authorises a deploy.
- Do not open new PRs or fix code. If one is not mergeable, report it and move on.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare snapshot
per repo in the first output. Report each merge SHA, the base each green ran against, the
`#577`/`#332` ordering decision and its reasoning, and **`#371`'s merge SHA prominently**
because the next card needs it. State what remains for `#575` beyond the merge. Name what
contradicted this card, or say plainly that nothing did. `leave_behind` named. Subagents do
not commit.
