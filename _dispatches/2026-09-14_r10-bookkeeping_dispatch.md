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

PLAN-ROW: R-10 (90_operations/OPS-18_canon_reconciliation_plan_of_record.md)
repo: doc_repo


# MISSION — R-10: reconstruct the G-116 / G-117 governance record

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

## The one rule that governs this entire mission

**You may record what was BUILT. You may not assert what was DECIDED.**

Three decision records are cited by shipped code and do not exist. You are going to create them,
and the thing you must not do is write them as though somebody made those decisions and you found
the minutes. Nobody did. You are reconstructing, from source, what the code shows was built and
what reasoning the code itself states — and every record you write says so in its own frontmatter
and its opening line. Ratification is the operator's, not yours and not mine.

A reconstructed record that reads like a ratified decision is worse than no record, because the
next agent will cite it as authority.

## What happened

Between roughly 2026-08-20 and 2026-09-04, real work shipped with no bookkeeping:

- **Fourteen PRs on `smartcity-os`** (#39 through #52) building a platform-internal seam for
  `smartcity-dashboards`. That repo is under ABSOLUTE NO-TOUCH in `_catalog/repo_intents.md`.
- **Ten deployed revisions on `smartcity-dashboards`** carrying tags `g116-mygov-live`,
  `g116-mygov-rest`, `g116-vendor-auth`, `g116-pipeline-nav-fix`, `g116-honest-tiles`,
  `g116-field-enrich`, `g116-cip-enrich`, `g117-property-map`, `g117-overlay-layers`,
  `g117-full-catalog`.
- **No plan row governs any of it.** OPS-17 stopped at G-115 until 2026-09-14.
- **Three cited decision records do not exist** in either doc_repo clone.

The work was real, careful and correct on substance. Two independent recons this session
confirmed it: no vendor table was copied into Dashboards Neon, tenant scoping refuses live in
both directions, and the prohibition on copying `mygov_permits` was turned into a control that
throws. What was skipped is the writing-down.

**The consequence is already observed.** An agent reading canon concludes no live permit feed
exists; an agent reading code concludes three authorizations exist. Both are wrong. That
contradiction produced a wrong load-bearing statement to the operator earlier today.

## Your sources, in priority order

1. `_inbox/2026-09-14_g52_mygov_v2_recon.md` — read this FIRST. A full read-only recon of the
   MyGov seam in `smartcity-dashboards`, already done, with quoted code and live probes.
2. `_inbox/2026-09-14_g52_planreview_intake_icc.md` — the plan-review and ICC recon.
3. `git log origin/main` and the PR bodies on `smartcity-os` (#39–#52) — use `gh pr view`.
4. `smartcity-dashboards` `origin/main` — especially `src/property-map.mjs`, whose header is an
   unusually complete statement of its own reasoning, and `src/property-map-catalog.mjs`.
5. `_catalog/repo_intents.md`, `_inbox/2026-08-17_g18_shell_homes.md`,
   `_decisions/2026-08-17_g63_feed_adapter_contract.md` — the rules this work ran against.

Read repos read-only, at `origin/main`, with `git -C <repo> show origin/main:<path>`. Working
trees are stale: `smartcity-dashboards` was 43 commits behind on 2026-09-14. **Do not write,
edit, commit or push in ANY product repository.** Your writes are doc_repo artefacts only, and
even in doc_repo **you do not commit** — you hand files back and the planner commits.

## Deliverables

### 1. Three reconstructed records

Write each to the path the code cites, so the citation resolves:

- `_decisions/2026-09-03_smartcity_os_platform_read_authorization.md`
- `_decisions/2026-09-03_bastrop_tx_dashboards_pack_ratified.md`
- `_decisions/2026-09-04_leaflet_island_exception_property_map.md` — the Leaflet override cited
  by `property-map.mjs`'s header. If you find the code cites a different exact filename, use the
  cited one so the reference resolves, and note the discrepancy.

Each carries `status: reconstructed-awaiting-ratification` in its frontmatter, and opens with a
line stating plainly that it was reconstructed from source on 2026-09-14, that no operator
ruling of this date is on record, and that it is not authority until ratified.

Each should say: what was built, what the code's own stated reasoning was, what rules it ran
against and whether it satisfied them, what it did NOT do, and what an operator would need to
confirm to ratify it. Where the code states its own reasoning, quote it — `property-map.mjs`'s
header does this unusually well and should be quoted rather than paraphrased.

### 2. Retroactive plan rows

Draft OPS-17 rows covering the shipped surfaces, using the existing table's exact column shape
(`| ID | L | Work item | Serves | Pass/fail instrument | Blocked on | Status |`).

**Do not edit `90_operations/OPS-17_govtech_stack_plan_of_record.md` directly.** Two sessions are
writing doc_repo main and IDs have collided twice in three days. Write your proposed rows to
`_inbox/2026-09-14_r10_proposed_ops17_rows.md` as ready-to-paste table lines, and say which ID
range you assumed. G-125 was the maximum at 2026-09-14 12:55; re-check immediately before you
write and say what you found.

Mark every retroactive row `SHIPPED, RECORDED RETROACTIVELY 2026-09-14` in its status, never
`CLOSED` — a row written after the fact was never graded by an instrument.

### 3. The G-52 correction

`OPS-17` G-52 still reads STILL BLOCKED on "a live MyGov feed/adapter grant on `template-city`
(NOT YET BUILT)". A live permit feed demonstrably exists and serves. What does NOT exist is the
engagement-from-permit bridge — `engagement` has zero hits in `smartcity-dashboards`.

Propose corrected row text in your handback. Do not edit the file.

### 4. The findings register

`_inbox/2026-09-14_r10_bookkeeping_close.md`: what you reconstructed, what you could NOT
reconstruct and why, and every additional undocumented thing you found. Expect more — you are
reading fourteen PRs nobody wrote down.

## Method

ENUMERATE BEFORE ASSERTING ABSENCE. Say what you searched. "I grepped these patterns and found
nothing" is acceptable; a bare "there is no X" is not.

State the mechanism you believe explains an observation, THEN state a second mechanism that would
produce the same observation and why you rejected it.

Never print secret VALUES. Env var names only.

Every command exit-bounded (`timeout 120 ...`). Never run a command that waits for input.

Where you cannot tell whether something was intended or accidental, **say that** rather than
picking the flattering reading. "The code does X; whether that was intended is not recoverable
from source" is a complete and useful answer.

## Close

Write the register to `_inbox/2026-09-14_r10_bookkeeping_close.md` and the proposed rows to
`_inbox/2026-09-14_r10_proposed_ops17_rows.md`. Hand everything back; commit nothing.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-14_r10-bookkeeping_cp1.json
  CP2: _inbox/2026-09-14_r10-bookkeeping_cp2.json
  CLOSE: _inbox/2026-09-14_r10-bookkeeping_close.json
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
    "lane": "r10-bookkeeping",
    "planRows": ["R-10"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
