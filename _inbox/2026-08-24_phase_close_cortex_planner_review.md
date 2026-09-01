---
id: 2026-08-24_phase_close_cortex_planner_review
title: Planner review — LDT phase-close owner gate + chat websearch
date: 2026-08-24
plan_row: P-60
wdll: _inbox/2026-08-24_phase_close_live_qa_WDLL.md
tree: P:/tmp/ldt-phase-close
branch: fix/pe-phase-close-owner-chat
base: 85a0d2b7
---

# Planner review (WDLL items 1 and 4)

Read the write path, not the agent summary.

## Item 1 — accepted on tree

`callerGrantsOwnerFact` is the admission condition. It requires a PE user id and `subscriptionTierGrantsStudio`. Load is `grantsOwnerFact ? loadOwnerFactAtom : null`. Else `studioGatedOwnerFactRefusal`. Identified-only, Solo, unlock, and anonymous fixtures were written to fail if `ownerName` is present.

`isIdentifiedOwnerFactCaller` still exists as session-only. It is no longer the load gate. That is correct leftover naming, not a live leak.

**Residual:** `resolvePeEntitlement` maps `devRole` to `team`. A tester account with destrole still sees owner. That is existing entitlement law, not this leak. Live QA on a destrole seat will not prove the gate.

## Item 4 — accepted on tree

`/research/chat` calls `resolveResearchChatWebSearchBackup` after atom retrieval. School / ADU miss fetches allowlisted civic URLs and stamps `websearch:` plus disclosure. ADU corpus-hit test asserts no `websearch:`. Fetch fail is a degraded reason, not a silent skip. ICC review targets for `bastrop_tx` stay empty.

**Residual:** civic URL table is Bastrop, Georgetown, and TEA. Other jurisdictions on a school miss get TEA only. That matches the leave_behind the lane named.

## Rejected alternate

GIS/CAD paint as the leak: bake sanitize and `ownerFromInspectWire` already refuse non-owner-fact sources. The live name was identified-session `ownerFact`.

## leave_behind

PE paint (item 2), checkout popup, Find 404, hosted-kill, live keys. No commit from this review.
