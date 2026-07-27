---
id: 2026-07-27_RECIPE_PROOF_caldwell_48055
title: Dispatch — RECIPE-PROOF county #2 Caldwell (48055) — mold generalization MEASUREMENT
status: closed
date: 2026-07-27
applies_to: [hauska-engine]
owner: nick
planner: depth-engine planning agent (doc_repo)
governs_wdll: [_inbox/2026-07-27_RECIPE_PROOF_counties_2_3_WDLL.md]
cites: [WDLL 1-11 Caldwell; 27d gates 1-8; 27f Amendment 2]
closed_by: _inbox/2026-07-27_RECIPE_PROOF_track_close.md
related:
  - 27d_county_onboarding_recipe_and_fleet_reliability
  - 27f_bastrop_through_v2_program
  - _scratch/depth-engine-27c.md
  - _scratch/county-48055.md
---

# RECIPE-PROOF — Caldwell County (48055) lane BUILDER

You are the EXECUTOR for county-lane RECIPE-PROOF on **Caldwell County FIPS 48055**. Build in `P:\hauska-engine` on a branch from **current main**. Open a PR on green CI. Return a close with evidence + per-gate HELD/RE-OPENED + M0 scratch. Do NOT self-grade done. Planner verifies LIVE and owns M0 promotion. Do NOT promote MEMORY.md yourself. **CTX fan-out HELD** — Caldwell only (Hays is planner-gated after this).

This is ENGINE track. Independent of CC and customer-UI. Do not touch hauska-map / property-explorer / command-center unless a mechanical smoke requires a retrieval read.

## CRITICAL FRAMING (read twice)

This is a **MEASUREMENT**, not pass/fail (27f Amendment 2).

- For EACH of the 8 recipe gates, record **HELD** (Bastrop mold carried without new figuring-out) or **RE-OPENED** (new decision surfaced).
- Re-opening is EXPECTED DATA — bake the new decision into a proposed gate; count it as M.
- Re-deriving a decision Bastrop already baked is an **M0-reach miss** — flag it explicitly; do not silently "rediscover."
- False-green ("it works") and false-failure (honest new learning scored as miss) are BOTH wrong.
- Output the honest generalization number: **N held / M new-baked**.

## FLEET MEMORY (M0) — paste-enforced

As you work, capture LESSON / DEAD-END / GROUND-TRUTH (timestamped) / OPEN in your close AND append to the lane scratch block you return. Read scratch context FIRST. Do NOT promote to durable memory yourself — planner gates promotion. Nearing your limit, flush open threads + live ground-truths into your close so the next instance starts warm.

## Scratch context (start warm — DO NOT RE-DERIVE)

Read these FIRST before archaeology:

1. `_scratch/county-48055.md` (lane-isolated; seeded)
2. `_scratch/depth-engine-27c.md` (Bastrop mold lessons — especially S2-F / AUTHORITATIVE-ROAD-SOURCE-RECON)

```
BAKED GATES YOU INHERIT (violating/re-deriving = M0-reach miss):
1. AUTHORITATIVE-ROAD-SOURCE-RECON: find ALL jurisdiction-level road sources
   (county + comprehensive + each incorporated city). SCHEMA ≠ DATA —
   check defined surface/class population; never authoritative-from-Undefined;
   OSM = best-available when sparse. (S2-F → 27d recipe)
2. FRONT-LABELING FIXTURE GATE: footway ineligible; residential-first over
   collector; FIX 2.1 class-guard.
3. GEOMETRY GATE: positive-space near-rects; PATCH-A self-touch guard NOT
   weakened; 28286-class impossible when boundary primitive present.
4. OFFSET CONSUMES PRIMITIVE: stored inward/interior; honest partial inset;
   never fabricate not_specified axes.
5. VERIFY = WARM inset resolver parity; gravel needs descriptor row OR honest
   decline; place-type ratio ≠ all-zoning (PDD dilutes).
6. COST: measure wall+usd; commitment #3 = <$200 compute + 1hr human/jurisdiction.

DEAD-ENDS (do not retry):
- One road layer covers all jurisdiction levels
- Naive miter / uniform buffer as primary F/S/R
- Inventing PDD/site-specific feet

GROUND-TRUTH BEFORE (planner 2026-07-27):
- txgio_parcel 48055 = 32781
- Lockhart setbacks RLD/RMD/RHD already live in PE path; hard-hold PDD/CCB/IH/AO/PI/MH
- Prior probe 48055:11386 had OSM road signal (breadth, not depth-warm)

SEED ROAD RECON (planner web — VERIFY LIVE, do not trust blindly):
- Caldwell CAD Parcel Map FeatureServer (parcels + Road_Centerlines layer 6):
  https://services.arcgis.com/rVxY74DxxIDrDbc0/arcgis/rest/services/Caldwell_CAD_Parcel_Map/FeatureServer
- Also find Lockhart / Luling / other city street layers if separate.
- Check DATA POPULATION of surface/class, not just field existence.
```

## Recipe — run all 8 gates (cite WDLL items)

### Gate 1 — DESCRIPTOR IN (WDLL 1)
Author Caldwell descriptor mirroring Bastrop shape:
- FIPS 48055
- zoning → setback table indexed by (road-class, edge-role)
- assumedRowWidthFt by class
- source adapters
- accessPolicy

Lockhart RLD/RMD/RHD already exist in the PE setback inventory — reuse/port into the depth-engine descriptor shape; do not invent feet. Hard-hold districts stay honest decline.

**RECORD:** Does Caldwell zoning vocab fit the Bastrop `(district, road-class, edge-role)` table shape, or need a new structure? HELD vs RE-OPENED.

### Gate 2 — INTAKE + ROAD SOURCE RECON (WDLL 2)
Ingest parcels (txgio already has 32781 — confirm), zoning-facts for resolvable districts, roads onto ONE substrate as road-nodes `{fips}:road:{id}`.

Run AUTHORITATIVE-ROAD-SOURCE-RECON:
1. Enumerate ALL Caldwell road sources (county CAD centerlines + city layers).
2. For each: feature count, surface/class field presence, **defined vs Undefined population**.
3. Promote provenance only when surface/class defined; else `osm-best-available`.
4. Paste provenance split + population ceiling JSON (mirror S2-F audit shape).

**RECORD:** same source-split as Bastrop, or new? HELD vs RE-OPENED.

### Gate 3 — ROAD + FRONT LABELING (WDLL 3)
Run existing front-labeling fixtures; add Caldwell fixtures if a new case surfaces (propose gate — do not silently patch).

**RECORD:** HELD vs RE-OPENED (name the new case).

### Gate 4 — RULE (WDLL 4)
Resolve road-type setbacks from Caldwell descriptor. Prove street-vs-alley divergence OR honest absence of alley case.

**RECORD:** HELD vs RE-OPENED.

### Gate 5 — REASONING (WDLL 5)
Warm path uses boundary primitive + real offset (main already has U2/U3). Confirm 28286-class stays dead on a Caldwell near-rect if one exists. New geometry surprises → proposed gate.

**RECORD:** HELD vs RE-OPENED.

### Gate 6 — WARM→VERIFY→PROMOTE (WDLL 6)
Batch warm Caldwell resolvable cohort (districts with setback rows — Lockhart RLD/RMD/RHD analog of place-type; do NOT invent PDD feet). Mechanical verify only; promote passers.

Paste outcomes JSON (promoted / verifyPass / verifyFail / declines).

**RECORD:** HELD vs RE-OPENED.

### Gate 7 — TALLY + COST (WDLL 7)
Emit cost JSON (wallMs, usdPerParcel, extrapolatedJurisdictionUsd). Depth ratio = depth_warm / resolvable zoning denominator (report all-zoning separately if meaningful).

**RECORD:** cost under #3? HELD vs RE-OPENED (new cost quirk?).

### Gate 8 — SMOKE (WDLL 8)
At least one named Caldwell warm node readable (retrieval or atom body paste). Fail loudly if not.

**RECORD:** HELD vs RE-OPENED.

## Close deliverable (required shape)

```markdown
## Per-gate tally
| Gate | Verdict | Evidence (one line) | New decision? |
| 1 Descriptor | HELD|RE-OPENED | ... | yes/no + proposal |
| ... | | | |
| 8 Smoke | | | |

## Generalization number
N held = _
M new-baked (proposed) = _

## M0-reach miss list
(any re-derivation of baked Bastrop decisions — or "none")

## Live numbers (paste)
depth_warm / denom / ratio
road_nodes + provenance split
cost JSON
named smoke node

## Scratch block
LESSON / DEAD-END / GROUND-TRUTH / OPEN
```

## Out of scope

- Hays / Travis / Williamson / Bexar / CTX fan-out
- CC launch button / customer-UI polish
- Inventing setback feet for hard-hold districts
- Weakening geometry / front-labeling guards
- Self-merge; self-promote MEMORY.md
- Claiming "recipe works" without the held/reopened table

## Done when

PR green; close filed with the required shape; planner can live-verify. You do NOT verify done — planner does.
