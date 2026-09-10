---
id: 2026-09-10_ctx_third_party_review
title: CTX third-party review of the integration seat's production thesis, with the sequence that actually reaches production
date: 2026-09-10
last_updated: 2026-09-10
status: verdict, read-only review, not committed by its author
owner: nick
seat: task-scoped review window (unregistered; ran read-only inside the integration seat's checkout at the operator's instruction; wrote this file and nothing else; no commits, no deploys, no job runs)
applies_to: hauska-factory, legacy-design-tools, hauska-map, hauska-engine, smartsite-mcp
plan_rows: [P-124]
severity: customer-facing
snapshot:
  doc_repo: main 337e3b1a (the CTX-TEARDOWN dispatch commit; origin/main unchanged at 2026-09-10T03:20Z)
  hauska-factory: origin/main b9ca9b4 (PR #127, pin bump to LDT 9873ff11)
  legacy-design-tools: origin/main 9873ff11 (PR #649, CTX-LEAVES2)
  hauska-map: origin/main 0b07013 (PR #381)
  hauska-engine: origin/main 15021ef3 (PR #415; PR #414 CTX-FAMILIES merged as c52fe44)
  customer_surface: production smartsite-mcp connector, read between 2026-09-10T02:50Z and 03:10Z; every read is of the baked facet snapshot the connector serves and carries its own bakedAt
instruments:
  - six read-only subagents (two lane-close extractors over 29 closes, one program-definition read, two code readers over hauska-factory and legacy-design-tools plus hauska-map, one live-state read); the extractor for the fourteen earliest 2026-09-09 closes died on an API timeout before reporting, and this window read those closes' load-bearing fields directly instead
  - twenty-one live reads of the production Smart Site MCP connector by this window (find_parcel, find_parcels, get_smart_site depth node, run_report)
  - raw probe table at the reviewer's scratchpad, reproduced in section 3 below
related: _catalog/dispatch_missions/mission_ctx_teardown.md, _dispatches/2026-09-10_ctx-teardown_dispatch.md, _sessions/2026-09-10_MIDSESSION_ctx_completion_and_the_six_classes.md
---

# CTX third-party review: verdict and the real sequence to production

This is the review the operator asked for after naming that the program was circling. It was run by a separate window, not by the integration seat and not by the Cursor teardown lane, using six subagents and direct reads of the production customer surface. It answers the six theses in the teardown mission, names what the thesis omits, and gives one sequence to production with its falsifiers pre-registered.

Every number below names the population it describes and where it was read. Numbers read from a lane close are labelled as such and are claims about that close's snapshot. Numbers this window measured tonight are labelled measured. Code facts carry file and line against the snapshot in the frontmatter.

## 1. Verdict in one paragraph

T5 does not reach production and should not be run as written. It promotes a product that labels StratMap-redistributed valuations as county-assessed on every McLennan parcel and four in five Bastrop parcels, through a promotion path that writes live rows, the freshness stamp and a succeeded status before the production walk runs and has no unpublish, toward a finish line that is not the plan of record's finish line. The circling has a structural cause that no further fix will end: the gate that decides "done" is a sampled, per-parcel, short-circuiting presence check whose required-leaf list is grown one leaf per lane, so each fix clears one presence gap and exposes the next by construction. The way across the line tonight is not a seventh fix. It is one ruling on provenance, one small labelling change, one full-store census that measures every required leaf on every row at once instead of discovering them serially, and then the existing publish job run county by county with the production walk actually read and a customer probe after it. Two counties can go end to end on that path tonight. Two are gated on rulings the seat has already surfaced. The remaining two follow the same rails. Everything else the plan of record calls completion is declared as leave behind with an owner, not claimed.

## 2. Why the program circles, stated as a mechanism

The claim under review is the seat's own: the lanes are not circling, the seat's model is. That is half right. The lanes' measurements do stand. But the reason a new class appears behind every cleared one is not the seat's reasoning. It is the instrument that declares a county done.

The walk (`hauska-factory/src/jobs/verify-walk.mjs`, `gradeParcelResponse` 471-555) grades a sample of parcels, roughly 180 per county, by one HTTP read each. It short-circuits: a non-ok HTTP response fails BP-MEANING-01 and nothing after it is graded (478-480); an earned retirement grades RETIRED and skips content (490-522); the parcel verdict is binary. The content grade (`gradeTier1Content` 424-464) checks that each of 28 required leaves carries one of four recognised states. It does not read a dollar value, a provenance string, or a second source. The list of leaves the bake must earn absences for (`BAKE_OWNED_REQUIRED_LEAF_PATHS`) has been grown by hand: four leaves on 2026-09-08, acreage on 2026-09-09. The divergence test between the walk's list and the bake's list skips in CI because no LDT checkout is present (`_inbox/2026-09-09_ctx-walkrule_close.json:84-90`).

Under that instrument the serial discovery is guaranteed. A parcel that 422s hides every leaf behind it. A leaf not yet on the list is invisible until it is added. A sample of 180 cannot see 291,231 null acreage cells; a single SQL over the store could have at any time since 2026-08-30. The pace of "one more class" is set by the grader, not by the defect density.

The second mechanism to consider is that the pipeline is simply defect-dense and the lanes are finding real defects at their natural rate. That is also true, and it is why the operator should not expect the count to stop at six. But it is not what sets the pace, because the same defects were countable in bulk at any point and were instead found one at a time through a sampled, short-circuiting probe. The correction is therefore an instrument change, not another dispatch discipline: grade the whole store once, then use the walk as a smoke test.

## 3. T3 answered: what a customer sees today

This is the highest-value unmeasured fact in the teardown mission and it is now measured. Every read below was made by this window against the production Smart Site MCP connector at a paid depth (the sentinel lane's only customer curl was at the free tier, where all four dollar fields are studio-gated for every parcel, so tonight's reads are the first measurement of a paying customer's view of a StratMap-valued parcel).

| parcel | county | bakedAt | market / land / improvement served | label on each value | where StratMap shows |
|---|---|---|---|---|---|
| 48309:184293, 311 Austin Ave Waco | McLennan | 2026-08-29 | 6,506,490 / 6,124,540 / 381,950 | source cad_property, valueBasis county-assessed | structuralFact.tier stratmap-roll; owner and landUse sourceVintage stratmap25-landparcels_48309_mclennan_202503 |
| 48309:109745, 1005 Austin Hines Dr China Spring | McLennan | 2026-08-29 | 1,030,370 / 243,260 / 787,110 | same | same; ownerFact state present with ownerName "-" |
| 48309:168429, 100 Washington Ave Waco | McLennan | 2026-08-29 | 27,845,140 / 17,676,650 / 10,168,490 | same | same |
| 48021:35585, 1311 Chestnut Bastrop | Bastrop | 2026-08-29 | 2,182,201 / 224,026 / 1,958,175 | same | structuralFact.tier says cad-export while its sourceVintage string says tier:stratmap-roll;adapter:stratmap |
| 48055:32541, 308 W San Antonio Lockhart | Caldwell | 2026-09-08 | 1,884,580 / 431,050 / 1,453,530 | same | none; genuine CAD export, vintage 2026-caldwell-cad-export_june-5-2026 |
| 48453:192780, 200 W Cesar Chavez Austin | Travis | 2026-08-30 | 79,460,410 / 79,460,410 / 0 | same | none; 2026 preliminary export |

The answer to the teardown's question is exact. A paying customer opening a McLennan parcel is served present market, land and improvement dollars labelled `source: cad_property` and `valueBasis: county-assessed`, identical in every field to a Travis or Caldwell value that came from the appraisal district's own export. The StratMap origin is visible only on the structural fact's tier and on the owner and land-use facts' source vintage, never on the value. The MCP tool description names the block "CAD-roll market/assessed/land/improvement value" and passes it through verbatim (`artifacts/smartsite-mcp/src/constants.ts:21`; `tool-honesty.ts:521-560`). The web UI labels the row "McLennan County appraisal roll" and the module comment calls it "A REAL, SOURCED FIGURE FROM THE COUNTY APPRAISAL DISTRICT" (`fact-sheet-resolver.ts:289-298`; `tax-valuation-paint.ts:24-31`).

The code that produces this is a pair of string constants. `cadRollValue.ts:13,16` define `CAD_PROPERTY_SOURCE = "cad_property"` and `COUNTY_ASSESSED_VALUE_BASIS = "county-assessed"`; `bakedDollar` (130-142) stamps them on every dollar; the roll loader reads `source_vintage` (`joinIntegrityGate.ts:386`) and the slice type it hands to the bake has no field for it (`cadRollValue.ts:226-236`). The live overlay path does the same and discards the Factory cell's `cellSource` (`cadRollFactFromParcelRecord.ts:60-97`; `parcelRecordCellRead.ts:251`). The tier is loaded and dropped at one seam.

So the teardown's first T3 question is answered in the direction it suspected. "Zero CAD signal" is not the right frame. It is a three-null-field allowlist (assessed value, exemption codes, living area) applied to rows whose land, improvement and market values the StratMap adapter deliberately fills (`lib/cad-ingest/src/txgio/landuse.ts:178-181`). The readiness gate's own REAL predicate (`publish-readiness-gate.mjs:259-262`, land value or land acres above zero) classifies the same rows as real accounts. The word "non-account" does not occur in the serve code. This is a provenance-labelling defect wearing an absence costume, and the sentinel lane's recommended disposition, a declared non-account state mirroring record retirement, would convert values a customer can legitimately use, if labelled, into an absence. That loses information on all of McLennan.

The second T3 question is also answered. McLennan's walk pass and its all-StratMap population are compatible because the walk cannot see provenance. What the pass verified about McLennan's values is that seven base-fact leaves were non-null or earned-absent and that acreage was between zero and one hundred thousand. Nothing else. The 182 of 182 figure is real: the live-state read found it tonight as `verify_walks` row 4db2a33f on the Factory store, 182 pass and 0 fail, stamped 2026-09-09T22:52:02Z on staging execution l9vhf. It has no lane artifact in `_inbox/`, and the only tally any lane close records is 181 pass and 1 fail before the situs fix (`_inbox/2026-09-09_ctx-prov_close.json`). The number stands; what it proves does not change.

## 4. Two customer-visible defect classes the thesis does not contain

These were found tonight on the production surface without touching the pipeline. They are the answer to T6: the seventh class exists, and it is the class of a value served with a label asserted by a constant and consumed by a check that cannot fail on it.

**Travis serves a systematic tenfold gap between its 2025 and 2026 valuation rows.** Measured on five Travis parcels tonight: 48453:189838 (8,612,027 then 86,153,487), 48453:192780 (7,946,041 then 79,460,410), 48453:374448 (75,000 then 750,000) are exactly ten to one; 48453:189857 and 48453:192779 are 10.2 and 11.2 to one. The 2025 row is StratMap-derived and the 2026 row is the preliminary appraisal export; one of the two is off by an order of magnitude and both are served present with the same label. Which one is wrong is not decidable read-only. Nothing in the walk, the gate or the serve path compares a value across vintages or against a second source (S3, the only such rule, is UNMEASURED on every real walk because nothing supplies its inputs, `verify-walk.mjs:1360-1366`).

**Hays joins valuations on an identifier the payload itself says does not join.** 48209:40138 resolves from the address index as 100 Riverside Dr, San Marcos, and its baked record draws as 340 Windmill Way, Buda, with acreage 0.4553 and 19,831 square feet. 48209:26199 is the Buda parcel under its own id and carries the identical draw label and identical acreage to four decimals, with different dollar values. The 26199 payload holds owner and land use on a join hold whose reason reads "TxGIO prop_id does not join the CAD account", while cadRoll and value history on the same payload are joined on that same id and served present. The hold is applied to two rails and not to the four that carry money. A San Marcos parcel's 2025 value row, with land plus improvement seven times its market value, is most likely another property's.

Smaller instances of the same class, all measured tonight: an owner name of "-" served as present (48309:109745); a value-history entry with every field null served as present (48055:1); acreage null with no state and no refusal (48491:R038883); a structural fact whose tier field and vintage string name different tiers (48021:35585); a `vintage` field that is a batch write timestamp on present values and a source-edition string on absent ones, so the field does not mean one thing.

And one capability finding: the plural search surface refuses `constraint_projection_missing` for all six counties. The projection table has no writer anywhere in the repos; the migration that creates it is marked handed back unapplied; the tool advertises the six counties it has no rows for (`parcelConstraintSearch.ts:57-64`; `lib/db/drizzle/0094_p106_parcel_constraint_index.sql:3-8`). Cross-parcel questions are zero today, independent of anything P-124 does.

## 5. Ranked defects in the thesis, by what they would cost if acted on

1. **T5 promotes mislabelled money.** 176,512 rows at the declared vintage (Bastrop 62,257, McLennan 114,255, per the sentinel close) plus the superseded-vintage StratMap rows still in the served store (Hays about 38,000, Williamson about 282,000 per the batch-2 cross-close derivation, unmeasured directly) would go to production labelled county-assessed. Cost: the paid product's provenance promise broken on a hundred percent of one county, discoverable by any customer who reads a source vintage.

2. **Step 5 is not mechanical and it is not safe.** Promotion is the identical job re-run against the production store pair (`bastrop-publish.mjs:32-37`; `publish-target-env.mjs:21-32`). The bake, the freshness stamp and `publish_runs.status = 'succeeded'` are written before the production walk runs (468-495 then 497-520); a failed production walk sets the run to failed and leaves the rows live; nothing consumes a production walk verdict afterward; there is no unpublish. The sibling guard does not compare the staging run's pin to the production run's (`publish-guards.mjs:89-97`); `--skip-walk` is allowed on production; the operator go is any non-empty string. Cost: a bad production bake is live the moment it is written and stays live.

3. **T5's finish line is not P-124's.** The plan-of-record row (`OPS-16:234`) defines completion as one Z7 facet bake and one Z8 atom bake run and walked per county, and setbacks, envelopes, footprints and boundary edges verified serving on smartsite.cloud, smartsite-mcp and hauska-mcp-server by field-name reads. Z8 has no runner in any Cloud Run job, by the row's own text. A-115 adds road-node apply for Travis and Williamson and McLennan boundary edges. T5 mentions none of it. Cost: either "done" is declared against a definition it does not meet, or the true definition is honoured and is unreachable tonight. The way out is an amendment, not silence.

4. **Caldwell's re-bake has already been run and has already failed.** The live-state read shows staging execution mg9tm re-baked all 48,649 Caldwell tier-1 rows at 22:39Z to 22:48Z on 2026-09-09 on the publish image pinned to 7a739849, which contains both the retire fix (#647) and the situs-skip fix (#648). The walk that followed, 7c406f88, failed exactly one parcel: 48055:1, HTTP 422. The retire lane's own side-by-side payload shows 48055:1 taking the retirement path (`_inbox/2026-09-09_ctx-retire_close.json`, `recordRetirement.status: retired`), and on that path the bake CLI writes the raw ", ," situs by design (`nodeFacetBakeTier1ConformantCli.ts:121-135, 344-376`) while the serve guard refuses any punctuation-only situs (`serveGuards.ts:74-87`). Two deliberate rules contradict on exactly this row. The second mechanism that would produce the same 422, the walk's target site proxying to production and reading the pre-fix 09-08 snapshot, is rejected because McLennan's punctuation-situs failure on parcel 48309:103671 cleared on the same walk target after a staging-only bake, so the walk was reading staging. The retire lane also found that 48055:1 shares its prop_id with more than two hundred other parcel features, so it is a bucket identifier rather than an account, and the jurisdiction cohort selects it by ascending text sort on every walk. Cost of repeating T1's step: another bake cycle and the same 422. The fix is a contract decision plus a sampler rule: retired payloads bake situs null, or the serve guard exempts an earned retirement; and bucket identifiers are excluded from the cohort by a named class.

5. **Hays tax-year scoping clears the gate by relabelling.** Adding the declared vintage to the expectation removes the 2025-only rows from the denominator and the gate passes. Those 37,813 StratMap-only rows then take the retirement path, whose basis text asserts the account "is not on the current roll: split, merged, renumbered or removed" (`nodeFacetBakeTier1Conformant.ts:705-713`), which is false for rows that were never on a CAD roll, and the walk grades RETIRED without reading the claim. Cost: a false earned absence on twenty-two percent of Hays. The valuation join-hold inconsistency in section 4 sits in the same county and is not in the thesis at all.

6. **T2 is right and short.** The unmeasured-to-refused conversion lives in `verdictLayerServe.ts:376,391`, called only from the facets route, deployed only by a manual cortex-api canary and shift (`.github/workflows/cloud-run-deploy.yml:42-72`; merge builds an image and deploys nothing). Necessary and sufficient for the route the walk reads. What T2 omits: the staging tag must be re-bound after any cortex-api deploy (the 2026-09-09 session's item 8), and the last verification of that binding was 2026-09-09 and has not been repeated, so every staging walk since is trusted on an unverified tag. The bare `refused` it emits also satisfies the walk with no evidence (`verify-walk.mjs:369`), which is the sentinel-satisfies-check shape ENFORCEMENT forbids.

7. **T3's recommended disposition loses information.** Covered in section 3. The declared state should be a provenance label on a present value, not an absence.

8. **T1's premise is recorded in the store and nowhere else, and it was graded against a store none of tonight's fixes reached.** The 182 of 182 row exists on the Factory store (section 3). The staging snapshots it graded were written by the publish image built at 20:18Z on 2026-09-09 with the pin at 7a739849, one pull request before the acreage fix; the serve path it read was cortex-api at 69de8fe6, three pull requests before the unmeasured-to-refused fix. The `staging` tag sits on revision 00756-gim, created by hand at 11:40Z with the same image digest as production; whether its database binding still points at the staging branch is a secret this review did not read. The 09-09 writes landing on the staging branch are the only evidence that it does.

9. **T4 conflates two thirteens and is stale.** The thirteen ledger functions with eight refusing (OPS-16 A-060, 2026-08-31) are the MCP companion app's function inventory, not the feasibility export's thirteen fact families in `feasibility.ts:782-794`. The seat's own pickup declares the A-060 tally superseded by the absentFields classifier. CTX-FAMILIES is hauska-engine PR #414, merged as c52fe44 although its close file says open; whether the serving engine-api revision carries it is a live question. The customer-visible refusal count on either instrument is unmeasured tonight either way.

10. **T6 is the one thesis the seat got right, and it understated it.** Section 4 names two instances found in an hour on the customer surface. The factory code reader lists twelve never-graded items, the top three being evidence-free `refused`, dollar values with no second derivation anywhere, and production live before it is graded.

## 6. What the thesis omits entirely

- The plural search capability (section 4): no writer, refuses everywhere, advertised for six counties.
- The deploy set. Five surfaces deploy by hand and T5 names one: the publish image (`gcloud builds submit --config=cloudbuild.publish.yaml`, no CI trigger), cortex-api (canary and shift), smartsite-mcp (canary and shift, only if the wire changes), property-explorer on Vercel (CI is pull-request only; the InspectCard crash guard 0b07013 reaches no customer until deployed), engine-api (Cloud Build, for #414).
- Every customer-visible bake is from 2026-08-29 or 08-30 (one Caldwell parcel 09-08, the 48055:1 parcel 07-23). Every fix merged since is invisible until a re-bake and, for production, a production publish.
- The cached gate verdict. `parcel_gate_verdict.evaluated_at` is selected and never read (`publish-readiness-gate.mjs:319-352`); a refresh must precede every county re-run or the run reads a stale verdict, which the seat itself recorded as its seventh shape error.
- The pin-staleness gate is blind to workspace packages. `DECLARED_CAD_VINTAGES` reaches the image through `@workspace/cad-ingest` and sits outside the 26-module graph (`bake-module-graph.mjs:8-11, 41-49`), so a vintage change passes the staleness check while changing every bake's tax year.
- Two definitions of "account" that disagree, neither in the bake: the readiness gate's REAL predicate and the sentinel's allowlist; the ingest stamps `land_acres = 0` as a value while the gate calls it not real.
- The Bastrop inversion, unverified but arithmetically exact across four closes: 77,799 minus 62,257 equals 15,542, which is the genuine CAD-export slice, the no-row null-acreage count and the parcel-record instantiation gap. If those are the same set, Bastrop's real appraisal accounts are the ones with no geometry and a refused acreage while its StratMap rows are the fully instantiated, walk-passing population. One query settles it and nobody has run it.
- Decision records. Four operator rulings from 2026-09-09 have no file in `_decisions/`. The water-supply-rural ruling of not-applicable was implemented as refused on 244,669 parcels.
- The production walk is consumed by nothing and there is no unpublish (defect 2).
- `publish_runs.status` reads `succeeded` on staging publishes whose walk failed; the failure lives only in `runs.refuse_code`. A pre-bake refusal records no rail name. Four legacy-design-tools SHAs are live across the job fleet at once. All three are measured in section 11.
- Per-county record-keeping that A-021 requires after each production publish: revision, run id, freshness stamp in the OPS-19 grade log.
- The 2026-09-01 sequencing ruling puts "fix the review findings" between adversarial review and "consider what is needed to reach production". T5 has no such step. This document is that review.

## 7. Which of T1 to T6 survived

| thesis | result | why |
|---|---|---|
| T1 | partly | The four actions are real. Caldwell's and Hays's are wrong as stated (defects 4 and 5). The list omits the deploy set, the gate refresh and the staging tag, and rests on an unrecorded walk figure. |
| T2 | survived, incomplete | cortex-api canary and shift is necessary and sufficient for the facets route. Add the staging-tag re-bind and a read of the walk's route. |
| T3 | did not survive as framed | Provenance labelling, not absence. The customer sees county-assessed on every StratMap dollar. The proposed absence state loses information. |
| T4 | superseded | Two populations conflated; the instrument the seat itself named as the replacement has not been re-run; #414 is merged, deploy unknown. |
| T5 | failed | Wrong finish line, unsafe promotion mechanics, five manual deploys missing, no customer probe, no census. |
| T6 | survived, understated | The seventh class is named with instances in section 4. Expect more of that class, not of the absence classes, because nothing grades a served value against anything. |

## 8. The real sequence to production

Order and dependencies only. No durations. Each step names what would prove it wrong.

**Stage A. Rule and declare, before any build.** Four rulings, all of which the seat has already surfaced as open and none of which a lane has standing to make.

- A1. Non-account disposition is a label, not an absence. Every served dollar carries the roll tier and the source vintage it came from, and `valueBasis` is derived from the tier rather than asserted. Reject the declared non-account absence state. Falsifier: none needed; this is a product decision, and the alternative is defect 1.
- A2. Hays is held tonight. The cadRoll expectation is scoped to the declared vintage only together with a truthful state for rows never on a CAD roll (not retirement), and the dollar rails inherit the same join hold that owner and land use already carry in Hays. Falsifier: if a Hays parcel still serves a value-history row whose land plus improvement exceeds market by more than a rounding margin after the change, the join hold did not reach the money.
- A3. Caldwell is held until the contract is fixed: retired payloads bake `facets.base.situsAddress` null, or the serve guard exempts an earned retirement; and the walk's jurisdiction cohort excludes bucket identifiers (a prop_id shared by many parcel features) by a named class. The retire lane already established that 48055:1 is retired and is a bucket id, and last night's staging re-bake on the fixed pin already reproduced the 422 (defect 4), so no further query is needed to justify the ruling. Falsifier: after the next bake, a live read of 48055:1 on the facets route returns 422 or 500.
- A4. Amend P-124 so that tonight's target is stated and can fail: Z7 tier-1 conformant serving on production for the counties that clear, provenance-honest, content-walked, census-clean and customer-probed. Z8, envelopes, footprints, boundary edges and road-node apply stay in the row as later waves with named owners. File the four 2026-09-09 rulings as decision records in the same pass.

**Stage B. Code, three pull requests, each with a test that fails on the violation, merged only on a green conclusion string.**

- B1. legacy-design-tools: provenance-honest cadRoll on the bake path, the overlay path, the wire and the UI label; retired-path situs null per A3. One caveat from the Hays split lane binds the design: `cad_property.source_file` and `source_vintage` are overwritten unconditionally by the merge's ON CONFLICT clause (`p78Merge.ts`, per `_inbox/2026-09-09_ctx-hays-split_close.json`), so on any county applied more than once at one tax year the provenance column is the last writer, not the lineage. The tier must therefore be derived from the declared vintage together with a field StratMap structurally cannot populate (assessed value is the one that lane used), not read off `source_file`. Test: a StratMap-tier row must not serialise with `valueBasis: county-assessed`.
- B2. hauska-factory: cadRoll expectation scoped per A2 with the declared vintage read from the bake summary or from a mirrored constant guarded by a divergence test; pin bump to the B1 SHA; the bare-specifier blind spot in the module graph closed so `@workspace/cad-ingest` is followed. Test: a change to `vintage.ts` must fail the staleness check.
- B3. hauska-factory: the census instrument. A file-based, self-tested script that reads every `place_layer_snapshots` tier-1 row for a county on the target store and classifies each of the 28 required leaves plus the four dollar fields, the owner name and the structural tier with the walk's own classifier, reporting counts per (county, leaf, state) and refusing on any unrecognised state, any sentinel string, and any tier-field disagreement. The pattern already exists in the repo: `scripts/ctx-prov/provenance-population.mjs` re-expresses one walk predicate as SQL over the whole served store for all six counties and found 18,037 rows in a full-table scan that the sampled walk had surfaced as one parcel (`_inbox/2026-09-09_ctx-prov_close.json`). B3 is that script generalised to every required leaf. The walk-rule lane also recorded that the walk's required-path list is stale against the pinned bake by eight paths, so B3 must take its list from the bake's own `BAKE_OWNED_REQUIRED_LEAF_PATHS` at the pin, not from the walk. Self-test in both directions: a fixture with a bare null must fail; a fixture with a "-" owner must fail; a clean fixture must pass. Falsifier for the instrument: if it passes a store the walk fails, it is wrong.

**Stage C. Deploys, by hand, in this order, each verified by a field-name read of the serving digest, never by merge state.** Starting point per section 11: the publish image is one pin behind main, cortex-api is three pull requests behind, smartsite-mcp four, engine-api two, and the web app is current.

- C1. Build the publish image at the B2 pin (today it is at 7a739849 and main pins 9873ff11; if B1 lands first there is one build, not two). Verify `factory-bastrop-publish`'s image digest by reading the job description as JSON.
- C2. cortex-api canary and shift at the B1 SHA (today it serves 69de8fe6). Read `status.traffic` by field and confirm the serving digest. Then re-bind the `staging` tag to the staging database and read it back. Read the new revision's `DATABASE_URL` secret reference by field before shifting traffic (the A-060 standing rule).
- C3. Refresh `parcel_gate_verdict` for the six counties, or read `evaluated_at` and wait for the cron. Do not run a county on a stale verdict. Make the gate record the refusing rail's name on a refusal before Travis is re-run, or Travis's next RAIL_REFUSED is as unattributable as last night's.
- C4. smartsite-mcp canary and shift only if B1 changes the wire shape. The web app is current at 0b07013 and needs nothing. engine-api Cloud Build at c52fe44 is P-120 work and is noted, not sequenced here.

Trade-off stated once: building at 9873ff11 now and re-baking before B1 lands would measure whether the acreage and unmeasured classes clear on staging, at the cost of a second full bake pass per county once B1 lands. The recommendation is B1 first and one pass, because the label change is small and the bake pass is not.

**Stage D. Per county, identical job, staging then production, in this order: McLennan, Bastrop, Travis, Williamson; Caldwell after A3 lands; Hays after A2 lands.** McLennan goes first because it is the county the label fix is for and the county with no acreage defect. Per county:

1. Staging publish with `--gold` supplied. Staging walk with sweep of at least ten and the jurisdiction cohort. Census on staging.
2. Production publish. Production walk. The planner reads the production walk verdict before saying anything, because the code does not. Census on production.
3. Customer probe on the production connector: three parcels of different data per county (one incorporated, one unincorporated, one with a known absence). Pre-registered falsifiers: any dollar with `valueBasis: county-assessed` and no tier means B1 did not reach the customer; any acreage null without a state means the pin did not reach the bake; any owner "-" or all-null value-history entry served present means the census missed a sentinel.
4. Record the revision, run id and freshness stamp per county in the OPS-19 grade log per A-021.

If a production walk or census fails, the rows are live. The only remedies today are a re-bake on the fixed pin or a declared quarantine. Say which was done.

**Stage E. Close with a leave-behind declaration.** Section 10.

What this sequence deliberately does not do tonight: implement a non-account absence state; scope the Hays gate without the truthful state; re-bake Caldwell before A3; promote McLennan on the current bake; run Z8; claim the P-124 row complete.

## 9. What the operator has to decide tonight for the sequence to start

Only A1 through A4. Every other open ruling the docs carry (twenty-five are listed in the program-definition read) can wait behind them. If A1 is decided against the recommendation and the absence state is chosen instead, the sequence still runs but McLennan ships with no valuations and the customer probe's falsifier changes to "no McLennan dollar is served present".

## 10. Leave behind

```
leave_behind:
  - item: Z8 atom bake runner, envelopes, footprints, boundary edges verified serving on three surfaces (P-124 completion clause, waves 3 and 4)
    owner: integration seat, to be assigned per lane
    plan_row: P-124
  - item: constraint projection writer for pe_parcel_constraint_index and application of migration 0094; plural search refuses for all six counties today
    owner: property seat
    plan_row: P-106 or backlog
  - item: Travis 2025 valuation rows off by an order of magnitude against 2026; mechanism and which vintage is wrong undetermined; the value-history rail's writer, parcel-value-history, has no Cloud Run job and no build config per the orphans lane, so how those rows were written is itself unrecorded
    owner: property seat
    plan_row: P-124 or backlog
  - item: Hays dollar rails joined on a prop_id the payload's own join hold says does not join; cross-record contamination measured on 48209:40138 and 48209:26199
    owner: property seat
    plan_row: P-124
  - item: production publish writes rows, freshness and succeeded status before the production walk; no consumer of the production verdict; no unpublish; sibling guard compares no pin
    owner: property seat (hauska-factory)
    plan_row: F-08
  - item: pin-staleness gate blind to workspace bare specifiers; DECLARED_CAD_VINTAGES outside the graph
    owner: property seat (hauska-factory)
    plan_row: backlog
  - item: refusal count re-measured on the absentFields instrument for Caldwell, Williamson, Hays once engine-api serves c52fe44
    owner: P-120 seat
    plan_row: P-120
  - item: Bastrop 15,542 inversion check (are the genuine CAD-export accounts the no-geometry, refused-acreage set)
    owner: property seat
    plan_row: P-124
  - item: decision records for the four 2026-09-09 rulings; water-supply-rural implemented as refused against a not-applicable ruling
    owner: integration seat
    plan_row: P-124
  - item: staging tag binding on cortex-api re-verified after every deploy and recorded
    owner: integration seat
    plan_row: P-124
  - item: this review's own instruments were read-only reads of a serving connector and code at the frontmatter snapshot; nothing here was verified by violation except the census design, which is proposed, not built
    owner: none
    plan_row: none
```

## 11. Live state as read tonight

Read between 2026-09-10T02:49Z and 03:24Z by the live-state subagent with `gh`, `gcloud --format=json` (fields by name, traffic block not latestReady, digests not tags), `neonctl` plus `psql` in read-only sessions, and `curl`. One instrument defect was caught and corrected mid-read: `neonctl connection-string` silently ignores `--branch-id` and returns the default branch, so every "staging" read before 03:17Z had hit production; the corrected reads use `--branch` and carry the endpoint host.

| surface | serving now | main is at | gap | what closes it |
|---|---|---|---|---|
| cortex-api (legacy-design-tools-prod) | revision 00754-feg at 100 percent, digest c93336ac = tag 69de8fe6 (PR #646), deployed 2026-09-09T05:16Z | 9873ff11 (PR #649) | three pull requests: #647 retire, #648 situs-skip, #649 leaves2; image for 9873ff11 exists in the registry since 00:33Z | manual workflow_dispatch deploy-canary then shift-traffic; then re-bind the staging tag |
| factory-bastrop-publish and its four sibling jobs (hauska-prod, us-east4) | digest 65fde738 from Cloud Build c282043a at 2026-09-09T20:18Z with `_LDT_SHA=7a739849` (PR #648) | cloudbuild.publish.yaml pins 9873ff11 since PR #127 at 02:25Z | the acreage fix is on main only; zero Cloud Builds in hauska-prod since 02:00Z | `gcloud builds submit --config=cloudbuild.publish.yaml`, then read the job's image digest |
| hauska-engine-api (hauska-prod) | revision 00198-cir, digest 2af8119c = tag f2535f4 (PR #413) | 15021ef3 | #414 (six fact families) is built as image 9293025e and never became a revision; #415 (Elgin S-P) was never built | Cloud Build source deploy |
| smartsite-mcp (legacy-design-tools-prod) | revision 00103-huw, digest da825b9e = tag 3c3c243d (PR #645) | 9873ff11 | four pull requests; image for 9873ff11 built at 00:30Z | manual deploy-canary then shift, only if the wire changes |
| smartsite.cloud (property-explorer on Vercel) | deployment dpl_BnwpYTDg from 2026-09-09T02:01Z, commit 0b07013 | 0b07013 | none | nothing |
| the walk's target site, smart-site-factory.vercel.app/site | bundle from branch seat/property-factory, commit d76a3151, deployed 2026-08-27 | not applicable | which cortex-api revision it proxies to was not measured | read its config before trusting a staging walk |

Stores, per county, `place_layer_snapshots` tier-1 rows on cortex-prod:

| county | production rows / last written | staging rows / last written / rows touched 2026-09-09 | staging walk 2026-09-09 | last production publish |
|---|---|---|---|---|
| 48021 Bastrop | 77,799 / 09-01 | 77,799 / 09-09 23:24Z / all | fail 88, pass 160; all 88 are acreage null plus zoning unmeasured, the two things #649 fixes | 08-29 |
| 48055 Caldwell | 48,649 / 09-08 20:16Z | 48,649 / 09-09 22:47Z / all | fail 1, pass 85; the one is 48055:1 HTTP 422 | 09-08 |
| 48209 Hays | 173,050 / 09-01 | 173,050 / 09-09 12:50Z / 172,282 with no stamp | none; refused CADROLL_RENULLED after the bake had written | 08-30 |
| 48309 McLennan | 114,255 / 09-01 | 114,255 / 09-09 22:52Z / all | pass 182, fail 0 (row 4db2a33f) | 08-29 |
| 48453 Travis | 500,307 / 09-01 | 500,307 / 09-01 / none | none; refused RAIL_REFUSED before the bake, and the refusing rail is recorded nowhere | 08-30 |
| 48491 Williamson | 602,050 / 09-01 | 602,050 / 09-09 22:30Z / all | fail 8, pass 322 | 08-30 |

No production publish of any county has run on 2026-09-09 or 09-10. Row counts are identical between staging and production for every county because the bake upserts in place. `parcel_gate_verdict` for all six counties reads pass or excluded on the seventeen gated rails as of 02:04Z to 03:02Z, with an hourly scheduler whose runs overlap and one of which crashed at 01:00Z. The `schoolDistrict` verdict rows still date from 2026-09-04 and sit outside the gated rail set, so today's school-district applies re-evaluated nothing.

Three fail-open readings from the live state that belong with section 4: `publish_runs.status` is `succeeded` on all three staging publishes whose embedded walk verdict is `fail`, because the job's failure lives in `runs.refuse_code` and not in the publish row, so a reader of the publish table alone calls three failures successes; Travis's pre-bake refusal left one bare string `RAIL_REFUSED` in the log and one termination event with no rail name, so the refusal cannot be attributed; and four different legacy-design-tools SHAs are live across the job fleet at once (46e1a5a1 in the Dockerfile default and every non-publish build, 301bb75a in the zoning image, 7a739849 in the publish image, 9873ff11 on main).

## 12. What read-only could not settle, and the one query for each

1. Which roll 48055:1 is on: `SELECT tax_year FROM cad_property WHERE county_fips='48055' AND prop_id='1'` on the target store. Decides whether a re-bake clears or reproduces the 422.
2. Whether `landing_parcel_jurisdiction` for 48055 contains prop_id 0 or 1, which would make the cohort select 48055:1 on every walk by construction.
3. Whether `cad_property.source_vintage` textually names StratMap for McLennan and Bastrop, which decides whether any lineage reaches a served field today.
4. Settled tonight: the McLennan walk row exists (section 3). Still open is its body's sweep and cohort split, which the same query returns.
5. Settled tonight: cortex-api serves 69de8fe6; the publish image is at 7a739849; engine-api serves f2535f4 with #414 built and undeployed (section 11). Still open: the database binding behind the `staging` tag on revision 00756-gim, which is a secret reference this review did not read.
6. Which cortex-api revision the walk's target site proxies to. Read the Vercel project's environment for smart-site-factory before trusting any staging walk verdict.
7. Which rail refused Travis at 23:11Z on 2026-09-09. Not recoverable; the gate overwrote its per-rail rows and logged only the code. Fix the instrument (C3) and re-run.
8. Which vintage is wrong in the Travis tenfold gap: one parcel checked against the appraisal district's public record.
9. The Hays post-scoping residual: with the declared vintage applied, how many declared-roll prop_ids with dollars have a tier-1 snapshot with a null cadRoll. That number is the real bake defect rate for Hays and is unmeasured.
