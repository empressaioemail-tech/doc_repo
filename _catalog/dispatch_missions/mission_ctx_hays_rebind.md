# CTX-HAYS-REBIND — bind Hays geometry to the parcel it belongs to

repo: legacy-design-tools

Operator ruling 2026-09-10: fix Hays without discarding the ~92,000 correct records. This is a
rebind, not a withdrawal. Every parcel keeps its money and gets its own geometry.

## What CTX-HAYS-KEY established, and you should re-derive rather than trust

The Hays key was never unstable. Two different published identifiers occupy one column.

TxGIO publishes Hays parcels under the county's **QuickRefID** with the leading `R` stripped.
`cad_property` is keyed on the county's **PropertyID**. The 2026-08-25 P-78 StratMap merge
upserted TxGIO-keyed rows on `(county_fips, prop_id, tax_year)` with `situsAddress`,
`situsCity`, `situsZip` and `ownerName` in `COALESCE_FIELDS`, so wherever the two bare-numeric
namespaces collided the incoming row's address and owner overwrote the real account's.
`assessed_value` survived only because the StratMap adapter hardcodes it null.

Worked example: Hays CAD account **40138** carries QuickRefID **R26199**, and `txgio_parcel`
prop_id 26199 is that parcel. That is why `48209:40138` resolves as a San Marcos address and
draws a Buda polygon.

Discriminating evidence: all **116,421 of 116,421** Hays 2025 rows carry TxGIO's situs
byte-identically, where Caldwell's known-good join agrees on **15 of 24,722**. A hundred percent
is a copy, not an agreement. Renumbering was ruled out (rows P-78 never touched agree 99.95%)
and resplit was ruled out (99.37% are still on the current roll). Williamson has the identical
two-namespace structure and zero contamination because its namespaces are lexically disjoint.

## What is already in the store, verified by the integration seat

    txgio_parcel  48209   131,734 rows   geo_id populated on 130,246   115,533 distinct
    txgio_parcel  48209   sample: prop_id 26199 -> geo_id 11-2520-0000-03100-2
    cad_property          columns are prop_id and property_use_code ONLY

So the join target exists and is populated. The appraisal-side key does not exist in the store
because the Orion parser reads PropertyID and drops PropertyNumber and QuickRefID, which the
source publishes in adjacent columns.

CTX-HAYS-KEY reports that keying PropertyNumber to `geo_id` gives 94.35% situs agreement and is
collision-free, and that PropertyNumber and the QuickRefID stem select the same parcel on
115,035 rows and a different one on zero. Today's key is right 0.07% of the time. **Re-derive
those numbers.** They decide the build.

## The trap that would look like success

Re-declaring Hays to tax year 2025 scores **0.012%** owner agreement against 2026, which blocks,
and **over 99%** against the contaminated 2025, which would write `pass` and lift the gate now
holding Hays shut. Do not take that path, and if you find yourself reaching for a vintage change
to make a number go green, stop.

## What to build

Enough to rebind Hays geometry to the correct parcel:

- a column on `cad_property` for the property number, with a migration;
- the parser change that stops discarding it;
- the join change so Hays binds geometry on that key rather than prop_id to prop_id.

Say whether the source file is still available to re-parse or whether re-acquisition is needed.
CTX-HAYS established that `hayscad.com` returns 200 to a plain request carrying a browser
User-Agent and 403 with none; that is a bot block, not the credential trap the standing
decisions warn about.

**Scope the change to Hays or make it general, and justify which.** Williamson has the same
two-namespace structure with no contamination, so a general change alters a county that is
currently correct. That is a real risk and it is your call to argue, not to assume.

## Two things you inherit

**CTX-B5 exists and was never merged.** Registered worktree, a substantive CP1, roughly 1,083
uncommitted insertions, on a base two merges stale. Its subject is the retirement basis:
`buildRecordRetirement` fires on absence from the declared vintage with no check for any other
vintage, and emits a basis asserting the account was "split, merged, renumbered or removed" for
roughly 37,813 Hays prop_ids that were never on a roll. Read that work before rewriting it. Take
what is right, rebase what survives, and say plainly what you discarded and why.

**Caldwell `48055:1` is not a genuine retirement.** CTX-HAYS-KEY found it is roughly 120
unattributed StratMap polygons on a placeholder key, and that four prior artifacts cite it as a
control for the *meaning* of retirement when it only ever validated the *branch*. Do not inherit
that citation. If you need a meaning-level control, find a real one and name it.

## Verify by violating

Account 40138 must bind the polygon of QuickRefID R26199's parcel, and must fail to before your
change. Name the real prop_ids you use. A county that is currently correct, Williamson, must be
provably unchanged if your change reaches it.

## Scope

`legacy-design-tools` only. No writes to hauska-factory, hauska-engine or hauska-map. No deploys,
no Cloud Build, no Cloud Run job, no bake, publish or walk. The integration seat owns every
execution. Five other counties are moving to production while you work and nothing you do may
touch their path.

Register your worktree before working. Declare seat, branch and commit.

## Close contract

Standard lane close JSON, plus: the re-derived crosswalk numbers and whether they match
CTX-HAYS-KEY's; whether the source is re-parseable or needs re-acquisition; the Hays-only versus
general decision with its argument; what you took from CTX-B5 and what you discarded; violation
runs with real prop_ids including the Williamson no-change proof; and `leave_behind`. Push and
open a PR. Do not merge. Report the PR number and head SHA.
