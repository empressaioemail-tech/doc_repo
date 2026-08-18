---
decision_id: 2026-08-18_template_city_becomes_fixture_city
date: 2026-08-18
owner: nick
status: active
related_canonical:
  [
    30b_smartcity_design_system,
    30c_smartcity_platform_ia,
    _decisions/2026-08-17_shell_before_feeds,
    _decisions/2026-08-17_template_city_identity,
    _decisions/2026-08-17_dashboards_ui_then_one_feed,
    _inbox/2026-08-17_g18_shell_homes,
    _inbox/2026-08-17_g75_shell_mounts_motion,
  ]
---

# Decision

`template-city` becomes a **fixture city**: it carries synthetic records generated from the adapter output contracts, labelled as fixture at every surface, so the product demonstrates itself by default. A third pack, `empty-city`, keeps the honest-empty demonstration that `template-city` provides today.

A fixture record is not a feed, not a city's data, and not a claim. Swapping a real city in is a pack switch, not a data migration.

# Context

The design system generates its hierarchy from exceptions. 30b law 3 is "quiet on satisfied, loud on unresolved": Pass is gray, Uncertain carries the amber rail, Unchecked carries the hatch, and the unresolved row is the loudest object on the page. On a city with zero records there are no exceptions, so every pill on every screen renders quiet and the system's entire tension mechanism is switched off.

The consequence is that the shipped product cannot be evaluated. Operator read the serving build as flat. Part of that is a type-ramp defect with its own card, and part of it is structural: an empty city is the one condition under which this design is guaranteed to look flat.

The same emptiness blocks the build. Seven undrawn 30c surfaces are queue, matrix, register and record layouts. None can be designed, reviewed, or graded against zero rows.

# Structural commitment check

- Sell reasoning, not data: a fixture labelled fixture is honest. A fixture presented as a city's record would not be, which is what the labelling gate below exists to prevent.
- Tenant sovereignty: strengthened. Fixtures are generated from contracts, so no city's records are ever copied to make a demo.
- Cost per jurisdiction: helped. A pack switch replaces a bespoke demo per prospect.
- No privileged data: preserved. No staff name, work order, or live operation appears on any pack.

# Reasoning

The generator reads the **adapter output contracts**, not any city's data. Each adapter kind already declares a shape and a `writesTo` target. A generator that emits records in those shapes exercises every state the design defines while carrying no real city's content, and the shapes match when a real city is swapped in because both came from the same contract. Deriving fixtures from Bastrop's rows would have produced a better-looking demo and reintroduced exactly the identity collapse G-74 was written to close.

This is a real amendment to 30b law 5, "absence is stated, never simulated," and to the standing no-sample-rows invariant. The amendment is narrow: absence is still stated wherever a thing is genuinely absent, and `empty-city` exists so that the honest-empty screens stay demonstrable rather than becoming unreachable code. What changes is that `template-city` stops being the artifact that demonstrates absence.

Precedent for a labelled fixture already exists twice on the shipped product: the gold parcel `48021:34137` renders as "Demo fixture," and the Assets fixture record is reachable only behind an explicit fixture label with an amber badge. This extends an established pattern from one record to a pack.

The seam is already built. `city_packs` is keyed by `cityKey` and carries `accessPolicy`, `lenses`, `grantedAdapters` and `notes`; `template-city` and `fixture-city` both ship today; every surface resolves through `cityKey`. What is missing is a records dimension on the pack, not a new architecture.

# The three packs

| Pack | Access | Carries | Shows |
|---|---|---|---|
| `template-city` | public-free | Generated fixture records | The product working, every state exercised |
| `empty-city` | public-free | Nothing | Honest-empty, the unconnected city |
| A real city | tenant-private | That city's records through granted adapters | That city |

`fixture-city` keeps its current tenant-private role as the tenancy test subject and is not the demo.

# The labelling gate

A fixture pack is conformant only while all of these hold, and a test enforces each:

1. The environment badge reads Demo on any pack whose records are generated.
2. Every generated record is marked as fixture in the payload, not only in the chrome, so a record that escapes its surface still says what it is.
3. No generated record carries a real person's name, a real street address, a real parcel outside the established demo fixture range, or a real vendor account identifier.
4. No generated value is presented as money collected, a payment completed, or a confidence that was earned.
5. `empty-city` generates nothing, and the honest-empty screens stay reachable and tested.

# Reversal criteria

Reverse if a fixture record is ever read as a real city's record by anyone outside the building, if the generator starts seeding from a live city's rows, or if maintaining fixtures costs more than the demo is worth. Reverse also if a prospect city reads the fixture pack as a claim about their own data. On reversal `template-city` returns to honest-empty and `empty-city` is retired.

# Dependencies

Depends on the adapter contract (`_decisions/2026-08-17_g63_feed_adapter_contract.md`) for the output shapes. Does not depend on and does not start G-52. Does not fill G-24: city-owned asset records stay at zero, because Assets is the one surface whose emptiness is a ruling about the world rather than about this demo. Live Bastrop stays no-touch. L26 untouched.

# Counterparties

Internal: operator, planner, Lane B. External: every prospect city that sees the demo, which is why the labelling gate is mechanical rather than editorial.
