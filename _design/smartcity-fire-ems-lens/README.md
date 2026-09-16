# SmartCity OS — Fire and EMS lens

**Artifact:** not published. DRAFT of 2026-09-15, produced under OPS-17 G-145, lane
`g145a-department-lenses`. Publication is the planner's call, not this lane's.
**Decision:** none yet. The ratifying decision belongs in `_decisions/` and should link back here.
**Status:** DRAFT, not ratified. Bastrop approves the design before we build.
**Source:** `smartcity-dashboards` at `origin/main` `f776b4bf24114ed4061609d28c0429f84eb431b7`,
read directly: `src/domains.mjs`, `src/domains/fire-apparatus.mjs`, `src/fixture-seam.mjs`,
`src/adapters.mjs`, `src/city-pack.mjs`, `src/vendor-live.mjs`, `src/server.mjs`,
`src/staff-review.mjs` and `web/index.html`.

## Regenerate and check

    node gen.mjs
    node check.mjs

`source-state.json` is the OUTPUT of the product's own composer at that commit, not a
transcription of it. Re-dump it rather than editing it, then re-run `gen.mjs`.

`_kit.css` is a byte-identical copy of `_design/smartcity-dev-services/_kit.css`,
md5 `58a68730e051b1ee2ffa21f08eae6752`. No token was invented.

## What this lens is

One registered domain: `fire-apparatus`, region "Apparatus and stations", gated by `firstdue`,
one row per unit. Granted on the demo pack, twelve apparatus across three stations.

Public works carries two regions. Fire and EMS carries one. Parks carries none. The region strip
is drawn at one item rather than hidden, because a strip that disappears at one entry makes "this
lens has one region" indistinguishable from "this lens has regions we are not showing you".

## The design argument

**The second axis is a partition, so it is drawn as small multiples.** The domain and the shipped
lede both state the brief in one sentence: *a city with every out-of-service truck in one station
is a different fact from a city with one in each, and a rollup cannot say which.* That sentence
forbids a single stacked bar. One card per station, the same four bands in the same order at the
same scale, so a reader compares parts instead of reading a whole.

**The two routes to the same number are shown agreeing.** The three station cards sum to twelve
apparatus and eight in service, which is the same eight the tile row reports off
`apparatusMetrics`. Two numbers that should agree, shown agreeing, rather than one number shown
twice.

**Twelve of twelve, and no pager.** The whole roster is on the page. A readiness screen showing
the first ten of twelve units is worse than no roster: the two a station is missing are exactly
the two somebody is looking for. This is a property of the fixture size, not a rule for every
pack — a real roster of two hundred needs a pager and a station filter, and saying so is part of
the design rather than a gap in it.

**Nobody is named, and the dimension survives.** The record carries `crewBasis`: *a granted feed
is where an assigned crew would come from and a roster of real firefighters is not a fixture.*
Same discipline the Development services lens applies to inspector load. Station references are
opaque, the place vocabulary announces itself as invented, and the readiness table still answers
the question it exists to answer.

## The boards

| Board | Pack | What it shows |
|---|---|---|
| `Main.dc.html` | `template-city` | the full twelve-unit roster, the four readiness tiles, the three station cards as small multiples, the crew refusal, the flood screening mount |
| `Blocked.dc.html` | `bastrop_tx` | the vendor declining, the obstacle named as an entitlement, the four not-built jobs, and three build rules stated before the build |

Two boards, not three. An "unconnected city" board would repeat a sentence
`_design/smartcity-public-works-lens/Empty.dc.html` already draws, and padding to match another
folder's board count is not a reason to draw one.

## Findings, from comparing two sources rather than re-reading the canvas

**The obstacle here is an entitlement, not a bug, and nobody reading the screen can fix it.**
`src/vendor-live.mjs` records a verification dated 2026-09-03: FirstDue returns a real 403 because
the API credential lacks the apparatus and assets scope. The region is built, the grant is in
place, and the live path is wired through `REAL_LIVE_DOMAINS`. A page saying only "not read" would
send an engineer looking for a defect that is not there.

**When it reads, these tiles are not these tiles.** Out of service / Inspection due / In shop / In
service is this product's own invented vocabulary. `src/vendor-live.mjs` states its stance in its
own header and `mapRealFireApparatusRecord` implements it: real status is kept as-is and never
force-mapped, and `realStatusCounts` groups by whatever the vendor actually returns. The metric
row therefore has to take its bands FROM the payload, not from a constant, or the first real read
sorts real trucks into invented buckets. Stated on the board so the build inherits it.

**The refusal does not survive the cutover.** The generated record carries `crewBasis` saying no
person is named. `mapRealFireApparatusRecord` carries no crew field and no basis for its absence,
so the statement silently disappears when the feed lands. Recommendation: carry a crew basis on
the live mapper too, stating whether the apparatus endpoint exposes crew at all.

**The live `recordId` falls back to a sentinel.** `String(row.id || row.unitId || "").trim() ||
"unknown-apparatus"`. Every unidentifiable row gets the same id, so they collide, and a check that
asks "does this record have an id" passes on all of them. `mapRealCipProjectRecord` has the same
shape with `unknown-project`.

**Apparatus reuses the vehicle status set and cameras do not, and that asymmetry is deliberate.**
The domain states it where it is read: the test is whether the bands differ, not whether the
department differs. Worth preserving; it is the kind of thing a later lane "tidies" into a second
identical constant.

## The instrument

`check.mjs` self-tests in **both directions** and aborts rather than reporting a verdict it cannot
support. It reports a **matched-input count** per predicate and refuses a verdict if any predicate
matched nothing across every board.

It refuses: a domain/gate pair the registry does not carry for this lens; an uncatalogued vendor
kind; a readiness band the product does not declare, which is the check that catches a raw vendor
status passed through unmapped; a state word outside the shipped vocabulary; a composer status the
product does not define; a money token; a person-shaped name in any table cell, which on this lens
means a crew name; a roster that is not the composer's twelve in the composer's order, all or
nothing; a station reference the composer never produced; and any of five composer sentences going
missing from the set of boards.

Verified by violation on 2026-09-15, six planted defects, all six caught, every artboard restored:

| Violation | Result |
|---|---|
| `gatedBy firstdue` → `gatedBy firehouse` | caught: uncatalogued vendor kind |
| band chip `In service` → `Available` | caught: readiness band the product does not declare |
| a unit cell → `J. Halloran` | caught: table cells name people |
| `STN-01` → `STN-07` | caught: station ref the composer never produced |
| `FIX-FA-1132` → `FIX-FA-1143` | caught: apparatus ids not the composer's |
| badge `Not connected` → `Syncing` | caught: invented state word |

## Conventions honoured

Nobody is named on any board, which on a fire lens is the rule that matters most. Fixture data is
badged as fixture on the page. Absent, zero and unmeasured stay apart: on the Blocked board the
record count renders UNREAD rather than as a number, because no live read was performed. There is
no figure of money. The word "twin" appears nowhere: externally this is the record, the asset,
current state.

## Raised, not settled

**Naming the vendor on a lens panel is a change.** The shipped panel chip says "Apparatus output
contract" and names no vendor. The blocked card and the provenance foot name FirstDue, because a
member of staff looking at their own empty page needs to know whose credential is missing. Needs
an operator ruling before build.

## Carved out, deliberately

Occupancies, Volunteer response, County dispatch, and Flood and weather: named on the board as not
regions on this product, copied from the shipped lens. Occupancy in particular is out of scope
rather than unmentioned — an occupancy record is a real building with a real address, which is the
one thing a fixture pack cannot generate honestly and which the seam's own address guard would
reject. The flood and drainage study itself is designed and ratified at
`_design/smartcity-flood-study`; this lens shows the mount. Police and Fleet are a separate lane.

## Unestablished

Whether FirstDue answers **today** is unestablished. The 2026-09-03 reading in
`src/vendor-live.mjs` is the only evidence in the repository, and the exact live basis string is
UNREAD by this design and is drawn as unread rather than guessed. No live probe was run and no
credential was used by this lane.
