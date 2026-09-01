---
id: 2026-08-28_p94_team_roster_WDLL
title: WDLL — Smart Site Team roster server half
status: approved
last_updated: 2026-08-28
operator_approval: 2026-08-28 operator go (add P-94, then PR, apply 0089, deploy cortex)
plan_row: P-94
---

# WDLL: Smart Site Team roster server half

Date: 2026-08-28  Status: approved
Operator approval: 2026-08-28. OPS-16 A-048 added P-94. The reviewed isolated tree may PR, apply 0089, and deploy cortex.
Plan row: P-94
Repo: `legacy-design-tools` only. Isolated worktree `P:/tmp/legacy-design-tools-team-roster` on `feat/pe-team-roster`. Never `P:/seat-worktrees/property/legacy-design-tools` (P-85), `-mcp`, `-publish`, `-rename`, or `-daily-limit`.

The Settings Team tab is live on smartsite.cloud against GET `/api/property-explorer/v1/team/members` and renders honest "Not read" on 404. Client already parses the shape below. No fixture rows. A test fails if design-comp specimen addresses appear.

## Done looks like

A signed-in owner can read the roster, invite until purchased seats are held, and cannot orphan the account. The client tab lights up with no client change. Seat enforcement is on the server. Anyone with a session who POSTs directly is still refused at capacity. An invitation holds a seat from send, not from accept.

## Acceptance items

1. **Read shape.** GET `/api/property-explorer/v1/team/members` returns 200 `{ members, seatsPurchased, viewerEmail, viewerRole }` with `role` only `owner|member` and `status` only `joined|invited`. `at` is ISO or null. 401 is sign-in. Check: live or integration against the client parser. Grade: [ ]

2. **seatsPurchased honesty.** The field is a number or absent. Never 0 to mean unknown. An account with no team subscription omits the field. Check: that account; client keeps null distinct from zero. Grade: [partial 2026-08-29] writer serving; live omit until a Team Stripe event

3. **No third role.** A row whose role is not owner|member is not sent. Check: server never emits `administrator`. A planted `administrator` is dropped by the client and the roster still renders (contract check). Grade: [ ]

4. **Invite holds a seat.** POST `.../team/invitations` `{ email, role }` writes a row and counts toward consumed immediately. consumed = accepted members + outstanding invitations. Check: table row exists; seats used includes it before accept. Grade: [ ]

5. **Over capacity refuse.** POST when every seat is held is refused with a named error and no row written. Check: the table, not only the response. Grade: [ ]

6. **Cancel invite / remove member / patch role.** DELETE invitation `:id`, DELETE member `:email`, PATCH member `{ role }` exist and are owner-only. Check: member session cannot invite or remove. Grade: [ ]

7. **Last joined owner.** DELETE or PATCH-to-member of the only joined owner is refused. Invited owners do not count. Check: both verbs; table unchanged. Grade: [ ]

8. **No silent cap.** The server does not truncate the invite and return 200. Check: violate item 5. Grade: [ ]

## Out of scope

Dunning. Stripe customer portal. Leaving an account yourself. SSO. Domain capture. Per-member usage. Checkout / `src/checkout/`. Live Stripe key swap.

## Amendments

- 2026-08-29: hauska-map BFF must allowlist GET `api/property-explorer/v1/team/members` on `DEEP_GET_EXACT`. Isolated tree `P:/tmp/hauska-map-p94-allowlist` branch `feat/p94-team-allowlist`. Do not rewrite `teamClient`. Reason: live dummy-cookie GET is 403 `Path not on deep allowlist`; cortex serving `00656-vek` @100% already has the route. Writes stay off the allowlist because the Settings invite control is display-only.
