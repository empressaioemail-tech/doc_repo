---
id: 2026-09-15_localgov_filings_integration_scope
title: SCOPE — Localgov Filings integration, Bastrop. One client in v1, served to both surfaces.
date: 2026-09-15
last_updated: 2026-09-17
status: scope — operator approval owed
kind: scope
owner: nick
programs: [OPS-17]
plan_rows: [allocate at dispatch]
related:
  - _inbox/2026-09-15_bastrop_cutover_WDLL.md
  - _decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding.md
  - _decisions/2026-06-08_mygov_raw_retention.md
  - _catalog/credential_access_index.json
---

# SCOPE — Localgov Filings, Bastrop

Source of truth for the endpoint is the Azavar integration specification `bastrop-custom-api 1.pdf`,
generated 2026-08-06, delivered 2026-08-14. Everything below about the endpoint's behaviour is read
from that document. **The endpoint has never been called.** No credential exists in any environment
we control, so nothing here is an observation.

Snapshot: `smartcity-os` main @ `8bea7fa5`; `smartcity-dashboards` @ `e74e525`; both clean.

## What this is

`GET https://api.localgov.org/filings/reports/bastrop-filings`, read-only, single tenant, Cognito
`IdToken`. Returns a JSON array of filing rows for a submission-date range. The city asked for it,
Azavar built it to the six fields named on 2026-07-27, and it is waiting on us.

The spec states its own purpose: reconciliation against amounts remitted to Bastrop. That is the
product. We already hold the other half of that reconciliation, which is why this is worth building
rather than mirroring.

## Blocking, and neither blocker is engineering

**1. Credentials.** Section 2 of the spec lists four items Azavar provides out of band: production
`appClientId`, demo `appClientId`, `username`, `password`. The spec carries their descriptions, not
their values. Verified absent 2026-09-15 in `smartcity-os-prod` (49 secrets), `smartcity-dashboards`
(32 secrets), and every local env file, with known-present controls returning rows in the same query
so the absence is real rather than a failed instrument. If the four values were delivered to
`nick@smartcityos.io` they are already in hand and this is unblocked today.

**2. Four questions to Azavar.** All four change what gets built, not how. They fit in one email.

| # | Question | What it decides |
|---|---|---|
| Q1 | Which tax types does Bastrop file through Localgov, and is there a discriminator field on the row? | Whether anything may be labelled Hotel Occupancy Tax |
| Q2 | Which of the ten numeric fields does the Bastrop form actually capture? | Whether a `0` is a measured zero or an absent field |
| Q3 | How is an amendment represented: same `FilingId` with mutated amounts, or a new `FilingId` superseding an older one? | Whether history is stable under re-fetch |
| Q4 | Is a taxpayer or account identifier available on the row, or through a companion endpoint? | Whether delinquency and per-taxpayer work is possible at all |

**Status of the four questions, 2026-09-17: ANSWERED, and the answers are NOT FILED.** Per
`_inbox/2026-09-17_HANDOFF_design_implementation.md`, Khalid AlAli at Azavar answered all four on
2026-09-15. That handoff summarises them; it does not carry them, and no file in this repository does.
The reply requesting the four credentials was drafted 2026-09-17 and not sent.

**Every constraint below that waits on Q1, Q2 or Q4 STILL BINDS.** The handoff reports that Q1 and Q2
unfreeze the word "hotel" on a label and computing rates over the monetary fields. That is a
paraphrase of an answer nobody filed, and a fail-closed constraint is not relaxed on a paraphrase.
The sibling filings design's `Ordinance rate 7.00%` is plausible because Texas caps municipal hotel
occupancy tax at seven percent, and plausibility is the same property that let a section that does
not exist, `14-02-005`, survive six citations on the reasoner design. **File Khalid's answers verbatim, with his date, then lift each constraint by name.**
The one correction made without them, the two-axis store test under Card 1, stands on this card's own
reading of the Azavar spec and does not depend on any answer.

## Four findings that shape the build

**The endpoint is not a hotel occupancy tax endpoint.** It is `bastrop-filings`, the product is
Localgov Filings, and the response carries no tax-type field. Nothing in the spec says hotel
occupancy. Until Q1 returns, every label reads Localgov filings. Calling it HOT is a binding nobody
resolved.

**There is no taxpayer identifier.** `FilingId` keys a filing and `FilingRefId` is a receipt
reference. Neither keys a taxpayer. Without Q4 this feed cannot answer who has not filed, cannot
trend a single taxpayer, and cannot count distinct taxpayers for disclosure suppression. Who has not
filed is usually the most valuable thing a city wants from a tax feed, so Q4 decides whether this is
a reconciliation instrument or a compliance instrument. Scope it as the former and reopen if Q4
comes back well.

**The vendor encodes absence as zero.** Spec, verbatim: if a form does not capture one of these
amounts, the field is `0` rather than absent or null. From a payload alone we cannot distinguish no
penalty assessed from this form has no penalty field. Until Q2 returns, compute no rate, no average
and no ratio over any field. Q2 converts an unresolvable per-row ambiguity into a per-form
declaration, which is the same shape as the writer-declaration pattern used elsewhere.

**Three amounts, never one number.** `TotalAmountDue` is what the taxpayer reported as owing.
`AmountPaid` is what was received, excluding processing fees. OpenGov fund 108 is what the city
booked. A single revenue tile is how those three silently become one wrong figure. Note that
`AmountPaid` excludes processing fees by definition, so a structural delta against the booked figure
is expected and must never be rendered as an error.

## Architecture: one client, both surfaces

`smartcity-dashboards` already reads real vendor data by calling `smartcity-os` platform routes with
`PLATFORM_INTERNAL_API_KEY`. That is the shipped pattern for all five non-MyGov live feeds today
(Samsara, Spireon, FirstDue, PowerBI, GoTo), each a literal
`https://smartcity-api-...run.app/api/platform/<vendor>/<resource>` in `src/vendor-live.mjs`.

So the Cognito client is written once, in v1, and v2 consumes it exactly as it consumes the other
five. v2 needs no AWS dependency and no second copy of the vendor contract.

This adds a **thirteenth** platform dependency and therefore raises the phase-2 severance bill. The
cutover WDLL accepts that trade explicitly and asks that it be named rather than discovered. Named.

`requirePlatformInternalKey` (`server/routes/mygov.ts:341`) already fails closed: 503 when
unconfigured, 401 on mismatch. Route 13 inherits it. G-131 records that this shared bearer carries no
tenant identity and that tenant resolution is inconsistent across the existing twelve routes; route
13 resolves via `getBastropTenantId()` and does not add a thirteenth inconsistency.

## Card 1 — v1 client, store and platform route

`server/services/localgov-filings.ts`

Cognito `InitiateAuth`, `USER_PASSWORD_AUTH`, no `SECRET_HASH`, read
`AuthenticationResult.IdToken`. `IdToken` not `AccessToken`; sending the wrong one returns a 401 that
reads like a credential fault and is not. Cache the token about three minutes, well under the
five-minute life, and re-authenticate once on 401. `RefreshToken` is a later optimisation, not v1: it
adds a second failure mode for no gain at dashboard volume.

Query parameter names are compile-time constants, never assembled at the call site. The spec warns
that a misspelling is silently ignored and returns 400 naming the missing parameter, which is the
same failure shape as a predicate built by string concatenation.

Error classification branches on **presence of `ErrorCode`**, never on message text. Gateway
rejections return a lowercase `{"message":"Unauthorized"}` with no `ErrorCode`, and the spec states
plainly not to assert on `ErrorMessage` for those. On 401 re-auth and retry once. On 429 back off and
narrow. On 400 do not retry.

Backfill runs serially in date windows, following the existing `STAGGER_DELAY_MS` convention in
`server/routes/opengov-bnp.ts`. Start monthly; halve the window on a row-limit 400.

`shared/schema.ts` gets `localgovFilings`, migration in `migrations/` via drizzle. **The row is
instantiated with its full column set**, not filled in as fields arrive: `filing_id` primary key,
`filing_ref_id`, `submitted_date` timestamptz, `submitted_date_local` date, all ten numeric fields,
`tenant_id`, `source`, `fetched_at`, and the raw payload retained per
`_decisions/2026-06-08_mygov_raw_retention.md`. A `localgov_sync_status` row mirrors
`mygovSyncStatus` so a run that fetched nothing is distinguishable from a run that never happened.

`submitted_date_local` is derived at write time in `America/Chicago`. The API's ranges are Chicago
calendar days while `SubmittedDate` is a UTC instant, so every period bucket reads the local column.
Bucketing on the UTC instant disagrees with the source at every period edge.

Upsert on `filing_id`. If Q3 says amendments mutate a row, add a supersession column before any
historical total is published, because silently mutating history under a reconciliation is worse than
not having one.

**Corrected 2026-09-17: history moves on TWO independent axes, and the original acceptance test
conflated them.** It declared the store done when "a re-run changes no historical total". That test
would fail on the first refund and send someone to investigate a correct payment as data corruption.
The card's own finding above already says why, from the Azavar spec: `TotalAmountDue` is what the
taxpayer **reported**, and `AmountPaid` is what was **received**. A received amount legitimately
moves as payments settle, reverse or refund. A reported amount moves only if the filing itself is
amended.

So the two axes get two rules. **Reported figures** are stable under re-fetch, and a change is legal
only with a supersession row saying why; that is the Q3 amendment question and the paragraph above
still governs it. **Payment figures** may change under re-fetch, and each change is retained as a
dated observation next to the prior value rather than overwriting it, which the raw-payload retention
already makes possible. A reconciliation that cannot show a refund happened is as broken as one that
calls it corruption.

**The other eight numeric fields are unclassified**, because the card names only these two. Each must
be classified reported or payment before any historical total over it is published. Refuse the total
rather than guess the class.

`server/routes/localgov.ts` exposes a tenant route for the v1 UI and
`GET /api/platform/localgov/filings` behind `requirePlatformInternalKey`.

Records normalise to the shape v2's adapter contract already expects even while they live in v1's
store: `recordId` from `FilingId` (the spec says it is stable and to use it as the key),
`kind: "localgov"`, `origin: "feed"`, `accessPolicy: "tenant-private"`, source and timestamp. That
makes the eventual v2 port a destination swap rather than a rewrite.

## Card 2 — v1 surface

A sixth tab on `client/src/pages/ExecutiveAnalysis.tsx`, where `AnalysisTab` is today
`"budget" | "department" | "scenario" | "opengov" | "revenue"`. It sits beside Permit Revenue on the
page that already handles deep-link aliasing.

Shows filed, received and outstanding as separate named measures. Honest-empty with a basis line when
a range returns `[]`, because the spec is explicit that an empty result is a 200 and not an error.
No invented freshness.

## Card 3 — v2 adapter and domain

`localgov` adapter kind in `src/adapters.mjs` (ten kinds today), a `filing` record shape, a `filings`
domain in `src/domains/`, a mapper and fetch in `src/vendor-live.mjs` pointed at route 13, and the
grant on the `bastrop_tx` pack. Mechanical, because the seam exists.

## Card 4 — the Finance lens

The real cost, and the reason this is its own card. `finance` is four lines in `src/lenses.mjs` and
nothing else; there is no finance domain in `src/domains/`. Filings would be the first real finance
content in v2. Sequence it after cards 1 to 3 so the feed is proven before the surface is designed.

## Card 5 — the reconciliation

Localgov `AmountPaid` summed over a period against OpenGov fund 108 for the same period. Two
independently derived upstreams, which is the only kind of agreement worth reporting. Renders the
delta with both sides named and the processing-fee exclusion stated, never a single blended figure.

The per-row identity the spec gives,
`TaxDue - CollectionAllowance + Penalties + Interest ~= TotalAmountDue`, ships as a row sanity assert
but is internal consistency: one upstream produces both halves, so it catches transcription errors
and not a wrong source. Do not report it as verification.

This card is what makes the integration a product rather than a second window onto the vendor's own
screen. It is not a stretch goal on card 2.

## Access policy

`tenant-private`. Never a public rail, never a public parcel rail, never an unauthenticated route.
These are per-taxpayer business tax records.

Row-level access is `finance`, `city-manager` and `admin` only, from the role set ruled 2026-09-14.

**Small-n suppression applies to aggregates, not only rows.** Bastrop has few lodging taxpayers and
one large one. Period-over-period differencing on published aggregates can isolate an individual
taxpayer even when no row is exposed. Without Q4 there is no taxpayer key, so suppression can only be
keyed on filing count; declare the threshold as a number in code rather than leaving it to judgement.

## Verification, by violation, on Demo

The spec provides a separate demo `appClientId` and base URL `https://api-demo.azavargovapps.com`.
Every case below runs there, against no production taxpayer data, and each is asserted to fail before
the client is trusted.

| Violation | Expected | Asserts |
|---|---|---|
| No token | 401, `{"message":"Unauthorized"}`, no `ErrorCode` | gateway shape classified as gateway |
| `AccessToken` instead of `IdToken` | 401 gateway shape | client cannot emit `AccessToken` |
| End date before start date | 400 with `ErrorCode` | API shape classified as API; no retry |
| `submittionStartDate` misspelling | 400 naming the missing parameter | parameter names are constants |
| Span over the row limit | 400 row-limit | client narrows and retries |
| Range with no filings | 200 `[]` | honest-empty with basis, not an error, not a zero |
| Token expiry mid-run | 401 then success | exactly one re-auth retry |

A convenient pass is a reason to distrust the harness. Each case is observed failing first.

## Done looks like

| Item | Done is | Instrument | Not done is |
|---|---|---|---|
| Credentials | four values in `smartcity-dashboards` and `smartcity-os-prod` Secret Manager, byte-length echoed | secret version listing | a value pasted in a chat |
| Client | all seven violation cases observed failing on Demo | the table above | a green happy path |
| Store, reported figures | a re-run changes no TAXPAYER-REPORTED figure (`TotalAmountDue`) on a closed period unless a supersession row records why | re-fetch a closed period, diff the reported fields only | a reported figure that moved with no supersession row |
| Store, payment figures | a re-run MAY change `AmountPaid`, and every change is kept as a dated observation beside the prior value, never overwriting it | re-fetch across a known settlement or refund, diff, confirm the prior value is retained | a refund investigated as corruption, OR a payment figure silently overwritten |
| Store, unclassified fields | no historical total is published for any of the other eight numeric fields until each is classified reported or payment | the classification table, filed from the Azavar answers | a field summed before anyone knew which kind it was |
| Route 13 | 503 unconfigured, 401 wrong key, 200 with key | violation test both directions | a 200 with the right key only |
| v1 tab | filed, received and outstanding separately labelled | live read on a real range | one revenue number |
| v2 domain | records reach the lens through route 13 | live read against `bastrop_tx` | a fixture that looks live |
| Reconciliation | delta against fund 108 with both sides named | one closed period both ways | a single blended figure |
| Labelling | Q1 answered before the word hotel appears anywhere | the Azavar reply | a plausible assumption |

## What this does not do

No collection. No remittance. No payment rail. No filing surface. Read-only, one direction, as the
city and Azavar both scoped it on 2026-07-24.

No taxpayer-level compliance work until Q4 returns.

No change to the twelve existing platform routes.

```
leave_behind:
  - item: thirteenth v1 platform dependency, raises phase-2 severance cost
    owner: nick
    plan_row: allocate at dispatch
```
