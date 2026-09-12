# CTX-HAYS-KEY — Hays serves one parcel's money under another parcel's address, and has since August

repo: legacy-design-tools

Operator ruling 2026-09-10: Hays 48209 is **out of the current CTX wave**. The other five
counties go to production without it. This lane owns Hays and is not on anyone's critical path.
Take the time to be right.

## What is measured, and verified twice by different instruments

Cross-vintage `prop_id` ZIP stability in `cad_property`, rows present at both 2025 and 2026:

    48453 Travis      333,937 paired    99.71% agree
    48055 Caldwell     24,549 paired    99.21% agree
    48209 Hays        126,808 paired    53.86% agree

CTX-B7 derived 99.73 / 99.21 / 53.86 from its own instrument; the integration seat reproduced
53.86 / 99.71 / 99.21 independently. The two agree.

**On the production store, right now:** of Hays tier-1 rows carrying a served `situsZip`,

    98,381  the served ZIP agrees with the declared 2026 roll row for that prop_id
    39,061  no 2026 roll row at all (1,874 of them still serve money)
    29,404  the served ZIP CONTRADICTS the declared roll row, and ALL 29,404 serve money

The same query against staging returns 29,472. This is not a staging artifact and it did not
arrive tonight: production has served it since the August bake.

CTX-B7 measured the same population from the other side and found those parcels serve another
parcel's `cadRoll` dollars, `yearBuilt`, legal description and exemption codes. Travis at 429
and Caldwell at 92 are the normal churn baseline of 0.28 to 0.80 percent. Hays at 45.4 percent
is roughly 160 times that.

A worked example found before any of this was measured: `48209:40138` resolves from the address
index as 100 Riverside Dr, San Marcos, and draws as 340 Windmill Way, Buda, carrying acreage
identical to four decimals with `48209:26199`. That payload holds owner and land use back with
"TxGIO prop_id does not join the CAD account" while serving the four money rails joined on that
same id.

## What the code already knows

`48209` is **already** in `LANDUSE_JOIN_DISABLED_FIPS_SEED`, for this same key failing between
CAD and TxGIO. That guard was never applied to CAD-to-CAD across vintages, which is the join
that produces the numbers above.

Hays' declared vintage is `{ taxYear: 2026, tier: "cad-export" }`. Its 2025 population is two
sources, `stratmap25-landparcels_48209_lp.zip` (116,421) and `hays-export2.zip` (55,695). Its
2026 roll is 134,606 rows against a 2025 total of 172,116, and CTX-HAYS already established
that the 172,116 comparator "was never a clean number to begin with".

## The question

**What acquisition makes a Hays parcel node's geometry, address and money describe the same
physical parcel?**

Name the candidate mechanisms and reject the ones you reject with evidence. At minimum, and
none of these is a recommendation:

- re-declare 48209's vintage, if some other vintage is internally coherent;
- re-acquire Hays with an explicit crosswalk between vintages, which is what
  `cad_property_vintage_crosswalk` exists for, noting CTX-RETIRE found it holds zero rows for
  Caldwell's dropouts and you should check what it holds for Hays before assuming;
- extend CTX-B7's same-parcel ZIP gate to the dollar path, which is the cheapest change and the
  one that touches live money;
- key Hays on something other than `prop_id`, if the source offers a stable identifier;
- serve nothing for the contaminated population until the key is fixed.

Establish **why** the key is unstable before choosing. A renumbering between roll years, two
different source conventions merged into one column, and a genuine parcel resplit all produce
a 46 percent disagreement and they do not have the same fix. Say which one it is, with
evidence, and say what would have told you it was one of the others.

## The second thing this lane owns

CTX-B2 established from source that `buildRecordRetirement` fires on absence from the declared
vintage with no check for any other vintage, and emits a basis asserting the account was
"split, merged, renumbered or removed". For roughly 37,813 Hays prop_ids that carry no CAD
appraisal signal at any tax year, that is a causal claim nothing verified. It passes every
existing check.

That was scoped as its own card, CTX-B5, and never ran. It is Hays-shaped, so it is yours.
Decide whether a record that was never on a roll can be distinguished at bake time from one
that left it, and note that Caldwell `48055:1` is a genuine retirement and must keep working
as your control.

## The disposition you do NOT make

**Whether to pull Hays back from production while this is fixed is the operator's call, not
yours.** Give him what he needs to make it: how many customer-visible parcels are wrong, what
a customer sees on one today, whether the wrongness is detectable from the payload itself, and
what pulling it back would cost in coverage.

Report it. Do not act on it.

## Scope

`legacy-design-tools` only. No writes to hauska-factory, hauska-engine or hauska-map. No
deploys, no Cloud Build, no Cloud Run job, no bake, publish or walk. The integration seat owns
every execution, and the other five counties are moving through production while you work.
Nothing you do may change their path.

If you conclude a change belongs in hauska-factory, say so precisely enough to dispatch and do
not make it.

Register your worktree before working. Declare seat, branch and commit.

## Close contract

Standard lane close JSON, plus: the instability mechanism with its evidence and the mechanisms
you rejected; per-population counts for every disposition you propose; the retirement-basis
decision and its control run; the operator packet described above; violation runs for anything
you implement; and `leave_behind`. If the right answer is that Hays needs an acquisition this
repo cannot perform, that is a successful close. Push and open a PR only if you wrote code.
Report the PR number and head SHA, or state plainly that there is none and why.
