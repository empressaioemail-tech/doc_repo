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
repo: hauska-map
FAN-DEPTH: 0
This lane launches NO sub-agents. Do the work yourself. The commit gate refuses a close that declares any (A-181).

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane p324-pixel-attribution-deploy --seat <your-seat-id> --plan-row P-324 --dispatch _dispatches/2026-09-17_p324-pixel-attribution-deploy_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane p324-pixel-attribution-deploy --seat <your-seat-id>

On 2026-09-14 this exact dispatch shape was handed to two sessions at once. One found
out mid-execution from a merged commit appearing in its own fetch.


## Mission — P-324: resolve the share-identifier question, then ship the pixel and campaign attribution

You launch no sub-agents (FAN-DEPTH 0). You resolve one open question, then you push, deploy and
verify two repos in a fixed order. You fix your own failed deploys rather than escalating them.

Read `_inbox/2026-09-17_smartsite_meta_pixel_utm_handoff.md` in full before anything else. It is the
staging seat's own account, it is honest about what it did not verify, and this mission only adds the
ordering and the two gates.

### What is already built and NOT pushed

| Repo | Worktree | Branch | Commit |
|---|---|---|---|
| `hauska-map` | `P:/seat-worktrees/integration/hauska-map-meta-pixel` | `feat/meta-pixel-and-utm-source` | `369fd77` |
| `legacy-design-tools` | `P:/seat-worktrees/integration/ldt-utm-source` | `feat/utm-source-tag` | `c47b8c7b` |

Both were branched from each repo's `origin/main` at `0489bc8` and `7219b707`. **Both mains have
moved since** (map through #416 and LDT through #715 and #716). Rebase, re-run the suites, and
declare what moved. Do not assume a clean replay: #416 changed
`apps/property-explorer/src/lib/fact-sheet-resolver.ts` and consolidated a rule that used to live in
four files, and this branch touches `src/lib/auth.ts` and `src/main.tsx` in the same app.

The defect this fixes is real and worth keeping in view: `peGhlContact.ts` wrote a hardcoded
`source-organic` tag on **every** new signup, so a click from a paid ad was filed as organic. That is
a wrong value asserted as fact, which is worse than a missing one.

### GATE 1 — answer 3a before you push, and answer it locally

`fbq("track","PageView")` sends the page address as `dl`. This app's deep links put identifiers in
that address: a share landing is `/share?g=<grantId>` or `/s/<uuid>`, a parcel view carries
`parcelNodeId`, and `/share#<token>` puts the human token in the fragment.

**A share grant id is a capability identifier, not an analytics tag.** If it reaches Meta, Meta
receives something that names an access grant, and learns which browser opened which share. Treat
that as a data-sharing decision, not a deploy detail.

The staging seat deliberately shipped no mitigation because it had not verified what `fbevents.js`
actually puts in `dl`, and shipping a mitigation against unverified behaviour is how confident wrong
claims get made. That was the right call. Your job is to end the uncertainty.

**Run the probe on a local `vite dev` server, not on a preview.** The tag loads there too. The
handoff's original ordering (push, let a preview build, probe the preview) fires PageViews tagged
with preview URLs into the LIVE pixel id and mixes preview traffic into the ad data the operator
reads. Probing locally dissolves the dependency between the two decisions entirely, at no cost. If
you believe a local probe cannot answer it, say why before reaching for a preview.

The probe: load `/share?g=<a grant id>` with Meta Pixel Helper, read the `dl` value on the PageView
event, and record it verbatim. Test the fragment form `/share#<token>` separately — query string and
fragment are different questions and `dl` may carry one and not the other. Also test a parcel deep
link carrying `parcelNodeId`.

Then decide, and state the decision with its reason: suppress the pixel on identifier-bearing routes,
strip the identifier from the address bar before the pixel fires, or accept and disclose. If you
choose accept-and-disclose, the privacy page must say so plainly; it currently does not claim shares
are withheld, and an earlier draft that did was removed as an overclaim, so do not reintroduce one.

**Record the verbatim `dl` values in your close.** A summary of what you saw is not evidence.

### GATE 2 — the cortex leg is blocked until P-323 clears

The handoff's deploy order is cortex first, then the app, and that order is correct: if the app ships
first, campaign parameters arrive at a `session-exchange` that ignores `campaign`.

But `legacy-design-tools`' deploy workflow now runs P-279's tagged-revision credential check after
the canary deploy and again after the traffic shift, and it **exits 1 on violation**. `cortex-api`
carries 15 failing tags today, so both jobs go red for a reason that has nothing to do with your
change. The deploy still happens; what you lose is the ability to tell YOUR failure from the standing
one, and a deploy job that is red by default is how a working control gets reclassified as noise.

So: **do not ship the cortex leg through a red gate.** P-323
(`_dispatches/2026-09-17_p323-tag-hygiene_dispatch.md`) clears the tags. Confirm a clean P-279 run on
`cortex-api` before you deploy it, and name the run you read. If P-323 has not landed, stop after
Gate 1 and report; do not work around the check and do not make it advisory.

### Then deploy, in this order

1. **`legacy-design-tools` (cortex-api)**, under its deploy lease. Confirm `POST
   /auth/session-exchange` still returns 200/201, and that a new signup with no campaign still
   creates a GHL contact with **no** source tag.
2. **`hauska-map` (Vercel, Property Explorer)**. `hauska-map` links to whichever project
   `.vercel/project.json` names and has been linked to `cmdcenter` when the work was for
   `property-explorer`. The correct ids are `prj_vcZGXbqdffk5C20WzaplEpzFynK3` (project) and
   `team_4TH5lNnFHcBGx4EKNapJ2MVG` (org); Root Directory is `apps/property-explorer`. Deploy from a
   fresh clone: `P:/hauska-map` was 370 commits behind, one commit ahead and dirty on 2026-09-17.
   Judge success by the live alias, never by the CLI exit code, which has returned 255 on a
   deployment that shipped fine.
3. Verify on the live site: the tag is in `<head>`; no CSP violation for `connect.facebook.net`;
   Pixel Helper reports PageView. The CSP allowance is production-only in effect — nothing in CI
   notices its absence, so this check is the only thing that catches it.
4. Land with `?utm_source=share&utm_medium=share`, sign in with a new account, read the GHL contact:
   the tag must be `source-share`.
5. Repeat with `?utm_source=facebook&utm_medium=paid`: the contact must have **no** source tag and
   the log must carry the unmapped entry. That is the correct outcome, not a bug — there is no paid
   member among the four provisioned `source-*` tags, so the fix removes a false label without
   supplying a true one (3b).
6. `/privacy` still serves real HTML and shows the 17 September 2026 date.

### Say this out loud in your close

Organic signup volume **will drop**, because signups arriving with no campaign parameters now get no
source tag where previously every one was `source-organic`. The bucket becomes a measurement instead
of a guess, and it shrinks. Someone will read that dashboard and think something broke.

### What you must not do

- Do not push before Gate 1 is answered.
- Do not deploy cortex-api through a red P-279 gate, and do not make that check advisory.
- Do not write the throwaway Postgres credential into any repo file. The staging seat kept it out of
  every file deliberately; keep it that way. The integration suites (`pe-ghl-contact`,
  `pe-magic-link`, `pe-paywall-stripe`) need Postgres with `pgvector` and `postgis` and the
  **direct, non-pooled** URL, because the harness sets `search_path` as a startup parameter and
  Neon's pooler rejects it.
- Do not implement named conversion events or the Conversions API. Both are named gaps, not this
  deploy (gap 1 and 2 in the handoff).
- Do not touch county 48491 in any store.

### Close

Declare: the rebase result and what moved under you, the verbatim `dl` values for all three link
shapes, your 3a decision with its reason, the P-279 run you read before the cortex leg, both deploy
targets with their verification, the GHL contact reads for both campaign cases, and `leave_behind`.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-17_p324-pixel-attribution-deploy_cp1.json
  CP2: _inbox/2026-09-17_p324-pixel-attribution-deploy_cp2.json
  CLOSE: _inbox/2026-09-17_p324-pixel-attribution-deploy_close.json
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
    "lane": "p324-pixel-attribution-deploy",
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
