---
decision_id: 2026-09-18_phase0_closeout_rulings
date: 2026-09-18
owner: operator
status: active
related_canonical:
  - 90_operations/OPS-16_texas_market_plan_of_record (A-215, P-335 to P-351)
  - _inbox/2026-09-18_phase0_closeout_REGISTER.md (the durable list these rulings feed)
  - _inbox/2026-09-16_texas_scaleup_program_scope.md (section 5, the Phase 0 exit)
  - _decisions/2026-09-18_join_miss_unaccounted_until_scoped_guard.md (A-214, the same morning)
---

## Decision

The operator accepted every recommendation the integration seat put to it on 2026-09-18 for closing
Phase 0: eighteen rulings, then later the same day the method for ruling 9 and a nineteenth ruling on
San Marcos and Georgetown. There is one addition (ruling 12 carries a Phase 1 flag). The standing instruction that governs
all of them: **everything on the list gets done, on the exit path or not, and it is done properly;
Phase 0 is not to be rushed to a close.** Work is sequenced in waves, not held.

### The ledger leg (`scripts/six-county-completeness.mjs`)

1. **P-204 group A, `parcelGeometry` and `pipelines`: CUT OVER.** The ledger cells are written from
   the atoms that serve today, the gate grades them, and the retrieval cell reader serves them.
   Implemented by P-336.
2. **P-204 group B, `etjStatus`: CUT OVER**, with P-332 fixing the panel that discards the
   determination and declaring the incorporated-plus-ETJ-present conflict. Implemented by P-336 and
   P-332.
3. **P-204 group C, `landUseDescription`: STAYS ON THE BAKE for Phase 0** under a named exclusion,
   because cutting over removes a description a customer reads today and it waits on the Hays
   TxGIO-CAD join. Revisited in Phase 1 (P-345). Implemented by P-337.
4. **P-204 group D, `railCorridor`: DEFERRED by ruling, not retired.** No serve path is built in
   Phase 0; its first serve path is Phase 1 work (P-344). Implemented by P-337.
5. **P-300: fire broadly.** The jurisdiction-default row serves the 48,829 parcels P-326 measured as
   servable, after P-258's writer re-run.
6. **The 9,510 district-miss parcels: a declared refusal is an accepted Phase 0 terminal state**,
   provided the refusal names the parcel's district and its city and says to verify with the city,
   on every surface. Acquisition of the missing district tables continues as Phase 1 work (P-346).
   Implemented by P-338.
7. **Williamson identity: adopt P-310's option (b), the WCAD published-identifier crosswalk**
   (`quickrefid` to `propertyid`; 282,136 of 282,569 nodes bind, 1:1, two independent extracts
   agreeing 287,321 of 287,321). Implemented by P-335.
8. **Roads and edgeSignal: ruled per city once P-264's artifact lands** (A-177's escape clause).
   Nothing to decide until then.

### The customer leg (`scripts/surface-probe.mjs`)

9. **The probe's MCP leg gets an OAuth token by signing in per run** (operator, 2026-09-18, option A).
   The Smart Site MCP accepts only a signed-in user's WorkOS AuthKit token and answers at that user's
   tier; the static dev token works only in a dev mode that disables sign-in verification, so it is
   not used on production. The seat adds a sign-in helper to the probe (the same OAuth flow a Claude
   connector uses); the operator signs in with the paid Solo test account for each run; the token
   lives in memory for that run only and nothing new is stored. The run records the tier it graded
   at, and Solo's by-design refusals (owner, valuation, records) are correct, not defects. P-347.
10. **P-323: every tag on a revision missing a credential its serving revision carries is deleted,
    except tags the operator names as keepers.** Referenced tags are repointed per P-323's mission.
    This is the operator's authorisation for the accumulation class in advance.
11. **P-263: apply county by county, each county capped at its own measured share** under P-213's
    blast-radius refusal and P-281's heavy-scan lease. Implemented by P-342 (the apply writer) and
    run by the integration seat.
12. **The 30,434 envelope atoms P-263 cannot classify are withheld as unverified**, never served as
    the legacy "Setbacks consume the lot" claim. **Flag: come back and fix them properly** (they are
    failed computations, orientation, inset and road, not absences). Carded as P-343.
13. **The buildable-area figure: P-304's rule governs.** A figure may show when a verified envelope
    atom backs it; the probe's XD-1 check is corrected to agree (P-347).
14. **Where the card's setback table and the draw route's differ (7 parcels): most-current source
    wins**, per the 2026-09-11 ruling, and an unreadable date produces a conflict row. P-340.
15. **The drawing route (`place/buildable-envelope`) owns the envelope's reason.** The panel and the
    MCP read it rather than composing their own. P-339.
16. **Impervious cover: the stricter figure governs and both are cited** (one parcel: zoning 45,
    watershed 30, so 30 governs). P-341.
17. **The integration seat triggers a PDF build for each fixture parcel** so the probe's PDF leg can
    be graded. P-347.

### Setback serving, San Marcos and Georgetown (P-349)

19. **San Marcos is served** (operator, 2026-09-18, option A) from the current verified corpus
    (`@empressaio/setback-corpus` 1.4.0), replacing the `legacy-transitional` rows from 1.1.0 the
    store serves today. Districts with a row serve it with the date cited; a district with no row
    carries ruling 6's declared refusal naming the district and the city. **Precondition:** the
    2026-09-07 area-coverage check (live zoning layer, area-weighted by district) is re-run against
    the 1.4.0 table first; if coverage has fallen below that check's, the switch stops and comes back
    to the operator. **Georgetown stays withheld until its rewritten code takes effect on
    2026-11-01**, and no surface cites the adopted-but-not-yet-effective rewrite as the governing
    source before then. Then the Hays bake that customer-closes P-260 runs.

### Later the same day (A-218, operator, 2026-09-18 about 14:40Z)

- **Ruling 8, taken.** P-264 closed partial: a per-city road residual is measurable for three cities
  only, and four of the six counties have no way to re-derive at all. The operator accepted the
  seat's recommendation: **roads and edgeSignal are accepted for Phase 0 in all six counties on the
  measured share.** Stored road declines are 684 of 58,325 (1.17 percent) in 48021 and zero in the
  other five, where the zero means no verify pass ever ran there, not a measured absence, so those
  five are carried as unmeasured with the ruling as their acceptance rather than as zeros. The
  per-county measurement (warm runners for Hays, McLennan, Williamson and Travis) and Elgin's
  road-name failures (20 of 37 verify-stage failures) are Phase 1 work (P-355, P-356).
- **Ruling 19 amended for Georgetown.** The operator: "I'm good with Georgetown showing the next
  version of setbacks, they will take place soon enough and frankly anyone using our site should be
  planning for the new codes." **Georgetown is served from its adopted rewrite ahead of 2026-11-01.**
  What the ruling still requires is that the surface says so: the citation names the adoption date
  and the effective date, never "vintage unknown" (P-354, re-scoped). San Marcos's half of ruling 19
  is unchanged.

### The exit

18. **The operator walks the 45 probe buckets** once the customer re-run is clean.

### Also accepted

- **`dblink` is dropped** from the production database once the seat has confirmed nothing depends
  on it.
- **PITR branch `br-late-rain-apffmnp2` is deleted only after 48491 republishes** (P-350).
- **P-321's retired-share watch runs hourly** once P-334 lets it run (operator, 2026-09-18, after the
  rulings above).

## Context

The Phase 0 exit (scope rev 4, section 5) is five legs at once: the ledger, the customer probe on
the map, MCP and PDF, coverage, the road residual, and the operator's walk. At 2026-09-17 22:03Z the
ledger read 67 open cells and 12 unmeasured; at 19:20Z the customer probe read 0 PASS, 17 FAIL and
28 UNMEASURED of 45 buckets, with 11 of 23 XD/X defects open. These rulings settle every decision
those numbers were waiting on.

## Reasoning

Each ruling is the integration seat's recommendation as presented in chat on 2026-09-18, with the
evidence named in the register. The common thread: close what can be closed honestly now, name what
is deferred and where it goes, and never clear a gate by relabelling. Rulings 3, 4 and 6 are
exclusions or declared refusals, and each carries its Phase 1 row so the exclusion cannot outlive its
reason silently.

## Reversal criteria

- Ruling 6 reverses if the declared refusal is found not to name the district and city on every
  surface, or if the district-miss class grows after P-300 lands without an acquisition landing.
- Rulings 3 and 4 are revisited at the Phase 1 boundary through P-345 and P-344.
- Ruling 11 stops, county by county, if any county's apply moves more than its own measured share.
- Ruling 13 reverses if a verified envelope atom is found to back a wrong figure.
- Ruling 19 stops for San Marcos if the coverage re-check falls below the 2026-09-07 figure. Its
  Georgetown amendment (A-218) reverses if Georgetown repeals or postpones the rewrite before
  2026-11-01, or if a surface serves a rewrite row without naming its effective date.
- Ruling 8 (A-218) reverses for a county if a measurement there (P-355) finds road-blocked renders
  above 48021's 1.17 percent share, or if Elgin's road-name class (P-356) is found to block renders
  outside Elgin.

## Dependencies

The waves and every row are in `_inbox/2026-09-18_phase0_closeout_REGISTER.md`.

## Counterparties

Internal: operator (rulings), integration seat (records, applies, deploys, grades), the lanes the
waves dispatch.
