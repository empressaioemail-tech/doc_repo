# CTX quality scratch

GROUND-TRUTH 2026-08-30T14:02:24Z: Rainmaker vs gold on same card H run e2c5c6d7. Rainmaker joined TxGIO 57429, PDD, land-use atom A1 (2026-08-12), yearBuilt 2021, livingArea CAD null, envelope null, well/footprint/boundary atom-miss. Pine same landUse bake miss, same well/footprint miss, boundary 4 fixture edges from 2026-07-29. CAD leftover 8720522 living_area_sqft null. County edges on 3732 of 77799 parcels. "100% complete" at Open = ledger cad/geometry 100% plus gold Connect ring_and_edges, not Rainmaker 14-rail. Recon `_inbox/2026-08-30_rainmaker_open_complete_recon.md`.

LESSON 2026-08-30: Map GIS outline and brief `property-boundary-edge` are different stores since P-53. A yellow highlight plus county geometry 100% is not an edge atom. Do not treat Rainmaker atom-miss as a card H wipe.

OPEN 2026-08-30T14:45Z: Session closed. Next agent reads `_inbox/2026-08-30_ctx_remainder_deep_review.md` first, then `_sessions/2026-08-30_ctx_remainder_and_rainmaker_wiring_claude_code.md`. Do not start W1 until the operator routes the review. Do not treat `_state/property/STATE.md` as current.

OPEN 2026-08-30T14:05Z: W1 still next. PE copy (grey box, Zone vs zoning, yearBuilt) parallel. Do not mint a Rainmaker ring in a wiring pass. Do not bake yet. SUPERSEDED by the 14:45Z OPEN (review lock).

OPEN 2026-08-30T13:52Z: W0 closed enough to unblock W1. Live remainder 232770 unstamped 0,0. Travis no-row still 119389 (situs not tried). PE labels partial (not-stamped, not stamp-missing/unmeasured). Next: W1 LDT card (situs-extend + tax year), Factory point index, PE label follow-up in parallel. Do not code P-80 in W1. Do not bake yet.

GROUND-TRUTH 2026-08-30T13:48:33Z: production place_layer_snapshots recount `_inbox/2026-08-30_ctx_w0_residue_recount.json`. Six card H runs. unstamped_sentinel 232770. seed leak 0.

OPEN 2026-08-30T13:48Z: W0 live recount starting. Heavy read on production place_layer_snapshots (six place_key ranges, adapter node-facets:tier1). Column is payload_json plus lat_rounded/lng_rounded, not body. First SQL failed on missing body (named). Gold peek: Kyle joined-situs R-1 with a real point; Taylor gate-blocked 0,0; Shoalwood no-row 0,0; Laird joined with a point.

OPEN 2026-08-30T13:40Z: CTX complete waves drafted on the Land canvas. Facts first (W0 recount+PE probe, W1 point+tax-year code, W2 P-80 only if recount says cannot-bind, R one rebake). Rails (W3) land in parallel and get a later publish. Do not rebake after each card. Do not start W1 without a WDLL. Seed stays. Do not invent P-80 in W1.

OPEN 2026-08-30T13:25Z: New shape landed. Six walked card H production publishes on sha256:7bef3ce7. Cycle stopped. CTX residue still owed: named point source for leftover 0,0 / no-row (pre-H 534,700; post-H unmeasured), Travis 119,389 no-row (P-80 parked), Hays/Williamson situs residue (Taylor gate-blocked is success), two tax years, F-11 zoning stamps, F-08 R1, PE probe after #310 Vercel. Do not restart scllr. Do not lift the seed. Do not invent P-80.

OPEN 2026-08-30T09:40Z: Wave 2 production DONE. Six walked publishes on sha256:7bef3ce7. Cycle stopped. PE label words still need a live PE probe after hauska-map #310 Vercel. Do not restart scllr. Do not lift the seed.

GROUND-TRUTH 2026-08-30T09:39Z: Williamson production `8ghwj` pass 4a4efa03 written 602050 / 602050. Gold 48491:76149 TAYLOR 76574 `parcelJoin.state=gate-blocked` (situs recovery refused). Seed did not leak.

GROUND-TRUTH 2026-08-30T06:23Z: Hays production `x2rw7` pass 003cdc7c written 304332 / 173050. Gold 48209:135570 KYLE 78640 `parcelJoin.state=joined-situs`, landUse `cad-roll-address-join`, zoning R-1. Seed did not leak.

GROUND-TRUTH 2026-08-30T05:30Z: Travis production `hhxg2` pass bb77fa65 written 873766 / 500307. Gold 48453:493738 AUSTIN 78756 `unmeasured` / `no-row`.

GROUND-TRUTH 2026-08-29T20:45Z: McLennan production `kkdm4` pass 70a92b2a written 113090 / 114255. Gold 48309:176914 WACO 76711 `stamp-missing` `parcelJoin.state=joined`.

DEAD-END 2026-08-29T20:36Z: One-shot sleep watchers get aborted. Six-hour stall. Next wake is 15m because Travis is long. If the session dies, resume from this scratch OPEN.

GROUND-TRUTH 2026-08-29T20:22Z: Caldwell production `jptqt` pass cd961998 written 73159 / 48649. Gold 48055:20478 LOCKHART 78644 RMD `parcelJoin.state=joined`.

GROUND-TRUTH 2026-08-29T20:11Z: Bastrop production `vzfnd` pass e2c5c6d7 written 61695 / 77799. Gold 48021:34137 and neighbour 34729 serve BASTROP 78602 SF-1 `parcelJoin.state=joined` run e2c5c6d7.

GROUND-TRUTH 2026-08-29T20:08Z: Travis staging `9kspw` pass f16d018f written 873766 / 500307. Gold 48453:493738 `unmeasured` / `no-row`.

GROUND-TRUTH 2026-08-29T20:04Z: Williamson staging gold 48491:76149 `parcelJoin.state=gate-blocked`, landUseAddressRecovered false, TAYLOR 76574, zoning unmeasured. Honest refuse. Not `joined`.

DEAD-END 2026-08-29T18:53Z: `--update-env-vars=OPERATOR_PUBLISH_GO=1,PRODUCTION_SITE_URL=https://smartsite.cloud` on PowerShell writes one env. Job exits TARGET_ENV_MISSING. Two flags.

GROUND-TRUTH 2026-08-29T18:51Z: Hays staging gold 48209:135570 `parcelJoin.state=joined-situs`, landUse `cad-roll-address-join`, KYLE 78640, zoning R-1, run 198b728c.

GROUND-TRUTH 2026-08-29T17:44Z: Cloud Build `8c3c7d9f` SUCCESS. Local `gcloud builds submit` poller aborted; the remote build finished. Job generation 18 image matches. `_LDT_SHA` 889b1556.

GROUND-TRUTH 2026-08-29T17:37Z: H merged LDT #548 `889b1556`. Factory pin #36 merged `7f41f523`. Seed unlifted.

GROUND-TRUTH 2026-08-29T17:03Z: card G planner re-run 42 passed; commit e9e9581 (+60 -3 on three PE files). Closed set is five verdicts. Display is the verdict string.

GROUND-TRUTH 2026-08-29T17:00Z: Travis written vs rows are different units (recon `_inbox/2026-08-29_ctx_travis_recon.json`). Planner verified parcelNodeIdFromBody drops nid_, written increments on ON CONFLICT, loadConformantPropIds is DISTINCT, CP1 500307, F-10 landing 873766. No SQL this recon.

LESSON 2026-08-29: "open the join" on 48209/48491 is not `LANDUSE_JOIN_DISABLED_FIPS_SEED.delete`. The seed exists because prop_id fabricates. The old bake already recovers on situs + ownersAgree. The conformant bake never called that path.

GROUND-TRUTH 2026-08-28T19:48Z (card F CP1, pre this card): Hays 172,282 and Williamson 602,050 gate-blocked; 534,700 unstamped 0,0 sentinels across the six.

DEAD-END: lifting the seed to "open" Hays/Williamson. That reprints the collision the gate was built to stop.
