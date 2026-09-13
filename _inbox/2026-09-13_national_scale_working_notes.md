---
id: 2026-09-13_national_scale_working_notes
title: National scale — working notes, NOT canon
date: 2026-09-13
status: draft
kind: working-notes
owner: nick
related: [90_runbooks/factory_1_5_acquisition_staging, 90_operations/OPS-21_serve_completion_program, 90_operations/OPS-22_spine_architecture_map, 29_scale_warm_architecture, 14_pricing_framework, _research/2026-09-12_cotality_reengagement_division_cogs_and_probe]
---

# National scale — working notes

> **NOT CANON. NOT DOCTRINE. NO PLAN ROW. NOTHING DISPATCHES FROM THIS.**
> A thinking artifact from the 2026-09-12/13 conversation, written so the ideas
> survive the session. Every number is sourced or flagged as unverified. The
> operator has explicitly deferred ruling on any of it.

## 1. The diagnosis

Central Texas took weeks. Sorting the known defects by where they actually lived:

```
  SOURCE VARIANCE                      OUR PIPELINE
  (a probe can find these)             (no probe can find these)
  ------------------------             ---------------------------
  Hays  CAD PropertyID                 computeTier1Envelope: two branches,
        vs GIS QuickRefID              both return "declined". Setbacks had
        -> chimera                     NO path to a value for weeks.

  Williamson dollars on a              Geometry scorer: account numerator
        second numeric scheme          over a feature denominator.
        -> prefix strip mis-joins
                                       Six read paths, five setback
  8 counties: prop_id is not           producers, one parcel.
        an account, need geo_id
                                       Gate grades 17 of 65 rails.
  Elgin parcels on a different
        FeatureServer entirely         mergeBakedBaseFacts drops tier2 flood.

  Travis/Caldwell situs is a           zoningProvenance fallback breaks at the
        bare street line               SECOND zoned layer in a county.

       ~5 defects                            ~6 defects
       recon catches these                   only a bake catches these
                                             AND THESE ATE THE CALENDAR
```

**Most of Central Texas was not Central Texas.** It was building the factory while
running it, and charging construction to the first counties through.

The `14_pricing_framework.md` figure (60-100 person-hours across the first 30 cities,
2-3 hrs each) is therefore a BUILD number, not a marginal-cost number. **Nobody has
ever measured the marginal cost of a county through a finished pipeline, because
there has never been a finished pipeline.** That is the single most load-bearing
unknown on this page.

## 2. The economics nobody is using

From `29_scale_warm_architecture.md`: Bastrop depth cost was **~$0.24-$5 per county**.

```
  re-bake all of Texas (254)      $60 - $1,270
  re-bake the country (~3,144)    $750 - $15,700
```

**Bakes are not precious. They cost about a dollar.**

The current process implicitly treats a bake as something that must be right the
first time, which is what forces the careful serial grind. It does not. It has to be

    (a) DETECTABLY wrong, and
    (b) CHEAP to redo

Those are much easier engineering problems than "correct on the first pass."

> **WEAKNESS, flagged rather than hidden:** that $0.24-$5 is described in the source
> as "Bastrop **depth** cost," which may not be a full county bake including
> acquisition, normalisation and cell fill. If the true figure is 50x higher the
> re-bake economy still holds; if it is 5,000x higher it does not. **This number is
> load-bearing for the whole page and has not been re-measured.**

## 3. Can we bake in parallel and merge later?

Yes, and more cleanly than expected, because the data is already partitioned and the
coupling lives in the code.

```
  place_key = "{county_fips}:{prop_id}"
                    |
                    +-- county-prefixed, so two counties CANNOT collide.
                        There is no shared key space to reconcile.

  THE REAL RISK IS NOT A MERGE CONFLICT. IT IS THIS:

     county 006  baked under pipeline v1  (vacuous envelope)  \
                                                               >  look IDENTICAL
     county 200  baked under pipeline v7  (envelope fixed)    /   in the store

     ...and nothing records which. One of them is silently wrong.
```

The fix already exists in the ledger design: a cell is state + atom reference +
provenance + a cached rendering **keyed to atom version and vocabulary version**.

If that keying is real, merge is safe and remediation is a query. **Whether it is
real or aspirational is unverified and should be checked before anything is bet on
it.**

## 4. The four pieces

```
  1. VERSION EVERY ROW
     pipeline version + vocabulary version on every cell.
     One field that is simultaneously the merge-safety mechanism,
     the remediation mechanism, and the audit mechanism.
     "which counties carry the vacuous-envelope bug?" becomes a query.

  2. STAGE -> GATE -> PROMOTE
     never bake straight to production.
     a county that fails its invariants sits in staging
     costing nothing and blocking nothing.

  3. FAIL CLOSED ON NOVELTY, NOT ONLY ON ERROR
     registry of every seen combination:
        { CAD vendor, GIS platform, projection, id scheme, zoning shape }
     a NEW combination REFUSES to bake and queues for class adjudication.

     ** this is the control that would have caught Hays. **
     the chimera did not error. it produced a confident wrong answer
     that passed every check. most pipelines fail on errors;
     this one must also fail on the unfamiliar.

  4. ADVERSARIAL-FIRST ORDERING
     bake the five WEIRDEST counties from the recon, not the five easiest.
     if the pipeline survives the strangest input in the state,
     the remaining 249 are downhill.
     starting easy = discovering the hard case at county 180
     with 179 bakes to redo.
```

## 5. Two capabilities we did not have during Central Texas

**A county-grain staging ledger** (operator's idea, 2026-09-13). Recon output lands in
the production rail vocabulary, so a recon gap and a production gap are the same word
and can be diffed.

Grain matters and is the one correction to the original framing:

```
  PRODUCTION ledger asks:  "do we HOLD this fact for this PARCEL?"
                           981,405 parcels x 65 rails = 63.8M cells (6 counties)
                           statewide equivalent ~ 700M cells for data we do not have

  STAGING ledger asks:     "can we ACQUIRE this rail for this JURISDICTION,
                            and what blocks it?"
                           254 counties x 65 rails = ~16,500 rows.  Trivial.
```

Same vocabulary, different subject. The County Manifest and `railCapabilities` are
the existing half-built version of this and probably want repair rather than a
parallel build.

**A national QA oracle.** Cotality gives an independently derived value for owner,
assessed value and acreage nationally. Disagreement beyond a threshold is a defect
signal, free, everywhere, with no human review.

This matters more than the data: it is a genuine **meaning-shaped check** (two
independently derived sources that must agree), which is what the enforcement
doctrine demands and what almost nothing in the current grid actually is.

## 6. Sequencing

```
   NOW ─────────────────────────────────────────────────────────────►

   [ statewide RECON ]  read-only, zero blast radius, fully parallel
        |               runs CONCURRENTLY with the repair below
        |               gated on reproducing the KNOWN six-county answer first
        v
   [ county-grain staging ledger ] + [ novelty registry ] + [ defect classes ]
        |
        |               meanwhile, on a separate track:
        |               [ OPS-21 / OPS-23 pipeline repair ] ── must land first
        v
   [ bake the 5 WEIRDEST counties ]  <- chosen FROM the recon, not in advance
        |
        v
   [ fan ]  into a pipeline that already survived the worst input in the state
```

**The affordability argument, stated plainly:** you cannot afford to repeat Central
Texas, and the way you repeat Central Texas is by fanning a pipeline that is still
under repair. Fanning now multiplies the one-time cost by 254 instead of paying it
once.

Recon does not have to wait for any of that, which is why it goes first.

## 7. The control that makes the recon trustworthy

Every claim caches its raw HTTP response. No conclusion without the bytes.

And there is a free test fixture: **the six CTX counties already have a known
answer.** 69 cities, 23 with a zoning endpoint, split Bastrop 3/3, Caldwell 3/3,
Hays 5/11, Williamson 7/14, Travis 3/18, McLennan 2/20 (`OPS-22` section 2).

Run the prober against those six FIRST. If it does not reproduce those numbers, the
prober is wrong and nothing it says about the other 248 counties can be trusted. A
not-vacuous test for the instrument itself, at zero cost.

## 8. What is unverified on this page

- The $0.24-$5 re-bake figure is "depth cost" and may not be a full bake. **Load-bearing.**
- Whether cells are genuinely keyed to pipeline/vocabulary version, or whether that is design intent.
- The marginal cost of a county through a FINISHED pipeline. Never measured; there has never been a finished pipeline.
- Whether novelty gating refuses a workable share of counties or nearly all of them. Unknown until the recon exists.
- ~3,144 US counties and ~19,000 municipalities are general knowledge, not repo-measured.
- Whether recon genuinely catches all five source-variance classes, or only the ones we already know to look for. **The Hays chimera was only findable because it had already bitten us.**

## 9. Open questions for the operator

1. Cities: all ~1,200 Texas incorporated places, or only those in target counties?
2. Does the staging ledger live in doc_repo as a study, or in the factory store as a standing instrument? (Planner leans standing, because source endpoints rot.)
3. Is "finish the repair before fanning" correct, or is that the planner being conservative with someone else's calendar?
