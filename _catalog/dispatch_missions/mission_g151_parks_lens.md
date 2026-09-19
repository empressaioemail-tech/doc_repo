## Mission - G-151: build the Parks lens, the one lens that does not exist, drawn as NOT existing

You launch no sub-agents (FAN-DEPTH 0). You WRITE in `smartcity-dashboards`. You write nothing in
`doc_repo` (hand any doc edit back as a diff, uncommitted) and nothing in `smartcity-os`.

### Why this row is the one most likely to be "fixed" wrong

Parks has no vendor and no registered domain. **Absence from `DOMAIN_REGISTRY` is the only surviving
meaning of "not built" in this product.** So the surface you are building renders a NEGATIVE claim, and
every instinct a builder has - fill the table, add a tile, show a zero - would turn it into a positive
claim that is false. An empty built surface and an unbuilt surface are different assertions; the first is
a lie about the second.

Six other lenses render data. This one renders that there is no data to render, and the reason there is
none. Get that backwards and the row is worse than not built.

### What you are building, and the boundary you must not cross

Design `_design/smartcity-parks-lens/`, RATIFIED 2026-09-17, `check.mjs` with 32 self-tests both
directions and two artboards. The built surface must carry, from `README.md`:

- **`data-lens-body`, not `data-lens-scope`.** The instrument scopes on the body attribute and REFUSES
  (exit 2) rather than degrading if it cannot scope the board. Do not rename it.
- **No metric tile, no empty table, and none of the built-surface vocabulary.** `Main.dc.html` renders
  parks as a surface that does not exist; `Difference.dc.html` is the contrast board and deliberately
  carries the built-surface terms. The boundary between the two is a rule the instrument checks, not a
  style choice.
- **The three refusals, all in the product**, already pinned by `src/department-domains.test.mjs` against a
  probe domain named `parks-facilities`: `assertDomainShape` refuses `gated by parks, which is not a
  catalogued adapter kind`; `assertCityPackShape` refuses `fixtureGrants names parks, which is not a
  catalogued adapter kind`; `composeDomain` refuses a record whose vendor id does not match its region
  gate. Confirm all three still hold and that the built surface says so.
- **The one thing that would change it, stated as a decision nobody has made.** Adding an eleventh
  catalogued adapter kind is a sourcing decision and a contract, not a sprint item.

**Do NOT add Parks to `DOMAIN_REGISTRY`.** That is the single move that makes the page claim coverage it
does not have, and it is out of scope for this row.

### Three near misses, named so you do not reach for them

Each is a real thing in the product carrying the word Parks, and none of them is this lens. Filling the
page with one of them answers a different question:

- **A map layer.** `src/property-map-catalog.mjs` catalogues a `parks` polygon layer and a
  `parks-recreation` view preset. That is geometry on the property map, not a department register.
  Whether it returns features for any city is UNESTABLISHED from this repo - state that, do not assume it
  either way.
- **A role.** `src/staff-identity.mjs` carries `parks` in `DEPARTMENT_ROLES` and in `NINE_LENSES`. A role
  that can be issued is not a surface that can be opened, and that module states G-132 does not enforce
  lens access.
- **A register row.** `src/shell-homes.mjs` routes "Departments including Parks and Courts" to the Parks
  lens with disposition "Not built". That row is the pointer, not a source.

### How to build it

Read the lens implementations that already landed and follow the pattern they set: `g152-public-works-fire-ems`
and `g153-fleet-police-lens` are merged on `main`. You are NOT inventing a mounting mechanism; you are
adding one entry that resolves to the not-built state.

### Acceptance - run these yourself and paste raw output

1. `node _design/smartcity-parks-lens/check.mjs` passes **on the built surface** with a NON-ZERO
   matched-input count, and fails against a planted violation **in both directions**. A pass on the design
   boards alone does NOT satisfy this: those boards pass today, before your change, so the pre-existing
   green is evidence about the folder and not about the surface you are building.
2. The shipped Parks surface renders no metric tile, no empty table and no built-surface vocabulary,
   **checked as a file rather than by eye**.
3. The surface is reached on the DO app per D-12, verified by the edge header, with the reach recorded.
4. `node --test` for the repo exits 0, and `src/department-domains.test.mjs` still refuses all three
   `parks-facilities` probes.

### What you must not do

- **Do not weaken the instrument to pass it.** `check.mjs` is inherited and its two-sided rule is the
  point. Editing its predicates to reach exit 0 is the defect class this program exists to catch.
- **Do not register the domain**, add a metric tile, or add a vendored data source.
- Do not touch the six other lenses' modules, and do not rename any `data-lens-*` attribute.

### Known pre-existing, not yours

`smartcity-dashboards` `main` is RED (three consecutive CI failures on `cbdfaeb6`). It is a date-rolled
test fixture in `src/dev-services-naming.test.mjs`, carded as G-166 and dispatched separately. If you see
that failure, it is inherited, it is not yours, and you should name it as inherited rather than chase it.
Your PR's checks may be red for that reason alone; say so rather than "fixing" it here.

### Evidence your close must carry

- The pre-change behaviour of the Parks route, and the post-change, both pasted.
- `check.mjs` both directions ON THE BUILT SURFACE, with the matched-input count visible.
- The edge-header read proving reach on the DO app, with the moment you read it.
- Your snapshot (repo, ref, moment read) per `ENFORCEMENT.md`, and your scratch block
  (LESSON / DEAD-END / GROUND-TRUTH with a timestamp / OPEN) returned in the close.
