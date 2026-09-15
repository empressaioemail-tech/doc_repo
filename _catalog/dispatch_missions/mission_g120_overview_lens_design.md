# MISSION — G-120 Overview lens design pass (smartcity-dashboards)

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

## Snapshot first

Repo: `smartcity-dashboards` (GitHub `empressaioemail-tech/smartcity-dashboards`).
The local checkout at `/p/smartcity-dashboards` was **43 commits behind origin/main** as of
2026-09-14. Fetch and work from current `origin/main` (`86487fa` or later). Declare repository,
branch and commit SHA in your first output line. Work on your own branch in your own worktree.

Deployed today: `smartcity-dashboards-00062-ful` @100%, tag `g117-full-catalog`.

## What this is

A **layout, hierarchy and density pass** on the Overview lens. It is NOT a re-colour and NOT a
re-type. Four mechanical gates already reject a design change that ignores this:

- `shell.css` may declare no colour and no token — no `:root`, no hex outside comments, no
  `rgb()`/`rgba()`. Every colour is `var(--sc-*)` from the frozen kit.
- `web/sc-kit.css` is **byte-identical across `smartcity-dashboards`, `smart-files` and
  `plan-review`**. A repo that edits a token value has forked the system. Do not touch it.
- The type ramp is pinned by selector with a 12px absolute floor; uppercase only on mono.
- No new CSS class without a rule; a test diffs every `class="..."` and runtime `classList`
  call against the two stylesheets.

If the design appears to need a colour that does not exist, STOP and report. That is a
product-line decision across three repos, not a Dashboards PR.

## The approved design

`https://claude.ai/code/artifact/3cf94cc7-4aa5-4846-9a60-bc51a1275180` — three artboards,
populated / sparse / empty. Operator approved the direction in session on 2026-09-14 with two
amendments already folded into the artboards. Read it before starting.

Five changes, in priority order.

**1. The four tiles become filtered entry points, not metrics.** Their real function on the v1
app was navigation carrying filter state: clicking "New Permit Requests" landed in Development
Services with the Requested filter applied. Each tile carries, under its value, the lens and
filter it opens, and clicking it navigates there with that filter applied. A tile whose source
has not read keeps its existing "Not read" word value and its basis — never a zero. **Acceptance
is the click, not the number**: clicking each tile lands on the destination lens with the filter
applied.

**2. "Across departments" roll-up.** A six-lane panel covering Development services, Finance,
Police, Fire and EMS, Fleet and Public works. v1's Live City Pulse covered four workspaces;
v2 split Emergency into Police and Fire and EMS, and Operations into Fleet and Public works,
so a four-lane roll-up under-covers the structure by two departments. Each lane carries its
state rail, its facts where it reads, and a `.basis` line naming its source or its absence.

**3. Connections promotes and demotes.** On a pack that reads no sources, Connections moves to
the TOP of the content stack and carries a lead paragraph explaining the quiet. On a pack that
reads sources it sits at the BOTTOM. This is the one structural move in the design: it makes a
zero-record city read as "here is what to connect next" rather than as a broken page.

**4. Right rail keeps the map and the address lookup.** Operator explicit: the map component
stays on screen. Do not remove or relocate it. Its own rendering defects are **out of scope
here** — see G-121.

**5. The `Sources` panel is REPLACED by "On the map".** The current lower-rail panel lists atom
types (`buildable-envelope`, `rrc-pipeline-fact`, `setback-rule`, ...) on the demo parcel. That
is engine vocabulary leaking to a city manager and it is not useful to one. Replace it with
located records — permits, reviews, work orders, enforcement cases that have a location — each
row naming the subject, the address and its kind, clickable to the record. On a pack with
nothing located, it carries an honest-empty state with a `.basis` line.

## Constraints that are not negotiable

Keep every honest-empty state's `.basis` line. Removing one to tidy a layout is a substantive
change, not a cosmetic one.

No metric may render `0` for an unread source. The existing `.metric .v.word` treatment ("Not
read") is correct and stays.

No invented freshness. Tests assert that no "last sync", "last read" or "last updated" string
appears. Do not add one.

Develop against `template-city` and **regression-check every state against the empty pack**.
A design that only looks right when populated is wrong for this product, because every city
after Bastrop starts empty. Do not develop against `fixture-city`.

Keep the `Demo fixture` label adjacent to `48021:34137` wherever it renders.

Do not hardcode a city name into markup. Static markup carries only fallback vocabulary.

## Out of scope

The Overview map component itself (G-121, PINNED by the operator — do not start it).
Any other lens. Any feed, grant or adapter work. Anything in `smartcity-os`.

## Close

Open a PR, deploy a tagged canary with `--no-traffic`, smoke it, then shift traffic — verified
by reading the traffic JSON **by field name**, never a positional `value()` formatter.

Write your close to `_inbox/2026-09-14_g120_overview_lens_close.json`. Include: the deployed
revision and its digest, the four CSS gates' results, and a statement of what you checked
against the EMPTY pack specifically. State what you could not do and why.
