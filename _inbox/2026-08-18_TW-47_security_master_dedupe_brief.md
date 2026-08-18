---
id: 2026-08-18_TW-47_security_master_dedupe_brief
title: TW-47 — collapse the pre-TW-36 duplicate security nodes and backfill alias eras
status: dispatch-ready
last_updated: 2026-08-18
applies_to: empressa-trading
owner: nick
authority: D-083 (2026-08-18 cockpit deploy window, 3e222e68 live)
related:
  [
    _rd_disclosure_twin/08_build_scope.md,
    _inbox/2026-08-18_TW-44a_cockpit_served_node_read_close.md,
    _inbox/2026-08-18_TW-44c_served_issuer_link_close.md,
  ]
---

# TW-47 — the catalog over-exists, and the served walk has nothing to stand on

## Why this exists

The Smart Markets union layer resolves a symbol through the cockpit's served
read `GET /securities/lookup`. Every symbol tried returns, at HTTP 200:

    {"node_id": null, "resolution_status": "not_found",
     "reason": "no node resolves 'AAPL' at the requested as-of"}

The planner initially read that as an empty catalog and proposed minting. That
was wrong. The operator-gated read run in the D-083 window found the opposite:

| Symbol | Duplicate provisional security nodes |
| ------ | ------------------------------------ |
| AAPL   | 24                                   |
| SPY    | 6                                    |
| MSFT   | 5                                    |
| GC     | 2 (`GC` and `/GC`)                   |

AAPL additionally carries **zero `identity.symbol` alias atoms**, so the served
era-walk has no era to read even before duplication forecloses a single answer.

So the resolver is not failing. It is refusing to guess among pre-TW-36
duplicates: the venue-seam disease TW-36 stopped at mint time, sitting in the
table as historical residue. The remediation is therefore NOT minting, which
would add to the pile. It is a merge/adopt pass collapsing duplicates onto
canonical survivors, plus an alias-era backfill.

The read surface is already proven ready underneath. In the same window,
`GET /securities/node/sec_01KW9M9AHG6KH27D3XB1RHQC7E` returned 200 with AAPL,
XNAS, equity, active, the canonical id echoed, and the trusted issuer link
`iss_01M089R4AK4Q2AHVY6GJ96H7E8` / "Apple Inc." through the cik-exact trust
boundary; keyless returned 401. That node is the XNAS-qualified survivor. The
catalog needs deduplicating under a surface that already works.

## Scope

1. **Collapse duplicates onto a canonical survivor per (symbol, venue).**
2. **Backfill `identity.symbol` alias eras** so the served era-walk has eras to
   read at an as-of.
3. Leave the union layer alone. Its two defects are a separate PR (below).

## The survivor rule must be written down before anything is merged

Do not infer it per-symbol at runtime. State the rule, apply it uniformly, and
record the choice per collapsed group. The proven-good AAPL node is
venue-qualified (`primary_venue: XNAS`) and carries a trusted issuer link;
that is evidence for a rule, not a rule.

Name explicitly how the rule handles:
- a group where more than one candidate carries a trusted `cik-exact` issuer link
- a group where NO candidate carries one
- `GC` versus `/GC`, which is a symbol-form collision rather than a venue seam
  and may deserve a different rule than the equities — say which and why
- `resolution_status: "provisional"` on the survivor: does the pass promote it,
  and if so on what evidence? Do not promote to `resolved` merely because the
  node survived a merge. Surviving is not evidence.

## Three traps already documented — do not rediscover them

**Identifier rows are read on the canonical id only.** TW-44a recorded this: rows
still attached to a merged-away loser do not appear on the served read, matching
`/admin/nodes/{id}`. The live survivor already returns `identifiers: []` and
`identifiers_json: null`. So decide deliberately whether the merge re-points
identifier rows at the survivor. If it does not, say so — the union can still
name a node from `current_symbol`, but a CUSIP or FIGI stranded on a loser is
invisible forever and nothing will report it.

**Retired-node trust narrowing (TW-35).** Some `cik-exact` `issued_by` edges
deliberately sit on retired nodes, and `trusted_issuer_links` applies
`exclude_retired_securities=True`. A merge changes node status, so it can change
which issuer links are trusted. Check whether your pass alters the trusted-link
set for any survivor, and if it does, that is a finding to report before
applying, not a side effect to absorb.

**A merge is a production data write, so the code that interprets it must
already be live.** It is: `3e222e68` is deployed as of D-083. Do not let this
pass depend on anything unshipped.

## Mandatory shape of the run

- **Dry run first, and its output is the reviewable artifact.** Per group: the
  candidates, the chosen survivor, the losers, the rule that chose it, and the
  alias eras that would be written. No writes in this mode.
- **State expectations before applying** — counts of nodes merged, edges
  re-pointed, alias eras created — then re-verify against actuals afterwards.
  A number that lands differently than predicted is a finding.
- **Backup or snapshot before the write**, and record how to reverse it.
- **Serialize it.** Do not run a heavy catalog scan concurrently with the paper
  soak's own DB work.
- **Never touch the A/B arms, bot state, positions, stops, or the ledger.** This
  pass is confined to the securities graph. Snapshot both sides and diff, as
  D-083 did.
- **Minting stays off.** The nodes exist; the pass collapses and links, it does
  not create. If a group looks like it needs a new node, stop and report.

## Verification that would convince the planner

After the pass, from outside, with the service key:

    GET /securities/lookup?symbol=AAPL      -> a node_id, resolution_status resolved-or-stated
    GET /securities/node/<that id>          -> 200, XNAS, equity, trusted issuer link
    GET /v0.1/twin/AAPL   (union, anonymous, no key)

The third call is the one that matters. It should stop saying an absence and
start returning a twin — or name the next real gap. Note the union has two
defects of its own that will surface exactly here (below), so a `lookup-failed`
naming a display name is expected until that PR lands, and is NOT this pass
failing.

Also confirm `SPY`, `MSFT`, and the `GC` / `/GC` pair.

## The union's own two defects — planner-owned, separate PR, do not fix here

1. **`displayName` reads the security node's `name`, which is null by design.**
   `apps/api/src/upstreams/cockpit.ts` does `wire.name?.trim() ?? ""` and fails
   the read when it is empty. Names are issuer-only in the cockpit's `Node`
   model. TW-44c now serves `issuer.name` ("Apple Inc.") and the adapter ignores
   it. So the moment a symbol resolves, every equity and fund twin fails on a
   missing display name. Fix: fall back to the issuer's name for issuer-bearing
   shapes; never fabricate one.

2. **The absence basis overclaims.** The cockpit says "no node resolves 'AAPL'
   at the requested as-of". The union renders "the security master holds no node
   for the exact symbol" — a claim about the catalog's contents that the upstream
   did not make, and which this finding proves false. Fix: relay the upstream's
   own sentence. Log the underlying contract gap — 0.1.0 cannot distinguish
   "nothing exists" from "nothing resolves" — as a fifth entry beside the four
   already recorded in the design system's section 8.
