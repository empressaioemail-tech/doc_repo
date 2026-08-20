---
id: session_2026_08_20_t26_markets_substrate
title: T-26 markets substrate — thirteen lanes, fourteen merged rows, one layer earned
status: active
last_updated: 2026-08-20
applies_to: smart-markets, empressa-trading
owner: nick
related: [session_2026_08_20_t25_enumeration_handover, 61_enforcement_doctrine]
purpose: Session record for the T-26 batch dispatched off the T-25 enumeration handover. Carries what landed, what the handover got wrong, what no lane could establish, and the exact deployed state of both surfaces. Committed rather than left in a transcript because a handover that exists only in a transcript is the defect this programme documents.
---

# T-26 markets substrate

## Snapshots

    smart-markets     origin/main 7d0bfc64089727faa9e58f24aad7ae41ca4b068c
    smart-markets     DEPLOYED    revision smart-markets-api-00008-jck, 100 percent
                                  built from 7d0bfc6, digest sha256:41d43465...
    empressa-trading  origin/main 4b60775ed9e15cd6d6f8bafc940ffa35d9195ef4
    empressa-trading  DEPLOYED    UNKNOWN. api.empressa.pro/version returns
                                  build_sha null, so the revision cannot be
                                  stated. Not deployed this session.

Base at dispatch was smart-markets a346524 and empressa-trading 205e7865. Both
moved under the lanes during the session and every branch was re-greened against
the current base before merge.

## What merged

smart-markets, five rows:

    bba0fa8  #23  a store refusal is lookup-failed, never absent-verified
    bb846a1  #24  a wrong bar VALUE unrepresentable, not just a wrong shape
    15869ca  #25  drivers wired to the cockpit published futures route
    234b828  #26  the market tightening rests on a measured population
    7d0bfc6  #27  branded shape rows, a wrong identifier cannot be constructed

empressa-trading, nine rows:

    6189578a #358  513 sums two different predicates
    10dc0a71 #360  dead-guard reachability scan
    d38067cf #359  the remaining 185 rows classified to derivation state
    43b488f4 #357  stop-grade refuses unknown point value and absent qty
    506fdf76 #362  delete the lossy fetch wrappers
    5ba6a398 #361  grader abstention expressible in the evidence ledger
    d61644b4 #363  51 tests were reaching live vendors; guard, ratchet, 29 fixed
    ab438e41 #364  a bar is a validated construction, not six annotated floats
    4b60775e #365  the evidence determination in a checkout that can make it

Every merge was taken on a CI conclusion string read after re-greening against
the base that existed at merge time, never on a gh exit code. Both repos have
branch protection with ZERO required status checks, verified against the GitHub
API this session, so a red PR merges and the gate was held by hand.

## The product answer, stated exactly

The dispatch predicted the drivers row would take the twin from three
lookup-failed layers to two. That is NOT what happened.

    LAYER      BEFORE 00007-hcq          AFTER 00008-jck
    room       absent / absent-verified  absent / LOOKUP-FAILED
    roster     absent / lookup-failed    absent / lookup-failed
    drivers    absent / LOOKUP-FAILED    absent / ABSENT-VERIFIED
    market     partial / lookup-failed   partial / lookup-failed
    synthesis  absent / lookup-failed    absent / lookup-failed

The count of lookup-failed is UNCHANGED AT FOUR. Drivers came off it as
predicted. Room went onto it, because room had been falsely claiming
absent-verified on an HTTP 401. The twin is more honest, not further along.
Zero layers are populated; one is partial.

The 33-pointer partial payload is real and unreachable. No futures node
resolves: the security master classes CL, GC and ES as asset_class equity with
name null and resolution_status provisional, and holds no futures nodes at all.
That is an upstream owner row, not this repository.

## What the handover got wrong, each falsified at source

MICRO FUTURES ARE NOT ABSENT. POINT_VALUES has 51 keys, not 28. The 28 is
FULL_SIZE_POINT_VALUES, a different dict. /MES 5.0, /MNQ 2.0, /M2K 5.0 and
/MYM 0.50 are all present and correct against CME contract specs.

THE CALIBRATION MAGNITUDE IS NOT FICTION. The point value and the quantity
cancel exactly:

    risk_per_unit    = |entry_px - stop_px| * pv
    cf_pnl           = move * pv * qty
    counterfactual_r = cf_pnl / (risk_per_unit * |qty|)
                     = move / |entry_px - stop_px|

Independent of both fabrications. Confirmed over 600,000 randomised
combinations against an independently derived closed form, zero divergences,
then re-verified through the reconciled path over 200,000 more. The label
population and the score population were BOTH clean. The defect was latent and
structural. NO HISTORICAL REPAIR IS OWED from that call site. It also makes the
refusal mandatory rather than optional: consuming a post-fix 0.0 would turn a
correct 3.0 into a fabricated one.

513 IS NOT ONE NUMBER. It sums two different predicates. The scoring band
counted ternaries and the other band excluded its own 64, so a ternary is a row
in one half and not the other. Corrected range 185 to 291, up to about 393
counting ternaries, making the full replacement 321 to 427. The prior pass
reported its correction as 0.4 percent; the real correction is 23 to 45 percent,
in both directions.

THE return-None CLASS WAS NEVER EARNED. 146 of 148 rows declare the absence in
the return type, so they are contracts and not collapses. That does not clear
the class either: an absence collapse is a property of the CONSUMER and the
instrument reads RETURN sites. It was pointed at the wrong end of the pipe.

THE SCOPE FINDING OUTRANKS THE COUNT FINDING. The 25-file list reaches 16.7
percent of the predicate reach tree-wide. 1,697 rows sit outside it, and the
136 Zod rows have had no instrument pass at all.

THE equity_universe FAIL-SAFE READING DOES NOT HOLD. Sole-consumer-refuses-empty
is literally true and CANNOT FIRE, because the watchlist seeds 63 symbols
unconditionally. An outage never produced an empty universe, only a plausible
short one. Severity is higher than the handover stated, not lower.

## The most severe thing found, which was not on the list

app/universe/sync.py MASS-DELISTED THE ENTIRE UNIVERSE off one FMP failure. The
lossy wrapper returned an empty list, incoming collapsed to the macro roots, and
every other active symbol was set is_active=False with its alias era closed. The
function then returned available true. A durable destructive mutation driven by
a fabricated empty, reported as success. Closed by two separate guards, because
failure-to-observe and observed-empty are different states.

## The purchasing list is empty

185 rows classified: 115 false positive, 40 internal-consistency-only, 10
available-now, 10 self-authored, 9 discarded-at-write, 1
available-once-dependency, 0 foreclosed, 0 ABSENT. Nothing needs a witness
bought. The strongest candidate had its authority already in the repository at
app/data/cme_contract_specs.json, the CME FPRF feed verbatim with a per-file
sha256 and business date; all 11 overlapping roots agree with POINT_VALUES with
zero disagreements. Of the rest, 30 are obtainable by re-running a committed
extractor and 10 are the wrong authority by construction: DXY is ICE, VIX is
Cboe, and eight crypto spot pairs are not futures.

## Controls, honestly classed

ARMED AND FIRING. The netguard is autouse, defaults to strict, fails loud if it
cannot arm, and its baseline may only shrink. It fired on its first day against
a test written this same session, which reached financialmodelingprep.com and
swallowed the failure while claiming to test a fill path.

ARMED AND FIRING. The deploy-gate evidence determination now runs in a checkout
that can make it, refuses with exit 2 in a shallow one rather than passing, and
was proved red in GitHub Actions against a deliberately staled control.

DIAGNOSTICS, LABELLED AS SUCH, NOT CONTROLS. The hardened default-shape scanner
and the dead-guard reachability scan. Nothing triggers either against the tree,
no baseline is stored, and nothing fails on a new instance. The dead-guard lane
declined to ship a whole-tree gate on the stated ground that with 53 undetermined
rows it would be either noisy or trivially satisfiable, and a gate that cannot
fail honestly is the defect class it was sent to find. That was the right call.

DORMANT, AND NEVER EXECUTABLE. smart-markets .github/workflows/deploy.yml
references secrets.GCP_WORKLOAD_IDENTITY_PROVIDER. The repository has zero
secrets and the project has no workload identity pools, so the workflow has
never been able to run. Deployed via deploy/cloud-run-deploy.sh instead.

## What no lane could establish

The count of pre-existing ambiguous outcome rows. No database credential exists
in Secret Manager; the password lives in the deploy-sensitive VM env file. A
lane declined to SSH production for a number and named what must become true
instead. Correct.

Whether any traded symbol sits outside POINT_VALUES. The symbols ARE recorded,
so this is an unread path and not an unobservable population.

Whether the capture_hooks sentinel merge is recoverable. It is not, and a
database would not have answered it either: colliding records are DROPPED, not
merged, and the drop is unlogged. The question is recorded rather than answered
by proxy.

What the cockpit currently runs. api.empressa.pro/version returns build_sha
null, so the deploy-gate runtime attestation returns cannot-attest every time.
It fails honestly and it can never succeed.

## Open, with owners

runner.py carries seven more POINT_VALUES.get(sym, 1.0) sites. TWO ARE RISK
CONTROLS: line 1067 computes risk as a fraction of NAV, line 1010 accumulates
unrealized PnL for the daily-loss-limit breaker. The 1.0 default is correct for
equities and wrong by a fixed factor for any futures symbol absent from the
51-key table. For bot-originated positions it is LATENT, because ALLOWED_SYMBOLS
is 23 and all 23 have point values. BUT at runner.py:2771-2772 the state load
applies symbol.in_(universe) ONLY when risk_v2 is off, so under risk_v2 rows for
symbols that have left the universe are loaded into states, which is what feeds
1010, 1067 and _reconcile_external_closes. Reaching the default needs a symbol
to leave the catalog while its position row survives. NOT ESTABLISHED and not
claimed. Each site needs a trading-policy decision about what the bot does when
it cannot size a position.

22 unhermetic tests frozen in tests/netguard_baseline.txt, zero stale.

Two of five deploy-gate control paths were outside the gate pull_request paths
filter, so a PR could stale a control without starting the job that would say so.

The Bar brand in the twin contract is not sealed against a spread. Closed at
runtime by TwinSchema.parse, open at compile time.

## Per-lane close artifacts

Thirteen machine-checkable close artifacts at _inbox/2026-08-20_t26_*_close.json:
astaudit, bar, barctor2, branded, drivers, enum, gatedepth, guards, hermetic,
ledger, providers, refusal, stopgrade.
