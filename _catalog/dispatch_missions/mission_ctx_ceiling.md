# CTX-CEILING — one number, measured with the right instrument, unblocks both counties

Repo: `hauska-factory`. Branch from `origin/main` after `5800d4a8` (CTX-STAMPFALL,
PR #123, merged). Small, single-purpose lane.

## Where the program stands

Every other precondition is done:

    CTX-SP          merged (hauska-engine PR #415). Elgin's S-P district is mapped and
                    staged; all ten previously-unmatched Bastrop parcels now match,
                    including 14457, 12830 and 60891.
    CTX-PARCELGATE  merged (f0fe15bb, PR #122). The write is per-parcel eligible;
                    Travis's ceiling is written at 506, decomposed 456 + 50.
    CTX-STAMPFALL   merged (5800d4a8, PR #123). A residual parcel carrying a real
                    txgio_parcel.zoning_district now earns a value cell from a distinct
                    STAMP_SOURCE, so the 17 Bastrop / 50 Travis population can leave
                    `unaccounted`.

One thing remains. **Bastrop's declared ceiling is still 9 and its live raw residue is
26.** `assertResidueWithinDeclaration` refuses, and because CTX-ZONESCOPE correctly made
Elgin one grouped city across both counties, that refusal fails the whole job — so it
blocks Travis too, even though Travis is otherwise structurally complete.

CTX-PARCELGATE deliberately held Bastrop's ceiling rather than write it before S-P landed,
recording both candidates in `bastropCeilingPending`. S-P has now landed. This lane writes
it.

## Measure with the rail's own instrument, and only that one

**This is the crux and a prior lane was sent at the wrong instrument by a defective
dispatch.** CTX-SP was told to use CTX-STAGE2's counting rule verbatim, which uses
`ST_Contains(polygon, ST_PointOnSurface(parcel))` — point-in-polygon. It reported 48
before and 48 after, an unexplained non-movement it flagged honestly as a free finding.

The rail does not use that predicate. It uses best-overlap `ST_Covers` / `ST_Intersects`
with a 1e-8 floor and a bbox-centre fallback, ranked, against the union of the city's
staged base layers. Those are different questions and their answers were never comparable.

So: derive the ceiling from `runParcelR5Zoning`'s own dry run, calling it directly rather
than through `cli.mjs`, whose code-only catch handler swallows the detail. Do not import a
number from any prior close, including CTX-STAMPFALL's 26. **Re-measure it yourself and
report agreement or disagreement.**

If your number is not 26, that is the finding and you stop rather than write it.

## What to write

Bastrop's ceiling, as the validated raw residue **with its decomposition recorded
alongside it**, matching the shape CTX-PARCELGATE used for Travis. Each class carries its
own count and its own counting rule. A bare number regresses this to what it was and is
the reason the ceiling was wrong in the first place.

The expected decomposition, which you verify rather than assume:

    9   genuinely uncovered   (CTX-ELGIN's original set, re-verified twice since)
    17  staleness             (carry a real txgio_parcel.zoning_district;
                               now resolvable to `value` via CTX-STAMPFALL's STAMP_SOURCE)
    0   S-P                   (was 10; CTX-SP staged the district, they now match)
    --
    26

If S-P parcels still appear in your residue, CTX-SP's staging did not take effect on the
rail's predicate and that outranks writing anything.

## Why a larger ceiling is safe now, and you must prove it

A ceiling of 26 no longer means "26 parcels are uncovered." It means "26 parcels fall
outside the staged layer, of which 9 are genuinely uncovered." That is a weaker claim and
it is only safe because CTX-PARCELGATE's per-parcel gate separates counting from writing.

Prove that separation still holds at the larger ceiling, in one run, with real parcel ids:

- a staleness-class parcel receives no `refused` write and does receive a `value` cell
  sourced from `STAMP_SOURCE`;
- a genuinely-uncovered parcel receives `refused`;
- the guard still refuses when raw residue exceeds the ceiling.

CTX-PARCELGATE did exactly this for Travis with `500816` and `227351`. Do the Bastrop
equivalent.

## The direct question

State as a plain yes or no, for each county separately: **does `parcel-r5-zoning` run to
completion, and does `unaccountedCount` reach zero?**

CTX-PARCELGATE answered this honestly enough to surface a precondition nobody had, and
CTX-STAMPFALL did the same. If a fifth thing is missing, say so. That outranks a clean
close.

## What you must NOT do

Do not touch `assertResidueWithinDeclaration`. The guard is correct and has caught two
borrowed numbers.

Do not change Travis's ceiling. It is written at 506 and verified.

Do not write `not-applicable` on any parcel, and do not add an exception mechanism of any
kind.

Do not pass `--apply`. Dry runs only. Do not deploy, submit a Cloud Build, or run any
bake, publish or walk. The integration seat runs the counties.

Do not write to `hauska-engine` or `legacy-design-tools`.

## The open discrepancy, recorded so you do not inherit it as a task

CTX-SP's 48-before / 48-after under the point-in-polygon rule is unexplained, and it
proved its own marginal effect was exactly +10 matches, which should have moved that
number. The leading explanation is that the two instruments count different populations
and the marginal proof was against its own matched set. **It is not yours to resolve.** It
does not block, because the guard reads the rail's number and that one moved as predicted.
Note it in your close if your own measurement sheds light on it; do not chase it.

## Close contract

Standard lane close JSON, plus:

- Your own dry-run residue for Bastrop, with the rail's counting rule stated, and whether
  it agrees with 26.
- The decomposition as written into the declaration, class by class.
- All three violation runs with real Bastrop parcel ids.
- Both direct answers, yes or no.
- `leave_behind`.

Report the merge commit. The integration seat rebuilds and runs both counties from it.
