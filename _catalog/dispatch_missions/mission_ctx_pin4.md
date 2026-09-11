# CTX-PIN4 — the gate did its job, and the pin comment stopped keeping up

Repo: `hauska-factory`. Three items. The bump is one line again. Items 2 and 3 are why
this lane exists rather than another one-line chore PR.

## What happened, established before you start

`hauska-factory` main is RED on the `ldt-pin-staleness` workflow (check-run name `check`),
and has been since `2026-09-10T20:30:05Z`. It is red for a real reason and the gate is
correct. Do not weaken it.

The proof that this is LDT-side movement and not any factory merge is a same-commit
pass/fail pair on `63a606b1`:

    34500572096  63a606b1  success  push      2026-09-10T16:12:02Z
    34526748288  63a606b1  failure  schedule  2026-09-10T20:30:05Z

Identical factory commit, opposite results, because LDT main moved underneath it. The
scheduled run is the thing that caught it, which is the design working as CTX-PIN2 built
it. Two factory merges have landed on top of the red since (`51115b6f`, `c9ebad7d`), and
neither caused it. The OPS-21 S1 seat had to run its own forensics to establish that its
merge was innocent. That tax is the cost of leaving this red and is the reason this is not
a low-priority cleanup.

## Item 1 — the pin

`cloudbuild.publish.yaml` pins `_LDT_SHA: 591f5efe`. LDT main is
`cebd041d7ddf102f29ab60eeb9feb04946888125`. Two commits between:

- `c43e2436` CTX-HAYS-REBIND (LDT PR #653), binds Hays geometry to the parcel the county's
  own identifiers name;
- `cebd041d` CTX-HAYS-BACKFILL (LDT PR #654), the two-column backfill plus the check that
  was blind until a mutation run said so.

The gate's own output names ten changed files inside the bake's module graph, including
`artifacts/api-server/src/lib/nodeFacetBakeTier1Conformant.ts`,
`artifacts/api-server/src/lib/nodeFacetTier1ParcelJoin.ts`,
`lib/cad-ingest/src/ingest.ts`, `lib/cad-ingest/src/p78Merge.ts`,
`lib/cad-ingest/src/orion/parser.ts`, `lib/cad-ingest/src/pacs/parser.ts`,
`lib/cad-ingest/src/types.ts` and `lib/db/src/schema/cadProperty.ts`.

Bump to `cebd041d`. Before you do:

1. Confirm LDT main is still exactly `cebd041d`, before pinning and again at close. If it
   has moved, STOP and report rather than pinning to a SHA nobody named. Never pin to
   `main`.
2. Re-run `scripts/bake-module-graph.mjs` at the new pin. Report the module count, the
   unresolved count, and whether the module SET changed. The previous two pins both read
   26 modules and 0 unresolved with a byte-identical set. This range adds
   `joinIntegrityGate.ts` and `joinNormalize.ts` on the LDT side, so a set delta here is
   plausible and is exactly the kind of thing the comment must record. Reproduce the
   tracer against the OLD pin first and confirm it returns the known result before you
   trust it on the new one, the way CTX-PIN2 did.
3. Write the pin comment. See Item 2 first, because the comment is the item.

## Item 2 — the provenance comment stopped being written, and the file now lies

CTX-PIN and CTX-PIN2 each landed a pin bump with a comment block in the file's established
style saying what was picked up, why, and whether it was traced to the bake. The last two
bumps did not:

    63a606b1  #131  chore(publish): bump _LDT_SHA to 591f5efe (P-124/CTX-B6 and CTX-B7)
    83c98f97  #130  chore(publish): bump _LDT_SHA to fa7b9b67 (P-124/CTX-B1 ...)

Both diffs are a single changed line. No comment block was added by either. The effect is
that the last comment block in the file, which is CTX-PIN2's and ends "and for where the
check runs", sits directly above a value it does not describe. A reader tracing what LDT
content is in the publish image gets `9873ff11` and CTX-PIN2's reasoning, when the value is
two bumps further on at `591f5efe`. That is a false provenance label sitting on the
authoritative record, which is the same defect class CTX-PIN2's own mission called out on
`cloudbuild.parcel-r5-zoning.yaml` and declined to fix in a gating lane.

Restore the record. Your comment block covers the whole undocumented range, not only your
own bump: what `fa7b9b67` (CTX-B1), `9ae49246` (CTX-B6) and `591f5efe` (CTX-B7) picked up,
then what this bump picks up. Where you cannot establish whether the tracer was ever run
for #130 or #131, say that it was not established rather than implying it was. An honest
gap is the point; a confident sentence covering an unrun tracer is the thing to avoid.

Then answer the question this raises, in your close: what makes the next bump carry a
comment? The staleness gate is armed and works. The comment convention is held by a person
remembering, which `ENFORCEMENT.md` says is not a control. Either propose a mechanism (a
CI check that the `_LDT_SHA` diff hunk is accompanied by an added comment line is one
candidate, and it is cheap) or state plainly that this stays unenforced and why that is
acceptable. Do not build an over-broad version that fires on unrelated edits to the file.

## Item 3 — the bump cadence is the finding, not the trigger set

DO NOT re-derive why this workflow is main-only. It is already answered, deliberately and
at length, in `.github/workflows/ldt-pin-staleness.yml`'s own header comment: it is
kept out of `ci.yml` on purpose, because `ci.yml`'s `on: push: branches: ["**"]` plus
`pull_request` would make LDT's independent drift block every unrelated lane's every push
and PR, and a permanently red gate is a dead gate. It runs on push to main, on a
`0 */6 * * *` schedule, and on `workflow_dispatch` for whoever is about to dispatch a
publish build. Read that comment before forming a view. The reasoning is canon, not a gap.

The real finding is the rate. `cloudbuild.publish.yaml`'s `_LDT_SHA` has been bumped SIX
times in the thirty-eight hours between `2026-09-09T02:25Z` and `2026-09-10T16:11Z`:

    2026-09-09T02:25Z  e2b6c869  #113  -> 301bb75a
    2026-09-09T15:45Z  0c4c1ea6  #118  -> 3885efad
    2026-09-09T20:14Z  f8293d53  #125  -> 7a739849
    2026-09-10T02:25Z  b9ca9b4a  #127  -> 9873ff11
    2026-09-10T05:11Z  83c98f97  #130  -> fa7b9b67
    2026-09-10T16:11Z  63a606b1  #131  -> 591f5efe

Yours is the seventh. Every one is a hand-carried lane or a chore PR, and the gate has gone
red at least twice today: the scheduled run at `15:57:23Z` failed on `83c98f97` before
`#131` re-greened it at `16:11`, and the `20:30:05Z` run failed on `63a606b1` and is the
current red. Detection is also slower than the cron implies. GitHub delivers this schedule
late by a varying two and a half to five hours in observed runs (`10:48:32Z`, `15:57:23Z`,
`20:30:05Z` against nominal 06:00, 12:00, 18:00), so worst-case drift latency is closer to
eleven hours than to six.

So the question to answer in your close is not about triggers. It is whether a pin that
needs bumping roughly every six hours during an active LDT arc should be hand-bumped at
all, and if it should, what makes the seventh, eighth and ninth bumps carry their comment
when the fifth and sixth did not. State a recommendation. Do not build the automation in
this lane; a pin that auto-follows LDT main would delete the deliberate-lag property the
gate exists to protect, and that tradeoff deserves its own ruling rather than a lane's
improvisation.

## Verify by violating

Show the staleness check FAILING at the current pin against `cebd041d`, then PASSING at
the new pin. Exit codes read from the process, not from a pipe. Paste both literally.

If you add the comment-presence check, it must be shown rejecting a value-only bump and
admitting a bump that carries a comment, on real or constructed fixtures.

## What you must NOT do

Do not deploy, submit a Cloud Build, or run any Cloud Run job, bake, publish or walk. The
integration seat rebuilds from your merged main.

Do not write to `legacy-design-tools`, `hauska-engine` or `hauska-map`.

Do not weaken, disable, or add a bypass to the staleness gate. If you believe it is wrong,
report that with evidence instead of changing it.

Do not bump `cloudbuild.parcel-r5-zoning.yaml`'s `_LDT_SHA`. Still out of scope, still a
false label rather than a stale dependency.

## Close contract

Standard lane close JSON, plus:

- Literal `gh api` output confirming LDT main at pin time and at close.
- Tracer output at the old pin and the new pin, with the module count, unresolved count,
  and set delta stated.
- Both violation runs for the staleness check, and any for the comment check.
- Your answer on what enforces the next comment.
- Confirmation that `check` is green on main after merge, read as the check-run conclusion
  string, not as an exit code.
- `leave_behind`.

Report the merge commit.
