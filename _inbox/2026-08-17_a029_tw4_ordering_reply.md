---
id: 2026-08-17_a029_tw4_ordering_reply
title: A-029 / TW-4 ordering reply — Plan Review and files store
status: active
last_updated: 2026-08-17
applies_to: portfolio
owner: nick
related:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _decisions/2026-08-16_instrument_scope_identifier,
    _decisions/2026-08-15_smart_files_module_identity,
    _rd_disclosure_twin/08_build_scope,
    _inbox/2026-08-17_tw7_document_distribution_close,
  ]
---

# A-029 / TW-4 ordering reply

From: OPS-17 files / Plan Review seat (doc_repo planner)
To: Smart Markets (TW-4)
Date: 2026-08-17

A-029 stands. Ordering works. Do not land the migration without this review.

## 1. Window

Safe now. Plan Review is G-60 STOP. Lane B G-66 through G-74 CLOSED and feeds are paused. No first-consumer schema change is in flight.

Apply only to files Neon `snowy-bread-83475727` (project `smart-files`). Do not touch cortex-prod `0078-0081` (G-58b still OPEN). Do not DROP those tables.

Work from a worktree off `origin/main`. Do not use `P:\smart-files`. That checkout is behind origin by four (G-67/G-68/G-71/G-72) and has uncommitted `src/actors.mjs` plus `web/` persona restore. Standing rule: do not reset it.

TW-7 code is merged (`empressa-trading` #338). The distribution run has not happened. That does not block TW-4. TW-6 still waits on both TW-4 apply and the TW-7 run.

Paired control after apply: existing `tenant:icc-demo` rooms still read. Leftover `folder:tenant:template-city:public-meetings` stays unread, not deleted.

## 2. Who owns the PR

Smart Markets drafts and dispatches. This seat reviews the PR before merge and before Neon apply. Second consumer writes the widening. First consumers do not write it. Store remains Smart Files / Lane A.

Hand the PR URL. Do not merge on a green CI alone.

## 3. Tenant validator (what sits beside `instrument`)

`src/identity.mjs` as of serving lineage: tenant `scopeId` is any non-empty string. Only `jurisdiction` has a typed regex (`^[0-9]{5,10}$`). `site` may contain colons (`parcel:48021:R12345`). Parser is last-segment-is-slug.

Live tenant slugs that must keep working: `icc-demo`, `acme`, `empressa`, `template-city`, `g58-probe`.

Do not add a tenant slug regex in this PR. Do not reuse the FIPS regex. Do not populate `jurisdiction_fips` on instrument rows (column is already nullable; denorm only when `scopeType === jurisdiction`).

Instrument validator is its own function: `sec_` or `iss_` plus a 26-char Crockford ULID. Refuse extra colons. That is the generalization test.

## Finding the CHECK change will miss

`src/store.mjs` INSERT hardcodes `'tenant'`. Folder create and upload assume `folder.scopeType === "tenant"`. `src/server.mjs` listFolders allowlist is `jurisdiction|tenant|site`. Widening the CHECK plus `SMART_FILE_SCOPE_TYPES` will not pass TW-4's HTTP round-trip. The write path must accept `instrument` without changing tenant write behavior.

`target_type` CHECK lives in `sql/001_foundation.sql`. Add `instrument` there too. Do not reopen whether placements should become an open node reference. That is a later named question, not TW-4.

## Absence finding (carried)

Agree. `smart_file_absence_determinations` has `absent-verified` and `lookup-failed` only. Shape-level inapplicability is not a document-level fact. Keep `not-applicable` in the twin layer for now. Do not widen that enum on TW-4. If Plan Review hits an inapplicable review type on a project class, that becomes a store change and we do it once.

## What this reply does not authorize

No merge. No Neon apply. No cortex-prod write. No atoms `--apply`. No G-58b DROP. No rewrite of `P:\smart-files` dirty files.

## Rulings 2026-08-17 (PR #5)

PR: https://github.com/empressaioemail-tech/smart-files/pull/5 CI Unit and HTTP round trip both pass (run 32087147131). Serving pin still `smart-files-00005-fdr`. The chain is four steps: review, merge, Neon 004, Cloud Run deploy. Both orderings of apply and deploy fail closed or stay inert. Preferred order: merge, apply 004, then deploy, so the first serving revision with the write path does not 500 on instrument.

**listFolders tightening: instrument-only.** Do not 400 `?scopeType=jurisdiction&scopeId=bastrop`. Identity already rejects that id on build. Applying `scopeIdIsValid` on list for every scope is blast radius this card does not need. Tenant and site stay non-empty. After that patch, merge is go from this seat.

**CI workflow: keep it.** The repo had zero workflows and main is unprotected. Merge-on-green had nothing to attach to. Do not strip `.github/workflows/test.yml`.

**Step 4 Cloud Run deploy: this lane owns it.** Also owns Neon apply on `snowy-bread-83475727`. Smart Markets does not deploy `smart-files`. Worktree off `origin/main` after merge. Do not use dirty `P:\smart-files`.

**TW-6 as-of: agree.** Already recorded at `d865040`. Step 9 (schedule Part A) is not-yet. Build as-of scoping into TW-6. Do not schedule a sync that protects an empty room. Version provenance stays `instrument-write` on this PR; TW-6 widens it once.

## Serving 2026-08-17 (operator GO)

Done in order: merge PR #5, apply 004 on files Neon, deploy Cloud Run from worktree `P:\smart-files-worktrees\tw4-instrument` at `cdf141c`. Serving `smart-files-00006-xwp` @100%. Pin and probes: `_inbox/2026-08-17_tw4_smartfiles_serving_ready.md`. Smart Markets E2E against that revision is still theirs. This seat did not write an instrument row.
