---
id: OPS-13_store_topology
title: OPS-13 store topology, which store holds which truth and how data propagates between them
date: 2026-08-09
last_updated: 2026-08-09
status: operations doc
owner: nick
related: [90_runbooks/factory_onboarding_runbook, 90_operations/OPS-12_instrument_inventory, 90_operations/OPS-7_coverage_and_honesty_doctrine, 90_operations/OPS-1_texas_source_registry, _decisions/2026-08-07_envelope_saga_close_and_geometry_law]
---

# OPS-13 store topology

The subject of this doc is the data stores: which one holds which fact, which env var reaches it, which direction data moves, and the specific ways this topology has caused production incidents. Before this doc existed the facts lived only as env-var mappings inside a runbook section and as a correction preserved inside a superseded dispatch, and the topology bit two lanes in two days.

Everything below was verified live on 2026-08-09 by direct read-only query against the production stores, not read out of another doc. The verification commands are given so the next agent can re-run them rather than trust this page. Where a number is a point-in-time count it is labelled as such, because these move hourly.

## The one thing to know first

There is ONE Neon endpoint and TWO databases on it. Reaching them takes two separate connections and no single connection pool can see both.

```
ep-lucky-truth-apodo8hr.c-7.us-east-1.aws.neon.tech
  |
  +-- database "neondb"      <- parcels, CAD, manifest, flood, ledger
  |
  +-- database "hauska_mcp"  <- atoms
```

This is the fact that surprises people. The two stores look like one because they share a host, and they are not one because they are different databases. A `pg.Pool` is constructed per connection string and a Postgres connection is bound to a single database for its lifetime, so a query joining `atoms` to `txgio_parcel` cannot be written as SQL at all. That is why `countyGeometryScoreCli.ts` opens two pools and performs the join in application code. Any future scorer that needs to relate atoms to parcels must do the same. If you find yourself writing a SQL join across those two tables, stop, because it cannot work.

**And the second rule, which belongs up here because a bulk write lane will otherwise reach it too late.** If you are WRITING in bulk rather than reading:

- Strip `-pooler` from the host. `DIRECT=$(echo "$DEPLOYMENT_DATABASE_URL" | sed 's/-pooler//')`. Print the resolved host and confirm before the first write.
- Hold concurrency on `txgio_parcel` to 1 or 2. County-disjoint keys do NOT imply index-disjointness, and 8-way deadlocked with Postgres `40P01`.

Both rules are expanded, with their evidence and their limits, in the pooler section below. Do not skip it on the assumption that stripping `-pooler` is a complete fix, because the underlying mechanism is not established.

## The env var map

| Env var | Project | Database | Holds |
|---|---|---|---|
| `DATABASE_URL` | hauska-prod-497015 | `hauska_mcp` | `atoms` |
| `CORTEX_DATABASE_URL` | hauska-prod-497015 | `neondb` | parcels, CAD, manifest, flood, ledger |
| `DEPLOYMENT_DATABASE_URL` | legacy-design-tools-prod | `neondb` | the same store as CORTEX_DATABASE_URL |
| `TXGIO_DATABASE_URL` | (engine-side name) | `neondb` | the same store again, under a third name |

**`CORTEX_DATABASE_URL` and `DEPLOYMENT_DATABASE_URL` are BYTE-IDENTICAL.** Verified 2026-08-09 by fetching both from Secret Manager and comparing: both are 124 characters and compare equal. They live in two different GCP projects under two different names and point at exactly the same database. `TXGIO_DATABASE_URL` is a third name for the same store, used engine-side. So four env var names resolve to two actual stores, and three of the four are the same store.

The practical consequence is that a doc or dispatch saying "it is on CORTEX_DATABASE_URL, not DEPLOYMENT_DATABASE_URL" is stating a distinction that does not exist. Only the `DATABASE_URL` versus everything-else split is real.

Verify with:

```
gcloud secrets versions access latest --secret=CORTEX_DATABASE_URL --project=hauska-prod-497015
gcloud secrets versions access latest --secret=DEPLOYMENT_DATABASE_URL --project=legacy-design-tools-prod
gcloud secrets versions access latest --secret=DATABASE_URL --project=hauska-prod-497015
```

Compare the first two for equality and read the path segment after the host to see which database each names.

## Table residency, verified

Queried live 2026-08-09 against `neondb`:

```
select tablename from pg_tables where schemaname='public'
  and tablename in ('txgio_parcel','cad_property','county_facet_coverage',
                    'county_manifest','county_rail','tx_fema_nfhl_flood_zone',
                    'atoms','onboarding_ledger_event');
```

Returned, in `neondb`: `cad_property`, `county_facet_coverage`, `county_manifest`, `county_rail`, `onboarding_ledger_event`, `tx_fema_nfhl_flood_zone`, `txgio_parcel`. **`atoms` did not appear.**

The same probe against `hauska_mcp` returned `atoms` and nothing else from that list. The split is therefore confirmed in both directions: the atoms store holds no parcel tables, and the parcel store holds no atoms.

Note for anyone planning a geometry query: **`neondb` default path is jsonb + bbox btree, not PostGIS-first.** As of 2026-08-11 P2.4, `postgis` **3.5.0 is installed** on deployment Neon and `tx_building_footprint.geom` carries a GiST index, but **geom is sparsely populated** (~1.1% rows at ingest close); county-scoped queries use `county_fips` btree. RRC staging tables (`tx_rrc_well`, `tx_rrc_pipeline`) remain **jsonb-only** with bbox btree (P2.3). Legacy jsonb `geometry` column plus `west_lng`/`south_lat`/`east_lng`/`north_lat` doubles remain the primary store pattern for parcels and most layers. Do not assume `ST_*` works on every table — check `pg_extension` and column types first.

## The pooler hazard, corrected

The commonly repeated version of this hazard is that a `-pooler` host opens read-only transactions. That version is **wrong as stated**, and stating it wrongly is dangerous because it teaches people to expect a deterministic failure they will not always see.

What is actually true, verified 2026-08-09:

- All three secrets currently point at the `-pooler` host.
- A write transaction against the pooler host **succeeded** in testing on 2026-08-09. `BEGIN; CREATE TEMP TABLE ...; ROLLBACK;` returned `BEGIN / CREATE TABLE / ROLLBACK`.
- Session settings on the pooler connection report `default_transaction_read_only = off`, `transaction_read_only = off`, and `pg_is_in_recovery() = f`.

So the pooler is not statically read-only. What actually happened in the incident is recorded in `_inbox/2026-08-08_L2_WAVE3_first_attempt_pooler_RO_forensic.md`: during Wave 3, Presidio county `48377` inserted 39,553 rows successfully through the pooler, and then seven sibling counties failed with `cannot execute DELETE in a read-only transaction`, code `25006`, routine `PreventCommandIfReadOnly`. One write worked, then concurrent writes did not.

**The mechanism is NOT established, and this doc will not pretend otherwise.** An earlier draft of this page asserted that the pooler intermittently routes a connection to a read-only replica under concurrency. That was a reconstruction, not a measurement, and it did not survive adversarial review.

What is actually observed, and all that is observed: on 2026-08-08 one county (Presidio 48377) inserted 39,553 rows successfully through the pooler host, and seven sibling counties then failed with `25006` at 8-way concurrency. The forensic record of this is 22 lines long, contains no replica evidence and no per-connection routing data, and the original `*_apply1.log` files were overwritten by the resume, so the ground truth is likely unrecoverable.

What was tried and failed to reproduce it: on 2026-08-09 a reviewer ran twelve CONCURRENT write transactions against the pooler host, 50 percent above the concurrency that allegedly triggered the failure. All twelve succeeded, zero read-only errors.

There is also a competing explanation that the evidence does not exclude. The resume run changed TWO variables at once, moving from the pooler host to the direct host AND serializing from 8-way to 1-2 concurrency. Its success therefore does not isolate the pooler as the cause. The `40P01` deadlock family documented below is independently confirmed to be concurrency-triggered on this exact table, and part of the observed signature may belong to it rather than to the pooler.

So the operating rule below stands on COST ASYMMETRY, not on a proven mechanism: using the direct host for a write lane costs nothing and removes one candidate cause. A test that writes once and succeeds does not prove a lane is safe, and neither does a test that writes twelve times and succeeds. If you hit `25006` on the DIRECT host, this doc has no explanation for you and you are in new territory worth documenting.

The operating rule that follows: **any bulk write lane connects to the DIRECT host, not the pooler.** Strip `-pooler` from the host segment. The resume run in the same incident did exactly that and completed. Pooled connections are correct for the serving path, which is read-heavy and connection-count-sensitive; they are not correct for ingest.

The literal edit, since this is the thing an agent has to type:

```
# what the secret gives you (pooled, correct for serving, WRONG for a bulk write lane)
postgresql://USER:PASS@ep-lucky-truth-apodo8hr-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require

# what a bulk write lane must use (direct)
postgresql://USER:PASS@ep-lucky-truth-apodo8hr.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require

# in shell
DIRECT=$(echo "$DEPLOYMENT_DATABASE_URL" | sed 's/-pooler//')
```

Before any write lane starts, print the host it resolved and confirm it has no `-pooler`. A lane that does not fingerprint its host before writing has no way to tell this failure from a permissions problem, and the observed symptom, an intermittent `25006` on some counties and not others, looks exactly like flaky credentials.

Second rule from the same incident: concurrency on a shared table is separately dangerous. The Wave 3 resume also found that 8-way concurrent writes to `txgio_parcel` deadlocked with Postgres `40P01`, because county-disjoint keys do NOT imply index-disjointness on a shared index. Bulk ingest concurrency on that table is 1 to 2 only. That is a different failure from the pooler one and the two were easy to confuse while both were live.

This also means an intermittent `25006` is not a mysterious permissions problem and must never be answered by changing credentials or grants. Check the host segment first.

## The propagation legs

Data moves in one direction. Each leg is a place where the downstream store can silently disagree with the upstream one, which is why a coverage claim must always name which leg it is measuring.

```
public source (TxGIO / CAD / FEMA)
        |  acquisition
        v
  txgio_parcel / cad_property / tx_fema_nfhl_flood_zone   (neondb)
        |  warm + promote
        v
  atoms                                                   (hauska_mcp)
        |  scoring
        v
  county_facet_coverage / county_manifest / county_rail    (neondb)
        |  serve
        v
  cortex-api -> retrieval-api -> PE / MCP
```

The scoring leg is the one that crosses databases, and it is the reason `countyGeometryScoreCli.ts` holds two pools. It reads `parcel-node` atoms from `hauska_mcp` and writes coverage rows into `neondb`.

Because the legs are separate, the three-state distinction in OPS-7 is a topological fact and not merely a doctrine. Live on 2026-08-09:

| Leg | Live measure | Verified how |
|---|---|---|
| Acquired into `txgio_parcel` | 196 counties, 14,442,123 rows (static; no ingest lane running at capture) | `select count(distinct county_fips), count(*) from txgio_parcel` |
| Promoted into `atoms` | **DO NOT QUOTE A NUMBER FROM THIS PAGE. RUN THE QUERY.** | `select count(distinct body->>'countyFips'), count(*) from atoms where entity_type='parcel-node'` |
| `cad_property` | 4,599,477 rows (static) | `select count(*) from cad_property` |

The atoms row deliberately carries no figure. During the writing and review of this doc on 2026-08-09 the promote lane was actively running and the measurement moved three times within roughly forty minutes: 79 counties / 796,046 atoms as recorded in `_STATE.md`, then 83 / 875,561, then 86 / 936,345, then 89 / 976,142. Any number printed here would have been wrong before the page was saved. This is the clearest possible demonstration of why counts belong in the spec tier behind a refreshable check and not in prose, so this doc declines to print one rather than model the failure it warns about. The same caution applies to the acquired and CAD figures the moment an ingest lane starts; they are quoted only because no lane was writing those tables at capture time.

There is a fourth tier below those three: the scoring leg, which is what the live county ledger reports. Fewer counties are scored than carry atoms, because scoring is a separate manual run. Read the current figures from the endpoint rather than from this page, `GET https://cortex-api-tds7av26va-uc.a.run.app/api/county-ledger`, whose summary carries `satisfiedCells`, `totalCells`, `totalRails` and `texasCompletenessPct`. The structural fact that does not drift is the next paragraph: the ledger's facet vocabulary is four names against **fourteen declared rails** (re-read `totalRails` from the live endpoint; do not quote a stale count from this page).

One correction to the blueprint inventory while we are here: it classified the county manifest as ABSENT. That was true of the DOC and is no longer true of the SYSTEM. `county_manifest` exists in `neondb` and holds **254** rows, one per Texas county, and `county_facet_coverage` holds **341** cells against the 3,048 the summary counts as possible. The manifest and its rail dimension are built and seeded; what is missing is the writers that would fill the cells, not the table.

The `county_rail` table in `neondb` is the authoritative rail dimension and it settles why. Queried live 2026-08-09 (`select rail_letter, display_name, has_writer, atom_family_state from county_rail order by ordinal`):

| Rail | Has writer | Atom family state |
|---|---|---|
| C Parcel geometry | yes | present |
| B CAD attributes | no | missing |
| A Zoning + setback | yes | present |
| Roads / frontage | no | present |
| D Flood / terrain | no | partial |
| Buildable envelope | yes | present |
| Land use | yes | missing |
| Building footprints | no | present |
| Utility easements | no | present |
| Owner facet | no | missing |
| RRC wells / pipelines | no | partial |
| MUD / special districts | no | missing |

**Fourteen rails** at the live ledger (2026-08-11; re-verify via endpoint `totalRails`), **four** with `has_writer = true` at the 2026-08-09 `county_rail` snapshot below. That is exactly the ledger's four-name facet vocabulary, so the manifest is not under-reporting: eight rails structurally cannot produce a satisfied cell today because nothing writes them. Any completeness percentage computed over 3,048 cells therefore has a hard ceiling near one third until writers exist, and quoting 0.2134 percent as though the remainder were merely unprocessed work misreads it. Note also that `atom_family_state` and `has_writer` disagree in both directions: roads, footprints and easements have atom families present with no writer, while land use has a writer and a missing family.

So the same program reports a different figure at every stage, and each one is true of that stage only. **The doctrine governing how to quote these lives in `90_operations/OPS-7_coverage_and_honesty_doctrine.md` and is not restated here**; this doc's job is to explain WHY the stages differ topologically, not to re-derive the honesty rule or to carry a second copy of the numbers. Where OPS-7 and this doc ever disagree on a coverage figure, both are stale and the query wins.

One durable structural point that is not a count: more counties carry atoms than have been scored into the manifest, because the scorer is a separate manual leg. Re-running `countyGeometryScoreCli.ts` therefore moves the reported completeness with no new acquisition work.

The gap between 196 and 83 is not a defect, it is the shape of the pipeline. It is also exactly why "we have 196 counties" is a true sentence that becomes a false claim the moment it is offered as product coverage. The atoms figure moved from 79 counties / 796,046 atoms as recorded in `_STATE.md` to 83 / 875,561 within a day, which is the argument for keeping counts in the spec tier where a check can refresh them, rather than in prose.

## How this topology caused the two incidents

**Incident one, the cross-database join.** A lane assumed one connection could see both `atoms` and `txgio_parcel` because the host string looked the same. It cannot. The correction survived only inside `90_operations/PHASE_C_RESUME_sf1_unblock.md`, a dispatch doc that had already been superseded, which is how the same mistake was available to be made twice.

**Incident two, the pooler read-only writes.** Covered above. Cost: seven counties failed mid-wave and the run had to be resumed against the direct host.

Both incidents share a root: the topology was knowable but not written down as a subject, so each agent re-derived it from whichever fragment it happened to read, and the fragments disagreed.

## The Harris case, and why a count could not catch it

This belongs in the topology doc because the defect is invisible at the store level to every count-based check.

Harris County `48201` holds 564,948 parcel rows and should hold roughly 1.65 million. The cause is in the acquisition leg: `lib/cad-ingest/src/txgio/cli.ts:149` uses `files.find()` to select a shapefile from the archive, and the Harris archive ships two. The 213 MB `harris_west` half was silently discarded and the 103 MB east half was ingested.

Dry run, apply, a second apply, and independent SQL all agreed at 564,948, because all four read the same truncated input. The membership file's `parcel_count_est` was 536,512, the east-only figure, so the sizing probe carried the identical bug and confirmed the wrong number. **A count cannot detect a defect it inherits.**

Verified live 2026-08-09:

```
select county_fips, count(*), min(west_lng), max(east_lng), count(distinct source_file)
  from txgio_parcel where county_fips='48201' group by county_fips;
-> 48201 | 564948 | -95.4364 | -94.9076 | 1
```

Harris stops dead at longitude -95.4364. Real Harris reaches about -95.96. The `source_file` count is 1 where the archive has two files.

Two findings from sweeping this across the whole store, both of which change what the follow-up work should be:

**Every one of the 196 loaded counties has exactly one `source_file`.** The query `select count(*) from (select county_fips from txgio_parcel group by county_fips having count(distinct source_file)>1) t` returns **0**. No county in the store was ever loaded from more than one file. So `files.find()` did not merely mis-handle Harris, it structurally could never load a multi-file archive for any county.

Critically, that store-side query is the WRONG instrument for the question, and it demonstrates the inherited-defect rule a second time: a store loaded by a single-file reader will always report one file per county whether or not the archive held more, so this query would return 0 even in a world where fifty counties were truncated. It cannot distinguish the two cases. The right instrument reads the SOURCE ARCHIVES, not the store.

That sweep has since been run at source and it closes the question. Per `_inbox/2026-08-09_MULTI_SHP_sweep_summary.md`, dated 2026-08-09, method `zip-eocd-central-directory-range`, 254 counties attempted, 253 succeeded, 1 dead, **multi-shapefile counties: 1**. Harris `48201` is the only county in Texas whose archive ships two shapefiles (`harris_east` and `harris_west`). So the blast radius of this defect is exactly one county, not the 181 unswept baseline counties feared when it was found. Harris still needs a reload; no other county does.

**Naive statistical checks would not have flagged Harris.** Ranking large counties by parcels per square degree of bounding box puts Harris at 1,622,508, mid-pack, below Tarrant at 3,438,097 and Dallas at 3,131,360 and above several others. Ranking by bounding box width puts Harris at 0.529 degrees, alongside Tarrant at 0.522 and Dallas at 0.522, both of which are genuinely that compact. Harris does not stand out on either axis. A threshold tuned to catch it would produce false positives on real compact metros.

What DOES catch it is comparing the store's extent against an **independent** statement of the county's true extent, such as the county boundary polygon already loaded as L1, or a file manifest of the source archive. This is the Geometry Law's instrument-independence principle applied to acquisition: the check must not read the same input as the thing it checks. That check does not exist today and is named as a gap in OPS-12.

## What this doc does not cover

The serve path beyond the store boundary, meaning which surface reads which endpoint and how facets resolve free versus paid, is not documented here and remains absent repo-wide. The GCS and PMTiles artifacts are not stores in this sense and are covered by `40j_hauska_map_tile_build_pipeline.md`. Per-table schema is not reproduced here, because it would go stale; query `information_schema.columns` instead. Retention, backup, and point-in-time recovery posture for either database was not established and is genuinely unknown.
