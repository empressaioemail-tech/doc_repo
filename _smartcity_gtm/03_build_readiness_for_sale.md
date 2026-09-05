---
id: 03_build_readiness_for_sale
title: Build readiness for sale — OPS-17 translated
status: draft
last_updated: 2026-09-03
applies_to: smartcity-os
owner: nick
related:
  - _smartcity_gtm/00_README
  - _smartcity_gtm/01_bastrop_to_network_strategy
  - 90_operations/OPS-17_govtech_stack_plan_of_record
  - _smartcity_masters/00_README
purpose: OPS-17 is a build log, not a sales document — it answers "what happened" per engineering
  row, not "what could I show a prospect today." This translates it into one readiness sentence
  per surface. Marked status draft because it was built from a keyword-filtered pass over OPS-17
  (matching gtm/sales/pipeline/procurement/prospect/pilot/vertosoft), not a complete sequential
  read — treat every claim below as a starting point to re-verify, not a current-state assertion.
---

# Build readiness for sale

Smart Site's consolidated roadmap opens with "product is live and works, money is not live."
SmartCity OS's honest equivalent is closer to: one customer's live production system works and
is the case study; the template product that would let a second city buy the same thing is
mid-build, and government sales routinely require an accessibility conformance report that is
explicitly not finished yet. Do not let outreach get ahead of what a demo can actually show.

**Read this section's dates before quoting it.** Every state below is anchored to a specific
OPS-17 row (`A-###`) and its date. OPS-17 moves fast — multiple entries per day is normal — so
treat anything more than a few days old as needing a fresh check against the live document
before it goes in front of a prospect.

## Dashboards (the entry sale)

**Template build:** through wave 3 (as of `A-084`, 2026-08-20), the shell and eleven department
domains render real data on `template-city`, with the correct four-state source vocabulary
(`ok` / `granted-empty` / `ungranted` / `no-fixture-source`) reaching the pixel rather than a
flat "not built." Serving `smartcity-dashboards-00037-ced` as of that entry.

**Accessibility / VPAT:** explicitly incomplete as of the same entry — "half A of wave 3 is
shipped and half B, the evidence pack and the ACR [Accessibility Conformance Report], is NOT
STARTED." A PDF-generation architecture decision was taken the same day (one shared headless-
Chromium render service), with the stated limit that it tags what the underlying HTML says —
it does not fix conformance by itself. For a government buyer, an incomplete VPAT is a real
sales blocker, not a nice-to-have; do not represent VPAT/508 conformance as done until the
evidence pack and ACR are separately confirmed closed.

**What this means for outreach:** the template can be walked live and looks real, but "can we
see it work for our city" and "is it 508-conformant" are two different questions and only the
first one is currently answerable with confidence, per the dates above.

## Plan Review

Live for Bastrop under a real `bastrop_tx` persona and edition, with cross-tenant read/write
refusal verified both directions and a live IBC code-lookup path wired (`A-108`, 2026-09-02).
The coverage claim needs to be stated precisely: exactly **2** of the Bastrop UDC's sections
carry real, non-placeholder content (`14-02-003`, `14-02-008`) as of that entry; the ratio
against a realistic full review has not been measured against a real submittal sample. Do not
imply broad code coverage from "Plan Review is live" — it is live and correct on a narrow,
named slice.

## Smart Files (the foundation's customer-facing face)

A prior schema (the "brokerage workspace" family) was found structurally unable to support the
product's own claim ("revise once, appears everywhere") — no versioning, no multi-placement,
and zero attachments in production (`A-002`, 2026-08-14). A new, purpose-built schema
(`smart_file_documents` / `smart_file_versions` / `smart_file_placements`) was built and merged
(`A-014`, 2026-08-15), with placements referencing the document rather than a version so the
revise-once claim is structural. **As of that same entry, the migration to the deployment
database had not yet been applied** — "G-14 remains OPEN pending: apply the migration, then
refresh the fixture from live." Whether that has since happened is not established in this doc
set; check current state before claiming Smart Files is live with real content.

## Asset Management

Has no repository as of `A-084` (2026-08-20) and is recorded as not-yet-built rather than
silently omitted. There is nothing to demo here today.

## ICC / Plan Review's code content

A real, signed ICC Code Connect license exists (`icc-demo`, 180-day term), and a corpus-level
atom for it is confirmed real and accruing genuine usage (`A-102`, 2026-09-02). But no real
per-section ICC content exists anywhere in the system yet, substrate included — only the
corpus-level record is real (`A-103`, 2026-09-02). This is a content-acquisition gap, not a
mechanism gap, and it is a separate, unscoped question whether closing it is required before
Wave 1 of the ICC integration counts as done.

## Live Bastrop production (`smartcity-os` repo)

This is what a prospect actually sees if pointed at Bastrop's real system today. It is
ABSOLUTE NO-TOUCH for any new development, pre-spine, and fully siloed from the template build
described above. It is the case study, not the demo of the sellable product — the two are
different codebases and will stay different until a named cutover WDLL runs.

## What this means, bluntly

Bastrop's story is real and sellable today. A second city buying the same template product,
inspecting a real government-grade accessibility report, and getting broad code-review coverage
is not yet something this build can back up. Sequence outreach accordingly — see
`01_bastrop_to_network_strategy.md`'s sequencing section — and scope any demo to what the
`template-city` build can actually show a non-Bastrop city on the day of the demo, not to
Bastrop's live production system.
