---
id: 2026-07-27_COMPLETE_BASTROP_hardening_audit
title: COMPLETE-BASTROP hardening + adversarial audit — ranked skeletons + zoning verdict
date: 2026-07-27
status: active (BLOCKS mold approval until clean or knowingly accepted)
owner: nick
planner: adversarial-audit (CTX HELD)
related: [27f_bastrop_through_v2_program, 2026-07-27_bastrop_composition_inventory, 27_MASTER_WDLL_spine_completion_and_depth_engine]
purpose: Pressure-test Bastrop before it is stamped as the approved mold for 254 counties. Every finding is a future-county skeleton too.
---

# COMPLETE-BASTROP hardening audit

Planner posture: distrust the green. Live SELECT/probe pasted. This is not feature work.

## Approval verdict

**Bastrop is NOT APPROVABLE as the national mold today.**

Commitment #1 (sell reasoning / source citation) is red on the most-used base atom: zoning-fact. The district ORIGIN is now named (see Zoning verdict), but live atoms and Tier-1 snapshots do not cite it. An approved mold that ships unprovenanced base facts stamps that hole into every county that copies the recipe.

Nothing gets approved-and-scaled until this list is clean or every remaining skeleton is knowingly-accepted with an owner and a guard.

## A. Zoning provenance verdict

### VERDICT: SOURCED (attributable) — provenance STRIPPED on the live chain

Not unattributable. Real origin exists in code + live GIS. Live atoms do not carry it. That is a commitment #1 failure on the serving path, not a missing-data mystery.

### Real source (named)

City of Bastrop ArcGIS Online Place Type zoning polygons:

- Layer: `Zoning_Place_Type` FeatureServer/0
- URL: `https://services7.arcgis.com/qOeXJdBtGknaCJC4/arcgis/rest/services/Zoning_Place_Type/FeatureServer/0`
- Code field: `PlaceTypeClass` (P-1..P-5, P-CS, P-EC, PDD)
- Registry: `legacy-design-tools/lib/cad-ingest/src/txgio/zoning-layers.ts` key `bastrop-city-tx`
- Ingest path: `zoning-cli` / `stampCountyZoning` → `txgio_parcel.zoning_district` → Tier-1 bake reads column verbatim → `place_layer_snapshots` → breadth bake `emitFromTier1Snapshot` → `zoning-fact` atom

### What it is NOT

- NOT county GIS LandUse/Zoning (dead; `bastrop-tx:zoning` adapter correctly emits `no-coverage`)
- NOT SmartCity OS as a data source (file header "re-keyed from SmartCity" is code lineage only)
- NOT the B3 PDF (descriptor cites B3 for setback RULES; district FACTS come from GIS PlaceTypeClass)

### Live evidence (pasted)

**1. Live zoning-fact cites the bake intermediate, not AGOL:**

```
SELECT atom_did, body->>'district', body->>'sourceAdapter', body->>'sourceUrl', body->>'sourceCitation', body->'provenance'
FROM atoms WHERE atom_did='did:hauska:zoning-fact:48021:33512';
```

Result (hauska_mcp @ fancy-fire-06136146, 2026-07-27):

| field | value |
|---|---|
| district | P-5 |
| sourceAdapter | cortex-tier1-snapshot-breadth-bake |
| sourceUrl | https://hauska.dev/internal/breadth-atom-bake/cortex-snapshot |
| sourceCitation | Breadth bake zoning from cortex tier1 snapshot (48021:33512) |
| provenance | null |

Tally: 62,257 Bastrop zoning-facts; 5,769 with district; 56,488 absences; **62,257 / 62,257 cite tier1 bake**; 0 empty citation string; 0 carry a real GIS citation.

**2. Tier-1 snapshot zoning object has NO provenance (0 of 5,769):**

```
SELECT payload_json->'zoning', payload_json->'provenance'
FROM place_layer_snapshots
WHERE adapter_key='node-facets:tier1' AND place_key='node:48021:33512';
```

Result:

- `zoning`: `{ "district": "P-5" }` only (no layer URL, no field, no vintage, no jurisdictionKey)
- top-level `provenance`: parcelSource=txgio, landUseSource=cad-roll, roadsPending=true — **no zoningSource**
- Aggregate: zoning_present=5769, zoning_has_prov=0, top_zoning_source=0, has_jurisdiction_key=0, tier1_total=62257

**3. txgio stamp holds the district; jurisdiction column empty for Bastrop:**

```
SELECT prop_id, zoning_district, zoning_jurisdiction FROM txgio_parcel
WHERE county_fips='48021' AND prop_id IN ('33512','34785','28286');
```

| prop_id | zoning_district | zoning_jurisdiction |
|---|---|---|
| 28286 | P-3 | null |
| 33512 | P-5 | null |
| 34785 | P-5 | null |

County tally: with_district=6213 / 74729; with_jurisdiction=**0**. District histogram matches B3 Place Types (P-3 2502, PDD 2002, P-5 627, …).

**4. Live AGOL layer still fires (2026-07-27 probe):**

- name=Place Type; geometryType=esriGeometryPolygon
- fields include PlaceTypeClass, PlaceType
- featureCount=574

**5. Envelope jurisdictionKey on Tier-1 is `bastrop_tx` (legacy key), not `bastrop-city-tx`:**

33512 envelope.jurisdictionKey=`bastrop_tx` while setback routing for P-* is supposed to resolve via `bastrop-city-tx`. Works today via code-pattern routing; scales as a silent fork.

### Fix (blocks approval until done or knowingly accepted)

1. Backfill Tier-1 snapshot `zoning.provenance` + top-level `provenance.zoningSource` with AGOL URL, codeField, cityKey, stamp vintage.
2. Re-emit / backfill zoning-fact `sourceCitation` + `sourceUrl` + `sourceAdapter` to the GIS origin (bake may remain in reasoningChain as transform step).
3. Re-run or repair `zoning_jurisdiction='bastrop-city-tx'` for stamped Bastrop rows (and any other county with zd>0 and zj=0 — see skeleton S-07).
4. M0 guard: fail bake if zoning.district present and zoning.provenance.sourceUrl empty.

### Premortem (approve-as-mold without fix)

1. Sell reasoning / source citation — **RED** (base atom cites intermediate bake URL)
2. Confidence earned — **YELLOW** (asserted 0.9 with provenance="asserted"; origin opaque)
3. Cost/jurisdiction — green on compute; red on trust if every county inherits stripped provenance
4–7 operational — yellow (focus correct; quality gate fails)

Overall **RED**. Do not approve.

---

## B. Engine health monitors — design

### Problem proven by zoning

Gates ask "does this answer pass?" Nothing asks "is every engine/source still firing?" `bastrop-tx:zoning` has been dead (`no-coverage`) while 5,769 districts quietly arrived on a different path. Discovery was archaeology, not an alert.

### What exists today (not enough)

- Retrieval `/health` + `/healthz/` — process + substrate SELECT 1 + corpus count (live 2026-07-27: status=ok, atomCount=3676048 on `hauska-retrieval-api-00037-nil`)
- Depth / geometry / front-labeling / mechanical-verify **gates** (answer quality)
- Breadth bake absence-spike monitor (mid-run only)
- No continuous per-adapter or per-engine liveness surface

### Target: Source+Engine Health Board (CC-A renderable)

Every row: `firing | degraded | dead`, lastSuccessAt, lastProbeAt, signal, alert.

**Engines (compute path):**

| id | probe |
|---|---|
| intake-parcel | live ArcGIS point query on gold parcel returns features>0 |
| intake-road | overpass OR county roadway fetch returns ways>0 for Bastrop bbox |
| boundary-primitive | SELECT count property-boundary-edge for 48021; expect >0 and stable |
| depth-warm | SELECT depth_warm_promoted count; expect non-zero + ratio band |
| rule-setback | resolve setback for gold district returns cited row |
| reasoning-chain | atom-chain for gold parcel returns zoning+setback+envelope keys |

**Sources (adapter / upstream):**

| id | probe | alert if |
|---|---|---|
| bastrop-tx:parcels | ArcGIS FeatureServer/0 query | timeout / 0 features on known-in-city point |
| bastrop-tx:zoning | expected DEAD until replaced | **silent success with 0 would be wrong**; status must be `dead-expected` or replaced |
| bastrop-tx:floodplain | FEMA MapServer/0 | timeout / error |
| zoning-agol:bastrop-city-tx | Zoning_Place_Type count + sample PlaceTypeClass | count drop >threshold OR schema field missing |
| txgio_parcel:48021 | row count + zoning_district population | sudden nulling / count cliff |
| place_layer_snapshots:tier1:48021 | tier1 count + zoning_present | cliff |
| osm-overpass | bbox way count | 504 / empty |
| county-roadway / surveyed-2016 | FeatureServer page | empty / schema drift |
| usgs-3dep | sample elev | timeout |

**Rules:**

1. Source returning zero when historical baseline >0 → ALERT (not a quiet no-coverage log).
2. Expected-dead adapters must be labeled `dead-expected` with named replacement path; unlabeled dead = alert.
3. Engine green requires its required sources firing (or honest degraded with named gap).
4. Surface on CC-A as a panel (same organism as Node&Graph — do not invent a third shell).
5. Persist probe results (table or atom family) so history is queryable.

### First ship slice (builder dispatch B1)

1. Schema + writer for `spine_health_probe` (or equivalent)
2. Cron/Cloud Scheduler: Bastrop source pack (parcels, flood, AGOL zoning, overpass, roadway)
3. Alert on zero-with-baseline
4. CC-A read-only panel (or honest empty until UI lands)
5. M0: vitest that a mocked zero-return against baseline>0 raises alert status

---

## C. Code hardening + cleanup (ranked by risk-if-scaled)

| ID | Finding | Risk if scaled | Fix |
|---|---|---|---|
| H1 | Dual-repo setback tables diverge (engine bastrop-city-tx.json 19670 B vs LDT 19258 B; different SHA256) | County #2 copies wrong table; silent setback drift | Single source of truth; CI hash-lock between repos OR publish one package |
| H2 | `@hauska-engine/atoms` still vendors parcel-terrain-model "until 1.10.0"; npm is **1.11.0**; package.json still `^1.9.0` | Contract drift; dual shapes | Bump pin; delete vendored alias; conformance test |
| H3 | `bastrop-tx.ts` header claims SmartCity re-key + "county publishes zoning"; zoning adapter dead but provider still "Bastrop County, TX GIS" | Misleading ops + false trust | Rewrite comments; rename provider on dead adapter; point to AGOL path |
| H4 | `property-atom-proof.ts` fixture `districtCode:"RS"` (Hays gold) can be mistaken for live source in archaeology | False provenance stories | Mark fixture-only; gate never served as production path |
| H5 | Envelope jurisdictionKey=`bastrop_tx` vs setback key=`bastrop-city-tx` | Routing forks per county | Stamp + bake jurisdictionKey = ZONING_LAYERS cityKey |
| H6 | Dual `@hauska/atom-contract` + `@empressaio/atom-contract` deps in atoms package.json | Brand/contract confusion at scale | Drop legacy name from live deps |

---

## D. Ranked skeleton list (severity × scales-to-254)

Severity: **S0** blocks mold approval · **S1** blocks market-ready claim · **S2** must fix before county #2–3 · **S3** known debt / knowingly accept · **S4** hygiene

| ID | Skeleton | Sev | Blocks approval? | Live evidence | Scales to 254? | M0 guard |
|---|---|---|---|---|---|---|
| S-01 | Zoning-fact provenance stripped (cites bake, not GIS) | S0 | **YES** | 62257/62257 cite tier1; AGOL is real origin | YES — recipe copies citation shape | Bake fails if district && !zoning.provenance.sourceUrl |
| S-02 | Tier-1 zoning object has empty provenance | S0 | **YES** | 0/5769 zoning_has_prov | YES | Same as S-01 at snapshot write |
| S-03 | No source/engine liveness monitoring | S0 | **YES** (as mold) | Dead county zoning adapter unnoticed while AGOL path filled facts | YES — silent zeros everywhere | Probe alert on zero-with-baseline |
| S-04 | `zoning_jurisdiction` null on Bastrop (and Caldwell/Comal/Hays/Williamson) while districts present | S1 | YES for Bastrop honesty | 48021 zd=6213 zj=0; peers also zj=0 | YES for any early stamp | Stamp gate: matched rows must write jurisdiction |
| S-05 | Dual setback JSON drift engine vs LDT | S1 | YES if mold claims one table | file sizes 19670 vs 19258 | YES | CI hash equality |
| S-06 | Dead `bastrop-tx:zoning` + misleading SmartCity/county comments | S2 | no if S-01 fixed; yes if left as "the" zoning source story | adapter throws no-coverage; comment lies | YES — copy-paste adapters | Adapter registry status enum includes dead-expected |
| S-07 | Multi-county jurisdiction stamp gap (zd>0 zj=0) | S2 | soft | 48021/48055/48091/48209/48491 | YES | County ledger column zj/zd |
| S-08 | Vendored parcel-terrain past 1.10/1.11 publish | S2 | no | atoms package vendors; npm 1.11.0 | YES | Pin >=1.10; remove vendor |
| S-09 | City roads still OSM-approx (4894) alongside auth/undef | S3 | no (honest if labeled) | osm=4894 auth=5431 undef=5920 surveyed=1307 | YES where city GIS sparse | Already provenance.kind; keep |
| S-10 | PDD / overlay honest decline (~2002 PDD stamps) | S3 | no if customer UX names it | district hist PDD=2002 | YES | Product UX (Flagged Risk A) |
| S-11 | Road-render-across-viewport still pending | S1 | market-ready item 7 | inventory OPEN | YES for customer mold | Track B reopen gate |
| S-12 | Asserted confidence 0.9 on zoning-fact with opaque origin | S1 | with S-01 | readContract asserted provenance=asserted | YES | Citation gate before confidence display |
| S-13 | Fixture RS in property-atom-proof | S4 | no | code | low | Label fixture-only |
| S-14 | Inventory vs ledger: 5769 district facts vs 6213 txgio stamps | S3 | no | 6213 vs 5769 | teaches bake lag | Ledger delta alert |
| S-15 | Retrieval URL/revision churn; stale docs cite dead revisions | S4 | no | old 00033 URL 404; live 00037-nil /health ok | ops | Probe current service URL only |

### Knowingly-accept candidates (operator call)

- S-09 OSM city approx (data-sparse ceiling) — accept with label
- S-10 PDD separate wave — accept with customer UX
- S-13 fixture RS — accept after label
- S-14 bake lag — accept with delta monitor

Everything S0–S1 must be fixed or explicitly accepted in writing before "Bastrop approved."

---

## Hardening plan (execution order)

1. **A1 — Zoning provenance backfill** (S-01, S-02, S-04, S-12). WDLL items cite live SELECT after backfill.
2. **B1 — Health probe MVP** (S-03). Bastrop source pack + alert + CC-A stub.
3. **C1 — Dual-table hash lock + contract pin bump** (S-05, S-08, H1–H2).
4. **C2 — Adapter honesty scrub** (S-06, H3).
5. **D-sweep close** — re-grade this list; only knowingly-accepted S3/S4 remain.
6. **Then** customer QA / mold stamp — not before.

Fan-out: one builder per numbered slice; planner verifies live; no builder self-grades.

## Live infra snapshot (this audit)

- Neon cortex-prod `fancy-fire-06136146`: neondb (place_layer_snapshots, txgio_parcel) + hauska_mcp (atoms)
- Retrieval: `https://hauska-retrieval-api-h7gvu7rgcq-uc.a.run.app` revision `hauska-retrieval-api-00037-nil`
- `/health` → `{"status":"ok","service":"retrieval-api",...}`
- `/healthz/` → db up, atomCount 3676048
- AGOL Zoning_Place_Type featureCount=574

## Scratch / M0

Confirmed skeletons get LESSON + OPEN in `_scratch/complete-bastrop-hardening.md`. Promotion prefers mechanical guards listed in the M0 column above.
