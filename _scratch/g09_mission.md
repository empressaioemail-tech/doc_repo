## Mission — G-09: the process proving run

**You are testing the PROCESS, not doing the work.** The work is deliberately small and low-stakes.
What is being measured is whether three differently-shaped agents, following the same rulebook,
produce structurally comparable results — and where the rulebook is silent, ambiguous, or wrong.

The rulebook under test: `90_runbooks/AGENT_CONTRACT.md` (v4d5ddcd3) and `90_runbooks/DEV_PROCESS.md`
(v6b731fd3), routed by `AGENTS.md`. Both were compiled into this dispatch above. `DEV_PROCESS.md` is
four hours old and has never been followed by anyone but its author.

**The operator's success criterion, in his words: a fresh agent with no thread context should reach
the same conclusions as one with it.** You have no thread context. That is the point.

You run THREE sub-agents, each a different shape, and you supervise each to completion per contract
section 1. Shapes are chosen to stress different parts of the process; do not homogenize them.

### SA-1 — read-only audit shape

Task: resolve the two honest unknowns the cartography lane left open — `_projects/` and
`24_adaptive_ui/` — each of which needs one fact from outside doc_repo, plus backlog item 22 (the band
register is stale; verify which numeric slots in the 40-band and elsewhere are actually free).

Deliverable: a finding per item with its evidence, and a proposed disposition. Read-only.

### SA-2 — build-with-a-PR shape

Task: fix the instrument defect the cartography lane found and queued as backlog item 14 —
`scripts/doc-staleness.mjs` excludes `_decisions`, `_catalog`, and `_research` from its denominator,
leaving the decision set and the control plane unwatched by the instrument built to watch the repo
(verified at `scripts/doc-staleness.mjs:51-54`).

The fix must satisfy DEV_PROCESS 2.1 (an instrument's exclusion set is part of its contract and must be
stated where its output is read) and 2.2 (proven able to FIRE before it is trusted). Report the new
violation count WITH its counting rule and its denominator, per 1.1 and 1.2 — and reconcile it against
the previously reported 366, per 1.4.

Deliverable: the edit, the negative-test evidence, and the reconciled count. This is doc_repo, so leave
it uncommitted and list it in the close; there is no PR to open. If you believe a PR is required by the
rulebook, say so — that is a finding about the rulebook.

### SA-3 — forced mid-flight handoff shape

Task: draft the WDLL card for lane A (Smart Files) per `90_runbooks/wdll_practice.md` and OPS-17 rows
G-14, G-34, G-44, G-53, given that lane A is a BUILD not a rendering pass (amendment A-002).

**Then, deliberately, hand it off.** Stop at roughly half-done, write the handoff artifact a successor
would need, and have your successor — a fresh sub-agent with ONLY that artifact and the compiled
rulebook, no conversation with you — finish it. This is the interruption-recovery path in contract
section 2, exercised on purpose rather than by accident.

Deliverable: the WDLL card, the handoff artifact, and an honest assessment of what the successor could
NOT recover from the artifact alone. **The gaps are the finding.** A clean handoff means the process
works; a lossy one tells us exactly which field the close schema is missing.

### What YOU deliver — the actual point of this lane

A process verdict at `_inbox/2026-08-14_g09_close.json`, containing:

1. **Structural comparability.** Are the three closes comparable? Where did the three agents make
   DIFFERENT choices that the rulebook should have determined? Each divergence is a process defect,
   not an agent defect — name it that way.
2. **Every rule that was silent, ambiguous, or wrong.** Cite the rule number. This is the highest-value
   output of the lane; a rulebook whose author is its only user has never been tested.
3. **Every rule that FIRED and prevented something.** Equally important, and it is the evidence that a
   rule earns its place. A rule nobody ever hit is a rule nobody needs.
4. **Time-to-first-useful-action per sub-agent.** How long before each could do real work versus read
   context. If the reading order in `AGENTS.md` is wrong, this is where it shows.
5. **A proposed diff to DEV_PROCESS.md and AGENT_CONTRACT.md.** Proposed, not applied.

### Rules on your own work

- You are bound by the rulebook you are testing. Follow it exactly, including where you think it is
  wrong — then report that it is wrong. Do not quietly work around a rule; a workaround is a finding
  you just destroyed.
- Verify at source. The numbers in this brief are the planner's and may be wrong; **reporting a planner
  figure as wrong is a successful outcome** (DEV_PROCESS 3.2).
- Leave doc_repo edits uncommitted and list them in the close.
- An honest partial close beats a narrated full close.

### Out of scope

Any lane A/B/C/D build work. Any amendment to OPS-17 (propose; the operator rules). Committing.
Any work belonging to another program running in another chat.
