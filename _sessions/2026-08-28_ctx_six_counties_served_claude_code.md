---
date: 2026-08-28
topic: CTX six counties served on the full facet shape in production (OPS-19 A-020 to A-025); card F cut for the served zoning verdict
agent: claude_code (planner, subagent-run cards A to F)
plan_row: F-06, F-08, F-10, F-15, F-16, F-19
---

# Session: Central Texas cutover — six of six counties on the conformant shape in production

## Summary

The operator's course correction ("all efforts on getting CTX serving in prod; everything else can wait") became OPS-19 A-020, and the standing word for the six counties became A-021 ("they are all approved; spawn subagents to do everything and get this through to completion"). The planner ran six cards through its own subagents (A replay and reaper dispositions, B walk sweep and production publish, C canonical access pair at the writer plus the re-stamp job, D reaper execution identity, E bake facet projection, F the served zoning verdict), verified every handback itself, committed and merged in the product repos, built the job images from build configs, and executed every job. By 19:30Z all six counties (Bastrop 48021, Caldwell 48055, McLennan 48309, Hays 48209, Williamson 48491, Travis 48453) serve `node-facets-tier1-conformant-v1` on smartsite.cloud from rows a succeeded production publish run wrote, each with a passed inline production content walk (gold plus an area sweep) and a freshness stamp. The A-020 measure of done is met on its own terms.

Two production incidents were found and fixed on the way, both at the source rather than the symptom. The first production publish served 422 `ACCESS_NOT_DEFAULTED` on every Bastrop facet because the conformant writer stamped a pre-contract access pair (`public / anonymous`) that the serve guard correctly refused; the fix was a declared translation at serve (LDT #519), the writer and bake stamping the canonical `catalog-listed / anyone-free` (card C), a re-stamp of 6,339,368 atoms across eight counties in place with a count read back, then retirement of the translation by test (LDT #520, Factory #30). The second was a facet regression: the conformant bake wrote `facets.base` only and the walk graded provenance, not content, so four counties passed to production on a thinner shape; card E made the bake project the full facet set with an old-versus-new divergence test (LDT #522) and the walk now grades content (BP-CONTENT-01, 27 required tier 1 paths). Travis and Williamson were held under A-025(3) until both landed, then all six were re-baked forward.

The last finding of the session became card F and is serving. On four production golds `baseFacts.situsCity` was null and the serve-side zoning predicate treated that null as evidence of unincorporated land, so every conformant-baked parcel without a zoning stamp in a county with the unzoned-unincorporated doctrine was served as `not-applicable: unincorporated, no zoning authority`, including 4707 Shoalwood Ave in central Austin. That was a wrong statement, not an honest absence. The card's own measurement corrected its premise: the assemble did map the field; the claim reader looked for a nested `body.claim` the Factory never writes (stage E spreads a flat body), so situsCity, situsZip, land use and claim acreage were null on all 1,498,010 conformant rows. The fix landed at serve first (LDT #532: the verdict derives from `loadCityLimitsFact`, three states with the derivation on the wire; canary smoke on seven parcels shown failing on production before passing on the canary; shifted to cortex-api-00643-rib at 20:51Z), then in the bake (the reader accepts nested or flat; `situsZip` added; 28 required paths) and in the walk (BP-VALUE-01 against `landing_tx_city_boundary`, fail-closed). The six re-bakes on the new publish image were running at close, production per passed staging walk.

## Decisions and rulings recorded (OPS-19 grade log)

- A-020 course correction: Central Texas first; the named deferrals.
- A-021 standing production word for the six (this publish job only).
- A-022 handback rulings (replay hydrates pre-run state; earliest-known node binding; alias persist per chunk; execute-degraded per county; orphan rule; `PRODUCTION_SITE_URL=https://smartsite.cloud`; stale branches deleted after the six).
- A-023 the access pair is the contract's at every hop; declared translation then retirement; re-stamp in place.
- A-024 per-county gold parcels; staging branch rotation; concurrent staging publishes.
- A-025 the served facet set is part of the publish contract; the walk grades content; Travis and Williamson held until the projection landed; four re-baked forward.
- Rows for every milestone: criterion 5 close, Bastrop live, the 422 incident and its retirement, the re-stamp closes, all six written, each card handback, the facet regression, each county live on the full shape, the Travis transient 504 and linked re-walk, the A-022 cleanup, card F.

## Shipped and verified

| Artifact | Evidence |
|----------|----------|
| hauska-factory main | #22 to #33 merged (replay, walk sweep, timeouts 21600, access pair writer and re-stamp, reaper identity, null-city sweep key, walk content grade, LDT pin f4710c69); 259 tests, 2 live skips |
| legacy-design-tools main | #519 translation, #520 retirement, #522 facet projection (f4710c69); cortex-api production 00629-riz |
| Cloud Run jobs (us-east4) | factory-conformant gen 21, factory-bastrop-publish gen 16 image 7bdecdb1, factory-verify-walk gen 17, factory-restamp-access, factory-f10-cad-loop; all from build configs (A-019) |
| Re-stamp | 8 counties, 6,339,368 atoms, legacyTotal 0 everywhere; Factory legacy table emptied |
| Bastrop, Caldwell, McLennan | live on the full shape (rows in OPS-19) |
| Hays | rmhj4 16:24Z, run b6cda81e, gold 48209:135570 |
| Williamson | staging c3eb5ef8 walk pass; production vlh8k 18:26Z run 38cf5b16, 602,050 written, walk cceed65a pass, gold 48491:76149 |
| Travis | staging eb442f7d (inline walk failed on one transient 504 on the gold; linked re-walk 6753f6d2 pass, 185 parcels); production 4l82p 19:30Z run 1615b4ce, 500,307 rows, 873,766 written, walk 3089903c pass, gold 48453:493738 |
| Neon cleanup (A-022) | six stale staging branches deleted 19:37Z after an endpoint-host check against all three store secrets; remaining production, br-super-cloud, br-billowing-queen |
| Card F | handback verified by the planner (typecheck 0; 28 predicate and 22 reader tests; Factory 268 tests; diffs read; `stageRows` flat body confirmed); LDT #532 merged (main ee27845e), Factory #34 (walk BP-VALUE-01, main 10c544da) and #35 (`_LDT_SHA` pin, main 46b38977) merged; cortex-api canary 00643-rib smoke PASS on seven parcels, shifted to 100 percent 20:51Z, production smoke PASS; staging tag 00644-soz redeployed from the same digest 59a4696f; publish image 1b10d7e7 (gen 17 / walk gen 18); six staging re-bakes launched 20:54Z (k224m, 2kr9c, wkjgk, vj2sz, mnwhc, 4j7r4) with production publishes following each passed walk |

## Open (next session)

1. Card F re-bakes: read each staging walk (BP-VALUE-01 now grades served unincorporated claims against `landing_tx_city_boundary`), the production publishes that follow, and the golds after (situsCity, situsZip, land use and claim acreage populated where the claim carries them); record each county; then the card F follow-ups (a query point for the 534,700 sentinel rows; a Factory-side parcel point so BP-VALUE-01 drops its shared-input clause; hauska-map `LAYER_ABSENCE_VERDICTS` gains `stamp-missing` and `unmeasured`; parcelJoin state in the verdict basis for gate-blocked counties).
2. Travis `written 873766` against `conformantCadRows 500307`: reconcile (one snapshot per parcel node; a prop_id joining more than one node is the accepted mechanism; overlapping pages rejected).
3. Ledger-versus-seed disagreement for 48209 and 48491 (the ledger scores pass, the seed still blocks the prop_id join): operator ruling, F-05.
4. Envelope routing for the R1 brief (pre-existing since 2026-07-23; tier 1 bake decline-only, serve strips): operator or product decision, F-08.
5. Backlog routed: walk records fetch latency per parcel; value-level walk grades; two-tax-year selection at bake; per-page bake cost; per-county published_at reader; legacy start-time reaper fallback deletion by 2026-09-01; reset job Neon config; publish-guards reader.
6. Deferred by A-020 and still deferred: wave 1 remainder (25 counties), the F-09 card for the 217 counties without landing, the loop concurrency lever, F-11 to F-14, the LDT rename item 4 remainder, the console proxy question.

## Docs touched

- `90_operations/OPS-19_factory_plan_of_record.md` (A-020 to A-025 and the grade-log rows)
- `_catalog/seat_register.json` (planner-run subagent worktrees and branches)
- `_inbox/2026-08-28_ctx_{a,b,c,d,e,f}_*_WDLL.md` (six cards), `_dispatches/2026-08-28_ctx-{a..f}_dispatch.md` (compiled), `_inbox/2026-08-28_ctx-{a..e}_{cp1,cp2,close}.json` (checkpoints; card F's pending)
- `_state/property/STATE.md`, `00_current_state.md` (this close)
- Memory: `cloud-run-args-name-equals-value`, `factory-store-reads-time-out-under-writer-load`, `access-pair-is-catalog-listed-anyone-free`
