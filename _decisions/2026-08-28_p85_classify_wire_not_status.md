---
decision_id: 2026-08-28_p85_classify_wire_not_status
date: 2026-08-28
owner: operator
status: active
related_canonical:
  - _inbox/2026-08-26_p85_central_texas_easements_WDLL.md
  - _decisions/2026-08-26_p85_records_request_scope.md
  - 80_adrs/adr_020_recorded_instruments_and_restriction_clauses.md
---

## Decision

P-85 item 8 close on job `6eb07368` is a cortex GET wire card: `artifacts[]` gains `documentKind` and `sourceDocumentType` from `metadata.classify`. `classifyStatus` stays `written | refused | null`. `skipped` is removed from the wire type. Skip is not persisted on the artifact. No production synthetic refuse POST. No worker rebuild. No re-enqueue.

## Context

The executor proposed three classifyStatus values on one live GET. The data planner and the steering admin rejected status overloading. Job `6eb07368` already wrote 21 instruments. `MEMORANDUM` is `other` / `unclassified` in the store. Only `classifyFieldsFromMetadata` drops those fields. Item 8's check is "rows per run by type; two refuse fixtures", already met. The three-state-on-one-job bar was the 19:20Z leftover, not the card.

## Structural commitment check

- Sell reasoning, not data: PE label derives from written + documentKind + sourceDocumentType, not a collapsed status.
- Confidence is earned: these 21 stay `verificationStatus: machine` and `tenant-private`.
- No privileged data: unchanged.
- Dual interface: unchanged.

## Reasoning

`classifyStatus` answers whether the write path produced a row. `documentKind` answers what classification decided. Putting unclassified in status makes a written filter drop written rows. `mergeArtifactClassifyMetadata` replaces the whole classify object, so stamping skipped on a re-run would overwrite `written` and `instrumentId`. `artifactAlreadyClassified` runs first, so a production POST against any of the 21 artifacts returns skipped and never refuses unless a fixture artifact is inserted into production.

Item 18 (Phase D promotion through Factory F-15 / F-16 / F-18) is wrongly homed. OPS-19 has no recorded-instrument row, and the contract forbids a public `accessPolicy` on this atom type. Item 18 does not block this wire card.

The contract `sourceAdapter` enum is R1 | R2 | R3 | R4 | R5, not `records-request-v1`. A zod parse at write, as the tree stands, refuses all 21 current rows. The substrate request is either add `records-request-v1` to that enum, or write R1 and keep the adapter name in `extractMetadata`. Do not file those as one item.

The 2026-08-28 amendment text said grantor-in-type refuses. At `89e539f6` the code writes `documentKind: unclassified`. The close names that disagreement. The vocabulary split (label in the portal Document Type select vs not) is the next card, not this one.

## Reversal criteria

Reverse if a PE consumer already filters `classifyStatus === "written"` as "known kind only", or if re-GET of `6eb07368` shows `metadata.classify.documentKind` absent on the MEMORANDUM artifact (the serve derivation would have nothing to expose). Reverse the no-production-refuse rule if a live portal publishes an empty Document Type on a captured row.

## Dependencies

Depends on LDT #534 / worker `00017-ksk` and job `6eb07368` remaining readable. Next card (not this one): vocabulary-backed unclassified vs unresolved, `sourceDocumentType` on every route, contract parse before insert (enum decision first), capture-coverage marker, restamp of the 21. Substrate: `records-request-v1` vs R1, separately ASSIGNMENT as first-class `instrumentType`.

## Counterparties

Internal: operator, P-85 executor, Factory / data planner, substrate seat.
