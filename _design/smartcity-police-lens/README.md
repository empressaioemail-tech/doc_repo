# SmartCity OS — Police lens

**Artifact:** not published. DRAFT of 2026-09-15, produced under OPS-17 G-145, lane
`g145b-police-lens`. Publication is the planner's call, not this lane's.
**Decision:** none yet. This folder holds the artefact and its source; the ratifying decision
belongs in `_decisions/` and should link back here. In scope per the operator ruling
`_decisions/2026-09-15_police_and_fleet_lenses_in_scope.md`.
**Status:** DRAFT, not ratified. Bastrop approves the design before we build.
**Source:** `smartcity-dashboards` at `origin/main`
`f776b4bf24114ed4061609d28c0429f84eb431b7`, read directly: `src/domains.mjs`,
`src/domains/patrol-vehicles.mjs`, `src/domains/police-cameras.mjs`,
`src/domains/fleet-vehicles.mjs` (for one cross-lens finding only), `src/fixture-seam.mjs`,
`src/adapters.mjs`, `src/city-pack.mjs`, `src/vendor-live.mjs`, `src/server.mjs`,
`src/shell-homes.mjs`, `src/lens-claims.test.mjs`, `src/domains.test.mjs`, `web/index.html`
and `web/app.js`. Every blob hash is recorded in `source-state.json`.

## Regenerate and check

    node dump-source-state.mjs --repo <path to a smartcity-dashboards checkout>
    node gen.mjs
    node check.mjs
    node violate.mjs

`source-state.json` is not a transcription. It is the OUTPUT of the product's own composers,
produced by importing `composeDomainById` at that commit and running it against
`template-city`, `empty-city`, `bastrop_tx` and the product's own throwaway `probe-city`.
Every row, count, basis sentence and counting rule on these boards comes from it. Re-dump it
rather than editing it, then re-run `gen.mjs`.

**`dump-source-state.mjs` is new to this folder and the three earlier lens folders have no
equivalent.** `_design/README.md` says "re-dump it rather than editing it", and the lanes that
shipped Public works, Parks and Fire and EMS left their dumper in a session scratchpad that
died with the session. An instruction to re-run something nobody can re-run is a control whose
executor is that a human remembers. This is the executor. It also never reads a working tree:
it extracts the named ref with `git archive` and imports from the extraction, because a
checkout is a proxy for the commit you meant rather than the commit itself. Ours sat on
`g135-tenant-key-env-doc` the whole time and was never read.

`_kit.css` is a byte-identical copy of `_design/smartcity-dev-services/_kit.css`,
md5 `58a68730e051b1ee2ffa21f08eae6752`. No token was invented.

## What this lens is

`src/domains.mjs` registers exactly two domains under `lensId: "police"`.

| Domain | Region | Gated by | Record type | Unit |
|---|---|---|---|---|
| `police-cameras` | Camera inventory | `verkada` | `camera-device` | one row per device |
| `patrol-vehicles` | Patrol roster | `spireon` | `patrol-vehicle` | one row per vehicle |

On the shipped demo pack, `verkada` is in `TEMPLATE_CITY.fixtureGrants` and `spireon` is
deliberately not, so cameras generate 18 records and the patrol roster reads `ungranted`.

## The design argument

**Police is the only registered lens whose two regions disagree about their source, and it
disagrees in opposite directions on the two shipped packs.** That is computed in `gen.mjs`
from the registry and the two grant lists rather than asserted, and `gen.mjs` throws if it
stops being true. On `template-city` Verkada is granted and Spireon is withheld; on
`bastrop_tx` Spireon is granted as a live feed and Verkada is not granted at all. The demo's
emptiest region is the city's most connected one, and the demo's fullest region is the one the
city cannot have.

**Three distances from data, and they are different kinds of thing.** A grant deliberately
withheld, a vendor nobody has onboarded, and a class of record refused on purpose. A design
that renders them alike destroys exactly the distinction the product was built to preserve, so
each gets its own tone, its own obstacle-kind sentence and its own board.

**The two regions switch rather than stack.** They are different units, a device inventory and
a vehicle roster. The product stacks both in one `colstack`, and at 1040px that puts the patrol
roster, which is the whole reason this lens is interesting, below the fold. Peer regions get
the strip `DS_TABS` already uses for seven tabs. **This is a proposed change, not a copy of
what ships.**

**Occupancy is a band, and the nothing is caused.** `REPORTING_STATUSES` is `[firmware-due,
online]`, so an unreporting camera cannot carry a band and a reporting one cannot carry
"occupancy not measured". Of sixteen cells, eight cannot occur by rule and render hatched;
absent, zero and unmeasured are three states and this grid needs a fourth. The payoff is the
margin: three cameras are not reporting and three carry the not-measured band, two numbers
derived by different routes that the product never shows agreeing.

**Declined is not absent, and the product has no word for it.** `ungranted`, `granted-empty`,
`no-fixture-source` and `not-registered` are all statements about a SOURCE. `plateReads`,
`personsOfInterest` and `occupancyCount` are statements about a source that exists, works, and
is refused. Drawn as its own class in the restricted tone, never as a fifth flavour of empty.

**A blocked region states four things and never fewer.** Its state, its basis verbatim, what
KIND of thing would move it, and when that was last read. Reused from the Public works lens
rather than drawn again.

## The boards

| Board | Pack | What it shows |
|---|---|---|
| `Main.dc.html` | `template-city` | the camera register at 18 of 18 with no pager, the site margin at 5 sites summing to 18, and the G-24 statement that all eighteen leave the asset inventory at zero |
| `Declined.dc.html` | `template-city` | the status-by-band matrix with 8 forbidden cells and both margins, the reconciliation drawn, the three refused classes with the contract's own basis, and the four bands in declared order |
| `Patrol.dc.html` | `template-city` (+ `probe-city` panel) | the ungranted exemplar with unread tiles, the three sentences side by side, the two not-built jobs, and the operator dimension composed the way the product's own test composes it |
| `Bastrop.dc.html` | `bastrop_tx` | one status producing two different sentences, the inversion, Verkada typed as vendor onboarding, and what the live Spireon path carries and drops |

**Four boards, and one was considered and cut.** There is no `Empty.dc.html`. On `empty-city`
both regions return the IDENTICAL no-grant sentence, which says strictly less than the Bastrop
board, where one status produces two different sentences. Public works drew an Empty board to
carry the five-state legend; repeating that legend here would be padding.

**The proving panel on `Patrol.dc.html` needs its own justification.** The operator dimension
cannot be drawn from the shipped demo, because the region is ungranted there and drawing rows
nobody composed would be fabrication. So it is composed the way `src/domains.test.mjs` composes
it: grant `spireon` on a throwaway `probe-city` pack, change nothing else, and the region fills
with ten records over three opaque operator references. That panel is the load-bearing half of
the ungranted claim. If the generator were a stub, `ungranted` and "not built" would be
indistinguishable one layer down, which is how the original misreading survived three handoffs.
It is badged, it names its pack in the panel head and in the provenance foot, and its basis says
the pack is never shipped and never served.

## The shared constraint, and how Police answers it

Fleet solves "the operator is a person, the person must not be named, and the dimension still
has to work" with an opaque operator reference under a declared format, with the record stating
in its own basis why the name is absent. **Police answers it the same way and no second
vocabulary was invented.** `patrol-vehicles.mjs` declares `OPERATOR_REF_FORMAT` as the same
two-digit `OPR` pattern, `OPERATOR_COUNT` at 3, and `OPERATOR_BASIS` as the string "a generated
record names no person; the operator is an opaque reference and a granted feed is where a name
would come from".

Police has a stronger version of the same problem on the camera side, and the answer is stronger
in kind rather than in degree: the plate-read and persons-of-interest families are declared in
the record CONTRACT as fields a generated record never carries, each with a basis, rather than
merely omitted. The module says why that is the stronger control, and the board quotes it.

**One consequence, and it needs a ruling.** `fleet-vehicles.mjs` and `patrol-vehicles.mjs`
declare the same format and the identical basis string INDEPENDENTLY, neither importing the
other. Fleet mints `OPR-01` to `OPR-04` and Police mints `OPR-01` to `OPR-03` on the same pack,
and nothing in the product says whether `OPR-01` on each is one person. Two lenses answering one
constraint the same way is still right; sharing an opaque namespace without saying so is not.
Named on the Patrol board and raised below.

## Findings, from reading the write path rather than measuring the output

**A required field is missing from the live path and nothing fails.** `RECORD_SHAPES.spireon`
declares `operatorRef` as `required: true`. It occurs ZERO times in `src/vendor-live.mjs`
(counted, not inferred), and `assertRecordShape` occurs ZERO times there against the fixture
seam's two. So the grouping dimension the roster is built on does not survive the cutover, and
on `bastrop_tx` the cutover has already happened.

**The Spireon shape declares no field it will never carry.** `samsara` declares `operatorName`
required:false with a basis, `verkada` declares three, `firstdue` declares `crew`. `spireon`
declares none. The refusal that keeps a person out of the patrol roster lives only on the
generated record, which the live mapper does not produce. A guard catches the attempt and a
contract prevents it; on this one shape there is no contract.

**Three of the six shipped patrol columns cannot be filled by the generator.** `web/index.html`
gives the patrol table Unit, Status, Operator, NSpire, Maintenance, Recent Alerts.
`activeInNspire`, `maintenanceAlertCount` and `recentAlertCount` exist only on the live mapper.
Same class as the `Completion` column Public works found on the CIP table, three times over.
On a granted demo pack they render blank, and a blank alert cell reads as none.

**`granted-empty` is unreachable on this lens through the seam.** `CAMERA_FIXTURE_PLAN` and
`PATROL_FIXTURE_PLAN` each return a fixed non-empty set, so `composeDomain` can never take the
zero-record branch. The lens the product built to prove it can tell `ungranted` from
`granted-empty` cannot currently produce `granted-empty` at all. It is reachable only through
the live read, which has its own differently worded sentence in `okResult`.

**The product's own money gate refuses two of the product's own notations.** `FORBIDDEN_CONTENT`
matches any currency symbol anywhere, so a template literal's `${...}` slot and a regex's `$`
end anchor both trip it. Quoting a sentence template or a declared format character for
character would therefore put a money token on a lens that prints none. The boards rewrite the
slots to angle brackets and write the operator format out in words, and say so on the page.
`check.mjs` applies the same transform to the source string, so the comparison stays two-sided.
Found by `check.mjs`, not by reading the board.

**Emergency EOC is homed to two lenses and named on neither.** `SHELL_HOMES` rows 16 and 17
home "Emergency EOC" to "Police + Fire and EMS" and "Regional ops map / resources / incident
log" to "Police / Fire". The shipped Police not-built panel names Incident log and Regional
operations map; the Fire panel names Occupancies, Volunteer response, County dispatch and Flood
and weather. Neither names Emergency EOC. The Patrol board draws the two the Police lens itself
names, and this is raised rather than silently added.

**The shell-homes disposition for Police and Cameras still reads "Not built" while both are
registered domains. This is already recorded, not a new finding.**
`src/lens-claims.test.mjs` states that seven lens-granular rows across Fleet, Police, Fire and
EMS and Public works look stale in the same way and are routed rather than edited, because those
rows map to no domain without a ruling. Reported so the Police pair is named, not to re-open it.

**The generator prints "unit unit".** `PATROL_VOCABULARY` carries entries that already end in
the word unit (Traffic unit, Supervisor unit, Unmarked unit) and the label template appends
" unit NN", so `probe-city` renders "Traffic unit unit 23". `UNIT_LABEL_FORMAT` permits it.
Cosmetic, visible on any granted pack, and the board renders it as the composer produced it
rather than tidying data on a canvas.

## The instrument

`check.mjs` self-tests in **both directions** and aborts rather than reporting a verdict it
cannot support. It reports a **matched-input count** per predicate and refuses a verdict if any
predicate matched nothing across every board.

It refuses: a domain/gate pair the registry does not carry for this lens; an uncatalogued vendor
kind; a state word outside the shipped vocabulary, **in the nav as well as the lens body**; a
composer status the product does not define; a money token anywhere, including British "per
cent"; the word "twin"; a person-shaped name in any table cell; **any surveillance term outside
a declared refusal marker**; **any plate-shaped string anywhere at all**; a vendor named in
prose that this lens does not gate, unless the mention sits inside a verbatim source-state
quotation; a figure the composer never produced, at any font weight; an occupancy that is not a
declared band; a matrix cell that cannot occur by rule drawn as a count; record ids out of
composer order; the probe domain id; a missing lens-body marker; and any of sixteen composer
sentences plus two sentence templates going missing from the set of boards.

**Two narrownesses in the existing lens checks are closed.** Vendor names in prose are now
checked, by lifting every source-state string out of the board text first and requiring every
catalogued vendor display name left in the prose to be one of this lens's two gates. And the
Parks big-figure rule, scoped to `font:[45]00` at 20px+, is widened to ANY three-digit weight at
20px or more in either font, and then strengthened: every big figure's TEXT must be a number the
composer produced.

**Two defects in this instrument were found by the violation run, not by reading it.** Both are
self-tests now.

The plate rule was **blinded by its own exclusion set**. It scanned for a candidate that could
span separators, then excluded the whole candidate if any run inside it matched a declared
composer format. A plate sitting next to a record id joined into one candidate, the record id
excluded it, and `FIX-CAM-1007 7XYZ123` passed. An exclusion whose scope is wider than its claim
is a defect, and this one made the strongest rule on the lens unable to fire. It now removes the
composer's own identifiers as exact strings first and matches plate forms against what is left.

The badge rule was **scoped to the lens body, and the nav is outside it**. An invented state word
in the sidebar was on the canvas and unchecked. Badges, surveillance terms, plates, money and
vendor names now read the whole document.

Verified by violation on 2026-09-15, **seventeen planted defects, all seventeen caught**, every
artboard restored and proved restored by md5:

| Violation | Board | Result |
|---|---|---|
| a plate string in a device cell | Main | caught: plate-shaped token |
| a plate BESIDE a record id | Main | caught: plate-shaped token |
| a person named in a table cell | Main | caught: table cells name people |
| `gatedBy verkada` → `gatedBy axon` | Main | caught: uncatalogued vendor kind |
| badge `Demo records` → `Syncing`, in the NAV | Main | caught: invented state word |
| badge `Restricted` → `Syncing`, in the body | Main | caught: invented state word |
| `data-occupancy="moderate"` → `"41"` | Main | caught: not a declared band |
| an invented figure at a non-kit weight | Main | caught: big figure the composer never produced |
| two record ids swapped | Main | caught: ids out of composer order |
| an unmarked surveillance term in prose | Declined | caught: term outside a declared refusal |
| a forbidden matrix cell drawn as a count | Declined | caught: cannot occur by rule |
| a shape field name outside its refusal marker | Bastrop | caught: term outside a declared refusal |
| `FirstDue` named in unquoted prose | Bastrop | caught: vendor this lens does not gate |
| the probe domain id on the canvas | Patrol | caught: probe id reached the canvas |
| British "per cent" | Patrol | caught: money token |
| a composer sentence paraphrased | Main | caught: no artboard quotes it verbatim |
| the lens-body marker removed | Patrol | caught: board not checked at all |

`violate.mjs` is in this folder so the run is reproducible rather than remembered.

## Conventions honoured

Nobody is named on any board. Fixture data is badged as fixture on the page and the fixture
place vocabulary announces itself in the data. The proving panel names its own pack in the panel
head, in the basis and in the provenance foot. Absent, zero and unmeasured stay apart, the
matrix adds a fourth state rather than collapsing it, and `ungranted`, `granted-empty` and "not
built" are drawn as three sentences rather than one word. Tiles on an unread region render a
WORD and never a zero. There is no figure of money anywhere on this lens. The word "twin"
appears nowhere: externally this is the record, the asset, current state. "Percent" is the only
spelling used, because the product's money gate refuses the standalone word `cent`.

## Raised, not settled

**The shared operator namespace.** Fleet and Police mint `OPR-01` independently and nothing says
whether it is one person. Needs an operator ruling: one namespace with a shared declaration, or
two namespaces with distinguishable prefixes. Not a redraw.

**Naming the vendor on a lens panel is a change.** The shipped panel chips say "Camera output
contract" and "Telemetry output contract" and name no vendor; vendors are named on Connections.
The blocked cards and the provenance foot name them, because a member of staff looking at their
own empty page needs to know whose credential is missing. This needs an operator ruling before
build.

**The region switcher is a change.** See the design argument above.

**Dropping `Placement` from the device table is a change.** Placement belongs to the site: the
domain derives sites once so a site's placement is stable across every camera mounted on it, and
the shipped table repeats it on all eighteen device rows. The design carries it five times, once
per site.

**The product has no state word for a declined class.** The seam's four statuses and the fifth
not-registered state are all about sources. A sixth state, for something a source offers and the
product refuses, does not exist and the design draws it in the restricted tone without inventing
a word for it. Raised rather than invented.

**`granted-empty` is unreachable on this lens.** Either the fixture plans grow a zero-record
arm on some pack, or the lens's own proof that it can tell three sentences apart rests on a
state it cannot currently produce. A product-line call, not a design one.

## Carved out, deliberately

Fleet: designed in parallel by lane `g145c-fleet-lens`, and not drawn here. The one place Fleet
is named is the operator-namespace collision, which is a fact about Police's own reference scheme
and would be an absence with no basis if it were left out.

The live-read mode of either region: it needs a vendor read, and drawing rows we have not read
would be fabrication. No live probe was run and no credential was used by this lane.

The incident log and the regional operations map: not registered regions, so they are named and
not drawn.

## Unestablished

Whether Spireon answers **today** is UNESTABLISHED. The 2026-09-03 reading recorded in
`src/vendor-live.mjs` is the only evidence in the repository and is badged as recorded, with its
date, on the board. No live probe was run and no credential was used by this lane.

Whether a Verkada credential exists anywhere outside the three GCP projects OPS-17 G-139
examined is UNESTABLISHED. The board says no secret exists in those three and says who examined
them; it does not claim the vendor has never been contacted.

Whether the seven stale `SHELL_HOMES` dispositions have been routed anywhere that will act on
them is UNESTABLISHED. `src/lens-claims.test.mjs` records that they were routed; this lane did
not find the destination.
