# cad-serve-reconcile scratch

GROUND-TRUTH 2026-09-01T15:30:15Z — factory PR 55 merged. Check-run conclusion STRING on head 0e519ea: test=success, gate8=success (both lowercase from /check-runs). mergeable=MERGEABLE mergeState=CLEAN. Current origin/main was still the PR base 4509815. Merge commit 48966df65403b390f24e16bdc66cd1fae17a6e9b.

LESSON — the seat loop claimed this card against P:/seat-worktrees/property/hauska-engine on fix/e1-e2-accesspolicy-failclosed. That tree is another lane's checkout. Released and reclaimed on P:/tmp/hauska-engine-cad-serve feat/cad-serve-reconcile from origin/main 10dfc10.

OPEN — ruling `_decisions/2026-09-01_serve_path_never_emits_pipeline_state.md` is taken. This card reports leaks. Do not implement. Do not fix K1-K6.

GROUND-TRUTH 2026-09-01T15:33:03Z — current_database neondb and hauska_mcp both on fancy-fire br-crimson-feather-aphfmy91 (production).

GROUND-TRUTH 2026-09-01T15:35Z — cad_property living_area_sqft distinct-parcel >0 matches the card premise exactly: 48021 8712/77799 11.2; 48055 13487/48649 27.7; 48209 93973/173050 54.3; 48309 0/114255; 48453 0/500307; 48491 245591/602050 40.8. Stored zeros on living_area_sqft are 0 in all six.

GROUND-TRUTH 2026-09-01T15:35Z — Bastrop cad_property improvement_value stored-zero is 6158 of 77799, not 26553. The 26553 figure is the cad-parcel-roll ATOM count from wave-a-fan (77078/50523/26553). Two stores, two numbers.

GROUND-TRUTH 2026-09-01T15:36Z — live /facets 48021:34137 adapterKey=node-facets:tier1 source=baked-snapshot snapshotAt=2026-08-29T20:02:22.015Z publishRunId=e2c5c6d7 matches place_layer_snapshots. Bake payload has no marketValue/livingAreaSqft/yearBuilt. Live compose adds landUseFact/structuralFact/cityLimitsFact. etjStatus=unresolved still on the live gold.

LESSON — Wave R publishes into neondb.place_layer_snapshots (adapter node-facets:tier1). Production /facets is that snapshot plus atom-chain overlay. Measuring only the bake misses structuralFact and cityLimitsFact. Measuring only the live golds cannot do 100 percent. Both sides.

GROUND-TRUTH 2026-09-01T15:45Z — marketValue bake keys 0 on 48021/48055/48209/48309. cad_property has market on 89-99% of parcels in all six. Hays/Travis/Williamson roll atoms are hollow (29/3/7 value keys). Bastrop atom livingArea 40602 vs cad 8712; atom assessed 77053 vs cad 15542.

GROUND-TRUTH 2026-09-01T15:46:58Z — Travis and Williamson bake 100 percent. n_rows 500307 and 602050. n_bf_mkt_key / living / year / legal / cadRoll all 0. The 15:46 close leave_behind that said those scans timed out is false.

GROUND-TRUTH 2026-09-01T15:56:39Z — live /facets area sweep 146 files. cadRoll 0. etjStatus=unresolved 146/146 all six counties. unmeasured cluster 7 (Hays 1, Travis 5, Williamson 1). livingWirePos 110 (Caldwell 58/61, Hays 44/56, Williamson 8/8, Bastrop 0/6, McLennan 0/3, Travis 0/12).

GROUND-TRUTH 2026-09-01T16:00Z — PE card 48021:34137 (tab e19726). LAND USE A1. LOT 0.3828. FLOOD Zone X. LIVING AREA "structural layer undeclared". YEAR BUILT 1910 (structural-fact). ZONING SF-1. SETBACKS shown. BUILDABLE Not stamped here. No dollar fields.

LESSON — 100 percent SQL on place_layer_snapshots reports 0 pipeline-word leaks because those keys are compose-only. The leak instrument is the live sweep.

OPEN — Wave R reads cad_property, not hollow atoms, not Bastrop atom overcounts. Serve-path ruling not implemented. Travis/McLennan living area is SOURCE.

DEAD-END — node fetch to smartsite.cloud failed TLS. PowerShell Invoke-WebRequest works. Do not rerun the node sweep.
