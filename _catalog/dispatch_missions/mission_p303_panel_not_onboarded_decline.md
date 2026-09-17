## Mission — P-303: the panel stops declining a drawable envelope as "no zoning district observed"

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-map` and open a PR. You do not deploy.

### Where you work

`hauska-map`, fresh clone from `origin/main` under `P:/tmp/` into a NEW directory, branch
`fix/p303-not-onboarded-decline`. Declare the start commit (map main `93f832b6` at compile, which
carries P-249 #409). Register the clone under the property seat and remove the entry at close.

### The finding (A-205, measured 2026-09-17 on the P-249 canary proof, `_inbox/2026-09-17_p249_canary_proof.md`)

- Waco `48309:103015`, "8459 ROCK CREEK RD, WACO, TX 76708":
  - The live panel route (`GET https://smartsite.cloud/api/spine/property-atoms/48309%3A103015/facets`)
    returns `facets.zoning` = `{"district":"R-1B","jurisdictionKey":"waco-tx",...}`, and in the
    same payload `facets.envelope` = `{"status":"declined","declineReason":"no-zoning-stamp",
    "disclosure":"No zoning district observed for parcel..."}`.
  - The factory ledger holds a `setbackFrontFt` value cell for the parcel.
  - Its buildable-envelope atom is `no-buildable-area` with reason "no district on record —
    jurisdiction not yet onboarded" and no depth-warm promotion.
- The cortex route (LDT #701, live on `cortex-api-00820-jex`) now draws this parcel (`status: ok`,
  geometry present). The panel does not, so XD-2 ("Waco's panel declines what its own endpoint
  draws") and X8/XD-5 remain.
- The shared fixture (`apps/property-explorer/src/lib/__fixtures__/envelope-verification.json`,
  case `not-onboarded`) already says this atom is unverified. The panel reaches a different,
  earlier decline branch in `apps/property-explorer/api/_lib/atom-chain-to-facets.ts`, which the
  fixture's divergence test does not exercise.
- The class is about 153,775 of the 490,185 six-county `no-buildable-area` atoms. Hays
  `48209:97658`, a reasonless zero, already draws on the live panel with `figureWithheld: true`.

### What to build

1. Find the branch that turns an atom reason of "no district" or "not onboarded" into
   `no-zoning-stamp`. Where the payload's own zoning facet holds a district and a setback table
   exists, that atom must take the same `envelope-unverified` branch as the reasonless zero:
   drawn, figure withheld, disclosure naming the unverified atom.
2. A payload with no zoning district still declines `no-zoning-stamp`. Never invent a district.
3. Extend the fixture divergence test so it runs through the decline branch as well as the
   verification predicate. Do not edit the fixture's cases or its `casesSha256` unless you also
   change LDT's copy in the same change set, which this lane does not do; say whether a new case
   is needed and why.
4. List every other reason string that reaches `no-zoning-stamp` today, and say for each whether
   it is a genuine absence.

### Falsifiers, pre-register your answers first

1. A fixture payload with a zoning facet holding `R-1B` and a not-onboarded atom yields
   `status: ok`, `declineReason: envelope-unverified`, `figureWithheld: true` (test).
2. The same payload with the zoning facet absent yields `no-zoning-stamp` (test).
3. Reverting the fix fails a test.

### Do not

- Deploy, merge, or touch the cortex route or LDT.
- Launch sub-agents.

### Close

Snapshot; files touched; the PR with every CI check's literal conclusion string; the reason list;
the falsifiers with evidence. `status`: `closed-partial` until the integration seat deploys and
Waco `48309:103015` draws on smartsite.cloud. `probe`: `{"notApplicable": "build lane; graded
on the deployed panel"}`. `subAgents`. `leave_behind`.
