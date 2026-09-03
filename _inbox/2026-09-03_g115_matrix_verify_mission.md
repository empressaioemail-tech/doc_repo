---
id: 2026-09-03_g115_matrix_verify_mission
title: Mission — G-115 item 2 (live matrix run under bastrop_tx)
status: active
last_updated: 2026-09-03
applies_to: plan-review
owner: nick
related:
  - _inbox/2026-09-02_bastrop_permitflow_islandcut_WDLL
  - 90_operations/OPS-17_govtech_stack_plan_of_record
  - _inbox/2026-09-02_g115_tenant_and_icc_wiring_mission
  - _inbox/2026-09-03_g115-tenant-icc_close
---

# Mission: G-115 item 2 — live matrix run under the real Bastrop tenant

Start card: `_inbox/2026-09-02_bastrop_permitflow_islandcut_WDLL.md` (approved 2026-09-02). Items 1, 4, 5 are MET (A-108) — the `bastrop_tx`/`staff` persona is live with cross-tenant refusal proven, and IBC live-citation wiring works. This mission covers item 2 only: re-verifying that UDC edition selection and citation resolve correctly THROUGH that real tenant, on a real Bastrop parcel — not `template-city`'s fixture parcels, and not the mechanism-only proof item 1/4 already gave.

## Standing constraints (binding, unchanged from the card's approval — do not violate)

1. **Live Bastrop (`smartcity-os`, `smartcityos.io`, PermitFlow) stays 100% live and untouched.** Nothing here touches that repo or service.
2. **Additive only.** This mission creates plain engagement records through the existing, already-shipped intake path — the same path any real user hits. No schema change, no new endpoint, no touching `CODE_BOOKS`/`AVAILABLE_EDITIONS`/`buildCitation()`/the absence taxonomy.

## What "done" actually means here — read this before running anything

**A real, source-checked correction to the WDLL's literal wording, not an assumption:** the WDLL's check for this item asks for "a genuine Pass or Fail on `14-02-003`/`14-02-008`." Read `src/mcp.mjs`'s `matrixFromChain` (lines ~303–343) before treating that as two adjudicable rows — it is not. `14-02-003` (district requirements / front setback) is wired to `adjudicateMinimumSetback()` and genuinely reaches Pass or Fail. `14-02-008` (permitted-use table) has **no adjudication logic at all**, by explicit design (`src/mcp.mjs`'s own comment: "not a fabricated Pass" — `Uncertain` is reserved for a genuine authority conflict per the transaction contract, missing adjudication logic is honestly `Unchecked`). `14-02-008` will correctly return `Unchecked` with a real, structured citation and a real typed-absence basis every time, regardless of tenant or parcel — that is not a defect to chase.

So the honest target for this item: a genuine Pass **or** Fail on `14-02-003` (both reachable, per `adjudication.test.mjs`'s existing coverage — pick one or demonstrate both), plus confirmation that `14-02-008` returns its expected real-citation Unchecked row, not a fabricated determination and not `SOURCE_UNAVAILABLE`. If you find this reading wrong, stop and report rather than silently reinterpreting the WDLL text back to its literal form.

## Steps (verify by violation — actually make the calls, don't infer from code review)

1. **Resolve the live serving URL before assuming the one below is still current:**
   `gcloud run services describe plan-review --project plan-review-505715 --region us-east1 --format='value(status.url)'`
   (Last known, per the 2026-09-03 g115-tenant-icc close: `https://plan-review-ozx33wafia-ue.a.run.app`, revision `plan-review-00014-bbg` @100%. Confirm current before trusting it.)

2. **Create a real engagement under the Bastrop persona**, using the same real Bastrop parcel already proven live under G-108's own walk (A-095: `48021:34737`, Bastrop County FIPS 48021 — a parcel identity, not tenant-scoped, safe to reuse under a different persona):
   `POST /api/plan-review/engagements` — body `{"orgId":"bastrop_tx","userId":"staff","parcelNodeId":"48021:34737","projectType":"setback-review","scope":"G-115 item 2 live verification"}`
   Confirm the response's `orgId` is `bastrop_tx`, not `template-city` — this is the one thing item 1 proved the mechanism CAN do; this call is the first time a real caller actually did it for this specific check.

3. **Declare the Bastrop UDC edition, with a proposed value that should Pass** (this parcel's real `setback-rule.front` minimum was 25 ft per A-095's live read; unchanged since, but confirm rather than assume if the value returned in step 4 disagrees):
   `POST /api/plan-review/engagements/<id>/edition` — header `x-persona: bastrop_tx/staff` — body `{"editionId":"bastrop_tx-bdc-2026-adopted","proposedSetbackFrontFt":30}`
   Reject the response if `editionId` isn't accepted (400 `unknown_edition`) — should not happen, but don't skip checking.

4. **Run the matrix and inspect the two real rows:**
   `GET /api/plan-review/engagements/<id>/matrix` — header `x-persona: bastrop_tx/staff`
   Confirm on the `14-02-003` row: `determination` is `"Pass"`, `absence` is `null`, and `bookId`/`editionId`/`sectionId` are populated (not fabricated — cross-check `editionId` equals `bastrop_tx-bdc-2026-adopted`, `bookId` equals `BASTROP-UDC`). Confirm on the `14-02-008` row: `determination` is `"Unchecked"`, `citation` is a real non-null string (proves the citation path resolved even though no Pass/Fail exists here), and `absence.status` is `UNCHECKED` — not `SOURCE_UNAVAILABLE` (which would mean the tenant/persona context broke something item 4 already fixed).

5. **Prove Fail is also reachable, not just Pass** (a second engagement, or re-declare the edition on the same one with a below-minimum value — check whether `setEngagementEdition` allows re-declaration before assuming):
   Repeat steps 2–4 with `proposedSetbackFrontFt: 15`. Confirm `14-02-003` now returns `determination: "Fail"`, `absence: null`, and a `detail`/`analysis` string naming the actual proposed and required values (not a generic message).

6. **Do not touch item 3 or item 6.** Item 3 (coverage measurement) depends on this item landing first and is a separate, larger mission. Item 6 is the operator's own action.

## Close

Report per the standing dispatch/close-artifact convention. If the Pass/Fail-on-both-sections reading above turns out to be wrong (i.e., you find real adjudication logic on `14-02-008` this mission missed), name that explicitly as a correction, not a silent reinterpretation.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-03_g115-matrix-verify_cp1.json
  CP2: _inbox/2026-09-03_g115-matrix-verify_cp2.json
  CLOSE: _inbox/2026-09-03_g115-matrix-verify_close.json
