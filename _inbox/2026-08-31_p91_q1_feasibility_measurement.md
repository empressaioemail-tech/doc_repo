---
id: 2026-08-31_p91_q1_feasibility_measurement
title: Q1 selector feasibility, X1 subdivision source and X2 draw-depth row size. Q1 is cortex-blocked; do not build it MCP-side
date: 2026-08-31
status: measured
plan_row: P-91 (v3 WDLL Q1, Q2, X1, X2)
snapshot: legacy-design-tools P:/tmp/legacy-design-tools-p91-stone, branch feat/p91-v3-vocab, commit 8f11e81ba950a79416873b3c14185dd1527f1748 (= origin/main at dispatch). Live probes against cortex-api-tds7av26va-uc.a.run.app, serving cortex-api-00672-ceq.
method: measurement lane (subagent, read-only, no git). Two load-bearing claims independently re-verified by the planner and named as such below.
---

# The question and the answer

Q1 asks that `find_parcel` gain `near: {query, radiusFt}`, `subdivision` and `street`. The question measured was how much of that existing cortex routes already serve, with no api-server change, because another seat holds live api-server worktrees and a Q1 needing cortex is a blocked lane rather than a shippable one.

The answer is that **Q1 is cortex-blocked and must not be built MCP-side in this wave.** This is the opposite of the M1 result last wave, and measuring first is what kept a build lane from being spent on it.

# Per parameter

`near` NEEDS A CORTEX CHANGE. No radius-search route exists anywhere in the place surface. The one purpose-built abstraction, `neighboring-context.atom.ts`, is registration only with zero route callers, which is a dormant mechanism rather than an available one. The centre point is NOT the missing half: three separate existing paths already resolve one, in `situs-search` address-point hits carrying latitude and longitude, in `POST /place/resolve` which geocodes any address, and in node-facets `cityLimitsFact.queryPoint`, live-verified at `{-97.31654, 30.10981}` for `48021:34137`. What is missing is the set search, not the origin.

`subdivision` NEEDS A CORTEX CHANGE AND A SOURCE, and per Q2's own rule it should ship as a refusal rather than a fuzzy match. No `txgio` column holds subdivision or legal text at all; the source shapefile's `LEGAL_DESC` field is documented as deliberately not captured. The existing parser was run against all six real `legalDescription` fixtures in the repo's own suite and extracted a subdivision on zero of six, including two that plainly name one.

`street` PARTIALLY SERVED. A house-number-prefixed query already works through the existing wrapper with no change. A bare street-name search, the "everyone on Pine St" case that Q1 exists for, is not served, because the prefix match is anchored on the full house-number-first address string. So the half of `street` that Q1 wants is also a cortex change.

# Route surface

Twelve endpoints across five files mounted under `/place/`. Exactly one is anonymous, `GET /place/node/:parcelNodeId/facets`, mounted before the `requireBrokerageAuthOrServiceToken` gate at `brokerageBrief.ts:319-326`. All others are gated. Live probes agreed with code reading on every route checked: facets 200 anonymous; situs-search, resolve and buildable-envelope all 401 anonymous. No code-versus-probe disagreement was found, which is worth stating explicitly because a disagreement there is the finding that matters and its absence is also a result.

# Defect found, and it belongs to another seat

`artifacts/api-server/src/lib/recordsSearchQueryPlan.ts:16` reads `/\bBLK(?:OCK)?\.?\s+(\d+[A-Z]?)\b/i`. That alternation expands to `BLK` or `BLKOCK` and can never match the literal word `BLOCK`. Verified by the planner by violation rather than by reading, which is why it is stated as a defect:

    NOMATCH  "BLOCK 3"
    MATCH    "BLK 3"  -> block=3
    MATCH    "BLK. 3"  -> block=3
    NOMATCH  "BLOCK 12A"
    NOMATCH  "PECAN GROVE BLOCK 3 LOT 5"

The intended pattern is `BL(?:OC)?K` or a plain `BLK|BLOCK`. This is a silent degradation and not a crash: a legal description carrying `BLOCK 3` yields no block term, so the records search query plan runs one term short and returns a wider result set that still looks like an answer. It sits on the records-request path, which is the P-85 lane and NOT the MCP tree, so this card does not fix it. Routed to the property seat as a handoff.

# X2, and the load-bearing number underneath it

`depth: "draw"` DOES NOT EXIST in shipped code. `GET_SMART_SITE_DEPTHS` is `["stub", "node", "hop1", "subgraph"]` and `ImplementedDepth` is `"stub" | "node"` only, both at `src/tools.ts:51-52`, planner-verified. So X2 cannot be measured against a real draw row, because there is no draw row. The checked-in `GOLD_DRAW` fixture serializes to 705 bytes standalone and 877 wrapped, and the lane correctly flagged that as a likely undercount, since that fixture carries a two-entry overlay array while the same parcel live carries ten fact families.

The finding worth more than the measurement: **the "4,711 average, 5,549 largest" figure that justifies today's node cap of 25 is not re-derivable anywhere in this repo.** It appears three times, at `src/tools.ts:42`, `tests/constants.test.ts:42` and `tests/tools.test.ts:1342`, in every case as a prose comment citing an external session. Planner-verified: those three are comments, not assertions, and no test or script recomputes them. The cap is therefore a number no instrument in the tree can reproduce, which is the same shape as the tag-instead-of-digest and the truncated-PR-number failures this program already records. A cap may still be correct; it is simply not currently evidenced here.

# Consequences

Q1, Q2 and the bare-street half of `street` are cortex work and move behind a property-seat ask rather than into this wave. The v3 MCP wave proceeds with the V items alone.

X2 stays UNMEASURED, declared, rather than being given a number derived from an unrepresentative fixture. Closing it needs either a real draw implementation measured against a fully populated parcel or a hand-built worst-case synthetic row.

The node cap of 25 is not changed on this card. Re-deriving its justification in-tree is a separate item, small, and worth doing before any cap is widened.
