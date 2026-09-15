---
id: 2026-09-14_HANDOFF_farm_model_and_burnet_prototype
title: HANDOFF — the farm model, the machinery it needs, and Burnet as prototype one
date: 2026-09-14
status: handoff — plan shaped, NOT ratified, NOT dispatched
kind: handoff
owner: nick
audience: a fresh planning agent, who should ASK QUESTIONS before executing anything
predecessor: _inbox/2026-09-13_HANDOFF_national_program_package.md
---

# HANDOFF — the farm model and the Burnet prototype

> **READ THIS FIRST.** You are being handed a shaped plan, not an approved one. The operator
> wants you to **ask questions before executing** so we are demonstrably on the same page.
> Treat every section below as a proposal you are expected to challenge. The section at the
> bottom lists the challenges I most expect to be right.
>
> Read `_inbox/2026-09-13_HANDOFF_national_program_package.md` first for the full context
> package. This document assumes it.

## The decision this conversation reached

**Counties are onboarded in isolated "farms" that behave like open-source forks.**

A farm is one county's data in its own store, running a **pinned pipeline SHA**. When the
county hits a defect, the farm does NOT patch locally. It names the defect **class**, the fix
goes upstream into the shared pipeline, and every farm re-runs on the new pin.

```
  FARM = a DATA isolation boundary.  NEVER a CODE isolation boundary.

  county data  -> isolated store, blast radius contained
  pipeline     -> pinned SHA, identical across all farms
  a defect     -> a CLASS filed upstream, not a local workaround
  a fix        -> lands upstream, all farms rebase and re-run
  merge        -> refused unless the farm's SHA == upstream HEAD
```

**Why the isolation is worth it:** the atoms writer lease is a single global resource. Harris
died on it, the heavy-scan serialization exists because of it, and factory store reads time
out under writer load. Four counties in one store fight. Four counties in four stores do not.

**Why the code boundary is the whole game:** if four teams solve four counties independently
they will solve them four different ways, and the master ledger ends up holding four divergent
pipelines. That is industrialising the exact condition that makes Central Texas hard to reason
about. Hays' crosswalk, Williamson's second numeric scheme and Harris' multi-shapefile
discovery had to be ONE fix each in ONE codebase.

**Why it works at all:** re-baking is cheap, so rebasing a farm onto a new pin is affordable.
That is the one piece of the earlier economics that survived adversarial review.

**The enforcement has to be hook-shaped, not a guideline.** In open source, forks stay healthy
because holding a local patch HURTS on every rebase. Here the equivalent is a merge gate that
refuses any farm whose pipeline SHA does not match upstream HEAD. This repo's base rate is
hook-shaped controls 1-for-1, protocol-step controls 0-for-3. A "please upstream your fixes"
convention will not hold under deadline.

**The constraint nobody had named:** upstream throughput bounds how many farms can be healthy
at once. If farms produce fixes faster than the integration seat can absorb and verify them,
farms are forced to hold patches and the model degrades into permanent forks. **The number of
parallel farms is limited by merge capacity, not by how many agents you can spawn.** Measure
this on farm one before widening.

## Machinery: what already exists — DO NOT REBUILD

The recurring defect in this repo is a missing rollup, not missing data. P-182 was opened to
build an enumeration that already existed in three places. Search before you build.

```
scripts/surface-probe.mjs          THE success instrument. Already the close-artifact
                                   standard in every compiled dispatch.
scripts/county-contract.mjs        county contract / cell-state vocabulary
scripts/gate-grade.mjs             gate grading
scripts/cad-ingest-apply-gate.mjs  an apply gate on CAD ingest
scripts/plan-progress.mjs          plan-row completion predicates, self-tested
scripts/tx-source-truth.mjs        per-county joined source truth (254 counties)
scripts/tx-cad-source-inventory.mjs  source availability from the 254 probes
_catalog/tx_source_truth.json      the per-county picture, re-runnable
_catalog/texas_roster_v1.json      1,223 places with zoning determinations
_catalog/tx_cad_source_registry.json  35 counties, the vendor/format tuple registry
```

## Machinery that must be BUILT and must be DURABLE

The operator's instruction is explicit: **this cannot be scripts that evaporate after a
thread.** Each item below is a checked-in, self-testing instrument with a not-vacuous case,
following the pattern of `tx-source-truth.mjs`.

**1. The pre-bake audit runner.** The three assumption registers are 94 rows of prose. They
must become executable: given a county, run each probe against the SOURCE and return
GREEN / AMBER / RED with the violated assumption named. AMBER names the specific assumption,
which means it names the specific fix. This is the largest new piece and the one that makes a
farm predictable instead of exploratory.

**2. The completeness checker.** Two independently derived counts per county, agreeing within
a declared bound, or the county does not publish. The governing case: for Harris, dry, apply,
apply2 and SQL all agreed at 564,948 because all four read the same truncated input, and the
sizing estimate carried the same bug. Only reading the ZIP central directory saw it. That
pattern needs generalising from a one-off into an instrument.

**3. Farm provisioning and teardown.** Create a county store, pin a SHA, record both. For
prototype one this can be thin. Note the known hazard: Neon branch cleanup must enumerate
every binding project, and factory secrets are mirrored across two GCP projects.

**4. The merge gate.** Refuses a farm whose pipeline SHA is not upstream HEAD. Not needed for
farm one (nothing to merge in parallel), needed before farm two. Its bypass is a direct write
to the master store, which needs its own block or the gate is theatre.

**5. Row version stamping.** `parcel_record_cell` has four columns and no version. Without it,
merging farms is unsafe in the subtle way: nothing collides, and nothing records which county
was built under which code. Schema plus writer change. Needed before parallel farms, not for
farm one.

> **CORRECTION 2026-09-14, from the OPS-23 side. Read before acting on anything above.**
>
> **The pin is a FOUR-LINE MANIFEST, not one SHA** — LDT, engine, factory, and the two
> published packages. The closest thing that exists today is the factory's `_LDT_SHA` pin,
> which CI checks. The merge gate (item 4) compares the **manifest**, never a single SHA.
>
> **`envelopeStatus` at 0 of 611,116 is REFUSED BY RULING (R-2), not a defect.** OPS-21
> withholds buildable area, percent and envelope status until an envelope atom exists; the
> polygon draws under P-153. Do not try to fix it. Entry 5 of the dead-controls card is
> withdrawn for this reason and the count there is SEVEN, not eight.
>
> **SERVE is not broken.** Live 2026-09-14 on the record path: 1109 Pecan serves 18 of 21
> rails, the three remaining are honest absences; the Travis probe parcel serves 20 of 21.
> The setback contradiction is gone (hauska-map axis override removed; probe artifact
> `2026-09-14_120659`) and the withheld values were slated in wave 5 (LDT #678, #684). One
> real defect survives: record-path payloads print `facets.bakedAt` and `snapshotAt` from the
> old atom-chain snapshot while the cells behind them were written in September. Values right,
> label lies. Rowed as F25.
>
> **The gate fix is SEQUENCED FIRST, ahead of everything.** P-156's per-city declaration in
> wave 6 feeds the publish gate, so a gate that passes a county with zero earned cells makes
> the declaration unable to fail either. **The gate fix lands before any CTX bake, before any
> farm, and before P-156's Travis and Williamson rounds.** That answers open question 1 below:
> it is *before*, and not because I lean that way — because a downstream control depends on it.
>
> **The three lease-less writers are real, but narrower than stated.** Flood cells exist and
> serve today (the Hays lots read Zone AO from the record), so those writers ran once. The
> defect is **re-runs** under the current lease. Execution belongs with the gate work.
>
> **Identity collapse is measured for two of six counties, not zero.** Hays: 37,927 of 116,420
> nodes bound to a different account by bare number (H1/P-145), fixed on the MCP path (P-177),
> on the record store (P-180), last leg in wave 6 (P-183). Williamson is P-184. The other four
> are unmeasured. The two-namespace identity rule now in OPS-21 law governs this step.
>
> **Acquire carries a declared-vintage rule (P-178):** a county's declared roll is a decision
> with a marker for accounts that fall off, never an upsert that silently keeps notice values.
>
> **Publish already has two enforced rules** a farm must obey at merge-back: staging first then
> the identical job on production, and the traffic-lease rule (P-170). Both hook-enforced.

## Fixes that gate the verdict, not new machinery

**These are not optional for a farm to mean anything.**

**Arm the two gates.** `evaluateRailGate` returns `ok: true` on zero earned cells;
`evaluatePopulation` gates every ratio refusal on `code === "OK"` so `EMPTY_DENOMINATOR` skips
all of them. **Total absence passes while partial absence refuses.** Run a farm today and a
clean verdict is compatible with an empty county. The entire value of a farm is the verdict at
the end.

**Fix the three lease-less writers.** `write-owner-fact-county.mjs`,
`write-land-use-fact-county.mjs` and `write-flood-hazard-fact-county.mjs` carry zero mentions
of "lease" and call `writePropertyAtomsBatch(slice)`, which throws `LeaseRequiredError` without
one. **Owner, land use and flood hazard cannot write for any county today.** Burnet without
this fix lands missing three rails a customer asks about. The fix is small: take and pass the
lease the way `write-parcel-node-county.mjs` already does. It unblocks all four counties, not
just Burnet.

Full list with proposed fixes: `_inbox/2026-09-13_dead_controls_ranked_fixes.md`.

## Burnet 48053 — the prototype

Best-positioned of the four the operator named. Verified from `_catalog/tx_source_truth.json`
and `_catalog/texas_roster_v1.json`:

```
CAD endpoint      rest-reachable
geometry ingest   PASS (L2 wave already ran)
tranche-1 registry  present
identity flags    none
parcel_record     0 rows   (genuinely not onboarded, just well-staged)
places            7
```

Comparison: Bell geometry ingest NOT RUN and not in registry; Milam CAD endpoint UNPROVEN;
Lee clean but only 2 places and 0 zoning.

**Marble Falls is the anchor and the reason Burnet is a good prototype.**

```
Marble Falls   source_url  https://services8.arcgis.com/IeXFMFwivjBzu9iB/arcgis/rest/
                           services/Zoning_Official_New/FeatureServer/4
               verification  verified-live
               probe_notes   "Deep probe Official Zoning layer 4; staged 261."
               features_staged  261
               risk_class    ["city-lane-adapter-needed"]

Other six (Bertram, Burnet, Cottonwood Shores, Granite Shoals, Highland Haven,
Meadowlakes):  all "searched-and-absent"
```

So Burnet exercises **both paths in one small county**: one wired-city lane, and six honest
absences that are already evidenced with a probe date. That is exactly the shape a prototype
should have, and it is one city to wire rather than eighteen.

**Scope decision that keeps this off the marathon path:** do NOT chase zoning for the six
absent towns. A card saying "no zoning layer on file for Bertram" is correct behaviour, not a
gap. Thrall is the precedent.

**Known inconsistency to fix in the roster, not just note:** every Burnet place including
Marble Falls carries `status: "NOT-FOUND-UNKNOWN-WHY"` while Marble Falls simultaneously
carries a live URL, `verified-live`, and 261 staged features. The status field is stale or
was defaulted county-wide. A future agent reading that field alone draws the wrong conclusion.

## Success criteria — the gate is NOT one of them

Until the two gates are armed, "Burnet passed" is compatible with Burnet being empty. Judge by:

1. **A live surface probe.** A real Marble Falls address returns a district, a setback table
   and a buildable envelope, cited. A real Bertram address returns geometry, flood and CAD
   attributes, and says plainly there is no zoning layer on file for Bertram. Neither guesses;
   neither silently shows nothing. Instrument: `scripts/surface-probe.mjs`.
2. **An independently derived parcel count** agreeing with what landed, within a declared
   bound, from a different upstream than the pipeline's own.
3. **A named list of defect classes found**, with reproducing fixtures. A farm that finds a
   class it cannot fix has still done its job. Harris' value was never the county, it was the
   multi-shapefile class and the sweep that found it.
4. **Zero county-local patches.** If Burnet needed a code change, it landed upstream and the
   farm re-ran on the new pin.

## Questions you should ask before executing

I expect several of these to be answered differently than I assumed. Push back.

1. **Should the two gates and the three writers be fixed BEFORE farm one, or in parallel with
   it?** I lean before, because the verdict is the deliverable. The counter is that Burnet
   would surface which fixes actually matter. This is the single biggest sequencing question
   and it is genuinely open.
2. **Where does a farm store live?** Neon branch, separate project, or a schema in the
   existing store. I have not read the current Neon topology and I should not guess.
3. **What exactly is "the pipeline SHA"?** Four repos are involved (legacy-design-tools,
   hauska-engine, hauska-factory, plus the atom contract package). Is the pin a manifest of
   four SHAs? Nobody has defined it and the merge gate cannot be built without it.
4. **Does the pre-bake runner live in doc_repo or hauska-factory?** doc_repo holds instruments;
   the factory is the only writer path. I lean factory for anything that gates a write.
5. **Is Burnet's geometry actually loaded, and where?** The inventory says the L2 ingest passed,
   but `txgio_parcel` and `cad_property` are not in the factory store; they are on
   `legacy-design-tools-prod`/neondb. Confirm at source before planning on it.
6. **Does the operator want Marble Falls wired in prototype one, or is county-rails-only the
   prototype?** Wiring one city is the smaller job; it is also the only thing that makes Burnet
   a product rather than a map.

## Standing rules that will save you the mistakes made getting here

- Build from code at a declared SHA, never from defect history. Four of ten known assumptions
  were already fixed and failing closed.
- The enumeration usually already exists. Search before you card.
- A check whose input shares an upstream with what it checks cannot detect truncation.
- Dispatches are compiled via `scripts/dispatch.mjs`, never hand-assembled. The canon gate
  refused three attempts in the previous session and was right every time. Do not use the
  override.
- Never glob across the shared tree. A renumber script rewrote 14 other-seat files in the
  previous session. All recovered, but verify the CONTENT a script changes, not the paths.
- Row IDs collide. Another seat allocates concurrently in the same OPS-16. Check immediately
  before and after writing a row.
- No cost estimates. Operator ruling 2026-09-13.

## State at handoff

Committed `ea3a7fd2` (35 files). Uncommitted and staged-ready: this handoff, the previous
session's handoff package, the second session record, and a two-line `00_current_state.md`
Cotality correction. The session is deliberately NOT closed.
