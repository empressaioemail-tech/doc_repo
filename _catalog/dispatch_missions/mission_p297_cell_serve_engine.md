## Mission — P-297 (engine half): retrieval-api's `/record` serves each parcel from its own cell

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-engine` and open a PR. You do not
deploy; the integration seat deploys retrieval-api together with the LDT half.

### The ruling you build (read it first)

`_decisions/2026-09-16_county_verdict_is_not_the_serve_switch.md` (operator ruling A-193; OPS-24
law 7). The (county, rail) gate verdict is a completeness and publish grade and no longer decides
what a parcel shows. On a slated rail each parcel is served from its own cell:

| Cell state | Served as |
|---|---|
| `value` (and a verified zero where the rail has one) | the value, with its source and vintage |
| `absent-verified`, `not-applicable` | the stated absence, with its reason |
| `refused`, `unaccounted` | a declared refusal, with the cell's reason |
| no cell, a malformed value, or an unreadable store | a declared refusal naming that |

The legacy value is never the answer for a slated rail. The verdict still travels on the response
as information. Unslated rails keep `legacy-transitional`.

### Where you work

`hauska-engine`, fresh clone from `origin/main` under `P:/tmp/` into a NEW directory, branch
`fix/p297-cell-serve-engine`. Declare the start commit; it must include the P-293 remainder
(merged as engine `9e5e793`, PR #462: `parcel-record-db.ts` reads every verdict string). Register the clone under the property seat and
remove the entry at close. You touch `services/retrieval-api/src/parcel-record-reader.ts`, its
slate mirror if one exists, and their tests.

### The code today (read at `d88cf65`)

`services/retrieval-api/src/parcel-record-reader.ts`, around line 105: for a slated pair,
`serve = verdict.verdict === "pass" ? "record" : "refused"`, and a slated pair with no usable
verdict stays `legacy-transitional`. That is the county-level switch the ruling retires. The
header says it mirrors LDT's `parcelRecordAllowlist.ts` "exactly"; the LDT half (lane
`p297-cell-serve-ldt`) changes that file too.

### What to build

1. The serve decision for a slated rail comes from the parcel's own cell through the table above.
   The verdict is loaded and returned as information only.
2. Name the response's serve states in CP1 (today `record`, `refused`, `legacy-transitional`) and
   say whether the table needs a new state for a stated absence, or whether `record` with the
   cell's absence already carries it. Change the wire only if you must, and list every consumer
   of `/record` (LDT's `parcelRecordReaderClient.ts`, the Hauska MCP, anything else you find) with
   what each does with the change.
3. Copy the LDT lane's shared fixture (`cell-serve-rule.json`; its shape is in that lane's CP1 or
   close; if it has not landed, read its PR) into this repo and add a test that fails when this
   reader disagrees with it. If the LDT lane has not published the fixture yet, stop at CP1 and
   report; do not invent a second one.

### Falsifiers, pre-register your answers first

1. A slated pair whose county verdict is `refuse` serves a parcel with a `value` cell as that
   value.
2. A slated pair whose parcel cell is `unaccounted` serves a declared refusal with its reason,
   whatever the county verdict says.
3. An unslated pair is unchanged.
4. Making the decision read the verdict again fails a test; editing the fixture alone fails a test.

### Do not

- Change `parcel-record-db.ts` beyond what the P-293 remainder already merged, the slate, or any
  other route.
- Deploy, or launch sub-agents.

### Close

Snapshot; files touched; the PR with every CI check's literal conclusion string; the consumer
list; the four falsifiers with evidence. `status`: `closed-partial` until both halves are deployed
and P-297's instrument passes on the served surface. `probe`: `{"notApplicable": "build lane, PR
not deployed; graded by P-297's instrument after both halves deploy"}`. `subAgents`.
`leave_behind`.
