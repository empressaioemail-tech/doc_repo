---
date: 2026-08-19
agent: claude_code
repo: portfolio
session_type: execute
memory_graded: none
rolled_up: false
---

## What was done

A 21-item QA list against smartsite.cloud opened a two-day arc that ran eighteen lanes across four repos, shipped one deploy that closed a live public exposure, and produced the enforcement doctrine now filed as doc 61.

The QA list was the entry point, not the subject. Traced to source it was six product defects; chasing one of them (missing addresses) reached the measurement layer, and everything after that was about instruments rather than data.

## The original QA list, which is the thing to finish

Shipped and live on smartsite.cloud (deployed at hauska-map `51e6f95`, bundle `index-r7cV3_O3.js`): saved-property state and the black-box provenance text, the measure and shape tools, panel management, the location tool kept and grown, the vacant-parcel header, find-zoom plus subject markers, X-ray internal contradictions, the flood palette and legend, honest absence redesigned so it stops reading as an error, US-only search, the neighbour-report and wrong-DXF-target class, street labels over satellite, zoning colours, mobile sheet collapse, and the typeahead truncation.

Merged and NOT deployed (hauska-map `204789f`): the road-nodes toggle defaulted off and the RRC layer work (#172), and the Command Center three-layer console (#173). A hauska-map deploy is owed and is the cheapest remaining QA win.

Not fixed, and each now understood rather than merely open: the 705-versus-707 buildable divergence; setback numbers on the brief, where the absence turns out to be real (58.87% of zoned Bastrop parcels and 97.23% of Travis decline with a named reason); missing addresses, which are a different join per county; footprints on the site plan, genuinely unwritten in every metro; flood on the parcel card, now blocked behind the containment work; and exempt parcels, where the recommendation is a hatch rather than a colour.

## The governing finding

Every defect found across two substrates is one defect: a validity check that can be satisfied by a value carrying no meaning. A concatenated separator passing a non-null address test 1,248,412 times. A tile centroid that is a valid coordinate 227 metres from the parcel it answers for. A zoning cell carrying the envelope row's measurement. Presence-shaped predicates over meaning-shaped properties.

The methodological consequence, demonstrated independently by both substrates: every real finding surrendered to reading a write path and none to measuring data, because measuring applies the same predicates that admitted the defect.

## What was proven, with numbers

Situs "99.3% populated" counts sentinels; real street coverage is 89.90% of 13,071,975 parcels. Six of fourteen rails have never been scored anywhere, 42.9% of the grid, with 35,159,990 atom rows behind them. Nine of fourteen rails have no served slot at all; two of those are one adapter read from a customer. Twelve county writers exist against three scorer CLIs, which is why no recompute route ever existed. Bastrop's flagship 99.77% zoning number was a copy of its envelope row; the real figure is 79.60% on the correct denominator and the entire gap is one city, Smithville.

`tier2` flood was wrong in every one of 5,714 adjudicated cases, including 1,995 parcels told they sat outside a Special Flood Hazard Area whose centroid is inside one. It quantised the parcel centroid to a 0.005-degree tile and asked FEMA once at the tile centre.

No repository in the estate had branch protection. Every CI check across four repos was advisory.

## What shipped

cortex-api deployed at legacy-design-tools `1113c649`, verified in production: `tier2.flood` returns `null` with a typed `floodDisposition` refusal naming the retired producer, the date, the successor atom and the measured evidence. The live unauthenticated exposure is closed.

Getting there required fixing a boot crash. The scorer capability pulled a CLI into the route graph; the CLI's entrypoint guard was correct and defeated by bundling, because inside a single `dist/index.mjs` the guard's premise that a module retains its own identity is false. Four merges had shipped unbootable and nothing caught it, because no test started the process.

## Open questions carried forward

Whether the `resolved` lifecycle state gets enforced before any completeness instrument is trusted. How wide the visible product change is when consumers start reading the containment stamp. Whether the second-derivation state belongs per check or per error class, which two lanes independently argued belongs per error class.

## State at close

hauska-map `204789f` merged, deploy owed. hauska-engine `d3f3794` with #351 open. legacy-design-tools `1113c649` deployed, #440 open. Statewide fourteen-rail sweep finished: 254 counties, 13,729,941 parcels.
