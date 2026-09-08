---
id: 2026-09-08_staging-verification-loop-was-never-closed_finding
title: The staging verification loop was never closed, and OPS-19 rule 6 could not be satisfied by any honest route
date: 2026-09-08
status: open
applies_to: hauska-factory
plan_rows: [P-124]
seat: integration (doc-repo-79)
snapshot:
  hauska_factory: 3e0edafe
  measured_at: 2026-09-08T14:41Z-15:20Z
related:
  - _dispatches/2026-09-08_ctx-sitepoint_dispatch.md
  - 90_operations/OPS-16_texas_market_plan_of_record
---

# The staging verification loop was never closed

## What was found

`smart-site-factory.vercel.app` has never once read the Neon branch that a staging bake
writes to. Not since the branch scheme was introduced. The inline verify walk therefore
could not pass against a freshly baked county, and because OPS-19 rule 6 requires a passed
staging sibling before any production publish, **the production bake path was unreachable
by any honest route, for every county in the program.**

This was not a Caldwell problem, a P-124 problem, or a problem introduced by any change
made this session. It is how the staging lane has been the whole time.

## How it was found, which matters more than the finding

The first P-124 bake cleared the population gate, the rail gate, both bakes and the cadRoll
post-condition, then refused `WALK_FAILED` with no diagnosable detail in the log. The
temptation at that point is to re-run, or to `--skip-walk` and move on.

Instead: read what the site actually served, and compare it to what the bake actually wrote.

    STAGING branch (ep-snowy-cell)  snapshot_at = 2026-09-08T14:41:12Z   the fresh bake
    PRODUCTION    (ep-lucky-truth)  snapshot_at = 2026-09-01T22:43:35Z
    what the site served                          2026-09-01T22:01:22Z   NEITHER

The site served a timestamp matching neither store. That single mismatch is the whole
finding; everything after it was confirmation.

## The mechanism

`factory-staging-reset` called `createBranchFromParent` with a name ending in `Date.now()`,
so every run minted a NEW Neon branch with a NEW endpoint host. The Vercel project's
database connection string is fixed at deploy time, and its last deploy was 2026-08-27, so
it was pinned to the branch that existed on that date.

Every reset since has moved the staging data somewhere the site had never heard of.

Six branches had accumulated by the time this was found, three `neondb` and three
`hauska_mcp`, the oldest twelve days old, each holding a full copy-on-write image.

## Two halves, one fixed and one dispatched

**Fixed in code, hauska-factory `3e0edafe`.** `ensureStableStagingBranch` restores a branch
named `f06-staging-neondb` in place via Neon's restore endpoint, keeping its id and endpoint
host. The host is now permanent, so the site's connection string will be correct forever
rather than correct-until-the-next-reset.

Proven rather than asserted: staging-reset was run TWICE. The first run only proves the
create path. The second returned `reused: true` with branch id `br-purple-snow-ap51ewu6`
unchanged and the total branch count unchanged at 9, which is what proves the restore
actually restores in place instead of quietly minting another branch.

Stable branches now live:

    f06-staging-neondb      br-purple-snow-ap51ewu6   ep-gentle-star-appmbu2q...
    f06-staging-hauska_mcp  br-flat-boat-apt6vcp7     ep-floral-grass-ap8jeuo4...

**Dispatched, not done.** The site itself is still pinned to an old branch. The code fix
cannot retroactively move it; that is a Vercel env change plus a CLI redeploy on the
`smart-site-factory` project, which deploys from `hauska-map/apps/factory` and is the
property seat's. Compiled as `_dispatches/2026-09-08_ctx-sitepoint_dispatch.md`.

## Why this is the interesting failure

The gate CTX-F built is correct and it worked. Rule 6 refused exactly as designed. What was
missing is that nothing ever verified the verifier: the staging sibling requirement assumed
a staging walk COULD pass, and nobody had ever confirmed that assumption held. A control
whose precondition is unsatisfiable refuses correctly and forever, and reads identically to
a control that is simply strict.

This is the dormant-mechanism shape from a direction the doctrine does not currently name.
The existing categories are dormant (no trigger) and starved (trigger fires, input never
supplied). This is a third: **the mechanism fires, its input is supplied, and the input is
structurally incapable of satisfying it.** The walk ran, fetched real data, and compared it
against a bake it could never have seen.

The tell was the same one that has surfaced repeatedly this session: a number that matched
neither of the two stores it could plausibly have come from. Two candidate sources, an
observation matching neither, and the answer being a third thing nobody had listed.

## Open

The repoint itself, dispatched above.

The six accumulated branches. Deliberately NOT deleted: deletion is irreversible and the
site currently reads one of them. Cleanup is an operator call sequenced AFTER the repoint
verifies, never before.

Whether any previous "staging verified" claim in this program rests on a walk that could not
have been reading fresh data. Not audited. Every staging publish before today is suspect on
this axis, and that is worth knowing before any of them is cited as evidence.

`WALK_FAILED` carries no detail into the Cloud Run log; the CLI prints only `err.code`. The
walk's own verdict body was never written because it failed before recording. Diagnosing
this took a store-versus-site comparison that the log should have made unnecessary.
