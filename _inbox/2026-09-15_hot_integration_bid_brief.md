---
id: 2026-09-15_hot_integration_bid_brief
title: Bid brief — the hotel occupancy tax (Localgov Filings) integration
date: 2026-09-15
status: brief for pricing
kind: brief
owner: nick
programs: [OPS-17]
related:
  - _inbox/2026-09-15_localgov_filings_integration_scope.md
  - _design/smartcity-finance-filings/README.md
  - _decisions/2026-09-15_design_ratification_pass.md
---

# Bid brief — hotel occupancy tax integration

Everything here is read from the Azavar integration specification `bastrop-custom-api 1.pdf`
(generated 2026-08-06, delivered 2026-08-14) and from the scope card that works off it. **The
endpoint has never been called**, because no credential has been delivered, so nothing here is an
observation of live behaviour.

## Two things to settle before the number goes out

**1. "Who has not filed" is not deliverable on what has been specified.** It was described on the
call, and it is the single most valuable thing a city wants from a tax feed. The endpoint returns
`FilingId` (keys a filing) and `FilingRefId` (a receipt reference). **Neither keys a taxpayer.**
Without a taxpayer identifier the feed cannot list non-filers, cannot trend a single taxpayer, and
cannot count distinct taxpayers. That is question 4 to Azavar and it is unanswered.

Bid it as a **reconciliation instrument**. If Q4 comes back with a taxpayer identifier, compliance
work becomes a second, separately priced phase. Do not price non-filer reporting into this one.

**2. Nothing confirms this is hotel occupancy tax.** The endpoint is `bastrop-filings`, the product
is Localgov Filings, and **the response carries no tax-type field**. Nothing in the spec says hotel
occupancy. Until question 1 returns, every label has to read "Localgov filings" rather than "Hotel
occupancy tax". If Bastrop files more than one tax type through Azavar, the figures are a blend and
the reconciliation cannot be attributed.

Neither of these is an engineering problem and neither is fixable by us. Both are answered by one
email to Azavar.

## What the city is buying

A read-only reconciliation view: what was **filed**, what was **received**, and what the city
**booked** — three different facts from two independent systems, with the difference between them
shown and explained rather than blended into one revenue number.

That last part is the product. Azavar can already show the city its own filings. What nobody else
holds is both halves of the reconciliation — the vendor's filing data and the city's ledger — which
is what makes this worth building rather than linking to.

Read-only, one direction. The city keeps filing where it files today.

## What it consists of

Five pieces, in dependency order. Prove the feed before designing the surface.

**1. The client, the store and the platform route.** AWS Cognito authentication against the vendor,
token handling and refresh, error classification, rate-limit backoff, and a serial historical
backfill in date windows. A table holding every filing with its full column set and the raw payload
retained, plus a sync-status record so "fetched nothing" is distinguishable from "never ran". Dates
are bucketed on Chicago calendar days, because the vendor's ranges are local days while its
timestamps are UTC, and bucketing on the wrong one disagrees with the source at every period edge.

**2. The v1 surface.** A sixth tab beside Permit Revenue on the existing analysis page. Filed,
received and outstanding as three separate named measures.

**3. The v2 adapter and domain.** A new vendor kind, a record shape, a domain and the grant on the
Bastrop pack. Mechanical — the seam it plugs into already exists and carries five other vendors.

**4. The Finance lens in v2.** *This is the real cost and the reason it is its own line.* Finance in
v2 is currently four lines of configuration and nothing else — no finance content exists yet.
Filings would be the first. Anything quoted for "the Finance page" is mostly this, not the feed.

**5. The reconciliation.** The vendor's received amounts summed over a period against the city's
ledger for the same period, with both sides named and the processing-fee difference stated. Two
independently derived sources, which is the only kind of agreement worth reporting.

The design for the surface already exists and has been drawn. It is **not cleared to show the city
yet** — it currently prints an ordinance rate attributed to Bastrop's own code that traces to no
source. That is a small fix and it is on the critical path now that this integration is the
priority.

## What it explicitly does not include

Worth stating in the bid so it does not get assumed in later.

- No collection, no remittance, no payment rail
- No filing surface — the city files where it files today
- No taxpayer-level compliance or non-filer reporting until Q4 returns
- No change to the twelve existing platform integrations

## Blocked on, and by whom

**Azavar / the city.** Four credentials: production client id, demo client id, username, password.
The spec describes them; it does not carry their values. Verified absent across both production
environments and every local configuration on 2026-09-15, with known-present controls returning
rows in the same query, so the absence is real rather than a failed check. If those were sent to
`nick@smartcityos.io` they are already in hand and this is unblocked today.

**Azavar.** Four questions, all of which change what gets built rather than how:

| | Question | What it decides |
|---|---|---|
| 1 | Which tax types file through this endpoint, and is there a discriminator on the row? | Whether anything can be labelled Hotel Occupancy Tax |
| 2 | Which of the ten numeric fields does the Bastrop form actually capture? | Whether a `0` is a real zero or an absent field |
| 3 | How is an amendment represented — same id mutated, or a new id superseding? | Whether history is stable |
| 4 | Is a taxpayer identifier available, here or on a companion endpoint? | Whether non-filer work is possible at all |

Question 2 matters more than it looks: the vendor encodes an absent field as `0`. Until it is
answered, no rate, average or ratio can be computed honestly over any field, because a zero cannot
be distinguished from a field the form does not have.

## Contract reference points

- **This is a new integration**, outside the current subscription. Version 2 itself, including plan
  review, flood study, Smart Files and role-based access, is inside it.
- The base contract was approximately **one seat (city manager) and five integrations**. Current
  deployment is **eleven to thirteen**, so the delivered count is roughly double to triple the
  contracted one. That is the strongest available argument for pricing new integrations
  individually from here.
- **Seats are separate from integrations.** Finance almost certainly needs one for this, and
  role-based access is what makes a Finance-only seat meaningful. Directors are Sylvia's call.
- One operational note for the bid: this becomes a **thirteenth dependency on the v1 platform**,
  which raises the cost of the eventual v1 retirement. Worth naming rather than discovering.

## The honest summary for pricing

Price **the reconciliation instrument**: the feed, the store, both surfaces, and the ledger
comparison. That is well specified, the architecture is settled, and the risk is low.

Do not price **the compliance instrument** — non-filer lists, taxpayer trends — until Q4 returns.
If it comes back well, that is a clean second phase with its own number and considerably more value
to the city than phase one.
