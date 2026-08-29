# p94-team-roster scratch

GROUND-TRUTH 2026-08-28T23:50Z: OPS-16 A-048 added P-94 on doc_repo main (local, uncommitted). WDLL `_inbox/2026-08-28_p94_team_roster_WDLL.md` flipped to approved. Decision `_decisions/2026-08-28_p94_team_roster_server_half.md`.

GROUND-TRUTH 2026-08-28T22:39Z (from lane close): isolated tree `P:/tmp/legacy-design-tools-team-roster` branch `feat/pe-team-roster` base `89e539f6`. 19/19 violate tests. Not committed. Not deployed.

OPEN: owning chat does PR, apply 0089, cortex canary / migrate / smoke / shift. Do not start a second writer on that tree (same class as OPS-19 A-003 drain/writer collision).

LESSON: two leftovers stay named and separate. (1) Stripe webhook still writes `subscription_tier` only; live Team GET omits `seatsPurchased` and POST invite 409s `seats_purchased_unknown`. (2) Accept-invite is not built; `ensureOwnerMembership` makes an invited sign-in a new owner. Do not collapse them.

DEAD-END: spawning a second Task agent onto `P:/tmp/legacy-design-tools-team-roster` while the reviewed chat still holds the dirty tree. That is a second writer.
