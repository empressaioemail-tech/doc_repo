---
id: 2026-08-30_ctx_w3_collect_review
title: Review — CTX W3 collect-then-atomize plan, graded
date: 2026-08-30
last_updated: 2026-08-30
status: finding
role: adversarial plan review (read-only; no fetch, apply, migrate, bake, deploy, commit)
reviews: _inbox/2026-08-30_ctx_w3_collect_WDLL.md
brief: _inbox/2026-08-30_ctx_w3_collect_review_handoff.md
plan_row: F-01, F-09, F-11, F-18, P-09, P-11, P-85
verdict: refuse as written; approve on amendments A1 to A7
snapshot: see Snapshot section (every product repo read by ref, never from a working tree)
---

# Review: CTX W3 collect-then-atomize

Date: 2026-08-30  Reviewer: review agent  Status: finding

## Snapshot

Declared per ENFORCEMENT "State your snapshot". Every product-repo read below is `git show <ref>:<path>` or `git grep <ref>`, never a working tree, because the local checkouts are stale.

| Repo | Ref read | Commit | Note |
|---|---|---|---|
| `P:/doc_repo` | `main`, working tree | `7841fe2` | tree is dirty (60+ modified paths from other seats); no writes by this review except this file |
| `P:/hauska-factory` | `origin/main`, fetched this session | `7f41f52` | local `main` is `3653f12 Initial commit`, a stale clone; every Factory claim here is against `origin/main` |
| `P:/hauska-engine` | `origin/main`, fetched this session | `2c90b99` | local HEAD is detached at `8d8e880`; not used |
| `P:/legacy-design-tools` | `origin/main`, fetched this session | `d8dfb319` | local branch is `feat/s1-instrument-hardening`; not used |
| `P:/seat-worktrees/property/hauska-factory-ctx-publish` | working tree, read only | `866c38b` | branch `seat/property-ctx-walk-alias-schema`, NOT main. Migration 0005 and the two parsers exist only there and on that branch. Nothing in this review treats that branch as landed. |

Instruments used: `git show` and `git grep` by ref, `grep`, and one file-based `node` read of `_catalog/texas_roster_v1.json`. No store connection, no GIS fetch, no gcloud. Where a claim needs live state I write UNMEASURED and name the query.

## Verdict

Refuse as written. Approve on amendments A1 to A7.

The spine of the card is right and is not in dispute: collection is L2 landing, atomization is L3 writers, they are different jobs, and live ArcGIS inside an atom writer is the P-85 defect. That framing survives review intact.

The refusal is narrower and specific. Three things make the card unsafe to execute in its current text.

1. Acceptance item 3 instructs applying migration 0005. Migration 0005 does not only create tables. It seeds five `kind='absence'` registry rows, four of which are contradicted by dated, cited, dimensional setback tables that are on `legacy-design-tools` `origin/main` today. Applying 0005 writes a fabricated honest-absence into a store. Under A-028 and the enforcement rule on absent, zero and unmeasured, an asserted negative that is false is worse than a gap, because it is a claim.

2. The card's premise that Band 1 writers read landing rather than live REST is false for every writer it names. Four read `neondb` raw tables; the fifth live-queries ArcGIS from hardcoded constants. The card names no retarget, so the Factory L2 copy it treats as collect-complete is read by nothing.

3. The card's own gate, acceptance item 7, is unexecutable. No Factory or engine job image can read `_inbox/`, and the one mechanism that could gate a rail is dormant.

None of the three requires re-planning the program. All three are amendments.

## Per-item grading (collect WDLL items 1 to 8)

| # | Item | Grade | Evidence |
|---|---|---|---|
| 1 | Factory is the collector; L2 and L3 are different jobs | contradiction | The item's own check is "no apply lane fetches REST". The easement atom writer `packages/engine-core/scripts/write-utility-easement-county.mjs` on engine `origin/main` fetches ArcGIS at apply time from `src/utility-easement/constants.ts` lines 68, 71, 74 (McLennan CAD FeatureServer, Bastrop `Easements_/43`, Bastrop parcels). Its adapter kinds are `cad-easement-rest-v1` and `municipal-easement-rest-v1`. The card names no retarget of that writer onto `landing_easement_gis`, so Band 1 easement apply as it exists today fails item 1's check. |
| 2 | Already-landed counts filed | hole | Two defects. (a) The item requires per-FIPS counts. `src/jobs/landing-import.mjs` has no county scoping: `streamCopy` declares `CURSOR FOR SELECT to_jsonb(t) AS payload FROM ${spec.source} t` with no predicate, and `import_ledger` is table-grain (`table_name, source_count, factory_count`, `migrations/0001_init.sql:33`). A per-FIPS two-count cannot be produced by the job the card names. (b) `tx_rrc_well` is 1,396,049 rows across 254 counties (verified 2026-08-19, `_inbox/2026-08-19_ss-w14_close.json`); Bastrop is 2,548 of them. A whole-table jsonb landing copy of wells, footprints and NFHL to serve a six-county card is an unbounded cost the card does not name, against a store already known to time out reads under writer load. |
| 3 | 0005 applied on the Factory store | contradiction | See A1. 0005 is not schema-only: it carries `INSERT INTO landing_setback_registry ... ON CONFLICT DO NOTHING` seeding eight rows, five of them `kind='absence'`. Applying it is a data write of five absence claims, four of which are false. Separately `applyMigrations()` connects through `connectFactory`, whose `REQUIRED_ENV` is `["FACTORY_DATABASE_URL"]` only, so 0005 reaches the Factory control store and never `neondb`. See open question 4. |
| 4 | Setback landing complete | hole, and the check is gradeable and currently fails | The check is "registry count equals city roster". Contrary to the standing memory that the roster has no county link, `_catalog/texas_roster_v1.json` now carries `parent_county_fips` on 1,214 of 1,223 city rows with real `parent_county_name` values. Scoped to the six (48021, 48055, 48209, 48309, 48453, 48491) the roster yields 69 incorporated cities. The 0005 seed registers 8. Item 4 as specified, "every incorporated city on the six is sourced records or an absence row", stands at 8 of 69. The check is computable; it does not pass. |
| 5 | Easement landing complete | hole | The check says "four layer counts vs T3 (148 / 1254 / 8400 / 44197 / 16578)": five counts for four layers. `easement-gis-landing.mjs` registers five `layerKey` values (Bastrop 43, Round Rock, Cedar Park, McLennan 9, McLennan 10) and the CHECK constraint in 0005 enumerates all five. The count discipline in the acceptance item does not match the artifact it grades. Two of the five URLs are unprobed; see open question 2. |
| 6 | Rail-absence rows exist | hole, and not this card's to grade | `git grep rail_absence` on Factory `origin/main` returns nothing; the table does not exist and 0005 does not create it. The item's own check is conditioned on "once Abs is deployed", which is Band 0 work this card does not own. The item is honest about the dependency, but it cannot be graded inside this card while item 7 lists it as a rail whose collect-complete is required. |
| 7 | Collect-complete artifact | contradiction (starved gate) | See falsifier 6 and A3. The check is "Band 1 jobs refuse to start without that file naming their rail". `Dockerfile` copies only `package.json`, `src` and `migrations`; `Dockerfile.publish` adds bundled LDT bake CLIs. Neither image contains `_inbox/`, and no job clones doc_repo. A JSON file in doc_repo cannot gate a Cloud Run job. |
| 8 | Atomize not claimed here | met | The card writes no atoms, the Band C lane table contains no atom writer, and the "Do not" list forbids starting Band 1 apply on an unnamed rail. The check, "`well-fact` count on Bastrop unchanged by items 1 to 7", is a real second-derivation check and is satisfiable. This is the strongest item in the card. |

## Pre-registered falsifiers, scored

Each falsifier states what result would prove the plan wrong, stated before the look, then the score.

**1. Collapsed layers.** Would fail if a collect lane writes `atoms`, or an apply lane fetches REST. **FAIL, on the second half.** No collect lane writes atoms; that half holds. The apply half fails at source: `write-utility-easement-county.mjs` on engine `origin/main` fetches ArcGIS REST at apply time. The card asserts the property it needs rather than checking it.

**2. Already-landed rails re-acquired.** Would fail if the card tells anyone to re-download TxGIO, NFHL, CAD, wells or footprints from a laptop or from `lib/cad-ingest`. **HOLD.** The card is explicit: "Do not re-fetch TxGIO, NFHL, or CAD from a laptop", the four rails are count-or-reimport, and the "Do not" list repeats it. This matches the 2026-08-26 ingest freeze.

**3. Missing rail vs W3 inventory.** Would fail if any rail in the W3 inventory is neither collect, atomize, parked, nor named out. **FAIL.** `grep -niE "zoning|road"` over `_inbox/2026-08-30_ctx_w3_collect_WDLL.md` returns zero matches, and the same grep over `_inbox/2026-08-30_ctx_parallel_waves.md` returns zero. The W3 inventory apply list carries Zoning stamps (F-11 plus bake, "McLennan gold unstamped is real") and Roads (P-17 CTX only, "rail atoms uneven") as named rails. Neither has a collect lane, an atomize lane, a park, or an out. Two of the eight apply-list rails have no home in the collect program. Under A-028 that is two rails that are neither a finished dataset nor a named absence.

**4. P-50 bypass.** Would fail if any path copies `tx_rrc_well` or easement landing into `place_layer_snapshots` or a PE SELECT, or if the P-50 control is not real. **HOLD.** The card forbids it in two places. More importantly the control is merged and armed: `artifacts/api-server/src/lib/wellFactRead.ts` is on LDT `origin/main`, and `artifacts/api-server/src/__tests__/brokerageNodeFacets.test.ts:485` greps the route source and asserts `not.toMatch(/wellFact\s*=\s*.*tx_rrc_well/)` plus the same for `place_layer_snapshots` and `texas-rrc`. That is a source-text check with a real failing direction. I pre-registered that this one might be a paper claim about an uncommitted worktree, since the P-50 close records "uncommitted isolated worktree". It is not; it landed.

**5. Silent zero.** Would fail if a FIPS with zero wells can emit a silent 0 and be called complete. **HOLD in text, FAIL in mechanism.** The card requires coverage-absence before stop, in three separate places. But no writer can produce it: `git grep "countyCoverage|county-coverage|coverage-absence"` over `packages/engine-core/src/well-fact` and the runner returns nothing. The well-fact writer emits only per-parcel typed absence (`wellKey: "none"`, `absenceKind: "no-well-on-or-near"`, `well-fact-atoms.ts:65`). The county-coverage absence the card requires for a zero FIPS is a build item, not an existing capability, and the card does not name it as one. The easement writer does have `countyCoverageParcelNodeId`; well-fact does not.

**6. Starved gate.** Would fail if collect-complete is a human artifact rather than something a job refuses on. **FAIL.** This is the falsifier I spent the most on, and it has three parts.

- The ledger half is real. `import_ledger` exists in `migrations/0001_init.sql:33` with both counts and both timestamps, and `landing-import.mjs` writes it and sets the run to `failed` when `sourceCount !== factoryCount`. That is a genuine two-derivation check.
- The refusal half does not exist. `_inbox/2026-08-30_ctx_w3_collect_close.json` is unreachable from any job image, per the item 7 evidence above.
- The mechanism that could do it is dormant. Factory has a real doc_repo-to-store gate: `src/control/holds.mjs` `holdsFromRoutingPin` reads `_inbox/2026-08-24_factory_routing_pin.json` (rows carry `rail`, `ready`, `defect`, `planRow`; snapshot carries `docRepoHead`), imports `holds` rows keyed `rail:<rail>`, and `refuseHeldCell` returns `{status:"refused", refuse_code:"hold:..."}`. `git grep refuseHeldCell` on Factory `origin/main` returns four hits: its own definition, `src/jobs/hold-refuse-run.mjs` (a proof job asserting one hardcoded `footprint` hold), and two test lines. No production writer consults it. The gate has a trigger and is starved of a consumer, which is the exact dormant-versus-starved pair ENFORCEMENT names. Its polarity is also wrong for this use: holds are fail-open, so a rail with no row runs.

**7. Guessed URLs treated as landed.** Would fail if the four-point probe is a note rather than a hard gate. **HOLD in text, no executor.** The card makes the probe a gate in three places: the collect-complete column ("Four-point probe ... before fetch"), the C-ease waits-on column ("four-point probe green"), and the "Do not" list ("Confirm Round Rock / Cedar Park URLs by hoping. Probe first."). Textually this is a hard gate and the falsifier does not fire. But nothing refuses a fetch that skipped the probe; the gate is a sentence. Downgraded to hold-with-caveat. See A4.

**8. Parallelism illegal.** Would fail if the card permits two writers on one landing table, two heavy scans on one Neon, or `txgio_parcel` writers above 2. **HOLD.** All three refuses are named explicitly: "Same-table writes stay one at a time", "`txgio_parcel` still 1-2", "One heavy-scan per database", "Do not run two fetches into `landing_easement_gis` at once". This matches `90_runbooks/factory_1_5_acquisition_staging.md` S3 and the slot-free posture. Correctly stated. Enforcement of the landing-table serialization is a lease question the card does not open, which is acceptable for a card that names the refuse.

**9. Schema claimed as collect.** Would fail if Factory #37 schema plus unapplied 0005 were treated as landing complete. **HOLD.** The card is unusually clear: "Schema is on Factory `seat/property-ctx-walk-alias-schema` (`migrations/0005`, parsers, no ingest)", item 3 (apply) is separate from items 4 and 5 (ingest counts), and the "Do not" list says "Treat schema as landing". The band 0 handback agrees: schema only, no ingest.

**10. Scope leak.** Would fail if the card starts F-09 217, F-10 254, Harris PBF, or clerk-index bulk ingest. **HOLD.** Named out in the "Do not" list and in `leave_behind` (P-85 clerk-index to property). No leak found.

**11. Writer wiring vs landing copy.** Would fail if the card implies the writer already reads Factory L2 without naming a retarget. **FAIL. This is the finding with the largest blast radius.** The writer's SELECT, quoted from `packages/engine-core/src/well-fact/fetch-wells-staged.ts` on engine `origin/main`:

```
  const rows = await sql`
    SELECT well_row_id, uniqid, api, gis_well_number, symnum, reliab, lng, lat
    FROM tx_rrc_well
    WHERE west_lng <= ${bbox.eastLng} ...
```

The table name is bare `tx_rrc_well`. The connection is resolved in `packages/engine-core/scripts/write-well-fact-county.mjs`:

```
const poolUrl =
  process.env.CORTEX_DATABASE_URL?.trim() ||
  process.env.TXGIO_DATABASE_URL?.trim() ||
  process.env.DATABASE_URL?.trim();
```

Per `90_runbooks/factory_1_5_acquisition_staging.md`, `CORTEX_DATABASE_URL` and `DEPLOYMENT_DATABASE_URL` are byte-identical and both name `neondb`. The writer therefore reads `neondb.tx_rrc_well`, not `landing_tx_rrc_well` on the Factory store.

The same holds for the other two. `write-building-footprint-county.mjs` joins `FROM txgio_parcel` against `STAGED_FOOTPRINT_TABLE = "tx_building_footprint"` (`src/building-footprint/staged-footprint-join.ts:37`). `write-flood-hazard-fact-county.mjs` sets `const SOURCE_URL = "tx_fema_nfhl_flood_zone"` and reads `FROM tx_fema_nfhl_flood_zone` at lines 355, 457 and 570.

The card's "Done looks like" says "Writers then emit atoms from that landing only", and the waves file says "Writers read landing, not live REST". Both are false of every writer named, and no retarget appears anywhere in the card. Consequence: as written, the Factory L2 copy of the four already-landed rails is read by nothing, so the C-count lane is ceremony that also costs a 1.4M-row jsonb copy.

**12. Setback absence vs Elgin/Bastrop.** Would fail if the five absence cities are marked absent without a probe and without a dated citation. **FAIL, and worse than predicted.** I expected "unprobed". The result is "contradicted".

Migration 0005 seeds:

```
  ('austin_city_tx', '48453', 'Austin', 'absence', NULL,
   'no public dimensional setback record found for Austin on this card; ...
```

with the same shape for Kyle, Georgetown, Round Rock and Waco.

Against `legacy-design-tools` `origin/main` `d8dfb319`, `lib/adapters/src/local/setbacks/` contains `austin-tx.json`, `kyle-tx.json`, `georgetown-tx.json` and `round-rock-tx.json`, all imported and registered in `SETBACK_TABLES` in `index.ts`, all carrying `front_ft` / `side_ft` / `rear_ft` scalars with `citation_url` and per-field `provenance`. Georgetown's rows are `verification_state: "human-verified"` at confidence 0.95 against UDC Section 6.02.030. Austin's rows cite the City LDC Section 25-2-492 public table.

The dated probe the falsifier asked for exists, and it says the opposite of the seed. `docs/property-explorer-setback-coverage-central-tx.md`, audited 2026-07-23, lists `austin-tx`, `kyle-tx`, `georgetown-tx` and `round-rock-tx` as populated with official source citations. Four of the five absence rows are false.

Waco is the one defensible row, and its basis string is still wrong in kind. `_inbox/2026-07-24_post_breadth_three_gaps_MILESTONE.md` records "Seguin/Cibolo/Waco/Killeen/Belton have SETBACK TABLE OWED (no engine adapter JSON yet)". "We have not authored an adapter" and "no public dimensional setback record exists" are different claims about different things. Writing the second when the evidence supports only the first collapses unmeasured into absent, which is the collapse ENFORCEMENT prohibits by name.

Two further consequences the card does not see. The same 2026-07-23 inventory lists populated tables for `buda-tx`, `cedar-park-tx`, `dripping-springs-tx`, `hutto-tx`, `leander-tx`, `liberty-hill-tx`, `lockhart-tx`, `pflugerville-tx`, `san-marcos-tx` and `taylor-tx`. Counted against the roster, 15 of the 69 six-county cities already have a curated dimensional table, and the 0005 seed registers 3 of them as sourced. And the LDT and engine setback sets are not the same: engine `packages/adapters/src/local/setbacks/` holds only `bastrop-city-tx`, `bastrop-development-code`, `elgin-development-code` and `san-antonio-tx` plus the two out-of-state fallbacks. That asymmetry, not source absence, is the real F-11 gap, and the card does not name it.

Score summary: hold 6 (2, 4, 8, 9, 10, and 7 with a caveat), fail 5 (1, 3, 6, 11, 12), hold-in-text-fail-in-mechanism 1 (5). Zero not-applicable.

## Open questions, answered from files

### 1. Does `factory-landing-import` already have a current two-count for `tx_rrc_well` / footprint / flood, or is C-count a required re-run?

UNMEASURED on live state, with a strong file-based prior that it has never run.

I hold no store credential and the verification clause forbids a store connection. To answer it: `SELECT table_name, source_count, factory_count, factory_counted_at, run_id FROM import_ledger ORDER BY factory_counted_at DESC` against `FACTORY_DATABASE_URL`, plus `SELECT id, scope, status, counts FROM runs WHERE scope->>'command' = 'landing-import'`.

The prior. No cloudbuild file in the Factory repo deploys a landing-import job. `git grep "landing-import" origin/main -- '*.yaml' '*.yml'` returns nothing, and `git grep "factory-landing-import" origin/main` returns nothing at all. The four cloudbuild files deploy `factory-snapshot`, `factory-conformant-migrate`, `factory-conformant`, `factory-f10-cad-loop`, `factory-restamp-access` and the publish jobs. The job's own header says "Cloud Run job only", and `runLandingImport` carries no `LAPTOP_WRITE_FROZEN` guard, unlike `conformant.mjs:656`, `reap.mjs:43` and `restamp-access.mjs:290`. The only path that has ever been able to run it is a laptop, which the 2026-08-26 freeze prohibits. Treat C-count as a required build-and-deploy, not a re-run.

### 2. Are the Round Rock and Cedar Park URLs the live T3 hosts, or guessed paths?

Guessed. Confirmed by comparing the two artifacts.

T3 recon `_inbox/2026-08-05_T3_easement_source_recon.md`, Williamson section, records them with elisions:

```
| Round Rock | `maps.roundrocktexas.gov/.../Easements/MapServer/0` | 1,254 |
| Cedar Park | `gis.cedarparktexas.gov/.../Easements/FeatureServer/0` | 8,400 |
```

`easement-gis-landing.mjs` fills both elisions with the generic `/arcgis/rest/services/` segment. Neither URL appears in T3's "Recon artifacts / evidence URLs" list, which does carry full URLs for Bastrop, Caldwell, Guadalupe, McLennan, Williamson county, Hays, Bell, RRC and PUCT. The band 0 handback already flagged this as `leave_behind`. The three other layers are real: the Bastrop 43 and McLennan 9 and 10 URLs in the module match T3's evidence list byte for byte.

### 3. Does Band 1's well-fact job exist as a Cloud Run job?

No. Zero of the five Band-1 writers have a deployable job today. This is the starved-mechanism answer, and it is larger than the question asked.

| Band 1 writer | Engine script exists | Deployable Cloud Run job |
|---|---|---|
| `well-fact` | yes, `packages/engine-core/scripts/write-well-fact-county.mjs` | no |
| `building-footprint` | yes, `scripts/write-building-footprint-county.mjs` | no |
| F-18 flood | yes, `scripts/write-flood-hazard-fact-county.mjs` | no |
| F-11 setback-rule | no dedicated county writer found on engine main | no |
| easement atoms | yes, `scripts/write-utility-easement-county.mjs` | no |

Evidence. `git grep "jobs deploy" origin/main` on hauska-engine returns exactly one line: `cloudbuild.atoms-writer.yaml:40: gcloud run jobs deploy factory-atoms-cad`. That job's entrypoint is `packages/engine-core/scripts/atoms-writer-job.mjs`, whose `childArgs` are hardcoded:

```
    "exec", "tsx", "scripts/write-cad-parcel-roll-county.mjs", "--", ...passthrough
```

with `process.env.CAD_PARCEL_ROLL_PATH = "1"` forced. There is no rail selector. `factory-atoms-cad` can run the CAD parcel roll and nothing else.

On the Factory side, `Dockerfile` copies only `package.json`, `src` and `migrations`, and `src/cli.mjs` dispatches a closed set of commands: snapshot, migrate, plan, landing-import, bexar-edges, manifest-import, access-policy-prestep, lease-v2-migrate, conformant, restamp-access, reap, bexar-cad, cc-publish, f10-cad-loop, manifest-read, staging-reset. The Factory image does not vendor the engine at all; `ENGINE_SHA` is a build-arg recorded for provenance.

So the collect program, executed perfectly, feeds a Band 1 that has no executor, and the laptop path that could run those writers is frozen. Band 1 needs a writer job image with a rail selector before any of this collect work converts to atoms. That belongs on the card, or on a named sibling card, before the operator is asked to spend a fetch.

### 4. Is 0005 meant for the Factory control store, the bake `neondb`, or both?

Factory control store only. And yes, that starves the bake path for alias.

`src/db/migrate.mjs` `applyMigrations()` calls `connectFactory(env)`, and `src/db/connect.mjs` declares `REQUIRED_ENV = ["FACTORY_DATABASE_URL"]`. `cloudbuild.conformant.yaml` deploys `factory-conformant-migrate` with `--args=migrate` and `--set-secrets` naming `FACTORY_DATABASE_URL`. There is no path by which `applyMigrations` reaches `neondb`.

For F-11 setback landing and easement GIS landing that is correct: those are Factory L2 and belong on the Factory store. For `landing_cad_txgio_alias` it is a problem the card should name. The band 0 handback's own `leave_behind` carries "bake reads alias first (LDT conformant tier 1)", and the LDT conformant bake reads `neondb`. An alias landing table that exists only on the Factory store cannot be read by the bake. Either the alias persist job writes to both stores, or the bake reads the Factory store, or the alias table is duplicated. The card says "Factory store" only and does not say which. That is a starved path, and it is the same defect shape as falsifier 11: a landing written where its reader is not.

## Amendments required before operator go

**A1. Strip the setback absence seed out of 0005 before it is applied, and re-derive every registry row against `docs/property-explorer-setback-coverage-central-tx.md` (2026-07-23) and `lib/adapters/src/local/setbacks/`.** Reason: four of the five seeded absence rows are false against a dated cited inventory on LDT main, and applying 0005 writes them. A false honest-absence is a claim, not a gap.

**A2. Say, in the card, that the four already-landed rails' writers read `neondb`, and rule what collect-complete means for them.** Two acceptable forms: either collect-complete for wells, footprint, flood and CAD is a per-FIPS count of the `neondb` table the writer actually reads, with the Factory L2 copy dropped from this card; or the card carries a named writer-retarget work item. Reason: as written, the C-count lane certifies a table no consumer reads. Recommend the first. It is cheaper, it removes a 1.4M-row jsonb copy from the critical path, and the L2 provenance copy is a real but separate F-01 item.

**A3. Replace the `_inbox/..._collect_close.json` gate with routing-pin rows, and wire the refusal.** The pin already exists (`_inbox/2026-08-24_factory_routing_pin.json`), already carries `rail`, `ready`, `defect`, `planRow` and `snapshot.docRepoHead`, and already imports to `holds` as `rail:<rail>`. Set `ready:false` on every W3 rail and flip to true only on a filed two-count. Then add the missing half: call `refuseHeldCell` in the Band 1 job entrypoint so a held rail exits non-zero. Reason: today `refuseHeldCell` is called only by a proof job, so the gate runs and does nothing, and the card's chosen artifact cannot be read by any job image at all. Both are starved-mechanism defects.

**A4. Make the four-point probe a refusal in the fetch job, not a sentence in the card.** The C-ease job should refuse a `layerKey` whose probe record is absent from the run scope, in the same shape as the existing `EASEMENT_UNKNOWN_LAYER` refusal. Reason: the Round Rock and Cedar Park URLs are demonstrably synthesised from T3 elisions, and a note has never stopped a fetch.

**A5. Give Zoning stamps and Roads a home, or name them out with a reason.** Reason: both are in the W3 inventory apply list and neither appears anywhere in the collect card or the waves file. Under A-028 a rail with no lane is neither a finished dataset nor a named absence.

**A6. Name the Band 1 executor gap as a blocking prerequisite.** No Cloud Run job can run any of the five Band 1 writers; `factory-atoms-cad` is hardwired to `write-cad-parcel-roll-county.mjs` and the laptop path is frozen. Reason: a collect program whose output cannot be atomized is not collect-then-atomize, it is collect. Either add a rail-selectable writer job to Band C, or state that Band 1 is blocked on a job image and that this card's value is provenance only until that image exists.

**A7. Fix two smaller mismatches.** (a) Item 5 says "four layer counts" and lists five; the artifact registers five `layerKey` values. Say five. (b) Item 2 requires per-FIPS counts from a job that produces table-grain counts only; either scope `landing-import` by county, or change the item to a table-grain two-count plus a separate per-FIPS source count.

## Second mechanisms considered and rejected

Per ENFORCEMENT "Reporting findings", each finding names the rival explanation and why it was rejected.

**Falsifier 11.** Rival: the engine writers might resolve `tx_rrc_well` through a `search_path` or an alias, so the same SQL could reach the Factory landing table. Rejected. `poolUrl` is resolved from `CORTEX_DATABASE_URL` before the runner does anything else; `stagedWellTableExists` probes `to_regclass('public.tx_rrc_well')` explicitly in the public schema; and the Factory landing table has a different name and a jsonb `payload` column that the writer's `SELECT well_row_id, uniqid, api, ...` could not read.

**Falsifier 12.** Rival: the LDT setback tables might be a retired path, so the seed's absence could be current truth about the engine's F-11 rail. Rejected on two grounds. They are imported and registered in `SETBACK_TABLES` on `origin/main` today and consumed by `authoritativeSetbackSource.ts`, `envelopeJurisdiction.ts` and `routes/localSetbacks.ts`. And the seed's basis string is a claim about the public record ("no public dimensional setback record found"), not about the engine, so an engine-side gap would not make it true. The honest engine-side statement is "no engine adapter authored", which is a different row.

**Open question 3.** Rival: the job might be deployed in GCP without a cloudbuild file, by a manual `gcloud run jobs deploy`. Not excluded by file evidence, and I could not check live state under this brief's verification clause. But it would not change the answer: even a manually deployed `factory-atoms-cad` runs `atoms-writer-job.mjs`, which is hardcoded to the CAD roll. A different writer would need a different image, and no Dockerfile in either repo builds one.

**Item 4 and the city roster.** Rival: the roster's `parent_county_fips` might be populated but wrong, in which case the check would be computable and misleading rather than computable and failing. Partly tested. All eight seeded cityKeys resolve to the county the 0005 seed assigns them: Bastrop and Elgin to 48021, Lockhart to 48055, Austin to 48453, Kyle to 48209, Georgetown and Round Rock to 48491, Waco to 48309. Eight for eight. The per-county city lists are also face-valid. Not fully tested: multi-county cities appear once, so Elgin's Travis span is not represented, and three duplicate city names exist statewide (Lakeside, Oak Ridge, Reno), none of them in the six.

## What I did not do

No fetch, no `--apply`, no migrate, no bake, no publish, no deploy, no job start, no store connection, no commit, no push. No edit to the collect WDLL or to any file other than this one. I did not open another seat's worktree for writing; I read `P:/seat-worktrees/property/hauska-factory-ctx-publish` read-only and recorded that it is on `seat/property-ctx-walk-alias-schema`, not main.

## Corrections to standing context

Two, both load-bearing, both flagged because a later agent will otherwise quote the stale version.

1. The `city-roster-has-no-county-link` memory is STALE. It and `_inbox/2026-08-11_L5DEPTH_launch_footprint_scope.md` record all 1,223 city rows with `parent_county_fips` null and `parent_county_name` as the literal "A" and "I". Measured today against `_catalog/texas_roster_v1.json` (file mtime 2026-08-14): 1,214 of 1,223 populated, `parent_county_name` carries real county names, and the six-county scope yields 69 cities. The roster was repaired after the L5DEPTH finding. `citiesNeeded` is now computable.

2. The brief's framing of item 4 as potentially ungradeable does not survive. It is gradeable, and it fails at 8 of 69. That is a better outcome for the operator than a hole, because it is a number.

leave_behind:
- item: L5 city-sizing and any `citiesNeeded` figure computed before 2026-08-14 against the null-linkage roster
  owner: planner
  plan_row: backlog (roster repair is landed; consumers were never re-run)
- item: engine-versus-LDT setback adapter asymmetry (LDT holds tables for 15 of the six-county cities; engine holds Bastrop, Elgin, San Antonio only). This is the real F-11 gap and it is not a sourcing gap.
  owner: property
  plan_row: F-11
- item: Band 1 writer job image with a rail selector (five writers, zero deployable jobs; `factory-atoms-cad` is hardwired to the CAD roll)
  owner: planner
  plan_row: F-01 / P-11 / P-09 / F-18
- item: `refuseHeldCell` is called only by `hold-refuse-run.mjs`; the routing-pin holds gate is starved for every production job
  owner: planner
  plan_row: F-01
- item: `landing-import` has no `LAPTOP_WRITE_FROZEN` guard and no deployed job; both are required before C-count can run under the 2026-08-26 freeze
  owner: planner
  plan_row: F-01
- item: Zoning stamps and Roads rails have no lane in the collect program or the waves file
  owner: integration
  plan_row: F-11 / P-17
- item: alias landing on the Factory store cannot be read by the LDT conformant bake on `neondb`
  owner: property
  plan_row: F-06 / F-16
