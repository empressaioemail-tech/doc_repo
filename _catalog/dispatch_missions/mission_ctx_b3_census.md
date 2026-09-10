# CTX-B3 — the instrument that ends the serial discovery

Repo: `hauska-factory`. This is the structural correction the third-party review identified.
It is worth more than any individual fix in this program.

## Why this exists

The review's central finding
(`_inbox/2026-09-10_ctx_third_party_review.md` section 2): **the instrument that declares a
county done guarantees a new defect class behind every cleared one.**

`verify-walk.mjs`'s `gradeParcelResponse` grades a sample of roughly 180 parcels per county
by one HTTP read each. It **short-circuits** — a non-ok HTTP response fails
`BP-MEANING-01` at 478-480 and nothing behind it is graded; an earned retirement grades
`RETIRED` and skips content at 490-522. `gradeTier1Content` (424-464) checks that each of 28
required leaves carries one of four recognised states. **It does not read a dollar value, a
provenance string, or a second source.**

And `BAKE_OWNED_REQUIRED_LEAF_PATHS` is grown **by hand**: four leaves on 2026-09-08, acreage
on 2026-09-09. The divergence test between the walk's list and the bake's list **skips in
CI** because no LDT checkout is present
(`_inbox/2026-09-09_ctx-walkrule_close.json:84-90`).

So a leaf not yet on the list is invisible until someone adds it, a 422 hides every leaf
behind it, and 180 sampled parcels could never see 291,231 null acreage cells — which one
SQL over the store could have counted at any time since 2026-08-30.

**Serial discovery is guaranteed by construction. Another fix does not end it. This does.**

## The precedent, already in this repo

`scripts/ctx-prov/provenance-population.mjs` re-expressed **one** walk predicate as SQL over
the whole served store for all six counties and found **18,037 rows** in a full-table scan
that the sampled walk had surfaced as a **single parcel**.

B3 is that script generalised to every required leaf.

## What to build

A file-based, self-tested script that reads **every** `place_layer_snapshots` tier-1 row for
a county on the target store and classifies:

- each of the 28 required leaves, using the walk's own classifier so the two cannot disagree;
- the four dollar fields;
- the owner name;
- the structural tier.

Reporting counts per `(county, leaf, state)`.

**It must refuse on:**

- any unrecognised state — the walk's `classifyRequiredLeaf` silently passed those before
  2026-09-09 and that is exactly the failure being designed against;
- any sentinel string — the review found an owner name of `"-"` served as present
  (`48309:109745`), a value-history entry with every field null served as present
  (`48055:1`), and a `vintage` field that is a batch write timestamp on present values and a
  source-edition string on absent ones, so the field does not mean one thing;
- any tier-field disagreement — `48021:35585` has a structural tier saying `cad-export`
  while its own vintage string says `tier:stratmap-roll;adapter:stratmap`.

## Take the leaf list from the bake, not the walk

The walk-rule lane recorded that **the walk's required-path list is stale against the pinned
bake by eight paths.** So B3 must read its list from the bake's own
`BAKE_OWNED_REQUIRED_LEAF_PATHS` **at the pin**, not from the walk.

If those two lists disagree, that disagreement is itself a finding and belongs in your close
with the count.

## Self-test in both directions, and the instrument's own falsifier

Required fixtures, each observed failing before passing:

- a bare null must fail;
- an owner of `"-"` must fail;
- a clean fixture must pass.

**The instrument's falsifier: if it passes a store the walk fails, it is wrong.** State how
you tested that rather than asserting it.

This is the discipline CTX-PIN used when it validated its module tracer by first reproducing
a known answer at the old pin before trusting it anywhere new. Do the same.

## Scope

Read-only against the store. This script measures; it writes nothing to any parcel, cell or
snapshot.

It must run per county and against either target (staging or production), taking the store
from the same environment variables the existing jobs use. Say which store each reported
number came from — a census that does not name its store is the stale-instrument failure
this repo already documents.

## What you must NOT do

Do not modify the walk, `BP-CONTENT-01`, the permitted state set, or the cohort sampler.
This lane builds a second instrument; it does not change the first.

Do not deploy, submit a Cloud Build, or run any Cloud Run job, bake, publish or walk.

Do not write to `legacy-design-tools`, `hauska-engine` or `hauska-map`.

Two other lanes are live in this repo on separate worktrees (CTX-B2 on the cadRoll
expectation and pin; CTX-TEARDOWN read-only). If your work touches the same files, STOP and
report the collision rather than resolving it.

## Traps carried forward, all paid for in the last two days

`place_layer_snapshots.place_key` is `node:<fips>:<prop_id>`. `parcel_record_cell.place_key`
is `<fips>:<prop_id>`. Two tables, two shapes; the integration seat assumed wrong and got six
rows of `n=1` that looked like an answer.

Unscoped scans on these tables time out. Scope and set `statement_timeout`.

`runs` has `started_at`, not `created_at`. Dry runs write no run row.

`parcel_gate_verdict` is a **cached** evaluation carrying `evaluated_at`; a read taken during
a write is meaningless.

## Close contract

Standard lane close JSON, plus:

- The census output for all six counties, per leaf, per state, with the store named.
- The disagreement between the walk's list and the bake's list, with the count.
- Every sentinel class it refuses, and how many rows each catches today.
- All three self-test runs, both directions.
- How you tested the instrument's own falsifier.
- `leave_behind`.

Report the merge commit. This instrument is what the integration seat runs before and after
every county publish from here on.
