# p94-team-roster scratch

GROUND-TRUTH 2026-08-28T23:50Z: OPS-16 A-048 added P-94 on doc_repo main (local, uncommitted). WDLL `_inbox/2026-08-28_p94_team_roster_WDLL.md` flipped to approved. Decision `_decisions/2026-08-28_p94_team_roster_server_half.md`.

GROUND-TRUTH 2026-08-28T22:39Z (from lane close): isolated tree `P:/tmp/legacy-design-tools-team-roster` branch `feat/pe-team-roster` base `89e539f6`. 19/19 violate tests. Not committed. Not deployed.

OPEN: owning chat does PR, apply 0089, cortex canary / migrate / smoke / shift. Do not start a second writer on that tree (same class as OPS-19 A-003 drain/writer collision).

LESSON: two leftovers stay named and separate. (1) Stripe webhook still writes `subscription_tier` only; live Team GET omits `seatsPurchased` and POST invite 409s `seats_purchased_unknown`. (2) Accept-invite is not built; `ensureOwnerMembership` makes an invited sign-in a new owner. Do not collapse them.

DEAD-END: spawning a second Task agent onto `P:/tmp/legacy-design-tools-team-roster` while the reviewed chat still holds the dirty tree. That is a second writer.

GROUND-TRUTH 2026-08-29T00:34Z: LDT #537 merged `47f82749`. Canary `cortex-api-00653-yoy` @0% tag canary digest `sha256:976840636cd29ed942dc95e59bf693cf8f8362632afb3c76cf8c78dc74e7bdea` bake 50000. Serving still `00651-tor` @100%. latestReady is 00653-yoy and is not serving. Staging `00646-luj` stays 0%. Job 33223511364 applied `0089_pe_team_roster.sql` at 2026-08-29T00:26:45.854Z. Traffic not shifted. Team chat not closed.

OPEN: live Team tab blocked. Client hits `/api/spine-deep/api/property-explorer/v1/team/members`. hauska-map `DEEP_GET_EXACT` does not allowlist that path. Dummy `pe_session` on smartsite.cloud 403 `Path not on deep allowlist`. Unsigned canary GET 401 `authentication_required`. Need Nick Take Control + sign-in, and one-line allowlist exception (not teamClient). Then owning chat smokes, shifts, hard-refreshes. Close `_inbox/2026-08-29_p94_team_roster_deploy_close.json`.

LESSON: merged cortex is not a lit Team tab. The PE BFF allowlist is a second derivation. A 403 is error, not ready.

GROUND-TRUTH 2026-08-29T16:46Z: cortex traffic[] by field name: `00656-vek` percent 100 tag `p539`. `00653-yoy` percent null tag canary. Staging `00646-luj` percent null. latestReady `00656-vek`. Do not shift 00653-yoy.

GROUND-TRUTH 2026-08-29T16:46Z: live GET `/api/spine-deep/api/property-explorer/v1/team/members` unsigned 401 `authentication_required`. Dummy `pe_session` 403 `Path not on deep allowlist` Age 0 X-Vercel-Id cle1::iad1::lrhvs-1788022011228-212fb682c224.

GROUND-TRUTH 2026-08-29T16:52Z: PR https://github.com/empressaioemail-tech/hauska-map/pull/309 squash-merged `ed87e69`. CI conclusions Typecheck/test/No double-encoded source all `success`. Vercel `dpl_BGdiaTAMKNeEjGFCiYRtzWrpZfQZ` aliased smartsite.cloud. Dummy `pe_session` GET team/members is 401 authentication_required Age 0 (not allowlist 403). Same cookie on team/members/extra is still 403 allowlist. Unsigned 401. Close `_inbox/2026-08-29_p94_team_allowlist_close.json`.

GROUND-TRUTH 2026-08-29T16:55Z: operator verified Team tab. Roster lights. Seats Not read. Invite refused honestly.

GROUND-TRUTH 2026-08-29T17:28Z: LDT #547 merged `b5fc2e87`. Serving `cortex-api-00658-peq` @100% tag canary digest `sha256:e6cd1fb2…`. Staging `00646-luj` 0%. Previous `00656-vek` no percent. Writer persists seats from billed Team items. Existing rows not backfilled. Close `_inbox/2026-08-29_p94_seats_purchased_close.json`.

OPEN: operator 2026-08-29 dropped Team included seats 10 → 3 at the same $299/$2,990. Isolated trees `P:/tmp/legacy-design-tools-team-seats-3` and `P:/tmp/hauska-map-team-seats-3`. No live Team row to migrate. Stripe dashboard copy that still says 10 is Nick. Accept-invite stays named.

LESSON 2026-08-29T17:57Z: changing `baseSeats` without retargeting the pricing-modal and checkout fixtures fails PE CI. Those tests still asked for `value="10"` and 12-seat `$349` (old 10+2 extras). 12 seats on 3 included is `$524`. Violate leftover $45 extras on 12 seats is `$704`, not `$389`.

GROUND-TRUTH 2026-08-29T18:21Z: Team included seats 3 is serving. LDT #549 `810e26d1`. hauska-map #311 `d94d605`. Serving `cortex-api-00662-hij` @100% tag canary digest `sha256:74bc1031…` bake 50000. Staging `00646-luj` 0%. Previous `00660-bux` no percent. Vercel `dpl_EWv1k28ddG82H7K1ksAz2BnU7X5N` aliased smartsite.cloud. Live bundle `index-DClWxN0E.js` Age 0 has `up to 3 seats`, no `10 seats`. Close `_inbox/2026-08-29_team_included_seats_3_close.json`.

OPEN: first Team checkout with no extras must persist `seats_purchased=3`. Nick has no Team sub so Purchased stays Not read. Stripe dashboard copy that still says 10 is Nick. Accept-invite stays named.

OPEN 2026-08-29T18:58Z: operator keeps P-89 leftover on the MCP lane. This seat does not take hauska-mcp-server. Remaining takeable here: P-96 (approved, unblocked) or accept-invite (needs a Team grant to grade). P-90 stays draft. P-91 stays the other seat. Factory stays idle.
