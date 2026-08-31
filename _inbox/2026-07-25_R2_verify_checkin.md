---
id: 2026-07-25_R2_verify_checkin
title: Check-in — R2 verify (street-vs-alley fixture MET; live alley OPEN)
status: check-in
date: 2026-07-25
planner: depth-engine planning agent
prs:
  - https://github.com/empressaioemail-tech/hauska-engine/pull/125
  - https://github.com/empressaioemail-tech/legacy-design-tools/pull/358
---

# R2 verify check-in

## Merges / deploy

```
engine #125 → 6982cd91 (CI typecheck+test pass)
ldt #358 → f4784cc5 (CI Typecheck+Test pass)
cortex canary cortex-api-00440-fav → shifted 100%
```

## Independent evidence

Planner-rerun tests:
```
engine road-class-setback.test.ts — 4/4 pass
ldt roadClassSetbacks + edgeLabeling — 21/21 pass
```

Fixture divergence (WDLL 4 core):
```
residential+front → 15'
alley+rear → 5'
(asserted in engine + ldt tests; edgeLabeling R2 block with Spring Street + service alley)
```

Live canary POST 714 Spring St:
```
status=ok parcel_node_id=48021:33512 effectiveZoningCode=P-5
setbacks front_ft=15; side/rear/side_corner not_specified
edgeSignal=road; corner lot (second named street) — NO alley string in response
buildableAreaSqFt=22739
```

714 Spring is street/corner, not alley-backed. Live street-vs-alley divergence on a real alley-rear parcel was not observed this sprint.

## Grade

| Item | Grade | Evidence |
|---|---|---|
| 27c WDLL 4 | **PARTIAL** | Descriptor + RULE `(road-class, edge-role)` + LDT derive path + fixture 15′ vs 5′ MET. Live alley-backed Bastrop parcel still OPEN. |

## Next

R3 warm-then-verify loop can proceed (uses R0–R2 pipeline). Track OPEN: find/live-probe a Bastrop alley-rear parcel to close WDLL 4 fully.
