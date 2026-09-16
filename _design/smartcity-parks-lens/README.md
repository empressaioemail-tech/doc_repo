# SmartCity OS — Parks lens

**Artifact:** not published. DRAFT of 2026-09-15, produced under OPS-17 G-145, lane
`g145a-department-lenses`. Publication is the planner's call, not this lane's.
**Decision:** none yet. The ratifying decision belongs in `_decisions/` and should link back here.
**Status:** DRAFT, not ratified. Bastrop approves the design before we build.
**Source:** `smartcity-dashboards` at `origin/main` `f776b4bf24114ed4061609d28c0429f84eb431b7`,
read directly: `src/domains.mjs`, `src/fixture-seam.mjs`, `src/city-pack.mjs`,
`src/staff-review.mjs`, `src/staff-identity.mjs`, `src/shell-homes.mjs`,
`src/property-map-catalog.mjs`, `src/department-domains.test.mjs` and `web/index.html`.

## Regenerate and check

    node gen.mjs
    node check.mjs

`source-state.json` is the OUTPUT of the product's own composers at that commit. `gen.mjs` throws
if Parks ever acquires a registered region, because at that moment this design is wrong rather
than merely stale.

`_kit.css` is a byte-identical copy of `_design/smartcity-dev-services/_kit.css`,
md5 `58a68730e051b1ee2ffa21f08eae6752`. No token was invented.

## Parks is not an empty Public works, and this folder exists to say so

`src/domains.mjs` states the rule in its own comment, above `DOMAIN_REGISTRY`:

> WHAT ABSENCE FROM THIS LIST MEANS, and it is the only surviving meaning of the words "not
> built": the surface does not exist yet. Everything in the list is built, and its emptiness on a
> given pack is a statement about SOURCES with a basis attached. Those are different sentences to
> a customer and this list is the line between them.

and, of Parks specifically:

> Parks facilities and Court docket have no vendor at all — the build sheet records both as
> "gates: none yet". There is no vendorless path through this seam, so neither lens is registered
> here and neither is faked with an invented kind.

So Parks gets **none** of the built-surface vocabulary. No metric tiles reading "Not read". No
region strip with an empty state inside it. No table header with no rows under it. Every one of
those is the sentence a BUILT region prints when it has no source, and a city reading it on Parks
would go looking for a grant that no vendor exists to give. The failure mode here is not an ugly
page: it is a page that renders beautifully in the wrong language.

**The tell is that it does not vary.** `composeDomainById(pack, "parks-facilities")` returns the
same sentence on the demo pack, on an unconnected city and on the live staging pack:
`parks-facilities is not a registered domain, so this surface is not built`. A state that varies
by city is a statement about the city. A state identical on every city is a statement about the
product. The copy is written to keep that signal: the Parks sentence names no vendor and no city,
because neither is true of it, while every built-but-unfed sentence names both.

## The boards

| Board | What it shows |
|---|---|
| `Main.dc.html` | Parks drawn as a surface that does not exist: the state, the three refusals in the product that make it unregistrable, the one thing that would change it, three near misses that are not this lens, and the roster counted |
| `Difference.dc.html` | the two sentences side by side with their verbatim basis strings, their composers, what each asks of a city, and the product's own rule quoted underneath |

Two boards, not four. There is no data to draw and padding would be its own dishonesty.

## Why it cannot simply be added

Three refusals, all in the product, all pinned by `src/department-domains.test.mjs` against a
probe domain named `parks-facilities`:

| Guard | Refuses | Message |
|---|---|---|
| `assertDomainShape` | a region whose gate is not a catalogued kind | `gated by parks, which is not a catalogued adapter kind` |
| `assertCityPackShape` | a pack naming an uncatalogued kind | `fixtureGrants names parks, which is not a catalogued adapter kind` |
| `composeDomain` | a record whose vendor id does not match its region gate | `returned a X record but is gated by Y` |

The ten catalogued kinds at `f776b4bf` are `mygov`, `samsara`, `opengov`, `esri`, `municode`,
`firstdue`, `verkada`, `spireon`, `goto` and `powerbi`. None is a parks system. Adding an
eleventh is a sourcing decision and a contract, not a sprint item, and it is the only move that
turns this page into a page.

## Three near misses, named so nobody reaches for them

Each of these is a real thing in the product carrying the word Parks, and none of them is this
lens. A reviewer filling this page with one of them would be answering a different question, and
the page would then claim coverage it does not have.

**A map layer.** `src/property-map-catalog.mjs` catalogues a `parks` polygon layer ("City parks
with names and types") in the `parks-community` category, plus a `parks-recreation` view preset.
That is a geometry layer on the property map, served through the platform-internal bridge; it is
not a department register. **Whether it returns features for any city is UNESTABLISHED** from the
dashboards repository, and this folder states that rather than assuming it either way.

**A role.** `src/staff-identity.mjs` carries `parks` in `DEPARTMENT_ROLES`, seven of them, and in
`NINE_LENSES`. A role that can be issued is not a surface that can be opened, and that same module
states that G-132 does not enforce lens access.

**A register row.** `src/shell-homes.mjs` routes "Departments including Parks and Courts" to the
Parks lens with disposition "Not built". That row is the pointer here; it is not a source.

## The instrument

`check.mjs` is the one in this lane with a two-sided rule, and it is the reason the folder has two
boards rather than one.

    Main.dc.html        the built-surface vocabulary must be ABSENT
    Difference.dc.html  it must be PRESENT, attributed to the other lens

Neither half can be satisfied by a sentinel. A design that drifted into "Not read" or "has not
been read for this pack" on Parks would fail the first half while still rendering perfectly,
which is exactly the class of defect a re-read of the canvas does not catch.

**The scope is structural.** Every read is scoped to the content inside `data-lens-body="parks"`,
so the nav's own "Not read" badges on Police, Fire and EMS and Fleet, which are correct and belong
there, neither satisfy nor violate a rule about the Parks page. A whole-document scan would pass
on the wrong evidence, which is its own way of checking nothing. Removing the marker makes the
check REFUSE rather than fall back to the whole document.

Half the built-surface vocabulary is lifted straight out of the composer output, so it cannot
drift away from the product without this file noticing. It also refuses: a vendor gate anywhere on
a Parks board; a metric figure of 20px or larger in the data font, which is the built-surface tile
shape; a state word outside the shipped vocabulary; a roster count that disagrees with the
registry; a person-shaped name; and the composer sentence going missing verbatim. It reports a
matched-input count per predicate and refuses a verdict if one matched nothing.

Verified by violation on 2026-09-15, seven planted defects, seven caught, every artboard restored:

| Violation | Result |
|---|---|
| the headline → "The parks register has not been read for this pack." | caught: the Parks page is speaking as a built surface |
| the page badge `Not built` → `Not read` | caught: same rule, on the badge |
| a cell → `gatedBy parks` | caught: Parks declares a vendor gate |
| `data-roster-region="parks:0"` → `parks:1` | caught: roster count disagrees with the registry |
| the headline restyled to a 24px data-font figure | caught: a metric figure on a surface with nothing to measure |
| `data-lens-body` → `data-lens-scope` | caught, exit 2: the board cannot be scoped, so it is not checked, and the verdict is refused rather than degraded |
| the contrast board's composer sentence → "this city has no data" | caught: the contrast board stopped quoting the composer |

One earlier attempt at the badge violation was **not** caught, and the reason is worth keeping:
it replaced the first `Not built</span>` in the file, which is in the NAV, outside the scoped
body. The check ignoring it is the scoping working as designed. Re-aimed inside the body, it was
caught. A violation that misses its target is not evidence either way, and treating it as a pass
would have been the more dangerous mistake.

## Conventions honoured

Nobody is named. There is no fixture data on these boards to badge, because there is no data at
all, and the boards say that rather than showing an empty frame. Absent, zero and unmeasured stay
apart, and `not-registered` is drawn as a fourth thing again: not an absence of records but an
absence of the surface. No figure of money. The word "twin" appears nowhere.

## Carved out, deliberately

Municipal court, which is the other vendorless lens in the same finding, is ruled long-tail and
stays on Connections; it is not designed here. Police and Fleet are a separate lane. What a Parks
lens would look like once a vendor exists is deliberately not drawn: it would be a design for a
product decision nobody has made, and drawing it is how a "not built" page quietly becomes a
roadmap promise.

## Unestablished

Whether the `parks` map layer returns features for Bastrop or any other city is unestablished from
the dashboards repository and is stated as unestablished on the board. Whether a parks or
facilities system exists that Bastrop already runs is unestablished here; the build sheet's "gates:
none yet" is a statement about our catalogue, not about the city.
