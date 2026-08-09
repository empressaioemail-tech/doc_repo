# Multi-shapefile truncation planner: adversarial review

Review date: 2026-08-09  
Scope: claims A through E only. This is a refutation attempt, not a certification. Instrument independence remains the rule.

## Attacks attempted

### A. Sweep coverage

The raw sweep roster is internally complete: it has 254 rows, 254 unique odd Texas FIPS values from `48001` through `48507`, no missing or extra FIPS, 253 `ok`, and Donley `48129` as the one `dead` row. Its declared URL returned HTTP 404 when checked directly during this review. Harris is the only row with two `.shp` names; Donley has zero and is not a second multi-shapefile archive.

That is not enough to ratify “Harris is the ONLY multi-shp archive.” The supplied raw JSON contains the final entry list and a method label, but not the HTTP range responses, EOCD bytes, central-directory offsets, ZIP64 locator/EOCD records, parser version, or a per-archive indication that ZIP64 and multi-volume cases were rejected or correctly parsed. Therefore it cannot disprove a malformed, ZIP64, truncated-tail, or range-serving archive causing the sweep parser to see an incomplete directory. The PR has no test against a real ZIP, ZIP64, or a multi-shapefile archive whose names do not look like Harris.

I attempted the required independent three-county central-directory fetch against Bexar `48029`, Nueces `48355`, and Williamson `48491`. This reviewer environment received CloudFront 403 responses for all three range requests, while the supplied ingest logs show the factory could download Harris. That failure is evidence only that this review environment could not independently reproduce the fetch. It is not evidence that the planner is right. Do not substitute the sweep's own final JSON for the missing independent observation.

### B. Geographic check sensitivity

The check is not a coverage check. It compares only four parcel extrema with four TIGERweb envelope extrema. It catches a one-sided third-of-county loss easily, but it cannot catch an internal third, a hole that leaves an outlier on each edge, or a missing coastal strip that does not move an extreme enough.

The supplied raw data covers 196 loaded counties. Its median Census longitude span is 0.596501 degrees and median latitude span is 0.490789 degrees. At those medians, the fixed 0.05-degree edge rule detects an inset of about 8.4% horizontally or 10.2% vertically; independently, the 0.85 span rule detects a one-sided loss above 15%. A contiguous missing third would produce a roughly 0.199-degree longitudinal or 0.164-degree latitudinal inset at those medians and should trip both applicable tests. So the proposed “third rather than two-thirds” attack does not kill the threshold for an edge-aligned third.

It does kill the claimed sensitivity boundary. The check has no areal-coverage measurement. A central-third deletion leaves the same bounding box. Sparse remnants or one bad outlier can preserve an edge and make a materially truncated county pass. The raw artifact also cannot establish that the eight non-Bell flags are water gaps: Cameron, Jefferson, Kenedy, Kleberg, Matagorda, Nueces, Orange, and Willacy each have an edge or span discrepancy, but no land mask, shoreline intersection, parcel-footprint union, source-layer comparison, or independent parcel authority is included. “Coastal” is a location description, not proof that the omitted area is water. Those flags remain unresolved data-quality exceptions.

### C. Harris west-half re-ingest

The dry and apply logs prove that this invocation opened both named Harris files, read part 1 and part 2, and reported the same 1,523,641 features and 1,602,031 tile rows. They do not prove the post-apply geography. The only supplied geographic raw/summary was generated at `2026-08-09T16:08:30Z` and records the pre-reload east-only wall at `-95.43641284699999` with zero parcels west of `-95.44`. Neither supplied log contains the claimed new westmost longitude `-95.96082688599995`, a post-apply query timestamp, or the claimed 26,613 parcels west of `-95.80`.

Accordingly, “apply matched dry” survives only as a deterministic-processing claim. It is not evidence that west-Harris land is present. A source-reader defect, a bad projection that still passes coarse bounds, or a parsed-but-empty/degenerate western geometry could still make dry and apply agree. The named west `.dbf` and `.shp` are larger than the east counterparts in the logs, which makes a real west dataset plausible, but byte size and feature counts are not geographic proof.

### D. Count-based assertions

The following numerical claims are inherited-input evidence and must not appear as completeness proof:

- `564,948` existing east-only rows, and the matching delete count.
- `1,523,641` features read/parsed/would load or load.
- `1,602,031` rows predicted/inserted.
- Exact dry/apply equality.
- Zero declined features.
- Any assertion that the new row count is “about 1.65M.”
- The claimed `769,053` parcels west of `-95.44` and `26,613` west of `-95.80` if presented without a post-apply spatial query and source-independent geographic corroboration.

Those measurements describe consistency of the same reader and writer. The original bug proved that such consistency can coexist with a missing half. The archive manifest's `.shp` entry count is not infected by the old `files.find()` behavior, but it still only proves an archive member count, not that the members are the same layer or geographically complete.

### E. Reader policy

Fail-closed without `--multi-shp=concat` is safer than silent auto-concat. The PR's `selectShapefileLayers` does reject an N>1 archive by default, and the new unit test exercises the two-Harris-file case. That is a real improvement over `files.find()`.

It also makes Harris unloadable by every generic wave command that does not explicitly add the flag. The repo's documented generic invocations omit it. This is an intentional operational block, but it is still a block. As reviewed, the code is only in open PR #404, so it cannot protect an already-running main-based wave until merged and the Harris-specific invocation is amended.

Two silent or under-validated paths remain:

- `--limit=N` returns from the feature generator before later parts, then the normal replace transaction can commit and exit successfully. The summary does not label the result partial or prevent use with an apply. On a multi-part archive, a limit smaller than the first part is another successful partial load path.
- `--multi-shp=concat` verifies matching `.dbf` siblings and rejects mixed CRS declarations, but it does not mechanically verify same schema, layer identity, non-overlap, expected part count, or geographic complementarity. The code asks the operator to confirm that externally. That is an unresolved manual assertion, not a fail-closed semantic check.

## Claims killed / conditioned / survived

**Killed:** “The other eight short counties are water gaps, therefore Harris is the only geographic truncation.” The supplied evidence cannot distinguish water from missing parcels, and an extrema-only test cannot exclude non-edge truncation.

**Killed:** “The Harris reload is geographically proven.” The logs prove two files were streamed and dry/apply agreed. They do not contain the claimed post-apply west-edge observation or a meaningful west-Harris geographic sample.

**Conditioned:** “All 254 were swept; Harris is the only multi-shp archive.” The roster itself is complete and Donley is a verified 404, but uniqueness remains conditional on preserving/reviewing the actual range/EOCD/ZIP64 evidence and independently sampling archive directories. A summary field cannot be its own instrument.

**Conditioned:** “Fail-closed fixes the reader.” It fixes default silent first-file selection on the PR branch. It does not make existing flagless Harris wave commands succeed, does not protect main while #404 remains open, and does not close the `--limit` partial-apply path or validate that concatenated layers belong together.

**Survived narrowly:** A contiguous, edge-aligned one-third truncation of a median loaded Texas county should trip the current 0.05-degree or 85% span thresholds. That is narrower than a geographic-completeness claim.

## VERDICT

VERDICT: HOLD. The planner has demonstrated an internally complete 254-row sweep roster, a real Harris two-file archive, and a reader change that stops the original silent-first-file behavior on PR #404. It has not demonstrated the two conclusions it wants to operationalize: that every non-Harris short extent is water rather than missing parcel data, or that the Harris reload now contains real west-Harris land. The supplied geographic artifact predates the reload; dry/apply equality, feature totals, row totals, and decline totals all share the same reader and are therefore non-independent. Treat the eight non-Bell short counties as unresolved, require a post-apply spatial proof for Harris, and do not call the statewide blast radius exactly one until the sweep retains parse-level ZIP/ZIP64 evidence and an independent archive sample succeeds. Merge #404 only with an explicit Harris `--multi-shp=concat` wave invocation and a guard against `--limit` committing a partial replacement.

## What would change my mind

1. A rerunnable sweep artifact that stores, per archive, the HTTP range response metadata, EOCD/ZIP64 parsing path, central-directory entry names/counts, archive version/hash, and an explicit failure state for unsupported multi-volume or malformed ZIPs; plus three independently fetched and parsed non-Harris directory samples.
2. A post-apply Harris observation, timestamped after the apply transaction, with the spatial SQL/result for `west_lng < -95.80`, a bounded sample of those parcel geometries or stable IDs, and an overlay/intersection against an independent Harris boundary or public authoritative parcel source. The proof must show a distributed western footprint, not merely one westmost coordinate.
3. For each of the eight coastal flags, a reproducible comparison against a land polygon or authoritative parcel coverage source that labels the omitted area as water or proves parcels are absent by source design. If that cannot be done, hold the county as short rather than narrating it away.
4. PR tests and code that reject `--limit` for apply, or mark it non-committable; a manifest that asserts all concatenated parts share the intended schema/layer identity; and a reviewed wave command that passes `--multi-shp=concat` only for Harris.
