---
decision_id: 2026-09-03_bastrop_tx_dashboards_pack_ratified
date: 2026-09-03
owner: nick
status: active
related_canonical: [90_operations/OPS-17_govtech_stack_plan_of_record, _decisions/2026-09-02_plan_review_leads_the_bastrop_push, _decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding, _decisions/2026-08-17_dashboards_ui_then_one_feed, _inbox/2026-08-17_dashboards_missing_pieces]
---

# Decision

A real, tenant-private `bastrop_tx` city pack on `smartcity-dashboards` is ratified — the next step in the program's own "next city" sequence, not a Bastrop cutover.

## Context

`plan-review`'s Bastrop work (G-115, OPS-17 A-108 through A-110) is done: a real `bastrop_tx` tenant/persona exists there, with cross-tenant refusal, live UDC/IBC citations, and an honest coverage measurement. Operator direction 2026-09-03: build out the rest of `smartcity-dashboards` for real for Bastrop — a parallel dashboard the city can eventually be cut over to — following the same UI-then-one-feed-at-a-time sequencing the gap map (`_inbox/2026-08-17_dashboards_missing_pieces.md`) already lays out.

`smartcity-dashboards` currently has no real city pack — only `template-city`/`empty-city`/`fixture-city`, all demo/fixture. `src/city-pack.mjs`'s `assertCityPackShape` (from G-11, 2026-08-17, `37ba83c`) throws if a pack's `cityKey` is the literal string `"bastrop"` — a deliberate policy tripwire from the era of "do not start a Bastrop tenant" rulings (`_decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding.md` and others), not a bug. `bastrop_tx` is a different string and is not blocked by that check, but creating any real Bastrop-identified pack deserves an explicit ruling of its own, the same way G-115's plan-review tenant was grounded in an explicit operator approval rather than a silent insert around an old guard.

## Reasoning

The program's own gap map names "next city" as its final recommended-sequence step, gated on the UI existing and one feed being proved on the template first — both of which are now true (Wave 1 closed the UI shell; the municode calendar feed is already proven end-to-end, just misplaced on `template-city`, see the companion finding this session). `bastrop_tx` is already the ratified identity for this exact city on the sibling `plan-review` repo; using the same key on `smartcity-dashboards` is consistency, not a new naming decision.

This is explicitly **not** a cutover. Live Bastrop (`smartcityos.io`, PermitFlow, the welded ops app) stays 100% live and untouched. The new pack's `environment` is `"staging"`, not `"live"` — no real staff are using it yet and no go-live has been declared for it, matching the environment badge's own stated purpose (never let the badge claim more than is true) and the same staged-approval shape G-115 used (mechanism proven, then a separate, later, explicit staff go-live item).

## Structural commitment check

- Sell reasoning, not data: unaffected — this is a tenancy/sequencing decision, not a product-shape change.
- Confidence earned, not asserted: the new pack starts `generatesFixtures: false`, `grantedAdapters: []` — it asserts nothing it hasn't earned; every domain on it will read as `no-fixture-source`/not-granted until a real feed is actually wired, honestly.
- Cost per jurisdiction onboarded: directly relevant — this is the first real test of the "next city" machine the gap map describes (pack + grants + adapters + records with provenance), not a special-cased rebuild.
- Dual interface: unaffected.

## Reversal criteria

Reverse (retire the pack, or re-flip it to fixture-only) if the operator decides the Bastrop-on-Dashboards effort should wait behind other lanes, or if a real go-live for `bastrop_tx` on plan-review (G-115 item 6) surfaces a blocker that changes the sequencing.

## Dependencies

Depends on: G-115 closed (A-108 through A-110), the municode-calendar identity finding this same session.
Feeds: G-116 (new OPS-17 row — Bastrop pack foundation + first real feed on Dashboards).
Does not reopen: the G-11 guard's literal `"bastrop"` block, which stays in place for any future unratified literal-name pack. Does not authorize a staff go-live — that remains its own, later, explicit item.
