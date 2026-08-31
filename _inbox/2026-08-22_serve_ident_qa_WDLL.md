---
id: 2026-08-22_serve_ident_qa_WDLL
title: Near-term SERVE + IDENT + Manifest — visual QA card
status: approved
date: 2026-08-22
plan_row: P-49 through P-55 / P-47
operator_approval: 2026-08-22 morning verbal. Grade this card as we proceed. COVER roads parked.
related:
  - _decisions/2026-08-22_serve_ident_then_background_cover.md
  - 90_operations/OPS-18c_parallel_execution.md
  - _inbox/2026-08-21_ops18_all_board_WDLL.md
  - _inbox/2026-08-21_s2-family-scout_close.json
  - _inbox/2026-08-21_s5-bind-scout_close.json
  - _inbox/2026-08-21_r07_store_grade.md
---

# WDLL: SERVE, IDENT, honest Manifest, then visual QA

Date: 2026-08-22  Status: approved
Operator approval: 2026-08-22 morning

## Done looks like

SmartSite gold inspect and map show the HOLD families that already have atoms, in the order below, each proven live before the next family starts. Command Center Manifest is live and honest (unspecified rails stay `not-yet`). IDENT 356 is merged so new writes stay integer-keyed. COVER fill including roads remainder stays parked until this card's visual QA.

This is the near-term grade card. The program card (`_inbox/2026-08-21_ops18_all_board_WDLL.md`) remains. Items 2 through 7 there are graded from this card's live probes.

Two serve shapes. Do not copy the special-district parcel-key picker onto pipelines.

- Parcel-keyed inspect: special-district, flood, land-use, zoning, owner.
- Spatial overlay: pipelines, wells, footprints, rail, road-node. Inspect cites the atom when a nearby hit exists.

## Already met (do not reopen)

- S1 special-district live. Gold `48021:34137` absent `:sd:outside`. `48021:102817` The Colony MUD 1C. Evidence `_inbox/2026-08-21_p48_serve_pe_execute.json`.
- Flood and land-use inspect live on gold.
- Zoning, setbacks, envelope, road-node overlay already atom-served on integer grammar.
- P-17 roads remainder parked. Pickup `_inbox/2026-08-22_p17_roads_park_pickup.md`.

## Acceptance items

1. P-49 scout named before code. A live parcel with a store hit on `rrc-pipeline-fact` (point SELECT or writer-derived near query). Bind rule quoted from `write-rrc-pipeline-fact-county.mjs`, not guessed. Q8 pipeline bind is UNMEASURED; do not invent a percent. Check: CP1 quotes parcel, `entity_id`, SQL. | grade: [x]
2. P-49 cortex. Root field `pipelineFact` (or the name CP1 freezes) on serving cortex-api, `source=rrc-pipeline-fact`. Never bake / snapshots / GIS as that field. Dual grammar: integer present or honest miss; padded miss is named. Check: live GET by field name after planner canary (never `image_tag=latest`). | grade: [x]
3. P-49 PE. Inspect and/or map cites `rrc-pipeline-fact` on the scout parcel. `texas-rrc` stays `live:false` unless inspect is already wired and the overlay fetch is the atom, not empty GIS. Check: live smartsite.cloud after planner `vercel --prod` on `property-explorer`. | grade: [x]
4. P-50 wells. Same pattern as P-49. Separate inspect/overlay from pipelines. Do not share one `texas-rrc` key. SERVE reads stored `well-fact`. P-10 blocks new apply, not this read. Check: live gold or named substitute cites `well-fact`. | grade: [x]
5. P-51 footprints. Map or inspect cites `building-footprint`. Read the body. Do not parse `:primary` as identity. Check: live probe. | grade: [x]
6. P-53 edges. Inspect or map cites `property-boundary-edge` on a Bastrop gold ring, not the GIS parcel outline presented as the atom. Check: live probe. | grade: [x]
7. P-54 owner. Identified session shows `owner-fact` or an honest miss that names the atom. Anonymous inspect has no owner body. Fail if anonymous sees owner. Fail if identified is CAD-roll bake presented as the atom. Check: paired anonymous vs identified live probes. | grade: [x]
8. P-52 rail parked until scout. One known-good county vs one A-010 rogue-present county. If ~99 percent present repeats, do not serve. Check: scout close filed; no rail PE until that close says GO. | grade: [ ]
9. IDENT engine 356 typecheck green and merged. New writes: integer grammar, no `:outside` or `:primary` in new `entity_id`, `externalKeys` fed, `applies-to` written. No 100M backfill. SERVE keeps working on today's keys. Check: CI conclusion `success` and merge SHA. | grade: [x]
10. P-47 / DC-3 instrument. Manifest live. Rails with a checked-in spec scored. Unspecified rails stay `not-yet` on a dated GET by field name. No invented roads coverage row. Check: GET field names. | grade: [x]
11. Next family starts only after the previous family's live probe. One PE prod deploy at a time. Project stays `property-explorer` / `prj_vcZGXbqdffk5C20WzaplEpzFynK3`. | grade: [x]

## Operator stamps

COVER `--apply` parked. Roads remainder resumes only from the pickup after visual QA.

Do not flip `texas-rrc` or `mud-pid` to `live:true` as a substitute for an atom read.

Do not estimate Q8 bind rates for pipelines, wells, footprints, rail, edges, or owner. Those binds are UNMEASURED.

A-017 Harris PBF stays NO. A2 absence stays HELD.

## Amendments

- 2026-08-22: opened as the near-term grade card after the COVER park.
- 2026-08-22: parked discussion at end: more information from sources we already hold. Not an acceptance item. Do not compile. Discuss before this card's visual QA closes.

## Parked discussion (not an acceptance item)

After items 1 through 11, talk before closing this card: **more information from sources we already hold.** Not a new ingest. Not COVER `--apply`. Not a twelfth grade. Do not compile a row from this section.

The likely split, to discuss then:

- Depth on families this card already lights. Pipeline body already has operator, system, commodity, distance, permit. Wells and footprints will have the same shape. Inspect today can be a present/absent chip when the atom has a paragraph.
- Fields we store and still hide on families that already serve (CAD value / sqft / year where the roll has them; flood zone text; district type on gold). A-017 already said Dallas sqft/year is not a launch blocker. That is a show-what-you-have question, not a CAMA factory.
- Provenance on the card (source adapter, vintage, evaluatedAt). That is sell-reasoning, not more data.

Do not start this until visual QA on the wired families. Then pick one of the three. Mixing them is how a depth pass becomes another ingest.

## Finish card (graded at close)

1. met: CP1 names gold `48021:34137` store hit `nearPipeline=false` and substitute `48021:10048` `t4permit=05781`. Bind SQL is writer-derived ANY parcel keys. Q8 UNMEASURED. Review `_inbox/2026-08-22_serve-p49_planner_review.json`.
2. met: planner re-GET 2026-08-22T14:05Z serving `https://cortex-api-tds7av26va-uc.a.run.app`. Gold `pipelineFact.state=present` `source=rrc-pipeline-fact` `entityId=48021:34137` `nearPipeline=false` `t4permit` null, no ENERGY TRANSFER. Nearby `48021:10048` HTTP 200 `nearPipeline=true` `t4permit=05781` `operatorName=ENERGY TRANSFER COMPANY` `nearestPipelineDistanceMeters=87.9`. Padded gold `48021:34137.00000000` HTTP 404 (bake miss, named; not a silent pipeline miss). Bind `tried` lists both grammars. Serving `cortex-api-00535-niq` @100% image `ae6bdea9464bd7815a532961d39fb134f3b44336` never `latest`. Evidence `_inbox/2026-08-22_p49_cortex_execute.json`.
3. met: planner re-GET 2026-08-22T14:21Z `https://smartsite.cloud/api/spine/property-atoms/48021%3A34137/facets` HTTP 200 `X-Pe-Read-Path=atom-chain-warm` `pipelineFact.state=present` `source=rrc-pipeline-fact` `nearPipeline=false` `t4permit` null, no ENERGY TRANSFER. Nearby `48021:10048` HTTP 200 `X-Pe-Read-Path=atom-chain` `nearPipeline=true` `t4permit=05781` `operatorName=ENERGY TRANSFER COMPANY`. Deploy `dpl_ECnkQUYkeX57KG5pwCs6CN6RTW9J` project `property-explorer` / `prj_vcZGXbqdffk5C20WzaplEpzFynK3`. hauska-map PR 178 squash `ec6a62cb6e2b577f7f934e9e40eb63be88c3b01f`. `texas-rrc` GIS stays `live:false`. Evidence `_inbox/2026-08-22_p49_pe_execute.json`.
4. met: planner re-GET 2026-08-22T15:16Z `https://smartsite.cloud/api/spine/property-atoms/48021%3A34137/facets` HTTP 200 `X-Pe-Read-Path=atom-chain-warm` `wellFact.state=refused` `code=atom-miss` `source=well-fact`. No `apiNumber14`, no `:none`, no invented well. `pipelineFact` still present-outside. Deploy `dpl_6UMscF3ZuAYgduAQcXeijKUAuDBs` project `property-explorer`. hauska-map PR 179 squash `c338a1e5c366a68905f0a3edb9ef4d2ae90047ca`. Cortex `cortex-api-00537-ler` @100% image `cdd405ab`. Crane `48103:100` stays a bake hole, not a well miss. `texas-rrc` stays `live:false`. Evidence `_inbox/2026-08-22_p50_pe_execute.json`.
5. met: planner re-GET 2026-08-22T16:12Z `https://smartsite.cloud/api/spine/property-atoms/48021%3A34137/facets` HTTP 200 `X-Pe-Read-Path=atom-chain-warm` `buildingFootprintFact.state=refused` `code=atom-miss` `source=building-footprint`. No `structureRole`, no invented `:primary`. Deploy `dpl_57eRvV7Eg4wEAU6ELdGhz2QiY7NY`. hauska-map PR 180 squash `f756b33`. Anderson stays bake hole. Evidence `_inbox/2026-08-22_p51_pe_execute.json`.
6. met: planner re-GET 2026-08-22T16:59Z `https://smartsite.cloud/api/spine/property-atoms/48021%3A34137/facets` HTTP 200 `X-Pe-Read-Path=atom-chain-warm` `boundaryEdgeFact.state=present` `source=property-boundary-edge` `entityId=48021:34137:boundary:2` `role=front` four edges (rear / side / front / side_corner). No `txgio_parcel`. `pipelineFact` present-outside. `wellFact` atom-miss. `buildingFootprintFact` atom-miss. Deploy `dpl_8nakmD5VUpwrnnTUmsSNvGV8yv4q` project `property-explorer` / `prj_vcZGXbqdffk5C20WzaplEpzFynK3`. hauska-map PR 181 squash `3f7a048aa4f2850adc3dbba86b41e30cc67f382b`. `texas-rrc` stays `live:false`. Evidence `_inbox/2026-08-22_p53_pe_execute.json`.
7. met: operator identified probe 2026-08-22 on smartsite.cloud gold. Inspect Owner `2025`. API `ownerFact.state=present` `source=owner-fact` `entityId=48021:34137:2025` when logged in. Anonymous half already met. Evidence operator screenshot + facets GET.
8. pending (P-52 parked)
9. met: PR 356 merged `29ab77c744a3efc21a59dcb6af06ca6ae9e43e28` 2026-08-22T19:01:58Z. CI conclusion `success` on typecheck fix `57c95e7`. Zero `--apply`. C5 unfed. Evidence `_inbox/2026-08-22_p55_ident_execute.json`.
10. met: planner live GET 2026-08-22T19:01:57Z `scripts/p47-manifest-instrument.mjs --live` pass. roads 254/254 not-yet null pct. Harris 48201 not-yet. Unspecified rails zero satisfied-present. geometry/flood/mud satisfied-*. Evidence `_inbox/2026-08-22_p47-manifest_close.json`.
11. met: P-49 through P-54 each had live probe before the next family started. One PE deploy at a time on `property-explorer`.
