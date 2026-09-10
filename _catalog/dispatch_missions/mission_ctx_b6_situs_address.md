# CTX-B6 — situsAddress is the leaf nobody graded, and it is defective on 170,840 rows

repo: legacy-design-tools

## Measured, staging store, 2026-09-10, full scan not a sample

`place_layer_snapshots`, `adapter_key='node-facets:tier1'`, classified on
`payload_json->'baseFacts'->'situsAddress'`:

    county        bare null   earned-absence obj   pure punctuation   leading comma, no street   looks real
    48453 Travis      1,545                    0                  0                    124,455*     352,263
    48055 Caldwell   15,289                   66                 63                          0       33,231
    48209 Hays        2,973                  810                768                          0      168,499
    48021 Bastrop     2,979               16,104                  0                          9       58,707
    48309 McLennan        0                1,165                  0                        696      112,394
    48491 Williamson      19                    0                  0                          0      602,031

    * Travis additionally has 22,044 rows with no street tokens at all.

Roughly **170,840 defective rows across the six counties**, on one leaf.

## What the walk did with that

Three of those counties **passed** their staging walk on 2026-09-10 while carrying it:

    Caldwell   walk pass, 86 parcels sampled,  15,352 defective rows in the county
    Bastrop    walk pass, 248 parcels sampled,  2,988 defective rows
    McLennan   walk pass, 182 parcels sampled,    696 defective rows

Three failed on it:

    Travis     83 of 260 sampled failed, all S1 "sentinel presented as a value under non-null coverage"
    Hays        1 of  96 failed, BP-CONTENT-01 "baseFacts.situsAddress is null"
    Williamson  1 of 330 failed, but on an unrelated cause (48491:PRIVATE ROAD, HTTP 400)

A worked example, live on staging: `48453:224793` serves
`situsAddress: ", TX 78756"` while `situsCity` is a well-formed `absent-verified` object and
`situsZip` is `"78756"`. `facetCoverage.baseFacts` is `true`. So a string with no street was
assembled out of the components that survived and presented as an address.

## Why the existing guard does not catch it

`serveGuards.ts` `PUNCTUATION_ONLY_RE` is `/^[\s,.\-;:'"`]+$/`. `", TX 78756"` contains
alphanumerics, so it passes. CTX-SENTINEL already called `48055:1` "a THIRD, still poorer
shape" than the two in the 2026-09-03 refusal-contract split. This is a fourth.

## The question, not a conclusion

**Decide how `situsAddress` expresses "no street on record", and make every producer of that
leaf agree.**

Name at least two mechanisms and say why you rejected the one you did not take. Consider at
minimum, and treat neither as a recommendation:

- an earned absence object on the leaf, the way `situsCity` already does it on the very same
  parcel, which would make the two siblings consistent;
- refusing to assemble an address string at all when the street component is missing, which
  addresses the cause rather than the symptom.

Constraints on the answer:

- A bare `null` is not one of the four states and is what Hays fails on. It cannot be the answer.
- CTX-SITUS-SKIP (#648) already ruled that an on-roll punctuation-only situs must be written as
  an earned absence rather than skipped. Whatever you choose must not reverse that.
- Ruling A1 rejected converting usable data into an absence. A ZIP that is really on record is
  usable. Do not throw away components that exist in order to make the leaf uniform.
- CTX-B1 (#650) exempted the serve guard for an earned retirement. Caldwell `48055:1` must keep
  returning 200 and grading RECORD_RETIRED. It is your regression control.

## The second question, and it is not optional

`baseFacts.situsAddress` is **not** in `BAKE_OWNED_REQUIRED_LEAF_PATHS` (five leaves:
situsCity, situsZip, landUse, landUseSource, acreage). It **is** in the walk's own content
list, which is how Travis and Hays failed. So the leaf is required by the grader and owned by
nobody at bake time.

State plainly whether it should join the bake-owned set, and what that implies for the other
leaves the grader requires but the bake does not own. If you find more leaves in that gap,
name them with counts. That gap is the mechanism behind this whole defect class and it is
worth more than this one fix.

## Verify by violating

A row with no street on record must fail before your change and pass after, and a row with a
real street must be untouched. Use the real prop_ids above, including `48453:224793`, and name
the ones you used. Show the failing run.

## Scope

`legacy-design-tools` only. Do not write to hauska-factory, hauska-engine or hauska-map. Do not
deploy, do not run a Cloud Build, Cloud Run job, bake, publish or walk. The integration seat
owns every execution.

Register your worktree before working. Declare seat, branch and commit.

## Close contract

Standard lane close JSON, plus: the mechanisms considered and the one rejected; the exact shape
the leaf carries for each population; the answer to the second question with counts for any
further ungraded-but-required leaves; both violation runs with real prop_ids; proof that
`48055:1` still grades RECORD_RETIRED; and `leave_behind`. Push and open a PR. Do not merge.
Report the PR number and head SHA.
