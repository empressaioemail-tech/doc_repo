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

PLAN-ROW: P-228 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-engine

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane p228-report-chrome --seat <your-seat-id> --plan-row P-228 --dispatch _dispatches/2026-09-15_p228-report-chrome_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane p228-report-chrome --seat <your-seat-id>

On 2026-09-14 this exact dispatch shape was handed to two sessions at once. One found
out mid-execution from a merged commit appearing in its own fetch.

# PROGRAM CONTEXT — OPS-24 county to serving

You are working a lane of OPS-24. Everything below is program law for this lane. If it
conflicts with the general canon preamble, this section is narrower and wins on scope; if it
conflicts with the AGENT CONTRACT or ENFORCEMENT, those win.

## The one goal

A county goes from "not in the product" to "a customer types a real address in that county
and the card, the MCP and the PDF agree, and every value carries its source and vintage"
through ONE pipeline of thirteen stages, each with a predicate that can fail and an instrument
that measures it, at a cost the kill test can read. Not "acquire everything". Not a farm
before one county has run end to end through the pipeline that exists.

## Six laws

1. **The customer predicate is the definition of done.** `scripts/surface-probe.mjs` with a
   real address in the county is the finish line for every stage, not stage 12's private
   check. A stage that cannot be traced to a change in what the probe reads is not on this
   program. ARMED 2026-09-14 on the enforcement side: `probe-close-gate.mjs` gates every
   OPS-24 row and prints the predicate debt on each close until `surface-probe.mjs` carries
   the stage's row (P-197); a close with neither an artifact nor a declared
   `probe.notApplicable` (read-only reviews only) is refused.
2. **The gate is fixed before anything trusts it.** The publish gate today passes TOTAL
   absence and refuses PARTIAL absence (P-181, dead-controls ranking, entry 1). Nothing that
   reads a gate verdict, the per-place declaration, the completeness check, a farm's merge, is
   built or run against the gate until stage 9 lands and is proven by violation on an empty
   county.
3. **One county end to end before any farm.** Burnet runs stages 3 through 12 through the
   existing pipeline first. The farm (stages 1 and 13) is designed from what that run breaks.
   The fleet has learned twice that blockers surface serially; a wave finds them slower than
   one county does.
4. **Three operator stop points, and only three:** a new credential or secret mount, a write
   to a production serving store, a ruling. Everything else runs unattended and leaves a
   record naming what it touched.
5. **Every stage meters itself.** Compute dollars and operator minutes per county per stage
   go on the stage's run record, so commitment 3 (under 200 dollars and one hour per county)
   can fire as a kill, not a slogan.
6. **Nothing is measured once and published as state.** A number on this program's card
   names its SHA and its date. OPS-23's live card is authoritative where the two programs
   touch (serving, identity, the ledger).

## Identity and vintage, inherited as law

The OPS-21 identity paragraph applies: `place_key` is the parcel-map id; in a two-namespace
county the account joins only through the published crosswalk; never by bare number. The
P-178 vintage rule applies: a county's declared roll is a decision with a marker for accounts
that fall off, never an upsert that keeps notice values silently.

## What this program absorbs

OPS-21's unfinished writers (stage 6), OPS-23's serving seams (stages 10 and 11), P-124's bake
(stages 9 and 10), P-156 (stage 0), P-181 (stages 2 and 9), P-182 (stage 0), P-184 (stage 4).
Each absorbed row keeps its number and its close history; OPS-24 rows name what they absorb.


## Mission — P-228: one page frame for all three report types

### What you are building

The page frame on generated PDF reports: **masthead, running header, footer**. One frame for
Feasibility Study (`FS-`), Site Plan (`SP-`) and Flood & Drainage (`FD-`); only the
report-type string and the footer disclaimer differ between them.

**Sheet bodies are explicitly OUT OF SCOPE and unchanged.** If you find yourself editing what
a sheet says rather than the frame around it, you have left this row.

Design reviewed and approved 2026-09-15. Treatment is **Option 1a "Rule"**: no fills, no
bands, structure carried by two rule weights and mono meta.

### The spec and the assets are committed

`_design/report-chrome/` on doc_repo main:

| File | What it is |
|---|---|
| `README.md` | the full spec — geometry, masthead, running header, footer, print tokens, the rulings, and the checks before merge |
| `report-chrome.css` | the whole frame, drop-in |
| `report-chrome.html` | working reference: sheet 1 plus a continuation sheet, print-ready. Print it to PDF and compare against your output |
| `logo-wordmark-print.svg` | paper wordmark, 175x40 in use |
| `logo-mark.svg` | ring only, for the 20px running header |

Read `README.md` first. It carries exact values and you should not re-derive them.

### Three integration findings already recorded — do not rediscover them

These are in `_design/report-chrome/README.md` under "Integration notes", established by the
integration seat before this row was dispatched.

1. **The C2PA metadata is already stripped from both SVGs.** As delivered each carried an
   embedded ~14 KB base64 provenance manifest. The mark renders on EVERY continuation sheet,
   so that payload would have been embedded in every generated report. The committed files are
   the stripped versions. If provenance must be retained, retain it on the source asset and
   strip at build time — never ship it inside the PDF.

2. **THE SPEC'S FOOTER DEEP-LINK HOST IS WRONG AND IS DELIBERATELY LEFT UNCORRECTED.** The
   spec and the HTML reference both print `smartsite.app/?parcelNodeId=...`. Production is
   **`smartsite.cloud`**. Measured, not assumed: `smartsite.app` returns **HTTP 200**, so a
   naive reachability check PASSES it, but it is a **parked domain** — 114 bytes, no Vercel
   headers, no application bundle, body is only `window.location.href="/lander"`.
   `smartsite.cloud` serves the real app. **As delivered, this frame would print a
   customer-facing deep link onto a parking page**, which is not a 404 and is exactly why a
   status check would not catch it. Resolve the host and **verify by SERVED CONTENT, not by
   status code.**

3. **Existing reports already print a RELATIVE deep link with no host at all** —
   `/?parcelNodeId=48021%3A34049` in the 2026-09-15 feasibility footer. So whether the frame
   prints an absolute host, and which, is a decision this spec makes implicitly. **Make it
   explicitly**, and say which you chose and why.

### How to verify a PDF, because the text is not greppable

The generated PDFs use Identity-H CID fonts, so the drawn strings do not appear as plain text
in the file or in its inflated streams. A `grep` for "SHEET 01 / 13" will return nothing on a
perfectly correct PDF. **Do not conclude from a failed grep that a value is missing.**

A method that works, used by the integration seat on 2026-09-15 to verify P-219: inflate the
PDF's FlateDecode streams, parse the `beginbfchar` blocks into a CID-to-Unicode map, then
decode every `<hex> Tj` operand through that map. That recovers the drawn text exactly.
Rendering the page to an image and reading it also works.

### Done looks like

The frame renders on all three report types, and the spec's own checks pass:

- A sheet element measures **exactly 816 x 1056**. (The spec names this trap: with
  `content-box` instead of `border-box` the padding lands outside the declared box and sheets
  render 912 x 1126. It was a real bug in the first draft.)
- The footer sits on the bottom margin on a SHORT sheet and on a FULL one.
- The sheet counter zero-pads and matches the actual sheet count.
- A long address wraps to two lines in the masthead without pushing the hairline into the
  body; the running-header meta truncates rather than wraps.
- Report-type strings render uppercase from CSS, so source strings can stay sentence case.
- The deep-link host resolves to the real application.

### Falsifiers, pre-register your answers before you run anything

1. **Measure a rendered sheet element.** If it is 912 x 1126 the box-sizing trap bit you, and
   every other check you ran was against the wrong geometry.
2. **Fetch the deep-link host you chose and inspect the BODY, not the status.** If it returns
   200 with ~114 bytes and a `/lander` redirect, you kept the parked domain.
3. **Generate a 13-sheet feasibility study and read the last sheet's counter.** If it says
   anything other than `SHEET 13 / 13`, the counter is not bound to the real count.
4. If any sheet BODY content changes as a side effect of the frame, you exceeded scope — the
   frame is the only thing this row touches.

### Known traps

- **hauska-engine has NO deploy workflow.** A merge there ships nothing and nothing says so.
  Your work is not live when it is merged; say so plainly in the close.
- **P-219 changed the site-plan author on 2026-09-15** (`packages/engine-core/src/site-plan/`,
  19 files, a new `resolve-export-setback.ts`) and P-221 changed the dossier path hours ago.
  Read `git log` on the files you intend to touch before editing; this repo has been busy.
- Gold is paper-only and appears nowhere else in the frame. `--ss-gold #E8963B` is 2.3:1 on
  paper and fails as text, which is why `--ss-print-gold #B87116` exists for the wordmark's
  letterforms while the ring dot keeps true gold. Do not add gold rules, gold sheet counters
  or gold accents, and do not edit `assets/logo.svg`.
- Port the print tokens into a `print-tokens.css` rather than inlining hexes. An inlined
  literal is a second copy of a token value and desyncs the moment the palette moves.

### Do not

- Do not change sheet body content.
- Do not deploy or merge. Open the PR green and hand it back.
- Do not spawn sub-agents that themselves spawn sub-agents. You own your fan.

### Close

State the host you chose for the deep link and what you verified it against. State the
measured sheet dimensions. Close to `_inbox/` on doc_repo main and PUSH it. Declare
`leave_behind` explicitly. State your snapshot (repo, branch, commit).

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-15_p228-report-chrome_cp1.json
  CP2: _inbox/2026-09-15_p228-report-chrome_cp2.json
  CLOSE: _inbox/2026-09-15_p228-report-chrome_close.json
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
    "lane": "p228-report-chrome",
    "planRows": ["P-228"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
