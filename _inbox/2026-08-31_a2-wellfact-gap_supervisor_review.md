---
id: 2026-08-31_a2-wellfact-gap_supervisor_review
title: Planner review of A2 well-fact gap
date: 2026-08-31
plan_row: F-02
status: accepted-class-rejected-prediction
---

# Planner review of A2

Reviewed write paths in `P:/tmp/hauska-engine-a2-wellfact` at `0e96e6a` plus the uncommitted patch. Re-ran vitest on the two named files at 2026-08-31T21:12Z via `P:/hauska-engine/node_modules` vitest 2.1.9: 20 passed. Did not take the close's test count as evidence. Did not connect to the store.

## Verdict

Accept the collapse class. Reject the claim that 2087 was predicted. The close is already marked partial and that is the honest status. Do not commit the identity arithmetic as a prediction. Do not deploy. Do not re-run 48021.

## Write paths read

`plan-county-well-facts.ts` (pre-patch shape, still visible in the hit loop): one present row per well feature that intersects or is within 152 m. `wellKey = buildApiNumber14(well.api)`. There was no wellKey map. The file comment said on-parcel takes precedence; the old test only asserted `pointInGeoJson`. That is a real write-path defect.

`well-fact-writer.ts` 58-59 and 109-112: `entityId = parcelNodeId:wellKey`. `atomDid = wlfact_fnv` of the same pair.

`property-atom-batch-write.ts`: `dedupePreparedRowsLastWins` then `ON CONFLICT (atom_did) DO UPDATE`.

`pg-storage.ts` 298-310: `preparePropertyAtomRows({ dedupe: true })` returns `out` as the pre-dedupe length.

`write-well-fact-county.mjs`: `atomsWritten += slice.length`. Progress events are counts. Verify looks up `did:hauska:well-fact:${entityId}` and can succeed for every planned row even when unique PKs shrank.

That stack produces the signature the job showed: planned 69000, written 69000, verified 69000, exit 0, unique store PKs 66913.

Mechanisms 1, 2, and 4 are rejected on that reading. Skips before `planned[]` cannot subtract from a 69000 that was built and counted. A silent skip after build would have made `atomsWritten < 69000`.

## Why 2087 was not predicted

The formula is `2087 = 12079 - |unique (parcelKey, wellKey)| among present hits`.

The check that "hit" is `9992 + 56921 = 66913` where `9992` is defined as `12079 - 2087`. That identity is true for any gap. A story that explains a gap of any size explains nothing. The dispatch named that falsifier.

The unit fixture proves the class: two features, same API, same parcel, collapse to one persist PK. It does not measure how many times that class occurred on 48021.

The test titled `48021 gap arithmetic: 12079 - 2087 = 9992` asserts the known gap. That converts a defect into a specification. Do not ship it as evidence the number was predicted.

The measurement that would predict 2087 is `|unique (parcelKey, buildApiNumber14(api))|` on the 12079 present hits. That read is still UNMEASURED and correctly held while A1 owns `ep-lucky-truth`. Until it returns 9992, or some other number, the size is unknown. Empty-API `42000000000000` and 14-digit event-suffix truncation are other collision classes on the same PK and are unquantified.

A second mechanism that produces the same 66913 is any other collision class whose extras sum to 2087. The write path does not distinguish them without the unique-key count.

## Patch

Planner last-wins on `(parcel, wellKey)`, on-parcel over near, closer over farther, and increments `collapsedDuplicateWellKeys`. That is the right repair for the class.

`CHUNK_PK_COLLAPSE` fires only inside one slice. Two copies of the same PK in different 500-row batches would still last-wins across chunks and still count both. After the planner dedupe that path is starved. The refuse is a regression door, not a cross-chunk door.

`well-fact-county.chunk` names `plannedIn` and `writtenOut`. That closes the "count is not a record" finding for future runs.

`buildApiNumber14` empty/null still becomes `42000000000000`. Named leave-behind. Correct that this patch does not fail-close it.

## Commit posture

Uncommitted on `feat/a2-wellfact-gap`. Drop or rewrite the `12079 - 2087 = 9992` test before any commit. The unique-key read after A1 releases the store is the remaining half of the card. Planner commits by pathspec when the operator says go, after that rewrite.
