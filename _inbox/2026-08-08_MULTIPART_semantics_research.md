---
title: "Multi-part parcel geometry — the four semantics questions, researched"
date: 2026-08-08
status: research-report
repo: doc_repo
author: domain-researcher (read-only)
related: [_decisions/2026-08-08_multipolygon_fail_closed_and_the_real_fix, _inbox/2026-08-08_DEFECT_multipolygon_truncation]
---

# Multi-part parcel geometry: the four semantics questions

Research answering the four questions the decision record at `_decisions/2026-08-08_multipolygon_fail_closed_and_the_real_fix.md` flags as "decide with a cited source, do not invent." Read-only throughout. No writes to any database, no commits, no file changes outside this deliverable.

Two evidence bases are used. First, the code corpus we already hold: `P:\hauska-engine\services\retrieval-api\corpus\snapshot.json`, 23,257 `code-section` atoms across 41 Texas jurisdictions including Bastrop, Bastrop County, Elgin, and Smithville. Second, live read-only SQL against `txgio_parcel` in the `legacy-design-tools-prod` deployment Neon (credential per `90_runbooks/factory_onboarding_runbook.md` line 22, `DEPLOYMENT_DATABASE_URL`). Public sources are cited by URL where the corpus does not answer.

The headline is that the data characterization changes the shape of the answer more than the legal research does. Read the data section before acting on the four rulings.

---

## Question 1 — Does an interior ring (a hole) generate its own setback?

The question. A parcel with a hole: an excluded inholding, a right-of-way, a carved-out tract. Is the buildable area (exterior inset inward) MINUS (hole dilated outward), or is the hole simply excluded with no setback of its own?

### Findings

The dispositive move is that no Texas code in the corpus contains the words "interior ring," "hole," or any concept of a parcel boundary that is not a lot line. Codes define a lot line once, as the thing that bounds the lot, and then require setbacks from lot lines. Under every definition found, a hole boundary is a lot line, because it is a boundary that demarcates the lot.

Bastrop is the cleanest case because its definition is purely geometric and carries no exterior/interior qualifier at all. From the B3 Code (April 2025) section 10.1.002 DEFINITIONS, held in our corpus at `bastrop_tx/bastrop-b3-code-april-2025/10-1-002`, source `https://www.cityofbastrop.org/upload/page/0107/docs/B3/B3%20Code%20-%20April%202025.pdf`:

> Lot Line shall mean the boundary that legally and geometrically demarcates a Lot.

And in the same section:

> Setback shall mean the area of a Lot measured from the Lot Line to a Building Facade or Elevation that is maintained clear of permanent Structures, with the exception of encroachments listed in this Code.

Read together: setback is measured from "the Lot Line," and "the Lot Line" is whatever boundary geometrically demarcates the Lot. A donut parcel's inner boundary demarcates the Lot exactly as its outer boundary does. Bastrop's own text gives no basis for treating the inner boundary as exempt.

Elgin is more explicit and points the same direction. Elgin Code of Ordinances section 36-3 Definitions, corpus id `elgin_tx/elgin-code-of-ordinances-current-supplement/36-3`:

> Lot line means a line of record bounding a lot which divides one lot from another lot or from a public or private street, right-of-way or any other public space.

This definition is functional rather than positional. It asks what the line separates, not where the line sits. A hole in a parcel is, in the overwhelming majority of real cases (see the data section: 120 of 120 Bastrop holes tested contain another parcel), exactly "a line of record bounding a lot which divides one lot from another lot." Elgin's definition captures interior boundaries by its own terms.

Smithville, corpus id `smithville_tx/smithville-code-of-ordinances-ecode360/6-1`, defines yards by reference to lot lines without qualifying interior versus exterior:

> A yard between the building and the side line of the lot and extending from the front lot line to the rear lot line and the outside wall of the side of the main building.

Hutto is the one code in the corpus that names an interior lot line as a distinct category, and it is worth quoting because it cuts the other way from what "interior" suggests to a geometer. Hutto UDC March 2024 section 10.202.2, corpus id `hutto_tx/hutto-udc-march-2024/10-202-2`:

> Lot line : recorded boundary line defining a lot or parcel.
> Lot line, interior : lot line not abutting a street.

Hutto's "interior lot line" means a lot line that does not touch a street. It is a frontage concept, not a topology concept. It does not mean the inner ring of a donut. This is a naming collision the build must not fall into: in zoning vocabulary "interior lot line" already means something, and it is not "hole." Flagging this per the standing instruction on naming inconsistencies. Do not name the multi-part code's hole rings "interior lot lines."

Several codes require setback from every property line without qualification, which reinforces the reading. Georgetown UDC section 16.02, corpus id `georgetown_tx/georgetown-unified-development-code-current-supplement/16-02`:

> Setback. A measurable distance, dictated by zoning district, from any property line to an invisible parallel plane, within which certain buildings and structures are prohibited.

"Any property line," with no exterior qualifier. Similarly Dripping Springs section 30.04.009 requires wind energy setbacks measured "from any property line or structure ... the shortest possible distance in a straight line from the wind energy system to the closest point of a property line, easement, utility line or structure" (corpus id `dripping_springs_tx/dripping-springs-development-regulations-current-supplement/30-04-009`). Shortest distance to the closest point of a property line is a formulation that is indifferent to whether the property line is an outer or inner ring.

The general-practice framing is consistent. "Setback" means the minimum required distance between a structure and a specified line such as a lot, easement or buffer line that is required to remain free of structures (https://ecode360.com/39241208, City of Wichita Falls TX section 4200 SETBACK). The controlling variable is the presence of a boundary, not its handedness.

Honest absence: no Texas code in the corpus, and none found in public search, addresses the donut case explicitly. There is no cited text saying "a hole generates a setback" and none saying "a hole does not." The answer is derived from the definitions, which is the strongest available authority but is derivation, not quotation.

### RECOMMENDED ANSWER

Holes generate setbacks. Buildable area is (exterior inset inward) MINUS (each hole dilated outward), using the same side-appropriate setback distance that would apply to that boundary's role.

The reasoning is that under every lot-line definition in the corpus a hole boundary is a lot line, and setbacks run from lot lines. The alternative reading requires inventing an exemption no code grants.

The practical case seals it. In the 120 Bastrop holes tested, every one contains another parcel. A hole is a neighbor's property. Not setting back from it means permitting a structure built to the boundary of somebody else's land, which is the precise harm side and rear setbacks exist to prevent. Choosing "no setback on holes" would produce a buildable envelope that touches a neighboring parcel line, and would be wrong in the direction that matters, over-permissive rather than conservative.

Which setback value applies to a hole boundary is a second-order question and should follow the same edge-labeling machinery as exterior edges: if the hole boundary abuts a road (a right-of-way carved through a tract), it is a front or street-side condition; otherwise it defaults to the side or rear value. Where the labeling is ambiguous, apply the most restrictive applicable setback, consistent with the existing fail-conservative posture. Do not invent a "hole setback" value.

**Confidence: MEDIUM-HIGH.** The definitional chain is clean, held in our own corpus, and points one way with no contrary text found. It is downgraded from HIGH only because it is derived from definitions rather than quoted from a provision that addresses donut parcels directly, and because no such provision appears to exist in Texas municipal codes.

**Status: SETTLED by derivation, with a jurisdiction-varying second-order (which setback value) that should be handled by existing edge labeling.**

---

## Question 2 — Which part fronts the street when parts are non-contiguous?

The question. When a parcel has multiple disjoint parts, which part fronts the street, and does each part get its own front, side, and rear determination? Our engine determines the front edge by road adjacency plus situs-street token match in `labelEdgesFromRoads` (`P:\hauska-engine\packages\engine-core\src\depth-warm\edgeLabeling.ts`, front-selection logic at lines 476-650, `FrontRoleBasis = "situs-street-match" | "adjacency-heuristic"` at line 76).

### Findings

This is the question where the corpus returns the strongest honest absence. A regex sweep across all 23,257 code-section atoms for lot boundaries divided or bisected by a street, road, right-of-way, alley, creek, waterway, or railroad returned **zero matches**. Texas municipal codes in our corpus do not contemplate a single lot being split by a street. The reason they do not is structural: they define lots such that the case cannot arise.

Frontage is defined against the lot, not against a part. Elgin section 36-3:

> Frontage means the width of a lot or parcel abutting a public right-of-way measured at the property line.

Identical text appears in Leander (`leander_tx/leander-code-of-ordinances-current-supplement/ch10sure-exhibit-asuor-artige/1`), which is a shared Central Texas drafting lineage. Bastrop's frontage concept is likewise whole-lot and is tied to the building, not to a geometric part. B3 Code 10.1.002:

> Principal Frontage shall mean the Private Frontage designed to bear the address and Principal Entrance(s) of a Building.

Note what Bastrop keys on: the address and the principal entrance. That is a building-scale determination, not a parcel-part determination, and it is exactly what our situs-street-match already approximates. Bastrop also uses frontage to define lot width, 10.1.002: "Lot Width shall mean the length of the Principal Frontage Line of a Lot." One lot, one Principal Frontage Line. Singular.

The deeper finding is that Texas codes treat a street as a lot-terminating boundary rather than something a lot passes through. Elgin section 36-3 again:

> Contiguous means adjacent property whose property lines are shared or are separated by only an access strip, street, alley, easement, or right-of-way.

The existence of this definition is the tell. Elgin needed a special word to describe land on both sides of a street precisely because such land is not one lot by default. "Contiguous" is defined to reach across a street for specific regulatory purposes; the default is that a street separates. Near-identical text appears in Leander (both ch10 and ch14), Manor (`manor_tx/manor-development-regulations-current-supplement/coor-ch10sure-exhibit-asuor-artige/1` and `14.01.008`), Converse (`converse_tx/converse-development-regulations-current-supplement/48-19`), and Pharr (`pharr_tx/pharr-development-regulations-current-supplement/134-31`). Austin makes the same move for one district type at section 25-3-3, corpus id `austin_tx/austin-land-development-code-current-supplement/25-3-3`:

> A traditional neighborhood district consists of an area of not less than 40 contiguous acres and not more than 250 contiguous acres. In this chapter, property is considered contiguous even if separated by a public roadway.

"In this chapter" is a scoped override. Austin had to say it because outside that chapter it is not true.

The platting practice is aligned. Subdivision ordinances generally require that where land is separated into portions by a street, highway, other public way, railroad, public utility or flood control right-of-way, each separate portion is subdivided and shown as a separate parcel (general subdivision practice, see for example https://zoning.lacity.gov/browse/11 Article 11 Division of Land, and the same convention in https://charlotteudo.org/articles/part-x-subdivision-streets-other-infrastructure/article-30-subdivision). This is not Texas-specific authority and is cited as convention, not law.

Converse section 40-68, corpus id `converse_tx/converse-development-regulations-current-supplement/40-68`, applies this at the plat-mechanics level:

> A number to identify each lot or site and each block. Separate block and lot numbers will be assigned for each area separated by streets or subdivision units.

Separate block and lot numbers for each area separated by streets. That is the platting system declaring that street-separated areas are different lots.

### RECOMMENDED ANSWER

Each part gets its own independent front, side, and rear determination. Run `labelEdgesFromRoads` per part, not once per parcel.

The zoning logic is that a street-separated part is, in code terms, its own lot, and every lot gets its own frontage. Applying one parcel-level front role across disjoint parts would assert a frontage relationship the codes do not recognize and would produce a wrong answer for any part that does not touch the situs street at all.

Two implementation consequences follow, and both matter more than the ruling itself.

First, the situs-street match must degrade honestly per part. The situs address describes one location. In a two-part parcel split by a road, typically only one part actually fronts the situs street; the other fronts something else or nothing. Applying `frontBasis = "situs-street-match"` to a part whose edges do not touch the situs street would be exactly the wrong-street frontage failure that the R30 fail-closed rule at `edgeLabeling.ts:583-601` was built to prevent. Each part must be evaluated for situs match on its own edges, and a part with no situs match falls back to `adjacency-heuristic` or declines, per part.

Second, parts with no road adjacency at all must decline rather than guess. A landlocked part is a real and common outcome (the sliver and remnant modes in the data section). It has no frontage, therefore no front-setback determination, and the honest output is a named per-part decline, not a fabricated orientation.

**Confidence: MEDIUM.** The direction is well supported by the contiguous definitions, the Converse platting rule, and the total absence of any lot-divided-by-street provision across 23,257 sections. It is not HIGH because the support is inferential: no Texas code found says "each part of a non-contiguous parcel receives its own frontage determination." The codes achieve the result by never letting the situation exist, which is a strong signal about intent but is not a direct instruction to a geometry engine that has already been handed the situation.

**Status: SETTLED in direction (per-part), UNRESOLVED in the codes' own words. The codes solve this by definition rather than by rule.**

---

## Question 3 — Buildable-area reporting for non-contiguous parts: one number or per part?

The question. The decision record correctly frames this as honesty, not display: a single summed number implies contiguous buildable area that may not exist. You cannot build one 5,000 sq ft structure across two parts separated by a road.

### Findings

This is the one question with direct, quotable Texas authority, and it is unambiguous.

Leon Valley, corpus id `leon_valley_tx/leon-valley-development-regulations-current-supplement/10-02-251`:

> (E) Buildings shall not be constructed across lot lines.

And in the same city's zoning regulations, section 15.02.305, corpus id `leon_valley_tx/leon-valley-development-regulations-current-supplement/15-02-305`:

> Every building hereafter erected shall be located on a lot as herein defined and in no case shall there be more than one main structure/building on a lot in the "R-1", "R-2" or "B-1" districts, or as otherwise provided herein, and in no case shall any building be hereafter erected on more than one lot.

New Braunfels, section 144-3.2, corpus id `new_braunfels_tx/new-braunfels-development-regulations-current-supplement/144-3-2`:

> Every building hereafter erected shall be located on a lot as herein described. Buildings shall not cross lot lines.

El Paso, section 20.10.010, corpus id `el_paso_tx/el-paso-coo-title-20-zoning-current-supplement/20-10-010`:

> Lot Required. Every building hereafter erected, altered, expanded, placed, converted, or otherwise located shall be on a lot or lots, and in no case shall there be more than one main building on one lot unless otherwise provided in this title.

Rollingwood, section 107-31, corpus id `rollingwood_tx/rollingwood-land-development-code-current-supplement/107-31`:

> Each building or structure hereafter constructed in the city shall be located on a lot. No more than one main building shall be located on a lot except as provided in this article.

Converse, section 50-4, corpus id `converse_tx/converse-development-regulations-current-supplement/50-4`:

> Every building hereafter erected or structurally altered shall be located on a lot as defined in this chapter, and, except as hereinafter provided, there shall not be more than one main building on one lot. ... Side yard areas for a building shall not be included as a part of the required areas for any other building.

That last clause is a direct statement of the non-aggregation principle: required area for one building may not be counted toward another. El Paso section 20.12.040 makes the containment point explicitly, corpus id `el_paso_tx/el-paso-coo-title-20-zoning-current-supplement/20-12-040`:

> More than one principal building may be located on a lot in the following instances, however, the provision of these exceptions shall not be construed to allow any building to be constructed outside the buildable area of the lot

Even where multiple buildings are allowed, each must sit inside the buildable area. Buildable area is a containment region, not a budget.

Note that these citations answer the question from the strong side. They establish that a building cannot span a lot line. Combined with the Question 2 finding that a street-separated part is functionally its own lot, they establish that a building cannot span the gap between parts. No authority was found that treats disjoint parts as one buildable unit for structure-placement purposes. Searches for any such treatment in code, appraisal practice, or platting convention returned nothing supporting aggregation.

A note on where aggregation is legitimate, because the distinction matters for the API design. Aggregate area is the correct unit for density, lot-area minimums, impervious cover, and floor-area ratio, which are all ratio computations against total site area. Bastrop's own standards are stated this way, for example "MINIMUM LOT SIZE 1 acres" in B3 6.5.003 (corpus id `bastrop_tx/bastrop-b3-code-april-2025/6-5-003`), which is a total-area test. Aggregate area is the wrong unit for the question "what can I build here," which is a containment question. The engine currently answers a containment question, so it must not report a summed containment number.

### RECOMMENDED ANSWER

Report per part, always. The primary buildable-area figure must be per-part, and the largest single contiguous buildable region should be the headline number, because that is the number that answers the question a user is actually asking.

A total may be reported alongside, but only if it is explicitly labeled as a non-contiguous sum and never presented as the buildable area. The safest shape is a per-part array plus an explicit `largestContiguousBuildableArea` field, with any total named something that cannot be mistaken for a footprint capacity, for example `sumOfPartAreas` with a `contiguous: false` flag.

The decision record's framing is correct and the research confirms it with quotable authority: a summed number would assert that a structure of that footprint can be placed, and Leon Valley, New Braunfels, El Paso, Rollingwood, and Converse each independently forbid the structure that assertion implies.

**Confidence: HIGH.** Five independent Texas municipal codes in our own held corpus state the no-building-across-lot-lines rule directly, one of them ("in no case shall any building be hereafter erected on more than one lot") in terms that leave no room. No contrary authority found.

**Status: SETTLED.**

---

## Question 4 — Are non-contiguous parts one parcel at all?

The question. Parts share a prop_id in the CAD roll. Should the data model treat them as one parcel node with multi-part geometry, or as related nodes?

### Findings

The statutory answer is that a Texas appraisal record is an accounting construct that the property owner can reshape on request, and it carries no guarantee of physical contiguity in either direction.

Texas Tax Code section 25.02, Form and Content, subsection (d) (https://codes.findlaw.com/tx/tax-code/tax-sect-25-02/, chapter text at https://statutes.capitol.texas.gov/Docs/TX/htm/TX.25.htm) provides that on the written request of a property owner the chief appraiser shall combine contiguous parcels or tracts of the owner's real property into a single appraisal record, and on written request shall separate identifiable segments of the owner's parcel or tract into individual appraisal records. The request must be made before January 1 of the tax year and must contain a legal description sufficient to describe the property. The same section provides that combining or separating in this way does not affect the application of generally accepted appraisal methods and techniques, including for real property that is part of the same economic unit as property in another appraisal record.

Three consequences for our data model follow directly from that text.

One appraisal record can cover multiple tracts, at the owner's election. The unit of the roll is an account, and section 25.02 requires the record to carry "a unique account number" among its identifying fields. It is an accounting identifier, not a geometric one.

The statute's combination power is limited to *contiguous* parcels. That is the statutory word. So a single account spanning genuinely non-contiguous land is not created by 25.02 combination; it arises some other way, most commonly because the underlying deed or survey tract itself is what the CAD is describing, or because a road right-of-way was carved out of a tract that the CAD continues to carry as one account.

Section 25.02's closing clause is the strongest signal for our design. It says the combination or separation "does not affect the application of generally accepted appraisal methods and techniques," expressly including property "that is part of the same economic unit as real property contained in the same or another appraisal record." The statute is telling appraisers that the record boundary is not the analytical boundary. The economic unit and the appraisal record are different things and the statute expects them to diverge. If the Tax Code itself declines to treat the account as the unit of analysis, we should not treat prop_id as the unit of geometry.

The provenance of our data reinforces this. TxGIO StratMap land parcel data is created by county appraisal districts or their third-party vendors and translated into a statewide standardized schema, distributed as shapefile and geodatabase (https://geographic.texas.gov/stratmap/land-parcels, https://www.arcgis.com/home/item.html?id=3b262ce74a864836972188fca772ca48). The relevant technical fact is the shapefile format: shapefiles have no native multipart-versus-multiple-feature distinction that survives schema translation reliably, and the same real-world situation is represented sometimes as one multipart feature and sometimes as several single-part features carrying the same prop_id. Our own store shows both, which is proven in the data section below.

The zoning-side answer, from Question 2, is that street-separated land is not one lot. Converse section 40-68 requires "separate block and lot numbers ... for each area separated by streets." So the CAD account and the zoning lot are already different units, and prop_id tracks the former.

### RECOMMENDED ANSWER

Model parts as related nodes under a shared account identity, not as one parcel node carrying multi-part geometry. Concretely: keep `prop_id` as an account-level grouping key, and make the unit that carries geometry, setbacks, frontage, and buildable area a part-level node keyed by something stable and coordinate-derived rather than index-derived (per Geometry Law rule 7, coordinate-keyed not index-keyed).

Three reasons, in order of weight.

The zoning unit is the part, not the account. Everything the engine computes (setbacks, front and rear labeling, buildable containment) is defined by codes against a lot. Question 2 establishes that a street-separated part is functionally its own lot and Question 3 establishes that a building cannot span parts. If the computed products are per-part, the node that owns those products should be per-part. One node holding an array of incompatible answers is the shape that produced the original defect.

The Tax Code declines to make the account the analytical unit. Section 25.02's own text separates the appraisal record from the economic unit, and its combination power is limited to contiguous land. Building our geometry model on prop_id would import an accounting boundary into a geometric domain that the statute itself says does not follow it.

The data will not support prop_id as a key regardless. This is the finding that removes the choice: prop_id is not unique in our store. See the data section. Bastrop 48021 carries 74,729 rows against 62,257 distinct prop_ids; Tarrant 48439 carries 799,524 rows against 689,838 distinct prop_ids. A single prop_id in Tarrant maps to as many as 495 distinct features. Any model that assumes one prop_id equals one parcel node is already broken on ingested data, independent of the multi-part question.

The account-level rollup still has a job. Density, minimum lot size, impervious cover, and FAR are total-area tests and belong at the account level. So the model is two-level: an account node carrying aggregate-area facts and ownership, and part nodes carrying geometry and every containment-derived product. That is additive to the existing node/edge work rather than in tension with it.

**Confidence: MEDIUM-HIGH for the recommendation, HIGH for the underlying facts.** The prop_id non-uniqueness and the 25.02 text are both verified directly and are not in doubt. The modeling call is a judgment built on them, and it intersects the node/edge data model work, so it warrants operator confirmation before the build commits to it.

**Status: The facts are SETTLED. The modeling call needs an OPERATOR RULING (see final section).**

---

## Data characterization: what actually produces multi-part geometry in our store

All queries read-only against `txgio_parcel`, `legacy-design-tools-prod` Neon, 2026-08-08. The table has no PostGIS (geometry is `jsonb`), so all areas below are bbox-rectangle proxies computed in SQL from ring coordinate extents with a latitude-corrected degree-to-metre conversion. Bbox area overstates irregular shapes, so absolute areas are upper bounds; the ratios and mode splits are robust because the same bias applies to both sides of each comparison.

This section is the most decision-relevant part of the report, because the decision record's spec assumed a distribution that the data only partly supports.

### The two shapes are not equally common, and they differ by county

| county | MultiPolygon | Polygon with holes | total rows |
|---|---|---|---|
| 48453 Travis | 6,009 | 3,253 | 894,657 |
| 48439 Tarrant | 4,519 | 1,859 | 799,524 |
| 48187 Guadalupe | 223 | 3,345 | 106,508 |
| 48251 Johnson | 538 | 2,452 | 113,686 |
| 48029 Bexar | 345 | 2,458 | 747,206 |
| 48491 Williamson | 87 | 2,499 | 304,298 |
| 48021 Bastrop | 5 | 846 | 74,729 |

Bastrop's profile is holes, not multi-part: 846 holed parcels (1.13 percent) against 5 MultiPolygon (0.007 percent). The defect report and decision record both lead with the MultiPolygon number and note Bastrop at 0.007 percent, which is accurate but understates Bastrop's exposure by a factor of 169. **For the county we have actually certified, the interior-ring case is the one that matters, and it is the case the decision record's spec treats as the simpler half.** Recommend the build sequence lead with holes rather than with disjoint parts.

Part and ring counts statewide. MultiPolygon: 14,744 rows at 2 parts, 1,734 at 3, 559 at 4, then a long tail including 396 rows at 51 parts and 4 at 54. Polygon with holes: 18,637 at 2 rings (one hole), 2,525 at 3, 467 at 4, tailing past 26. The tail is real and the build must not assume 2.

### Multi-part geometry is mostly genuine, not artifact

Taxonomy over a 3,000-row ordered sample of all statewide MultiPolygon rows, resolving to 1,725 parcels after part aggregation. "Substantive part" means a part whose bbox area is at least 100 square metres; gap is the maximum inter-part centroid distance.

| mode | parcels | share |
|---|---|---|
| Only one substantive part (rest are slivers) | 249 | 14.4 percent |
| Multiple substantive parts, gap under 60 m | 263 | 15.2 percent |
| Multiple substantive parts, gap 60-400 m (road scale) | 750 | 43.5 percent |
| Multiple substantive parts, gap over 400 m | 463 | 26.8 percent |

**85.6 percent of multi-part parcels have two or more substantive parts.** This is the answer to the question the task framed as mattering enormously: it is not mostly digitizing artifact. Truncation to the first part is discarding real land in roughly six of every seven multi-part parcels.

The single largest mode, 43.5 percent, is the road-scale gap of 60 to 400 metres, which is consistent with road or waterway bisection of one tract and is the case the task hypothesized would make the semantics simple. But 26.8 percent sit more than 400 metres apart, which is too far for a road bisection and indicates genuinely separate holdings under one account. So the simple case is a plurality, not a majority, and the model must handle genuine disjoint ownership. This is the empirical justification for the Question 4 recommendation.

Slivers are nonetheless a real 14.4 percent and they are extreme. In a 400-parcel two-to-six-part sample, 122 of 257 parcels had a smallest part under 10 square metres and 136 had a smallest part under 1 percent of the largest. Concrete examples, all `48085` Collin, 2-part, with the small part's bbox area rounding to 0.00 square metres and its ring carrying only 4 points (a degenerate quadrilateral, i.e. a zero-width sliver):

```
county | prop_id | situs                     | big_m2   | small_m2 | minpts | gap_m
48085  | 2697641 | (none)                    | 63.7     | 0.00     | 4      | 8.7
48085  | 1018730 | (none)                    | 96745.9  | 0.00     | 4      | 136.9
48085  | 131574  | 4016 ANGELINA DR, PLANO   | 858.6    | 0.00     | 4      | 19.3
48085  | 2121013 | 14550 N STATE HWY 78      | 199532.0 | 0.01     | 4      | 379.6
```

Contrast with the genuine-disjoint end of the same sample, `48439` Tarrant, where both parts are large and richly digitized:

```
county | prop_id  | situs                | big_m2    | small_m2  | minpts | gap_m
48439  | A 187-1  | 7410 LAKESIDE DR     | 2950493.3 | 1708935.2 | 92     | 315.5
48439  | A1113-1  | 1701 W 17TH ST       | 1207645.4 |  789974.2 | 453    | 181.0
48439  | 47530--1 | 5500 RANDOL MILL RD  | 1277616.6 |  708647.6 | 206    | 831.8
48439  | A1725-1  | SILVER CREEK RD      | 1725981.2 |  644527.8 | 277    | 541.3
```

The discriminator is clean and available before any expensive computation: part bbox area combined with ring point count. Recommend the build carry an explicit, configured sliver threshold (a part under some small absolute area AND under some small fraction of the largest part), drop such parts from geometric computation, and **record the drop as a named, countable signal** rather than silently ignoring it. Silently dropping slivers would reintroduce the exact defect class this whole workstream exists to remove: a truncation that no gate can see.

### Holes are real, and they are inholdings

Taxonomy over a 3,000-row ordered sample of statewide Polygon-with-holes rows, resolving to 1,677 parcels. Average 3.18 holes per holed parcel; average hole area 12.21 percent of exterior area.

| hole class | parcels | share |
|---|---|---|
| Largest hole under 1 m2 (degenerate) | 11 | 0.7 percent |
| Largest hole 1-100 m2 | 509 | 30.4 percent |
| Real hole, all holes under 5 percent of parcel | 567 | 33.8 percent |
| Holes 5 percent or more of parcel | 592 | 35.3 percent |

Degenerate holes are negligible at 0.7 percent. Over a third of holed parcels have holes consuming 5 percent or more of the parcel. Dropping holes therefore overstates usable area materially and systematically.

Bastrop 48021 specifically, 190 holed parcels sampled: zero degenerate holes, average 2.30 holes per parcel, average hole area 4.92 percent of exterior, 56 parcels (29.5 percent) with holes at 5 percent or more, 4 at 25 percent or more.

The inholding test is the decisive one for Question 1. For 120 Bastrop hole rings, I checked whether any *other* parcel in the store has a bounding box contained within that hole's bounding box (with a small tolerance). Result: **120 of 120 holes contain at least one other parcel.** Bastrop's holes are not water bodies, not digitizing voids, and not easement artifacts. They are excluded neighboring properties. That is the strongest possible support for treating a hole boundary as a lot line that generates a setback.

### prop_id is not unique, and there are two separate causes

This was not in scope but is the most consequential finding for the data model.

| county | rows | distinct prop_id | excess rows |
|---|---|---|---|
| 48021 Bastrop | 74,729 | 62,257 | 12,472 |
| 48085 Collin | 408,681 | 387,334 | 21,347 |
| 48439 Tarrant | 799,524 | 689,838 | 109,686 |
| 48453 Travis | 894,657 | 380,918 | 513,739 |

Travis is the alarming one: 894,657 rows against 380,918 distinct prop_ids, a 2.35x ratio.

Decomposing the duplication into its two causes:

| county | prop_ids with >1 row | pure tile duplication (one feature, many tiles) | genuine multi-feature prop_id | max distinct features |
|---|---|---|---|---|
| 48021 Bastrop | 9,342 | 8,661 (92.7 percent) | 681 | 138 |
| 48439 Tarrant | 56,072 | 27,407 (48.9 percent) | 28,665 | 495 |

**Cause one is a tiling artifact of our own ingest.** The primary key is `(county_fips, tile_key, feature_index)`, and a feature whose geometry straddles a tile boundary is stored once per tile it touches, with the *same* `feature_index` and identical bbox. Verified directly: Tarrant `A 36-1` returns rows with feature_index 17204 repeated across four distinct tile_keys, all carrying identical `west_lng`/`south_lat`. This is a de-duplication concern in our pipeline, not a property fact, and it accounts for 92.7 percent of Bastrop's duplication. Any query that counts parcels by joining on prop_id without de-duplicating on `(tile_key, feature_index)` is overcounting. Worth checking whether any published corpus or coverage number is affected; I did not trace that.

**Cause two is genuine and is the CAD's own doing.** Tarrant has 28,665 prop_ids mapping to more than one distinct feature. Tarrant `A 36-1` (situs `1500 E STATE HWY 114`, the DFW Airport area) carries 532 rows resolving to 111 distinct owner names and 94 distinct situs addresses under one prop_id. That is one land account with many leasehold or improvement interests on it, exactly the "condo/PUD common area" and leasehold pattern the task anticipated. It is not multipart geometry in the GeoJSON sense at all; it is many features sharing an account number, which the current `TxgioDatabaseParcelGeometryResolver.resolve()` "most recent ingested_at" lookup would silently reduce to one arbitrary feature. **This is a third, previously unreported instance of the same silent-truncation defect class, at the row-selection layer rather than the ring layer.** It is not covered by the engine #278 fail-closed fix, which inspects geometry shape after a single row has already been chosen.

For 300 genuine multi-feature Bastrop prop_ids: average 2.90 features, 92 stacked within 5 m of each other (likely condo or improvement stacking), 158 within 5-400 m, 50 more than 400 m apart, and 93 carrying more than one distinct owner name.

### Summary of the characterization

Multi-part geometry in our store is predominantly genuine, not artifactual. Road-scale bisection is the largest single mode at 43.5 percent but is a plurality, not a majority; over a quarter of cases are genuinely disjoint holdings at more than 400 m separation. Holes are almost entirely real, are large enough to matter in a third of cases, and in Bastrop are inholdings containing other parcels 120 times out of 120. The semantics are therefore *not* simple, and the Question 4 answer cannot lean on prop_id, which is non-unique in the store from two independent causes.

---

## WHAT I COULD NOT DETERMINE

**No Texas code text addressing donut parcels directly.** Question 1's answer is derived from lot-line and setback definitions rather than quoted from a provision that contemplates an interior ring. I searched the corpus for interior ring, hole, donut, enclave, inholding, and outparcel language and for setback-from-all-property-lines formulations. The derivation is clean and one-directional but it is derivation. If a higher bar is needed, the route is a written interpretation from the Bastrop development services director, not more research.

**Which setback value applies to a hole boundary.** Whether a hole boundary takes the side value, the rear value, or a street value when the hole is a right-of-way is not addressed by any code found. My recommendation to route it through existing edge labeling and default to most-restrictive on ambiguity is a design proposal, not a cited answer.

**No Texas authority on frontage for a lot that is already split.** Question 2's answer rests on codes structurally preventing the case (via contiguous definitions and separate lot numbering) rather than on any rule for handling it. Zero matches across 23,257 sections for lot-divided-by-street language. I could not find a Texas municipal provision that tells an engine what to do once it is holding split geometry.

**Whether TxGIO's schema translation documents the multipart convention.** I confirmed StratMap is CAD-sourced, translated to a common schema, and distributed as shapefile/geodatabase, but I did not obtain the StratMap land parcel data dictionary itself. Whether TxGIO or its vendor has a documented rule for when a CAD's multiple tracts become one multipart feature versus several features is unanswered, and it would explain the county-to-county variation in the tables above.

**Why Travis 48453 has a 2.35x row-to-prop_id ratio.** I decomposed Bastrop and Tarrant into tile-duplication versus genuine multi-feature but did not run that decomposition for Travis, which is by far the most extreme county. Its cause could be different in kind.

**Whether the tile-duplication artifact has contaminated any published number.** I established that de-duplication on `(tile_key, feature_index)` is required for correct parcel counts and that 92.7 percent of Bastrop's prop_id duplication is this artifact. I did not audit whether the acreage-weighted measurement in `_inbox/2026-08-08_multipart_acreage_weighted_measurement.json`, the 5,535,897 statewide row count, or any coverage figure de-duplicates. If they do not, they are inflated. This should be checked before the 59.69 percent acreage figure is used again.

**Whether any already-warmed or promoted parcel is affected.** Out of scope here and still open from the original defect report.

**FEMA flood-layer multipart rates**, still unquantified from the original defect report's section 6.

---

## NEEDS AN OPERATOR RULING, NOT A RESEARCH ANSWER

1. **The Question 4 data-model call: part nodes versus one node with multi-part geometry.** Research supports part-level nodes and the facts behind it are verified, but this intersects the node/edge data model workstream and is an architecture decision with reach beyond this build. The research cannot make it.

2. **The sliver threshold values.** 14.4 percent of multi-part parcels have exactly one substantive part. Dropping slivers is clearly right; the specific cut (I would propose a part under 25 m2 absolute AND under 1 percent of the largest part, both conditions required) is a calibration choice with a false-negative cost on genuinely small legitimate parcels. Operator sets the number; the build records every drop as a countable signal either way.

3. **Build sequencing: holes first or disjoint parts first.** The data says Bastrop's exposure is 846 holed parcels against 5 multi-part, a 169x skew toward holes, while the statewide acreage argument that promoted this work to front-of-queue is driven by multi-part. Holes are also the structurally simpler half. Sequencing holes first would deliver Bastrop value sooner at the cost of deferring the acreage argument's own justification.

4. **Whether the non-unique prop_id finding opens its own lane.** The genuine multi-feature prop_id case (Tarrant `A 36-1`: 532 rows, 111 owners, one account) is a silent-truncation defect at the row-selection layer that engine #278 does not cover, because #278 inspects geometry shape only after `resolve()` has already picked one row. This is arguably a separate defect requiring its own fail-closed treatment, and arguably part of this build. It was found incidentally and has not been through adversarial review.

5. **Whether to re-verify the acreage-weighted measurement after de-duplication.** If the 59.69 percent figure was computed over rows rather than de-duplicated features, it is overstated by an unknown factor. The measurement is load-bearing: it is the stated basis on which the reversal criterion fired and multi-part support was promoted to front of queue. The conclusion likely survives (the record itself says "even halved, the conclusion is unchanged"), but the number should not be quoted again until checked.
