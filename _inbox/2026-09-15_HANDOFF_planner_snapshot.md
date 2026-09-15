---
id: 2026-09-15_HANDOFF_planner_snapshot
title: HANDOFF — integration seat, 2026-09-15. Read this before anything else.
date: 2026-09-15
status: handoff — operational state plus the full artifact manifest
kind: handoff
owner: nick
audience: the planner picking up the doc_repo integration seat
---

# HANDOFF — integration seat, 2026-09-15

> **Snapshot: `doc_repo` main, branch `main`.** Verify with `git log -1` before trusting
> anything here. This session ran ~57 commits to `origin/main`.

## STOP. PRODUCTION STATE AS OF 2026-09-15 MORNING — READ BEFORE YOU TOUCH ANYTHING

**`smartsite.cloud` is serving a ROLLED-BACK build and that is deliberate.** Deployment
`property-explorer-r4pk3k7sv`, built ~2026-09-15T01:00Z. The map works. Leave it working.

**Four fixes merged; only ONE is live.** Do not assume any of the others are in effect:

```
P-214  legacy-design-tools #691  b5dfb508b   merged AND LIVE (LDT auto-deploys)
P-216  hauska-map          #404  fabf9b7b5   merged, deployed, then ROLLED BACK
P-218  hauska-map          #405  b36013845   merged, deployed, ROLLED BACK as collateral
P-219  hauska-engine       #449  f77cf56     merged, NEVER DEPLOYED
```

**WHY THE ROLLBACK.** P-216's `declined` branch sets `envelopeCovered = false`. `depthWarm` is
false for most parcels, so deploying it **suppressed the buildable envelope across the entire
map**, not only the false-zero cases. P-216's OWN pre-registered falsifier named this exact
outcome: *"If you suppress the envelope and the panel then shows nothing where a customer
expects a finding, you have traded a wrong answer for a silent one."* **The falsifier fired and
it shipped anyway, because the previous seat checked CI and the close and never checked the
falsifier.** Check the falsifier before you merge anything.

**THE FIX BEFORE P-216 GOES BACK OUT — one branch, not a redesign.** The `declined` branch must
keep the envelope **DRAWN** and withhold only the **area figure**. P-216's own row already says
setback distances stay served; the polygon must too. **Do not redeploy P-216 until that lands
or you will take the map down again.**

**THEN deploy engine and panel TOGETHER, and verify THE MAP — not the API.** The API and the
panel are different read paths; the API looked healthy the whole time the map was blank.

**DEPLOY MECHANICS. This cost a production outage:**
- `legacy-design-tools` **auto-deploys** on merge to main (Cloud Run).
- `hauska-map` **DOES NOT.** Vercel CLI, run from the **repo root** — the project's Root
  Directory is already `apps/property-explorer`, so deploying from inside that folder fails on
  a doubled path.
- **A MERGE IS NOT A DEPLOY. The only proof is the live alias.** `curl -sI https://smartsite.cloud/`
  and read `Age:` — a large Age means an old build is serving. The previous seat reported three
  merges as deployed; two were not, then blamed a live symptom on code that was not running.
- Deploy from a **clean worktree at origin/main**. `P:/hauska-map` sits on a feature branch.
- Rollback that worked: `vercel promote <previous-prod-url> --yes`, then re-check `Age:`.

**P-219 CLOSED PARTIAL, HONESTLY.** Merged `f77cf56`, CI conclusion `success`. Regenerated
read-only: FRONT 30 · SIDE 10 · SIDE (CORNER) 20 · REAR 30, cited Ord. 2026-06, corrected
envelope 16,767 sq ft inside its pre-registered 16,300–16,800 band. It closed partial **because
the deploy is owed** — `hauska-engine-api` serves `00224-joq` without the fix — and it recorded
its probe artifact as FAIL rather than claim a PASS it had not earned. Unresolved and flagged by
that lane: **3,788 of 16,751 layer-23 rows (22.6%) still author from the retired namespace, and
blanket-retiring them would replace CORRECT values with an absence** — GC and IND numeric
columns agree with the city's authoritative text. Its escalation falsifier fired and it
correctly stopped.

## READ THESE FOUR FIRST, IN THIS ORDER

| # | Path | What it is |
|---|---|---|
| 1 | THIS FILE | operational state, what is running, what is owed |
| 2 | `_inbox/2026-09-15_smartsite_mcp_surface_card.md` | **the MCP/reporting surface card.** 16 tools, what works, what is broken, what is UNMEASURED |
| 3 | `_inbox/2026-09-14_county_to_serving_WDLL.md` | the OPS-24 destination, incl. the rail ceiling |
| 4 | `90_operations/OPS-16_texas_market_plan_of_record.md` | the plan. Rows P-186..P-224 are this arc |

## IN FLIGHT RIGHT NOW

**`p219-repealed-ordinance` is the ONLY open lane claim.** hauska-engine.
`_dispatches/2026-09-15_p219-repealed-ordinance_dispatch.md`.

It is the highest-value row on the board: **both PDF products draw every setback line from
Ordinance 2019-51, repealed 2026-04-14.** The facet is right (30/10/30/20 with a
`side_corner_ft`, Ordinance 2026-06); the engine is wrong (25/5/25, no corner concept, sourced
`bastrop-per-parcel/34049/front`).

**It is the root of FOUR carded symptoms, not a fifth bug:** F24, P-154, P-214 and D2. P-214's
customer-visible string `expected 5ft for role side` **IS** the repealed side setback. When it
closes, read which of the four it says it retires and route the remainder.

## READY AND NEVER FIRED

```
_dispatches/2026-09-15_p224-plural-search_dispatch.md        legacy-design-tools
_dispatches/2026-09-15_p217-payload-coherence_dispatch.md    legacy-design-tools  HELD
_dispatches/2026-09-12_ctx-bakeoff_dispatch.md               P-176, compiled 3 days ago
```

**P-217 is HELD until P-216's work settles** — same repo, same composer. Its mission tells the
lane to check `_catalog/lane_claims.json` and stop rather than work around a held claim.

## WHAT LANDED TODAY

**Three PRs merged and auto-deployed on the operator's go:**

```
legacy-design-tools #691 (P-214) -> b5dfb508b
hauska-map          #404 (P-216) -> fabf9b7b5
hauska-map          #405 (P-218) -> b36013845
```

`#405` went BEHIND when the first two moved its base; its green CI had run against the old
base. Branch updated, CI re-run to three `success` conclusions, then merged. **Do not merge on
a stale green.**

**Closes landed:** P-200, P-203, P-205, P-207, P-208, P-212, P-214, P-216, P-218.

**Rows carded this session:** P-200 through P-224, plus amendments A-153 through A-156.

**Canon changed:** `ENFORCEMENT.md` gained **"A mass state change refuses before it lands"**
with the Bastrop instance. Read it; it is the most reusable thing produced today.

## THE OPERATOR OWES RULINGS ON

1. **Whether P-206 gets dispatched.** It was hard-blocked on P-212 (making the serve honour
   retirement would have taken 92.5% of Bastrop dark). P-212 closed and corrected the data, so
   **P-206 is now unblocked** and its owner should re-evaluate.
2. **The buildable-area policy, decided ONCE across three surfaces.** Today the panel withholds,
   the facets endpoint served a zero, and the PDF shouts 19,052 sq ft. P-219 carries it.
3. **Whether a `needs-human` records job with zero artifacts should be visible to the user who
   requested it** rather than rendering as an empty list. Product question, not a defect.

## THE FIVE THINGS THAT WILL BITE YOU

**1. Verify a compile, do not trust it.** Three dispatches compiled with ZERO program-law
blocks because rows were allocated past OPS-24's registry range. The registry is now
`[{186,198},{200,225}]` and `scripts/enforcement/probe-close-gate.mjs` carries the same literal.
**Extend BOTH together** — the drift check will fail loudly if you do not, and it fired on me
twice today doing exactly that.

**2. The shared checkout has multiple writers.** My P-212 dispatch was swept into the govtech
session's commit `f340e8e6`, which misdescribes itself; recorded in `b83a52d3` rather than
rewritten. **Both seats used explicit pathspecs.** Explicit pathspec is necessary and NOT
sufficient. Always `git add` and `git commit` in **separate Bash calls** — the close gate
refuses them chained, correctly, and it caught me twice.

**3. Lanes strand doc_repo artifacts in worktrees.** Six times this week. Check
`P:/seat-worktrees/*/doc_repo/_inbox/` for anything not on main. Every dispatch now ends with
"commit your close to doc_repo main and PUSH it" for this reason.

**4. Never pipe an enumeration through `tail`.** My first Bastrop sizing query did, truncating
the six CTX counties off the result so it read as zero retired everywhere. Caught before
reporting. My later "recovered everything" sweep used lane-name globs and missed a bare probe
artifact that a close cited — **cited and untracked**, fixed in `f0cadabe`.

**5. Watch for runaway background processes.** Three orphans were killed today burning ~17,000
CPU seconds: one of mine (a `while(exec)` loop on a regex whose backslashes bash ate, compiling
to `^|s*P-(d+)s*|` — an alternation with an empty branch, the exact documented instance) and two
orphaned `find / -maxdepth 6` from dead lanes hunting `surface-probe.mjs`.

## HAYS: THE CONDITION

P-200 applied the setback group. **35,365 / 18,904 / 566, zero delta against prediction**, all
five rails moved `excluded` → PASS.

**But its pre-registered falsifier 3 fired and that is the real finding:** `get_smart_site` on
the gold parcel still returned `not-cut-over` with the **identical runId/bakedAt as pre-apply**.
The cells are written, the gate passes, and the customer surface serves a cached bake. **The
gate and the customer surface are not the same mechanism.** Every close graded on gate verdicts
has been grading something the customer may not see.

**Still open on Hays:** 31 of 65 rails passing (worst of the six counties); 35,365 cells carry
`dateBasis: "unreadable"` where the 2026-09-11 ruling requires a conflict row (diagnosed in
P-216, NOT fixed); the envelope group never applied. All on **P-211**, the circle-back row.

## BASTROP: WHAT HAPPENED AND WHAT IS LEFT

**P-212 reactivated 56,691 falsely-retired parcel-nodes.** 4,690 → 61,381 active; 1,013 remain
retired. Arithmetic exact, dry-run predicted the apply exactly, 20-id resample matched the
pre-registration (19 active and reconfirmed live at the county, `77293` still retired and
reconfirmed absent).

**My ENG-03 hypothesis was FALSIFIED.** The real cause: a 2026-08-11 run fed an undersized plan,
and **retirement was a one-way door** — `priorRows.filter(r => r.status === 'active')` excluded
retired rows from every future comparison. Root cause of the undersized plan **untraced**; there
is no reachable runs ledger.

**Still open:** 1,013 genuinely retired, not re-derived; live-currency registration for the
other five counties not built.

## THE PATTERN THAT DOMINATED THIS SESSION

**Seven-plus measured instances of a served answer disagreeing with itself or its source.**
Brief vs draw on land use (P-207, fixed). Brief vs overlay on envelope (P-214 defect 2,
unfixed). Stub vs node on the same parcel. Gate vs serve on `owner`/`landUseCode`. Panel 5ft vs
served 10ft. A card printing "zoning is unavailable" then printing `ZONING SF-6`. Store vs serve
vintage.

**These are not seven bugs.** Nothing checks that a served answer agrees with itself before it
reaches a customer. **That is P-217**, built as a REFUSAL rather than a detector, and its
mission requires the lane to state the control's honest limit: internal consistency catches
contradiction, never a wrong source agreeing with itself.

## A CORRECTION THE NEXT SEAT SHOULD INHERIT

**P-223 was carded SEV-1 and the measurement refuted most of it.** The lane reported a tier-gate
bypass. Measured: the operator account IS `paid/studio`, so `ok/jobs:[]` was correct; and both
its records jobs are `needs-human` with **zero artifacts**, so an empty list is right on both
readings. The inference "the gate never ran because the query was reached" is **invalid** — on a
Studio account the gate passes and reaching the query is correct.

**What survives:** a bad `artifactId` returns a raw Postgres error instead of the documented
envelope, leaking `records_request_artifacts` schema. `POST /mcp` unauthenticated returns
**401**, so it is an authenticated-caller disclosure, not public.

**Recorded honestly: THE TIER GATE REMAINS UNTESTED IN THE FAILING DIRECTION.** Six free
accounts exist but none is this caller. Do not read the downgrade as "the gate passed".

## ARTIFACT MANIFEST

```
CARDS / DESTINATION
  _inbox/2026-09-15_smartsite_mcp_surface_card.md     the MCP surface, 16 tools
  _inbox/2026-09-14_county_to_serving_WDLL.md         OPS-24 destination + rail ceiling
  _inbox/2026-09-11_ops23_ledger_serving_path_WDLL.md OPS-23 durable card
  _inbox/2026-09-14_HANDOFF_planner_snapshot.md       yesterday's handoff (superseded by this)

CLOSES THIS SESSION
  _inbox/2026-09-14_p195-gate_close.json              gate refuses total absence
  _inbox/2026-09-14_p170-traffic-lease_close.json     traffic lease, proven by violation
  _inbox/2026-09-14_p203-capability-roadmap_close.json + _p203_capability_roadmap.md
  _inbox/2026-09-14_p205-coverage-refusal_close.json  + _CONTRACT.md (the follow-on contract)
  _inbox/2026-09-14_p207-payload-contradiction_close.json
  _inbox/2026-09-14_p208-remint-noop_close.json
  _inbox/2026-09-15_p200-hays-rails_close.json        falsifier 3 fired
  _inbox/2026-09-15_p212-bastrop-false-retirement_close.json
  _inbox/2026-09-15_p214-panel-conflict-render_close.json
  _inbox/2026-09-15_p216-envelope-served_close.json
  _inbox/2026-09-15_p218-selection-and-situs_close.json
  _inbox/2026-09-15_p218_situs_three_way_measure.md   per-county situs split

CONTROLS BUILT OR REPAIRED
  scripts/enforcement/plan-row-allocation-gate.mjs    NEW. duplicate row id refused
  .claude/hooks/plan-row-allocation-gate.mjs          its hook
  scripts/enforcement/probe-close-gate.mjs            drift check was VACUOUS, fixed
  ENFORCEMENT.md                                      new section: mass state change refuses
```

## ROW STATUS AT HANDOFF

```
IN FLIGHT   P-219 (hauska-engine, claim held)
READY       P-224, P-176 (bakeoff)
HELD        P-217 (behind P-216's composer work)
CLOSED      P-195 P-170 P-200 P-203 P-205 P-207 P-208 P-212 P-214 P-216 P-218
CARDED, NOT DISPATCHED
            P-201 (split `excluded` into three — unblocked, hauska-factory free)
            P-204 (mid-cutover rails)   P-206 (retirement at serve — NOW UNBLOCKED)
            P-209 (salesHistory Unavailable)  P-210 (coverage enumeration)
            P-211 (Hays circle-back)    P-213 (blast-radius refusal)
            P-215 (split node / situs sentinel)
            P-220 (owner strip, per-path)     P-221 (dossier dead)
            P-222 (six reporting defects)     P-223 (records error handling, DOWNGRADED)
```

**If you do one thing:** when P-219 closes, read which of its four symptoms it retires, then
dispatch **P-201** — it is the row that makes every future county's gate able to report its
largest gap, and `hauska-factory` has been free since P-200 closed.
