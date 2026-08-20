---
id: inbox_2026_08_20_t27_point_value_divergence
title: Two in-repo derivations disagree about DXY and VIX by 1000x
status: active
last_updated: 2026-08-20
applies_to: empressa-trading
owner: nick
related: [session_2026_08_20_t26_markets_substrate, inbox_2026_08_20_t27_universe_delist_forensic]
purpose: Records a live divergence between presets.POINT_VALUES and paper/engine._point_value that the point-value policy lane surfaced and correctly declined to resolve. Filed rather than fixed, because resolving it means picking which of two in-repo derivations is wrong, and that is a domain ruling rather than a code change.
---

# Two in-repo derivations disagree about DXY and VIX

## The divergence

`app/bots/presets.py`:

    POINT_VALUES["DXY"] = 1000.0
    POINT_VALUES["VIX"] = 1000.0

They are the ONLY two non-slash keys in the 51-key table carrying a value other
than 1.0. Verified at runtime, not read off source.

`app/paper/engine.py` around line 173, on `origin/main` today:

    def _point_value(sym: str) -> float | None:
        if not sym.startswith("/"):
            return 1.0
        ...

So the paper engine values DXY and VIX at 1.0 while the contract table values
them at 1000.0. A thousandfold disagreement, live.

## Why this was nearly repeated rather than found

The point-value policy lane's first resolver copied that same
`not sym.startswith("/") -> 1.0` rule. It caught the error before writing a
single test, by diffing its resolver against all 51 table keys rather than
against its own expectations. Had it tested its resolver against current
behaviour instead of against the table, it would have asserted the defect as a
specification and the fix would later have read as a regression.

That is the general rule, and this is a clean instance of it: when writing a
test for existing behaviour, verify the expected value against the source
authority, not against current output.

## What is NOT established, and must not be asserted

WHETHER THIS IS REACHABLE. The lane established that bots cannot reach
`paper/engine._point_value` with DXY or VIX. The manual trade route was NOT
established either way. So the population is unmeasured, not zero, and nobody
should write down that it has never fired without doing the work.

WHICH SIDE IS WRONG. This is the reason it is filed rather than fixed. Either
DXY and VIX belong in the table with a 1000 multiplier and the paper engine is
understating them, or they do not belong in the table at all and the 1000.0
entries are the defect. `app/data/cme_contract_specs.json` cannot settle it:
DXY is an ICE product and VIX is Cboe, so the CME FPRF feed is the wrong
authority for both, and that was already recorded when the point-value
populations were split.

Resolving it needs an authority for ICE and Cboe contract specifications, or an
operator ruling that these two symbols are index references that are never
sized as contracts. Do not guess, and do not make the two modules agree by
copying one into the other, which would launder a disagreement into a
consistency.

## Adjacent, and cheaper

A second collision worth folding into the same pass. `stop_grade.py` already
carries a `resolve_point_value` returning a `KnownPointValue | UnknownPointValue`
union with provenance, and the policy lane added a function of the SAME NAME
with a different shape. Both now exist. The lane pinned their one behavioural
divergence with a two-derivation agreement test rather than papering over it:
`stop_grade` normalises case and the newer one does not. Converging them is a
backlog item, and whichever survives should be the one carrying provenance.
