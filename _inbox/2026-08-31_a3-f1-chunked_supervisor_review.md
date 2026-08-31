---
id: 2026-08-31_a3-f1-chunked_supervisor_review
title: Planner review of A3 F1 chunked measure
date: 2026-08-31
plan_row: F-11
status: accepted
---

# Planner review of A3

Independently re-read the chunked runner write path in `P:/tmp/hauska-engine-a3-f1-chunked` at `0e96e6a` plus uncommitted files. Re-ran `--self-test` (pass, timeout 15s). Re-ran vitest via `P:/hauska-engine/node_modules` vitest 2.1.9 at 2026-08-31T22:07Z: 2 passed. Independently re-queried `hauska_mcp` on fancy-fire `br-crimson-feather-aphfmy91` / `ep-lucky-truth`. Did not take the close's totals as evidence until those reads agreed.

## Verdict

Accept. Published F1 figures stayed: placeholder 188103, non-placeholder 158573, delta 0. Zero UNMEASURED ranges. Bastrop anchors hold. McLennan 0 is a measured empty scout, not a timeout zero. Do not lift `SETBACK_APPLY_HELD`. Do not run F4 from this close. Planner has not committed.

The convenient match to `RECONCILE` and `PRE_REGISTERED_SPLIT` was the reason to distrust the instrument. Live nKeys, live envelopes, a full Bastrop CASE, and four ledger chunks re-scored on the store all agreed with the ledger. A copy of `RECONCILE` into the close would not have produced the first Travis page (1 placeholder / 7999 other-dimensional) or the middle Travis page (0 / 8000).

## Write path

`measure-setback-provenance-chunked.mjs` imports the classifier, `TIMEOUT` (15s), `FIPS`, and `PRE_REGISTERED_SPLIT` from the existing instrument. It does not fork or drop side, rear, or `sourceCodeAtomRef`.

`measureRange` uses `entity_id >= lo AND entity_id < hi` (and the matching `atom_did` prefix). The function source is scanned in `--self-test` for `IN (SELECT` and `LIMIT`. Pooler hosts are refused.

`summarizeCounty` returns `totals: null` when any planned range is not scored. `scorePublishedSplit` then emits `UNMEASURED` for both published figures. A successful scout of 0 keys is complete zeros. An absent plan stays UNMEASURED. Those three cases are in `--self-test` and were re-run here.

Page size 8000 is borrowed from containment. `wallMs` is recorded per chunk. Timeout is not raised.

The runner does not write atoms.

## Store, re-measured 2026-08-31T22:06Z

Instrument: Neon MCP `run_sql` on `hauska_mcp`. Snapshot: project `fancy-fire-06136146`, branch `br-crimson-feather-aphfmy91`.

Falsifier, pre-registered before these queries: a Travis setback-rule count other than 172713, a Williamson count other than 124499, a McLennan count other than 0, a Bastrop CASE other than 1969 / 2315 / 5219, or any sampled ledger chunk whose CASE differs from that event, rejects the close.

nKeys (`entity_type = 'setback-rule'`, half-open FIPS `entity_id` range):

| FIPS | live n | close nKeys |
|---|---:|---:|
| 48021 | 9503 | 9503 |
| 48055 | 5507 | 5507 |
| 48209 | 34454 | 34454 |
| 48309 | 0 | 0 |
| 48453 | 172713 | 172713 |
| 48491 | 124499 | 124499 |

Envelopes (`entity_type = 'buildable-envelope'`, same ranges): 62260 / 24006 / 102143 / 65814 / 172713 / 282436. Matches the close. Travis envelope count equals Travis setback-rule nKeys. That is a store fact, not an invented 1:1.

Bastrop full CASE, independently: placeholder 1969, layer-23 2315, other-dimensional 5219. Non-placeholder 7534. Anchors HOLD.

Ledger chunks re-scored on the store (same CASE as the runner):

| range | ledger | live |
|---|---|---|
| Travis `48453:0` .. `48453:116622` | ph 1 / other 7999 | ph 1 / other 7999 |
| Travis `48453:294140` .. `48453:313642` | ph 0 / other 8000 | other 8000 |
| Travis `48453:939686` .. `48454:` | ph 2271 / other 2442 | ph 2271 / other 2442 |
| Williamson `48491:R000009` .. `48491:R044900` | ph 8000 | ph 8000 |
| Williamson `48491:R661443` .. `48492:` | ph 4499 | ph 4499 |

County-wide Travis and Williamson CASE was not re-run. That is the 15s miss this card exists to avoid. Classification of the unsampled middle pages is accepted from the ledger after the endpoints and one interior Travis page matched live, and after nKeys matched on every county.

## What this does not close

`SETBACK_APPLY_HELD` stays. Scoring the quarantine premises is not a bake go.

F4 McLennan envelope DID resolve is still held. 65814 envelopes and 0 setback-rule keys under the FIPS prefix is now a measured pair, not a reason to invent keys.

The vitest file only asserts `--self-test` JSON contains the contract strings. The meaning-shaped refuses live in `selfTestChunked` inside the runner. That is enough for this card. Do not treat the two-test file as coverage of the store.

## Commit posture

Uncommitted on `feat/a3-f1-chunked`:

- `packages/retrieval/scripts/measure-setback-provenance-chunked.mjs`
- `packages/retrieval/scripts/__tests__/measure-setback-provenance-chunked.test.ts`
- `packages/retrieval/scripts/f1-chunk-ledger.jsonl`

Planner commits by explicit pathspec when the operator says go. Store is released. A2 unique-key read on `neondb` may take the compute.
