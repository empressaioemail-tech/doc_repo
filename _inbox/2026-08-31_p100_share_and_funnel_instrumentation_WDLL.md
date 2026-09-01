---
id: 2026-08-31_p100_share_and_funnel_instrumentation_WDLL
title: WDLL — P-100: share-loop and funnel instrumentation, the affiliate launch gate
date: 2026-08-31
last_updated: 2026-08-31
status: open
applies_to: legacy-design-tools (cortex-api gtm_events), hauska-map (property-explorer emitters)
plan_row: P-100
depends_on: _decisions/2026-08-31_ctx_gtm_rulings.md ruling 3, _smartsite_gtm/01_central_texas_gtm_strategy.md, _inbox/2026-08-10_smartsite_humanless_gtm_handoff.md items 5-7
operator_go: 2026-08-31 ("assign p100")
snapshot: planner read origin/main read-only 2026-08-31 — legacy-design-tools 394424f2, hauska-map fbda04aa
owner: property seat (lane planner); planner verifies and commits doc_repo
---

# P-100 share-loop and funnel instrumentation

Date: 2026-08-31  Status: open

This card is the declared gate on affiliate link distribution (`_decisions/2026-08-31_ctx_gtm_rulings.md` ruling 3). Until it closes, affiliates may be recruited and kits written, but no link goes out.

## Start from this correction, not from the old doc

`_inbox/2026-08-24_track_coverage_map_DRAFT.md` says the funnel events are not wired and `76h` describes them as a plan. **Both are stale.** A read of `origin/main` on 2026-08-31 found the infrastructure already exists: `lib/db/src/schema/gtmEvents.ts`, `gtmConsent.ts`, `artifacts/api-server/src/lib/recordGtmEvent.ts` with many live call sites across `brokerageBilling.ts`, `brokerageBrief.ts` and `brokerageBuyBoxTeacher.ts`, a `gtmClient.ts` emitter in the PE app, and `share_created` / `share_viewed` emitted from `brokerageWorkspace.ts:480` and `:129`.

This card is therefore NOT a build from zero. It is measure, then close the named gaps. A lane that rebuilds an existing writer fails this card.

One gap is already established by a repo-wide read and does not need re-measuring: **sharer attribution does not exist.** `sharerUserId`, `referredBy`, `attributedTo`, `referrerUserId` return zero hits across `artifacts/` and `lib/db/`. A recipient who signs up is not credited to the sharer anywhere.

One suspicion is NOT established and item 1 settles it: the known `share_created` / `share_viewed` emitters live in `brokerageWorkspace.ts`, which is the brokerage workspace surface, not necessarily the Smart Site `/share#token` plane served by `pe-share-view.ts`. Events firing on the wrong surface would read as instrumented while measuring nothing about the Smart Site share loop.

## Done looks like

A named person can answer, from a query rather than from a narration: how many shares were created last week, how many were viewed, how many viewers signed up, which sharer each signup belongs to, and what fraction of new accounts arrived by share versus affiliate versus organic. Each of those answers can come back zero, and zero is distinguishable from unmeasured. Consent state is carried on every event and no event type is emitted that lacks one.

## Acceptance items

1. **Measure before building. Three states, never collapsed.** For every funnel and share event type named in `gtmClient.ts`, `brokerageGtm.ts` and the locked handoff, report which of three states it is in: no writer exists; a writer exists but has never written a row; rows exist. Report the surface each writer is mounted on and, for share specifically, whether the Smart Site `/share#token` plane emits at all or whether only the brokerage workspace does. Absent, zero, and unmeasured are three different findings and a table that merges them fails this item. | check: a dated artifact carrying the three-state table plus the query that produced it | grade: [ ]

2. **The Smart Site share plane emits.** `share_created` on the sharer's action and `share_viewed` on the recipient's load, from the Smart Site share path, carrying the grant row id. If item 1 finds this already true, this item closes by citing that evidence and NOTHING is built. If it finds the events fire only on the brokerage workspace, they are added to the Smart Site plane without a second writer for the same subject. | check: fail-then-pass test on the Smart Site path; a duplicate-subject writer fails the card | grade: [ ]

3. **Sharer attribution, the genuinely absent piece.** A recipient who arrives on a share and later creates an account is joined back to the sharer, durably, by the grant row id rather than by a client-asserted value. The join survives the anonymous-to-account claim flow, which is the recorded trap: an auth flip that orphans anonymous data would silently drop every share attribution. Attribution is never written by the client. | check: fail-then-pass covering an anonymous view then signup; a violation where the client asserts a sharer must be refused | grade: [ ]

4. **Activation events.** First parcel inspected, first property saved, first report opened, each fired once per account with the honest first-time semantics. `pe_activation_events` already appears in the codebase; item 1 establishes whether it is fed. Without activation the affiliate program cannot tell a good audience from a bad one, which is the reason this is in the gate. | check: fail-then-pass; a re-fire on the second occurrence fails | grade: [ ]

5. **Consent is carried, and is year-zero.** Every event carries its consent state at emit time. The locked rule is that consent flags cannot be retrofitted, so an event emitted without one is a permanent hole rather than a later fix. An event type that can be emitted with consent absent, rather than refusing, fails this item. | check: a violation test emitting without consent must refuse, not default | grade: [ ]

6. **A readout that can go red.** One query or endpoint returning the six numbers in Done-looks-like, with share and affiliate reported side by side as the locked handoff requires. It must be able to return zero and to return unmeasured, and those must render differently. A readout that always finds a number is the defect class this operation is named against. | check: run it against a period with no activity and show it returns zero, then against an unmeasured event type and show it says so | grade: [ ]

7. **Verify by violation, both directions.** Every check above is shown failing on a deliberate violation and passing on restore, with the verbatim failure text. A check observed only passing has not been observed working. | check: the close artifact carries both directions per item | grade: [ ]

## Explicitly not this card

Do not build a second gtm_events store or a parallel event writer. Do not wire the GoHighLevel CRM sync; that is P-99 and it depends on the Stripe live switch. Do not touch PromoteKit, which attributes against Stripe and is owned by the affiliate group. Do not change the share fidelity rule: a share carries everything the sharer stored, regardless of recipient tier, and that is locked. Do not put tenant-private research on any event; that a parcel was inspected may cross, which parcel may not.

## Leave behind

Declared at close per the contract, `none` being a valid answer.
