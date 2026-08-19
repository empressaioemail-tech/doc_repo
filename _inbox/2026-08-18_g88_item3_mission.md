# G-88 item 3: harden the product class gate before any screen ships

You are an executor on OPS-17 Lane B. This is acceptance item 3 of the approved WDLL at
`P:\doc_repo\_inbox\2026-08-18_g88_design_into_apps_WDLL.md` and nothing else. Read that card
before you start; it is the contract you are graded against.

## STEP 0 — your own clone, nobody else's

Two sibling executors are working the same repo in parallel on different files. Clone fresh:

    git clone https://github.com/empressaioemail-tech/smartcity-dashboards.git P:/tmp/g88-gate
    cd P:/tmp/g88-gate && npm ci

Do NOT work in `P:/tmp/g75-dash` or `P:/tmp/b82-dash`. Push your branch immediately after your
first commit.

## WHY THIS IS A PREREQUISITE

A design pass is about to ship screens through this gate. The gate is `src/ui.test.mjs`, the test
named `composes existing kit classes and declares no new one`. It passes today and it has a hole,
so the "every shipped screen uses only vendored classes" assertion the plan rests on is currently
decorative. Harden it BEFORE screens ship, not after.

Full prior investigation, read it and do not re-derive it:
`P:\doc_repo\_inbox\2026-08-18_g88_translation_boundary.md`.

## THE THREE DEFECTS, each measured

**1. The counting rule does not strip CSS comments.** The product builds its `defined` set with a
regex straight over the concatenated stylesheets. Six words that appear only inside CSS comments
are therefore counted as shipped classes: `css`, `hidden`, `html`, `md`, `mjs`, `test`. An injected
`class="hidden"` does NOT fire the gate today. This was proven by injection, both arms.

The fix is the kit's rule, which strips comments first. It is eight lines and its counting rule is
stated in `P:\tmp\g82v\test\_lib.mjs` as `stylesheetClasses()`. **Port it, do not import it.** It
is not in the kit's `exports` and depending on the kit would add an npm dependency to a repo whose
only dependency is `pg`. Copy the rule verbatim and name the kit as its source in a comment.

**2. The scan covers two of five markup sources.** It reads `web/index.html` and `web/app.js`.
It does not read:
  - `src/shell-homes.mjs`, which generates `class="srcreg"` markup as a server template string and
    reaches the scan only through a bake step whose output is never byte-asserted, so a class
    change without a re-bake ships stale and passes every test
  - `src/staff-map.mjs` and `src/staff-review.mjs`, both served to the browser and unscanned; they
    assign no classes today, which is exactly why nobody noticed

**Derive the scan list from `server.mjs`'s `sendFile` call sites rather than hardcoding it**, so a
new served asset cannot dodge the gate by being added later. That is the difference between fixing
this once and fixing it again in three months.

**3. There is no injected-violation arm.** A gate nobody has watched fail is not a gate. Put the
clean arm and the injected arm in the SAME test, so an unrun check and a passing check cannot look
alike.

## WHAT DONE LOOKS LIKE

    injected class="mx-card"  -> FIRES and names the class
    injected class="hidden"   -> FIRES   (today it does not: this is the regression you are fixing)
    the real sources          -> clean, empty stray list
    scan list                 -> derived from sendFile call sites, covering all five sources

The only permitted exclusion is `roster-lens`, which is a class the product ships and no stylesheet
defines. Keep the exclusion, and add a comment saying it is a deletion ticket rather than permanent
amnesty. Do not add any other exclusion; if something else strays, that is a finding, report it.

## HARD CONSTRAINTS

- Do not change `web/index.html`, `web/shell.css` or `web/sc-kit.css`. This item is test and scan
  infrastructure only. A sibling executor is editing `shell.css` right now.
- Do not weaken any existing assertion to make something pass.
- If porting the stricter rule makes a REAL stray appear that was previously hidden by the comment
  hole, that is a genuine finding. STOP, report it, do not paper over it and do not add it to the
  exclusion list.

## VERIFY (exit-bounded, every command terminates)

    npm test     # expect all green, and one MORE test than before

Prove both arms by running the suite against a deliberately injected violation in a scratch copy,
then restore. Never leave a violation in the working tree. Do not start a server, do not watch.

## THEN

Open a PR against `main`. Title it `G-88 item 3: the class gate strips comments and scans every
served source`. Wait for CI and report the check-run conclusion STRING.

**Do NOT merge.** The planner verifies and merges.

Write your close to exactly `P:\doc_repo\_inbox\2026-08-19_b88-3_close.json`. Carry: the PR
number and head SHA, the CI conclusion string, the before-and-after `defined` set sizes with the
counting rule stated beside each, the six comment-only words that are no longer counted, the five
sources now scanned and how the list is derived, and the raw output of both injected arms proving
they fire. If a real stray surfaced, name it.
