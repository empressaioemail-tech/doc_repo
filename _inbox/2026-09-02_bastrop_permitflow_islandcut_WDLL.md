---
id: 2026-09-02_bastrop_permitflow_islandcut_WDLL
title: WDLL — PermitFlow island cut (Bastrop staff onto plan-review-app)
status: approved
last_updated: 2026-09-02
applies_to: portfolio
owner: nick
operator_approval: 2026-09-02, "wdll approved." Standing constraints added at approval, binding on every dispatch under this card: (1) smartcity-os / PermitFlow / live Bastrop stays 100% live and untouched throughout — already the card's own no-touch premise, restated explicitly by the operator; (2) reuse existing data and component mapping as-is (Bastrop UDC sections, code-lookup manifest shape, parcel/jurisdiction wiring) — additive changes only, no rebuilding what already works.
related:
  - 90_runbooks/wdll_practice.md
  - 90_operations/OPS-17_govtech_stack_plan_of_record
  - _inbox/2026-08-17_dashboards_missing_pieces
  - _decisions/2026-08-17_g65_permitflow_kill
  - _decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding
  - _decisions/2026-09-02_plan_review_leads_the_bastrop_push
  - _inbox/2026-08-25_govtech_wave1_WDLL
plan_row: G-52 explicitly NOT this card (blocked on missing feed, see Out of scope)
---

# WDLL: PermitFlow island cut — Bastrop staff onto plan-review-app

Date: 2026-09-02  Status: approved
Operator approval: pending

One of five named island replacements in `_inbox/2026-08-17_dashboards_missing_pieces.md`'s recommended sequence, explicitly NOT "Bastrop cutover" (that framing is the doc's own named anti-pattern). Unblocked by Wave 1 closing today (OPS-17 A-104): Plan Review is now a real, functionally complete standalone product. This card is the one piece of that sequence Wave 1 makes buildable without a feed dependency.

## Done looks like

A real Bastrop staff member reviews a real (or realistically representative) Bastrop submittal in `plan-review-app` — not a `template-city` demo walk — under their own Bastrop identity, and gets a genuine determination: a real Bastrop UDC citation where coverage exists, and honest typed absence (not a silent gap) where it doesn't. PermitFlow on `smartcityos.io` is not touched, not deprecated, and not linked from here — per the 2026-08-17 ruling it stays live until staff actually choose plan-review-app over it, which this card exists to make possible, not to declare. `template-city` and the new Bastrop identity never share a tenant boundary or a demo fixture.

## Acceptance items

1. **A real Bastrop tenant/persona exists on plan-review, distinct from `template-city` and `icc-demo`.** Currently `src/actors.mjs` hardcodes exactly two personas, both demo/QA. This item adds a real one (working name `bastrop_tx`, pending your call on naming).
   | check: a live upload/engagement created under the Bastrop persona produces `entity_id`/`orgId` carrying `bastrop_tx` (or chosen id), not `template-city`; a cross-tenant read attempt (Bastrop persona reading a `template-city` engagement, or vice versa) is refused, live-verified by violation
   | depends on: none
   | grade: [MET] — `bastrop_tx`/staff registered, cross-tenant read AND write refusal live-verified both directions in production. Close `_inbox/2026-09-03_g115-tenant-icc_close.json`.

2. **Bastrop UDC edition selection and citation still resolve correctly under the new tenant.** `bastrop_tx-bdc-2026-adopted` / `BASTROP-UDC` already exist in `code-lookup.mjs` (`AVAILABLE_EDITIONS`, two real sections `14-02-003`/`14-02-008`) — this item re-verifies under real conditions, not template-city's fixture parcels.
   | check: a live matrix run under the Bastrop persona on a real Bastrop parcel, edition `bastrop_tx-bdc-2026-adopted` declared, produces a genuine Pass or Fail on `14-02-003`/`14-02-008` with a structured citation (`editionId`/`bookId`/`sectionNumber`), not fabricated
   | depends on: 1
   | grade: [ ]

3. **Honest UDC coverage measurement, stated not assumed.** Only 2 sections of the Bastrop UDC are real today. This item measures, against a small sample of real or realistic Bastrop submittal types, what fraction of sections a genuine review would actually touch land as typed `Unchecked` versus a real Pass/Fail — so adoption risk is a known number before staff are asked to use this, not discovered after.
   | check: a stated sample (N real or representative submittal types, N to be set at build time) run through the matrix; the coverage ratio and the specific missing section numbers are reported in the close artifact, not summarized as a bare percentage
   | depends on: 2
   | grade: [ ]

4. **ICC (IBC/IPMC) coverage wired, not just UDC.** Real Bastrop reviews are not UDC-only — IBC/IPMC sections apply too. OPS-17 A-105 found real, licensed IBC 2018 content already exists (4,825 atoms, live-retrievable via MCP) but `code-lookup.mjs`'s `CODE_BOOKS.IBC2018P6.sections` has no query path to it. This item wires that path.
   | check: a live matrix run citing a real IBC section (e.g. `1001.1`, confirmed live this session) returns a genuine Pass/Fail with a real citation sourced from the substrate, not typed absence for a section that actually exists; a genuinely non-existent or non-entitled section still correctly returns typed absence (violation-verified both directions)
   | depends on: none
   | grade: [MET] — real IBC section (`1001.1`) resolves with a substrate-sourced citation; nonexistent/non-entitled sections correctly typed-absent; IPMC2018P2 confirmed no real content, correctly left alone. Incidental fix: a pre-existing production defect in the shared payload-extraction code (silently breaking the standalone `/api/plan-review/code` route's resolved-section fetches since G-108) found and fixed — verified this did NOT affect `matrixFromChain`/any WDLL-graded determination. Close `_inbox/2026-09-03_g115-tenant-icc_close.json`.

5. **Tenancy/access is real, not an open persona list.** `_decisions/2026-08-17_g13_consumer_contract.md` notes "G-11 stays OPEN... does not claim SmartCity tenancy is enforced." Before real Bastrop staff credentials touch this surface, confirm whether that gap is acceptable for this card's scope or is a hard prerequisite — **this item is a decision to make, not an engineering task to assume the answer to.**
   | check: an explicit operator ruling recorded (accept current access model for this card's staff-count and blast-radius, or require real auth first), cited by decision record
   | depends on: none
   | grade: [MET] — operator ruled 2026-09-02: accept current model for this pilot, scoped to a small, named set of invited Bastrop staff; real tenancy/auth stays a separate tracked item, revisited before any wider rollout. This ruling itself, recorded here, is the decision record the check asks for.

6. **Staff go-live proof.** At least one real Bastrop staff member completes one real review workflow in `plan-review-app` end to end (upload, edition, matrix, determination) without operator hand-holding.
   | check: a named staff person, a named submittal, a determination they can act on, confirmed by that person, not inferred from system logs alone
   | depends on: 1, 2, 3, 4, 5

## Out of scope (this card)

**G-52** (SmartCity initiates an engagement from a MyGov permit record) — genuinely blocked on a missing feed (`template-city.grantedAdapters` is still `[]` per G-63's close); this card does not require or build toward it. **Leaflet replacement, Compass sidebar, next-city onboarding** — separate named island cuts per the 2026-08-17 sequence, each its own card. **Any change to `smartcity-os`** — absolute no-touch; PermitFlow is not deprecated, unlinked, or modified by this card. **The MyGov/Samsara/OpenGov live feeds** — untouched. **A live DNS/branding decision for where Bastrop staff actually navigate to** — named as a real open question but not built here unless you want it folded in.

## Amendments

(none yet — draft)

## Finish card (graded at close)

(not yet — draft)
