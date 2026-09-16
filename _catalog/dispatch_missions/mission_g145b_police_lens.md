# MISSION — design the Police lens

One of the last two undesigned department lenses. Police is IN SCOPE as of the operator ruling
2026-09-15 (`_decisions/2026-09-15_police_and_fleet_lenses_in_scope.md`), which reversed an earlier
"not in the pilot" exclusion because v1 is being retired and an undesigned lens does not keep its
current level of service after cutover, it disappears.

**Fleet is being designed in parallel by another lane. Do not draw it.** Read the shared
constraint below; it binds both of you and the two lenses must not answer it differently.

**Bastrop approves the design before we build.** This is headed for a customer's eyes.

## The source state, established. Re-verify it, do not re-derive it

`smartcity-dashboards` `origin/main` `f776b4bf`. Two registered regions on this lens:

| Region | Domain | `gatedBy` | recordType |
|---|---|---|---|
| Patrol roster | `PATROL_VEHICLES_DOMAIN` | `spireon` | `patrol-vehicle` |
| Camera inventory | `POLICE_CAMERAS_DOMAIN` | `verkada` | `camera-device` |

**This lens carries THREE different distances from data, and that is the design problem.** They
are not degrees of the same thing; they are different kinds of thing, and a design that renders
them alike destroys the distinction the product was built to preserve.

**One: the vendor works and the grant is deliberately withheld.** Spireon returns real data
(`src/vendor-live.mjs` header, live-verified 2026-09-03) and has a live mapper. But
`patrol-vehicles` is the product's UNGRANTED EXEMPLAR on `template-city`, and its own module
says why, at length:

> The gated-but-ungranted exemplar, and it is the one that proves ruling 1 is implemented rather
> than described. Everything about this domain is BUILT... The only thing it does not have is a
> source... That is a different sentence from "Police is not built"... It is also a different
> sentence from "Spireon is granted here and returned nothing", which is what composeDomain
> returns as granted-empty; collapsing those two is the defect ruling 1 closes.

So `ungranted`, `granted-empty` and `not built` are three sentences and this lens is where the
product proves it can tell them apart. **Your design has to be able to say all three.**

**Two: the vendor has no credential anywhere and no live mapper.** `verkada` has ZERO occurrences
in `src/vendor-live.mjs`, and OPS-17 `G-139` records that no Verkada secret exists in
`smartcity-os-prod`, `hauska-prod-497015` or `legacy-design-tools-prod`. The camera code in
`smartcity-os` is fully built and fails closed correctly. This is vendor onboarding, not a bug,
and the board should name it as that kind of obstacle.

**Three: a whole class of record is refused on purpose and is not missing.**
`src/domains/police-cameras.mjs` declares `plateReads` and `personsOfInterest` as
`required:false` WITH A BASIS, because they are surveillance records about identifiable people.
Its own comment states the reasoning, and you should read it in full:

> The seam's content guard would have rejected a plate string anyway, and that is the weaker of
> the two controls. The stronger one is that the contract names the exclusion, because a guard
> catches the attempt and a contract prevents it.

Also from that module: **occupancy is a band and sometimes nothing** — a generated head count is
a specific claim about a specific place, so the record carries a band, and a camera that is not
reporting carries "occupancy not measured", an honest absence at the record level rather than a
zero standing in for one. And **a camera is not a city inventory node**: G-24 stays at zero and
vendor device telemetry is the standing example of the thing that looks like it should fill an
inventory and must not.

## The shared constraint, and Fleet's lane has the identical paragraph

**The operator is a person, the person must not be named, and the dimension still has to work.**
Fleet solves this for drivers by grouping on an opaque operator reference under a declared format,
with the record stating in its own basis WHY the name is absent, because an absence with no basis
is the defect this program hunts. Patrol vehicles have the same problem and Police has a stronger
version of it in plate reads and persons of interest.

Answer it the same way Fleet does: refuse positively, with the basis on the page. Do not invent a
second vocabulary for the same idea. If you conclude Police needs a different treatment, say so
in your report and explain why rather than diverging silently.

## What to produce

`_design/smartcity-police-lens/`, per `_design/README.md`: `README.md`, `gen.mjs`, `_kit.css`,
the artboards, `canvas.json`, `check.mjs`.

`_kit.css` is copied BYTE-IDENTICAL from `_design/smartcity-dev-services/_kit.css`. Verify with
`md5sum` and report the hash; it must be `58a68730e051b1ee2ffa21f08eae6752`.

**Read `_design/smartcity-public-works-lens/` first and follow its pattern.** It is the closest
precedent: two regions, different units, at different distances from data, with a blocked-region
component that states four things and never fewer (state, basis verbatim, what KIND of thing
would move it, when it was last read). Reuse that component rather than inventing a second one.
Also read `_design/smartcity-parks-lens/` for how a not-built sentence is drawn, and
`_design/smartcity-fire-ems-lens/` for a roster with a grouping dimension.

Draw the number of boards the lens honestly needs. Public works took four, Fire and EMS two, and
the Fire lane cut a third board deliberately because it would have repeated a sentence another
board already made. Do not pad to match a neighbour.

## The instrument

`check.mjs` that self-tests in BOTH directions before reading any artboard, ABORTS rather than
reporting a verdict it cannot support, reports a NON-ZERO matched-input count per predicate and
aborts if any predicate matched nothing, and is VERIFIED BY VIOLATION on a real artboard. Report
exactly what you broke and that you restored it.

Precedents: `_design/smartcity-public-works-lens/check.mjs` (35 self-tests),
`_design/smartcity-fire-ems-lens/check.mjs` (34), `_design/smartcity-parks-lens/check.mjs` (32).

At minimum it must refuse: a domain, region, vendor or record-type name absent from the product's
own source; **any person-shaped name in any cell**; **any plate string or persons-of-interest
content anywhere on the canvas**, which is the strongest rule on this lens; a head count rendered
as a bare number where the product carries a band; and rows drifting from the composer output.

**Two known narrownesses in the existing checks — do better if it is cheap.** They verify the
structured provenance foot against the registry but do NOT check vendor names appearing in prose,
so a basis sentence can name a vendor the foot contradicts. And the Parks big-figure rule is
scoped to `font:[45]00` at 20px+, so a non-kit weight evades it.

## Render before claiming

    "C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --screenshot=out.png --window-size=1600,1040 file:///<abs>/<Board>.dc.html

Every board, both themes (`{{themeClass}}` resolves to `sc-dark` / `sc-light`). Look at every
screenshot with the Read tool. Rendering caught three defects the last lane could not find by
reading: a matrix that had to be transposed, a clipped row while the basis claimed a full count,
and rails running past the bottom edge.

## Conventions

Tokens copied, never invented. **Nobody is named on a published canvas.** Fixture data badged as
fixture ON THE PAGE. Absent, zero and unmeasured are three different states, and on this lens
`ungranted`, `granted-empty` and `not built` are three more. Every money figure traceable or the
board declares itself illustrative. Externally to a city say "the record", "the asset", "current
state" — never "digital twin".

**The product's money gate refuses the standalone word `cent`**, so British "per cent" trips it.
Write "percent".

## Hard limits

You do NOT commit, stage, or touch git. You do NOT spawn sub-agents. You write only inside
`P:/doc_repo/_design/smartcity-police-lens/` plus your close artifacts under `_inbox/`. You read
product repos and write to none. You do not touch `_catalog/lane_claims.json` or any existing
`_design` folder. Commands must be exit-bounded.

## Hand back

Per board: what it shows, the design argument and what IN THE SOURCE produced it, the self-test
count AND matched-input count, what you broke to verify by violation, the `_kit.css` md5, and
confirmation every board was rendered and looked at. Plus a FLEET MEMORY block (LESSON /
DEAD-END / GROUND-TRUTH with timestamps / OPEN) and a `leave_behind:` declaration.

State anything you could not establish at source as UNESTABLISHED.
