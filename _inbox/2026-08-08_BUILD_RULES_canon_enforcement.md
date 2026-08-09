---
id: 2026-08-08_BUILD_RULES_canon_enforcement
title: Canon enforcement build rules — six mechanisms, ranked by leverage
date: 2026-08-08
status: proposal (design only; nothing built)
owner: nick
related: [_decisions/2026-08-08_ldt_is_the_factory_repo, _inbox/2026-08-08_MEMORY_system_audit, _inbox/2026-08-08_BLUEPRINT_doc_inventory, _decisions/2026-08-07_envelope_saga_close_and_geometry_law, 90_runbooks/session_close_template, _dispatches/_template]
---

# Canon enforcement build rules

Design document. Six mechanisms that make canon-vs-reality divergence detectable and, where it matters, unrepresentable. No prose exhortations: every mechanism below either fails a command, blocks a tool call, or writes a row that a human sees.

## The one architectural fact that decides everything below

`P:\doc_repo` has **no CI at all**:

```
$ ls -la .github/
NONE
$ ls .github/workflows/
NONE
```

And no active git hooks:

```
$ ls .git/hooks/ | grep -v sample
no active hooks
```

But it does have a **working, load-bearing PreToolUse hook that has held since 2026-05-16**:

`P:\doc_repo\.claude\settings.json`, hooks block, verbatim:

```json
"hooks": {
  "PreToolUse": [
    {
      "matcher": "Bash",
      "hooks": [
        {
          "type": "command",
          "command": "powershell -NoProfile -ExecutionPolicy Bypass -File P:/doc_repo/.claude/hooks/branch-guard.ps1",
          "timeout": 5
        }
      ]
    }
  ]
}
```

`P:\doc_repo\.claude\hooks\branch-guard.ps1:1-5`, verbatim header:

```
# Branch-protection hook for git commit / git push tool calls.
# Refuses commit/push when working tree is not on `main` (single-branch workflow per CLAUDE.md).
# Invoked from .claude/settings.json PreToolUse hook on Bash matcher.
# Claude Code passes the tool payload as JSON on stdin (verified 2026-05-16 via diag log).
# Fails open on any parse error so a hook bug never breaks routine Bash use.
```

This is the single most important input to this design. **The only governance control in this repo's history that got built and stayed alive is a PreToolUse hook.** It is 39 lines of PowerShell, it fails open on parse error, it blocks the exact tool call that would do damage, and it has never been disabled. Every control that was written as prose in a runbook has a 0 percent or near-0 percent execution rate. The design below therefore biases hard toward the hook shape and away from the protocol-step shape, and where a mechanism cannot be a hook it is built as a script whose output lands in a place the operator already looks.

Corollary that must be stated plainly: **doc_repo cannot host a CI check today.** Any mechanism specified as "a CI check in doc_repo" carries a hidden prerequisite (create `.github/workflows/`, get Actions running on this repo) that has never been paid. Mechanisms below that need CI say so and price the prerequisite. Mechanisms that can be hooks or local scripts are preferred precisely because they route around that unpaid prerequisite.

---

## RANKED LIST

Ranked by recurrence prevented per unit of build cost.

| # | Mechanism | Prevents | Form | Build | Run |
|---|---|---|---|---|---|
| **1** | **M1: pre-dispatch canon gate (PreToolUse hook)** | The master planner dispatching ten tables into a declared-retiring repo. Failures 1, 2, and 5 in the brief. | PreToolUse hook on Agent/Write, PowerShell, alongside branch-guard | ~4 hours | ~0 (200ms per dispatch) |
| **2** | **M3: standing-decision injection, enforced by the same hook** | FLEET-L3-GAP. 2 of 11 August dispatches carried standing decisions; 0 of 11 carried fleet memory. | Same hook, second rule + a generated block file | ~2 hours on top of M1 | ~0 |
| **3** | **M2: canon-vs-reality divergence detector** | Failure 1 and 2 as *detection* rather than prevention: 387 commits into a "retiring" repo, 23 post-decision commits on a "zero new work" clock. | `.mjs` script, git log against a manifest, run on the existing inbox-sweep loop | ~6 hours | ~2 min per run |
| **4** | **M6: stale-claim detector (claim assertions)** | OPS-1 statewide-coverage claim vs 6 counties; 75m MUD/RRC "LIVE" via a dead vendor. Failure class: docs asserting facts the store refutes. | Machine-readable claim blocks in docs + a prober script | ~10 hours | ~5 min per run |
| **5** | **M5: doc precedence enforcement** | Six competing factory specs, four invariant sets. Failure 6 (a session grading against BCAD for a day after the Geometry Law). | `_catalog/precedence.json` + a frontmatter linter in the same script as M2 | ~5 hours | ~10 s per run |
| **6** | **M4: grading rung, DELETE and replace** | 0 of 215 sessions. Failure 4. | Deletion + a one-line mechanical substitute | ~1 hour | ~0 |

**Build M1 first. M1 and M3 are the same hook and should ship as one unit.** Rationale in the leverage section below.

---

## M1 — Pre-dispatch canon gate

### The failure it prevents, stated precisely

`_decisions/2026-08-08_ldt_is_the_factory_repo.md:56`, verbatim:

> The master planner dispatched ten tables into a declared-retiring repo on 2026-08-08 without checking the intent doc first. That is a governance failure, not an ldt failure: the canon is only load-bearing if something forces a read before dispatch and something detects divergence after.

The gap is not that the planner cannot read `repo_intents.md`. It is that nothing in the act of dispatching touches that file. A dispatch is an Agent tool call or a Write into `_dispatches/`; neither reads canon. The intent doc is a document you have to *remember* to consult, and the memory audit establishes that this fleet does not reliably remember anything that is not in the prompt (`_inbox/2026-08-08_MEMORY_system_audit.md:197`, verbatim: "an always-apply rule that says 'go read a file' is weaker than content physically present in the prompt").

### What it checks

A PreToolUse hook on the `Agent` and `Write` matchers. On every call it:

1. Extracts the target repo. Three sources in priority order: an explicit `repo:` line in the prompt or file content; a `P:\<repo-name>` path appearing in the payload; the `repo:` frontmatter field for a `_dispatches/` Write.
2. If no repo resolves, **exit 0** (fails open, a hook that blocks unclassifiable calls gets disabled within a day).
3. If a repo resolves, read `_catalog/repo_intents.json` (the machine-readable sibling M5 creates; until then, parse the markdown table row).
4. Compare the intent record's `last_verified` date against today. Compare the record's `posture` field against the dispatch.

### What it blocks

Exactly two conditions, and no others:

- **BLOCK: dispatching new work into a repo whose posture is `retiring` or `no-touch`.** Message names the intent line and the decision record, and states the override form. This is the ldt case and the smartcity-os absolute-no-touch case.
- **BLOCK: the intent record's `last_verified` is more than 30 days old.** Message: "repo_intents record for legacy-design-tools was last verified 2026-07-04, 35 days ago. Re-verify against `git log` before dispatching, or stamp it." This is the mechanism that would have fired on 2026-08-08: the record was 35 days stale and the block would have forced the read that produced the correct ruling.

Everything else passes silently. The hook must be quiet in the normal case or it becomes noise.

### Override

`CANON_OVERRIDE: <reason>` on its own line in the dispatch prompt. The hook greps for it, and when present, exits 0 **and appends a row to `_catalog/canon_overrides.log`** (date, repo, reason, first 200 chars of the prompt). An override that leaves no trace is a hole; an override that writes a log row is an audit trail and a divergence signal in its own right, three overrides on one repo in a week means the intent record is wrong, not that the operator is careless.

### Where it lives

`P:\doc_repo\.claude\hooks\canon-gate.ps1`, wired into the existing `.claude/settings.json` hooks block as a second PreToolUse entry with matcher `Agent|Write`. It sits beside `branch-guard.ps1` and copies its proven structure verbatim: read stdin JSON, `exit 0` on any parse failure, `exit 2` with a JSON `{"block": true, "message": ...}` on a real violation.

### Cost

Build: about 4 hours. The stdin payload shape is already known and documented in `branch-guard.ps1:4` ("verified 2026-05-16 via diag log"), which removes the single hardest unknown. Run: one file read and a date comparison per Agent/Write call, under 200ms, inside the existing 5-second hook timeout.

### How it fails

**False positive, the dominant risk.** A repo-name match on a prompt that merely *mentions* `P:\legacy-design-tools` while dispatching work elsewhere. This is the disable-the-hook risk and it must be engineered against from day one. Three mitigations: (a) resolve the repo only from an explicit `repo:` declaration or a path that appears in a clone/branch context, never from a bare mention in prose; (b) block only on `retiring`/`no-touch` posture, which is a two-repo set today (`legacy-design-tools` clocks 1 and 2, `smartcity-os`), so the blast radius is small and known; (c) the override is one line and self-documenting. If the hook fires more than roughly once a week on a legitimate dispatch, it is miscalibrated and should be narrowed, not disabled.

**False negative.** A dispatch that names no repo, works through a worktree path the hook does not recognize (`P:\ldt-*`, `P:\hauska-engine-e-*`, roughly 40 of these exist per `_catalog/repo_intents.md:51`), or is pasted directly into an Agent prompt with the repo implied. The memory audit already flags this exact blind spot at `_inbox/2026-08-08_MEMORY_system_audit.md:325`, verbatim: "Many subagent dispatches this fleet runs are pasted directly into the Agent tool prompt and never written to `_dispatches/`." Mitigation: add worktree prefix patterns (`ldt-*` → `legacy-design-tools`, `hauska-engine-*` → `hauska-engine`) to the resolver. Accept the residual: this hook catches the *majority* case, not every case, and its value is not diminished by that.

**The stale-record failure.** The 30-day check is only as good as the `last_verified` stamp, and a stamp is a thing a human writes. If stamping degrades into a reflex ("touch the date, do not re-read"), the check becomes theater. This is the same disease as the grading rung. Mitigation: M2 writes the stamp mechanically from measured commit activity rather than a human asserting it, which is why M2 is ranked directly beneath the hook pair and not lower.

---

## M3 — Standing decisions that an executor cannot start without

Ranked second because it is **the same hook and the same build session as M1**, and because the evidence that hand-carrying does not work is the strongest in the audit.

### The evidence

`_inbox/2026-08-08_MEMORY_system_audit.md` measured injection rates. Reproduced here:

```
$ grep -rl "STANDING DECISIONS" _dispatches/ | wc -l
19
$ grep -rl "FLEET MEMORY" _dispatches/ | wc -l
17
$ ls _dispatches/*.md | wc -l
313
```

19 of 313 all-time; 2 of 11 in August. Fleet memory: 0 of 11 in August.

`_dispatches/_template.md:5`, verbatim: `last_updated: 2026-05-27`. Confirmed by read: the template contains a model block, an atoms block, a read-first list, workspace ownership, scope, acceptance criteria, and reporting. It contains no standing-decisions block, no fleet-memory block, no authorization clause, and no no-nesting clause.

`FLEET-L3-GAP-template-replication-not-enforced` demanded exactly this and was not built. Its own text, quoted in the audit at line 193, verbatim:

> (3) A structural coherence carrier: dispatch templates that PULL the current standing-decisions + the frozen-artifact list, so an executor literally cannot start without them. Until these exist, EVERY handoff is exposed to this failure.

### Why editing the template does not fix it

This is the crux, and it is where the obvious answer is wrong. Adding a standing-decisions section to `_dispatches/_template.md` produces a template with a `{{STANDING_DECISIONS}}` placeholder that the planner must remember to fill. That is the same class of control as the grading rung: a prose step depending on recall. The template has been wrong for 73 days and nobody edited it; there is no reason to believe an edited template gets filled in.

The fix must be **generation plus verification**, not a better blank.

### The design

**Source of truth.** `_STATE.md` STANDING DECISIONS block, lines 9-16, verified verbatim:

```
## STANDING DECISIONS (these govern every dispatch — paste into fresh-agent handoffs)

- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HELD until Bastrop QA-done + operator go.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.
```

This is already the right source. It is curated, short, operator-authored, and its own header says "paste into fresh-agent handoffs." Do not invent a new source. Do not use the 86-file memory store as the source, it is too large to inject and the audit found 4 SUPERSEDED and 2 STALE entries in it (`_inbox/2026-08-08_MEMORY_system_audit.md:103`), so injecting it wholesale would ship known-wrong content into every dispatch.

**Generation.** A script `scripts/dispatch-preamble.mjs` extracts the `## STANDING DECISIONS` section from `_STATE.md` plus the frozen-artifact list, and writes `_catalog/DISPATCH_PREAMBLE.md` with a content hash in a marker line:

```
<!-- CANON-PREAMBLE v<sha8> generated <date> from _STATE.md -->
```

**Enforcement, this is the part that makes it different from every previous attempt.** The same `canon-gate.ps1` hook, on an `Agent` tool call whose prompt looks like an executor dispatch (heuristic: contains `You are` plus a repo reference, or contains `## Scope` / `## Acceptance criteria`), checks for the `CANON-PREAMBLE v<sha8>` marker in the prompt text.

- Marker absent → **BLOCK**, with a message containing the full preamble text ready to paste. The block message is the fix. The planner does not have to go find the file.
- Marker present but the hash does not match the current `_STATE.md` hash → **BLOCK**: "your preamble is from a stale generation; standing decisions changed on <date>." This closes the copy-a-month-old-dispatch hole, which is how stale content actually propagates in this fleet.
- Marker present and current → pass silently.

**How you know it worked.** The marker is a grep-able string with a version hash. Adoption becomes measurable with one command instead of an audit:

```
grep -c "CANON-PREAMBLE" _dispatches/*.md
```

That is the property the current system lacks entirely: the 2/11 number required a hand audit to discover. After M3, the number is a grep, and a drop in it is visible.

### Cost

Build: about 2 hours on top of M1 (the hook, the payload parsing, and the block-message plumbing are already there). Run: one file read and a string comparison.

### How it fails

**False positive.** The dispatch-shaped heuristic misfires on a research or read-only Agent call and blocks it. Mitigation: make the trigger conservative, require *both* an executor-voice marker and a repo/clone reference. A read-only Explore agent call has neither. Accept that some genuine dispatches slip past the heuristic (false negative) in exchange for near-zero false positives, because a false positive on a research call is precisely how this hook gets turned off.

**False negative.** A dispatch that does not match the heuristic ships without the preamble. This is the acceptable failure direction.

**The real risk: preamble rot.** If `_STATE.md`'s standing-decisions block goes stale, the hook enforces stale content into every dispatch with a hash that says it is current, worse than no mechanism, because it launders staleness as freshness. Mitigation: M6's claim-assertion mechanism should cover the standing-decisions block itself (the Cotality-extinguished line is exactly a checkable claim), and the block should carry a `last_reviewed` date the hook warns on past 30 days. **This is a genuine weakness in the design and it should be named in the build ticket, not discovered later.**

---

## M2 — Canon-vs-reality divergence detector

### What it checks

For each repo in `_catalog/repo_intents.json`, compare the declared posture against measured git activity since the record's `last_verified` date:

| Declared posture | Measured signal | Verdict |
|---|---|---|
| `retiring` / `zero-new-work` | any commit | DIVERGENT |
| `retiring` / `zero-new-work` | any commit matching `^feat` or touching `migrations/` | DIVERGENT-SEVERE |
| `no-touch` | any commit | DIVERGENT-SEVERE |
| `active` | zero commits in 60 days | DIVERGENT (dormant-not-declared) |
| `active` | commits | OK, stamp `last_verified` = today |

The two rows that matter for the recorded failures are rows 1-2. `legacy-design-tools` declared retiring on 2026-07-04; measured today:

```
$ git -C /p/legacy-design-tools log --oneline --since="60 days ago" | wc -l
385
```

385 commits against a `zero new work` clock-1 declaration and a `retire only when empty` clock-3 declaration. The decision record independently measured 387 over the same window (`_decisions/2026-08-08_ldt_is_the_factory_repo.md:28`); the two-commit delta is a window-boundary artifact, not a discrepancy. **This detector, run once at any point in the last five weeks, would have surfaced the ldt divergence on its first execution.** That is the entire argument for building it.

Clock 2 is the finer case: `_decisions/2026-08-08_ldt_is_the_factory_repo.md:48`, verbatim: "**Clock 2, the Cortex console.** VIOLATED: 23 post-decision commits, nine of them feature work, latest 2026-07-18." Catching that requires path scoping, the intent record must carry a `paths` field (`artifacts/codex-reviewer-qa/**`, `packages/**`) so the detector can count commits *within a clock's scope*, not just repo-wide. Without path scoping, M2 catches failure 1 and misses failure 2.

### Data source

`git log --since=<last_verified> --format=%h|%s -- <paths>` against the local clones on `P:\`. Not the GitHub API: local clones are already present, `gh` adds an auth dependency and a rate limit, and the memory `verify-identifiers-against-live-source` argues for live source over cached state, a local clone with a `git fetch` first is live source. The detector must `git fetch` before measuring or it reads a stale clone; the memory `stale-clone-rewind-trap` names exactly this hazard.

### Cadence and where the alarm lands

Cadence: on the existing inbox-sweep loop (memory `inbox-sweep-loop`: `/loop 10m` per session). This is important, **do not invent a new cadence.** A new scheduled job is a new thing to maintain and forget. Attaching to a loop that already runs costs nothing.

Where the alarm lands. Three candidates, and the choice matters more than the check:

1. **A file the operator already reads.** Write divergence rows into `_STATE.md` under a `## CANON DIVERGENCE` heading, or into `_catalog/canon_divergence.md` linked from `_STATE.md`. Cheapest, and `_STATE.md` is read first every session per `.cursor/rules/read-state-first.mdc`.
2. **Command Center.** The brief notes CC now has a manifest panel and observability tables (`manifest_run`, slot registry). A canon-divergence panel is a natural fit and CC is the operator console.
3. **Both.**

**Recommendation: (1) now, (2) later, and do not let (2) block (1).** The Command Center is the right long-run home and the wrong first home. CC divergence requires a DB table, a migration into ldt, an API route, a panel component, and a Vercel deploy, and `_inbox/2026-08-08_BLUEPRINT_doc_inventory.md:141` records that CC's own documentation is stale enough that nobody can currently say panel-by-panel what is shipped versus stub. Building the first canon-enforcement mechanism on top of a surface whose state is undocumented is how this mechanism joins the graveyard. A markdown file written by a script has no deploy leg and no failure mode beyond "the script did not run."

The pointed version: **the mechanism that watches for drift must not itself have a five-service deploy dependency.**

### Cost

Build: about 6 hours, most of it in the `paths`-scoped intent schema rather than the git plumbing. Run: about 2 minutes across roughly 8 repos including fetches.

### How it fails

**False positive, the wolf-crying risk, and it is real here.** Once ldt's posture flips to `factory` per the 2026-08-08 ruling, its 385 commits become expected and the detector goes quiet. But any repo whose posture is stale-but-unreviewed generates a standing alarm that never clears. A permanently-red check is functionally identical to no check: the audit already documents this exact pathology at `_inbox/2026-08-08_MEMORY_system_audit.md:317`. Mitigation: divergence rows must be **acknowledgeable**. An operator ruling either changes the posture (alarm clears legitimately) or stamps an `acknowledged_until: <date>` (alarm suppresses with an expiry). Never a permanent mute. A row that has been red for 30 days with no acknowledgment escalates to the top of `_STATE.md`, because at that point the *governance process* is the thing that is broken, not the repo.

**False negative.** Work that lands in a repo without commits to the scoped paths; work in worktrees never pushed to the canonical clone; a posture written so vaguely that no measurable signal contradicts it. The third is the deepest: `_catalog/repo_intents.md:32` says clock 3 should "shrink by absorption, retire only when empty," which is a real intent with **no measurable predicate**. M2 can only check postures that are stated as machine-checkable predicates, which is a constraint on how intents are written, not a bug in the detector. Say so in the intent schema: an intent with no `check` field is explicitly unmonitored, and the count of unmonitored intents is itself a reported number.

---

## M6 — Stale-claim detector

### The failure class

Docs assert facts the store can refute. Two cited instances plus a third, all confirmed in the inventory:

`_inbox/2026-08-08_BLUEPRINT_doc_inventory.md:81` on OPS-1, verbatim: "Its own STATUS section still says 'the engine reads NONE of this today, it uses hardcoded per-county adapters,' which conflicts with the live multi-row registry the runbook and defect backlog describe."

`_inbox/2026-08-08_BLUEPRINT_doc_inventory.md:109-131` documents the 75m MUD/RRC case in full: 75m marks both LIVE while `QUEUE_parked_work_index.md:47` warns "that is the dead Cotality/extension path, NOT Smart Site; treat as greenfield." The inventory's own verdict at line 131, verbatim: "The contradiction is live and only one side carries the correction."

Third, from the same inventory at line 148: `44_mcp_cortex_architecture_map.md` "fact 2 says forty tools; fact 5 says the retrieval API is not deployed and the MCP server runs only on the operator's workstation", both false, in a `status: active` doc.

### The design: claim assertions

A doc that states a fact the system could contradict must state it in a machine-checkable form. An HTML-comment block, invisible in rendered markdown, adjacent to the prose:

```
<!-- CLAIM: mcp_tool_count
  probe: curl -s -H "X-Hauska-Key: $HAUSKA_ADMIN_KEY" https://<mcp>/admin/introspect | jq '.tools|length'
  expect: 63
  last_verified: 2026-07-15
  ttl_days: 30
-->
The Hauska MCP server exposes 63 tools across four gates.
```

`scripts/claim-check.mjs` extracts every CLAIM block repo-wide, runs each probe, and reports one of four states: OK, DRIFTED (probe ran, value differs), EXPIRED (`last_verified` + `ttl_days` < today, probe not run or unrunnable), UNPROBEABLE (probe errored).

Output goes to the same `_catalog/canon_divergence.md` as M2, so there is one alarm surface, not two.

### Which claims get blocks — the scoping decision that makes this affordable

**Do not annotate 1,717 markdown files.** Confirmed count:

```
$ find . -name "*.md" -not -path "./.git/*" | wc -l
1717
```

Annotating that corpus is a multi-week project that will not finish. Scope to claims that are simultaneously (a) load-bearing for a decision or an external statement, and (b) mechanically probeable. Concretely, roughly 20 to 30 claims:

- Coverage numbers: counties in the store, jurisdictions certified, atoms by accessPolicy. Probe: SQL count.
- Tool counts and gate enum. Probe: the MCP admin introspection endpoint CLAUDE.md already names.
- Version pins: `@empressaio/atom-contract` published version. Probe: `npm view <pkg> version`.
- Deployed state: serving revision per service. Probe: `gcloud run services describe --format=...`.
- Layer LIVE/GATE status (the 75m class). Probe: the layer registry endpoint or a tile HEAD request.

The rule that keeps it bounded and gives it teeth: **a claim block is required only for a number that appears in a customer-facing or decision-bearing statement.** That is CLAUDE.md's ground-truth paragraph, the OPS band's coverage tables, `_STATE.md` LIVE INFRA, and the Smart Site masters. Everything else is narrative and stays unannotated. This also directly implements the CODE EXISTS vs DATA LOADED vs SERVED TO PRODUCT distinction: `expect` on a code-presence grep is a different claim from `expect` on a row count is a different claim from `expect` on a live HTTP response, and the CLAIM block forces the author to say which one they are asserting. That distinction currently lives only in prose and in the retracted-finding memory `factory-product-serve-disconnect`.

### Cost

Build: about 10 hours, the extractor and reporter are straightforward, the probe-runner needs credential handling and per-probe timeouts. Run: about 5 minutes, network-bound. Credentials are the real operational cost: the probe set spans Neon, `gcloud`, `npm`, and authenticated HTTP. Any claim whose credential is absent reports UNPROBEABLE rather than failing the run, or the whole detector goes red on a laptop without `gcloud` auth and gets ignored.

### How it fails

**False positive.** Probe drift, an endpoint moves, a JSON shape changes, and the check reports DRIFTED when the doc is fine. This inverts the mechanism: the operator starts distrusting the checker instead of the doc. Mitigation: distinguish DRIFTED (probe succeeded, values differ, trust it) from UNPROBEABLE (probe failed, do not trust it, fix the probe). Never collapse the two into "red."

**False negative, the structural limit.** A doc with no CLAIM block is unchecked, and the docs most likely to be stale are the ones nobody has touched, which are exactly the ones nobody will retrofit with blocks. **M6 protects the docs someone cared enough to annotate, and the 75m case is precisely a doc nobody cared about.** This is the honest limit of the mechanism and it should be stated in the build ticket. The partial answer is M5: an unannotated doc that is also non-authoritative under precedence is a doc a session should not be reading in the first place, so M5 and M6 cover different halves of the same failure. Neither covers it alone.

**Cost-of-annotation decay.** If writing a CLAIM block is tedious, authors will state the number in prose and skip the block, and the annotated set will not grow past whatever the first pass produced. Mitigation: make the block optional-but-generated, the `repo-sync` skill (already installed at `.claude/skills/repo-sync/SKILL.md`) should emit a CLAIM block scaffold whenever a doc it produces contains a number matching a known claim-type pattern.

---

## M5 — Doc precedence enforcement

### The failure

`_inbox/2026-08-08_BLUEPRINT_doc_inventory.md:304`, verbatim: "Factory pipeline | `90_runbooks/factory_onboarding_runbook.md` vs `90_operations/OPS-2_county_onboarding_runbook.md` vs `27a_jurisdiction_factory_engine_spec.md` vs `27d_county_onboarding_recipe_and_fleet_reliability.md` vs `28_THE_BASTROP_MOLD_engine_build_spec.md` vs `29_scale_warm_architecture.md`, six docs, three generations, no cross-supersession notes".

And line 308: "Invariants | Geometry Law vs OPS-3 I1-I7 vs `_smartsite_masters/04` §1 vs OPS-INDEX five things vs CLAUDE.md four commitments vs `03_structural_constitution_and_drift_guard.md`".

And line 298, verbatim: "Only 20 docs repo-wide carry `status: superseded|retired|archived`".

The concrete harm named in the brief, a session grading against BCAD rings for over a day after the Geometry Law demoted BCAD, is a precedence failure: two docs both `status: active`, one a day older, both readable, no ordering.

Worth recording that the OPS-5 instance **has since been hand-corrected**. `90_operations/OPS-5_cert_standard.md:34` now reads, verbatim (opening):

> **CORRECTION 2026-08-08:** the R28 line below names BCAD as "the working ring." This is SUPERSEDED by the Geometry Law (`_decisions/2026-08-07_envelope_saga_close_and_geometry_law.md`, engine PR #273 Serve-Consistency): **txgio is THE truth frame** ...

That is a good correction and it is exactly the wrong kind of control: a human noticed, a human patched one of three known instances. `90_operations/OPS-2_county_onboarding_runbook.md:33` is now `### STAGE 4 — INSET (mechanical; buildable-envelope atom)`, the BCAD prose has moved or been edited, and I did not establish whether the OPS-2 and PHASE_C instances were corrected in the same pass or merely shifted line numbers. **That uncertainty is itself the argument for M5**: after a hand-patch nobody can tell from the outside whether the class was cleared or one instance was.

### The design

**`_catalog/precedence.json`**, a machine-readable topic register. Per topic: the single authoritative doc, the subordinate docs, and the rule.

```json
{
  "factory_pipeline": {
    "authority": "90_runbooks/factory_onboarding_runbook.md",
    "subordinate": ["90_operations/OPS-2_county_onboarding_runbook.md"],
    "superseded": ["27a_...", "27d_...", "28_THE_BASTROP_MOLD_...", "29_scale_warm_architecture.md"]
  },
  "geometry_invariants": {
    "authority": "_decisions/2026-08-07_envelope_saga_close_and_geometry_law.md",
    "subordinate": ["90_operations/OPS-5_cert_standard.md", "90_operations/OPS-3_..."],
    "superseded": ["30_block_cert_harness_spec.md"]
  }
}
```

**Three enforcement legs, in increasing cost:**

1. **Frontmatter linter** (in the same script as M2). Every doc listed as `superseded` must carry `status: superseded` and a `superseded_by:` field. A doc in the `superseded` list still reading `status: active` is a lint failure. This alone converts the "20 docs carry a supersession status" number into an enforceable set and is the cheapest real win in this entire document.

2. **Header stamping.** The script *writes* a supersession banner into superseded docs, the same shape `75l_cotality_data_stack_catalog.md` already uses successfully (`superseded-as-plan-of-record`), which the inventory names at line 298 as one of two docs modeling the practice well. Generated, not hand-written, so it cannot be forgotten.

3. **Read-path enforcement.** The `canon-gate.ps1` hook, on a `Read` of a doc marked superseded, emits a **non-blocking warning**: "you are reading a superseded doc; authority for `factory_pipeline` is `90_runbooks/factory_onboarding_runbook.md`." Warn, never block, superseded docs are legitimately read for provenance, and the inventory explicitly notes at line 67 that several PHASE_C docs "carry facts that survive... which is why they cannot simply be ignored." Blocking reads of them would destroy real value.

Leg 1 first. Legs 2 and 3 only if leg 1 proves the register is maintained.

### Cost

Build: about 5 hours for legs 1 and 2, plus about 2 for leg 3. **The real cost is not the code, it is the initial precedence ruling.** Somebody has to decide, for each of the nine competing-doc clusters the inventory names, which doc wins. That is operator judgment, roughly a session's work, and it is a prerequisite the script cannot supply. Run: seconds.

### How it fails

**False positive.** A doc correctly `status: active` gets listed as superseded by a careless register edit, and the linter demands a wrong flip. Low severity, easily reverted.

**False negative, and this is the mechanism's real weakness.** `precedence.json` is itself a canonical doc with no mechanism watching it. A new competing spec written next month is not in the register, so it is not superseded, so it silently competes. **This is the recursion problem: the precedence register needs a precedence register.** The only non-infinite answer is a coverage check, count docs in the OPS band and the numeric root bands that appear in *no* precedence topic, and report that count as a number that should trend toward zero. An unregistered doc is not blocked; it is *counted*. Counting is what makes it visible, and visibility is all any of these mechanisms actually deliver.

---

## M4 — The grading rung: DELETE it

### The verdict

**Delete § 2C-bis from `90_runbooks/session_close_template.md`. Replace it with one mechanical line.**

### The evidence

```
$ grep -rl "HARMED" _sessions/ | wc -l
0
$ ls _sessions/*.md | wc -l
214
```

Zero of 214. (The audit reported 215; the file count today is 214. The delta is immaterial, both round to a 0.0 percent execution rate.)

The rung is fully specified across 15 lines of `90_runbooks/session_close_template.md` § 2C-bis, verified by read. It has three sub-steps: the FIRED/HELPED/HARMED stamp, the trap-recurrence question, and the divergence/rebuild check. It is well written. Its own text at line 245 predicts the exact failure mode it was built to prevent, verbatim: "a memory or rule that is never graded against outcome can silently rot into a HARMFUL un-retired memory (e.g. the three-gate MCP enum asserted a month after the four-gate rework)."

And it has never once run.

### Why deletion and not repair

The brief states the principle correctly: a step with a 0 percent execution rate is worse than absent because it creates the appearance of a control. Three specific harms, all live:

1. **It absorbs the demand for a real mechanism.** The memory system audit's own conclusion at line 319, verbatim: "The cheapest thing that would change this: § 2C-bis is already written and costs a few lines per session. It has never been run once." As long as § 2C-bis exists on paper, the answer to "how does this fleet grade its memories" is "there is a documented protocol for that", which is true and worthless. Deleting it converts the answer to "it does not," which is honest and generates pressure.
2. **It is cited as though it works.** `64_recursive_loop/04_instantiations.md` (quoted in the audit at line 195) treats the divergence gate as a named rung of the fleet's L3 architecture. An architecture resting on a never-executed step is an architecture with a hole drawn as a wall.
3. **It failed under the best possible conditions.** Not obscure, not expensive, not disputed, the last substantive step before the commit gate, a few lines of typing, endorsed by the operator, restated in three docs. It failed 214 consecutive times. **There is no version of "try harder" that has not already been tried.** A control that fails 214 out of 214 under favorable conditions will not succeed on attempt 215 because someone re-read the runbook.

### What replaces it

Do not replace three sub-steps with three better sub-steps. Replace them with **one thing a machine can check**, and let M1/M2/M3 carry the load the rung was supposed to carry.

Sub-step 3, the divergence/rebuild check, is **fully subsumed by M1 and M2** and needs no protocol step at all: "did an executor build new machinery when a frozen artifact existed" is what a pre-dispatch gate that names frozen artifacts prevents, and what a divergence detector catches after the fact. Delete it outright.

Sub-steps 1 and 2, memory grading and trap recurrence, reduce to one line in the session summary frontmatter:

```yaml
memory_graded: [<memory-slug>:HARMED, <memory-slug>:HELPED]   # or: none
```

Mechanically enforced by the session-close path: if the field is absent, the close is incomplete. It is one field, it has a machine-checkable presence, and `none` is a legal and honest value. The count of sessions carrying the field is a grep. The count of HARMED stamps over time is a grep. Compare that to today, where establishing the 0-of-214 fact required a dedicated audit.

**Rule that generalizes past this case: a protocol step whose execution cannot be verified by a grep will not be executed.** § 2C-bis produced free-form prose in a session summary, so nobody could cheaply tell whether it ran, so nobody noticed for 214 sessions. The frontmatter field is checkable, which is the only material difference between it and its predecessor, and it is sufficient.

### Cost

Build: about 1 hour (edit the template, add the field to the session-summary convention in `01_doc_conventions.md`, add a one-line presence check to the M2 script). Run: zero.

### How it fails

**The field gets written as `none` reflexively.** Very likely, and mostly acceptable, `none` is the honest answer for many sessions, and a reflexive `none` is still infinitely more auditable than a skipped prose section, because the trend is visible. If a repo goes 50 sessions with `none` while M2 is reporting divergences, that mismatch is itself a signal: memories are not being graded, and now there is a number proving it. **The mechanism's value is not that it forces honesty; it is that it makes dishonesty countable.**

---

## LEVERAGE: which one first

**M1 plus M3 as a single build.** They are the same hook file, the same payload parsing, and the same block-message plumbing; splitting them roughly doubles total cost for no benefit.

Four reasons this pair beats the alternatives.

**It prevents rather than detects.** M2, M5, and M6 all report divergence after it has happened, and the recorded failure mode of this portfolio is not that divergence goes unreported, the memory audit, the doc inventory, and the ldt survey are three high-quality reports produced in a single day. It is that reports do not change behavior. `_inbox/2026-08-08_MEMORY_system_audit.md:300`, verbatim: "The memory about the memory system not enforcing itself is itself not enforced." A hook that returns exit 2 changes behavior in the only way that has ever worked here.

**It covers the most failures.** Of the six failures in the brief, M1/M3 address 1 (dispatch into a retiring repo), 2 (clock violation, via the same intent read at dispatch time), and 5 (template injection) directly, and reduce the recurrence rate of 6 (an executor carrying stale doctrine, because the preamble is hash-pinned to current `_STATE.md`). M2 addresses 1 and 2 as detection only. M6 addresses 3 and 6. M5 addresses 6.

**It has no prerequisites.** No CI (which does not exist in this repo), no DB migration, no deploy, no credentials, no new cadence. One PowerShell file and four lines of JSON in a settings file that already has a hooks block.

**Its precedent is the only control in this repo that survived.** `branch-guard.ps1` was built 2026-05-16 and is still wired and still enforcing. Every prose control in the same period decayed: § 2C-bis to 0 of 214, the dispatch template frozen at `last_updated: 2026-05-27` for 73 days, the FLEET-L3-GAP memory unimplemented six days after being written. **The base rate for the hook shape in this repo is 1 for 1. The base rate for the protocol-step shape is 0 for 3.** Build the shape that has a track record.

Second priority: **M2**, because it is what mechanically stamps the `last_verified` field M1 depends on. Without M2, M1's 30-day staleness check depends on a human stamping a date, which is the failure mode M1 exists to fix. M1 works alone; M1 plus M2 is self-sustaining.

Third: **M4's deletion**, an hour of work that removes a false control.

Then M5 leg 1, then M6.

---

## WHY THIS ONE GETS BUILT

The brief is right that this is a graveyard. § 2C-bis, the dispatch template carrier, and the divergence gate named in `64_recursive_loop/04_instantiations.md` were all designed, agreed, and never built. Any honest answer has to explain what is different, and "we really mean it this time" is not an answer.

**1. The thing that survived here was a hook, and this is a hook.** Not an analogy, the same file directory, the same settings block, the same language, the same fail-open structure, the same author. `branch-guard.ps1` has run on every Bash call in this repo since 2026-05-16 and nobody has turned it off. That is a measured base rate on the exact mechanism shape in the exact environment, and it is the strongest evidence available that this particular thing gets built and stays alive.

**2. It costs nothing to run, which is why controls actually die.** The three dead controls all had a recurring human cost: § 2C-bis cost thinking at session close, template injection cost a copy-paste per dispatch, the divergence gate cost a judgment call. Every one of them was skipped under time pressure, which is the only condition that matters because time pressure is the normal condition. M1/M3 cost 200 milliseconds of machine time and zero human attention in the pass case. **The failure mode of a zero-marginal-cost control is different in kind from the failure mode of a per-use-cost control: it can only die by being deliberately deleted, never by being quietly skipped.**

**3. It fails open, so it cannot become the thing that blocks the work.** `branch-guard.ps1:5` states the principle verbatim: "Fails open on any parse error so a hook bug never breaks routine Bash use." M1/M3 inherit it. The most common way a governance control dies here is that it obstructs urgent work once and gets removed; a fail-open hook with a one-line documented override never reaches that moment.

**4. Adoption becomes a grep, so decay is visible.** Today, proving that dispatch injection had fallen to 2 of 11 took a dedicated audit. After M3, it is `grep -c "CANON-PREAMBLE" _dispatches/*.md`. The controls that died did so invisibly, nobody knew § 2C-bis was at 0 of 214 until someone counted, 214 sessions in. **A control whose own health is a one-line command has a fundamentally different decay profile from one whose health requires an audit to measure.**

**5. It was written the day the failure was ruled on, with the evidence still on the table.** `_decisions/2026-08-08_ldt_is_the_factory_repo.md:56-58` names both required mechanisms and closes, verbatim: "a canon nobody is forced to read, and whose violation nothing detects, decays into fiction at the speed of the work." The build ticket and the operator ruling are the same day and the same page.

And the honest counterweight, because a design document that only argues its own case is the thing it is trying to prevent: **the strongest reason to doubt this is that the Geometry Law is the only invariant set in the portfolio that held, and it held for a reason that does not transfer cleanly.** `_decisions/2026-08-07_envelope_saga_close_and_geometry_law.md:19-28`, each of its eight rules names the mechanism making its defect class unrepresentable, and critically, each was ratified *by a merged PR that already implemented it* (#266 through #275, named inline at line 17). The law was written as documentation of enforcement that already existed, not as a promise of enforcement to come. Rule 5 is the sharpest version: "no fix is closed by a check authored in its own PR/lane; closure requires independent instruments in agreement." **This document is a design, not a merged PR, and by the Geometry Law's own standard that is exactly the weaker artifact.** The only way this proposal earns Geometry-Law status is if the ranked list is cut down to M1/M3, built, wired, and demonstrated blocking a real dispatch, at which point it can be rewritten as documentation of a mechanism that exists. Until then it is a promise, and this portfolio's promises have a 0-for-3 record. **Ship the hook, then rewrite this document in the past tense.**

---

## WHAT I COULD NOT DETERMINE

1. **Whether the Agent tool fires PreToolUse hooks at all, and what the payload looks like.** This is the single load-bearing unknown for M1 and M3. `branch-guard.ps1:4` confirms the payload shape for the `Bash` matcher ("verified 2026-05-16 via diag log"), but I did not verify that a `matcher: "Agent"` entry fires, nor that `tool_input.prompt` is the field carrying the dispatch text. **If Agent calls do not fire PreToolUse hooks, M1 and M3 must fall back to a `Write` matcher on `_dispatches/*.md` only, which per `_inbox/2026-08-08_MEMORY_system_audit.md:325` misses every dispatch pasted directly into an Agent prompt, a materially weaker mechanism.** This must be verified with a throwaway hook before any build is scheduled; it is a 20-minute check that determines whether the top-ranked mechanism is worth building in this form.

2. **Whether the OPS-2 and PHASE_C BCAD instances were corrected.** `90_operations/OPS-5_cert_standard.md:34` now carries an explicit 2026-08-08 correction (quoted above). `90_operations/OPS-2_county_onboarding_runbook.md:33` now reads `### STAGE 4 — INSET (mechanical; buildable-envelope atom)` rather than the BCAD prose the brief cites at that line, but I did not determine whether the BCAD text was corrected, moved, or merely displaced by an insertion above it. I did not check `PHASE_C_HANDOFF_bastrop_warm.md:35` at all.

3. **Command Center's actual observability schema.** The brief states `manifest_run` and a slot registry are landing. I did not inspect the ldt migrations (0068-0072) or any CC route to confirm table shapes, so the M2 recommendation to keep the first alarm surface out of CC rests on the documented staleness of CC's own docs (`_inbox/2026-08-08_BLUEPRINT_doc_inventory.md:141`), not on an inspection of what CC can already do. If CC's manifest panel is more capable than the docs suggest, the file-first recommendation should be revisited.

4. **Whether `.cursor/rules/` reaches executors that run in worktrees.** Roughly 40 `ldt-*` / `hauska-engine-*` build clones exist per `_catalog/repo_intents.md:51`. The memory audit flags the same gap at line 326 and also did not enumerate them. This bears directly on M3: if executors typically run in worktrees lacking `.cursor/rules/`, then prompt-embedded injection is not merely better than the always-apply rule, it is the *only* delivery path.

5. **The cost of the initial precedence ruling (M5).** I can enumerate the nine competing-doc clusters from the inventory but cannot estimate how much operator judgment each requires. Some are obvious (six factory specs, one runbook wins). Others are genuinely open, `_inbox/2026-08-08_BLUEPRINT_doc_inventory.md:333` records that it could not determine whether `00_current_state.md` or `_STATE.md` is the intended primary rolling snapshot, and no ruling establishing precedence was found. That one is a live ambiguity in the two most-read docs in the repo.

6. **Whether any product repo already has a CI check that could host M6's probes.** I confirmed doc_repo has no `.github/` directory. I did not check `hauska-engine`, `hauska-mcp-server`, `legacy-design-tools`, or `hauska-map` for existing workflows that could run claim probes with credentials already configured. If one exists, M6's credential cost drops substantially and its ranking should rise.

7. **Whether a divergence detector would have actually changed the ldt outcome.** M2 would have surfaced the 385-commit divergence, and I state that as fact because the measurement is mechanical. Whether surfacing it in `_catalog/canon_divergence.md` would have caused anyone to act is not something I can determine from the record, and it is the same question every one of these mechanisms turns on. It is the strongest argument for ranking the blocking hook above every reporting mechanism in this document.
