# SmartCity People and access

**Plan row:** OPS-17 G-143. Designed first, per the operator's 2026-09-17 ruling that RBAC is design
before build, so G-134, G-127 and G-144 build against this.
**Status:** DRAFT 2026-09-18, awaiting ratification. Drawn after the 2026-09-17 blanket approval, so
that approval does not cover it.
**Drawn against:** `smartcity-dashboards` `origin/main` `3d3ec62a`, read with `git show` into
`source-state.json` by `dump-source-state.mjs`. Every role, status, refusal message and latency on these
boards comes from that file. None is typed by hand.

Five boards: the city manager's access review, who looked, the SmartCity admin view, ending access,
and refusals.

## What this surface says that the rulings do not

The rulings describe the model that was decided. The product enforces less than that today, and an
access review is the one screen where showing the decided model as if it were enforced would be a
false assurance to a government customer. Every board shows what the code actually does. Each of the
five findings below is read from source, and each is a rule in `check.mjs`.

**1. A role limits nothing yet.** The only role checks in `server.mjs` are the four inside the People
and access route itself. No lens route and no data route checks a role. So every account, whatever
its recorded role, can open every lens, including code enforcement cases and work orders that carry
residents' names and phone numbers. The city manager's board says so at the top, and every row reads
"Every lens". Department access is G-127.

**2. Nothing records who opened a record.** The row calls the audit trail the trust surface, the
thing a city is asked when a resident wants to know who saw their data. No write path records a
staff read anywhere in the 45 source files. "Who looked" is therefore drawn as NOT RECORDED rather
than as an empty table, because an empty table would read as "nobody looked", which is a different
answer and a false one. The search looked for eight names a read log would plausibly carry, and a log
named outside them could escape it. A second search with a different pattern also came back empty.

**3. The city manager cannot see the people with the widest access to her data.** Her list is scoped
to her own city (`scopeTenant = caller.tenant` for her role). SmartCity administrators belong to no
one city and read every city, so they never appear on her list. The page exists to show her who can
reach her city's data, and it omits the people who can reach all of it. The board names the gap.

**4. A never-provisioned person is told their account was disabled.** `isStaffAccountRevoked` returns
`true` for both a person SmartCity never set up and a person whose access was ended, on purpose, and
the identity module refuses both with `"this account has been disabled."` That is false for the first
person. The directory can tell them apart and the refusal does not. The refusals board shows it as
WRONG beside a PROPOSED code. The proposed code is not a product value, and the check refuses the
proposal once the product emits that code.

**5. Ending access is not instant everywhere.** A person is refused on the next request in the
dashboards, because every request checks the directory. Plan review and Smart Files keep no record of
ended accounts, so a sign-in already issued there lasts until its age cap: 15 minutes by default
(`STAFF_TOKEN_MAX_AGE_SECONDS`). The person's session at the sign-in provider is not ended at all;
that call is not built. And nothing says who hears it when a city tells SmartCity that someone left,
or how fast SmartCity acts. The 2026-09-14 ruling names that as the real cost of the decision, and it
has no owner.

## Two things this design settled from source, not from the rulings

**Who may read this page.** `_decisions/2026-09-14_staff_identity_and_department_rbac.md` says
two things. Ruling 1 has it read-only for the city manager and administered by SmartCity; Ruling 2's
gating list says "People and access is admin only". The code implements Ruling 1. The route admits
`admin` and `city-manager`, and the directory's own header says "read-only for the city manager,
administered by us". This design follows the code. **The decision record should be amended** so the two
rulings stop disagreeing.

**What the city manager may change.** Nothing. The route is GET-only, verified by listing every method
that handles it rather than by failing to find a writer. Her boards carry no action, and the check
refuses one.

## Nobody on these boards is real

On an access roster, an invented plausible name reads as a real employee holding real access. Every
person is `Fixture staff NN` on the reserved `example.invalid` domain, and the check refuses any other
name or domain. The Development services lens once carried five named people on a published workload
ranking, and this rule exists because of that defect.

## The instrument, and what it cost to trust it

`node check.mjs` runs 26 self-tests in both directions, then twelve rules on the real boards. Every rule
compares a board against `source-state.json`, so one party acting alone cannot satisfy both sides.

`node violate.mjs` makes 20 plants on the real boards. Each plant must change the file, each must be
caught with its named rule, and each is followed by a clean pass. The plants include the four this
surface must never do: a false limit, an access log, a real name, and a hidden wrong reason.

**The snapshot instrument was wrong five times before it was trusted, and every one of those failures
reported a plausible answer.** A refusal pattern that required `refuse("` missed three multi-line calls,
so the list was 9 codes where the product has 13. Two extractions now cross-check each other and refuse
on disagreement. Three regexes lost their backslashes through shell strings. One was a role-check pattern
that could match nothing, which would have reported "no role checks" for any input. One was a
scope-rule pattern that became an alternation with an empty branch, which matches every input. Each now
carries a positive or negative control. The read-only test was negative-only, reporting read-only
whenever it failed to find a writer. And `check.mjs`'s own attribute parser missed valueless attributes,
so a self-test that expected a refusal passed only because the refusal text always read as empty. The
matching "clean" self-test exposed it, which is the reason self-tests run in both directions.

## Regenerate

    node dump-source-state.mjs   # re-read the product at origin/main into source-state.json
    node gen.mjs                 # rewrites the five .dc.html boards + canvas.json; refuses if a premise moved
    node check.mjs               # every board against the snapshot
    node violate.mjs             # 20 plants, each caught, each followed by a clean pass

`gen.mjs` refuses to render when the source moves under a board. Examples are an access log that now
exists, a route that now writes, or plan-review and smart-files that now revoke locally. `check.mjs`
refuses a verdict when the boards and the snapshot name different commits.
