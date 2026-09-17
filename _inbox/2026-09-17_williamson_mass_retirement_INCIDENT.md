---
id: 2026-09-17_williamson_mass_retirement_INCIDENT
title: "Incident: Williamson's production publish retired the entire county, and the restore"
date: 2026-09-17
last_updated: 2026-09-17
kind: incident
status: contained; the county serves again; three rows carded and dispatched
owner: nick
seat: integration
programs: [OPS-24, OPS-16]
related:
  - 90_operations/OPS-16_texas_market_plan_of_record.md (A-212; rows P-319, P-320, P-321)
  - _catalog/dispatch_missions/mission_p319_p320_p321_retirement_safety.md
  - ENFORCEMENT.md ("A mass state change refuses before it lands", the 2026-09-15 Bastrop instance)
snapshot: production neondb `place_layer_snapshots`, read live 2026-09-17 between 19:26Z and 21:00Z; doc_repo main e4d7ad62 plus this session's uncommitted work
---

# Williamson went dark, and why the control that should have stopped it did not exist

## What happened

Williamson's production publish ran as job `factory-bastrop-publish-sxv8r`, run `7b2540c8`, started
19:24:19Z. It did not crash. It completed, and it retired **all 602,050 served `node-facets:tier1`
rows for county 48491**:

- 282,569 R-prefixed rows, already retired before today by the CAD roll. Legitimate.
- **319,480 numeric rows that were LIVE and carried the 2026-09-10 bake, run `848afd72`.**

At 19:26:04Z `get_smart_site 48491:107190` returned `record_retired` with the basis "no row in the
published parcel index". The county was dark on the surface a customer uses.

## The mechanism

Williamson's published parcel index is keyed by R-prefixed CAD account numbers. Its served nodes
are keyed by numeric prop_ids. The publish's retirement step computes a set difference of served
keys against the published index and never tests that the two are the same keyspace, so every
numeric node was absent by construction and every one was retired.

**The second mechanism I considered and rejected.** That the roll had genuinely dropped those
parcels. Rejected on two independent grounds: the point-in-time branch shows the same rows live
with full payloads four minutes before the publish started, and P-306 established that every
R-prefixed key IS present in the county's index, so the index is a complete R-keyed roll rather
than a shrunken one.

## Why four things did not stop it

**The coverage floor passed.** P-306 fixed the floor to compare within a keyspace, and it duly
reported retention 1.1666 scoped. The retirement DECISION sitting beside the floor was left
keyspace-blind. A control that measures one thing does not protect the thing next to it, and the
floor's pass is what made the run look healthy.

**Nothing refused on blast radius.** A job that retires 100 percent of a county should not need to
know what went wrong in order to stop. The share alone is disqualifying.

**Nothing watched retired-share per county.** It moved from 47 percent to 100 percent in one run.

**The doctrine existed and the control did not.** ENFORCEMENT.md has carried "a mass state change
refuses before it lands" since the 2026-09-15 Bastrop 48021 reconcile retired 57,704 of 62,394
parcel-node atoms, 92.5 percent of that county, by the same presence-shaped comparison. Two days
later the same class took a second county through a different writer. **A doctrine paragraph is not
a control.** This is the finding that matters more than the defect.

One thing did work: tier-1 retirement reaches customers, so the damage was visible within two
hours. The Bastrop instance had no customer symptom and survived twelve days.

## The restore

Production payloads had become 1,579-byte retirement stubs with no `baseFacts`, no `zoning` and no
`envelope`. The same rows on a Neon point-in-time branch taken at 19:22:29Z
(`br-late-rain-apffmnp2`, endpoint `ep-long-paper-apvejx7e.c-7.us-east-1.aws.neon.tech`) were
2,226 bytes with `recordRetirement: null`. **Facts had been destroyed, not merely flagged**, so
un-retiring the keys would not have restored the county; a row copy was required.

`dblink` was created on production (it and `postgres_fdw` were available; `current_user` is
`neondb_owner`, not a superuser), and `payload_json` and `snapshot_at` were copied back in ten
batches split by the last digit of the place key, under a heavy-scan lease keyed on the production
host, with a census before and after. Only rows whose place key is numeric AND whose branch state
was not retired were touched. The R-prefixed retirements were not touched.

Instrument: `P:/tmp/integration-handoff/recover-48491-numeric.sh`, run in `preflight` mode first.

    20:50:39Z BEFORE {"numeric_live": 0, "numeric_retired": 319480, "r_retired": 282569}
    batch 0..9 restored 31827, 31947, 31921, 31952, 31963, 32029, 31929, 31993, 31900, 32019
    20:57:47Z AFTER  {"numeric_live": 319480, "numeric_retired": 0, "r_retired": 282569}
    20:58:52Z lease released

Total restored 319,480, exactly the pre-incident live count.

## Verification, at the customer surface and in both directions

An independent census run from a separate session, not the script's own:

    {"numeric_live": 319480, "numeric_retired": 0, "r_retired": 282569, "total": 602050}

`get_smart_site 48491:107190` now returns the parcel with `bakedAt 2026-09-10T18:41:52.716Z`,
`source baked-snapshot`, acreage 2.5386, label "12006 ANDERSON MILL RD, CEDAR PARK, TX 78613",
zoning LI (cedar_park_tx), land use XV, and a live `structuralFact.asOf` of 20:59:03.598Z. No
`record_retired`.

`get_smart_site 48491:R048816` still returns `record_retired`, `verdict absent-verified`, basis
"prop_id R048816 carries no row in the Williamson County CAD roll's declared tax_year 2026 ...
lastSeenTaxYear 2025". The legitimate retirement survived, which is what proves the restore touched
one keyspace and not the store.

The `parcel-record-cell-miss` refusals on that parcel's rails are its pre-incident state, not
damage: Williamson's parcel-record fill is held under the operator's D1 ruling (P-310).

## What is carded

**P-319** retirement is computed within a keyspace, and a served keyspace with no matching index
keyspace is `unaccounted` and retires nothing. **Blocks every further production publish of 48491.**

**P-320** a blast-radius refusal shared by every destructive writer: above a declared share it
writes nothing, records what it would have done, and exits non-zero; crossing it needs an explicit
authorisation flag. This is the control ENFORCEMENT.md named on 2026-09-15.

**P-321** retired-share per county per adapter is computed on a schedule against a declared band,
and a move outside it fails the run rather than filing a report.

All three are one lane, dispatched at `_dispatches/2026-09-17_p319-retirement-safety_dispatch.md`.

## Leave behind

    leave_behind:
      - item: Neon PITR branch br-late-rain-apffmnp2 (production, 19:22:29Z)
        owner: integration seat
        plan_row: P-319
        note: delete once P-319 has shipped and 48491 has republished successfully; it is the only
              copy of the pre-incident payloads and it costs storage while it exists.
      - item: dblink extension created on the production database
        owner: integration seat
        plan_row: P-319
        note: created for the restore. Drop it unless a lane needs it, and say so either way.
