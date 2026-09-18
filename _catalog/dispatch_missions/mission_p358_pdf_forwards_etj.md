## Mission — P-358: the PDF says what the panel says about ETJ

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-engine` only and open one PR, branched
from current `origin/main` with the SHA declared (`c41a1482` at compile). You do not merge, deploy or
build production PDFs; the integration seat does. Any doc_repo change is handed back as a diff in your
close.

### What is wrong

Since P-332 (hauska-map #419, live on Property Explorer `m6wqid8u7`) the panel serves an ETJ
determination in four states: `present`, `absent`, `unresolved`, `conflicting` (city limits say
`incorporated` and the ETJ read says `present`; a Texas ETJ is by definition outside city limits, so
the two reads disagree and the panel says so, naming both). The PDF and the site-plan report still say
`unresolved` for every parcel, because the engine writes the answer as a literal. The row's line
numbers are stale; at `c41a1482`:

- `packages/engine-core/src/site-plan/feasibility-model.ts:209`: `JurisdictionFacts.etjStatus` is
  typed as the literal `"unresolved"`, and the comment above it says no engine ETJ source exists.
- `packages/engine-core/src/site-plan/report-model.ts:1304`: `etjStatus: "unresolved"`.
- `packages/engine-core/src/site-plan/pdf/feasibility.ts` ~lines 239 to 261: the ETJ chip's absent
  reason ("No ETJ boundary source is wired for this county yet...") and the review-path sentence.
- `packages/engine-core/src/site-plan/narrative-section-client.ts:103` and `report-model.ts:270` and
  `:392`: sentences that say ETJ status is not resolved.

### Where the answer comes from

The engine builds the report from the retrieval service's rails (`recordReader`, the same path that
already carries `cityLimits` with its refusal and absence forms, P-302). The `etjStatus` rail exists
in the rail registry (`services/retrieval-api/src/parcel-record-rail-registry.ts:54`,
`engine-core/src/parcel-record/rail-keys.ts:43`) and reads `excluded-mid-cutover` today. **P-336**
(in flight) writes the `etjStatus` ledger cells with the four states, `conflicting` naming both
sources, and makes the retrieval reader serve them. The PDF reads THAT rail, through the reader it
already uses. It never reads cortex's facets and never derives ETJ from city limits (P-332's rule 3).

Until P-336's cells are applied and the rail serves `record` for a county, the report says
`unresolved` with the reason the rail gives, which is the honest state. Your change must be correct
for both: a slated rail with each of the four states, and an unslated rail.

### What to build

1. `JurisdictionFacts.etjStatus` becomes the four-state union, with the determination's source,
   basis and (for `conflicting`) both readings carried beside it, the way `cityLimitsLedgerAnswer`
   carries the city-limits refusal and absence.
2. `report-model.ts` composes it from the `etjStatus` rail answer; an unslated rail, a refusal or a
   failed fetch reads `unresolved` with its reason, never a fabricated state.
3. The PDF renders each state: `present` names the city and ring; `absent` says no ETJ reaches the
   parcel on the rings consulted; `conflicting` names both readings on the page and says which
   authority to confirm with; `unresolved` keeps today's honest sentence with the real reason. The
   review-path sentences change only where the state is known.
4. The narrative and summary sentences that assert "not yet resolved" read the state instead.
5. The four-state wording and the `conflicting` rule are shared with hauska-map's
   `pe-etj-determination.ts`. P-331 is building the cross-repo drift check for shared literals; name
   your shared literals in your close so they join its table.

### Verify by violation

Pre-register your falsifiers. Fixtures from the rail's four states plus an unslated rail and a failed
fetch: the pre-change code renders `unresolved` for all six (show it), the post-change code renders
each correctly, and a conflicting fixture shows both readings on the page. Build two PDFs locally from
fixtures shaped like `48453:134392` (conflicting: incorporated, ETJ `present` on `austin-tx:39`) and
`48209:97658` (absent, san-marcos-tx, 1 ring consulted) and extract their text. Name the probe the seat
runs after P-336 applies and this deploys: `node --use-system-ca scripts/surface-probe.mjs` in doc_repo,
the PDF leg on those two parcels, reading the state the panel reads.

### The three-question gate

Answer in your close: what executes the ETJ state on the PDF, what triggers it, what fails when the PDF
and the panel disagree (today nothing; say what you add), and what bypasses it.

### Constraints

- No merges, no deploys. engine-api FOLLOWS LATEST (a deploy ships itself unless `--no-traffic`); the
  seat deploys with `--no-traffic` and shifts after a graded canary.
- hauska-engine #474 (P-361) is being re-pinned in this repo this wave; do not touch
  `packages/engine-core/scripts/destructive-write-*`.

### Close

Declare: the start commit and PR, the files changed, the rendered text for each state, the two fixture
PDFs' extracted text, the falsifiers with both directions shown, the shared literals for P-331, the
probe for after P-336, the three-question gate answers, and `leave_behind`.
