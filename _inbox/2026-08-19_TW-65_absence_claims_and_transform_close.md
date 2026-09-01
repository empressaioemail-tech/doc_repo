# TW-65 close: absence claims and the transform enum

Date: 2026-08-19  Status: PR OPEN, NOT MERGED, NOT DEPLOYED
Repo: smart-markets  Branch: `tw65/absence-claims`  PR: #20
Base: `origin/main` at `5438884`  Commit: `21e1309`
Canon: TW-65 operator override, Smart Markets unregistered R&D, bounded PRs, no PLAN-ROW by design.

Two operator-approved changes. The planner owns review and deploy. Nothing was deployed, nothing was
merged, nothing was pushed to main.

## Part one: the transform enum

The cockpit publishes `GET /futures/drivers/{symbol}` and serves `transform` verbatim from
`app/data/futures_catalog.json`, naming its own vocabulary in `transform_vocabulary` and refusing to
bend a value to fit a consumer enum. This end refuses the mirror-image move. The enum widened.

I read the catalog before editing, as instructed. `drivers[]`, the only section that route serves,
carries exactly the three values named in the dispatch: `level` on 25 rows, `wow_diff` on the 5 EIA
weekly inventory rows, `auction_record` on the 3 Treasury issuance rows. Two further transform values
exist in the same file and are deliberately NOT added, because the drivers route does not serve them:
`net_position` on 32 CFTC positioning rows and `record` on 11 contract-spec rows. So the dispatch's
count was right, and the reason it was right is that the route's served set is narrower than the file.

**One of the three is not a transform, and I said so rather than enshrining it silently.**
`auction_record` is a record kind. The rows it marks resolve to an auction result carrying size, high
yield and bid-to-cover, which is three quantities and no single number for a transform to have been
applied to. The upstream `transform` field is carrying "what kind of thing is this" on those rows
instead of "what was done to it", and it does the same thing twice more outside the served set
(`net_position`, `record`).

I admitted it anyway, and that was a judgement call worth stating. Refusing it would leave 3 of 33
curated rows unrelayable, which is a worse outcome than relaying a badly named one. So it is in the
enum with the defect named at the point it enters the contract, exported as
`TRANSFORMS_THAT_ARE_NOT_OPERATIONS` and `isOperationTransform`, so a consumer can detect a row whose
transform is a record kind rather than assume a transform was applied, and so the upstream fix has a
citable name at this end. If the operator would rather the union refuse the value outright and force
the upstream rename, that is a one-line change plus three catalog rows.

Second thing worth naming: `level` is the upstream's spelling of the native `none`. Two names for one
concept. I recorded the duplication rather than collapsing it, because collapsing would silently
rewrite an upstream value, which is the thing this product refuses. Reconciling the two spellings is
an upstream vocabulary decision.

**The versioning rule.** `version.ts` states that adding a value to an enum is a MAJOR bump. The
dispatch said additive at 0.1.0 pre-adoption. Both are true and the tension is real, so I did not
paper over it: the rule stands and one exemption is recorded in `version.ts` with its ground stated.
The ground is that there is no adopter, because the drivers layer has never returned a payload at all
(it is a `lookup-failed` absence on every node and shape), and an enum widened before its first
payload exists cannot invalidate a payload anyone holds. The exemption is spent the moment the drivers
adapter serves one.

**Blocking finding for whoever wires the drivers relay.** Widening the enum does NOT unblock it.
`DriverSeriesSchema` requires `title`, `frequency`, `releaseMatch` and `lastObservation` as concrete
values. The cockpit route serves `label` rather than `title`, and serves `frequency`, `release` and
`last_observation` as TYPED ABSENCE OBJECTS by design, because it is mapping-only and refuses to
publish a revised FRED value as if it were point-in-time (TW-59). A relayed row cannot validate today.
Making those fields observation-or-absence unions is a non-additive contract change. Proposed, not
taken. This needs an operator ruling before anyone scopes the adapter.

## Part two: an absence is a claim, and claims get graded

### The design I chose, and why

An absence already carries a subject, an authority, a scope, a determination time and a basis. What it
lacked was identity across reads and any notion of supersession. I added exactly those two and the
grading rule that falls out of them.

**Identity is DERIVED, not carried.** The claim key is a pure function of
`(subject, layer, authority, scopeSearched)`, normalized for incidental whitespace and case, joined
with length prefixes, hashed, and namespaced as `absence:<layer>:<subject>:<digest>`.

Two reasons, and the second is the better one. First, `AbsenceSchema` is `.strict()` and adding a
field to it is a contract change this row may not make. Second, and this is why I would have chosen it
anyway: a key the producer stamps on is an assertion the consumer must trust, while a key computed
from fields already in the payload is one the consumer can recompute and check. Identity survives
across reads with nothing added to the twin, and the mechanism is verifiable from both ends.

**The verdict is deliberately OUTSIDE the identity.** This is the load-bearing decision. The verdict
is the answer; the key is the question. Put the verdict in the key and a `not-applicable` that becomes
`absent-verified` reads as two unrelated claims rather than one claim that broke, and the mechanism
becomes unable to detect the only event it exists to detect. `basis` is out because it is the support,
not the claim. `determinedAt` is out because it is what ORDERS two assertions of one claim, which it
cannot do if it is part of what makes them the same claim. That mirrors `knowledge_time` in the spine
store exactly.

**Room and roster claims key off the ISSUER**; drivers, market and synthesis off the security. Filings
and insiders are issuer facts. GOOG and GOOGL are two securities with one issuer and one 10-K, so
keying the room's absence to the addressed node would register one missing filing as two independent
claims, grade them separately, and double-count the day it broke. `TwinSchema` already enforces that
split for room document addressing; claim identity had to honour the same one.

**Supersession takes the spine's shape and not its storage.** `app/spine/store.py` advances a pointer
by `knowledge_time` and writes corrections as new records. Here: `superseded`, `restated`, `not-later`,
`indistinguishable`, `different-claim`. The pointer only advances. Two assertions of one claim that
disagree at the same knowledge time are refused as `indistinguishable` rather than resolved by a coin
flip, because the spine breaks that tie with a row id and the union has none.

**Grading distinguishes what each verdict is a claim ABOUT** — `world`, `shape`, `process`. That
taxonomy is what keeps the grader honest, and flattening it is how you build one that confidently
reports nonsense.

| earlier | later | outcome |
|---|---|---|
| `absent-verified` | same verdict, same scope | `held` |
| `absent-verified` | layer populated | `broke` |
| `not-applicable` | `absent-verified` | `broke` |
| `not-applicable` | layer populated | `broke` |
| `absent-verified` | `lookup-failed` | `ungraded` |
| `lookup-failed` | any determination | `resolved` |
| `lookup-failed` | `lookup-failed` | `ungraded` |
| `absent-verified` | `not-applicable` | `reclassified` |
| any | different scope, or older read | `ungraded` |

Row three is the Section 16 case from the research sweep and it is the reason the mechanism exists. A
foreign private issuer's exemption was correctly `not-applicable` for five decades and died
2026-03-18, partially. A later read searches the category and still finds nothing. Both reads are "no
data", and grading that `held` would be the mechanism failing at the exact case it was built for: the
SHAPE claim went false even though the search is still empty.

Rows five and six are the other half of the honesty. `lookup-failed` is a claim about this process and
never about an instrument. A later read that could not look confirms nothing, so it grades `ungraded`
and never `held` — letting a probe that fell over count as confirmation is the single easiest way to
build a grader that only appears to grade. And a `lookup-failed` followed by a populated layer is a
leg that came back up, not a false claim about an instrument, so it grades `resolved` and never
`broke`.

### What I scoped OUT

- **No store, and this is the honest answer to the dispatch's question.** The union holds no database
  and did not acquire one. It therefore cannot accumulate the record it makes gradeable. Everything is
  a pure function over claims the caller supplies: the CALLER is the ledger, and this service supplies
  the rule. `LEDGER_GAP` travels on every claims and grade response, and a test asserts it does, so no
  consumer can read a grading function as a grading system.
- **A home for the claim ledger is proposed, not taken.** It is an architectural decision for the
  operator. My recommendation, stated in the code and served on the responses: the cockpit spine. Its
  atom store is already bitemporal, already advances a pointer by `knowledge_time`, and already writes
  corrections as new records, which is the whole mechanism. The alternative — a store in the union —
  would end the union's defining property for a feature that does not require it.
- **No contract-package home for the mechanism.** Its natural long-term home is
  `packages/contract` so both doors and third-party consumers share one implementation, but that is a
  contract change beyond part one. It lives in `apps/api/src/absence-claim.ts`. Proposed, not taken.
- **No `apps/web` surface.** Barred by the dispatch. Claims are reachable from the HTTP and MCP doors
  only; the human surface shows absences without their keys.
- **No attestation of a caller-supplied prior.** The service kept nothing, so it cannot confirm a
  submitted prior is one it ever issued, and it says so in `LEDGER_GAP.priorAttestation`. What it does
  check is internal consistency: the key is re-derived from the submitted fields, and a mismatch is
  REFUSED rather than re-keyed, because re-keying would move a record onto a question nobody asked.
- **No supersession of a claim across a scope change.** A scope that genuinely moved starts a NEW
  claim rather than inheriting the record of a narrower search. That is deliberate, not a gap.

### What shipped

`apps/api/src/absence-claim.ts` (new): identity, gradeability taxonomy, registration off a twin,
supersession, grading, caller-submission acceptance, `LEDGER_GAP`.

Two HTTP routes, both under the existing entitlement gate: `GET /v0.1/absence-claims/:symbol` returns
the registered claims for a read; `POST /v0.1/absence-claims/grade` grades priors the caller kept
against a fresh read. Two MCP tools mirroring them: `list_absence_claims`, `grade_absence_claims`.

`apps/api/tests/absence-claims.test.ts` (new): 33 tests covering identity stability, the verdict
exclusion, the issuer-keying split, supersession, every grading transition, submission refusal, and
both doors end to end.

## Verification, raw

All five commands, on the final tree.

```
== FINAL 1 typecheck ==
(no output above = clean)
== FINAL 2 lint ==
> smart-markets@0.1.0 lint
> eslint .

== FINAL 3 prettier (authored) ==
Checking formatting...
All matched files use Prettier code style!
== FINAL 4 test ==
ℹ tests 83
ℹ pass 83
ℹ fail 0
 Test Files  1 passed (1)
      Tests  9 passed (9)
ℹ tests 198
ℹ pass 198
ℹ fail 0
 Test Files  2 passed (2)
      Tests  21 passed (21)
== FINAL 5 build ==
✓ built in 1.04s
```

Repo-wide `format:check` was not run; per the dispatch it reports around 100 false failures on Windows
from CRLF. Only authored files were checked, and they pass.

### Guards proven by REMOVAL

Three, each failing exactly its own test and nothing else.

```
GUARD 1 REMOVED: length-prefixing replaced with a plain delimiter join
✖ fields cannot impersonate each other across the delimiter (1.6507ms)
ℹ tests 197
ℹ pass 196
ℹ fail 1

GUARD 2 REMOVED: deleted lines 512-518, the refusal to grade against a failed later lookup
✖ GUARD: a failed later lookup is UNGRADED and never reads as held (2.1022ms)
ℹ tests 197
ℹ pass 196
ℹ fail 1
    actual: 'reclassified',
    expected: 'ungraded',

GUARD 3 REMOVED: the Section 16 rule that not-applicable followed by absent-verified is a BREAK
✖ THE SECTION 16 CASE: not-applicable followed by a search that found nothing BROKE (2.2314ms)
ℹ tests 197
ℹ pass 196
ℹ fail 1
    actual: 'reclassified',
    expected: 'broke',
```

All three restored, full suite re-run green before commit.

### Commit and push

```
21e1309 feat(twin): TW-65 — absences become gradeable claims, and the transform enum widens
5438884 Merge pull request #19 from empressaioemail-tech/tw57/as-of-map

 apps/api/src/absence-claim.ts            | 725 +++++++++++++++++++++++++++++++
 apps/api/src/mcp/tools.ts                | 136 ++++++
 apps/api/src/routes/twin.ts              | 200 +++++++++
 apps/api/tests/absence-claims.test.ts    | 542 +++++++++++++++++++++++
 packages/contract/src/layers/drivers.ts  |  91 +++-
 packages/contract/src/version.ts         |  11 +
 packages/contract/tests/contract.test.ts |  83 ++++
 7 files changed, 1787 insertions(+), 1 deletion(-)

 * [new branch]      tw65/absence-claims -> tw65/absence-claims
https://github.com/empressaioemail-tech/smart-markets/pull/20
```

## What I could not do, and what needs an operator ruling

1. **A home for the claim ledger.** The dispatch asked me to propose and stop if durable storage was
   required, and it is required for the union to be the grader-of-record rather than the grading rule.
   Recommendation: the cockpit spine. This is the one decision that turns a gradeable claim into a
   graded one, and until it is taken, nothing observes an absence going false on its own.
2. **`DriverSeries` field shapes.** `title`, `frequency`, `releaseMatch` and `lastObservation` cannot
   accept what the cockpit drivers route actually serves. Non-additive contract change. This blocks
   the drivers relay regardless of the enum.
3. **Whether `auction_record` should be admitted at all**, or refused to force an upstream rename. I
   admitted it with the defect named. Reversible in one line plus three catalog rows.
4. **Moving the mechanism into `packages/contract`** so third-party consumers share one implementation
   rather than reimplementing the key derivation from prose.
5. **A human-surface presentation of claims.** `apps/web` was barred, so the agent door and the HTTP
   door can hold a claim and the browser cannot.
