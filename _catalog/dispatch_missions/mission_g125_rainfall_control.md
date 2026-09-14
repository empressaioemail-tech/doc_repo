# MISSION — G-125: the four-inch question

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

## Who asked, and why it matters

**Sylvia Carrillo, city manager of Bastrop**, in her own words:

> "I want to be able to tell what happens when four inches of rain falls on a property."

Her stated value: it lets the city screen out sites that plainly do not need a drainage engineer,
cutting roughly ninety percent of that spend. This is a **named deliverable to a real customer**,
not an internal improvement. Treat it that way.

## The finding this row is built on

**The engine already answers her question. Nobody has ever been able to ask it.**

`hauska-engine` `packages/engine-core/src/site-plan/flood-drainage-study.ts`:

```
rainfallDepthInches?: number;                          // OPTIONAL input
export const DESIGN_STORM_RETURN_PERIOD_YEARS = 100;   // the default selector
"NOAA Atlas 14 PFDS point estimate (100-yr 24-hr)"     // where the default comes from
```

The study takes a rainfall depth as a parameter. Absent one it pulls the NOAA Atlas 14 point
estimate for that location and selects the 100-year 24-hour storm — 9.5 inches in the fixtures.
It already records the storm in its own note: *"Design storm 9.5 inch, 100-yr 24-hr."*

So this is a **scenario engine with the scenario frozen at one value**. Sylvia asked for a control
that exists and has never been surfaced.

**Verify this before you build on it.** I read the type signatures and the default path, not the
full call flow. Trace `rainfallDepthInches` end to end — from the study options, through
`computeGradientIntensity` (`drainage-gradient.ts`, which converts to `rainfallM`), into
`flood-drainage-author.ts` and `feasibility-author.ts`, and out to the payload and the PDF.
**Confirm a passed depth actually changes the result, on a real Bastrop parcel.** If it turns out
the parameter is accepted and then ignored anywhere in that chain, that is the finding and the
row changes shape — report it rather than working around it.

## What to build

**One control, two vocabularies, one source.** Atlas 14 returns the whole frequency curve — the
code already does `designStorms.find(s => s.returnPeriodYears === DESIGN_STORM_RETURN_PERIOD_YEARS)`.
So the same estimate can answer "four inches" and "the 10-year storm" without a second lookup.

Sylvia thinks in inches. A consulting engineer thinks in return periods. Serve both from one
control and state the other alongside whichever was chosen: choose 4 inches, see its return-period
equivalent for this location; choose the 10-year storm, see its depth.

**The default path must be unchanged.** Passing no depth still yields the 100-year Atlas 14 storm,
byte-identical to today. This row adds a question that can be asked; it does not change the answer
nobody asked for.

**Both numbers travel with the result** — on screen and in the PDF. A study output that does not
say which storm produced it is not usable evidence, and the note field already carries this
discipline. Do not lose it.

## HONESTY IS AN ACCEPTANCE ITEM, NOT A NICETY

The whole value of this deliverable is a city **skipping an engineer** on its strength. That is
the point and it is also the exposure: if a site is built on a screen that said fine and it floods,
the question becomes what the city relied on.

The surface must say, plainly and in the operator's language rather than ours: what this is, what
it is not, and when to call an engineer anyway. Visible on the screen and in the PDF — not a
footnote, not a tooltip.

The portfolio precedent is property lines, which render as **"GIS-approximate — not a survey."**
Flood needs its equivalent, and it must survive into the exported document, because the PDF is
what leaves the building.

The engine already records DEM resolution and the design storm in its note. Carry that discipline
forward; do not summarise it away.

## Snapshot

Repos: `hauska-engine` (the study and its parameter) and `hauska-map` (`apps/property-explorer`,
where the control surfaces). Fetch both and work from current `origin/main`. Declare repository,
branch and commit SHA for each in your first output line. Work on your own branch in your own
worktree per repo.

## A constraint that will bite

A note on record — unverified this session, so confirm it — says feasibility refresh returns at
**85 to 154 seconds** while PE and MCP clients abort at **55**. If that holds for flood, then a
study at a NEW depth is a fresh computation and will time out, even though the cached default
returns instantly. Establish whether a depth change is a cache miss. If it is, the control needs
async refresh and polling, not a synchronous call — and that is part of this row, because a
control that times out on first use is not a delivered control.

## Method

Verify by violation: run the same parcel at two depths and show the results differ materially.
A control observed only returning something has not been observed working.

Pre-register the falsifier before each check. State what result would prove the control inert.

ENUMERATE BEFORE ASSERTING ABSENCE. Say what you searched.

State the mechanism explaining an observation, then a second mechanism that would produce the
same observation and why you rejected it.

Never print secret VALUES. Env var names only. Every command exit-bounded (`timeout 120 ...`).

## Out of scope

Mounting the study into the SmartCity platform (G-129). The FEMA tier2 determination defect
(G-130) — a different flood question entirely, do not fold it in. Any change to the D8 model
itself. The map-engine question.

## Close

Write your close to `_inbox/2026-09-14_g125_rainfall_control_close.json`.

State: the end-to-end trace of `rainfallDepthInches` with the files and lines it passes through;
the two-depth violation test on a named real Bastrop parcel with both results; whether a depth
change is a cache miss and what you did about it; where the honesty text renders on screen and in
the PDF, quoted verbatim; and confirmation that the no-depth default path is unchanged.
