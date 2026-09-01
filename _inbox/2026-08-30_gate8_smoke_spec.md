---
id: gate8_smoke
title: Gate 8 (SMOKE) — buildable specification, plus a short gate 7 sketch
date: 2026-08-30
status: scratchpad spec for the planner; NOT canon, NOT committed
author: in-session read-only design review (CANON_OVERRIDE / DISPATCH_OVERRIDE)
seed: 28_THE_BASTROP_MOLD_engine_build_spec.md PART 2 gate 8
---

# Snapshot

    doc_repo            main            577f659d743a218f77e8d937f1888fb16fed273f
    hauska-map          origin/main     a275a45   (local worktree 237 behind; every
                                                   read below is `git show origin/main:<path>`)
    live probes         2026-08-30      https://smartsite.cloud
                                        https://property-explorer-xi.vercel.app
                                        https://cmdcenter-blush.vercel.app
    local node          v24.11.1        globalThis.WebSocket === function
    local chrome        C:/Program Files/Google/Chrome/Application/chrome.exe

Everything asserted as live below was produced this session by a bounded probe or a
bounded headless run. Re-run the instrument before quoting any of it later.

# 0. What this document is

The mold names gate 8 and hands over a working skeleton. This turns the skeleton into
something a lane can build without re-deriving a decision. It invents no framework and
adds no dependency: Node's built-in `fetch`, Node 22+ global `WebSocket`, and a Chrome
binary. That is the whole dependency set, and it is the set the mold's seed named.

I built the seed's headless walk this session and ran it against production, so the
mechanism is not theoretical. It works, it found things, and it also produced one false
finding that I caught. That false finding is now a mandatory requirement (B4).

# 1. The scope boundary against the S1-S14 scrub

Say this once and hold it, because the two will otherwise half-cover the same ground and
neither will be trusted.

**The scrub measures the store at rest.** SQL, 100% of rows, county-wide cardinality and
correctness. S14 (edge reciprocity on the `ST_Intersection >= 0.9` predicate) is a
PostGIS computation over 26,846 edges. That is the scrub's shape: exhaustive, offline,
numeric.

**Gate 8 measures the transport leg.** Does the deployed application, at the URL a
customer or an operator actually opens, render the state the wire carries, and is the
build serving that URL the build that was merged. Small gold set, live, in a browser.

The rule that keeps them apart: **gate 8 never emits a count or a percentage.** If a
number of rows appears in gate 8's output, gate 8 is doing the scrub's job and the
overlap has begun. Gate 8 asserts about named parcels, one at a time, by name.

The corollary, which is the honest half: gate 8 cannot tell you that 723 retired edges
are serving. It can tell you that the edge served on gold `48021:34137` carries a retired
provenance string, which it does today. Specimen, not population. Section 9 marks that as
a partial catch, not a catch.

# 2. Where it lives, who owns it, what it is called

    repo        empressaioemail-tech/hauska-map          (owns BOTH surfaces and both
                                                          Vercel projects; the CC and PE
                                                          deep-link contracts are defined
                                                          in its source)
    seat        property                                  (_catalog/seat_register.json)
    path        scripts/gate8/
    entrypoint  node scripts/gate8/run.mjs --surface pe|cc|both
                                           --county <fips>
                                           --sha <commit>
                                           --golds scripts/gate8/golds.json

Engine-core does not host it. The mold records gate 8 as missing "in engine-core", but
the surfaces, the testid contract, the hash contract and the deploy paths are all in
hauska-map, and a gate that lives away from the contract it asserts drifts from it. The
factory calls gate 8 across the repo seam by `repository_dispatch` (section 8), which is
the honest form of the coupling rather than a second implementation.

# 3. Components

    scripts/gate8/
      run.mjs            driver: parses args, orders the arms, writes the record, sets exit code
      cdp.mjs            ~120 lines. spawn chrome --headless=new --remote-debugging-port,
                         poll /json/list for a page target, open the WebSocket,
                         Page.enable / Runtime.enable / Page.navigate / Runtime.evaluate /
                         Page.captureScreenshot. Hard timeout with a SIGKILL in `finally`.
      settle.mjs         per-surface terminal-state predicates (B4). No sleeps anywhere else.
      walk.mjs           the deep-link walks and the DOM extractors
      wire.mjs           direct BFF fetch, the second reader
      authority.mjs      the jurisdiction's own public GIS, validation only
      assert.mjs         the assertions, one exported function each, each independently runnable
      golds.json         the fixture manifest, both arms
      selftest.mjs       runs every known-violation fixture and requires each to FAIL
      fixtures/          the stub server and stub payloads for the violation arm
      runs/              one JSON record per run

`cdp.mjs` was proven this session. Working shape:

    const chrome = spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + PORT,
      '--user-data-dir=' + PROFILE, '--no-first-run', '--no-default-browser-check',
      '--disable-gpu', '--window-size=1400,1000', 'about:blank'])
    // poll http://127.0.0.1:PORT/json/list for type==='page', take webSocketDebuggerUrl
    // new WebSocket(url); {id, method, params} out, match m.id on the way back

Two traps I hit, and the lane will hit them too. `--user-data-dir` must be an absolute
path that exists on the platform running the job; an unset `$TMPDIR` produced "no CDP
target" and no other symptom. And CI's node must be 22 or higher for the global
`WebSocket`. The existing hauska-map workflows pin `node-version: 20`, which has no
global `WebSocket`. The gate 8 job pins **24**.

# 4. Contracts the gate stands on (verified in source, origin/main)

**Command Center hash routing** is real and precise, in
`apps/command-center/src/admin/control/center/useActivePanel.tsx`:

    #panel=<id>&<k>=<v>&...
    NODE_LIST_HASH_KEYS = ['county','ntype','q','offset']              (NodeGraph.tsx:475)
    CONTEXT_PARAM_KEYS  = ['addr','apn','eng','j','lat','lng','node']  (activeContext.ts:13)

**The panel fallback is a trap and it is load-bearing.** `parseHash` does:

    panelId = PANELS.some((p) => p.id === id) ? id : DEFAULT_PANEL_ID

An unknown or renamed panel id silently renders the default panel. A naive walk that
navigates `#panel=node-graph` and asserts "some content appeared" passes forever after
someone renames the panel. Assertion B2 exists solely for this, and it carries its own
canary, because an assertion guarding a silent fallback is exactly the kind that goes
vacuous unprovoked.

**Property Explorer deep links** are `?parcelNodeId= | ?parcel= | ?address=`, read by
`deepLinkLookupQuery` in `apps/property-explorer/src/lib/parcel-lookup.ts:316`, with a
test at `parcel-lookup.test.ts:44`. Any of the three also dismisses the cold open
(`App.tsx:54-56`), so the walk needs no click to get past it.

**PE renders machine-readable state**, which is what makes this gate meaning-shaped
rather than a text scrape. Every fact row (`InspectCard.tsx:1930-1945`) carries:

    data-testid  data-state  data-absent  data-verdict  data-silent-empty
    plus data-testid="layer-absence-basis" holding layerProv.basis

Confirmed live on `48021:34137`: `inspect-landuse[data-state=present]`,
`inspect-zoning[data-state=present]`, `inspect-setbacks[data-state=present]`,
`inspect-living-area[data-state=absent-covered]`, `inspect-well[data-state=pending]`.
Assert on these attributes, never on prose. Prose changes with a copy edit; state does not.

# 5. The arms

## G8-A. Build identity

The mold calls the bundle marker load-bearing. It is more load-bearing than the mold
knew, because **there is no marker today and nothing writes one.** Verified: neither
`apps/command-center/vite.config.ts` nor `apps/property-explorer/vite.config.ts` defines
one, and the deployed PE bundle (`/assets/index-Bt59CzqH.js`, 1,973,692 bytes, fetched
this session) contains no `BUILD_SHA`, no `__BUILD*`, and no 40-hex string at all.

### How the marker gets in

1. Both vite configs gain

        define: {
          __HAUSKA_BUILD__: JSON.stringify(
            process.env.VERCEL_GIT_COMMIT_SHA ||
            process.env.HAUSKA_BUILD_SHA ||
            'UNSTAMPED')
        }

2. Each app's `main.tsx` writes it somewhere that cannot be tree-shaken and is readable
   two ways:

        document.documentElement.dataset.hauskaBuild = __HAUSKA_BUILD__
        globalThis.__HAUSKA_BUILD__ = __HAUSKA_BUILD__

   The dataset write survives minification because it is an observable side effect, and
   it is readable from the DOM without evaluating anything.

3. **`'UNSTAMPED'` must FAIL the gate.** This is the whole difference between a marker
   and a ceremony. A default that passes is the `BP-CONTENT-01` shape: a control that
   exists and cannot fire.

4. Who supplies the sha, and the trap. Vercel injects `VERCEL_GIT_COMMIT_SHA` on
   git-linked deploys. The PE deploy in
   `.github/workflows/property-explorer-sync-retrieval-key.yml` is a **CLI** deploy
   (`vercel deploy --prod --yes --token ...`), and a CLI deploy from a checkout is not
   guaranteed to carry it. The deploy step therefore passes it explicitly:

        vercel deploy --prod --yes --token "$VERCEL_TOKEN" \
          --build-env HAUSKA_BUILD_SHA="$GITHUB_SHA"

   Verify by violating: remove the `--build-env` once, deploy to a preview, and confirm
   the gate fails on `UNSTAMPED`. If it passes, the define is not wired.

### Assertions

    A1  GET https://<host>/  -> 200; extract every /assets/index-*.js from the HTML
    A2  GET that bundle      -> contains the exact sha under test. Absence is FAIL,
                                never "marker not found, skipping"
    A3  Runtime.evaluate     -> document.documentElement.dataset.hauskaBuild === sha
    A4  Run A1..A3 against EVERY production alias, enumerated, not just the apex

A2 and A3 are two readings of one upstream, so they are internal consistency, not two
derivations. Name it as such in the output. A3 still earns its place: A2 proves the string
is in the file, A3 proves it survived into the executed module graph, and a
dead-code-eliminated marker is a real failure mode.

A4 is not optional. `smartsite.cloud` and `property-explorer-xi.vercel.app` served the
identical bundle hash this session (`index-Bt59CzqH.js` on both), which is the healthy
case. A control that checks the apex and not the second alias is over-narrow, and the
apex passing proves nothing about an alias pointing at an older deployment.

## G8-B. Deep-link integrity

    B1  CC: navigate '#panel=node-graph&county=<fips>'
        -> settle -> [data-testid=county-node-list] present, innerText contains <fips>
        VERIFIED LIVE: cmdcenter-blush.vercel.app renders county-node-list,
        node-list-type-parcel, node-list-type-road, node-list-search, node-list-apply
        for #panel=node-graph&county=48021&q=34137, unauthenticated.

    B2  after every CC navigate: location.hash still equals the requested hash AND the
        target panel's own root testid is present.
        CANARY, run every time, not once: navigate '#panel=__gate8_nonexistent__' and
        require B2 to FAIL. If the canary passes, B2 is vacuous and the run is refused.

    B3  PE: navigate '?parcelNodeId=<node>'
        -> settle -> [data-testid=inspect-card] present, and [data-testid=inspect-title]
        innerText equals wire baseFacts.situsAddress; or, where the wire has no situs,
        [data-testid=inspect-no-address] exists and the title is the no-address string.

    B4  SETTLE PREDICATE, MANDATORY, PER SURFACE, NEVER A SLEEP.

### B4 is here because I got it wrong

My first headless run against `smartsite.cloud/?parcelNodeId=48021:34137` returned:

    inspect-card: "Selected parcel / No street address on the county record /
                   Reading this parcel..."

while the wire for that same parcel carries `situsAddress: "908 PINE , BASTROP, TX
78602"`. That reads as a serious surface defect. It is not. My poll predicate was "does
the container exist", which is satisfied by the loading state, so I sampled at roughly
600 ms and reported a transient. With a terminal-state predicate the same URL renders
correctly: title `908 PINE , BASTROP, TX 78602`, zoning `SF-1`, setbacks
`F 25 ft . S 5 ft . Corner 15 ft . R 25 ft`.

The result looked like a big catch, which is precisely why it needed interrogating. The
requirement that falls out: the predicate is **terminal state**, defined per surface as no
loading sentinel in the container and two consecutive identical reads 500 ms apart. A
predicate satisfiable by a loading state produces false failures, and a gate that cries
wolf is retired by the fleet within a week, which is the same outcome as not having one.

Timeout on the settle predicate is `refused`, never `pass` and never `absent`.

## G8-C. Wire against DOM

For each gold: fetch `/api/spine/property-atoms/<node>/facets` directly, read the DOM, and
require agreement on **state**. Vocabulary may differ; state may not. This is the plan's
serve-path parity rule applied to the browser.

    C1  inspect-zoning[data-state]=present  <=>  facets.zoning.district non-empty
    C2  inspect-setbacks[data-state]=present <=> envelope.setbacks scalars exist,
        AND the four rendered numbers equal front / side_interior / side_corner / rear
        from the wire. Present-ness alone is presence-shaped and worth little.
    C3  landUseFact.state==='present' => the landuse row is not an absent state.
        AND baseFacts.landUse must not be null while landUseFact.landUseCode is non-null.
    C4  envelope.status==='ok' && buildableAreaSqFt>0 => the buildable row is not absent
    C5  every row with data-absent="true" has a non-empty layer-absence-basis, AND that
        basis names its own subject (contains the parcel's fips or a parcel-specific
        token). Per-parcel, so it does not depend on the gold set's size.
    C6  absence clock: request the same node twice, 10 s apart. The absence record's
        evaluatedAt / probed_at must be identical across the two, and must not sit within
        +/-5 s of either request time.
    C7  no served fact carries a retired provenance string:
        road-class-setback-table | descriptor-fixture | storage-port-proof/phase-1a |
        a currentEditionId pointing at a repealed edition
    C8  across the gold set, boundaryEdgeFact.role and .adjacencyKind are inhabited by
        more than one value (the one-inhabitant shape, observed at the serve surface)

**C3 is internal consistency and I am labelling it as such.** One upstream fabricates both
halves of `baseFacts.landUse` and `landUseFact.landUseCode`, so the check catches merge
and transcription errors, not a wrong source. It catches this defect class exactly, and it
is not a substitute for D.

**C6 is a genuine second derivation**: two independent request clocks. If the stamp moves
with the request, it is the request clock. That is the correct instrument for that defect
and it needs no second store.

### What C found live, today, on the gold

Fetched `https://smartsite.cloud/api/spine/property-atoms/48021:34137/facets`:

    baseFacts.landUse                    null
    facetCoverage.landUse                false
    provenance.landUseSource             null
    landUseFact.state                    "present"
    landUseFact.landUseCode              "A1"                        <- C3 FIRES

    envelope.status                      "ok"
    envelope.buildableAreaSqFt           9350
    DOM accordion body                   "Buildable  Not stamped here"  <- C4 FIRES

    boundaryEdgeFact.setback.provenance  "road-class-setback-table"  <- C7 FIRES
    boundaryEdgeFact.setback.atomCitation "bastrop_tx"
    boundaryEdgeFact.adjacencyKind       "ROW" with parcelNeighborPropId "34121"

    snapshotAt / bakedAt                 2026-07-31T15:13:47.773Z  (30 days stale)

Three assertions fire on day one against the reference county's gold parcel. A gate whose
first run is green is a gate nobody has seen work. This one is not that.

On C4, one caution for the lane. `liveBuildablePct` reads `env.summary.buildableAreaPct`,
a percentage, while the facets envelope carries `buildableAreaSqFt`. The disagreement is
real and the gate should fail on it. Whether the root cause is a missing percent field or
a fallback client that did not fire is a diagnosis for whoever fixes it, not a claim this
spec makes.

On C7, one dependency to write down now: the live specimen is the violation fixture. When
the retired path is removed, C7 loses its proof and must be re-armed against a stub in the
same change, or it silently becomes a passing check with nothing behind it. **A violation
fixture that gets fixed is how a gate goes vacuous.**

## G8-D. Authority arm, the one independent derivation

For three to five named golds, compare the served value against the jurisdiction's own
public record, fetched directly by the gate:

    zoning district   <-  Zoned_Parcels/FeatureServer/83, ZoneTypeClass domain NAME
    setback scalars   <-  Parcels_One_Click/FeatureServer/23, cited to Ordinance_Link

Rules inherited verbatim from the mold and not negotiable: the authoritative signal is
**validation only and never a model input**; probe parcels are drawn from the public
authoritative layer, never from anyone's intuition about which parcel is interesting; and
both polarities are probed (a gold that must show a district, and one that must honestly
decline).

Disagreement is a FAIL unless the payload already flags it. The mold's gate (d) says the
per-parcel record wins for the served number and the disagreement is flagged in
provenance. The gold already does this: `envelope.secondSource` records layer 83 saying
30/10/20/30 against layer 23's 25/5/15/25, with the text "the two city schedules conflict,
verify which is in effect with the city". So D's shape is: the served number matches
layer 23, and where layer 83 differs, the flag is present. Both halves, or fail.

Unreachable authority (ArcGIS 500, DNS failure, the Lockhart NXDOMAIN shape) is
`unmeasured` and the run exits non-zero as `refused`. Tooling fails loud. It does not
quietly drop D and report the other arms green.

## G8-E. Timing and cold start

Wall time per probe against the budget already baked in the mold (MCP to engine 50 s
inside PE's 60 s function cap). A first hit that times out, is retried once, and passes is
reported as the distinct verdict `pass-after-cold-start`. It is not a silent pass, because
the cold-start window is the exact thing that bit this operation before.

## G8-F. Layer probes

The mold's seed also names per-layer live probes: a hydrology POST with a fixture bbox, a
facets GET, an MCP `tools/call` refresh and download asserting real `%PDF` bytes and a
page count. Keep this list **thin and gold-derived**: only the BFFs a gold actually
exercises. A probe list that grows to cover every BFF becomes a second uptime monitor and
will be muted.

# 6. Verdicts, records, and the absence of a skip

Verdict vocabulary is exactly `pass | fail | refused | pass-after-cold-start`.

**There is no `skip`.** No Chrome is `refused`, exit 2. A missing gold is `refused`. An
unreachable authority is `refused`. This is the direct answer to the LDT divergence test
that skips in CI: a control that removes itself when its precondition is missing reports
success and enforces nothing.

Every run writes `scripts/gate8/runs/<utc>-<sha>-<fips>.json` naming the commit, the
marker read from each alias, every gold by id, every assertion by id with its verdict and
its two inputs, timings, the Chrome and Node versions, and the URLs fetched. **A count is
not a record.** The record is uploaded as a CI artifact and its one-line close string goes
into the job summary.

`Page.captureScreenshot` is in the mold's seed and it belongs here, with one constraint: a
screenshot is **evidence attached to a failing assertion**, never itself an assertion. A
screenshot a person has to look at is not a control. Capture on fail only.

# 7. Fixtures, both arms

## Known-good

`48021:34137` Bastrop, 908 PINE, SF-1, zoning and setbacks and flood present,
`cityLimitsFact.status = incorporated`. Verified through the full walk this session.

Two more golds are needed and are named by the lane: one in a second county so C8 and the
schema-shape sampler have something to compare against, and one deliberate honest-absence
parcel (unincorporated, where setbacks are correctly `not-applicable`) so the gate proves
it can pass on an absence rather than only on a present value.

## Known-violation, run on every invocation, each must FAIL its own assertion

    F1  g8-bad-panel          '#panel=__gate8_nonexistent__'                 -> B2 fails
    F2  g8-bad-marker         assert deployed bundle carries 000...0         -> A2 fails
    F3  g8-stub-absent-zoning stub DOM data-state=absent-covered on zoning
                              + stub wire zoning.district="SF-1"             -> C1 fails
    F4  g8-null-landuse       stub wire landUseFact.landUseCode="A1"
                              + baseFacts.landUse=null                       -> C3 fails
                              (ALSO fires against live production today)
    F5  g8-request-clock      stub server returning evaluatedAt=now() each
                              request                                        -> C6 fails
    F6  g8-identical-basis    two stub parcels, byte-identical basis         -> C5 fails
    F7  g8-retired-provenance the LIVE gold's road-class-setback-table       -> C7 fails
                              (re-arm against a stub when the path is removed)
    F8  g8-all-null           every field null                        -> the walk fails

F8 exists because `BP-CONTENT-01`'s self-test asserts that an all-null payload passes.
That is the specimen this operation keeps producing, and gate 8 must be born immune to it.

F3 through F6 and F8 run against a local stub server on `127.0.0.1`, so the violation arm
does not depend on production being broken. F2 and F7 run against production. F1 needs
neither.

`selftest.mjs` runs F1 to F8 and **exits non-zero if any of them passes.** `run.mjs`
invokes `selftest.mjs` first and refuses the whole run if the self-test is not clean. A
gate that has not been observed failing this invocation is not trusted this invocation.

# 8. The three-question gate, answered

**1. What executes it.** `node scripts/gate8/run.mjs` in a GitHub Actions job named
`gate8` on `empressaioemail-tech/hauska-map`, `runs-on: ubuntu-latest`,
`node-version: 24`, using the runner's preinstalled `google-chrome`. If Chrome is not on
PATH the job is `refused`, not skipped.

**2. What triggers it.** Four triggers, because one is never enough:

    (a) the step immediately AFTER `vercel deploy --prod` in
        property-explorer-sync-retrieval-key.yml. It extends the existing
        "Live verify PE facets" step, which today checks only the wire and would not
        have noticed any of C1 through C8.
    (b) the equivalent job on the CC deploy path.
    (c) repository_dispatch: [gate8], fired by the factory publish job for a named
        county, before that county's close line may be written.
    (d) schedule: daily cron. A deployed app rots without a commit. A key rotation, a
        BFF change, a store change, or a dashboard rollback all break the surface with no
        merge to hang a trigger on.

**3. What fails when it is violated.** A non-zero exit fails the job, which fails the
deploy workflow, and the factory publish job treats a non-green `gate8` dispatch as a
refusal so the county close line cannot be written.

**Is the thing that fails running in production today? No. Gate 8 does not exist.** The
mold has recorded it as a prerequisite since 2026-07-28 and P4 is the fan-out it forbids
without one. That is the finding, and no part of this spec should be read as describing a
control that is currently enforcing anything.

**4. What bypasses it.** The answer is not none.

    - A laptop `vercel deploy --prod`. This is the NORMAL deploy path for hauska-map today
      (no auto-deploy on merge). CI never sees it. Partly mitigated: a laptop deploy
      without --build-env stamps UNSTAMPED, so the next gate run fails, and the cron arm
      catches it within 24 h. NOT CLOSED. Converted from invisible to detectable.
    - A Vercel dashboard promote or rollback to an older deployment. The marker will not
      match HEAD on the next run, but nothing fails at the moment of promotion.
    - A change touching only api/*.ts with no bundle change. The marker is unchanged and
      correct. Caught by the wire arm only if a gold exercises that BFF. Named limitation.
    - Preview deployments and any alias not enumerated in A4. Enumerate them or they are
      unchecked.
    - Reading a gold that has been quietly warmed for the gate. Mitigation: golds are
      drawn from the rendered set (mold ruling R11/R14), not curated, and the gold file is
      reviewed when it changes.
    - There is deliberately NO override flag. Do not add one. The dispatch-override log
      already shows what a hatch becomes: 16 rows, 11 in one day, every reason string
      identical.

# 9. Per-defect coverage, honestly

| Defect that reached production this session | Gate 8 | How, or why not |
|---|---|---|
| `baseFacts.landUse: null` on a known A1 | CATCHES | C3, and it fires live today. Note: it does NOT reach the DOM, because PE reads `landUseFact` and renders `A1`. A DOM-only gate misses this entirely. It is caught only because the gate reads the wire as a second reader. |
| PE says "not stamped" where zoning is present | CATCHES | C1 for zoning, C4 for the buildable variant. Live specimen: wire `buildableAreaSqFt: 9350`, DOM "Buildable Not stamped here". |
| `absent-verified` on the request clock, `basis` identical across parcels | CATCHES | C6 (two requests, two clocks, a genuine second derivation) and C5 (basis must name its own subject). Both have stub violation fixtures, F5 and F6. |
| 723 retired boundary edges serving | PARTIAL | C7 catches a retired-provenance edge ON A GOLD, and does today. It cannot see 723. That is a store-wide count and belongs to the scrub and to the P1 serve-path `status` filter. Specimen caught, population missed. |
| `DrawEdge.state` a literal with one inhabitant | MISSES | And should. The correct control is the type: widen to a real union and every consumer fails to compile, which has no trigger to be missing and no call site to be absent. C8 can observe one inhabitant across the gold set, which on a three-gold set would false-pass constantly. Do not use gate 8 for this. |
| Schema version unchanged when the leaf shape changes (Travis emits `zoning.district` undefined where Bastrop does not) | PARTIAL | Only if the gold set spans both counties, and then only as a sampler: for two golds in different counties, the leaf key set under a named facet must match or `schemaVersion` must differ. That IS two independently produced payloads, so it is meaning-shaped, but it is a sample and not a proof. The durable form is a schema version derived from the leaf shape by content hash, in the writer. Recommend that, and mark gate 8's version as a sampler in its own output. |

# 10. What gate 8 does not cover

No county-wide count or percentage, ever. Store correctness at rest (S1 to S13). Edge
reciprocity across the population (S14). Cost (gate 7). Visual layout and the Sheet
Standard, which have their own tests. Authenticated and paid-tier content: the anonymous
walk sees the Studio gate copy on `inspect-owner`, so gate 8 asserts the gate renders,
never that the paid data is right. Anything that would require a person to look at
something: screenshots are failure evidence, and if any assertion here ends up depending
on someone noticing, it has stopped being a control and should be deleted rather than kept
as reassurance.

# 11. Build order for the lane

    1. golds.json + wire.mjs + assert.mjs C1-C7, no browser.       Fires C3/C4/C7 today.
    2. fixtures/ + selftest.mjs F3-F6, F8.                          Proves C can fail.
    3. cdp.mjs + settle.mjs + walk.mjs, PE only.                    B3, B4.
    4. The vite define + main.tsx write + deploy --build-env.       Makes A possible.
    5. A1-A4 + F2.
    6. CC walk, B1, B2 + F1.
    7. authority.mjs, D.
    8. Wire the four triggers.

Steps 1 and 2 are the whole value on their own and need no browser. If the lane runs out
of room, stopping after step 2 still leaves a gate that can fail and does. Stopping after
step 3 without step 4 leaves the Vercel no-auto-deploy trap wide open, which is the one
thing the mold explicitly says the bundle check exists to close, so do not stop there.

# 12. Gate 7 (TALLY + COST) — short sketch

Structural commitment #3 is under $200 compute plus one hour human review per new
jurisdiction, with a hard kill at three counties. The mold records it as not measured in
code, and that is still true.

**What has to be instrumented.** There is no cost record at all today, so the first move
is not "measure cost", it is "make the run emit something a cost can be computed from".
Per county-onboarding run, emit one row naming: the Cloud Run job execution ids with wall
seconds and the vCPU/memory tier, Cloud Build minutes, the Neon compute-hours delta across
the run window, external API call counts by host, and `humanReviewMinutes` as an
explicitly entered field. Cost then becomes a SELECT over that row, not an estimate.

`humanReviewMinutes` starts as `unmeasured`, never 0. Absent, zero and unmeasured are
three states, and a fabricated zero enters the average without announcing that it was
invented.

**The cheapest honest version, which can ship before any telemetry exists.** Refuse to
close a county that has no cost record, and refuse to close one whose
`humanReviewMinutes IS NULL`. That is one column and one check, it fails closed on the
unmeasured half rather than passing on a fabricated zero, and it is a real gate on day
one. The `> $200` clause is added the moment the compute fields are populated, and until
then the gate honestly enforces "we know what this cost" rather than "this was cheap".

Note the distinction that keeps this a control: `humanReviewMinutes` is entered by a
person, but nothing depends on a person *noticing* anything. The refusal fires by itself
when the field is null. An input a control requires is not the same as a control that
requires attention.

**The tally half.** Coverage as a live SELECT per rail per county at close, compared
against the previous close for the same county; a decrease refuses. Do **not** compute a
headline percentage inside gate 7. The ledger's parcel-weighted binary rule already
governs how a percentage is formed, and a second instrument re-deriving it will disagree,
which is exactly the shape of the open McLennan leave-behind where two instruments differ
by 10 rows.

**Verify by violating.** Attempt a close with the cost row deleted and confirm refusal.
Attempt a close with `humanReviewMinutes` null and confirm refusal. Attempt a close with a
$201 row and confirm refusal. A gate 7 observed only on clean closes has not been observed
working.

**What bypasses it.** Anyone running the writers outside the job, exactly as with gate 8.
Same answer: not closed, made detectable, and worth saying out loud rather than claiming a
perimeter that does not exist.
