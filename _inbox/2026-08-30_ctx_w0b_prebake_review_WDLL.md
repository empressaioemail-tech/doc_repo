---
id: 2026-08-30_ctx_w0b_prebake_review_WDLL
title: WDLL — CTX W0b: pre-bake measurements and review (blocks W1 LDT only)
date: 2026-08-30
last_updated: 2026-08-30
status: approved
applies_to: doc_repo (read-only store reads; no product-repo write)
plan_row: F-05, F-06, F-08
depends_on: _decisions/2026-08-30_ctx_one_more_bake.md, _inbox/2026-08-30_ctx_remainder_deep_review.md, _inbox/2026-08-30_ctx_facts_complete_WDLL.md amendment 2
operator_go: 2026-08-30 (one more thorough review, then one bake)
snapshot: integration P:/doc_repo main c24ba660; six idle on card H; W1 code not started
owner: integration runs the reads and files the review; no bake; no product PR
---

# CTX W0b: the review that gates the last bake

Date: 2026-08-30  Status: approved

The 2026-08-30 remainder review scored the old plan. This card reviews the expanded plan against that finding set, plus two store reads the first review named and did not run. This card blocks W1 LDT only (items 1 and 2). Walk, PE, F-11 recon, easement schema, rail-absence, and recount repair start after the operator review of `_inbox/2026-08-30_ctx_parallel_waves.md`. They do not wait on these reads.

## Done looks like

Two read-only measurements exist with snapshot (commit, host, time). The landUse W1 item names a source, not a hope. Situs-extend to 48021 / 48055 / 48453 is go or no-go from an owner-agree sample. A short review note says the expanded cards cover every bake-input finding from the remainder review, or names the hole. No store write.

## Acceptance items

1. **landUse source named.** Read-only: on 48021:34137 and 48021:8720522, is `claim.propertyUseCode` (or the flat-body equivalent) null while `cad_property.property_use_code` is A1, or is the field present and the bake looking one level too deep? File `_inbox/2026-08-30_ctx_w0b_landuse_source.json` with both derivations and the named W1 source. | check: the JSON names one source and a rejected alternative | grade: [met 2026-08-30: live facets e2c5c6d7 landUseFact A1 on both; CAD leftover A1; bake landUse null. W1 source is the atom/CAD code.]

2. **Owner-agree sample on leftover no-row.** Read-only sample of situs-keyed `txgio_parcel` versus CAD owner on leftover `no-row` for 48021, 48055, and 48453. Compare to the 2026-08-29 published rates (Hays ~86%, Williamson ~89%). If a county falls below that gate, situs-extend is no-go for that FIPS and leftover stays `no-row`. File `_inbox/2026-08-30_ctx_w0b_owner_agree.json`. | check: three rates with n, snapshot, and go/no-go | grade: [partial — 48021 no-go 0.688 n=32; 48055 no-go 0.721 n=43; 48453 unmeasured (txgio LIKE timeout). Situs-extend not coded on any of the three.]

3. **Expanded-plan review.** One note `_inbox/2026-08-30_ctx_w0b_plan_review.md` that walks the remainder review's six load-bearing findings against the amended parent, W1, PE, and walk cards. Each finding is covered by a named acceptance item, or named as a hole that blocks Wave R. | check: the note exists and cites item numbers | grade: [met 2026-08-30: six findings mapped; W0b 1 and 2 still block W1 LDT only]

4. **Recount instrument not re-run on the live file.** Do not invoke the W0 recount `--self-test` against `_inbox/2026-08-30_ctx_w0_residue_recount.json` until `writeReport` is behind a main guard (Factory / integration leave-behind F-01). The numbers stay; the instrument is repaired as a W1-adjacent item, not this card. | check: the JSON hash still matches `sha256:b3353b9677d4efbc1372d20ee2084766185bbaf5771f469a238fab38ad8c2c5f` or a filed successor | grade: [met 2026-08-30: writeReport refuses without --live and without control ctx-w0-residue-recount; --self-test 7/7; live JSON hash still sha256:b3353b9677d4efbc1372d20ee2084766185bbaf5771f469a238fab38ad8c2c5f]

## Do not

- Start W1 LDT before items 1 and 2 grade.
- Treat a missing landUse or owner-agree measurement as a W1 go.
- Bake or publish.
- Lift the seed.
- Code P-80.
- Block Walk, PE, or W3 schema on this card.

## Amendments

1. 2026-08-30: Scope narrowed. Items 1 and 2 block W1 LDT only. Walk, PE, and W3 schema start after the operator review of the parallel wave plan. Reason: operator "as much happening in parallel as possible."
---
