# CTX-LEAVES2 — a missed sibling, a ruling never implemented, and one row that should not exist

Repo: `legacy-design-tools`. Three defects, three different shapes. CTX-ACREAGE diagnosed
all of them with live evidence and named each fix location; you are implementing, not
re-deriving. Read `_inbox/2026-09-09_ctx-acreage_close.json` in full first, especially
`whereTheFixesLive`.

**Do not fix these as one change and do not report them as one number.** Two lanes on this
program have already had to be corrected for exactly that.

## Defect 1 — `baseFacts.acreage` is a bare null on 291,231 cells

The largest of the three by a wide margin: **291,231 of 1,516,110 baked cells** across the
six Central Texas counties, counted with a stated rule and two independent predicate
controls. McLennan alone is at zero, which is consistent with McLennan being the one county
that passed its walk today.

Root cause is a **missed sibling**. `nodeFacetTier1Assemble.ts:328-330` writes a bare null
when there is no parcel ring and no usable CAD `land_acres`. On 2026-09-08 CTX-LEAVES built
earned-absence machinery for four leaves — `situsCity`, `situsZip`, `landUse`,
`landUseSource` — and `baseFacts.acreage` was never added to
`BAKE_OWNED_REQUIRED_LEAF_PATHS` (currently lines 470-475).

Extend the **same** machinery to it. When the ring is absent and
`conformantAcreageFromClaim(claim.landAcres)` returns null, write an earned absence rather
than a bare null, and add `baseFacts.acreage` to `BAKE_OWNED_REQUIRED_LEAF_PATHS` so
`assertRequiredLeafStatesEarned` enforces it going forward.

CTX-ACREAGE suggests `absent-verified`, reasoning that both the ring and the claim source
were genuinely checked and found unusable, which is a real positive determination rather
than a shrug. **Test that reasoning rather than inheriting it.** `absent-verified` is a
claim that something looked; per `ENFORCEMENT.md` it requires a verified-absence pair, and
writing it where nothing looked is a lie that passes every check. If the pair is not
genuinely present, `refused` is the honest state and you say so.

Do not add other leaves to the enforced set opportunistically. If you find more missed
siblings, name them in the close; adding them silently changes what the gate refuses.

## Defect 2 — a ruling that was made and never implemented

`verdictLayerServe.ts`'s `zoningVerdictFromCityLimits` returns `verdict: 'unmeasured'` at
two branches: the `cityLimits.status === 'unmeasured'` terminal branch, and the
unincorporated-with-undeclared-doctrine branch. `unmeasured` is not one of the four states
the leaf contract permits, so every such parcel fails `BP-CONTENT-01`.

The underlying cause is a deliberate, documented collapse of every `parcel_record` refusal
into a three-state `CityLimitsFact` type with no refusal variant. For Williamson's gold the
root is literally that **no `parcel_record` row exists** — part of the known instantiation
gap, structurally present in five of six counties.

**`_decisions/2026-09-01_serve_path_never_emits_pipeline_state.md` already ruled that this
exact leak must convert to `refused` at serve.** It was never implemented at this call
site. That is a decision that exists, is correct, and does nothing — the defect class this
whole operation is built to catch — and closing it is the point of this item.

Implement it at that specific site: convert `verdict: 'unmeasured'` to `verdict: 'refused'`
where it is assembled onto the `LayerAbsenceWire`, carrying the authority, `scopeSearched`
and basis fields already computed. **Never `absent-verified`** — nothing verified an
absence here; a missing `parcel_record` row is an unmeasured state and `refused` is what
honestly names it.

Keep the internal Doc-19 `LayerAbsenceVerdict` vocabulary unchanged for other internal
consumers. The conversion belongs at the serve boundary the four-state contract reads, which
is what the decision itself instructs.

`provenance.zoningSource` mirrors `zoning`'s verdict verbatim and inherits this fix. It is
not a fourth defect and must not be counted as one.

## Defect 3 — one row that is not a parcel

`48491:PRIVATE ROAD` — a literal string where a `prop_id` belongs, returning HTTP 400.
CTX-ACREAGE confirmed it a lineage artifact of the StratMap "leftover farm" family, verified
at both the landing and live-serving stores, one row, no collision. It rejected the graft
hypothesis and the walk-parsing-bug hypothesis with direct queries, and proved
`landing-import.mjs` is a byte-for-byte verbatim copy, ruling that path out with evidence.

Two parts, and the second matters more than the first:

**(a)** A data correction removing or re-classifying that single `cad_property` /
`landing_cad_property` row as a non-parcel StratMap feature rather than a taxable account.

**(b)** A `prop_id` validation guard rejecting non-numeric / non-R-prefixed values before
they reach `cad_property`, so a re-run of the StratMap ingest cannot reintroduce the class.

CTX-ACREAGE could not locate the adapter that produced the row on current `origin/main`
under `lib/cad-ingest` and reported that at the evidence level rather than guessing a file.
It may be a historical one-off matching the 2026-08-25 P-78 "leftover farm" pass. **Finding
it is part of your work.** If it genuinely does not exist in the tree, say so and put the
guard at the boundary that does exist — but establish that rather than assuming it.

Do not write the guard so permissively that it admits the value it exists to reject. Prove
it refuses `PRIVATE ROAD` specifically.

## Verify by violating

Each defect separately, both directions, exit codes read from the process not a pipe:

- a parcel with no ring and no usable `land_acres` earns its acreage absence; a parcel with
  a real acreage still bakes an unchanged `value`;
- a parcel whose `parcel_record` row is missing serves `refused` on `zoning`, and one with
  a real zoning verdict is unchanged;
- the `prop_id` guard rejects `PRIVATE ROAD` and admits a real id.

Confirm the 1.5M healthy cells bake identically. A diff that changes output for parcels
that already satisfy the contract is a regression, not a fix.

## What you must NOT do

Do not widen `BP-CONTENT-01`, add `unmeasured` to the permitted state set, or touch the
jurisdiction cohort sampler. All three live in `hauska-factory` and all three are correct;
CTX-ACREAGE changed none of them and neither do you.

Do not write `absent-verified` anywhere the verified-absence pair is not genuinely present.

Do not deploy, submit a Cloud Build, or run any Cloud Run job, bake, publish or walk. The
integration seat rebuilds the publish image from your merged main and runs the counties.

Do not write to `hauska-factory`, `hauska-engine` or `hauska-map`.

## Close contract

Standard lane close JSON, plus:

- The absence state you chose for acreage and the evidence that its verified-absence pair
  is or is not genuinely present.
- Any further missed siblings found, named but not silently added.
- Confirmation that the `unmeasured` conversion is at the serve boundary only, with the
  internal vocabulary intact.
- Whether the StratMap adapter exists in the tree, and where the guard went.
- All violation runs, both directions, per defect.
- `leave_behind`.

Report the merge commit. The integration seat rebuilds and re-runs Williamson, which is the
county these three were found on.
