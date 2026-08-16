---
decision_id: 2026-08-16_plan_review_is_smart_files_first_consumer
date: 2026-08-16
owner: nick
status: active
related_canonical: [_decisions/2026-08-15_capability_mount_composition, _decisions/2026-08-15_smart_files_independent_module, _decisions/2026-08-16_plan_review_extract_and_remount, _inbox/2026-08-16_icc_demo_program_WDLL, 90_operations/OPS-17_govtech_stack_plan_of_record]
---

# Decision

Plan review is Smart Files' first product consumer. Engagement documents, sheets, and dataroom atoms are Smart Files file-shaped atoms in a tenant `icc-demo` folder. Cortex attachedDocuments / GCS dataroom / `dataroom_document_atoms` are not the document plane for this product.

## Context

G-58 mounted SmartSite / PE as an isolation probe (`GET /api/pe-smart-files-mount` 200 on a seed folder). Live PE save/share is still a get-by and is not Smart Files. Operator 2026-08-16: plan review should be the first consumer, and current document and dataroom atoms must be Smart Files based. That is the first time a product's own document room is the files module, not a leftover cortex store copied into plan-review.

## Structural commitment check

- Sell reasoning, not data: aligned. File atoms carry CID, accessPolicy, provenance. Plan-review findings stay citations, not blob dumps.
- Tenant sovereignty: aligned. Default files accessPolicy is tenant-private. icc-demo reviewer and observer share one tenant so the room lists.
- Dual interface: aligned. Plan-review HTTP plus MCP Smart Files tools against the same files service.
- Brand: aligned. Smart Files and Codex plan review are Empressa products. Plan review mounts files. It does not merge stores.
- Catalog thesis: aligned. PE isolation mount stays a probe. Plan review is the first product that files work product into Smart Files.

## Reasoning

AEC plan review is a document-and-adjudication product. If we elevate the cortex BFF's GCS upload and dataroom tables into plan-review Neon, we rebuild the store Smart Files already is, and ICC sheets never land in the module we just isolated. The BFF document routes stay in the HTTP contract so remount does not break callers, but they proxy to Smart Files: create folder on intake, list/upload/share against that folder, and `dataroom-atoms` is the files list (entityId, CID, accessPolicy, placements), not a second atom family on cortex-prod.

## Reversal criteria

Reverse only if a named plan-review document type cannot be a Smart Files file-shaped atom and that blocker is accepted in writing. Do not put file bytes on plan-review Neon or cortex-prod to "make the BFF compile." Do not treat the PE isolation seed folder as this consumer.

## Dependencies

Depends on G-58/G-59 serving path and icc-demo personas on the files service. Amends A-026 (sheets already pointed at files; this extends to all documents and dataroom atoms). OPS-17 A-027. G-60 WDLL A-007.

## Counterparties

Internal: operator, G-60 planner. First product consumer: Codex plan review. Isolation probe consumer remains PE/SmartSite. Files product home remains `empressaioemail-tech/smart-files`.
