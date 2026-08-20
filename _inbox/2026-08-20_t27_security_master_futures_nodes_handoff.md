---
id: inbox_2026_08_20_t27_security_master_futures_nodes
title: The drivers layer cannot pay until the security master holds futures nodes
status: active
last_updated: 2026-08-20
applies_to: empressa-trading, smart-markets
owner: nick
related: [session_2026_08_20_t26_markets_substrate]
purpose: Handoff to whoever owns the security master. The Smart Markets drivers layer is built, deployed and correct, and its payload is unreachable for a reason that lives entirely upstream. States the evidence, the two candidate fixes, and the one fix that is NOT acceptable.
---

# The drivers layer cannot pay until the security master holds futures nodes

## Where this stands

The drivers adapter is built, merged and DEPLOYED (smart-markets `15869ca`,
revision `smart-markets-api-00008-jck`). It relays up to 33 curated driver
pointers across 11 futures roots from the cockpit route
`GET /futures/drivers/{symbol}`.

For equities and funds it works and is live: the layer now returns an EARNED
`absent-verified` naming the cohort it searched, replacing the `lookup-failed`
it served before.

For the 11 futures roots the payload actually covers, IT IS UNREACHABLE. That is
the whole product gap and none of it is in the Smart Markets repository.

## The evidence

Live, against production:

    GET /v0.1/twin/CL   HTTP 503, resolved:false
      "CL resolved to sec_01KX712ZQX3VF43FWWXZGETRTN, but neither the
       security-master node read nor its issuer carried a name; a twin is
       never labelled from its symbol or from a placeholder"

Same for GC, ES, and the `/CL` form. This has been failing since at least
2026-08-18, independently corroborated by a monitoring probe in the Cloud Run
request log that hit `/v0.1/twin/GC` and received a 503.

Reading the security master directly, the cause is deeper than a missing name:

    CL, GC, ES, SI, NG, ZB, M6E  ->  asset_class "equity"
                                     resolution_status "provisional"
                                     name null
                                     identifiers []
                                     issuer withheld
    CLZ25, GCZ25, ESZ25          ->  no node resolves at all

The security master holds NO FUTURES NODES. The roots that do resolve are
classed as equities.

The competing explanation, that Smart Markets reads the wrong field, was tested
and rejected by control: AAPL returns the SAME `asset_class: equity` and
`name: null`, but with `issuer_available: true` and `issuer.name "Apple Inc."`,
and its twin builds. So the field-reading path works. CL fails because it has no
trusted issuer link, which is the correct outcome for a node wrongly classed as
an equity.

## What would fix it

Either the security master mints proper futures nodes with a real asset class
and a name from an authority, or it stops classing futures roots as equities and
exposes whatever naming an exchange record provides.

## What is NOT acceptable, and why it is worth saying

Do not have Smart Markets override `asset_class`, and do not have it synthesise
a display name from the symbol. Both would assert a classification no authority
made, and the second is forbidden in that basis string by design. There are real
NYSE equities on these tickers, which is the second reason an override is wrong:
CL is Colgate-Palmolive as well as WTI crude, ES is Eversource Energy as well as
the E-mini, NG is NovaGold as well as Henry Hub.

That collision is already handled correctly on the Smart Markets side. The
drivers adapter refuses a `covered: true` answer for a ticker as a symbol
collision and names both sides, because relaying seven crude-oil driver rows
onto the Colgate-Palmolive twin with full provenance would be a correctly
sourced fact attached to the wrong subject. Any upstream fix has to keep that
distinction rather than flatten it.

## Adjacent finding, same file, not actioned

`resolveSymbol` in the Smart Markets union accepts `resolution_status:
"provisional"` as though it were confirmed. AAPL's production twin is built on a
provisional resolution today and nothing in the served payload says so. Changing
it touches every twin's resolution semantics, so it was scoped out rather than
done quietly. It belongs in the same conversation as the futures-node work,
because both are about what the security master is asserting versus what a
consumer is entitled to believe.
