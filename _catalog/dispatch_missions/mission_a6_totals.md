# Mission A6 — release a starved gate, run the last two counties, produce TOTALS

## Why this card exists

Four of six counties are licensed with real triples and their sum is 317,918.

| County | unincorporated / in-city / total | run |
|---|---|---|
| 48021 Bastrop | 50,264 / 11,992 / 62,256 | `85f984c2` |
| 48055 Caldwell | 14,361 / 10,627 / 24,988 | `1e2529a3` |
| 48209 Hays | 61,585 / 54,835 / 116,420 | `bdcf534f` |
| 48309 McLennan | 32,422 / 81,832 / 114,254 | `a62e3fce` |

Williamson execution `hcx7x` returned `failedCount=1`, exit 1, `textPayload
COUNTY_HELD`, landing 0. Travis never ran behind the same gate, so its sentinel is
unmeasured because it never executed.

**TOTALS has never existed. This card produces it, or names exactly which county
stopped it.**

## The gate is STARVED, not stale. That distinction is the card.

`src/jobs/p2-juris-containment.mjs`:

```
export const HELD_FIPS = Object.freeze(["48453", "48491"]);

export function requireReplayGate(county, replay) {
  if (!HELD_FIPS.includes(county)) return;
  const ok =
    replay?.matches?.["48021"] === true &&
    replay?.matches?.["48055"] === true &&
    replay?.complete?.["48209"] === true;
  if (!ok) refuse(COUNTY_HELD, ...);
}
```

Its logic is correct and its trigger fires. What it lacks is an input: `replay` is a
parameter somebody has to supply, and the three conditions it tests are **true in the
store right now** and are not reaching it. Correct logic, live trigger, starved input.

**Therefore the fix is to DERIVE `replay` from the store, and the two obvious fixes
are both wrong:**

- **Do not delete `HELD_FIPS` or return early for these counties.** That removes a
  control rather than feeding it, and it would let Travis run in future even if
  Bastrop's bind moved. Bastrop's bind has already moved once today, from `1dda40f7`
  to `85f984c2`.
- **Do not pass a literal** `{matches:{48021:true,48055:true},complete:{48209:true}}`.
  That is a hand-declared assertion standing in for a measurement, which is the defect
  class that has already produced `has_writer`, the portal permission column, and the
  CDP seed list on this program. A gate satisfied by a literal is satisfied by anyone
  who types one.

Derive it: 48021 and 48055 match `INTERACTIVE_PARTITIONS` **as read from the store by
`GROUP BY run_id`**, and 48209 has a succeeded run. Then the gate re-checks reality
every time and closes on its own when reality changes.

**First, identify the caller.** `requireReplayGate` is exported from
`p2-juris-containment.mjs` and a grep of `p2-juris.mjs` does not find it, yet the gate
demonstrably fired on `hcx7x`. Find where it is called and where `replay` comes from
before changing anything. Report the answer.

## Travis and Williamson have NO ORACLE. F1 must be redefined for them.

```
export const INTERACTIVE_PARTITIONS = Object.freeze({
  48021: { unincorporated: 50264, in_city: 11992, total: 62256 },
  48055: { unincorporated: 14361, in_city: 10627, total: 24988 },
});
```

`assertInteractiveMatch` returns `{ checked: false }` for anything absent. So for
48453 and 48491 there is **no triple to match and `PARTITION_MISMATCH` cannot fire**.

If you run these two under the F1 you used for Bastrop, **your primary falsifier is
silently disabled** and a wrong answer looks exactly like a right one. Hays and
McLennan already ran in that condition; do not repeat it without saying so.

**Define F1 for an oracle-less county before running it**, and state it in your output.
It must be something a wrong result could fail. Candidates, and you choose and justify:

- `unincorporated + in_city + unresolved == total`, and `total ==` the distinct
  `prop_id` denominator for that FIPS **excluding its measured sentinel**
- `unresolved == 0`
- ring versus bbox-centre profile stated, not assumed
- no CDP assigned a `place_fips`
- the in-city share is within a stated band of the roster expectation, with the band
  declared **before** the run and a breach reported rather than widened

A denominator identity is the strongest available: it is two independently derived
numbers, the job's own emit and a store count, and no sentinel satisfies both.

## Per county, before you execute

**Measure that county's sentinel.** Do not extrapolate. Bastrop's resolved
unincorporated, Caldwell's resolved **in-city** at Mustang Ridge 50200, Hays carried
375 rows on one unincorporated key. Travis's sentinel has never been measured because
Travis has never run.

**State the redefined F1 and F2.** F2 is unchanged and is not optional: a succeeded
termination with an **unaided exit**. Do not hand-cancel a hang and write a success
over it.

**Verify the image by digest.** Factory builds ship storage tarballs with no
`COMMIT_SHA`, so image-to-commit attribution there is inference. Report the digest.

**Williamson first.** It is 282,570 parcels against Travis at 380,918, and it already
has a failed execution to supersede.

## TOTALS

Only when all six have store binds does TOTALS become measured. Sum the six, show the
arithmetic, and name the licensing `run_id` per county **read from the store at close
by `GROUP BY run_id`**, not from any lane close. A close is a claim about a moment; a
bind is a fact with a timestamp, and Bastrop's moved once already today.

If a county fails, **TOTALS is UNMEASURED and you name that county.** A five-county
sum is not TOTALS.

## Do not

- Do not delete `HELD_FIPS` or bypass the gate; feed it.
- Do not pass a hand-written `replay` literal.
- Do not run these two without a stated, failable F1.
- Do not raise `statement_timeout` or change page size from 8,000.
- Do not absorb a sentinel to make a number match.
- Do not run a second heavy store operation. `neondb` and `hauska_mcp` share one
  compute, `ep-lucky-truth-apodo8hr`, group size 1 — measured, not assumed.
- Do not adopt 357,269 or any figure not produced by this job.
- Do not start the setback bake or lift `SETBACK_APPLY_HELD`.
- Do not touch any repository other than the registered Factory worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare
snapshot including image digest in the first output. Report where `replay` is supplied
from and how you derived it. State the redefined F1 per county before executing.
Report TOTALS with its arithmetic and per-county `run_id`, or UNMEASURED with the
county named. `leave_behind` named. Subagents do not commit.
