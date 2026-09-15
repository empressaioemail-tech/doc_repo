# MISSION — G-129: mount the Flood and Drainage study in the SmartCity platform

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

## Who this is for

**Sylvia Carrillo, city manager of Bastrop**, asked for this in her own words: *"I want to be
able to tell what happens when four inches of rain falls on a property."* Her stated value is
screening out sites that plainly do not need a drainage engineer — roughly ninety percent of that
spend. **A named deliverable to a real customer.**

Operator, 2026-09-14: *"we need the function in the smart city platform"* and *"usable across
departments."*

## What already exists — do not rebuild any of it

**The study.** `hauska-engine` `packages/engine-core/src/site-plan/` — a real D8 flow-accumulation
model producing flow paths, catchment swaths, drainage zones and ponding. Not a FEMA zone lookup.

**The rainfall control.** G-125 CLOSED 2026-09-14. `rainfallDepthInches` is live and verified at
two depths on a real Bastrop parcel against the deployed engine and the deployed Property Explorer
bundle.

**The service surface, already addressable by parcel:**

```
POST /api/pe-site-plan-export?report=flood-drainage                 run / refresh
GET  ...&action=study&parcelNodeId=...                              cached study
GET  ...&action=download&parcelNodeId=...&format=pdf-flood-drainage the PDF
```

**The renderer.** `hauska-map` `apps/property-explorer/src/browse/flood-map-overlay.ts`, MapLibre,
with a deliberate colour taxonomy.

## MOUNTED, NOT PORTED — the ruling that shapes this row

The PE overlay is **MapLibre**. The city map is **Leaflet**. Porting the renderer creates a second
implementation of one study that will drift, and deepens the island that
`_decisions/2026-06-18_map_engine_maplibre_cotality_national.md` already named.

**The platform consumes the service; it does not rebuild the renderer.** In G-128's dock (CLOSED,
serving) this is a **view mode of the map area in Full** — it takes the map region rather than
nesting a map inside a page that has one.

This needs an embed mode on the PE side (`hauska-map`). That is the real cost of the row and it is
the right cost.

## THE HONESTY PROPERTY — G-125 caught a live fabrication, do not reintroduce it

G-125's pre-registered falsifier fired on its first deploy. A 4-inch parameter-sourced run
returned `gradient.note = "Design storm 4 inch, 100-yr 24-hr"` — **fabricating a return period the
run did not carry.** Root cause: a `??` fallback treated *"the caller explicitly decided no claim
is honest"* identically to *"the caller never passed this field."* Fixed in PR #447; the live
production string is now `"Design storm 4 inch, 24-hr."` with no invented year.

**Every surface you mount must carry that same discipline.** The depth, and the return period only
where one genuinely applies, on screen and in the PDF. If your mount re-derives, re-formats or
re-labels that string anywhere, you have recreated the defect. **Prefer passing the engine's own
note through verbatim to composing your own.**

And the framing, because the whole value is a city skipping an engineer: the surface says what
this is, what it is not, and when to call an engineer anyway — visible on screen and in the PDF,
not a footnote. Portfolio precedent: property lines render as *"GIS-approximate — not a survey."*

## Cross-department, not a tab

Operator ruling. This mounts the way SmartSite and Files already mount, reachable from **Public
works** (drainage planning), **Development services** (review) and **Fire and EMS** (operations) —
not as one lens's tab. Build it once as a capability.

Note the role model: per `_decisions/2026-09-14_staff_identity_and_department_rbac.md` the roster
is the nine lenses, and G-127's enforcement is not built yet. Do not invent gating here; make the
capability mountable and let G-127 gate it.

## TWO FLOODS ON ONE SCREEN — solve this deliberately

The city map already carries **FEMA flood zones**, **AE floodway** and **BEFCO flood points**.
Those are **regulatory** — what insurance and permits depend on. The study is **derived** — what
actually happens on the dirt when it rains.

**A parcel can sit outside the FEMA zone and still pond badly. That is precisely the case Sylvia
is trying to catch**, and it is the case where the two answers appear to contradict each other.

They must read as **two different questions**, never as competing versions of one answer. Decide
how, and state the decision in your close.

Related and already ruled: `_decisions/2026-09-14_flood_determination_authority.md` — the
parcel-record rail is the authoritative FEMA determination, tier2 is retired. That ruling is about
the regulatory zone, **not** about this study. Do not conflate them.

## The colour taxonomy will collide — name it, do not silently resolve it

The PE overlay's discipline is deliberate: *"amber is RESERVED for SUBJECT / buildable envelope;
hydro moves OFF amber entirely. FEMA keeps its muted blue; hydro uses slate-teal so both Context
layers stay legible without colliding."* It reads from a shared `layer-role-taxonomy`.

The city map has **52 layers with their own colours**, including FEMA flood zones, low water
crossings, live stream gauges and storm drainage.

Mounting inside an embed mostly sidesteps this, because the study renders in its own frame. **If
your design causes the two taxonomies to meet anywhere, stop and report** rather than picking a
winner — that is a product-line decision across repos.

## A constraint that will bite

A **cached** study returns fast. A study at a **new depth** is a fresh computation, and a note on
record says these runs land at **85 to 154 seconds** while clients abort at **55**. Establish
whether a depth change is a cache miss on the path you are mounting. If it is, the mount needs
async refresh and polling — a control that times out on first use is not a delivered control.

## Snapshot

Repos: `hauska-map` (`apps/property-explorer`, the embed mode) and `smartcity-dashboards` (the
mount). Fetch both, work from current `origin/main`, declare repository, branch and commit SHA for
each in your first output line. Own branch, own worktree, per repo.

**G-128 is CLOSED and serving** (`smartcity-dashboards-00072-cow`); the dock and its Full state
exist. Rebase on current main rather than assuming the layout you remember.

## A known verification wall — do not burn the row on it

Three lanes have failed to verify authenticated `bastrop_tx` behaviour in v2 for want of a product
key; G-128's own close records that the map iframe never mounted in a full-shell probe for exactly
this reason. **G-133 is a live recon into why.**

If you hit the same 401, **say so, cite G-133, and verify what you can on `template-city`** rather
than treating it as your row's failure or spending the row chasing a credential.

## Method

Verify by violation: the same parcel at two depths produces materially different study output
through the mounted path, not just through PE directly.

Pre-register the falsifier before each check. G-125's caught a real fabrication — this is not
ceremony.

ENUMERATE BEFORE ASSERTING ABSENCE. Say what you searched.

State the mechanism explaining an observation, then a second mechanism that would produce the same
observation and why you rejected it.

Every verification command exit-bounded (`timeout 120 ...`).

## Out of scope

Porting the renderer to Leaflet. The map engine question. The FEMA determination ruling (G-130,
closed). RBAC enforcement (G-127). Provisioning credentials (G-133).

## Close

Deploys are planner-owned: you deploy and you fix your own failed deploys. Canary with
`--no-traffic`, smoke, shift, verify by reading the traffic JSON **by field name**.

Write your close to the path named in the CHECKPOINTS AND CLOSE block above — that is the
machine-checkable one, and this mission deliberately does not name a second.

State: the two-depth violation test through the MOUNTED path; the exact design-storm string the
mounted surface renders, quoted verbatim, proving no fabricated return period; how the regulatory
FEMA zone and the derived study are distinguished on screen; whether a depth change is a cache miss
and what you did about it; which lenses the capability is reachable from; and whether the colour
taxonomies met anywhere.
