CANON-PREAMBLE v9e22f2c4
- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HOLD LIFTED 2026-08-26 for the Factory program (`_decisions/2026-08-26_factory_program_and_hold_lifts.md`); the Bastrop QA condition is cosmetic and does not gate the data path. NO PRIVILEGED DATA and the Hauska spine rule stand.
- THE FACTORY IS THE ONLY WRITER PATH (OPS-19) — one machine built to the MODEL LAW (`19_the_instrument_contract.md`, `_blueprint/10_model.md`, `_blueprint/20_pipeline.md`, `_blueprint/40_rule_register.md`, `51_ingestion_pipeline_reference.md`, `24_instrument_conformance_program.md`; package `dist/*.d.ts` is the tiebreaker); own repo `hauska-factory`, own Neon store; every publish lands on staging before the identical job runs on production; nothing reaches a serving store except through publish; laptop ingest is FROZEN (`_decisions/2026-08-26_ingest_freeze_and_cloud_loader.md`); OPTION A ruled (`_decisions/2026-08-26_factory_model_law_and_option_a.md`): no new county is written on the old shape and old-shape writes ended permanently 2026-08-27. Every lane has its own registered worktree; never build in another lane's checkout. Row-level status lives in `_catalog/program_preambles/OPS-19.md` and `_state/property/STATE.md`, never here.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- MOST-CURRENT SOURCE WINS (operator 2026-09-11) — for setbacks and every dimensional rule, in every city and county, the source with the most recent effective date supplies the value; tier breaks ties only on equal or unreadable dates; dates are read at source (ordinance effective date, ArcGIS `editingInfo.lastEditDate`), never assumed from source kind; an unreadable date produces a conflict row with both values, never a silent pick. Supersedes tier-first ranking in LDT `authoritativeSetbackSource.ts` and layer-23-first in hauska-map. `_decisions/2026-09-11_setback_source_most_current_wins.md`.
- ENVELOPE DRAWN, FIGURE REFUSED (operator 2026-09-11) — Ruling B reversed for the polygon only: map and MCP draw block draw the modelled buildable envelope from the same `place/buildable-envelope` call with its disclosure wherever a district and setback table exist; buildable area and percent stay refused until an envelope atom backs them. Entitlement gate unchanged. `_decisions/2026-09-11_ruling_b_reversed_polygon_only.md`.
- THE LEDGER IS THE SERVING PATH, ATOMS ARE CANONICAL (operator 2026-09-11) — node = identity, atom = one claim from one authority at one time, edge = an atom whose value is a node; a cell is accounting (state, atom reference, provenance, cached rendering keyed to atom version and vocabulary version), never a copied value; one reader in `hauska-engine/services/retrieval-api` walks gated cells and dereferences atoms and every surface and the Hauska MCP catalog consume it; unslated rails refuse, never fall to legacy; one writer mints atom + pointer + rendering in one transaction; one vocabulary module in the atom-contract package. Never add a read path, a vocabulary copy, or a value-holding cell. `_decisions/2026-09-11_ledger_as_serving_path_seven_steps.md`, ADR-031 amendment 2026-09-11, OPS-23 §0.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

AGENT-CONTRACT v79be86e2 — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
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

PLAN-ROW: P-176 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: doc_repo


## Mission — P-176: Cotality bake-off on sixty parcels, measured against ground truth

You are the LANE PLANNER for this row. You MAY spawn sub-agents under
`90_runbooks/AGENT_CONTRACT.md` section 1. Two rules on that, and they are not
negotiable: **verification never delegates below you** (a sub-agent produces an
artifact and hands it back, you check it), and **you do not return while a sub-agent
is still running** — a coordinator that fans out and returns abandons its workers.
Sub-agents do not touch git. You commit, after reading the diff.

### Why this row exists

Cotality's commercial agreement is arriving and cannot be renegotiated. Before any
money moves we measure the vendor against ground truth we already own. This is the only
moment where we can check a data vendor's accuracy against six counties of
primary-source parcel data before contracting, and no competitor buying the same feed
can do it.

This is INTERNAL EVALUATION and must stay there. The 2026-07-14 MCP eval agreement
carries a Closed-Secure-System clause: outputs may NOT ship to end users, no public
briefs, no map layers, no customer-visible slots. Nothing you produce reaches a surface.

### Where you work

`P:\doc_repo`, your own worktree, your own branch. The integration seat owns no product
repo. You write NOTHING to any product repo and NOTHING to any production store. Every
database statement you issue is a SELECT.

Declare your snapshot (repo, branch, commit) in your first output.

### Credentials, and the one thing you must not do

The live channel is the MCP **eval** tier:

```
gcloud secrets versions access latest --secret=COTALITY_MCP_UAT_CLIENT_ID     --project=hauska-prod-497015
gcloud secrets versions access latest --secret=COTALITY_MCP_UAT_CLIENT_SECRET --project=hauska-prod-497015
```

Read-only store access:

```
gcloud secrets versions access latest --secret=FACTORY_DATABASE_URL_RO --project=hauska-prod-497015
```

**The three REST credential sets (`COTALITY_PROPERTY_*`, `COTALITY_SPATIALTILE_*`,
`COTALITY_RISKMETER_*`) are DEAD and must NOT be touched.** They return
`oauth.v2.InvalidClientIdentifier`, verified live 2026-09-12. Standing directive from
`_decisions/2026-07-13_cotality_swap_public_record_migration.md`: a live-code Cotality
failure is a re-route, never a credential rotation. Do not rotate, refresh, or "fix"
them. If you find yourself debugging a REST key you have left this row.

### The wire details, verified live 2026-09-12 — these cost hours to find

Token mint. HTTP Basic, `grant_type` in the QUERY STRING, EMPTY body, explicit
`Content-Length: 0`. Credentials in the body fail. `grant_type` in the body fails. A
body-less POST with no `Content-Length` gets a 411 from the Incapsula WAF. Send a real
browser-shaped `User-Agent`; default library agents may be rejected.

```
POST https://mcp-uat.cotality.com/oauth/token?grant_type=client_credentials
Authorization: Basic base64(clientId:clientSecret)
Content-Length: 0
```

`expires_in` comes back as the numeric STRING `"3599"`. Coerce with `Number()` or a
cache TTL silently falls back.

MCP endpoint is `https://mcp-uat.cotality.com/mcp`, Bearer token, JSON-RPC. Send
`Accept: application/json, text/event-stream`. **Responses are SSE**, lines shaped
`data: {json}` with CRLF, so parse them; a plain `JSON.parse` of the body fails. Call
`initialize` (protocolVersion `2025-06-18`) before `tools/list` or `tools/call`.

`mcp.cotality.com` (production) rejects these UAT credentials. Do not retry it.

Tool parameter names, which are not guessable: `clip-find_property_by_address` takes
**`fullAddress`** (not `address`). `pd-get_property_characteristics` and
`at-get_property_climate_risk` take **`clips`** (an array).

A tool error arrives as a 200 with `result.isError` true and the message in
`result.content[].text`, not as an HTTP error. `{"code":"NOT_FOUND"}` means the address
did not resolve, which is data, not a failure.

### The set, already built and committed

`_catalog/vendor_testset_ctx.json`. Sixty parcels, ten per county across Bastrop 48021,
Caldwell 48055, Hays 48209, McLennan 48309, Travis 48453, Williamson 48491; five
incorporated and five unincorporated in each. Every parcel carries `place_key`, `situs`,
and a baseline `cell_kinds` histogram. Builder is `scripts/vendor-testset-ctx.mjs`
(`--self-test` runs five checks including a not-vacuous case). Do not rebuild the set;
if you believe it is wrong, say so and stop.

### The work

For each parcel: `clip-find_property_by_address` with the `situs` string, then, on a
resolved CLIP, `pd-get_property_characteristics` and `at-get_property_climate_risk`.

For each rail, classify against that parcel's existing `parcel_record_cell` state, read
read-only:

- **AGREES** — we hold a value, Cotality returns one, they match under a stated
  normalization (say what the normalization is; a case-fold and whitespace trim is fine,
  a fuzzy match is not).
- **DISAGREES** — both hold a value and they differ. Quote BOTH values verbatim.
- **VENDOR-ABSENT** — we hold a value, Cotality returns nothing for it.
- **FILLS-GAP** — our cell is `unaccounted`, Cotality returns a value. This is the
  number the commercial case rests on.
- **NOT-ATTEMPTED** — no call covered this rail. Not an absence claim.

Agreement is a TWO-DERIVATION check: our CAD-sourced cell against their independently
sourced field. A presence check ("the field is non-null") does not satisfy this row and
reporting one as if it did is the defect this operation keeps finding.

### Quota, and how to not lie about it

180 calls against a documented 100/day eval ceiling. That ceiling is carried from the
record and has NOT been measured; roughly 14 calls were spent 2026-09-12 without
reaching it. Run county by county so a ceiling strands a whole county rather than
corrupting every county's numbers. When you hit a limit, record the exact response and
the call count at which it arrived. **A quota refusal is never coverage data** — those
parcels are NOT-ATTEMPTED, never VENDOR-ABSENT.

### Pre-register, then score honestly

Write these down BEFORE the first live call, and score each one in the close even where
you lose. Losing most of them is the correct outcome for an honest pre-registration.

1. Travis and Caldwell resolve at a lower rate than the other four counties, because
   their `situs` cells are bare street lines with no city or ZIP while the other four
   carry full addresses. If they resolve equally well, this prediction is WRONG and the
   address-quality concern is retired rather than quietly restated.
2. `landUseDescription` fills on more than 90 percent of resolved parcels.
3. At least one rail we currently serve as a value DISAGREES with Cotality. **Zero
   disagreements across sixty parcels means the comparison is vacuous and your
   instrument is wrong** — investigate the instrument before reporting the result.

### How to build it

A checked-in file under `scripts/` with self-tests that run before any live call, in
both directions, including a not-vacuous case. A shell one-liner does not satisfy this
row: a load-bearing claim needs a file-based instrument that has been shown to fail.
Cache every raw vendor response to disk under your scratchpad so a re-score never
re-spends quota.

Suggested fan: one sub-agent per county for fetch-and-cache, you run the scoring and
verification yourself against the cached responses. Do not let a sub-agent report a
score; let it report bytes.

### Fail-closed rules for this row

Never write a rail value you did not receive. Never convert `unaccounted` to
`absent-verified` because Cotality returned nothing — that is a claim that somebody
looked at the source of record, and Cotality is not it. Never normalize a value to force
an agreement. If a rail has no clean mapping to a Cotality field, it is NOT-ATTEMPTED
and you say so.

### Close

`_inbox/<YYYY-MM-DD>_cotality-bakeoff_close.json`, carrying per rail the five counts
summing to 60, the resolve rate split by county, the verbatim disagreement list, the
three pre-registered predictions with their scored outcomes, the quota behaviour
observed, and your `leave_behind` declaration (`none` is valid and cheap, the
declaration is required).

Report what you measured. If the numbers are inconvenient, that is a reason to trust
them, not to re-run until they improve.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-12_ctx-bakeoff_cp1.json
  CP2: _inbox/2026-09-12_ctx-bakeoff_cp2.json
  CLOSE: _inbox/2026-09-12_ctx-bakeoff_close.json
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
    "lane": "CTX-BAKEOFF",
    "planRows": ["P-176"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
