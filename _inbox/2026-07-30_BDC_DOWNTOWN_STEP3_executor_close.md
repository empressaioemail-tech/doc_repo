---
id: 2026-07-30_BDC_DOWNTOWN_STEP3_executor_close
title: STEP 3 executor close — lot-line geometry scrub
date: 2026-07-30
status: complete
wdll: 2026-07-30_BASTROP_DOWNTOWN_DRILL_WDLL
wdll_items: [4]
pr: https://github.com/empressaioemail-tech/hauska-engine/pull/186
branch: feat/bdc-downtown-step3-geometry-scrub
---

# STEP 3 close

**PR #186** on `main` base. Planner pushed typecheck fix (`closeRing` tuple typing). CI re-run pending.

## Diagnosis

48021:34073 — TxGIO micro-vertices on shared Jefferson lot lines corrupt inward normals → null/jagged inset. BCAD 5-edge ring insets cleanly after scrub.

## Delivered

- `lot-line-scrub.ts` — nearly-straight vertex removal, cohort shared-edge snap
- `boundary-primitive-bastrop-downtown-scrub.mjs` — manifest-only (36 parcels)
- Tests: 7/7 lot-line-scrub; 33/33 boundary regression (2 live skipped)
- `ringHasSelfTouch` guard unchanged

## Planner next (before STEP4)

```bash
PROPERTY_ATOM_PATH=1 BOUNDARY_PRIMITIVE_PERSIST=1 \
  pnpm --filter @hauska-engine/engine-core run boundary-primitive-bastrop-downtown-scrub
```

Then STEP4 area re-warm on manifest parcels only.
