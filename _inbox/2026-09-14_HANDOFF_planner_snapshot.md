---
id: 2026-09-14_HANDOFF_planner_snapshot
title: HANDOFF — planner snapshot, where everything stands 2026-09-14
date: 2026-09-14
status: handoff — operational state, not a program doc
kind: handoff
owner: nick
audience: a fresh planner picking up the integration seat
snapshot: doc_repo main @ 3fc01844
---

# HANDOFF — planner snapshot

> **Read `_inbox/2026-09-14_county_to_serving_WDLL.md` first** for the destination. This
> document is the operational state on top of it: what is running, what closed, what is
> blocked, and what the operator still owes a ruling on.
>
> `doc_repo main @ 3fc01844`.

## In flight right now

**Wave 6 (OPS-23) is baking.** Its three-step serving-store deploy sequence, in one lane,
strictly ordered:

```
STEP 1  production publish of 48209 (Hays)     IN FLIGHT
        First fire REFUSED CLEANLY with GOLD_REQUIRED — the documented command was
        incomplete, not wrong. GOLD_PARCELS registers only 48021; 48209's gold is
        48209:97658. Store unchanged at b5e54917, surface still 404, NO runs row
        created. Re-fired with the gold.
        NOTE: --skip-walk would have bypassed the check entirely. It was not used.

STEP 2  re-mint 48021:34049's setback-rule atom      PULLED OUT OF THE SEQUENCE
        It has NO INVOCATION anywhere in the record. Approved as work, never
        dispatchable as an execution. Highest-risk open item: the factory template
        pins CONTRACT_VERSION=1.30.0 while atom-contract is 1.36.0 — a writer
        validating at 1.30.0 could accept the re-mint and SILENTLY DROP THE PAYLOAD.
        Settle the version question before the mechanism hunt.

STEP 3  cortex-api traffic shift to #688            NOT FIRED
        Two unmeasured dependencies: p185 already shifted this service today (the
        2026-09-11 incident shape), and smartsite-mcp's get_smart_site PROXIES to
        cortex-api with nobody having measured whether it proxies AROUND the
        revision. Shifting may be both unsafe and insufficient. Rollback 00799-xaq.
```

**The blocker that invalidates step 1's verification, and it is not resolved.** The 404 on
`48209:84629` was never a missing row — production already holds a retired tier-1 row for it
under `b5e54917`. So step 4 is a **restamp**, the 404 is a serving-layer problem, and **a
post-publish 200 proves nothing about whether the publish did any work.** Somebody must
explain why identical data 404s before and 200s after, or the success test cannot fail for the
right reason. Also open: `PRODUCTION_SITE_URL` is genuinely unmeasured — not on the template,
not in the secrets. Do not invent it.

## Closed today

**P-195 — the two dead gates. DONE, and done properly.** `evaluateRailGate` (engine) and
`evaluatePopulation` (factory) both refuse total absence instead of silently passing.
**Merged, deployed, and verified by violation on the live production job:** Dallas, a
genuinely never-acquired county, now writes `refuse` to `parcel_gate_verdict`; Bastrop's
verdict confirmed unchanged. Image digest moved `36fe68…` → `f547df0…`.

Two things that lane did worth copying: it settled the "twin" question by reading
`ENGINE_PIN.json` plus a byte diff (the factory `.js` is a tsc-generated vendor copy, not an
independent implementation), and it **refused to implement the dispatch's literal fix** when
that would have broken ratified behaviour for a deliberately single-county rail like
`maxImperviousCoverPct`. The CI block was squash-merge branch divergence, not an outage.

**P-199 — the Smart Site auth gate. CLOSED as a diagnosis, ruled to wait.** An incognito
session reads the whole brief. Cause named, and it was sharper than any of the three
hypotheses the dispatch offered: **there is no atom in the serving path at all**, so
`accessPolicy` is never consulted and **open is the default.** The one working gate,
`grantsOwnerCoGatedFields()`, is a bespoke exception for owner plus four CAD dollar fields.
**Operator ruled: wait for P-163, gate at the policy layer, do not hand-build a second surface
gate.** P-163's row now carries this as a named downstream consumer. Decision and three
reversal criteria in `_decisions/2026-09-14_smartsite_brief_gate_waits_for_p163.md`.

## Blocked, and on what

```
smartsite-auth-gate (queue card)   depends_on P-163
wave 6 step 1                      404 semantics · store quiescence · PRODUCTION_SITE_URL
wave 6 step 2                      no invocation · CONTRACT_VERSION 1.30.0 vs 1.36.0
wave 6 step 3                      smartsite-mcp proxy behaviour unmeasured
OPS-24 farm rows (P-187, P-198)    by design — designed from what Burnet breaks, not before
```

## The operator owes three rulings

1. **Which doc_repo session stays standing.** Two are writing `main` from one checkout and it
   has collided three times in three days: four plan-row IDs on 09-13, an amendment by three
   minutes on 09-14, and two of my files swept into another seat's commit. The farm-model
   session is **holding all doc_repo commits** pending this. **The durable fix is not picking
   a session** — it is making row allocation a claim against `_catalog/plan_registry.json`
   with a gate refusing any commit that introduces a duplicate ID, the same shape as the
   close-gate fix that just landed.
2. **Whether P-170 gets a close.** It sits inside the range that was ungated, appears in
   OPS-16 as built and registered, and **no `_inbox/*close*.json` names it.** Three
   possibilities, none distinguished: closed under a differently-named artifact, folded into a
   wave close without being listed in `planRows`, or never closed.
3. **The Bell cost-gate recalibration.** `onboarding_defect_class_backlog.md` records
   BELL-COST-GATE-BREACH declining at $333.34 against commitment #3's $200 hard kill, then
   cleared at $1.15 by recalibrating the cost model **with the `$2/1k-calls` external-call term
   removed.** The hard kill was satisfied by retuning the instrument. Attached to no row.

## Separate lane, coordinated not merged

**The Bastrop cutover onto `smartcity-dashboards`** is running independently. Memo at
`_inbox/2026-09-14_COORD_bastrop_cutover_to_dashboards.md`. It owes a **named cutover WDLL**,
which is the literal condition in `repo_intents.md` that lifts `smartcity-os`'s ABSOLUTE
NO-TOUCH. Bastrop is being actively written by wave 6, so that lane reads Bastrop as
provisional until wave 6 hands back.

## Next county: Burnet 48053

**Acquired and never instantiated** — 59,785 parcels and a 2025 roll on production landing,
`parcel_record` = 0 in the factory store, both verified. **Zero address points**, which come
from a statewide StratMap set the six counties already use, so one loader run rather than a new
source. Borders Travis and Williamson. Marble Falls is the one place with a verified-live
zoning layer (261 features staged); the other six are evidenced `searched-and-absent`.

**Do not chase zoning for the six absent towns.** A card saying "no zoning layer on file for
Bertram" is correct behaviour. That scope decision is what keeps Burnet off the marathon path.

## Do not re-derive these

```
Gate               FIXED and deployed as of today. Dallas refuses, Bastrop unchanged.
Six writers        owner · land-use · flood-hazard · rail-corridor · rrc-pipeline ·
                   special-district take no lease. Flood cells SERVE today, so the
                   defect is RE-RUNS, not never-populated.
Envelope           buildable area/percent/status REFUSED BY RULING (R-2). The polygon
                   draws under P-153. DO NOT "FIX" THIS and do not render it as a gap.
Serve path         working. 18 of 21 rails at 1109 Pecan, 20 of 21 on the Travis probe.
                   One real defect, F25: record-path payloads print bakedAt/snapshotAt
                   from the OLD snapshot while the cells were written in September.
                   Values right, label lies.
Dead controls      SEVEN, not eight. computeTier1Envelope was WITHDRAWN — its refusal
                   is ruled, not defective.
Registers          THREE different formats across three files. The "94 rows" figure was
                   a sum of self-reports, never a count. Normalising is step one of the
                   pre-bake runner.
Atoms lease        PRIMARY KEY (scope_type, scope_id) — already scoped, NOT a global
                   mutex. The contention argument for isolated farm stores is retired.
                   A farm is a manifest and a merge gate, not a second store.
```

## Traps this seat walked into, in three days

- **Globbing across the shared tree.** A renumber script rewrote 14 files belonging to other
  seats. All tracked, all restored byte-exact. Verify the CONTENT a script will change, not
  the paths it will touch.
- **Summing self-reports and calling it a count.** "94 assumption rows" reached canon that
  way. Three numbers this week were never counted or counted wrong, and each was caught by
  someone reading source rather than prose.
- **Reading one field and concluding about a whole county.** Harris was classified absent from
  `service_url: null` while the same artifact held DNS failures from the probe network, and
  Harris in fact holds 1,523,640 verified atoms.
- **Carding an enumeration that already existed.** P-182 was opened to build a list already
  present in a 1,223-place roster, in 448,245 store refusals, and in OPS-22. **The recurring
  defect here is a missing rollup, not missing data. Search before you card.**

## EVERY DURABLE DOCUMENT — the complete manifest

All committed to `doc_repo main`. Read in the order of the first block; the rest is reference
you pull when you need it.

### Read these four, in this order

| # | Path | What it is |
|---|---|---|
| 1 | `_inbox/2026-09-14_county_to_serving_WDLL.md` | **THE DESTINATION.** One picture, written to be read instead of everything below it |
| 2 | `_inbox/2026-09-14_HANDOFF_planner_snapshot.md` | **THIS FILE.** Operational state: what runs, what closed, what is blocked |
| 3 | `90_operations/OPS-24_county_to_serving_program.md` | **THE PROGRAM.** Thirteen stages, P-186..P-198, six laws |
| 4 | `_inbox/2026-09-14_county_to_serving_program_map.md` | **THE ARCHITECTURE**, rev 2. Stage-by-stage with status markers |

### Evidence — read when you need the basis for a claim

```
_inbox/2026-09-13_assumption_register_ldt.md        38 rows, LDT 31d181c2
_inbox/2026-09-13_assumption_register_engine.md     27 rows, engine 112bccb8
_inbox/2026-09-13_assumption_register_factory.md    29 rows + completeness inventory,
                                                    factory 97b93877
                                                    (THREE DIFFERENT FORMATS — normalising
                                                     them is step one of the pre-bake runner)
_inbox/2026-09-13_dead_controls_ranked_fixes.md     L0. SEVEN controls that cannot fail,
                                                    ranked, fix proposed each
_inbox/2026-09-14_ops24_teardown_review.md          the teardown that corrected OPS-24 on
                                                    day one
_inbox/2026-09-13_subcounty_coverage_audit.md       places not counties; closed-partial
_inbox/2026-09-13_tx_source_inventory_and_acquisition_process.md
                                                    the Texas source picture + the process
                                                    it implies
```

### Read as a PAIR, never separately

```
_inbox/2026-09-13_national_scale_working_notes.md
_inbox/2026-09-13_national_scale_adversarial_review.md
```

The notes are **wrong in seven confirmed ways** and were committed wrong on purpose. The
review is what found them. The pair is the honest record of how the reasoning moved; the notes
alone will mislead you.

### Instruments — re-run them, never quote their numbers

```
scripts/tx-source-truth.mjs          per-county joined truth, 254 counties, self-testing
scripts/tx-cad-source-inventory.mjs  source availability from the 254 probes, self-testing
scripts/vendor-testset-ctx.mjs       the 60-parcel Cotality test set, self-testing
scripts/surface-probe.mjs            THE success instrument, already the close-artifact
                                     standard in every compiled dispatch
scripts/enforcement/probe-close-gate.mjs   ranges now derive from _catalog/plan_registry.json
                                           and self-test against drift
```

### Catalog artifacts — measured state, re-derivable

```
_catalog/tx_source_truth.json            per-county: CAD source, geometry, ingest, flags
_catalog/tx_cad_source_inventory.json    176 reachable / 19 unproven / 58 absent / 1 unmeasured
_catalog/texas_roster_v1.json            1,223 places with zoning determinations
_catalog/tx_cad_source_registry.json     35 counties, vendor/format tuples
_catalog/vendor_testset_ctx.json         60 parcels, 10 per county, 5 in-city 5 unincorporated
```

### Rulings and decisions

```
_decisions/2026-09-14_smartsite_brief_gate_waits_for_p163.md   the gate waits; 3 reversal criteria
_decisions/2026-09-11_ledger_as_serving_path_seven_steps.md    atoms canonical, cells accounting
_decisions/2026-09-11_setback_source_most_current_wins.md      the source-conflict pattern to copy
_decisions/2026-07-13_cotality_swap_public_record_migration.md  REST extinguished (MCP eval is live)
80_adrs/adr_032_third_party_source_rights_envelope.md          PROPOSED, not accepted
_catalog/repo_intents.md                                       per-repo intent; smartcity-os NO-TOUCH
```

### The Cotality thread — parallel, not blocking

```
_research/2026-09-12_cotality_reengagement_division_cogs_and_probe.md
        the 65-rail BUY/MAKE/HAVE division, the COGS model, the live probe
_dispatches/2026-09-12_ctx-bakeoff_dispatch.md
        P-176. COMPILED AND NEVER DISPATCHED. Needs no contract — the eval channel
        is live and the eval agreement permits internal evaluation.
```

### Coordination and queue

```
_inbox/2026-09-14_COORD_bastrop_cutover_to_dashboards.md   the separate lane's boundary
_inbox/2026-09-14_HANDOFF_farm_model_and_burnet_prototype.md   farm model + Burnet, with a
                                                               CORRECTION BLOCK at the top
_inbox/2026-09-13_HANDOFF_national_program_package.md          the earlier package manifest
_queue/cards/smartsite-auth-gate/card.json                     BLOCKED on P-163
```

### Session records

```
_sessions/2026-09-12_cotality_reengagement_and_third_party_sources_claude_code.md
_sessions/2026-09-13_scale_source_inventory_and_prebake_claude_code.md
_sessions/2026-09-13_handoff_package_and_close_claude_code.md
_sessions/2026-09-14_smart_site_lane_and_auth_gate_claude_code.md
```

## One pattern worth naming

Three lanes this week returned findings sharper than the hypotheses they were handed: six
writers not three, three gate files not two, and "there is no atom in the path" rather than
"the atoms are public-free." Each got there by reading the write path rather than testing the
framing it was given. **Hand a lane a hypothesis and expect it back improved, not confirmed** —
and when it comes back different, the lane is usually right.
