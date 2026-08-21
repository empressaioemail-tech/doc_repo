# scratch: customer-ui-track-b

Working memory for Track B (customer-UI quality ? make Bastrop sellable). Tier 2 ? cheap, lossy, planner-gated promotion. Independent of depth-engine write-path; Bastrop depth is the base (CTX HELD).

## LESSON (seeded from depth scratch ? start warm)

- LESSON: site-plan STREET layer historically `honestAbsence: true` because composer looked for a road-anchor atom that did not exist ? road-nodes NOW exist (`{fips}:road:{id}`); render must consume road-nodes, not invent a second road model.
- LESSON (R1): v1 ROW = centerline + assumed-per-class width; provenance `approximate-assumed-per-class` ? edges drawn from that MUST carry the same provenance mark on PDF/CAD/map.
- LESSON (FIX1 / FIX1.1): site-plan offset must share depth-warm `insetPerEdge` + WGS84 frame; ring parity on 34785 area=13641. Vocab "setback-consumes-lot" vs map "pending" was a path-divergence symptom ? surfaces must read ONE derived state.
- LESSON (F1a): backend-healthy ? app-correct. Customer QA = live PE / live PDF, not atom SELECT alone.
- LESSON: property-line bearing+distance from GIS ring is GIS-approximate ? honesty line required; survey-grade = FAIL.
- DEAD-END: broadening ldt api-server esbuild conditions beyond ["workspace"] boot-crashes.
- DEAD-END: fabricating STREET geometry when no road-node attaches ? use honest absence with reason.

## GROUND-TRUTH (seed)

- GROUND-TRUTH (2026-07-27 S2-F): Bastrop road_nodes=17552; depth_warm 99.59% place-type held. Road DATA exists; RENDER does not.
- GROUND-TRUTH (2026-07-26 FIX1.1): 48021:34785 depth-warm + site-plan WGS84 both area=13641.
- GROUND-TRUTH (program status 2026-07-27): "Road centerline+edge RENDER (site plan/map) = NOT DONE"; site-plan design pass = NOT DONE; customer QA near-zero.
- GROUND-TRUTH (site-plan STATUS Wave 1): STREET layer always declared; empty when honest-absence (pre-road-node era reason still in samples README).

## GROUND-TRUTH (planner BEFORE 2026-07-27T12:50Z)

- GROUND-TRUTH: PE facets gold quartet all `atom-chain-warm` + envelope ok + depthWarmPromoted; engine-api health ok @ startedAt 2026-07-26T19:18:55Z.
- GROUND-TRUTH (customer card 34785): Zoning P-5; Setbacks F 15? + S/R not_specified build-to-line; Buildable line = **build-to-line ? buildable % pending** despite warm envelope geojson present. Kickoff `_inbox/2026-07-27_TRACK_B_planner_kickoff_checkin.md`.
- GROUND-TRUTH (map 34785): basemap street labels only; no road-node centerline/ROW overlay. B1 gap confirmed live.
- GROUND-TRUTH: anon GET pe-site-plan-export ? 405 (auth/POST path); PDF craft verify waits on B2 deploy.

## LESSON (B3 BEFORE)

- LESSON: warm envelope without `buildableAreaPct` still renders "buildable % pending" on PE card ? B3 must map envelope-ok + area-or-geojson to a shared non-pending vocabulary (or compute pct once), not leave surfaces free to invent pending.
- LESSON (B3 PR review): `hasGeometry: env?.geojson != null` into `mapBuildableDisplay` covers the 34785 BEFORE class; dual-repo mapper copies are a drift risk ? M0 promote candidate = shared package or CI parity check after live MET.
- GROUND-TRUTH (2026-07-27T13:05Z): B3 PRs open CI green ? map #71 `c92d72ae`, engine #141 `04555f67`. HOLD merge pending live trio. Adversarial `_inbox/2026-07-27_TRACK_B3_planner_adversarial_hold.md`.
- GROUND-TRUTH (2026-07-27T13:10Z): B1 PRs open CI green ? engine #143 `3c1d0a35`, map #72 `8c93f075`. HOLD; deploy engine attaching-roads before map. Adversarial `_inbox/2026-07-27_TRACK_B1_planner_adversarial_hold.md`.
- LESSON (B1 review): PE overlay defaults missing provenance to `"unknown"` while engine STREET mapper returns null without provenance ? watch for soft fabrication on map path; prefer fail-closed like engine.
- GROUND-TRUTH (2026-07-27T13:15Z): B2 PR #142 `044d552b` CI green. Gold PDF opened ? GIS tags + honesty MET on sample; fixture R-1/15-5-15/10504 ? live P-5/~13641. Adversarial `_inbox/2026-07-27_TRACK_B2_planner_adversarial_hold.md`.
- OPEN: all builders closed; live AFTER + merge sequencing ? rollup `_inbox/2026-07-27_TRACK_B_builders_closed_rollup.md`.

## B3 CLOSE (BUILDER-B3 2026-07-27)

```
LESSON (B3): one mapBuildableDisplay mapper ? kinds pending|provisional|buildable-with-area|declined-consume|not_specified (+absent/loading). Map card + inspect + PDF SUMMARY must call it; never re-derive consume/pending per surface.
LESSON (B3): buildableAreaPct omitted ? pending when buildableAreaSqFt OR warm geojson present ? drawableOrAreaPresent ? buildable-with-area (no invented %; label "buildable envelope on file" / sqft / %).
LESSON (B3): warm envelope area preferred over local offsetDegenerate setback-consumes-lot for customer SUMMARY copy (geometry draw path still FIX1).
DEAD-END: papering over disagreement with softer copy while fields still diverge ? guard is violatesHistoricalDisagreementGuard unit test.
GROUND-TRUTH (2026-07-27T13:00Z local): unit tests green ? PE buildable-display-vocab (9) + baked-facets (10); engine vocab (9) + site-model (10) + pdf/render (4). Live agreement NOT claimed.
OPEN: planner live verify trio 48021:34785, 48021:47728, 48021:47595 on map card Buildable + inspect + PDF SUMMARY (agreementToken / kind must match; no pending-vs-consumes split).
LESSON (B3 M0 2026-07-27): dual-copy mapBuildableDisplay is guarded by vitest parity ? local source must stay LF-normalized byte-identical to __fixtures__/buildable-display-vocab.peer.fixture AND sha256 must match parity.lock.json (same digest in map+engine). Drift ? CI red. Sync = update both sources + both fixtures + both locks to the same bytes/hash. Not a shared package yet; identical-copy assertion is the M0 gate.
GROUND-TRUTH (2026-07-27 M0 push): map #71 HEAD `57c2b11e` / engine #141 HEAD `111c3b2a` ? parity tests added; CI green; merge still HOLD for live trio.
```

## OPEN

- OPEN: none for Track B (CLOSED 2026-07-27T14:08Z). CTX HELD.

## Unit board

| Unit | Status | PR(s) | Planner verify |
|---|---|---|---|
| B1 road render | **MET** | engine #146 / map #76 | Live PDF + live PE overlay |
| B2 design pass | **MET** | engine #146 | Live 34785 PDF (not fixture) |
| B3 vocab reconcile | **MET** | map #76 + #77 / engine #146 | Card ~13641 matches PDF |

## SEQUENCER (2026-07-27) ? engine Track B land stack
- GROUND-TRUTH: Engine land order #141 ? #142 ? #143 stacked; bases retargeted so #142 base=feat/b3-buildable-display-vocab, #143 base=feat/track-b2-site-plan-design-pass. SHAs: B3 `111c3b2`, B2 `4f992e0`, B1 `461542e`. CI green on all three; mergeable=MERGEABLE. NOT merged (planner). NOT deployed. NO live QA claimed.
- GROUND-TRUTH: M0 identical-copy guard IS on tip (`111c3b2` test(site-plan): M0 mechanical guard? + fixtures/parity.test) and is ancestor of B2/B1 tips.
- LESSON: PDF render.test decodeAllContentStreams non-greedy stream?endstream truncates when Flate payload contains ASCII `endstream`; Length-aware decode required after B1 provenance text change. Fixed on B1 tip `461542e`.
- LESSON (reconfirmed): use worktrees ? main checkout held B1; B2/B3 had dedicated WTs.
- OPEN: Planner merge cmds below; after #141 merges, retarget #142 base?main (or GitHub auto); after #142, retarget #143?main. Map land #71 B3 then #72 B1 (72 touches proxy-allowlist; rebase #72 onto #71 if conflict).

## LIVE-AFTER (planner 2026-07-27T13:40Z)

- GROUND-TRUTH: engine-api `00090-juq` @ 100% tag track-b; retrieval `00035-git` @ 100%; merge engine #146 / map #76.
- GROUND-TRUTH: live PDF 34785 ? P-5, buildable 13641, STREET Wilson Street approximate-assumed-per-class, streetHonestAbsence=false. Samples `_inbox/2026-07-27_track_b_live_after/`.
- GROUND-TRUTH: live PDF 33512 ? Spring Street + road node, buildable 23507.
- LESSON (M0 **promoted**): dual-repo vocab parity.test + peer.fixture + sha256 lock both repos.
- LESSON: Helvetica drops U+2014 in PDF ? ASCII hyphens for drawn honesty strings.
- Grades: `_inbox/2026-07-27_TRACK_B_live_after_grades.md`

## CLOSE (planner 2026-07-27T14:08Z) ? Track B CLOSED

- LESSON (PE deploy): fresh worktree needs `NODE_OPTIONS=--use-system-ca` + `vercel link --project property-explorer --scope empressaioemail-techs-projects --yes` then `vercel deploy --prod --yes`. Do not escalate deploy to operator.
- LESSON (attaching-roads 403): root was **stale browse allowlist** (pre-#76 rejected POST), not missing key. Key present ? atom-chain 200; missing key shape is 503. Workflow did not wipe Production env.
- LESSON (B3 residual): silent build-to-line axes correctly suppress false **pct** but must not strip warm **areaSqFt**. Fixed map #77 ? live card `~13,641 sq ft (provisional)` matches PDF.
- GROUND-TRUTH (2026-07-27T14:08Z): PE `property-explorer-xi` serving #77 (`dpl_31gD99h?`). Card 34785 Buildable `~13,641 sq ft (provisional)`; attaching-roads 200; road centerline+ROW visible on map. Trio areas 13641/23507/9248/24644.
- GROUND-TRUTH: Track B WDLL 1?7 all **MET**. Negative done-line CLEARED. CTX HELD.
- OPEN: none for Track B.

## B1-map REOPEN + CLOSE (2026-07-27T14:35Z)

- REOPENED: one attaching road ? viewport road NETWORK.
- ROOT: PE inspect-only `POST attaching-roads`; StoragePort `listRoadAtomsNearBbox` HTTP-stranded. NOT coverage (viewport Neon = 1078 roads).
- FIX: engine #147 `GET /road-nodes/near-bbox` ? retrieval `00037-nil` @100% tag b1map; map #78 viewport fetch ? PE redeployed.
- GROUND-TRUTH: PE near-bbox 200 count=400; Spring/Chestnut/Main/Pecan/Water/Jefferson/Pine/Wilson present; live map shows network (hydrology off).
- LESSON: attaching-roads = parcel frontage for site-plan; map layer needs bbox serve (same stranded-data class as CC-A boundary-edges).
- Grade B1-map **MET** (regraded). CTX HELD.

## SITE-PLAN REGRESSION (2026-07-27) — B1 streets blew PDF extent

- GROUND-TRUTH (live 33890 BEFORE): parcel+envelope collapsed to bottom cluster; road 15094293 floating upper-right; overlapping labels. B2 graded MET on 34785 only.
- ROOT (code): `computeDrawingTransform` pushed full street centerline+ROW into fit points — long OSM ways / outliers expand bbox → parcel scales to a dot. Contours already clipped; streets did not.
- ROOT (data): attaching `48021:road:15094293` on 33890 is ~1.6 km N/E of parcel (centroid ~−97.3134/30.1247 vs parcel ~−97.3183/30.1109). Flag for audit planner (bad attach / geometry). Chestnut `50642361` is near-lat but multi-block E–W — also expands fit without clip.
- FIX: engine #149 + #152 — fit on parcel+setback+margin only; streets clipped to local parcel+ROW buffer `max(0.5*span, 40m)`; blank street-name labels skipped. (Tight 15% / page-only clip erased frontage — corrected in #152.)
- GROUND-TRUTH (2026-07-27T15:20Z AFTER): engine-api `00093-gej` @ 100% tag `siteplan-frame` (image `siteplan-frame-05bce18e75aa`). Live PDFs `_inbox/2026-07-27_siteplan_frame_fix_live/`.
  - **33890 MET**: parcel fills frame; Chestnut at south frontage (~45 m); outlier 15094293 dropped; residual setback/bearing overlap at bottom (craft debt, not extent).
  - **34785 / 33512 / 28286**: parcel fills frame (extent MET). No street drawn — attaching roads are far from parcel (Wilson ~680 m, Spring ~184 m / ~1.2 km). Correct clip; data skeleton, not frame bug.
- LESSON: site-plan frame = parcel (+margin); roads/contours are context CLIPPED to parcel+ROW buffer, never fit drivers. Grade craft on multiple parcels after road+design land together. Attaching-roads distance audit ≠ coverage.
- OPEN: residual side/bottom label overlap (B2 craft); attaching-road quality for audit planner (`_inbox/2026-07-27_site_plan_bad_attach_road_15094293_audit_flag.md`).
- Grade **extent regression MET** (multi-parcel). CTX HELD.

## QA2 site-plan craft (BUILD 2026-07-27)

```
LESSON: collision must never silent-overlap after max nudge — shrink → leader → drop. Two label passes (tags vs setbacks) must share one occupied[].
LESSON: fixed 7pt + estimated 0.52*len widths collide by construction on dense small parcels; use craftLabelFontSize(pageScale) + font.widthOfTextAtSize.
LESSON: street clip ≠ contour clip — frontage needs streetContextClipBox max(0.5*span, 40m); tight 15% pad erases WILSON-class frontage (regress #152).
DEAD-END: rewriting declutterStreets onto parcelVicinityClipBox — broke WILSON ST layout test.
GROUND-TRUTH (2026-07-27T17:06Z local): site-plan vitest 81/81 green; LABEL-NON-OVERLAP promoted; gold PDFs in doc_repo _inbox/2026-07-27_qa2_site_plan_craft_samples (34785 + dense-small).
OPEN: planner+operator visual QA big AND small dense before MET; do not self-grade craft.
```
