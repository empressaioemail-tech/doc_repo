---
id: 2026-08-31_ctx_verdict
title: CTX verdict — what is serving, what is measured, and what is still a number nobody has
date: 2026-08-31
status: active
plan_row: F-01, F-02, F-06, F-08, F-11, P-85, P-91
snapshot: doc_repo main 736eddb; every figure dated; store reads on hauska_mcp or neondb as named
---

# The rule this document is written under

A merge is not a state worth reporting. The reportable states are **serving**,
**measured**, **unmeasured**, and **held**. Four times today a real fix changed
nothing because the thing that made it take effect lived somewhere else. Every line
below is one of those four states with its evidence, or it is not here.

# Serving

**Radius search.** `cortex-api-00682-met`, digest `sha256:1edc0497`, 100 percent,
from LDT #572 `394424f2`. Measured live after the shift with a service bearer:
`radiusFt=500` returns 200 in 0.354s with 29 results; `radiusFt=50` returns 200 in
0.203s; `lat=notanumber` returns 400 in 0.135s. Before this it was a Cloud Run kill
at 300s. The fix is the query shape: county resolved from `tx_county_boundary` bbox,
then `tile_key IN cellKeysForBbox`, with `texasCountyFipsList()` dropped. Timeout,
the 2000 ceiling and the 5280 max were not raised and no production bbox index was
applied. The canary pinned `image_tag=394424f2` rather than `latest` and
`DATABASE_URL` resolved `DEPLOYMENT_DATABASE_URL_DIRECT`.

**Street-search declares fuzzy.** LDT #571 `d1154938`. A `Pine St, Bastrop` query
that still returns four different streets now carries `match: "fuzzy"` and
`matchBasis: "name-fragment"` and names them. CAD `908 PINE` stays exact.

**Gate 8 fails honestly.** The 03:38Z vacuous pass on an empty body became a real
inhabited fail, and an independent curl of the same URL returned the same 10,744
bytes. C3 now carries `shape: "presence-shaped"` and a pass reason stating the
payload is self-consistent and does not establish landUse is correct (Factory #47).

# Measured

**Bastrop containment is licensed.** Run `85f984c2-e67b-4229-be57-a727f3026b04`,
execution `hwzq5`, digest `sha256:dd7c2a94`. F1 emitted **50,264 / 11,992 / 62,256**
over eight chunks; F2 reached `exit_kind success` with `lease_released true` and
Cloud Run `succeededCount=1` in 1m58, unaided, not cancelled. All 62,256
`landing_parcel_jurisdiction` rows carry that `run_id`, proven by `GROUP BY`.
A setback bake cites **85f984c2**, not the earlier `1dda40f7`, which succeeded and
now binds nothing.

**Hays completed and settled the reframe.** Fifteen chunks, 116,420 rows
(61,585 / 54,835), `succeededCount=1` in 14m16s, page size 8,000,
`statement_timeout` NOT raised. Six interactive scans could not finish that county at
any scope. **The 180s ceiling was the instrument, not the work.** County size no
longer determines completion; chunk count does.

**The first non-CAD write.** Run `3dc46ece`, execution `factory-atoms-cad-9zhg5`,
child `write-well-fact-county.mjs`, lease `entity_type=well-fact`, on digest
`sha256:0b259a54` / `ENGINE_SHA 34710cb6` / generation 4, against the measured hole
of `sha256:56bdc23d` / `76b13d1` / generation 3.

**It fired a pre-registered failure.** Planned **69,000**, store holds **66,913**,
gap **2,087**, confirmed by both `entity_id` range and `atom_did` prefix. Not
rounding. Caldwell 53,841 untouched. Binding spot-check agrees on 48021 from both
`entity_id` and parcel.

**P-85 BLOCK audit.** 36 issued in scope, **0** ever carried a block term, **14**
digit-block misses on 3 Bastrop parcels, **7** letter-block misses on 4 parcels
across 48453 / 48209 / 48309. Consequence 21 jobs on 7 parcels; the landed-fix re-run
population is 14 on 3, because the shipped parser still stores null on a letter-only
block. Letter blocks are valid free-text clerk terms, not a declined class.

**C4 is mechanism A.** The live gold returns `envelope.status ok`,
`buildableAreaSqFt 9350`, `buildableAreaPct` absent, `acreage.sqft 16673`.
9350/16673 is 56.1. The lot area is known and the ratio is simply never computed.

**Alias is a half-name bug, not a hyphen bug.** `nk()` already strips hyphens and
`Lacy-Lakeview` resolves `certain`. Exactly four rows change and `certain` holds at
33.

# Unmeasured, and named as such

**TOTALS.** Two of six counties are clean. Bastrop licensed, Hays succeeded,
Caldwell matched but its run was hand-cancelled, McLennan is a bare count of 114,254
on the old digest with no restated triple and no sentinel disposition, Travis and
Williamson are `COUNTY_HELD`.

**188,103 and 158,573.** F1's pre-registered falsifier was that adding side, rear and
`sourceCodeAtomRef` must not move these. **F1 never scored them.** Travis and
Williamson returned UNMEASURED at the 15s `statement_timeout` and the lane refused to
invent zeros. **Both quarantine premises remain unverified.**

**The Caldwell hang.** F1 also passed on the old digest `56a8ee75` and exited
unaided, yet Caldwell hung on what should be that same pre-#49 close path. Same
digest, opposite behaviour. **#49 is adopted on a clean run, not on a
reproduced-then-repaired failure.** Do not cite it as proven until that is named.

**The 2,087 well-fact gap.** Cause unknown.

**Statewide.** Unchanged and out of scope.

# Held, and on what

| Held | Gate |
|---|---|
| Setback bake | `PLACEHOLDER_COLLISION` (P4-QUARANTINE), not containment |
| Travis / Williamson containment | `COUNTY_HELD` until McLennan is settled |
| Hays / McLennan / Travis / Williamson wells | the 2,087 gap and a clean Bastrop |
| All P-85 capture and every records re-run | **operator portal-access ruling** |
| C3 second derivation | its own card |

**The portal ruling is the only item on this board blocking a whole workstream on a
decision rather than on work.** The permission column was set 2026-08-26 by a script
loop across all six portals with `terms_text` a literal placeholder; Measurement X3,
finding that robots.txt disallows automated access at Bastrop, Travis and Williamson,
is dated 2026-08-30. The permission predates the evidence and was never re-taken.

# The error class this session kept producing

Four instances, each a real fix that changed nothing because its effect lived
elsewhere: an alias correction recorded without regenerating the artifact; an engine
entrypoint merged without its job template; Factory #49 merged while the job still
ran the old image; two merges at 19:41Z serving nothing.

Two more of the same family, one in each direction: `sha256:56a8ee75` was called the
#49 image from a build starting 16 seconds after the merge, and the planner wrote the
Bastrop card off a merge rather than an image. **Image-to-commit attribution on the
factory pipeline is always inference, because its builds ship storage tarballs with
no `COMMIT_SHA`.** The atoms-writer pipeline tags images with the commit SHA and does
not have this problem. The fix exists on one pipeline and not the other.

Two planner errors of a different shape, both caught downstream: a license recorded
from a lane close while the store had already rebound, and a control value (CAD 48021
`max(updated_at)` given as 2026-08-12, actually 2026-08-28) propagated without
re-measuring. A close is a claim about a moment; a bind is a fact with a timestamp.

Four CRLF instances, all in **instruments** rather than data: a plan-row regex, a
closure path list, a hash pin computed on CRLF while git stores LF, and a literal
newline in a test.

# Leave-behind

```
leave_behind:
  - item: 69,000 vs 66,913 well-fact gap; Factory run 3dc46ece still started
    owner: property
    plan_row: F-02
  - item: F1 Travis/Williamson unmeasured; 188,103 / 158,573 unscored
    owner: property
    plan_row: F-11
  - item: what the Caldwell hang actually was; 49 unproven by reproduction
    owner: property
    plan_row: F-01
  - item: McLennan re-run with sentinel measured and triple stated first
    owner: property
    plan_row: F-01
  - item: factory builds ship no COMMIT_SHA in provenance
    owner: factory
    plan_row: F-03
  - item: alias-regen product SQL uncommitted; 36-row residue unresolved
    owner: property
    plan_row: F-01, F-11
  - item: detector is quoted-literal only, STORAGE_PORT_PROOF_ATOM_DID starve
    owner: property
    plan_row: F-11
  - item: descriptor-fixture, a third bad provenance, out of phase-1a disposition
    owner: unassigned
    plan_row: F-11
  - item: MCP ICC accrual split
    owner: substrate
    plan_row: F-11
  - item: hauska-map PE drift guard that sees origin/main
    owner: map
    plan_row: F-06
  - item: Factory planWork hold arm for setback and envelope
    owner: factory
    plan_row: F-03
  - item: LDT derive.ts still imports roadClassSetbacks
    owner: property
    plan_row: F-06
  - item: takeScopedLease entityType setback, wire when SETBACK_APPLY_HELD lifts
    owner: property
    plan_row: F-11
  - item: portal-access compliance ruling
    owner: nick
    plan_row: P-85
```
