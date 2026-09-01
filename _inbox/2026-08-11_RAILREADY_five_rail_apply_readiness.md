---
id: 2026-08-11_RAILREADY_five_rail_apply_readiness
title: Five-rail apply readiness — source-verified at origin/main
date: 2026-08-11
status: read-only investigation complete
owner: planner
related: [_inbox/2026-08-10_A_rrc_wells_rail_close.json, _inbox/2026-08-10_C_rail_corridor_close.json, _inbox/2026-08-10_D2_special_district_build_close.json, _inbox/2026-08-10_B_footprint_ml_ingest_close.json, _inbox/2026-08-11_RAILREADY_five_rail_apply_readiness.json]
---

# Five-rail apply readiness

Read-only verification of five built-but-unapplied rails in `hauska-engine`, so applies can be sequenced by cells gained per unit of risk. No edits, no commits, no applies.

## Checkout staleness

```
$ git -C P:/hauska-engine status -sb
## sweep/fast-write...origin/main [ahead 1, behind 4]

$ git rev-parse HEAD
81344ecf72c45f8c52f684080830889abfb6f0d5
$ git rev-parse origin/main
34c94ff243a50d6b59b940c1de79001dfc14a695
$ git rev-list --count HEAD..origin/main
4

$ git log --oneline origin/main -8
34c94ff Merge pull request #304 from empressaioemail-tech/fix/verify-pk-group-a
4956b52 Merge pull request #303 from empressaioemail-tech/fix/verify-pk-group-b
46e5287 perf(writers): locate write-then-verify rows by atom_did PK, not jsonb expr
4ebae93 fix(engine-core): verify by atom_did primary key in three county writers
d5080d9 Merge pull request #301 from empressaioemail-tech/feat/special-district-fact
be1c102 Merge remote-tracking branch 'origin/main' into feat/special-district-fact
88c0b32 Merge pull request #302 from empressaioemail-tech/feat/w1-atom-write-throughput
fc5a9c4 perf(storage): multi-row property atom upsert for factory throughput
```

The local checkout is 4 behind and sitting on a feature branch. The 4 missing commits are exactly the verify-by-primary-key fixes. Reading the working tree would have produced the wrong answer on three of five rails. Everything below was read via `git show origin/main:<path>`. This is the third stale checkout found in this program.

## Registration

All five are registered. `packages/atoms/src/property-instances.ts:171`, total 14 entity types:

```
171:export const PROPERTY_ENTITY_TYPES: ReadonlyArray<PropertyEntityType> = [
172-  "parcel-node",
173-  "zoning-fact",
174-  "setback-rule",
175-  "buildable-envelope",
176-  "parcel-terrain-model",
177-  "building-footprint",
178-  "utility-easement",
179-  "flood-hazard-fact",
180-  "cad-parcel-roll",
181-  "land-use-fact",
182-  "owner-fact",
183-  "rail-corridor-fact",
184-  "well-fact",
185-  "special-district-fact",
186-];
```

Registration is not coverage. All five read green on registration alone while one can light a single county, one cannot finish a metro county, and one cannot verify its own writes.

## The five rails

| Rail | Registered | Writer path (`packages/engine-core/scripts/`) | Data source | Max counties | Limiting factor | Verify fix | Dry-run evidence |
|---|---|---|---|---|---|---|---|
| owner-fact | yes | `write-owner-fact-county.mjs` | `cad_property.owner_name` joined in app code to `txgio_parcel` (one pool, no SQL JOIN) | **15** | `cad_property` loaded for 15 of 254 counties | yes, `:383` | none of its own; store truth 4,525,073 owner rows (98.4%) |
| rail-corridor-fact | yes | `write-rail-corridor-fact-county.mjs` | NTAD NARN Lines + Grade Crossings, live ArcGIS per county bbox | **196** | `txgio_parcel` geometry (196/254); source is statewide | yes, `:308` | Bastrop 21 near / Dallas 16 near per 200 parcels, 0 errors |
| well-fact | yes | `write-well-fact-county.mjs` | `gis.hctx.net/.../TXRRC/Wells/MapServer/0`, live per county bbox | **1** | **source is a Harris County mirror, not statewide RRC** | yes, `:307` | Dallas 0 present / 693,556 absent; Bexar 0 present / 703,257 absent |
| building-footprint | yes | `write-building-footprint-county.mjs` | MS/Bing ML Global Building Footprints `Texas.geojson.zip` (394 MB, re-streamed each run) | **196** | compute, not coverage: O(footprints x parcels), no persisted table | yes, `:347` | Bastrop 188 joined / 123 parcels in 29 min; Dallas join abandoned |
| special-district-fact | yes | `write-special-district-fact-county.mjs` | `tx_special_district` table, pre-loaded from TCEQ WaterDistricts | **196** | `txgio_parcel`; districts cluster in Gulf Coast/metro | **NO — none at all** | Harris 1,523,291 in-district; Bastrop 10,932 (14.63%) |

CLI form is uniform across all five: an env gate plus `--county=NNNNN [--apply] [--batch=500] [--limit=0] [--list-counties] [--out=path]`. Env gates are `OWNER_FACT_PATH`, `RAIL_CORRIDOR_FACT_PATH`, `WELL_FACT_PATH`, `BUILDING_FOOTPRINT_PATH`, `SPECIAL_DISTRICT_FACT_PATH`, each `=1`. Extras: owner adds `--tax-year`, rail-corridor adds `--probe-only`, footprint adds `--fixture` / `--adapter-kind` / `--ml-probe-only`.

## Verify-by-primary-key

Four writers carry the fix. Verbatim from `write-owner-fact-county.mjs:374-384`:

```
        // Look rows up by the atoms PRIMARY KEY (`atom_did`), never by the
        // `body->>'atomDid'` jsonb expression: no index serves the expression, so
        // every batch seq-scanned the whole atoms table. StoragePort upserts under
        // the canonical `did:hauska:<entityType>:<entityId>` form (body.atomDid
        // stays the contract `ownfact_<hex>` token), so the canonical did is what
        // the PK holds. `a.entityId` is the exact value written to `entity_id`.
        const dids = slice.map((a) => `did:hauska:owner-fact:${a.entityId}`);
        const stored = await handle.sql`
          SELECT body FROM atoms
          WHERE atom_did IN ${handle.sql(dids)}
        `;
```

Hits for `atom_did IN`: owner `:383`, rail-corridor `:308`, well `:307`, footprint `:347`, special-district **zero**.

Special-district was missed by the sweep. Its apply path calls `verifyStoredSpecialDistrictFactAtom(atom, {...})` at `:302-307` passing the in-memory atom it just constructed, and that function (`packages/engine-core/src/special-district-fact/special-district-fact-atoms.ts:103`) only runs `SPECIAL_DISTRICT_FACT_SCHEMA.safeParse(stored)` plus field comparisons on the value handed to it. It never opens a connection. `summary.verifyFailures` on this rail cannot detect a failed write. That is worse than the old broken `body->>'atomDid'` form: the broken form was slow but real, this one is fast and fictional.

## Well-fact: the source is one county

The close artifact recorded zero present atoms on Dallas and Bexar and shipped, treating the zeros as legitimate absence. Verified live 2026-08-11:

```
$ curl ".../TXRRC/Wells/MapServer/0/query?where=1%3D1&returnCountOnly=true&f=json"
{"count":12796}

$ curl ".../query?geometry=-97.04,32.54,-96.51,33.02&...&returnCountOnly=true&f=json"   # Dallas bbox
{"count":0}

$ curl ".../query?where=1%3D1&returnExtentOnly=true&outSR=4326&f=json"
{"extent":{"xmin":-95.940204786627049,"ymin":29.506313786938289,
           "xmax":-94.899877704536664,"ymax":30.173984022480145,...}}

$ curl ".../query?geometry=-95.96,29.49,-94.90,30.18&...&returnCountOnly=true&f=json"   # Harris bbox
{"count":12796}
```

All 12,796 features sit inside Harris. Layer projection is wkid 2278 (NAD83 Texas South Central FIPS 4204), a Harris-region grid. The engine already says so at `packages/engine-core/src/well-fact/fetch-wells.ts:2`:

```
 * Fetch Texas RRC surface wells for a county bbox from the Harris County mirror layer.
```

Texas has on the order of a million RRC wells. 12,796 is the Harris subset. The `statewideCount` field name in the close artifact is itself misleading — it is a layer total, not statewide coverage.

Consequence: applying this rail outside Harris writes machine-verified assertions of "no well on or near" onto parcels that may well have wells. That is a correctness hazard, not a wasted run. The rail is well-built — verify fix present, 500 ft radius reasoning sound — and only its source is wrong.

## Special-district: loaded, but not what the framing says

`tx_special_district` is populated. The writer throws `tx_special_district missing — run migration + ingest first` at `:140` when absent, and both dry-runs read real district rows and completed, which is proof of load. 2,775 polygons with `county_fips` on all 2,775, spanning all 17 TCEQ TYPE values: MUD 1888, WCID 250, MMD 197, FWSD 84, SUD 82, OTH 74, DD 45, LID 35, WID 33, ID 29, RA 29, ND 23, RD 2, SWCD 1, GCD 1, MD 1, NYD 1. Live TCEQ returns 2,796 today; the ~21 delta is rows whose FIPS could not be derived. The county writer does not re-fetch TCEQ — ingest is a separate one-time step already run.

Two corrections to the framing in the task. The "~2,439 tax-relevant polygons" figure matches nothing measured. And `rateEnrichedCount` is 0 on both dry-run counties — the Comptroller SPDPID join by `{countyFips}|{comptrollerEntityType}|{districtName}` matched zero TCEQ names, so **no loaded polygon carries a tax rate**. "Tax-relevant" should stay out of external framing until name reconciliation lands.

CP2 also refuted its own CP1 band on Harris: predicted 12-32% membership, measured 95.09%, traced to large regional water-authority polygons blanketing the county (independent random-20k probe 99.97% any-type, MUD-only ~25.2%). Bastrop 14.63% confirmed in band. PIP sanity checks pass.

## Recommended apply order

**1. owner-fact — approximately 4.5M present cells, lowest risk.**
Data is already in the store. A two-table read on one pool: no external API, no streaming, no rate limit, no vintage risk. 4,525,073 rows carry `owner_name` at 98.4% fill, so nearly every planned atom is present rather than absence. Carries the verify fix. It is also the only one of the five that closes a named launch-gate hole — OPS-15 established OWN reads `NO ATOM` on the County Manifest while the data sat unserved in `cad_property`. Two conditions: it has no dry-run artifact of its own, so begin with `--limit` on one county; and it is public-paid with an explicit leak guard at `:342` ("Owner identity must never rest on the free tier"), so confirm the gate honors `accessPolicy` before exposing.

**2. special-district-fact — approximately 1.5M present cells, but fix the verify first.**
Fully local data path, DB-to-DB, the fastest apply shape after owner. Demonstrated 1,523,291 in-district rows on Harris plus 10,932 on Bastrop, extending across all 196 parcel counties. Ranked below owner despite comparable volume for two reasons. It is the only rail of the five whose writes cannot be audited — port the `atom_did IN` block from any of the four sibling writers before applying, a small mechanical change against four working templates. And Harris emits ~4.1 memberships per in-district parcel, so 6.3M planned atoms on one county is a bulk-slot event needing the throughput work (`fc5a9c4`) and a batch plan.

**3. rail-corridor-fact — sparse but the best-demonstrated rail.**
The only one of the five with non-zero present yield proven on two different counties. Verify fix present, source is a live federal layer at 16,522 TX segments (confirmed by independent probe), licence is unrestricted US government work. Third purely on volume: rail proximity is intrinsically sparse at roughly 8-10% of sampled parcels inside the 152.4 m buffer. Per-county apply needs a live ArcGIS fetch, adding ~12-20 s per 200 parcels — statewide is long but tractable. Honest gap: `NET=T` rail-trail is zero statewide, so that sub-class will never populate from this source.

**4. building-footprint — defer the apply, dispatch an ingest-table change.**
Real data, real yield (123 of 200 Bastrop parcels had a footprint, ~61%), live statewide source (HTTP 200, 394,135,084 bytes). But the compute cost per cell is prohibitive: 1,762,884 ms (~29 min) to scan 10,678,921 features and join 200 parcels, and Dallas was abandoned as "O(footprints x parcels) prohibitive on 726k parcels". Every county re-streams the same zip with no persisted table and no spatial index. The dry-run "PASS" measured correctness, not feasibility. The fix pattern already exists one rail over: persist Texas footprints to a table with a GiST index exactly as `tx_special_district` does, and the cost collapses. Also note `sourceTier: ml-derived` — do not present these as surveyed.

**5. well-fact — DO NOT APPLY. Zero cells gained.**
Zero present cells in 253 of 254 counties. Applying as-is writes ~1.4M absence atoms across two counties asserting "no well on or near" as a machine-verified finding when the truth is "this source has no coverage here". Fix is a source swap to a genuinely statewide RRC feed, then re-dry-run. Optionally apply to Harris (48201) alone, where the source is authoritative. Until then the rail is code-done and customer-useless — the exact shape the CODE-DONE != CUSTOMER-DONE standing decision names.

## Adversarial findings

The well-fact source is single-county and no close artifact says so. The zeros were recorded and shipped as legitimate absences.

Special-district has no read-back verification at all and was silently missed by the PK-fix sweep — and it is simultaneously the largest-volume apply of the five.

The "~2,439 tax-relevant polygons" figure is wrong in both directions: 2,775 loaded across all 17 types, 2,796 live, and zero carrying a tax rate.

Building-footprint is not apply-ready despite a passing dry-run; a green regression line is masking an algorithm that cannot reach statewide.

The engine checkout is 4 behind on a feature branch, and the missing commits are precisely the verify fixes. Third stale checkout in this program.

`P:/hauska-engine/.env` is corrupted — 165 bytes, no trailing newline, `...?sslmode=require` running directly into `empressaioemail@cloudshell` (a pasted Cloud Shell prompt fragment). Reading it verbatim yields "Client network socket disconnected before secure TLS connection was established", which reads as a network fault rather than a malformed URL.

No factory-pool credential was available to this investigation. `.env` holds only `LEGACY_DATABASE_URL`, which resolves to the cortex/legacy pool (`atom_events`, `code_atoms`, `parcel_briefings`, `code_atom_sources`, `code_atom_fetch_queue`) — not the pool holding `txgio_parcel` / `cad_property` / `tx_special_district`. Neither `CORTEX_DATABASE_URL` nor `DEPLOYMENT_DATABASE_URL` nor `TXGIO_DATABASE_URL` is present in any checkout, and both ldt repos carry only `.env.example`. So the 15-county CAD figure, the 196-county parcel figure, and the 2,775 district rows are sourced from `_STATE.md` live-SELECT records and the D2 close artifact, **not re-verified against the live pool by this investigation**. Every coverage number here inherits that caveat.

Four of five rails have never had `--apply` run; every close says "apply NOT RUN — atoms bulk slot held". Owner-fact additionally has no dry-run artifact of its own anywhere in `_inbox`.
