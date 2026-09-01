# queue-init / property seat loop

## LESSON
A tokens file that exists and does not parse is treated as no tokens. `readJson` catch-returns null. Windows PowerShell `Set-Content -Encoding utf8` writes a BOM. Construct tokens with `node fs.writeFileSync`.

## DEAD-END
PowerShell `ConvertTo-Json` token write as a STORE_TOKEN_HELD construct. File visible to Get-Content, invisible to evaluateClaim.

## GROUND-TRUTH
2026-09-01T05:39:32Z board: factory-merges CLAIMABLE; ctx-totals and owner-backfill MAINTENANCE_WINDOW until 06:00:00Z; no live claim; no store token.

## GROUND-TRUTH
2026-09-01T06:08Z factory-merges closed; main 7a22f45. green-merge-sweep partial: 575/371/577/332 merged; 576 Test=FAILURE 53200 shared memory. engine #371 SHA e3e1485ee39535d1819d438221063dd6eb9b955e.

## GROUND-TRUTH
2026-09-01T13:24:12Z hauska_mcp cad-parcel-roll public-free ownerName: 48021=77073 48055=48382 48209=0 48309=113360 48453=0 48491=0. Mailing still 77048/48170/0/114254/0/0. Disagrees 2026-08-31 77078/48384/113384/29/3/7. owner-backfill did not apply.

## GROUND-TRUTH
2026-09-01T13:37:53Z factory #54 merged 45098156931497f1fb93b6de6abffa16cc2fe3f8. Engine #372 and #373 pushed, CI pending. Rescue pushed before any fix.

## GROUND-TRUTH
2026-09-01T13:42:31Z hauska_mcp cad-parcel-roll updated_at after #371 merge: 0 in all six. Survivors last moved 2026-08-12. owner-strip-apply stopped; did not apply.

## GROUND-TRUTH
2026-09-01T14:24:20Z three JSONB ownerName forms agree on the lower numbers. Predicate hypothesis dead. Hays/Travis/Williamson key-present=0.

## GROUND-TRUTH
2026-09-01T14:47:20Z recovered 00:12Z entity_id-range SQL re-run on hauska_mcp: n_roll and ownerName keys identical (77078/48384/265881/114280/492851/319487; names 77078/48384/29/113386/3/7). Deletion dead by totals. Silent strip dead by keys. 09-01 tx_ tenant predicate missed 5/2/29/26/3/7. McLennan name-without-mailing=26.

## GROUND-TRUTH
2026-09-01T15:10:25Z owner-strip-final applied. runId=215b278d-980e-46ce-91db-24f8dec15801. stripped=239781 under entity_id ranges. After: all three forms zero on both keys, all six. 72 foreign-tenant still_either=0. Untouched md5 identical. #371 e3e1485ee39535d1819d438221063dd6eb9b955e.

## OPEN
MCP anonymous get_atom regression test still unbuilt.
