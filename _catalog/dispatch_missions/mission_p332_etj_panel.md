## Mission — P-332: the panel serves the ETJ determination it is given, and declares the one it cannot trust

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-map` only and open one PR. You do not
merge or deploy; the integration seat does both. Any doc_repo change is handed back as a diff in
your close.

### What is wrong, measured 2026-09-18 on the live surface

Cortex computes a real ETJ answer (P-296 put it on the customer surface on 2026-09-17: point-in-polygon
against `tx_etj_boundary`, 355 rings). The Property Explorer panel throws it away.

| Parcel | cortex `/place/node/<id>/facets` | panel `/api/spine/property-atoms/<id>/facets` |
|---|---|---|
| `48453:134392` | `etjStatus: present` (Austin, ring `austin-tx:39`) | `etjStatus: unresolved` |
| `48209:97658` | `etjStatus: absent` | `etjStatus: unresolved` |

The code, read at hauska-map `cfe23197`:

- `apps/property-explorer/api/_lib/pe-record-to-facets.ts` `composeCityLimits` writes
  `etjStatus: "unresolved"` in all four of its branches (lines 212, 226, 232, 239 at that SHA), and
  a fifth literal sits near line 889.
- `apps/property-explorer/api/_lib/pe-property-atoms.ts` `applyRecordPatch` replaces the whole
  `cityLimitsFact` with the composed one, preserving only `queryPoint` (`withPreservedQueryPoint`,
  near line 671).

So the panel has a determination in hand and serves a placeholder in its place. This was found by the
P-204 lane (`_inbox/2026-09-17_p204-mid-cutover-serve-paths_close.json`, rail `etjStatus`) and is
deliberately separated from P-204's ruling: it is a customer defect today, not a bookkeeping choice.

### The trap: the value being discarded is not always coherent

Do not fix this by forwarding cortex's `etjStatus` verbatim. Cortex's own fact for `48453:134392`
reads:

- `status: "incorporated"`, `cityName: "Austin"`, basis `parcel_record cityLimits ... (source:
  landing_parcel_jurisdiction)`
- `etjFact.status: "present"`, basis `point-in-polygon against tx_etj_boundary etj_id=austin-tx:39
  (Austin: "AUSTIN 2 MILE ETJ", ring 39)`

A Texas extraterritorial jurisdiction is, by definition, unincorporated land outside the city's
limits. Those are two independently derived answers from two different sources, and they disagree.
Forwarding both as confident facts replaces one defect (a discarded answer) with a worse one (a
contradiction served as truth).

State a second mechanism before you settle on one: the ETJ layer may include areas the city treats
differently (a limited-purpose annexation, a ring drawn to the city's outer boundary, or a stale
ring), or the city-limits read may be the stale one. Measure; do not pick.

### What to build

1. **Serve the determination.** The panel's `cityLimitsFact.etjStatus` (and `etjFact`, if the wire
   type carries it) comes from the determination the payload already holds, not from a literal. Find
   every place in the panel path that writes `etjStatus` and say which ones you changed. There are at
   least five literals; there may be a second composer.
2. **Declare the conflict.** Where city limits say `incorporated` and the ETJ read says `present`,
   the panel serves a declared conflict that names both sources and both bases. It never serves
   `present` as a clean fact beside `incorporated`, and it never silently drops either side. Absent,
   present, unresolved and conflicting are four states, not a boolean.
3. **Never default.** If a determination is missing, the state is `unresolved` and says why. Do not
   derive ETJ from city limits or the reverse.
4. **Count the co-occurrence.** Read-only, under the heavy-scan lease if the read is heavy: across
   the six Phase 0 counties, how many parcels carry incorporated-plus-ETJ-present, by city. State the
   store, the snapshot and the query. This number decides whether the cortex side needs its own row,
   and you do NOT fix the cortex side (legacy-design-tools deploys are blocked on P-323 in any case);
   report it.

### Verify by violation

Pre-register your falsifiers before you run them, and state what result would prove each wrong.

- The pre-fix code serves `unresolved` for a payload carrying `present`; the post-fix code serves
  `present`. Show it by revert-and-run.
- The agreeing control: a payload carrying `absent` serves `absent`, and one carrying no
  determination serves `unresolved` with its reason.
- The conflict: an `incorporated` + `present` payload serves the declared conflict, and a fixture
  that forwards `present` verbatim fails your test.
- Live, after the integration seat deploys: `48453:134392` and `48209:97658` on the panel route. You
  cannot deploy, so name the exact probe and its expected result in your close.

### The three-question gate

Answer in your close: what executes this, what triggers it, what fails when it is violated, and what
bypasses it. A second serve path that composes city limits without going through your change (the MCP
depth-`node` response, the PDF, the share view) is a bypass: name the ones you find and say whether
each carries the same literal.

### Constraints

- No store writes, no deploys, no merges.
- County 48491 (Williamson) was restored from a point-in-time branch on 2026-09-17; do not touch it
  in any store.
- hauska-map main carries P-270 (#418, `cfe23197`), which edited both files above. Branch from
  current `origin/main` and declare the SHA you got.

### Close

Declare: the start commit, the PR number, every `etjStatus` write site you found and which you
changed, the falsifiers with both directions shown, the co-occurrence count with its snapshot, the
three-question gate answers, and `leave_behind`.
