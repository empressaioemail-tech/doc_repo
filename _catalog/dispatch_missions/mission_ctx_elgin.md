# CTX-ELGIN — three measurements of "the same" residue disagree, and the ceiling was written from the wrong one

Repo: `hauska-engine`, and only hauska-engine. The staged table
`tx_zoning_district_staging` is written ONLY from this repo
(`packages/engine-core/src/zoning-staging/`, `scripts/stage-tx-zoning-district.mjs`,
migration 0074). A prior dispatch pointed at `stampCountyZoning()` in
legacy-design-tools, which writes `txgio_parcel` in a different database from its own
registry, and that lane correctly STOPPED rather than ship a no-op diff. Do not repeat
that error.

## Why this blocks two launch counties

Bastrop and Travis both refuse the publish gate on the `zoningDistrict` rail. The sweep
that would resolve them, `factory-parcel-r5-zoning`, refused
`LAYER_GAP_RESIDUE_EXCEEDED` because the measured Elgin residue exceeds a declared
ceiling of 9 (48021) / 457 (48453).

The retiring planner's own written judgement, which is the actual root:

> The DECLARED_LAYER_GAP ceiling of 9/457 was written from CTX-ELGIN's numbers WITHOUT
> checking they described the same population the rail measures. That is the actual root
> of the Bastrop/Travis block. The ceiling is not wrong to refuse; the ceiling was wrong
> to be written.

The guard is behaving correctly. It is refusing a borrowed number. Do not adjust the
guard, and do not pick whichever number lets it pass.

## The three measurements, and they are probably three different quantities

    CTX-ELGIN   live probe, centroid-in-polygon against the live ArcGIS service   9 / 457
    CTX-STAGE2  join against the STAGED table, per-parcel EXISTS aggregation     48 / 525
    the rail    counts UNACCOUNTED CELLS, excluding parcels already carrying an
                earned state from a prior sweep                                  (its own)

Nobody has reconciled the three definitions. The retiring planner marked this
PROBABLY FALSE against the assumption they measure the same thing, and that assessment is
the most useful thing it left behind.

What CTX-STAGE2 already established, from `_inbox/2026-09-09_ctx-stage2_close.json`,
which you should read in full before starting:

- All 48 Bastrop residue parcels were re-tested with `ST_Covers` instead of
  `ST_Contains`. All 48 stayed unmatched. **Not a shared-edge artifact.**
- Of the 48, twenty are within 50m of an Elgin polygon and twenty-eight are beyond it.
  That split is the shape of a materially incomplete published layer, not a precision
  problem.
- This repo's `elgin-tx` registry entry (Bastrop side, FeatureServer/0) carries
  `verifiedAt = 2026-08-12` and has not been refreshed since. The Travis-side entry
  `elgin-tx-travis` (FeatureServer/1, 499 rows) was staged 2026-09-09 and is current.
- One concrete registry difference was found and it does NOT explain the gap: the engine
  registry's `elgin-tx` has no `layerWhere` filter where the LDT registry has
  `CITY_LIMIT = 'ELGIN'`. No filter means MORE polygons staged, so MORE coverage and
  FEWER unmatched. That is the opposite of the observed direction. Rejected, recorded.

## The decidable test, which is small

The staged Bastrop-side layer is roughly a month old and the probe read the live
service. So run the test that separates drift from real absence:

**Re-stage Elgin layer 0 from the live service, then re-measure with CTX-STAGE2's exact
counting rule.**

- If Bastrop residue falls toward 9, the disagreement was staging drift. The finding is
  that staged layers have no freshness rule, and that is worth more than the 39 parcels.
- If it stays near 48, the published layer genuinely does not cover them and 48 is the
  honest ceiling.

Either outcome unblocks Bastrop and Travis. Neither requires anyone to pick a number.

Use CTX-STAGE2's counting rule verbatim, including the per-parcel `EXISTS` aggregation.
Its first attempt flat-joined and produced `denom_with_geom` (4,044) EXCEEDING
`denom_incity` (3,749), an impossible number caught only because two figures that should
agree did not. `txgio_parcel` carries multiple geometry rows per `prop_id` (48021:
74,729 rows against 62,257 distinct prop_id). A flat join counts fragments as parcels.

## Then reconcile the definitions, which is the durable half

Write down, explicitly, what each of the three instruments counts: its population, its
predicate, and what it excludes. Then state which one the ceiling must be derived from.

The integration seat's position, which you should test rather than assume: **the ceiling
is derived from the staged table by the rail's own query, and the live probe's job is to
audit whether staging is current.** Two instruments, two jobs. If you find that wrong,
say so with evidence.

Do NOT write the ceiling into hauska-factory. That file
(`src/config/zoning-layer-completeness.mjs`) lives in another repo and another worktree.
Report the number and the derivation; the integration seat routes the write.

## Traps recorded from the lane that ran before you

- A long-running query at near-zero CPU is STUCK, not working. CTX-STAGE2 lost over an
  hour to a residue query with no `city_key` restriction and no bbox pre-filter. Restrict
  by `city_key`, pre-filter on the numeric bbox columns both tables carry, and set
  `connect_timeout` and `statement_timeout`. Announce any heavy scan before you start it,
  per AGENT-CONTRACT section 4; the prior lane announced one only after the fact and
  recorded that as a process gap.
- The Factory store times out on six-county aggregate queries while a bake is running.
  Query one county at a time.

## Verify by violating

Before you trust your residue instrument, run it against a city this mission never
touches and confirm it can return a non-zero residue. CTX-STAGE2 used Pflugerville and
got 41 on a 3,000-parcel sample, labelled as a sample. An instrument observed only
returning the answer you wanted has not been observed working.

## What you must NOT do

Do not adjust `LAYER_GAP_RESIDUE_EXCEEDED` or any ceiling to make a gate pass.

Do not write `not-applicable` on any parcel to clear a count. `not-applicable` claims the
land is unzoned. A parcel probed and found uncovered earns `refused`, which is weaker and
honest. Watch for an unaccounted count falling without a matching acquisition landing;
that is relabelling.

Do not run any bake, publish, walk, Cloud Run job or Cloud Build, and do not deploy. The
integration seat owns every execution on this program.

Do not write to hauska-factory, legacy-design-tools, or hauska-map. Do not touch
`txgio_parcel` as a write; reading it for the spatial join is expected and is what
CTX-STAGE2 did.

## Close contract

Standard lane close JSON at the auto-named path, plus:

- Residue per county before and after the re-stage, with the full counting rule.
- The drift-versus-real-absence verdict, stated plainly.
- The three definitions written out side by side, and which one the ceiling derives from.
- Your non-zero falsifier result on an untouched city.
- The true ceiling as a number, with its derivation, NOT written into any config.
- `leave_behind`.
