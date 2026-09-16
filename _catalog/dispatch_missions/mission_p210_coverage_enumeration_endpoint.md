## Mission — P-210: build the coverage-check endpoint P-205's fail-closed refusal is blocked on

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

### Where you work

`hauska-engine`, `services/retrieval-api`. No worktree exists yet for this lane. Clone fresh
from `origin/main`, cut your own branch, and declare the commit you started from before you
write anything. This lane runs after this session's `hauska-engine-api` deploy (P-213/P-238)
has settled — do not start until that is confirmed serving, since you are working in the same
repo and want a clean base.

### The ruling that unblocks this row

Operator, 2026-09-16, `_decisions/2026-09-16_texas_scaleup_sequence_and_four_rulings.md`,
ruling 2: **"Covered" means what actually serves the customer — the serving path is canonical.
The search index and the ledger are inputs to that answer, not rival definitions of it.**

This resolves the fork P-210 was carded to name (A-154, 2026-09-14): three candidate meanings
of "covered" disagreed — the search index (`txgio_parcel`/`txgio_address`, broad), the Factory
ledger (`parcel_record`/`parcel_gate_verdict`, six counties as of last measurement), and the
serving path (baked snapshots, demonstrably broader than six, never enumerated). Evidence that
made the serving path the right answer: `48029:109766` (San Antonio, Bexar County, 48029)
returns situs/zoning/flood all PRESENT through `get_smart_site`, while Bexar is in NEITHER the
ledger NOR the gate-verdict table. A customer already gets a real, earned answer there; calling
that "uncovered" would be false, and calling it "covered" via the ledger is impossible since it
has no ledger row at all.

### The exact contract you are building, in full, from the lane that named this dependency

`_inbox/2026-09-14_p205-coverage-refusal_CONTRACT.md` (written by the `p205-coverage-refusal`
lane specifically for this follow-on). Read it in full before you write code; it is short and
answers most of the questions you will otherwise have to re-derive. Summary, but read the
source document for the parts elided here:

**Endpoint:** `GET /parcel-record-gate-verdict/coverage/check?city=<CITY>&state=<ST>&zip=<ZIP>`

Sibling to the existing `app.get("/parcel-record-gate-verdict/:countyFips/:railKey", ...)` at
`services/retrieval-api/src/server.ts:441-476` — read that handler for this service's
conventions (factory-store-not-configured → 503 with `errorClass`, read-failed → 503 with
`errorClass`, `c.json(...)`). **Route-ordering trap:** confirm your new literal
`/coverage/check` segment does not get shadowed by, or itself shadow, the existing
`:countyFips/:railKey` dynamic segment — Hono matches by registration order and the existing
route's `countyFips` param is regex-constrained to `\d{5}`, so `"coverage"` should fail that
constraint and fall through, but verify this with a real request rather than assuming from
reading the regex.

**Response — exactly one of three shapes:**

```jsonc
{ "status": "covered" }
{ "status": "not-covered", "countyFips": "48027", "countyName": "Bell", "state": "TX" }
{ "status": "indeterminate", "reason": "human-readable, logged verbatim by the caller" }
```

`not-covered` MUST carry all three of `countyFips`/`countyName`/`state` — the LDT-side client
already built (`placeCoverageSource.ts`) treats a `not-covered` body missing any of the three as
`indeterminate` rather than guessing, so an incomplete `not-covered` is silently downgraded, not
rejected loudly. Match that contract exactly; the consumer side is already merged (LDT PR #690)
and will not change for you.

**Auth/base-URL convention:** same as `fetchGateVerdict`/`fetchParcelRecord`
(`parcelRecordReaderClient.ts` on the LDT side) — `HAUSKA_RETRIEVAL_API_URL`/
`RETRIEVAL_API_URL`/`BRIEF_RETRIEVAL_API_URL` for base, `Authorization: Bearer
<HAUSKA_RETRIEVAL_API_KEY/RETRIEVAL_API_KEY/BRIEF_RETRIEVAL_API_KEY>`.

**Freshness:** cacheable. Ledger/serving-path membership changes only on a Factory publish, not
a high-frequency event. A short-TTL cache (a few minutes) is correct; do not over-engineer
freshness here.

### The actual hard part, not fully specified by the contract — this is your real work

The contract tells you the shape; it does not tell you the query, because nobody has ever
enumerated the serving path. The ledger (`parcel_record`/`parcel_gate_verdict`) is NOT the
answer per the ruling above — it undercounts (Bexar serves and is absent from it). The raw
`txgio_parcel`/`txgio_address` index is NOT the answer either — it overcounts (a row existing
in the index does not mean any rail can return an earned fact; that is exactly the bug P-205
was dispatched to fix, reproduced live on Bell/Killeen 76541: parses to TX, hits the 254-county
index, finds nothing, falls through to a bare no-hit).

Your job is to find or build the real signal: **given a county, can the serving path — whatever
actually assembles `get_smart_site`'s response — return at least one earned (non-refused,
non-absent-because-no-source) fact for a parcel in it.** Trace what actually produces the Bexar
card (situs/zoning/flood present) to find that mechanism; it is not the same code path as the
ledger gate. Read before you guess. If the true answer turns out to require a live probe rather
than a static membership query (i.e., "covered" is provable only per-parcel, not per-county in
the abstract), say so plainly in your close rather than forcing a county-level answer the data
does not support — an honest `indeterminate` beats a confident wrong `covered`.

### Fail-closed discipline — this is a hard operator constraint, not a suggestion

**Unconditional. There is no code path that reaches `covered` or `not-covered` without an
explicit, well-formed, positive verdict.** A timeout, a 5xx, a malformed body, an unreachable
DB, a query you are not confident in — every one of these is `indeterminate`, never a guess in
either direction. The LDT-side consumer (already built, already tested with 7 violation cases
in `placeCoverageSource.test.ts`/`txgioAddressResolveCoverage.test.ts`) treats YOUR
`indeterminate` as `coverage_check_unavailable` and your `covered`/`not-covered` as ground
truth it will act on directly. If you are not certain your query answer is correct, your
endpoint's job is to say so, not to have an opinion.

### Falsifiers, pre-register your answers before you run anything

1. **Bexar, 48029.** Query your endpoint for a Bexar locality. Given the ruling, this should
   resolve `covered` (the serving path answers for it) even though it is absent from both the
   ledger and would need to be checked against whatever the real serving mechanism is — prove
   this with your actual built query, not by asserting the ruling implies it.
2. **Bell/Killeen, 76541.** Query for this locality. Per the ruling and P-205's own live
   reproduction, this should resolve `not-covered` with `countyFips: "48027"`, `countyName:
   "Bell"`, `state: "TX"` — or, if your traced serving-path signal genuinely cannot support a
   county-level answer for Bell specifically, `indeterminate` with a real reason, never a
   guessed `covered` or a guessed `not-covered` without the three required fields.
3. **Kill the DB / time out the query / feed a malformed locality.** Prove each independently
   resolves `indeterminate`, never crashes the endpoint into a 500 with no body, never falls
   through to a default `covered`.
4. **One of the six onboarded counties (e.g., Travis, Bastrop).** Confirm these still resolve
   `covered` under your new query — this row must not make an already-serving county look
   uncovered.

### Known traps

- Do not build this against the ledger and call it done. That reproduces exactly the undercount
  the ruling rejected (Bexar would read `not-covered` while actively serving).
- Do not build this against the raw index and call it done. That reproduces exactly the P-205
  bug this whole chain exists to fix (Bell would read `covered` and then answer nothing).
- The vocabulary follow-on (`coverage_check_unavailable`/`county_out_of_coverage` entries in
  `@empressaio/atom-contract/display`) is explicitly a separate, unowned lane against
  `hauska-atom-contract` per the CONTRACT document's own final section. Do not build it here;
  name it in your close as still open if it still is.
- **Deploy timing is an operator decision, not yours.** The CONTRACT document is explicit:
  until this endpoint exists AND is correctly configured, deploying the already-merged LDT side
  (PR #690, merged not deployed) makes every zero-hit `find_parcel` query anywhere in Texas —
  including inside the six onboarded counties — return `coverage_check_unavailable` instead of
  today's plain `no-hit`. That is the intended fail-closed behavior once both sides are live,
  but sequencing when it goes live is explicitly not this lane's call.

### Do not

- Do not touch `legacy-design-tools`. The consumer side is already built, merged, and its
  contract with you is fixed — do not renegotiate the response shape unilaterally.
- Do not touch `hauska-atom-contract` / the display vocabulary.
- Do not deploy. Open the PR green and hand it back.
- Do not spawn sub-agents.

### Close

State your snapshot (repo, branch, commit). Name the exact query/mechanism you traced or built
for "does the serving path answer for this county" and why you believe it matches the ruled
definition rather than the ledger or the raw index. Paste all four falsifier results with real
responses. State plainly whether "covered" turned out to be a clean per-county predicate or
something narrower (per-parcel, or requiring a live probe) — this is exactly the kind of finding
this row exists to surface, and an honest "it's not as clean as the ruling implied" is a better
close than a forced clean answer. Declare `leave_behind` explicitly, including the vocabulary
follow-on and the deploy-timing decision if either is still open.
