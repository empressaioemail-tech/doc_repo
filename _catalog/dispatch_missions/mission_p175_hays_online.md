## Mission — P-175 HAYS ONLINE: the identifier backfill, the rebind bake, the vacant-lot binding, and five Sturgeon Dr cards a customer can use

You are a hand-carried lane on the property seat. You are the deepest worker: you do not spawn
sub-agents. The integration seat (overseer) reviews your CP1 design and your CP2 staging pilot
in this thread, and the OPERATOR gives the go for the production apply in this thread. You run
the surface probe yourself after each publish.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### Why this row exists (the customer)

The operator, an architect, has a builder client who received this from the City of San Marcos
on 2026-09-12 (Capital Improvements/Engineering): "We would like to see 2D hydraulic modeling
performed on one of the proposed houses to review impacts to the floodplain." The houses are
615, 617, 619, 627 and 629 Sturgeon Dr, San Marcos, Hays County 48209. The operator needs Smart
Site's flood read on the five. Today the product cannot give it, for two different reasons, and
this row removes both.

### What is true today (read at source 2026-09-12 by the integration seat; re-verify at your start)

**The five lots.** CAD's 8-26-2026 PROPERTY export (`hays.zip`, sha256
`7a4bd56dad244b0ead0a0899e082800d2ea01660129d69a3b60387602ee2b193`, member
`2026-PROPERTY-DATA-EXPORT-FILE-PROPERTY-8.26.2026.zip` / `PropertyDataExport1404449.txt`, 40
columns, 134,592 records; the IMPROVEMENT member has 11 columns and is the wrong file) carries
Conway Addition Sec IV block 1:

| lot | CAD PropertyID | QuickRefID | PropertyNumber (= TxGIO geo_id) | TxGIO prop_id | situs on the roll | value |
|---|---|---|---|---|---|---|
| 4 | 84632 | R97651 | 11-2011-0001-00400-3 | 97651 | `STURGEON DR, SAN MARCOS` (no number) | land only 50,130 |
| 5 | 84633 | R97652 | 11-2011-0001-00500-3 | 97652 | no number | land only |
| 6 | 84634 | R97653 | 11-2011-0001-00600-3 | 97653 | no number | land only |
| 10 | 84638 | R97657 | 11-2011-0001-01000-3 | 97657 | no number | land only 50,390 |
| 11 | 84639 | R97658 | 11-2011-0001-01100-3 | 97658 | `629 STURGEON DR` | land only 50,390 |

The CAPCOG address points in `txgio_address` (615 at 29.87113, -97.92674; 617 at 29.87124,
-97.92662; 619 at 29.87135, -97.92649; 627 at 29.87177, -97.92600; 629 at 29.87188, -97.92588)
fall inside exactly those TxGIO parcels by `ST_Contains` (production, 2026-09-12). The city has
assigned numbers the appraisal district has not yet written, so the four vacant lots are
`located-unbound` in `find_parcel` and the Find box: the address is known, no parcel string
matches it, and nothing binds by geometry.

**The chimera.** `find_parcel("629 Sturgeon Dr, San Marcos")` returns node `48209:97658`
(source `parcel-situs`). Its snapshot (`bakedAt 2026-08-30T06:21:20Z`, runId
`pe-r1-NDgyMDk6OTc2NTg…`) carries the Sturgeon lot's polygon (9 vertices, 0.1889 ac, matching
lot 11's 0.19) and every geometry-derived facet: zoning SF-6 San Marcos, city limits
incorporated San Marcos, San Marcos CISD, Upper San Marcos Watershed Reclamation and FCD, flood
Zone AO SFHA true point-on-surface `NFHL_48_20260101`. It also carries CAD account 97658's
attributes: draw label `13669 MESA VERDE DR, AUSTIN, TX 78737`, anchor 30.18232, -97.97703
(`bake-latlng-index`, about 35 km away), market 636,690, structure 2012 / 2,867 sq ft, value
history 2025 635,094. `cad_property` on production: `(48209, 97658, 2026)` situs `13669 MESA
VERDE DR`, source `2026-PRELIMINARY-DATA-EXPORT-FILES.zip`; `(48209, 97658, 2025)` situs `629
STURGEON DR`, source `stratmap25-landparcels_48209_lp.zip` (the P-78 overwrite). TxGIO parcel
128076 (geo_id `11-0362-000E-01500-4`) is the real Mesa Verde Dr polygon. This is
CTX-HAYS-KEY's mechanism (`_inbox/2026-09-10_ctx-hays-key_close.json`): TxGIO's prop_id is the
QuickRefID R-stem, cad_property's prop_id is the PropertyID, and the tier-1 bake joined them on
one bare number. One node, two parcels.

**What is built and not executed.**
- LDT #653 `c43e2436` (CTX-HAYS-REBIND): `parcelCrosswalkJoinKey` in
  `artifacts/api-server/src/lib/joinNormalize.ts`, consumed by
  `nodeFacetBakeTier1ConformantCli.ts:433`; for a gate-blocked county geometry binds through
  `property_number` to `txgio_parcel.geo_id`, corroborated by the QuickRefID stem. MERGED.
- LDT #654 `cebd041d` (CTX-HAYS-BACKFILL): `cad-backfill-published-identifiers`, a two-column
  backfill that refuses six ways and verifies an untouched-columns digest. MERGED. Migration
  `0099_cad_property_published_identifiers` is applied on production AND on
  `f06-staging-neondb` (both carry `quick_ref_id` and `property_number`; the close's
  leave-behind saying staging lacked it is stale).
- hauska-factory `cloudbuild.publish.yaml` pins `_LDT_SHA: cebd041d…`, which contains both
  PRs, and #129 scoped `CADROLL_EXPECTATION_SQL` to the declared vintage
  (`src/lib/publish-cadroll-postcondition.mjs:138-141`).
- OPS-21 H1 (P-145): `hauska-factory-ops21-h1`, commit `eee3c21`
  `feat(P-145/OPS21-H1): Hays identity disposition classifier, control-validated, Hays run
  held`. `scripts/ops21-h1/hays-identity-reconciliation.mjs --county=48209 --allow-hays`, held
  on this backfill (`_inbox/2026-09-10_ops21-h1_cp2.json`).
- Production: `quick_ref_id IS NOT NULL` on 0 of 134,606 Hays 2026 rows; 173,050 tier-1
  snapshots for 48209 dated 2026-08-30. Nothing has reached a customer.

**The declared-roll question is open and NOT yours.** The store carries the PRELIMINARY 2026
drop; the 8-26-2026 drop moves market value on 45,524 accounts. Identifiers describe the
account, values describe the drop; the backfill writes identifiers only. Do not re-ingest.

### What you build and run, in this order

**Step 0. Snapshot.** Worktree `P:/seat-worktrees/property/legacy-design-tools-p175-hays-online`
from `origin/main` (declare the commit; it must contain `cebd041d`). `pnpm install`. Declare the
Neon project `fancy-fire-06136146` branches you will touch: `f06-staging-neondb` first,
`production` second. Verify by violation that the backfill CLI refuses a wrong branch name and a
missing `--tax-year` before you run it for real.

**Step 1. Backfill on staging.** From `_inbox/2026-09-10_ctx-hays-backfill_close.json`
`theInvocation`: dry-run with `--record`, read the record, then apply. Read, do not assume,
staging's matched / skipped / not-written figures. The record must end with `committed`. CP2 is
this pilot: paste the summary line, the record's tail, and
`SELECT count(*) FROM cad_property WHERE county_fips='48209' AND tax_year=2026 AND quick_ref_id IS NOT NULL`.

**Step 2. Backfill on production, on the operator's go in this thread.** Dry-run first; paste
its plan counts against the pre-registered expectation (roll rows 134,606; accounts offered
134,591; matched 134,216; updated 134,216 first run, 0 on re-run; skipped no roll row 375;
skipped null identifier 0; not written 390; digest VERIFIED). Any other number is a finding you
report before applying. Then apply, on the go. Keep both record files and name them in your
close: they are the durable record of a state-changing operation. Re-run once to prove 0.

**Step 3. H1 on production.** In `hauska-factory-ops21-h1` (rebase `feat/ops21-h1-hays-identity`
on `origin/main` first), run the reconciliation with the crosswalk read from the backfilled
columns or from the export (the CP2 says either; prefer the columns now that they exist, and say
so). Deliver the four-bucket disposition table for every non-intersecting Hays row and the count
with no disposition, which must be 0. Commit, PR, merge on the conclusion string `success`. This
closes P-145's predicate; name both rows in your close.

**Step 4. Publish Hays tier-1, staging then production.** The factory job:
`gcloud run jobs execute factory-publish --region us-east4 --project hauska-prod-497015 --args=bastrop-publish,--target=staging,--county=48209,--skip-pmtiles` (confirm the job name and
region from `gcloud run jobs list` before you run; read the current `_LDT_SHA` from
`cloudbuild.publish.yaml` on `origin/main` and confirm it still contains `c43e2436`). Read the
`runs` / `publish_runs` row for the verdict, not the console. If the cadRoll gate refuses, paste
the refuse code and the gate's own arithmetic (re-derive its SQL; a refusal writes no event
body, per `_inbox/2026-09-10_ctx-hays-gate_close.json`). Walk. Then production, same job, same
pin. After the production publish, `get_smart_site 48209:84639` must carry the Sturgeon polygon
AND the 629 label; `48209:97658` must carry the Mesa Verde polygon (TxGIO 128076) and label.
Read both and paste them.

**Step 5. The situs resolver, two changes in `artifacts/api-server/src/lib/txgioAddressResolve.ts`.**
(a) When the parcel-situs ladder returns no hit and the address-point ladder returns a located
point, bind the point to the TxGIO parcel that contains it (`ST_Contains`, one query, county
scoped) and return it as a hit with `source: "address-point-containment"`; keep
`located-unbound` for a point no parcel contains. (b) For a gate-blocked county, a parcel-situs
hit keyed by a TxGIO prop_id resolves to the node the CAD account names through the crosswalk
(`property_number` to `geo_id`), so "629 STURGEON" resolves to `48209:84639`, not to `97658`.
Tests that fail on today's behaviour for both. Same for `smartsite-mcp`'s `find_parcel` if it
has its own copy of the ladder (`artifacts/smartsite-mcp/src/tools.ts:366` says situs-search is
not used there; read it and say which path the connector takes). Deploy api-server and
smartsite-mcp the way their workflows deploy (one traffic shift per service, lease per P-170).

**Step 6. Probe.** `node scripts/surface-probe.mjs --rows P-175` in your doc_repo worktree. PASS
on all five, or the exact reason on each. The artifact path goes in your close.

### Falsifiers, pre-registered

- If after Step 4 `48209:97658` still shows the Sturgeon polygon under the Mesa Verde label, the
  rebind did not reach the bake: the pin, the blocked-county set, or the crosswalk key is wrong.
- If after Step 5 "615 STURGEON DR" resolves to a parcel other than TxGIO 97651, the
  containment query is wrong (check SRID 4326 and the county scope).
- If the production backfill updates a number other than 134,216 on first run or other than 0
  on re-run, stop and report; do not proceed to Step 4.
- If the probe passes while the operator's own Find box search for 629 lands on a card that
  reads Mesa Verde, the probe reads a different path than the browser; report which.

### Also measure, do not necessarily fix

`find_parcel near {"query":"629 Sturgeon Dr, San Marcos, TX","radiusFt":300}` returned twenty
hits, every one at `distanceFt 0`, nineteen of them stacked `705 W RIVER RD` rows, truncated at
radius 300 and again at 75 (two sessions, 2026-09-12). State the mechanism (the centre point,
the distance computation, or a stacked-condo geometry) and one rejected alternative with
evidence. Fix it only if the cause is inside the file you are already changing; otherwise it is
a leave-behind with an owner.

### Out of scope

Adopting the 8-26-2026 drop as the declared roll. Repairing `p78Merge`'s overwrite in other
counties (a P-124 follow-up with its own retirement item). OPS-21 cell fill for Hays beyond what
the bake serves. Any 2D hydraulic model: Smart Site supplies the floodplain determination and
the record inputs, not the engineering study.

### Close

`_inbox/2026-09-12_p175-hays-online_close.json`, `planRows` `["P-175", "P-145"]`, with the two
backfill record paths, the H1 table, both publish run ids, the two `get_smart_site` reads, the
PR numbers and merge SHAs with conclusion strings, the serving revisions read by field, and the
probe artifact. `leave_behind` is required; `none` is a valid answer.
