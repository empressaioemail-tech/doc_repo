---
id: 2026-07-31_HELD_doc_repo_audit_and_smart_site_reconciliation_plan
title: HELD — doc-repo audit + scrub + smart-site reconciliation dispatch plan (DO NOT RUN YET)
date: 2026-07-31
status: HELD dispatch plan (operator to release)
owner: nick
related: [42_stub_thesis_national_twin_substrate, 41_three_wedge_spine_strategy, 2026-07-31_SESSION_CAPTURE_smart_site_naming_block_cert_and_open_board, _catalog/repo_intents]
purpose: The plan to reconcile the ENTIRE doc set (and eventually all repos) to the ratified "smart site" thesis, archive stale docs, and issue corrected ones. WRITTEN AND HELD per operator — release when ready. Big program; multi-planner + subs.
---

# HELD — doc-repo audit + smart-site reconciliation plan

DO NOT RUN until operator releases. This is the cross-repo doc reconciliation the thesis work has been seeding. Now unblocked by the NAME ("smart site").

## WHY (the trigger)
Multiple strategy ratifications this session (three-wedge, stub→SMART SITE, two-altitude positioning, own-public/connect-RWA, plan-review-keystone, SDK-attestation-already-built) reframe the portfolio. Many canonical docs predate these and now MISLEAD. And the vocabulary changed: "stub"→"smart site", "property dossier/brief"→"smart site X-ray", plus the two-altitude rule (never lead market-facing with "digital twin"). This is a reconcile-and-archive program, not a single edit.

## SCOPE (phased; each phase a dispatch)
PHASE A — AUDIT (read-only, produce the map before touching anything).
- Enumerate every canonical doc + inbox/decision/session doc. For each: is it CURRENT / STALE / SUPERSEDED / CONTRADICTS-new-thesis? Tag with which new ruling it conflicts with (three-wedge, smart-site naming, two-altitude, own/connect posture, SDK-attestation-built, plan-review-keystone, block-cert-restored, per-parcel-record source).
- Produce a RECONCILIATION LEDGER: doc → verdict → action (keep / update / archive / merge / supersede). NO edits in Phase A — just the map. This is the anti-"edit blindly" gate; the ledger is reviewed before any change.

PHASE B — CORE THESIS REWRITE.
- 09_post_saas_substrate_thesis → reframe around national-smart-site / RWA-ready / two-altitude / own-public-connect-private. 
- Establish the SMART-SITE canon + the X-RAY product rename + the two-altitude positioning rule as their own canonical docs (or fold into 42/41 as the authorities).
- _catalog/repo_intents → update per-repo intent to the three-wedge / smart-site frame.

PHASE C — PROPAGATE THE NAME + PRODUCT RENAMES.
- "stub" → "smart site" everywhere (docs; NOT code yet — code rename is a separate later program).
- "property dossier / property brief" → "smart site X-ray" in product/positioning docs (flag any that are customer-facing copy vs internal).
- Two-altitude enforcement: flag any doc/dispatch that leads MARKET-FACING with "digital twin" / "RWA" / "atom substrate" — correct to the external message.

PHASE D — ARCHIVE STALE (status-flip, never delete, per conventions).
- Docs written under retired assumptions (two-wedge, cortex-as-product, partnership-first-sourcing, pre-SDK-grounding, pre-BDC setback framing, revoked-cert framing). Status→archived/superseded with a pointer to the doc that replaces them.

PHASE E — REGENERATE 00_current_state per the current_state_protocol, reflecting the reconciled set.

## DISCIPLINE (paste into every sub-dispatch)
- READ-ONLY audit FIRST (Phase A ledger) before ANY edit — do not edit blindly; the ledger is the reviewed plan.
- Retire via STATUS FLIP, never delete (01_doc_conventions).
- Bump last_updated; edit in place; frontmatter required.
- Stage EXPLICIT paths (shared clone has other seats' work — the concurrent-commit + stale-clone hazards; check git log -3 + origin tip before committing; commit promptly).
- Verify against LIVE state (gh/npm/gcloud) for any count/tool/contract fact — don't propagate stale numbers (the recon-vs-doc drift lesson).
- NAME is "smart site" (ratified). Product report is "smart site X-ray". Two-altitude positioning is CANON.
- This is DOCS ONLY. Code renames (stub/dossier→smart-site/X-ray in code) are a SEPARATE later program — do not touch code here.

## OUTPUT
Phase-A reconciliation ledger (the reviewed map) → operator OK → Phases B-E execute → a clean, smart-site-coherent doc set with stale docs archived-with-pointers. Multi-planner: A is one read-only fan; B-E are parallelizable by doc-band once the ledger is approved.

## RELEASE GATE
HELD until operator says go. Companion capture: 2026-07-31_SESSION_CAPTURE_smart_site_naming_block_cert_and_open_board.
