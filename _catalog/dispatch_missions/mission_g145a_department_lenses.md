# MISSION — design the Public works, Parks and Fire and EMS lenses

Three of the five department lenses that ship in the nav and have never been designed. Police
and Fleet are IN SCOPE as of the operator ruling 2026-09-15 but are a SEPARATE lane; do not
draw them here.

**Why this is urgent rather than backlog.** v1 is being retired, not run alongside — stated to
the customer on the 2026-09-15 Jaime call: *"the version two dashboard. I'm retiring the one
you're working off of."* These lenses exist in v1 today, so shipping v2 without them removes
capability from departments that have it. Jaime named engineering and fire as likely flood-study
users.

**Bastrop approves the design before we build.** Everything here is headed for a customer's eyes.

## The source state, already established — do not re-derive it, DO re-verify it

Read against `smartcity-dashboards` `origin/main` `f776b4bf`. Confirm each of these yourself at
source before you draw; they are given so you spend your budget designing rather than searching.

`src/domains.mjs` `DOMAIN_REGISTRY` and the per-domain modules:

| Lens | Registered domains | `region` | `gatedBy` |
|---|---|---|---|
| `public-works` | `CIP_PROJECTS_DOMAIN`, `CALL_ANALYTICS_DOMAIN` | Capital projects, Call analytics | `powerbi`, `goto` |
| `fire-ems` | `FIRE_APPARATUS_DOMAIN` | Apparatus and stations | `firstdue` |
| `parks` | **NONE** | — | — |

**The Parks finding is the design problem, and it is load bearing.** `src/domains.mjs` states its
own rule in a comment, and the design must obey it:

> WHAT ABSENCE FROM THIS LIST MEANS, and it is the only surviving meaning of the words "not
> built": the surface does not exist yet. Everything in the list is built, and its emptiness on a
> given pack is a statement about SOURCES with a basis attached (ruling 1, operator-approved
> 2026-08-19). Those are different sentences to a customer and this list is the line between them.

and

> WHAT WAVE 2 COULD NOT ADD, and it is a finding rather than an omission. Parks facilities and
> Court docket have no vendor at all — the build sheet records both as "gates: none yet".

So **Parks is not an empty Public works.** Public works and Fire and EMS are built surfaces that
may read nothing yet, and their emptiness is a statement about a missing grant with a basis.
Parks is a surface that does not exist, with no vendor to grant. A design that renders the two
the same way collapses two states the product deliberately keeps apart, and it is the exact
defect class this program exists to prevent. Draw the difference.

`src/staff-identity.mjs` carries the role vocabulary: `DEPARTMENT_ROLES` (seven),
`TIER_ROLES` (nine). Use those names; do not invent a department.

## What to produce

Three folders under `_design/`, per `_design/README.md`:

    _design/smartcity-public-works-lens/
    _design/smartcity-parks-lens/
    _design/smartcity-fire-ems-lens/

Each with `README.md`, `gen.mjs`, `_kit.css`, `<Name>.dc.html` artboards, `canvas.json`, and
**`check.mjs`**.

`_kit.css` is **copied byte-identical** from an existing design folder. Verify with `md5sum`
against `_design/smartcity-dev-services/_kit.css` and report the hash. If a design appears to
need a token that does not exist, that is a product-line decision — say so, do not add one.

Follow the shape the Development services lens established: a queue plus a second axis, and
**draw each second axis as the shape its data actually is** rather than flattening all three to
one template. That lens's design argument came out of the source, and yours should too. If the
honest answer for a lens is fewer artboards, produce fewer — do not pad to match.

## The instrument is not optional and it is not a formality

Every folder gets a `check.mjs` that:

- self-tests in **both directions** before reading any artboard, and **aborts** rather than
  reporting a verdict it cannot support
- reports a **NON-ZERO count of matched inputs**, and aborts if a predicate matched nothing
- is **verified by violation** against a real artboard: break something on purpose, confirm the
  check fails, put it back

**A check with no inputs is worse than no check.** One shipped on 2026-09-15 that self-tested
perfectly and matched nothing on any artboard, because the canvas rendered display forms and
never the product's actual codes. It reported success and checked nothing. Count the matches.

Working precedents to read first: `_design/smart-files/check.mjs` (12 self-tests, closed
vocabularies), `_design/smartcity-dev-services/check.mjs` (21 self-tests), and
`_design/smartcity-finance-lens/check.mjs` (11).

At minimum each check must refuse: a domain, region or vendor name not present in the product's
own source; a person-shaped name in any table cell; and, for Parks, any rendering that presents
it as an empty built surface rather than a surface that does not exist.

## Render it before you say it works

Naming a risk is not clearing it. A prototype shipped on 2026-09-15 that had been declared
un-rendered, and it was wrong.

    "C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --screenshot=out.png --window-size=1600,1040 file:///<abs path>/<Board>.dc.html

Render **every** artboard and look at it. `_design/demo/export-screens.mjs` already does this for
all 48 boards in both themes if you want the existing harness.

## Conventions that are non-negotiable

Tokens copied, never invented. **Nobody is named on a published canvas** — a previous pass put
three residents' names beside their addresses on a canvas bound for their own city, and two of
them were the same people that folder's README quotes as PII the design must not render. Fixture
data is badged as fixture **on the page**. Absent, zero and unmeasured are three different states
and no surface collapses them. Every money figure traceable to a record, or the board declares
itself illustrative.

Vocabulary: internally twin, node, atom, graph; **externally to a city: the record, the asset,
current state. Never say digital twin to a city.**

## Hard limits on this lane

**You do not commit, stage, or touch git.** Produce the artifacts and hand them back. The planner
reads the diff and commits. This is what makes the fan safe.

**You do not spawn sub-agents.** Do the work yourself in this session.

**You write only inside `P:/doc_repo/_design/` and the three folders named above**, plus your
close artifact under `_inbox/`. You do not write to `smartcity-dashboards` or any other product
repo — read them only.

**Do not touch `_catalog/lane_claims.json`** or any other file another seat appends to.

## What to hand back

A report naming, per lens: the artboards produced and what each shows, the design argument and
what in the source produced it, the `check.mjs` self-test count and **matched-input count**, what
you broke to verify it by violation, the `_kit.css` md5, and confirmation that every board was
rendered and looked at.

State anything you could not establish at source as unestablished. An honest gap is worth more
than a plausible fill, and every one of the seven defects the last design pass caught was
invisible to a re-read of the canvas.
