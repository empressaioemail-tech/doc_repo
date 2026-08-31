---
id: 2026-08-31_p91_q1_shipped_and_the_neon_canary_claude_code
title: Session 2026-08-31, second arc. Q1 shipped and half of it is dead on arrival, a second silent write outage, and a control built for a fault that cannot announce itself
date: 2026-08-31
status: closed
type: session
seat: integration planner, P:/doc_repo main
continues: _sessions/2026-08-31_p91_v3_close_and_W2_walk_claude_code.md
---

# What happened

The morning arc reconciled two frozen chats, shipped p563 and graded v3 against its own yardstick. This arc shipped the two cuts that came out of that walk, unblocked and shipped Q1, found a second silent write outage, and built the first control this operation has for a failure that produces no signal.

Five LDT merges: #564 the workflow binding fix, #567 the property seat's Q1 routes, #568 p564, #569 p565, #570 the canary.

# p564, and a defect card of mine that was inverted

Four findings from the walk. Three shipped, one was declared not fixed.

The one that matters is the one I got wrong. I filed the disposition-union defect as the highest-severity finding of the walk, claiming the MCP rewrote a cortex `unknown` to `absent` at node depth and therefore strengthened a claim, which is the single direction that file's own comment forbids.

The build lane read the api-server write path before implementing the brief and found the direction backwards. The node disposition type is `present | absent | refused` and structurally cannot emit `unknown`; `railStateFromSectionDisposition` deliberately projects node `absent` to stub `unknown`, documented in that file, and that is a WEAKENING. The observed stub/node difference is one fact served at two fidelities.

It then refused to build the check I specified, because a check requiring stub and node to be equal would have failed on every healthy parcel carrying an absent facet, producing a green suite around a false invariant. That refusal is worth more than the code it shipped.

I also claimed the finding was corroborated three independent ways. It was not: two of the three were the same OBSERVATION, and mine was the only mechanism, never checked against the producing side. I read a write path, which is what made it persuasive, but I read the CONSUMING side's write path and inferred the producer from its consumer. The rule that would have caught it is already written down: name the mechanism, then name a second mechanism that would produce the same observation and say why it was rejected. A deliberate stub-side projection is the obvious second mechanism for "two depths disagree" and it was never named.

What survives is smaller and real: the MCP node union genuinely lacks `unknown`, so if cortex ever widened its type the MCP would silently downgrade. Dead branch today, hardened anyway.

# Q1 shipped, and half of it does not work

The property seat merged the two routes. Cortex was NOT redeployed from that merge, which the build-versus-merge timestamps settled: the serving image was built eleven minutes BEFORE the route merge, so the routes were on main and not in the running code. Deployed from `d0b702ad`, gated, shifted to `cortex-api-00680-vog`.

p565 then wired `find_parcel` to both routes. The distinction that decided the card: a refusal from these routes is HTTP 422 carrying `serve_refused`, not a 200 with a status field, so it had to surface as a declared refusal rather than an upstream error. If `radius_unbounded` reached a user as "something went wrong", the whole reason the property seat made it a refusal rather than a truncation would be destroyed.

Then an authenticated probe found `radius-search` hangs. The 400 validation path answers in 0.17s so routing is fine; valid params return nothing and Cloud Run kills the request at 300s; 50 ft hangs exactly as 500 ft does so it is not size-dependent; `street-search` works with the same token so it is not auth. The query itself hangs.

Shipped anyway and DECLARED rather than discovered. Nothing that worked before regressed, `street` is pure gain, and holding would not have fixed the upstream. But the record states it in both directions: for that one function the new state is SLOWER and no more useful than the clean refusal it replaced, because a thirty-second timeout reads as transient when the truth is a broken query.

The isolation is not a root cause and the card says so. Two mechanisms fit, an unindexed candidate scan or a lock or connection wait, and both services currently run unpooled so connection behaviour is not in its normal configuration. Separating them needs an `EXPLAIN` and a `pg_stat_activity` sample during a hung request, and neither was run.

# The second silent write outage

The p565 canary failed its pre-shift binding gate. Traffic never moved.

`smartsite-mcp-00080-xum` had been deployed at 13:49Z through the workflow, twenty-four minutes BEFORE #564 merged, and wrote the pooler binding into the SERVICE SPEC. `gcloud run deploy --image` inherits that spec, so my canary picked up the bad value without anything in the command asking for it.

That revision served 100 percent for roughly two and a half hours with every MCP write failing. `create_screen`, `save_property`, `set_property_status`. Reads stayed green, `/health` answered ok throughout, nothing alerted.

Second service, second independent revert, one day. #564 prevents the future case for both and could not repair a revision that predates it. The only thing that caught it was reading the secret binding before shifting traffic, a gate added that morning after the cortex-api version of the same failure.

Still unmeasured and it should not stay that way: nobody has counted what failed in that window. A missing count is not a zero.

# The Neon canary, and why the console was never going to help

The operator reported seeing nothing on the Neon console. A diagnostic lane established that the injection is not occurring now, measured as a 2x2 across both databases and both hostnames, all four cells `off` with `pg_settings.source = default` where the incident's signature was `source = session`.

The finding that mattered was not the reading. The Neon operations log holds ZERO entries for the production endpoint across a window that CONTAINS the live incident and the eleven-hour regression, verified independently by the planner: 100 operations returned, every one against a staging endpoint. That API tracks compute lifecycle, not proxy-level session injection. **The console was silent while writes were actively broken and it is silent now, and the two states are indistinguishable through it.** An absent alert was never evidence of health.

Posture ruled: stay unpooled. Not because the pooler is proven bad, but because nothing could detect it going bad, a property demonstrated three times. Reverting would trade a measured cost, 19 of 901 connections, for an unmeasured risk with no detector.

So the detector was built and merged. It probes the POOLED endpoint deliberately, the one production is NOT using, because pointing it at the direct endpoint would pass forever and measure nothing; the script refuses a uri without `-pooler` in the host rather than emit a comfortable green. It checks the `source` column and not only the value, because `off` alone cannot separate a healthy default from a session-injected one. Absence of a reading is a failure, not a pass. The predicate is a file-based instrument with five fixtures in both directions, run as the first job step so a broken predicate fails before it can pass anything.

It ran. Self-test passed, probe succeeded against the real pooler, both databases `off` from `default`, zero problems, zero errors. A control that has never run is not a control, so this one was run before being called done.

# Lessons

**Every real error today was caught by a control or by a lane reading the producing side. None was caught by re-reading a conclusion.** The seat gate blocked me three times, each correctly. The pre-shift binding gate caught a two-and-a-half-hour live outage nobody had noticed. The cloudbuild guard held. Two build lanes corrected briefs of mine by reading api-server before implementing.

**My instrument plumbing failed four times in one session**, and the pattern is tight enough to be a rule rather than an anecdote: stderr merged into a JSON parser so a present image read as missing; a `sed` anchored on `$` against a line ending in a backslash; two anonymous probes that could not discriminate the cases they were built for, because auth and CORS both answer before routing; and an exit-code check that read `tail`'s status instead of node's. Each was caught by running the instrument differently, never by looking at the answer again. "I built this check in a shell one-liner" should be a reason for suspicion, not confidence.

**Ordering beat probing twice.** Whether the Q1 routes were serving was settled by comparing a build timestamp against a merge timestamp, after two probes returned answers that looked informative and were not.

**A strategic read of mine was mis-scoped, and the correction landed within the hour.** The handoff to the data planner framed the clerk index as a BULK acquisition problem: a Local Government Code 191.008 agreement or a PIA extract, per-county cost against the under-200-dollar commitment, a counterparty, and an operator ruling. OPS-16 A-060 retired that fork as mis-scoped. The analysis is sound for bulk, and bulk is not what this product needs: P-85 Records Request is a PER-REQUEST, customer-initiated path that is already built, with the worker live since 08-27, six county portals registered, Bastrop reaching a live Aumentum grid, and the document-surface purchase bind merged. Cost is per transaction, so the cost-per-jurisdiction rule is not engaged at all and the remaining blockers are small engineering.

I inherited the X3 measurement's bulk framing and never checked whether an adjacent system had already solved the problem from the other direction. That is the same failure as the disposition-union card earlier the same day: one source read carefully, the whole picture inferred from it, and the check that would have caught it is the one already written down, which is to name a second mechanism and say why it was rejected. Twice in one session, on the two largest claims I made.

**The product's constraint has moved.** v3 met its yardstick, but the yardstick was honesty and not capability. Five of thirteen ledger functions have data and eight refuse, cleanly, for four distinct and now precisely measured reasons. More MCP work has diminishing returns from here; what limits the product is acquisition. That is handed to the data planning agent, not decided here.
