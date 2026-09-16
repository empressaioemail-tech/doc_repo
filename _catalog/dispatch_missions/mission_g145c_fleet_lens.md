# MISSION — design the Fleet lens

One of the last two undesigned department lenses. Fleet is IN SCOPE as of the operator ruling
2026-09-15 (`_decisions/2026-09-15_police_and_fleet_lenses_in_scope.md`), which reversed an earlier
"not in the pilot" exclusion because v1 is being retired and an undesigned lens does not keep its
current level of service after cutover, it disappears.

**Police is being designed in parallel by another lane. Do not draw it.** Read the shared
constraint below; it binds both of you and the two lenses must not answer it differently.

**Bastrop approves the design before we build.** This is headed for a customer's eyes.

## The source state, established. Re-verify it, do not re-derive it

`smartcity-dashboards` `origin/main` `f776b4bf`. One registered region on this lens:

| Region | Domain | `gatedBy` | recordType |
|---|---|---|---|
| Vehicle roster | `FLEET_VEHICLES_DOMAIN` | `samsara` | `fleet-vehicle` |

**Fleet is the first lens designed whose vendor actually returns data.** `src/vendor-live.mjs`
header, live-verified 2026-09-03: Samsara, Spireon and PowerBI return real data; FirstDue returns
a specific 403; GoTo returns not-authorized. Samsara also has a live mapper and a platform route
(`smartcity-os /api/platform/samsara/vehicles`). Public works, Parks and Fire and EMS were all
drawn at some distance from data. **This one can be drawn connected, and that is what makes it
different from its three neighbours rather than a fourth copy of them.**

Do not let that make the board complacent. The live mapper is still a cutover risk and the last
lane found two of them falling back to colliding sentinel ids (`unknown-apparatus`,
`unknown-project`); check whether the Samsara mapper does the same and say so on the board if it
does.

**Fleet is deliberately the SIMPLE exemplar and its own module says why:**

> the reason this domain is one of the three exemplars is that it is SIMPLE and its shape shares
> almost nothing with the permit queue: a flat roster, no place, no due date, and one grouping
> dimension. If the seam only worked for case-shaped records it would look correct on the
> pipeline and fail on the first lens that is not a queue.

So resist importing the queue vocabulary. A flat roster with one grouping dimension is the shape,
and a design that dresses it as a work queue misrepresents the domain and wastes the one lens that
proves the seam generalises.

**A VEHICLE IS NOT AN ASSET, and this is the standing example.** From the module:

> G-24 stays at zero, and fleet telemetry has been the standing example of the thing that looks
> like it should fill an asset inventory and must not. The record type is fleet-vehicle under a
> files-writing vendor kind, never a city-owned asset node.

The Assets surface is excluded from design by ruling for exactly this reason. A Fleet lens that
reads as an asset inventory would undercut that ruling from the side, so the board should be
positively clear about what it is not. `_design/smartcity-parks-lens/` shows how to draw a
"what this is not" panel without it reading as an apology.

## The shared constraint, and Police's lane has the identical paragraph

**The operator is a person, the person must not be named, and the dimension still has to work.**
This lens is where that rule is stated most plainly, so you are the reference implementation:

> A DRIVER IS A PERSON. A granted Samsara feed carries driver names; a generated record must not,
> so the roster groups on an opaque operator reference under a declared format and the record
> states in its own basis why the name is absent. An absence with no basis is the defect this
> program hunts, so the absence is written positively rather than left as a missing field.

Draw the opaque operator reference as a working dimension, with its declared format visible and
the basis on the page. Police faces the same problem for patrol vehicles and a stronger version
in plate reads. If you conclude Fleet needs a treatment Police could not share, say so in your
report rather than diverging silently.

## What to produce

`_design/smartcity-fleet-lens/`, per `_design/README.md`: `README.md`, `gen.mjs`, `_kit.css`, the
artboards, `canvas.json`, `check.mjs`.

`_kit.css` is copied BYTE-IDENTICAL from `_design/smartcity-dev-services/_kit.css`. Verify with
`md5sum` and report the hash; it must be `58a68730e051b1ee2ffa21f08eae6752`.

**Read `_design/smartcity-fire-ems-lens/` first and follow its pattern.** It is the closest
precedent: one region, a roster, and a grouping dimension drawn as small multiples because the
domain's own brief said a rollup could not answer the question. Ask what YOUR grouping dimension
can and cannot answer before choosing its shape. Also read
`_design/smartcity-public-works-lens/` for the blocked-region component, which states four things
and never fewer (state, basis verbatim, what KIND of thing would move it, when it was last read).

Draw the number of boards the lens honestly needs. Fire and EMS took two and deliberately cut a
third because it would have repeated a sentence another board already made. Fleet being connected
may argue for a board its neighbours did not need; it does not argue for padding.

## The instrument

`check.mjs` that self-tests in BOTH directions before reading any artboard, ABORTS rather than
reporting a verdict it cannot support, reports a NON-ZERO matched-input count per predicate and
aborts if any predicate matched nothing, and is VERIFIED BY VIOLATION on a real artboard. Report
exactly what you broke and that you restored it.

Precedents: `_design/smartcity-fire-ems-lens/check.mjs` (34 self-tests),
`_design/smartcity-public-works-lens/check.mjs` (35), `_design/smartcity-parks-lens/check.mjs` (32).

At minimum it must refuse: a domain, region, vendor or record-type name absent from the product's
own source; **any person-shaped name in any cell, and specifically any driver name**; an operator
reference that does not match the declared format; asset-inventory vocabulary appearing on this
lens; and rows drifting from the composer output.

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
fixture ON THE PAGE. Absent, zero and unmeasured are three different states, and `ungranted`,
`granted-empty` and `not built` are three more. Every money figure traceable or the board declares
itself illustrative. Externally to a city say "the record", "the asset", "current state" — never
"digital twin".

**The product's money gate refuses the standalone word `cent`**, so British "per cent" trips it.
Write "percent".

## Hard limits

You do NOT commit, stage, or touch git. You do NOT spawn sub-agents. You write only inside
`P:/doc_repo/_design/smartcity-fleet-lens/` plus your close artifacts under `_inbox/`. You read
product repos and write to none. You do not touch `_catalog/lane_claims.json` or any existing
`_design` folder. Commands must be exit-bounded.

## Hand back

Per board: what it shows, the design argument and what IN THE SOURCE produced it, the self-test
count AND matched-input count, what you broke to verify by violation, the `_kit.css` md5, and
confirmation every board was rendered and looked at. Plus a FLEET MEMORY block (LESSON /
DEAD-END / GROUND-TRUTH with timestamps / OPEN) and a `leave_behind:` declaration.

State anything you could not establish at source as UNESTABLISHED.
