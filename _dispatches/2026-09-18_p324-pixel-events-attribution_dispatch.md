CANON-PREAMBLE v49001500
- COTALITY REST IS DEAD, THE VENDOR IS RE-ENGAGED FOR THE FARM, AND WE SHIP WITHOUT IT (operator 2026-09-16, `_decisions/2026-09-16_texas_scaleup_sequence_and_four_rulings.md`; operator 2026-09-17, OPS-16 A-212): when code hits Cotality REST (502/OAuth/fallthrough), re-route to county-gis/public-record and NEVER rotate the credential. The MCP eval channel is live for internal evaluation only. No vendor-sourced value reaches a customer until the commercial agreement is read, and the factory never bulk-calls the vendor. **The vendor is about two weeks out as of 2026-09-17 and NOTHING waits on it:** Cotality is struck from the Phase 0 exit criteria, and every rail that wanted it ships as a DECLARED absence — `unaccounted` at rest, labelled where a customer reads it, never fabricated, never a silent gap, and never relabelled `absent-verified` to clear a gate. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HOLD LIFTED 2026-08-26 for the Factory program (`_decisions/2026-08-26_factory_program_and_hold_lifts.md`); the Bastrop QA condition is cosmetic and does not gate the data path. NO PRIVILEGED DATA and the Hauska spine rule stand.
- THE FACTORY IS THE ONLY WRITER PATH (OPS-19) — one machine built to the MODEL LAW (`19_the_instrument_contract.md`, `_blueprint/10_model.md`, `_blueprint/20_pipeline.md`, `_blueprint/40_rule_register.md`, `51_ingestion_pipeline_reference.md`, `24_instrument_conformance_program.md`; package `dist/*.d.ts` is the tiebreaker); own repo `hauska-factory`, own Neon store; every publish lands on staging before the identical job runs on production; nothing reaches a serving store except through publish; laptop ingest is FROZEN (`_decisions/2026-08-26_ingest_freeze_and_cloud_loader.md`); OPTION A ruled (`_decisions/2026-08-26_factory_model_law_and_option_a.md`): no new county is written on the old shape and old-shape writes ended permanently 2026-08-27. Every lane has its own registered worktree; never build in another lane's checkout. Row-level status lives in `_catalog/program_preambles/OPS-19.md` and `_state/property/STATE.md`, never here.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- MOST-CURRENT SOURCE WINS (operator 2026-09-11) — for setbacks and every dimensional rule, in every city and county, the source with the most recent effective date supplies the value; tier breaks ties only on equal or unreadable dates; dates are read at source (ordinance effective date, ArcGIS `editingInfo.lastEditDate`), never assumed from source kind; an unreadable date produces a conflict row with both values, never a silent pick. Supersedes tier-first ranking in LDT `authoritativeSetbackSource.ts` and layer-23-first in hauska-map. `_decisions/2026-09-11_setback_source_most_current_wins.md`.
- ENVELOPE DRAWN, FIGURE REFUSED (operator 2026-09-11) — Ruling B reversed for the polygon only: map and MCP draw block draw the modelled buildable envelope from the same `place/buildable-envelope` call with its disclosure wherever a district and setback table exist; buildable area and percent stay refused until an envelope atom backs them. Entitlement gate unchanged. `_decisions/2026-09-11_ruling_b_reversed_polygon_only.md`.
- THE LEDGER IS THE SERVING PATH, ATOMS ARE CANONICAL (operator 2026-09-11) — node = identity, atom = one claim from one authority at one time, edge = an atom whose value is a node; a cell is accounting (state, atom reference, provenance, cached rendering keyed to atom version and vocabulary version), never a copied value; one reader in `hauska-engine/services/retrieval-api` walks gated cells and dereferences atoms and every surface and the Hauska MCP catalog consume it; unslated rails refuse, never fall to legacy; one writer mints atom + pointer + rendering in one transaction; one vocabulary module in the atom-contract package. Never add a read path, a vocabulary copy, or a value-holding cell. `_decisions/2026-09-11_ledger_as_serving_path_seven_steps.md`, ADR-031 amendment 2026-09-11, OPS-23 §0.
- DO TOOLING IS CONFIGURED FLEET-WIDE, BUT DOCTL AUTH IS PER-SESSION (operator 2026-09-17, corrected 2026-09-17 per OPS-25 D-11's close) — the `do-apps`/`do-droplets` MCP servers are configured in the global Cursor config on the fleet machine with an agent token scoped to Droplets and Apps only (no account, database, or networking access), and that MCP config travels with any lane using this machine's Cursor. `doctl`'s own CLI auth does NOT reliably carry over to every lane's session (found unauthenticated in D-11's environment) — a lane needing `doctl` specifically, not just the MCP tools, should confirm with `doctl account get` and run `doctl auth init` itself if needed, rather than assume it is live. Do not ask the operator to reconfigure the MCP servers or token; do check `doctl` auth per-session.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

AGENT-CONTRACT v378cd643 — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
interruption recovery, slot law + lease, heavy-scan serialization, verification rules, close schema).
Read it before any work; where this dispatch and the contract disagree, STOP and report.

DEV-PROCESS vbb19bd34 — you are bound by 90_runbooks/DEV_PROCESS.md in full. It governs how work
is SHAPED and how a result is JUDGED: coverage figures travel with their denominator, classes are
measured never subtracted, an instrument's exclusion set is part of its contract, gating indicators are
proven able to fire, paired controls need a divergence test, guardrails that do not survive a clone are
not guardrails. Every rule in it is traced to an incident. Read it before any work.

FLEET-MEMORY v2a98086b — you are bound by 90_runbooks/fleet_memory_practice.md (M0).
The verbatim install block follows. Product-repo agents do not carry .cursor/rules; this is the install.

FLEET MEMORY (M0): As you work, capture build knowledge in a scratch block you return in your close, using four entry kinds — LESSON (a hard-won fact worth a test/note), DEAD-END (a tried-and-failed path + reason, so it is not retried), GROUND-TRUTH (a live-verified state WITH its timestamp), OPEN (a live thread the next context must pick up). Read any scratch context passed to you FIRST before re-deriving. Do NOT promote anything to durable memory yourself — return lessons in your close; the planner gates promotion. Nearing your limit, flush open threads + live ground-truths into your close so the next instance starts warm.

PLAN-ROW: P-324 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-map, legacy-design-tools
FAN-DEPTH: 0
This lane launches NO sub-agents. Do the work yourself. The commit gate refuses a close that declares any (A-181).

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane p324-pixel-events-attribution --seat <your-seat-id> --plan-row P-324 --dispatch _dispatches/2026-09-18_p324-pixel-events-attribution_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane p324-pixel-events-attribution --seat <your-seat-id>

On 2026-09-14 this exact dispatch shape was handed to two sessions at once. One found
out mid-execution from a merged commit appearing in its own fetch.


## Mission — P-324: the pixel, campaign attribution, the four conversion events and share-URL scrubbing, as one change

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-map` and `legacy-design-tools`, one PR
per repo. You do not merge or deploy; the integration seat merges, deploys (cortex-api first, then
Property Explorer) and runs the live checks you name. Any doc_repo change is handed back as a diff in
your close.

**Recompiled 2026-09-18 under OPS-16 A-222.** The operator ruled that P-324 takes in the conversion
events, the Conversions API and share-URL scrubbing staged on top of the pixel commit, and that both
halves ship together (`_decisions/2026-09-18_phase0_closeout_rulings.md`, "P-324 scope"). The first
compile's Gate 1 (probe `dl` before pushing) and its "do not implement conversion events or the
Conversions API" are superseded by that ruling. Read both handoffs in full before anything else:

- `_inbox/2026-09-17_smartsite_meta_pixel_utm_handoff.md`: the base tag and first-touch UTM
  attribution, and the defect it fixes (`peGhlContact.ts` wrote a hardcoded `source-organic` tag on
  every new signup, so a paid click was filed as organic, a wrong value asserted as fact).
- `_inbox/2026-09-18_HANDOFF_meta_pixel_events_and_scrubbing.md`: the events, CAPI and scrubbing,
  what was verified by violation, what was not, and the deploy prerequisites.

### Step 0: bring the work into your own worktrees, byte for byte

None of it is on origin, and part of it is not even committed. It lives in the integration seat's
worktrees, which you may read and must not write:

| Repo | Integration worktree (read only) | Branch | What is there |
|---|---|---|---|
| hauska-map | `P:/seat-worktrees/integration/hauska-map-meta-pixel` | `feat/meta-pixel-and-utm-source` | commit `369fd77` (base tag + UTM), plus **uncommitted** changes: 9 modified and 12 untracked files under `apps/property-explorer` (the events work) |
| legacy-design-tools | `P:/seat-worktrees/integration/ldt-utm-source` | `feat/utm-source-tag` | commit `c47b8c7b` (the source tag resolved from first-touch campaign data), clean |

Create your own registered worktrees. Carry `369fd77` and `c47b8c7b` over as commits
(`git format-patch` or a fetch from the local clone) and the uncommitted events work as a second
hauska-map commit, then prove the transfer: the tree of your two hauska-map commits equals the
integration worktree's working tree for every file under `apps/property-explorer` (a hash comparison,
not a visual one). Only then rebase: both mains have moved (map `0489bc8` to `163fde32` at compile,
through #410 to #420; LDT `7219b707` to `25d1782f`). #416 and #419 changed Property Explorer files
near the ones this touches (`fact-sheet-resolver.ts`, `atom-chain-to-facets.ts`, `pe-record-to-facets.ts`);
declare what moved and resolve conflicts without changing either side's meaning.

### What the change is (verify it, do not re-derive it)

- **No route-scoped secret reaches Meta.** `api/_lib/analytics-url.ts` reports origin plus normalised
  path, never a query string or fragment; `api/_lib/meta-capi.ts` scrubs every `event_source_url`;
  `api/pe-meta.ts` scrubs the client URL, the request referrer and the configured origin;
  `src/lib/meta-events.ts` suppresses the browser leg on an identifier-bearing address or referrer;
  the static `fbq("track","PageView")` is gone from `index.html` and fires from `src/main.tsx` through
  the gate; `vercel.json` sets `Referrer-Policy: strict-origin-when-cross-origin`.
- **Four events, both legs, one dedup id**: `CompleteRegistration` (server only, from cortex's 201 on
  session-exchange, `isNewAccount`), `ViewContent` (inspect card), `Lead` (records request accepted),
  `Share` (grant persisted).
- **Named gap, not built:** `Lead` carries no hashed email from the browser (the session endpoint
  does not return one). Closing it means the records-run endpoint accepts an event id and fires
  server-side. Leave it named.

### Gate 1, as ruled: prove the leak is closed, locally

Suppression replaced the `dl` question, but "moot" is a claim until observed. On a local `vite dev`
server (never a preview: a preview fires the live pixel id with preview URLs), with the real
`fbevents.js` loading, record verbatim what leaves the browser for: `/share?g=<id>`, `/share#<token>`,
`/s/<uuid>`, a parcel deep link carrying `parcelNodeId`, and a plain map load. For the suppressed
routes the record is that no Meta request fired; for the others it is the verbatim `dl` value, which
must carry no identifier. Then the referrer case: land on a share link, act, and show the next event's
URLs carry no grant. Record requests, not summaries.

### Gate 2: the cortex leg's post-deploy check

The canary job's P-279 tagged-revision check runs and must read clean. The shift job's copy cannot run
until P-362 lands (no checkout; its failure reads as "violation"). Say whether P-362 has merged when
you close. If not, the seat checks tagged revisions by hand after the shift, by field, as it did on
2026-09-18.

### Suites

Re-run after the rebase: hauska-map `pnpm test` in Property Explorer (four node gate scripts, then
vitest; 3,295 tests passed before the rebase) and `tsc --noEmit` (pre-existing `TS2307` for
`@hauska/map-renderer` only; name anything new). LDT: the `pe-ghl-contact`, `pe-magic-link` and
`pe-paywall-stripe` integration suites need Postgres with `pgvector` and `postgis` on the **direct,
non-pooled** URL (the harness sets `search_path` as a startup parameter; Neon's pooler rejects it).
Never write that credential into any file.

### Hand the seat the deploy

The seat deploys cortex-api first (session-exchange must accept `campaign` before the app sends it),
graded with `scripts/cortex-canary-compare.mjs`, then Property Explorer. Give the seat, exactly:

1. The Property Explorer env vars, and which are required: `META_CAPI_ACCESS_TOKEN` (the operator
   supplies it from Events Manager), `META_PIXEL_ID` (`1124306790022968`), `PE_SITE_ORIGIN`
   (`https://smartsite.cloud`); `META_TEST_EVENT_CODE` never in production except for a timed test.
   Without the first two the server leg returns `503 capi_not_configured`: a deploy that forgets the
   token looks like a working pixel with no conversions.
2. The live checks, each with its expected result: `POST /api/pe-meta` with
   `{"name":"Lead","eventId":"deploy-probe-1"}` returns 200 with `eventsReceived`, not 503; the tag is
   in `<head>` on the map and absent from share routes; no CSP violation for `connect.facebook.net`;
   a signup with no campaign creates a GHL contact with **no** source tag; `?utm_source=share&utm_medium=share`
   tags `source-share`; `?utm_source=facebook&utm_medium=paid` writes no source tag and logs the
   unmapped entry; `/privacy` serves and shows the 17 September 2026 date. Mark which checks need the
   operator (Events Manager's Test Events view, Pixel Helper in a browser).

### Say this out loud in your close

Organic signup volume **will drop**: signups with no campaign parameters get no source tag where every
one used to be `source-organic`. And from the events handoff: external free signups run about one a
week, far below the roughly 50 a week an ad set needs to optimise, so `ViewContent` is the candidate
optimisation event and `CompleteRegistration` should fire without being tuned on. That is the
operator's call; report it, do not act on it.

### What you must not do

- Do not deploy, and do not ship the base tag without the events work (A-222's reversal: if the
  combined change cannot pass, stop and report; neither half ships alone).
- Do not write in the integration seat's worktrees.
- Do not build the `Lead` server-side email path, a `source-paid` tag, magic-link source tags or GHL
  UTM customFields.
- Do not touch county 48491 in any store.

### Close

Declare: the transfer proof, the rebase result and what moved, both PRs and their suite results, the
verbatim Gate 1 records, whether P-362 has merged, the seat's env var list and live-check list with
expected results, the organic-volume and optimisation-event notes, and `leave_behind`.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-18_p324-pixel-events-attribution_cp1.json
  CP2: _inbox/2026-09-18_p324-pixel-events-attribution_cp2.json
  CLOSE: _inbox/2026-09-18_p324-pixel-events-attribution_close.json
  These paths are relative to the doc_repo worktree the session RUNNING YOU is rooted in: for a
  lane spawned by the dispatch planner that is the planner's worktree; for the dispatch planner
  itself it is its own seat worktree (never P:/doc_repo, the integration seat's checkout). This
  dispatch was compiled in P:/doc_repo. Two lanes in each of waves 1 and 2 wrote
  into the property seat's worktree instead and their artifacts had to be found by hand.
  No notification arrives when a background command finishes: poll with a bounded loop and a
  timeout; a lane that ends its turn waiting for a wake-up stalls (two lanes did, wave 2).

CLOSE SKELETON (the fields the enforcement gate reads; spell them exactly, or the gate refuses
the commit rather than guessing what you meant):
  {
    "lane": "p324-pixel-events-attribution",
    "planRows": ["P-324"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "...",
    "subAgents": { "spawned": <int>, "maxDepth": <int> }
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
  subAgents is required and honest: spawned counts every sub-agent this lane launched, maxDepth
  is the deepest level reached (0 when none), and neither may exceed FAN-DEPTH 0.
