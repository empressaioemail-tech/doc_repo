---
id: 2026-09-05_ledger_serving_audit
title: Full parcel_record serving-ledger audit — data, gate, allowlist, and deploy layers
status: active
last_updated: 2026-09-05
applies_to: hauska-factory, legacy-design-tools, hauska-map
owner: nick
related:
  - 90_operations/OPS-19b_ctx_pipeline_wrapup_sprint
  - 80_adrs/adr_031_parcel_record_ledger_over_atoms
  - _decisions/2026-09-05_landuse_earned_absence_contract
purpose: Operator asked to audit the whole serving ledger after finding item 9
  (overlayDistricts/maxImperviousCoverPct) had shipped a real data fix that never
  reached customers because of gaps at two other layers. This is that audit —
  every rail checked against all four layers a fix has to clear before it reaches
  a real request, so the same class of gap doesn't keep surfacing one rail at a
  time. Scoped as the input to one final wave, not a to-do list to work through
  live tonight.
---

# Ledger serving audit — four layers, 65 rails

## The four layers, and why all four matter

A rail's data being correct in `parcel_record_cell` does not mean a real customer
request gets it. Four independent things have to be true simultaneously:

1. **Data layer** — the writer job actually reaches a terminal state
   (`value`/`absent-verified`/`not-applicable`/`refused`) for every parcel it's
   responsible for, never leaving a cell `unaccounted` forever.
2. **Gate-verdict layer** — `factory-publish-gate-sched` has to actually evaluate
   that rail. It only evaluates rail keys in `DEFAULT_SCHED_RAIL_KEYS`
   (`SLATE_1_RAIL_KEYS` + `SLATE_1B_RAIL_KEYS`); anything else gets no verdict,
   ever, from the recurring hourly job.
3. **Serve-allowlist layer** — `parcelRecordAllowlist.ts`'s `PARCEL_RECORD_SLATE`
   has to name the `(county, rail)` pair. No entry → always `legacy` (or, for
   rails with no legacy path at all, a typed refusal — see utilityService below).
4. **Deploy-freshness layer** — the Cloud Run job actually running has to contain
   the code for layers 1-3. A merged PR sitting on a stale image changes nothing.

Tonight found real, confirmed gaps at every one of these four layers, on
different rails, independently discovered — not the same bug repeated, four
different failure modes that all produce the identical symptom: "the fix
merged, the data changed, nothing changed for a customer."

## Layer 2/3: full rail inventory (65 rail keys)

Canonical source: `hauska-factory/src/lib/parcel-record-engine/rail-keys.js`
(`PARCEL_RECORD_RAIL_META`, v2, decision `2026-09-01_parcel_record_rails_v2_template`).
5 groups: cad (20), jurisdiction (4), zoning-envelope (19), companion (18), spine (4).

**Only 7 of 65 rails are gate-evaluated at all**, via the recurring hourly job:
`cityLimits`, `flood`, `wells`, `specialDistricts`, `valueHistory` (`SLATE_1`),
`overlayDistricts`, `maxImperviousCoverPct` (`SLATE_1B`, added today, PR #91).

**18 of 65 rails are in the serve-allowlist.** Cross-referencing the two sets:

| Status | Rails | Real consequence |
|---|---|---|
| Gate + allowlist, both current | `cityLimits`, `flood`, `wells`, `specialDistricts`, `valueHistory`, `overlayDistricts` | Genuinely end-to-end today, confirmed live for overlayDistricts (`pass`, 0 unaccounted, all 6 counties). |
| Gate + allowlist, partial | `maxImperviousCoverPct` | 5/6 counties correctly `excluded`; Travis itself `refuse`, 244,669 unaccounted — a real, unresolved gap inside the one county this rail covers (see below). |
| Allowlisted, live via a **frozen one-time manual verdict**, never in the recurring slate | `marketValue`, `assessedValue`, `landValue`, `improvementValue`, `livingAreaSqft`, `yearBuilt`, `utilityService` | Working today (utilityService independently re-verified live: real electric data, `sourceAdapter: parcel_record`). But nothing will ever re-derive these verdicts — a future writer regression or data change will never be caught, because no scheduled job ever looks at them again. |
| Allowlisted, **no gate, no legacy fallback → serving nothing** | `schoolDistrict`, `agValuation` | Every allowlisted county for these two rails serves neither the old value nor the new one. Not stale — absent. |
| Allowlisted, **status genuinely unresolved tonight** | `zoningDistrict`, `setbackFrontFt` (P-106's own fix, shipped earlier today) | The allowlist's own code comment says no gate verdict exists. The deploy record's "live-verified twice" language, read closely, only confirms the route returns a real `401` instead of crashing when unauthenticated — it never exercises the actual value-resolution logic with a real session. Could not settle this without either direct `parcel_gate_verdict` access or credentials to the authenticated research/brief route (property-explorer), neither available this session. **This needs a real answer before anyone treats P-106 as done**, not a doc note. |
| Not allowlisted at all (47 of 65 rails) | All CAD identity fields (`apn`, `situsAddress`, etc.), all 4 spine/geometry rails, 11 of 18 companion rails (`owner`, `permits`, `easements`, `buildingFootprint`, `salesHistory`, `publicRecordRefs`, `ossf`, `mineralRights`, `hoaDeedRestrictions`, `pipelines`, `setbackRules`) | Presumably pre-dates this cutover and still serves from whatever the old path is — plausible, **not independently verified this session**. Treat as unverified, not cleared. |

## Layer 1: data-completeness ("unaccounted forever") defects found in writers

Full sweep of every file in `hauska-factory/src/jobs/` that writes `parcel_record_cell`
(49 files checked, 16 actually touch the table). Confirmed defects beyond the two
already fixed today (overlayDistricts, maxImperviousCoverPct):

- **`agValuation`** — the writer hard-refuses any county outside Travis/Williamson
  (`COUNTY_NOT_IN_SCOPE`), with no not-applicable path for the other 4. 4 of 6
  program counties' `agValuation` cells are permanently `unaccounted`.
- **`schoolDistrict`** — 0-hit and 2+-hit cases are logged to an in-memory
  `anomalies` array that's never persisted; no UPSERT happens for either case.
  Zero forcing function ever resolves these.
- **`zoningDistrict`/`zoningJurisdictionKey`/`zoningProvenance`** — 49 cities have
  no staged zoning layer at all (`tx_zoning_district_staging` has no data for
  them). **This is not a bug in the 23-city join logic** — that logic is proven
  correct (18 cities live, 5 "stamp-gap" cities re-authorized 2026-09-02 after
  tracing a citywide-zero reading to a defect in a different, older tool). It's
  a data-acquisition gap for a different, non-overlapping set of 49 cities. Fix
  is cheap regardless of whether the data ever gets acquired: write an honest
  `refused`/"no staged layer yet" terminal state instead of silent unaccounted-forever.
- **`ingest-existing.js`'s `ingestCadOntoRecords`** (shared by `parcel-record-fill.mjs`
  and, by extension, item 20's landUse work) — `if (!cad) continue`. A parcel with
  zero matched `cad_property` row gets no write for ~15 CAD-scalar rails,
  **`landUseCode` among them**. Self-documented in the code as "the job does not
  patch this." Directly relevant to item 20, which is specifically about landUse
  reaching a real terminal state — this gap should fold into that work, not sit
  separate.
- **The "noGeom" convention** (`flood-ingest.mjs`, `parcel-r4-companions.mjs`
  [wells, specialDistricts], `parcel-utility-service.mjs`) — a parcel with no
  `txgio_parcel` geometry is never spatially tested and stays `unaccounted,
  untouched` forever, by explicit documented design, not accident. Functionally
  identical in effect to the bugs above. **This is the one that matters most**:
  three of these four rails (`flood`, `wells`, `specialDistricts`) are in the
  live gate-evaluated slate — meaning any county with geometry gaps for these
  rails may be structurally unable to ever reach `pass`, regardless of
  correctness everywhere else. Not independently confirmed live tonight
  (blocked by the same DB contention affecting everything else) — worth
  checking before assuming these three rails' gate verdicts are actually clean.

## Layer 2, confirmed live: maxImperviousCoverPct's real Travis gap

Earlier tonight's own close-out claimed "845,157 unaccounted is just the other 5
counties this rail never targets, not a gap." **That was wrong.** Live
`parcel_gate_verdict`: Travis reads `refuse`, `unaccounted_count: 244669`. A real,
substantial chunk of that 845,157 figure is inside Travis itself — almost
certainly the writer's own tracked-but-never-resolved `unresolvedZones` (1+
watershed hit, unresolved crosswalk) and `anomalies` (2+ hit) cases, which the
code deliberately never converts to a terminal state. Needs real investigation.

## Layer 4: deploy-freshness sweep across all 41 Cloud Run jobs

Systematic check, all jobs, all unique image digests, cross-referenced against
`hauska-factory` main's actual commit history (not staleness-by-clock alone —
each flagged job's specific source file was checked for a relevant merged change).

**Found and fixed tonight, in order of discovery:**
1. `factory-publish-migrate` — stale, missing migration 0011. Rebuilt, migration
   re-run, `claims` table schema live-verified.
2. `factory-parcel-overlay-districts`, `factory-parcel-max-impervious-cover` —
   stale, missing the item-9 not-applicable fix. Rebuilt, `--apply` re-run for
   real, live-verified via `parcel_gate_verdict`.
3. `factory-publish-gate-sched` (shared image with `factory-parcel-record-fill`,
   `factory-flood-ingest`, `factory-parcel-r4-companions`) — stale, missing
   item 5's queue-claim wiring AND (after PR #91 landed) the gate-slate fix.
   Rebuilt twice tonight, once for each fix; both now confirmed on a fresh
   digest built after the relevant merge.
4. `factory-conformant`, `factory-conformant-migrate`, `factory-f10-cad-loop`,
   `factory-restamp-access` — stale (2.75 days), missing a `connectionTimeoutMillis`
   fix added specifically after a **real prior incident**: a 2026-09-02 hang with
   zero log output on a stalled TCP handshake (Williamson flood-ingest). This is
   a live incident-class exposure, not a "customer doesn't see the fix" issue.
   Rebuilt and redeployed tonight.

**Found, not fixed — no safe path tonight:**
- `factory-bexar-edges` — 9.9 days stale (the most stale job in the fleet),
  same connectFactory timeout exposure as above. **No checked-in Cloud Build
  pipeline deploys this job at all** — same "no discoverable pipeline" gap the
  2026-09-02 reaper-phantoms sweep already named for 12 other jobs. Reconstructing
  a `gcloud run jobs deploy` command from scratch risks silently dropping a
  secret/memory/timeout flag (deploy-on-next-natural-touch is the standing
  policy for exactly this situation). Current config recorded:
  `command: node src/cli.mjs`, `args: bexar-edges`.
- `factory-bake-migrate` — separate defect, not staleness: calls a CLI subcommand
  (`bake-migrate`) that doesn't exist anywhere in `src/cli.mjs`'s dispatch table
  (45 real subcommands, confirmed none named this). Broken on any image, always
  has been. Given tonight's Wave R discussion (the old conformant-bake pipeline
  may be getting deprioritized, folded into later atomize-CTX work), this may be
  safe to leave broken/retire rather than fix — operator call, not investigated
  further.

## A fifth layer, found after this audit closed: composition-layer silent drop

The LDT lane, live-verifying the frozen-manual-verdict rails while waiting on
Wave 3 item 1, found a real defect in a repo this audit didn't originally scope:
**`hauska-map`**. `marketValue`/`assessedValue`/`landValue`/`improvementValue`
are correctly resolved server-side by `legacy-design-tools`'s
`brokerageNodeFacets.ts` (`attachCadRollOverlaysToFacets`) — but
`hauska-map/apps/property-explorer/api/_lib/atom-chain-to-facets.ts`'s
`mergeBakedBaseFacts` (line 1499) reconstructs the served `baseFacts` object
field-by-field as a hardcoded `{apn, situsAddress, situsCity, situsState,
landUse, acreage}` — it never reads a `cadRoll` key at all (confirmed: zero
mentions of `cadRoll` anywhere in the file). All four dollar fields are
silently discarded one hop downstream of the service that correctly produced
them, before any customer request sees them. Independently verified by the
integration seat by reading the same function.

**First fix (PR #358) landed a second, more subtle bug**, caught by the LDT
lane re-checking its own work against the raw upstream response rather than
trusting the deploy: the real wire shape from `resolveCadRollOverlaysForServe`
is a three-state `CadRollValueWire` object (`{state: "present"|"zero"|"absent",
v, source, vintage, valueBasis?}`), not a bare number — codebase doctrine
elsewhere already treats collapsing a real stored `$0` into `absent` as a
defect class. PR #358's fix checked `typeof === "number"`, false for that
shape, so it silently nulled every field regardless of real upstream data —
the exact same symptom as the original bug, different root cause. **DONE for
real, PR #359 (`2af2375`), deployed and live-verified by the integration seat**:
`marketValue`/`landValue`/`improvementValue` now serve real numbers matching
the raw upstream response exactly (511345/106715/404630 for the test parcel),
`assessedValue` correctly serves `state: "absent"` with a real basis object,
not a silent null.

**Separately flagged, not yet resolved:** `livingAreaSqft`/`yearBuilt` DO
reach customers live today, but sourced from an older `structuralFact` atom
path (`yearBuiltSource: "structural-fact"` in the live payload), not confirmed
to be the newer parcel_record/allowlist-gated version. Cannot yet rule out
that the newer path is *also* being silently dropped by the same
`mergeBakedBaseFacts` gap, just masked because the older path happens to
supply the same field names. Named as open, not guessed at.

This confirms the audit's real lesson generalizes past the four layers
originally scoped: a rail can be correct at every layer inside
`hauska-factory` and `legacy-design-tools` and still never reach a customer,
because of a **fifth layer** — whatever composes the served response one hop
further downstream. Worth treating hauska-map's own composition/merge code as
its own layer to check for any rail this audit called "done."

## Not investigated this session (genuine open questions, not cleared)

- Whether `flood`/`wells`/`specialDistricts`' live gate verdicts are actually
  clean given the noGeom convention above — blocked by DB contention all night.
- The 47 un-allowlisted rails' actual current serve behavior (assumed fine,
  not verified).
- `zoningDistrict`/`setbackFrontFt`'s real live status (needs DB or authenticated
  API access this session didn't have).
- Item 4's Williamson/McLennan vacuous-zero CAD data-shape question (Engine-lane
  territory, unchanged from earlier tonight).
- Item 10's atoms-side owner cross-check (needs `SUBSTRATE_DATABASE_URL`,
  unchanged from earlier tonight).
- Item 20's remaining 4 counties (Neon storage I/O latency, unchanged from
  earlier tonight — needs a real job execution with a proper timeout budget,
  not an interactive query).

## What "one more wave" actually looks like

Roughly four workstreams, genuinely independent of each other:

1. **Close the zoningDistrict/setbackFrontFt gate-verdict question** (P-106) —
   the same fix shape as today's PR #91, if it turns out to need one.
2. **Data-layer fixes**: agValuation's 4-county not-applicable write, schoolDistrict's
   anomaly persistence, zoningDistrict's 49-no-layer-city refusal, the CAD-scalar
   `if (!cad) continue` gap (folds into item 20), and Travis's 244,669
   maxImperviousCoverPct gap.
3. **Promote the 7 frozen-manual-verdict rails** (the 6 CAD dollar fields +
   utilityService) into a real recurring gate slate, or explicitly rule that
   a one-time verdict is acceptable for them and document why.
4. **`factory-bexar-edges`**: either write and check in a real deploy pipeline
   for it, or explicitly accept the incident-exposure risk with a named owner.

None of this is customer-visible breakage today as far as this audit found —
it's coverage and resilience gaps, several with real (if not yet triggered)
incident risk. Worth a full session's attention, not a rushed pass at the end
of a long one.
