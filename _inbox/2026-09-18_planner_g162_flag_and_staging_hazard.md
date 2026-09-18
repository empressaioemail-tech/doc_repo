# g162 close: two items to route, one of them fleet-wide

Filed by the integration-seat planner after reading
`_inbox/2026-09-18_g162-v1-finance-honesty_close.json` at source. The row `G-162` has been regraded
`CLOSED-PARTIAL` and the tracker agrees. Two things in that close are not settled by the regrade.

## 1. The close is MALFORMED and should be corrected by its lane

`closedAt` and `seat` are both `undefined`. The two sibling closes filed the same day carry both
(`g153`: `closedAt 2026-09-18T20:38:32Z`, seat `cente-vsc-g153`; `g160` parcel 2:
`closedAt 2026-09-18T20:36:00Z`, seat `cente-vsc-g160p2`).

Why this is not cosmetic: a close that cannot state when it closed cannot be sequenced against a
sibling, and this program sequences lanes deliberately (`A-144`'s one-dashboards-lane rule, `A-154`'s
queue-behind decisions). The close schema in the compiled dispatch lists `closedAt` and `seat` as
fields. **Routed back to the lane to file a corrected close; recorded here rather than smoothed,
because a malformed close that still parses is the shape that survives to bite a later reader.**

## 2. The `staging` `smartcity-os` database IS the production one

This is the item that is not about `g162`. The close states it plainly: **the `staging` smartcity-os
database is the production database**, so any future lane told to test against staging is writing to
production data. The close's own words, kept verbatim because a paraphrase would soften it:

> **the `staging` smartcity-os database IS the production one**, so any future lane told to test
> against staging is writing to production data.

This outranks `g162`, because it is a statement about every lane that will ever be handed a
staging-environment instruction, including lanes in other programs. It also sits beside the close's
related finding that `requireTenant` binds an anonymous visitor to the demo tenant (slug `your-city`,
id 1), which the close calls deliberate but "default a city" in the direction the proving pack's rule 3
cares about. Two possible mechanisms should be distinguished before any fix, and this seat cannot read
the write path from `doc_repo`:

1. The `staging` app is bound to the production database by an environment variable or connection
   string, so the name is a label on the wrong target. This is the more dangerous reading and the one
   the close's sentence asserts.
2. The name is accurate and the close meant that a lane's staging DML reaches shared tables through a
   schema or service in common. This is less severe and would need different remediation.

**Routed to the owning seat with the mechanism named as unestablished rather than assumed, because
"staging is production" and "staging shares a service account with production" imply different repairs.**
Until it is read at source, **no lane should be handed a "test against staging" instruction.**

## 3. What the close left unfixed, by its own naming

- `/api/finance/permit-revenue/outstanding` HAVING clause silently excludes permits whose collections
  exceed their charges. This is the same defect class as the clamp `g162` fixed, one route over.
- `requireTenant` binds an anonymous visitor to the demo tenant. `g162` corrected the row's own harm
  statement here: tenant 1 is the DEMO tenant and holds zero of the 311,736 `mygov_fees` rows, so the old
  default would have answered as the demo city, not as "somebody else's fees". The row text is wrong and
  the close is right.
- **The operator still owes the MyGov fee report window**, which the close names as the now-binding
  constraint on the figures rather than resolving it. That is an operator act, not a lane one.

## 4. Debt the close declares on purpose

`g162-v1-uat` carries **18 placeholder env values and a lane-generated platform key**, so it is a proof
surface and not a staging environment. The close labels it as such rather than leaving it implicit, which
is the correct handling per `ENFORCEMENT.md` (degradation is permitted only when declared). Worth noting
for whoever later assumes `g162-v1-uat` is reusable infrastructure: it is not.
