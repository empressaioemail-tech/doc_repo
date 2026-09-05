---
date: 2026-09-05
topic: P-118 Help widget shipped, CTX-sprint scope reconciled, five bugs root-caused and fixed, six operator rulings (A-103/P-119) audited and shipped end to end, P-102 reversed
agent: claude_code (planner)
plan_row: P-106, P-107, P-110, P-111, P-118 all CUSTOMER-DONE; P-102 REVERSED; P-119 ADDED (authoritative package table)
memory_graded: none
related:
  - 90_operations/OPS-16_texas_market_plan_of_record (A-094 through A-110)
  - _smartsite_gtm/08_open_scope
  - _smartsite_gtm/01_central_texas_gtm_strategy
  - _smartsite_gtm/06_consolidated_roadmap
  - _smartsite_masters/06_smart_site_gtm_audiences_and_pricing
  - _decisions/2026-09-04_p112_auth_options_ruling
---

# Session: P-118, the CTX-sprint handshake, five real bugs, and the A-103 package-parity batch

## Summary

The longest single session this seat has run. It opened mid-thread with a coordination
message from the integration seat about a concurrently-dispatched CTX pipeline wrap-up
sprint (four lane-planner worktrees), which this seat scope-checked twice against its own
work before touching anything, both times cleanly — once at the start of the session and
once again when a specific overlap looked plausible (P-106's zoning-divergence fix) and the
integration seat's own diligence caught that it was not actually the same defect as the
sprint's own PR #87. The operator then ran this seat through P-118 (a new, previously
unscoped Help widget), the glass/frosted-chrome UI cleanup, four items from an earlier
regroup (P-106, P-107, P-110, P-111), a real production bug (white screen on sign-out,
finally root-caused after the operator supplied a live DevTools screenshot), and finally a
six-part ruling batch (A-103) that reversed one plan row (P-102), corrected a standing
masters claim, and required a full package-parity audit between the web app and the MCP
connector against a brand-new authoritative tier table (P-119).

Every shipped item this session was merged AND deployed to production, and every deploy
was independently re-verified against the live service afterward — never accepted on a
green CI check or an agent's own report alone. Two planner errors were self-caught and
corrected before they shipped wrong, both recorded in OPS-16 rather than quietly fixed.

## What shipped, in the order it happened

**P-118, the Help widget** (OPS-16 A-093/A-094). Bottom-right, ungated, persistent, funnel-
framed per the operator's own ruling ("keep customers moving through our funnel"). Backend
`legacy-design-tools` #610, frontend `hauska-map` #352. A real repo-wide merge blocker was
found along the way — a required CI check ("PR base is main") that had been added to branch
protection before the PR implementing it merged, blocking every open PR in the repo
including one of the CTX sprint's own lanes. Flagged to the integration seat rather than
fixed unilaterally (shared branch-protection config, outside this seat's authorization);
their lane merged the fix within minutes. Deployed via the established canary→shift
discipline on both `cortex-api` and `smartsite-mcp`; live-smoke-tested with a real chat
call that correctly refused to assert coverage for an out-of-scope city.

**The glass/frosted-chrome UI fix** (A-095), a fresh, ad hoc request ("i dont like the
glass"). Three real components had genuine translucent fills under a blur left over from a
prior design-token flattening pass — one was literally 10-percent-opacity white, not just
blurred over an opaque fill. Fixed to the app's existing opaque tokens; map data-layer
overlays and the modal scrim correctly left untouched as legitimate, non-glass uses of
transparency. `hauska-map` #353.

**P-106 (zoning/setback not-applicable, A-096 through A-098, A-100).** Initially misdiagnosed
as duplicate work already covered by the CTX sprint's PR #87 — the integration seat caught
this before any build was dispatched, having actually read the diff rather than trusted the
title. The real root cause, once found: not a bug, an unfinished rail migration. Ten other
rails had already been cut over from the old single-input bake to the correct
`parcel_record` store; zoning and setbacks simply never got their slate entry. Built as the
eleventh instance of an already-proven pattern. `legacy-design-tools` #614. Live-verified
twice — once by the build agent against a seeded test row, once by the planner post-deploy
reading the real route source and confirming a genuine 401 (not a crash) on both canary and
shifted production.

**P-110 (MCP connector export rewire, A-074, A-096, A-099, A-100).** This seat mis-stated
the defect's scope to both the operator and the dispatched agent — described as "the web
app's export buttons are silently broken" when the web app was never broken; the actual gap
was entirely in the MCP connector. Caught by the operator's own direct product usage ("i can
export site plans and everyhitn else jsut forne form the ui"), not by this seat's own
verification. Corrected immediately, agent had already independently reached the same
conclusion. A genuine live bug the mocked test suite missed was then found by the planner's
own live smoke test against the real upstream: the download call never sent a required
`format` field, so every real export would have failed at the last step despite the full
suite passing. Fixed, re-verified live — real PDF and GLB bytes returned for a real parcel;
dossier correctly refused with a real, honest upstream error for a parcel whose brief had
never been run, proving the error path is honest too. `legacy-design-tools` #613. Also
required provisioning `HAUSKA_MCP_BASE_URL`/`HAUSKA_MCP_SERVICE_KEY` onto `smartsite-mcp`'s
Cloud Run service for the first time — the credential existed, the service had simply never
been configured to use it, exactly matching P-109's original "readiness: blocked" finding.

**P-107 (out-of-coverage miss class, A-072, A-102, A-108) and P-111 (account-deletion FK
orphan, A-075, A-076, A-102, A-108)**, both dispatched together with the screens-gate and
white-screen fixes on the operator's direct instruction to use subagents. P-107
(`legacy-design-tools` #616) gave `find_parcel` a real `out_of_coverage` miss class,
distinct from a genuine in-coverage no-match, and caught its own stale "Central Texas"
coverage claim along the way. P-111 (`legacy-design-tools` #617) added the missing cascade
FK to `pe_saved_properties`/`pe_screens`; the migration, run against production this
session, found and cleaned up 6 real orphaned rows — a live, if small, defect, not a
theoretical one.

**The screens-gate fix** (`create_screen`/`add_to_screen` now return a declared
`upgrade_required` envelope instead of a generic passthrough error, `legacy-design-tools`
#615) and **P-107 hit a real merge conflict** landing back to back, both having touched
`smartsite-mcp/tools.ts` in parallel. Resolved by hand, re-verified by letting CI run fresh
on the actual merged code before treating the resolution as correct — never assumed clean
from reading the diff alone. Both agents also independently reported the other's uncommitted
work bleeding into their own fresh clone's working tree during the build — some shared-
sandbox filesystem anomaly, not normal git behavior; both caught it and staged only their
own files by explicit path, so no actual harm, but worth remembering for future parallel
dispatches into the same repo.

**The white-screen bug**, reported twice by the operator and unreproducible by this seat's
own scripted Playwright attempts, was finally root-caused after the operator supplied a real
DevTools screenshot from an actual occurrence. Decoded the exact React error from the
installed `react-dom` package's own source (not the flaky public decoder site) and found a
genuine Rules-of-Hooks violation in `ReportsTool.tsx` — an early return sitting before a
`useEffect`, thrown whenever a mounted Reports dock live-transitioned into a signed-out
state, whether from an actual sign-out or the entitlement refresh that fires after every
Stripe checkout return. Both operator reports were the same bug from two different doors.
Verified by reverting the fix and reproducing the exact decoded error text through a real
DOM/reconciler mount. The app's first-ever root error boundary was added as independent
defense-in-depth, since a single uncaught error anywhere had been blanking the entire page
with zero signal. `hauska-map` #354.

## The A-103 ruling batch, and its full audit trail

The operator answered six pickup-item questions in one exchange (A-103), several with real
downstream engineering, not just documentation:

1. **The builder/designer affiliate line** corrected to lead with Feasibility Study and
   Flood & Drainage rather than X-ray-plus-site-plan-export. Copy-only, `01_central_texas_
   gtm_strategy.md`.
2. **The browser extension confirmed dead** ("long retired ... this can be archived and
   extinguished"), resolving the Pro/Max Stripe-live-activation question outright: fixed to
   fail closed (`legacy-design-tools` #622) rather than silently downgrade a tier or return
   a fake simulated checkout under a live key — confirmed as fully separate code from the
   live Smart Site ladder, zero reachable UI in either repo.
3. **`dossier` retired as a customer-facing word; X-ray is the document.** The operator
   supplied the full authoritative package table (P-119), which settled a real, already-
   flagged divergence: the connector's X-ray export gate was backwards (Studio/Team-only
   when the web app is Solo+), Feasibility Studies didn't exist on the connector at all, and
   Property Unlock was missing as a door on site-plan/terrain export everywhere. A full
   audit matrix was built before any change (web app read as ground truth, never the
   reverse); all three gaps fixed on the connector (`legacy-design-tools` #620), and a
   FOURTH gap the audit surfaced — the web app itself didn't grant Property Unlock for
   these exports either — correctly left untouched (out of that PR's scope) and dispatched
   separately (`hauska-map` #357). The new Feasibility Study connector leg calls
   `hauska-engine-api` directly (no upstream MCP tool exists) and was live-verified end to
   end by the planner: a real 6-page PDF generated and downloaded for a real parcel, byte
   counts matched exactly, after provisioning `HAUSKA_ENGINE_API_URL`/`HAUSKA_ENGINE_API_KEY`
   onto `smartsite-mcp` for the first time.
4. **`graph_opt_in` ruled no-consent-needed first-party product analytics.** `terms.html`
   was read in full, found to say nothing about it, and given its first disclosure section
   (`hauska-map` #355), effective date deliberately left unchanged since this is a
   disclosure of existing practice, not a change to it.
5. **Tax-assessed CAD valuation cleared to display**, explicitly distinct from the market-
   opinion valuation the masters still refuse, gated at the same tier as owner info. This
   raised owner info's own actual gate (Studio/Team only, excluding Property Unlock — a
   real surprise, found by investigation rather than assumed) as its own question: the
   operator resolved it in the cleaner direction, widening owner info's own predicate to
   include Property Unlock (confirming the Solo exclusion was always a deliberate tier-
   graduation lever, but Property Unlock's exclusion was an accident of timing, predating
   its P-119 expansion) rather than narrowing tax valuation to match the old boundary.
   Because tax valuation was built to reuse owner info's exact predicate rather than
   duplicate it, widening the one predicate fixed both features at once — confirmed by
   test, not assumed. `legacy-design-tools` #621, `hauska-map` #356. **A real regression
   was caught on #621's first CI run** after it picked up a same-day merge from a different
   lane (#619, brief parity): that lane's own new test file had mocked a shared module
   before this PR's new export existed, so the route started 500ing. Root-caused (not
   assumed to be flake), fixed, and CI was independently reverified live by the planner
   before merging — not accepted on the agent's report alone.
6. **The MCP connector needed the web app's "Brief" too, as a snapshot not a report.** A
   real, material 7-field content gap was found (not just a discoverability issue):
   `get_smart_site` was missing city limits, utility service, overlay districts, ag
   valuation, school district, max impervious cover, and building footprint — fields the
   web dock already shows — plus its own tool description falsely claimed setback distances
   were never included, which was simply wrong. Both fixed by reusing the exact same loader
   functions the web route already calls. `legacy-design-tools` #619. A side finding (the
   same ungated CAD-dollar-value leak from item 5, at a second call site this parity work
   surfaced) was routed directly to the tax-valuation build rather than duplicated.

**P-102 (two-seat Studio) formally reversed**, invoking a reversal clause the original
2026-08-31 ladder-recut ruling had itself pre-registered ("reverse the two-seat Studio if
seat management cannot close self-serve") — confirmed no live product copy anywhere ever
actually promised two seats, so this closed as scope closure, not a UI fix.

## Two planner errors, self-caught and recorded rather than quietly fixed

P-110's scope was mis-stated twice (to the operator and to a dispatched agent) as web-UI-
facing before the operator's own direct product usage corrected it — recorded as OPS-16
A-099, with the correction relayed to the build agent before it could act on the wrong
premise (it had already independently reached the right conclusion by the time the
correction arrived).

A-096 assumed P-106's zoning-divergence fix was already covered by the CTX sprint's PR #87
without reading its actual diff. The integration seat caught this, unprompted, in response
to this seat's own scope-check request — corrected as OPS-16 A-097 before any duplicate
build was dispatched.

## CTX pipeline wrap-up sprint: reconciled twice, zero collisions found either time

The sprint (four lane-planner worktrees under the integration seat, covering the parcel-
data pipeline: valueHistory, landUse, owner-rail reconciliation, cell-state gaps, the queue-
claim lock, Neon read-replica work, and specific PR review/rebase items) was scope-checked
against every item this seat worked this session, both at the session's opening and again
when the P-106 zoning-divergence item looked like a plausible overlap. Both checks came back
clean — this seat's work is entirely auth/billing/checkout/UI/package-tier surfaces,
genuinely disjoint from the parcel-data pipeline. A production credential (`PRODUCTION_
NEONDB_URL`) was briefly, and self-disclosedly, exposed in a different CTX-sprint lane's own
tool output while debugging an unrelated fetch failure — contained, never persisted or
re-transmitted, already written up by that lane with a non-emergency rotation
recommendation. Not this seat's to action (portfolio-scoped, outside property-seat
ownership); flagged to the operator, who has not yet scheduled the rotation as of this
session's close.

## What was NOT done

The external clocks remain entirely the operator's: A2P 10DLC brand registration, DNS for
`email.smartsite.cloud` (a genuinely separate subdomain from the Resend work already done on
bare `smartsite.cloud`), Stripe live activation, and the Cotality vendor follow-up (drafted,
unsent). None are blocked on this seat.

The Neon credential-rotation recommendation from the CTX sprint's own self-disclosure is
unactioned — not this seat's ownership, flagged only.

A small number of no-lane-waiting decisions from the original regroup remain genuinely open
after A-103 closed the six it answered: whether valuation output may surface (partially
answered by item 5's tax-assessment/market-opinion distinction, but the narrower original
question about a computed "valuation" figure specifically was not separately re-asked), and
nothing else identified as still outstanding as of this close.

## Leave behind

    leave_behind:
      - item: Neon PRODUCTION_NEONDB_URL rotation (self-disclosed exposure, contained, non-emergency)
        owner: operator
        plan_row: n/a, portfolio-scoped, outside property-seat ownership
      - item: A2P 10DLC registration, email.smartsite.cloud DNS, Stripe live activation, Cotality reply
        owner: operator
        plan_row: P-97 checklist / external clocks, sent as a standalone file this session
      - item: extensionLoginPage.ts still reads "Pro depth" in marketing copy (not a checkout surface)
        owner: unclaimed, low priority
        plan_row: flagged in legacy-design-tools PR #622, not fixed there
