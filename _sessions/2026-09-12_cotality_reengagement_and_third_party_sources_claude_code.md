---
date: 2026-09-12
agent: planner
repo: docs
session_type: planning
memory_graded: [cotality-hit-means-decommission-not-credential:HELPED, dispatches-are-compiled-not-authored:HELPED, accesspolicy-gates-atoms-not-fields:HELPED, doc-repo-concurrent-commit-hazard:HELPED, no-special-data-access-stand-on-own-merit:HELPED]
rolled_up: false
snapshot: >
  doc_repo main, integration seat, P:/doc_repo. Session opened at 3070515a; origin/main
  moved to 933f68b8 mid-session (another seat registering the P-175 worktree). Cotality
  credentials probed LIVE 2026-09-12 from this session, secrets read from GCP Secret
  Manager (legacy-design-tools-prod and hauska-prod-497015). Factory store read read-only
  via FACTORY_DATABASE_URL_RO. Product repos read at origin/main WITHOUT checkout, by
  git show: plan-review 1af5ac5, hauska-mcp-server 3b5626b. Rail set read from the
  compiled rail-keys.js at engine 22e71e1 because P:/hauska-factory is a stale clone at
  "Initial commit". Nothing committed at time of writing.
---

# Cotality re-engagement, the third-party source model, and the sixty-parcel bake-off

## What was done

Operator opened a brainstorm on Cotality re-engagement: a commercial agreement arriving
this week on pay-per-use terms, no deposit, no upfront dataset purchase, full library via
API and MCP, billed monthly in arrears, and explicitly no renegotiation.

Pulled the full internal history of the vendor (2026-06-06 sole-spine ruling through the
2026-07-13 extinguish and the 2026-09-03 R11 re-engagement signal), then probed the
credentials live rather than inferring their state. Built the 65-rail BUY/MAKE/HAVE
division and a per-call COGS model. Read plan-review and hauska-mcp-server at origin/main
to find the existing jurisdiction/ICC binding and the third-party-IP gating machinery.
Generalized both vendors into a rights-envelope model. Built a sixty-parcel test set.
Opened one plan row and compiled a hand-carry dispatch.

Artifacts written, none committed: `_research/2026-09-12_cotality_reengagement_division_cogs_and_probe.md`,
`80_adrs/adr_032_third_party_source_rights_envelope.md` (proposed, not accepted),
`scripts/vendor-testset-ctx.mjs`, `_catalog/vendor_testset_ctx.json`,
`_catalog/dispatch_missions/mission_p176_cotality_bakeoff.md`,
`_dispatches/2026-09-12_ctx-bakeoff_dispatch.md`, and OPS-16 A-136 / P-176.

## What was learned (changes to ground truth)

**The Cotality extinguish is half wrong, and the wrong half has been invisible for two
months.** All three REST products return `oauth.v2.InvalidClientIdentifier`, confirming
the extinguish. But `COTALITY_MCP_UAT_CLIENT_ID` and `COTALITY_MCP_UAT_CLIENT_SECRET`
exist in `hauska-prod-497015`, were created 2026-07-14T18:53, mint a 200, and have never
been probed. The 2026-07-14 record states creds were not yet delivered; they were
delivered the same day, written to Secret Manager, and left untouched. This is the second
instance of the same defect class as the 2026-08-08 resurfacing: the durable record and
the index both carried a blanket state claim that was true of one channel and false of
another.

**Two constraints the repo recorded as binding are eval-tier only.** The
Closed-Secure-System clause forbidding outputs reaching end users belongs to the
2026-07-14 MCP eval agreement, not to any commercial agreement. The 100 requests/day
ceiling is likewise the eval and testing tier. Both were carried in canon as though they
bound Cotality generally.

**The live MCP channel, characterized.** Server is `litellm-mcp-server` v1.0.0, so
Cotality's MCP is itself a proxy over their REST products. Eleven scope-gated tools
across four sub-servers, not the fourteen in the 2026-06-06 catalog, and the tool
prefixes changed (`clip`/`at`/`pd`/`pr`, previously `clip`/`pc`/`pacra`/`pa`/`pac`).
Verified with real calls against a Travis parcel, not from tools/list alone.

**One call returns 84 leaf fields.** `pd-get_property_characteristics` carries three
things this operation cannot source at any effort today: `landUseCodeDescription` (OPS-21
D1 verified it is underivable from `cad_property` and moved it to 3P-13),
`attributes.standardSubdivisionCode` (the rail whose parser got zero of six in the CTX
verdict), and roof, foundation and construction type (no producer anywhere in the bake).

**The trend products are geography-keyed, not parcel-keyed.** `pr-*` tools filter by zip,
county FIPS, CBSA or state at up to 25 geographies per call. That makes rent, market and
HPI context a fixed monthly cost amortized statewide rather than a per-parcel COGS line,
which is the opposite of how they were modelled.

**The live channel does not carry the money rails.** No transaction or sales history,
liens, mortgage, per-property AVM, comps, permits, HOA, flood depth, or SpatialRecord.
Those are REST products and those keys are dead, so the rails that would close the
capability gap remain unverified against a working endpoint.

**The plan-review edition binding is a declaration and refuses to be a derivation.**
`sql/005_engagement_edition.sql` states in its own comment that "nothing derives it from
jurisdiction, that guess is exactly what item 8 replaces with a declaration," and
`buildCitation()` throws without `editionId`, `bookId` and `sectionNumber`. The
jurisdiction-to-edition adoption table is therefore a deliberately empty slot, and it is
the thing that makes ICC content applicable to a parcel. Same division as Cotality: the
vendor brings content, we manufacture the binding.

**The third-party-IP obligation gate is more built than the doc set records.**
`hauska-mcp-server` carries migration 009, `source-obligation-meter.ts`,
`source-obligation-reader.ts` and tests. It accrues on every read including free
anonymous. Two behaviours are canon-grade and were found in code rather than in docs: an
unset rate produces a countable accrual with a null amount and `pending-rate` grace
terms rather than a zero, and a null adapter stamp reads as unmeasured rather than as
"not ICC." Detection, however, is an allowlist and regex heuristic (G-17, open).

**The accrual-trigger asymmetry.** ICC accrues on reference, so a cache hit still owes a
royalty and the meter must sit on the read path. Cotality accrues on acquisition, so
every serve after the first is free. A meter fixed to the read path charges us for
Cotality cache hits; a meter fixed to the fetch path under-reports the ICC obligation on
every cached read. One meter placement cannot serve both, so the trigger has to be a
declared property of the source.

**Store facts, measured.** `parcel_record` is 981,405 rows across exactly six counties:
Travis 48453 (380,917), Williamson 48491 (282,570), Hays 48209 (116,420), McLennan 48309
(114,254), Bastrop 48021 (62,256), Caldwell 48055 (24,988). `parcel_record_cell` holds
63,791,325 rows, which is 981,405 by 65 exactly. Cell state lives under the jsonb key
`kind`, not `state`.

**Address quality varies by county and will confound any vendor resolve-rate reading.**
Bastrop, Hays, McLennan and Williamson `situsAddress` cells carry full addresses with
city and ZIP. Travis and Caldwell carry bare street lines (`1006 WISTERIA CIR`,
`301 PITKIN DR`). Cotality's resolver takes a `fullAddress` and states match confidence
scales with completeness.

**The unincorporated path is structurally visible.** Every unincorporated parcel in the
test set carries exactly `not-applicable: 19`, the nineteen zoning and envelope rails
correctly excluded outside city limits. In-city parcels carry zero or one.

**A cell kind appears live that the county contract's documented set does not obviously
cover:** `refused` was observed on sampled parcels alongside `value`, `unaccounted`,
`absent-verified` and `not-applicable`. Not investigated this session.

## What's still open

The commercial agreement is unread, and four rights-envelope fields have no value without
it: `retention`, `reproduction`, `redisplay`, and `rate.unit`. The first two decide
whether the cache-and-compound model is lawful at all, and the fourth swings COGS by
roughly five times (per call versus per field).

The eval quota ceiling is documented at 100/day and has never been measured. About
fourteen calls were spent this session without reaching it. The bake-off needs 180.

Every BUY verdict outside the eleven probed MCP tools rests on the 2026-06-06 portal
catalog, not a live 200. The 2026-06-19 probe proved catalog and entitlement diverge.

Purge and exit for Cotality was never examined. ICC's agreement compels destroying all
stored copies on termination including vector databases; whether Cotality's carries
anything similar was assumed away, and if it does, `retain-and-mint` is unavailable and
the compounding-margin case collapses.

No ruling exists for what happens when a vendor value and a first-party CAD value
disagree. The pattern to copy is `_decisions/2026-09-11_setback_source_most_current_wins.md`.

Whether vendor-sourced values may enter the calibration loop is unresolved; the
2026-07-13 constraint currently forbids it for value and rent.

The vendor fetch path is a new writer and a new read path, and OPS-23 exists to eliminate
exactly those. It is mid-flight with wave 2 dispatched. The six-phase serving sequence
sketched this session has not been checked line by line against the OPS-23 reader and
writer model, and must be before anything is built.

Rails v3 (declaring a rail for every field a vendor can serve) is held deliberately.
OPS-21 D5 was moving the gate denominator from 17 to 65 during this session.

ICC's paid display licence is gated on demonstrating code use in the software to Ed
Cilurso, after which ICC drafts the SaaS agreement. That is a bizops step and no amount
of building moves it.

`at-get_property_analytics` and `at-get_property_climate_risk` return identical payloads,
which suggests the analytics tool is scope-narrowed on our eval entitlement. If a fuller
entitlement puts AVM and value behind it, that is the highest-value unknown available for
the cost of asking.

## Suggested canonical doc updates

`MEMORY.md` index line for Cotality currently reads as a blanket extinguish. It is
correct for the three REST products and wrong for the MCP eval channel, which is live.
This is the precise defect that caused the 2026-08-08 resurfacing, running in the
opposite direction. Correct the one-liner to name the channel, and correct
`cotality-hit-means-decommission-not-credential` the same way, preserving the
never-rotate rule for the REST keys unchanged.

`00_current_state.md` line 143 carries "Cotality extinguished" in the do-not-relitigate
block. Qualify it to "REST extinguished; MCP eval channel live and unprobed until
2026-09-12" and point at the new research doc.

`75l_cotality_data_stack_catalog.md` and `77b_cotality_integration_strategy.md` are both
already superseded and should stay so, but each should gain a pointer to
`_research/2026-09-12_cotality_reengagement_division_cogs_and_probe.md` as the current
reference, and a note that the MCP tool inventory in the 2026-06-06 catalog is stale
(eleven tools with changed prefixes, not fourteen).

`25b_monetization_provenance_storage_stack.md` section on the two meters should carry the
accrual-trigger asymmetry and point at ADR-032. It currently describes the inbound meter
as though on-reference is the only accrual shape, which is true of ICC and false of a
per-fetch vendor.

OPS-17 `G-17` should note it is now load-bearing for two sources rather than one, since a
second licensed source cannot ride the obligation ledger while detection is an ICC-shaped
heuristic.

`_decisions/2026-07-13_cotality_swap_public_record_migration.md` should gain a 2026-09-12
addendum recording that the R11 re-engagement is now scoped as OPS-16 P-176, that the
MCP eval channel was found live, and that the decision's reversal criteria are still NOT
met because no commercial agreement has been read.

`_catalog/county_contract_v0.json` cell-state documentation should be checked against the
live `refused` kind observed this session.

## Not done, deliberately

No commit. No push. `00_current_state.md` not regenerated. The operator asked for a
capture without a close.
