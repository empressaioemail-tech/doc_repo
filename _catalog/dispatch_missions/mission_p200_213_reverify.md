## Mission — P-200 through P-213: re-verify the largest unverified blind spot

This is a READ-ONLY investigation. Do not write code, do not open a PR, do not
commit anything (you cannot commit to doc_repo regardless — subagents do not
commit). Produce a report.

### Do NOT spawn sub-agents

You are the deepest worker. This mission also does not use lane-claim: it is
an internal read-only research task run by the integration seat's own
sub-agent, not a hand-carried lane to an external seat, and it mutates
nothing, so there is no collision to arbitrate. Skip the lane-claim step.

### Why this task exists

`90_operations/OPS-16_texas_market_plan_of_record.md` rows P-200 through
P-213 were all added 2026-09-14/09-15 during a fast-moving investigation
sprint. The operator's own durable card
(`_inbox/2026-09-15_reports_and_envelope_WDLL.md`) records, verbatim: "P-200
through P-213. OPS-24 rails, the `excluded` taxonomy, the capability roadmap,
the SEV-1 mass false retirement (P-212) and the blast-radius refusal (P-213,
which P-236's lane recorded as still unbuilt). **The 2026-09-15 session did
not verify any of these and did not guess. Re-establishing this block is its
own task and is the largest blind spot on the board.**" Nothing since then
has re-checked them either. Your job is to close that gap: read what each row
claimed, then verify the CURRENT live state independently, and report the
delta.

### Discipline for this task specifically

This operation's `ENFORCEMENT.md` (doc_repo root) already binds you via the
canon preamble above; the parts most load-bearing for THIS task:

- Read the authoritative record, never a proxy for it. If you read a
  database, confirm `current_database()`, the project, the region.
- Code reading outranks output measuring. When they disagree, trust the code
  read, report both, say why.
- State your snapshot for every repo (commit/branch) and every live probe
  (timestamp).
- Never fabricate a "verified" from a stale artifact. "Unmeasured" or "not
  independently confirmed" is a correct and expected answer for some of these
  14 rows — say so rather than guess.
- A convenient result that confirms the first hypothesis you tried is a
  reason to distrust the instrument, not a result.
- No privileged data access, no destructive commands. Read: `git
  log`/`show`/`diff` against fresh `origin/main` clones (local checkouts
  under `P:/hauska-engine`, `P:/hauska-factory`, `P:/hauska-map` are
  known-stale per multiple recorded incidents — do not trust them), `gh` read
  commands, `gcloud ... describe/list` read commands, and read-only SQL only
  if credentials are already available in this environment. If a read needs
  a credential you don't have, say so and move on.

### Where to read from

- `90_operations/OPS-16_texas_market_plan_of_record.md` — rows P-200 through
  P-213 are your primary source for what was CLAIMED. They are long single
  lines; use a tool/offset that won't truncate them.
- `90_operations/OPS-24_county_to_serving_program.md` — the nearby program.
  Its own `last_updated` is 2026-09-14, predating P-212 and P-213 (both
  2026-09-15) — treat it as background, not current truth. Its
  `plan_rows: P-186 through P-198` are a DIFFERENT, earlier range; P-200 to
  P-213 are later findings layered on top, not that program's own rows.
- `_inbox/2026-09-14_county_to_serving_program_map.md` and
  `_inbox/2026-09-13_dead_controls_ranked_fixes.md` — supporting context;
  check dates before trusting anything in them as current.
- `_inbox/2026-09-15_reports_and_envelope_WDLL.md` — read in full for
  adjacent context (rulings, the three recurring failure patterns it
  documents, measurement notes); several apply directly here.
- Repos referenced across the 14 rows: `hauska-factory`, `hauska-engine`,
  `legacy-design-tools` (incl. `smartsite-mcp`), `doc_repo` itself. Clone
  fresh from `origin/main` for any code read.

### The 14 rows and what each needs

For each row: state what it claimed (one or two sentences), then what you
independently re-verified NOW, then the delta (resolved / worse / unchanged /
superseded-by-later-work / could-not-verify-and-why).

- **P-200** — Hays rail catch-up: nine rails claimed to already work in five
  counties, excluded only in Hays, not a build. Re-check the current
  exclusion state for Hays vs the other five counties on those specific
  rails.
- **P-201** — `excluded` claimed to conflate three distinct states in the
  hauska-factory publish gate. Check whether this has been disambiguated in
  the gate's code since, or is still conflated.
- **P-202** — OPS-24 claimed to have no stage that creates a rail; its
  done-looks-like was said to need correcting. Check the current OPS-24
  doc's done-looks-like section (section 1) against this claim.
- **P-203** — The capability roadmap: eight rails (`easements`,
  `hoaDeedRestrictions`, `mineralRights`, `ossf`, `permits`, `salesHistory`,
  `terrain`, and one more — read the full row) claimed to have no source
  anywhere, scaling per-rail not per-county. Check current sourcing state for
  each of the eight.
- **P-204** — Mid-cutover rails: gold parcel `48209:97658` claimed to show an
  empty ledger cell while the value serves by another path. Re-read that
  exact parcel on the current serving path if reachable read-only; otherwise
  check the code path for whether this bug class still exists.
- **P-205** — An un-onboarded county (Killeen 76541 was the measured case)
  claimed to return `no-hit`, falsely implying the system looked. Check
  current behavior for that address if you can probe the live customer
  surface read-only; otherwise check the code path.
- **P-206** — A provenanced retirement claimed to be served as
  `parcel_not_found` with `parcelExists:false` for `48209:84629`. Re-check.
- **P-207** — A single `get_smart_site` payload for `48209:97658` claimed to
  contradict itself on whether land use is on record. Re-check.
- **P-208** — The depth-warm re-mint job claimed to be a no-op that would
  report success (measured via `hauska-engine-depth-warm-remint-7gjxg`, dry
  leg, exit 0, `wouldWrite: []`). Check whether this job still no-ops, and
  specifically whether it would still silently report success if it did.
- **P-209** — Operator ruling 2026-09-14: `salesHistory` marked Unavailable
  in Texas, rail kept for a future non-Texas launch. Check whether the
  product actually SAYS "unavailable" wherever this rail would otherwise
  appear.
- **P-210** — Multiple subsystems (read the full row for which) claimed to
  disagree on what "covered" means for a county/city, blocking three other
  rows. Check whether the ruling this row calls for has been made since
  (search `_decisions/` for anything dated after 2026-09-14 on this).
- **P-211** — The "six-county circle-back": whatever P-200's Hays-first
  sequencing left behind for the other five counties. Read the full row for
  the enumerated remainder and check current state of each item.
- **P-212** — SEVERITY-1, highest priority in this set: 61,536
  hauska-engine parcel-nodes claimed mass-falsely-retired; calls for
  re-verifying them against live county cadastral services AND stopping the
  reconcile process that produced the false retirements. This may be the
  SAME incident as `ENFORCEMENT.md`'s "Instance 2026-09-15, Bastrop 48021"
  story (57,704 of 62,394 parcel-nodes) or a second one — read that section
  and determine which. Check: (a) was the reconcile process actually
  stopped, (b) has any portion of the 61,536 been re-verified against live
  county data, (c) is a fix merged, and if so is it deployed and does the
  live parcel-node count/status reflect it.
- **P-213** — Blast-radius refusal, now canon in `ENFORCEMENT.md`: a writer
  that would flip a destructive status on a large share of a population
  should refuse and write nothing. The WDLL says P-236's lane recorded this
  as "still unbuilt" as of 2026-09-15. Check hauska-factory and hauska-engine
  writer code NOW for whether any such refusal threshold exists in the write
  paths touching parcel-node or similar mass-status fields, and whether it is
  ARMED per ENFORCEMENT's three-question-gate (what executes it, what
  triggers it, what fails when violated — a control that is merged, correct
  and undeployed enforces nothing). Treat "still unbuilt" as the default
  hypothesis to disprove, not confirm by assumption.

### Report format

One entry per row, in the order above: CLAIMED (from the OPS-16 row) /
VERIFIED NOW (your independent check, with snapshot/timestamp) / DELTA
(resolved, worse, unchanged, superseded, or could-not-verify-and-why). Close
with a short synthesis: which of the four named clusters (OPS-24 rails, the
`excluded` taxonomy, the capability roadmap, P-212/P-213) is in the worst
state right now, and what the single highest-leverage next action is. Keep
prose tight — this becomes a doc_repo amendment row, not a document in
itself. Flag anything you find that looks like a NEW defect beyond what these
rows already named — do not chase it down, just name it for the planner.

### Close

Return your full report in your final message. There is no CP1/CP2/close
JSON for this mission — it is not a build lane and nothing needs a
probe-close-gate artifact. State your snapshot (doc_repo commit, and every
product-repo commit you read) at the top of your report.
