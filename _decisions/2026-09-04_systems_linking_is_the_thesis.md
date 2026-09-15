---
decision_id: 2026-09-04_systems_linking_is_the_thesis
date: 2026-09-04
owner: nick
status: active
related_canonical: [_decisions/2026-09-04_compass_rework_starts_parallel_to_plan_review, _inbox/2026-09-04_dashboards_map_architecture_scoping, 90_operations/OPS-17_govtech_stack_plan_of_record]
---

# Decision

The native property map (A-125) is real, dispatched, and left running — but is downgraded from "active priority" to a good later project. Right now, the higher-value work is making the systems already built (the 10 real G-116 domains on `smartcity-dashboards`, and `smart-files`) actually read from and link to each other, not adding a new visual surface. Smart Files real search — and real cross-system linking through the `smart_file_placements` mechanism that already exists in schema but isn't populated or read anywhere yet — is the concrete next scoping target.

## Operator's own words

"the most important work we can do is make these systems function together, that is the entire thesis (which is why i wanted smartsite map in here) but i think that will be a good later project still and first get all this linked together and reading properly."

## Reasoning

This retroactively explains the original SmartSite-map ask: it was never really about the map specifically, it was one instance of the platform's own stated thesis — "One record underneath, not four systems stitched together" (the Dashboards flyer's own line), "one screen" that "does not disagree with the last one" (Platform Overview flyer). A visually integrated map is a weaker instance of that thesis than actually making the real domain data and Smart Files reference each other, because the map (once built) still only shows geometry + zoning + permits — it doesn't make the *systems themselves* more connected the way real cross-linking would.

Concretely, Smart Files already has a `smart_file_placements` table modeling document↔target links (folder/parcel/project/asset/permit/meeting/instrument) — the DATA MODEL for "everything cross-references everything" already exists. What's unknown and being scoped now: whether it's populated for any real data today, and whether `smartcity-dashboards` reads it anywhere. If the answer to both is "no," the honest next step is making ONE real linkage work end to end before anything bigger.

## What this changes, concretely

1. The already-dispatched native-map agent (A-125) is left running — no reason to waste in-flight work — but its PR, once it lands, gets reviewed and held rather than rushed to merge/deploy. It is not blocking anything else.
2. A scoping-only research pass (not a build) was dispatched into: (a) what real content search in Smart Files would actually require (text extraction, indexing approach, a real query API, consistent with the existing access-control pattern), and (b) whether `smart_file_placements` is used by anyone today, on either side, and if not, the smallest real next step to make one linkage true.
3. Compass's own sequencing (`_decisions/2026-09-04_compass_rework_starts_parallel_to_plan_review.md`) is unaffected in principle — Smart Files context-awareness is still its named first target — but that target now visibly depends on this same search/linking work landing first, so the two lanes converge rather than run fully independently.

## Reversal criteria

Revisit if the Smart Files scoping pass comes back showing the "systems linking" work is itself large enough to need its own explicit sequencing decision against the map and Compass lanes, rather than simply being "the next thing."

## Dependencies

Depends on: the Smart Files research pass dispatched today (not yet returned).
Feeds: Compass's Smart Files context-awareness priority, and the general platform thesis of one connected record.
Does not reopen: the native map build itself, which stays in flight, just deprioritized for urgency.
