---
id: 2026-07-25_R4_3_gravel_setback_rows
title: Dispatch — R4.3 gravel/unclassified setback rows for cohort promote
status: closed
date: 2026-07-25
applies_to: [hauska-engine]
planner: depth-engine planning agent
depends_on: R4.2 merged (roads 4894, depth_warm 6)
cites:
  - 27c WDLL 7
  - 27c WDLL 4 (road-class table completeness)
---

# R4.3 — descriptor rows for gravel frontage

## Planner finding

After R4.2, city-cohort n=150: no-road-adjacency=1, verifyFail≈146 mostly `road-class-setback-no-match` on **gravel** (service+unpaved). Bastrop descriptor has `assumedRowWidthByClass.gravel=30` but `roadClassSetbackTable` only covers residential/alley (and similar) — gravel front gets no row → verify fail → no promote.

Anti-fabrication: do not invent setback feet. Prefer: (a) cited public-code gravel/unimproved frontage rule if present in Bastrop UDC/descriptor sources, OR (b) honest decline path that does not count as verifyFail noise when class has no table row (mechanical absence), OR (c) map gravel→residential only if descriptor/docs say unimproved local streets use the residential front setback. Pick the honest option; document which.

## Required

1. Close the gravel (and any high-frequency missing class) gap honestly in bastrop descriptor + resolve path.
2. Re-run `--city-cohort --promote` n≥150; paste outcomes — verifyPass/promoted must be clearly above R4.2's 3/150.
3. Live SELECT depth_warm ↑; depth_ratio pasted.
4. PR CI green; no merge until planner go; no Central-TX greenlight.

## Env

Same as R4.2 (DATABASE_URL + TXGIO_DATABASE_URL=CORTEX_DATABASE_URL + PROPERTY_ATOM_PATH=1).
