---
decision_id: 2026-09-01_owner_policy_and_portal_access_rulings
date: 2026-09-01
owner: Nick (operator), recorded by doc_repo planner
status: active
related_canonical:
  - _inbox/2026-08-31_owner-policy_close.json
  - _inbox/2026-08-31_capability_inventory.md
  - _inbox/2026-08-30_p91_measurement_x3_clerk_index.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md
---

# Two operator rulings, 2026-09-01

## 1. Owner fields: Option B, with backfill

**Ruled.** Stop writing `ownerName` and `ownerMailingAddress` to `cad-parcel-roll`.
`owner-fact` becomes the sole home for owner data. **And** strip those fields from the
existing bodies.

Both halves are authorised, and they were authorised separately because the backfill
is a mutation on production data and the forward fix is not.

**No interim stopgap.** The fix rides normal cadence; no additional stripper is bolted
onto the MCP surface. That approach was evaluated and rejected: protection belongs in
the atom's policy, not in every consumer remembering to strip.

### The measured state this rules on

238,846 owner names and 239,472 mailing addresses sit on `public-free`
`cad-parcel-roll` atoms and are reachable anonymously through the MCP catalog today,
populated in Bastrop (77,078), Caldwell (48,384) and McLennan (113,384) and near-empty
in Hays, Travis and Williamson.

The twin does not serve them: the conformant bake never reads them, `assertNoOwnerKey`
guards the bake output, and `sanitizeNodeFacetPayload` strips owner-shaped keys at any
depth. The exposure is the MCP catalog tools, which return whole `public-free` bodies
with **no field strip** by design.

`ownerName` on the roll atom is **not load-bearing** for any serve-time join;
owner-match reads `cad_property`. So nothing depends on the free copy.

### The operator's framing, which is the real reason

> "We are selling convenience for the users to get the data in bulk with us, so it's
> paid."

The product does not sell secret data. Texas property records are public and the brief
already serves owner name at the FREE tier from `cad_property` on a separate surface.
**What is sold is aggregated, convenient access.** An anonymous MCP catalog call that
returns whole atom bodies *is* bulk convenience, given away.

So this is not a privacy remediation and should not be described as one. It is
protecting the thing the paid tier actually sells. `owner-fact` is `public-paid` and
its writer calls itself "THE ONE PAID PROPERTY ATOM"; the same data sitting inside a
free atom undercuts that directly.

### Reversal criteria

Reverse the forward fix if a serve-time join is found that genuinely requires
`ownerName` on the roll atom. None was found; the enumeration covered engine, LDT and
MCP.

Reverse the backfill only if stripping is shown to break a consumer that reads roll
bodies for a non-owner purpose and cannot tolerate the absent keys.

## 2. Portal access: ruled internally, no counterparties

**Ruled.** The decision is taken internally. It does not go to counsel and **no
counterparty agreement will be sought.** Local Government Code 191.008 access
agreements and priced bulk products are off the table; that fork was already retired
as mis-scoped on 2026-08-31 because P-85 is a per-request path and not a bulk
acquisition.

**Human initiation stands.** The operator's position is that authorisation on our side,
by the user who requests records, is the human initiation. The per-request model is the
right shape and is kept.

**A throttle will be respected.** Retrieval gets rate limiting rather than running
unbounded.

### What this ruling replaces

The permission column gating automated portal search was set on **2026-08-26** by
`scripts/p85/apply-operator-portal-rulings.mjs`, in a single loop across all six
portals, with `terms_text` written as a literal placeholder. Measurement X3, dated
**2026-08-30**, found robots.txt disallows automated access at Bastrop, Travis and
Williamson. **That permission predated the evidence and was never re-taken.** This
ruling is the re-taking, made with the measurement in hand.

### What the planner flagged, recorded because the ruling was made over it

Raised once and not re-litigated. `robots.txt` is a statement by the site operator
about **automated access**, and it does not distinguish who authorised the automation.
A user clicking "get records" does not make the subsequent headless navigations
non-automated from the portal's perspective. The operator has ruled and the ruling
stands; this is recorded so the reasoning is visible rather than assumed absent.

### Three engineering changes that follow, and are not optional under this ruling

1. **Add the throttle.** Ruled explicitly.
2. **Remove the WAF-shaped user-agent.** The worker sends a desktop Chrome UA whose own
   code comment says it is shaped for "WAF-sensitive portals". A user-agent
   deliberately shaped to pass a web application firewall is the single artifact that
   reads worst in any later review, and it is cheap to remove. Good-faith access does
   not need to look like a browser it is not.
3. **Fetch and record `robots.txt`.** The string `robots` appears zero times in the
   worker tree today, so the posture is not merely unobserved, it is unknowable. Even
   under a ruling to proceed, fetching and logging it converts "we never checked" into
   "we checked and made a decision", which is the difference between a considered
   position and an absent one.

Retrieval depth stays as ruled: up to three queries plus detail navigations, per
request, throttled.

### The 14 BLOCK re-runs are PERMITTED under this ruling

Ruled 2026-09-01. Fourteen issued records requests on three Bastrop parcels
(`48021:34161` block 13, `48021:34753` block 27, `48021:35481` block 49) were planned
without a block term because the retired `BLK(?:OCK)?` pattern could never match
`BLOCK`. They may be re-run.

**The other seven stay held**, and not for a policy reason: they are letter-only blocks
(`BLOCK A`, `BLOCK F`, `Block D`, `BLK D`) across 48453, 48209 and 48309, and the
shipped parser still requires a leading digit. Re-running them today reproduces the
same null. They wait on a parser widening, which is its own card.

### Reversal criteria

Reverse if a portal operator objects directly, if a portal's terms change materially,
or if a block or rate-limit response indicates the throttle is insufficient. A 403 or a
WAF challenge is a signal to stop and re-rule, never to work around.

```
leave_behind:
  - item: implement Option B forward fix and the ~239k body backfill
    owner: property / substrate
    plan_row: P-91
  - item: portal throttle, WAF-shaped UA removal, robots.txt fetch and log
    owner: property
    plan_row: P-85
  - item: the 7 letter-block jobs stay held; the shipped parser still stores null on a
      letter-only block, so re-running them reproduces the same null
    owner: property
    plan_row: P-85
```
