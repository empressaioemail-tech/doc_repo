---
id: 2026-08-24_cp1_parallel_lanes
title: CP1 — parallel Lane 1 / 2 / 3 split
date: 2026-08-24
plan_rows: [P-60, P-58]
---

# CP1 — what flies now

Peel = delete the extra composer, do not add a fix on top of a fix. Not a cleanup sprint.

| Lane | Card | Tree | Why it can run now |
| --- | --- | --- | --- |
| 2 | A2 interval wire (A1 deploy gate) | `P:/seat-worktrees/property/hauska-map` `fix/pe-pricing-a2` | Only writer on that tree |
| 1 | Envelope `parcel_node_id` + jurisdiction from node | new LDT worktree from `origin/main` | Different repo |
| 1 | Hover peel | new hauska-map worktree from `origin/main` | Isolated tree; no PricingModal |
| 3 | Field-mapping pass | doc_repo only | No `--apply`, no heavy scan |

Held: PE send of `parcel_node_id` (waits on LDT schema). Reports Option D (waits on Lane 2 visual). ETJ adapter apply. Who-serves promotion build. Assembler. Live Stripe. Atoms slot idle.

## Adversarial

Two hauska-map writers on one tree would clobber A2. Rejected. Hover gets its own worktree. LDT pricing-ladder branch is dirty; envelope gets a fresh tree. Lane 3 must not open a second PostGIS scan.
