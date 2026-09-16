## Mission — P-297 (LDT half) with P-269: a slated rail serves each parcel from its own cell

You launch no sub-agents (FAN-DEPTH 0). You build in `legacy-design-tools` (and in `hauska-map`
only if your CP1 read shows a surface there cannot render a declared refusal) and open PRs. You
do not deploy. The hauska-engine half of P-297 is a separate lane that follows the P-293
remainder; you build the rule so that lane can mirror it.

### The ruling you build (read it first)

`_decisions/2026-09-16_county_verdict_is_not_the_serve_switch.md` (operator ruling A-193; OPS-24
law 7). The (county, rail) gate verdict is a completeness and publish grade. It no longer decides
what a parcel shows. On a slated rail each parcel is served from its own cell:

| Cell state | Served as |
|---|---|
| `value` (and a verified zero where the rail has one) | the value, with its source and vintage |
| `absent-verified`, `not-applicable` | the stated absence, with its reason |
| `refused`, `unaccounted` | a declared refusal, with the cell's reason |
| no cell, a malformed value, or an unreadable store | a declared refusal naming that |

The legacy or baked value is never the answer for a slated rail. The county verdict still travels
on the response as information. Unslated rails keep their current path. The publish gate is
unchanged.

### Where you work

Fresh clone from `origin/main` under `P:/tmp/` into a NEW directory, branch
`fix/p297-cell-serve`. Declare the start commit (LDT main was `9ce30b8` at compile). Register the
clone in `_catalog/seat_register.json` under the property seat, and remove the entry at close.
P-249 (PR #701) is open on `artifacts/api-server/src/lib/buildableEnvelope/`, and P-296 may open
on the ETJ path; you touch neither. In hauska-map, the P-249 branch (PR #409) is open on
`apps/property-explorer/api/_lib/atom-chain-to-facets.ts`'s envelope branch; stay out of it.

### Why it matters now (A-192)

`resolveAllowlistState` (`artifacts/api-server/src/lib/parcelRecordAllowlist.ts`, line 547 at
`9ce30b8`) returns `record` only on `pass`, and about 19 `*ServeCutover.ts` modules follow it;
`setbacksFactServeCutover.ts:57` returns `null` on anything else, so the caller keeps the baked
setbacks. The verdict refuses on one unaccounted cell, so P-256's honest correction (held until
this lands) would switch every parcel in all six counties back to the stale bake for
`setbackFrontFt`, which is slated in all six.

### P-269, built in the same change (same files)

`artifacts/api-server/src/lib/cadRollFactFromParcelRecord.ts` at `9ce30b8`:
`dollarFactFromParcelRecord` (line 68) returns `null` for a `refused` cell and for a `value` cell
that does not coerce, and its header says "the caller keeps the legacy value";
`resolveValueBasisFromParcelRecord` (line 121) defaults `valueBasis` to `stratmap-redistributed`
whenever assessedValue is not a present dollar, a label nothing verified;
`livingAreaSqftFromParcelRecord` (line 144) and `yearBuiltFromParcelRecord` (line 163) have the
same refused-becomes-legacy shape. Under the ruling each of these becomes a declared refusal.
`valueBasis` is absent when the store asserts nothing about assessedValue (refused or
unaccounted). Whether an `absent` assessedValue cell still supports `stratmap-redistributed` is a
question you answer in CP1 from the CTX-B1 ruling (A1) and the StratMap adapter's reach; do not
change it without that answer.

### What to build

1. **CP1 first.** List every `*ServeCutover.ts` module and every caller of
   `resolveAllowlist`/`resolveAllowlistState`, with what each does today on `refused` and on
   `legacy`, and every surface that renders the result (facets payload, smartsite MCP payload,
   the hauska-map card). Say whether any LDT path consumes retrieval-api's `/record` `serve` field
   (which still decides by county until the engine half lands); if one does, your code must decide
   from the cell, not from that field. Name the refusal wire shape the repo already uses and use
   it; do not invent a new absence state if one exists.
2. **One rule, one place.** A single function takes the slate membership and the parcel's cell
   and returns the serve decision in the table above; every cutover module uses it. The county
   verdict is read only to carry it on the response.
3. **A shared fixture** (`__fixtures__/cell-serve-rule.json`, one row per cell state, with the
   expected decision) and a test that fails if the function disagrees with it. The engine lane
   will copy the same fixture and add the matching test on its side; state the file's shape in
   CP1 so it can.
4. **P-269's four functions** as described above, with tests, including one that fails if a
   refused cell ever yields the legacy value.
5. **Measure the customer consequence before claiming anything**, read-only
   (`FACTORY_DATABASE_URL_RO`, index-bounded `place_key` ranges, `statement_timeout` set, and the
   heavy-scan lease if P-281's control routes answer): for every slated (county, rail) pair, the
   count of cells by kind, and today's verdict. That is the number of parcels whose served answer
   changes, by pair. Put the table in the PR body.

### Falsifiers, pre-register your answers first

1. A fixture county whose verdict is `refuse` serves a parcel with an earned cell as that value
   (before the change: the baked value).
2. A parcel with an `unaccounted` cell on a slated rail is served a declared refusal with its
   reason, never the legacy or baked value, on the facets payload and the MCP.
3. A `pass` county's served values are byte-identical before and after on two fixture parcels
   whose cells are all `value`.
4. Deleting the refusal branch, or making the rule read the county verdict, fails a test.
5. Editing the shared fixture without the function, or the reverse, fails a test.

### Do not

- Change the slate, the publish gate, the gate scheduler, or any factory writer.
- Touch hauska-engine (its half follows), `buildableEnvelope/`, or the P-249 map branch.
- Deploy, or launch sub-agents.

### Close

Snapshot per repo; files touched; each PR with every CI check's literal conclusion string; the
CP1 inventory; the consequence table with its SQL and snapshot time; the five falsifiers with
evidence; the fixture shape for the engine lane. `status`: `closed-partial` until the engine half
lands and both are deployed and graded on the served surface. `probe`: `{"notApplicable": "build
lane, PR not deployed; graded by P-297's instrument on the served surface after both halves
deploy"}`. `subAgents`. `leave_behind`.
