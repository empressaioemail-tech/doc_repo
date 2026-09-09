# CTX-ZONESCOPE — a multi-layer city is tested against the wrong county's layer

Repo: `hauska-factory`. This is the last code blocker between Bastrop and Travis and a
bake.

## The defect, already found and reproduced

CTX-REFUSAL closed 2026-09-09. Read `_inbox/2026-09-09_ctx-refusal_close.json` in full
first, especially `mechanismResolved` and `proposedFixes_notApplied`. It did the
diagnostic work; you are implementing, not re-deriving.

`loadInScopeCities` (`IN_SCOPE_CITIES_SQL`) returns one row per `(place_fips, city_key)`.
Elgin has two live, correctly-staged base layers under two different keys:

    elgin-tx          FeatureServer/0   Bastrop side   3,209 polygons
    elgin-tx-travis   FeatureServer/1   Travis side      499 polygons  (staged by CTX-STAGE2)

`processCity`'s population query (`CITY_ALL_PARCELS_SQL`) scopes by `place_fips` alone —
the whole city, both counties — and never intersects with the county that particular
`city_key` row's own layer actually covers. So every Travis Elgin parcel is tested against
a Bastrop-side layer that structurally cannot cover it, and vice versa.

Verified live by that lane, reproduced identically twice:

    matched against ONLY the Bastrop-side layer:  Bastrop residue 36 (real)   Travis 1,680 (spurious)
    matched against ONLY the Travis-side layer:   Travis residue 507 (real)   Bastrop 3,288 (spurious)

There is also an ORDER BY tie hazard: `assertResidueWithinDeclaration` throws on the first
county in insertion order, so only one of the two ever reports.

## Fix 1, and the recommended shape

Two options were named. **Take (b) unless you find a reason not to, and say so if you do.**

(a) Intersect each `city_key` row's parcel population with the specific `county_fips` its
own staged layer actually falls in.

(b) Collapse a multi-layer city to ONE `processCity` pass per `place_fips`, against the
UNION of all its layers' zone polygons. Recommended because `buildZoningCells` already
records `sourceUrl` per matched parcel from whichever zone row matched, so per-layer
provenance survives a union without separate passes. It also removes the ORDER BY tie
hazard, since there is then exactly one pass per city rather than two racing to throw.

Whichever you take, confirm per-layer provenance actually survives it by reading a matched
cell's recorded `sourceUrl`, not by assuming the mechanism the close describes.

## Fix 2, the ceiling, and the discipline it needs

`DECLARED_LAYER_GAP.Elgin.expectedResidue` is 9 Bastrop / 457 Travis. Those came from
CTX-ELGIN's live probe, which is a different predicate from the rail's own. The rail's
own corrected numbers are 36 and 507.

**Do not simply write 36 and 507 into the config.** That would repeat the exact error that
created this situation: a number derived by one instrument written as a ceiling enforced
by another, which is the root the retired planner named in its own handover.

The required work, and it is the point of this lane:

1. Land Fix 1 first, then re-run the rail's dry run per county and capture its own
   numbers.
2. Individually control-validate the DELTA parcels — 27 in Bastrop (36 minus 9), 50 in
   Travis (507 minus 457) — the same way CTX-ELGIN validated its original 9 and 457. That
   means probing each one against the live published layers and establishing that it is
   genuinely uncovered, not a victim of a second defect.
3. Only then propose the ceiling, with its derivation and the validation evidence.

If any delta parcel turns out to be covered by a layer we hold, the residue is wrong again
and the ceiling is not ready. Report that rather than rounding it away.

## The S-P class, which is part of this

CTX-ELGIN found 11 live Elgin polygons carrying `Zone_Code='S-P'`, a genuine Elgin
district this program's registry never mapped, 9 of which geometrically cover 10 residue
parcels. A parcel sitting inside a real district we failed to map is not an uncovered
parcel and must never be served as one, nor counted in a ceiling as though it were.

The registry itself lives in hauska-engine, so you do not fix the mapping here. But those
10 parcels must not be inside whatever ceiling you propose, and your close must say
whether they are or are not, with the count.

CTX-REFUSAL confirmed Elgin is the only current multi-layer city in the staged table but
did not complete a live audit of whether the unmapped-code class exists elsewhere. If a
cheap check exists, run it; if not, say it is unrun rather than implying it is clear.

## Hard prohibitions

**Do not raise or edit the ceiling to make a gate pass.** The guard refusing is correct
behaviour and has already caught one borrowed number. A ceiling change is a proposal with
a derivation, handed back, unless steps 1 to 3 above are complete and the evidence is in
your close.

**Do not write `not-applicable` on any parcel to clear a count.** `not-applicable` claims
the land is unzoned; a parcel probed and found uncovered earns `refused`. Watch for an
unaccounted count falling without an acquisition landing — that is relabelling, and the
tripwire is in `_decisions/2026-09-08_zoning_unaccounted_two_populations.md`.

Do not pass `--apply` to the rail. Dry runs only.

Do not deploy, submit a Cloud Build, or run any bake, publish or walk. The integration
seat rebuilds and runs the counties.

Do not write to hauska-engine, legacy-design-tools or hauska-map.

## Traps recorded from three lanes before you

A long-running query at near-zero CPU is STUCK, not working; over an hour was lost to a
residue query with no `city_key` restriction and no bbox pre-filter. Restrict by
`city_key`, pre-filter on the numeric bbox columns both tables carry, set
`connect_timeout` and `statement_timeout`, and announce heavy scans before starting them.

`txgio_parcel` carries multiple geometry rows per `prop_id` (48021: 74,729 rows against
62,257 distinct). Per-parcel `EXISTS` aggregation, never a flat join. A flat join already
produced an impossible number in this program once.

`cli.mjs` has a code-only catch handler that swallows error detail. CTX-REFUSAL had to call
`runParcelR5Zoning` directly to see the full error. Do the same rather than debugging
blind.

## Close contract

Standard lane close JSON, plus:

- Which fix shape you took and why, and the read of a matched cell's `sourceUrl` proving
  per-layer provenance survived.
- Per-county dry-run residue after the fix, with the counting rule.
- The delta-parcel control validation: how many probed, how many confirmed genuinely
  uncovered, how many were not.
- Whether the 10 S-P parcels are inside your proposed ceiling, with the count.
- The proposed ceiling with its full derivation, NOT written into config unless steps 1
  to 3 are complete.
- `leave_behind`.
