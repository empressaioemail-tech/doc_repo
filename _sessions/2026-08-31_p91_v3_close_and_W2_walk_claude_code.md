---
id: 2026-08-31_p91_v3_close_and_W2_walk_claude_code
title: Session 2026-08-31. Two frozen chats reconciled, p563 shipped, v3 met its yardstick on a live walk, and a production auth outage traced to a reverted secret
date: 2026-08-31
status: closed
type: session
seat: integration planner, P:/doc_repo main
continues: _sessions/2026-08-30_p91_v3_mcp_wave_claude_code.md
---

# What happened

The session started as a reconciliation between two context-starved chats and ended with v3 meeting its own yardstick on a live connector walk. Along the way it shipped a cut, killed a build lane before it started, and found a customer-facing outage that nobody had noticed.

# Reconciliation

Two chats had run the same wave from different sides, a roadmap canvas and the executing planner, and both froze late rather than wrong. Reconciled against GitHub and Cloud Run rather than the deploy records, because in that question the records are the proxy. Four stale claims corrected, one refused.

The refusal is the part worth keeping. `_STATE.md` was to be regenerated as part of the fix. Reading the generator first showed it is a pure concatenation of six seat files with one variable, the timestamp, and every source predates the last run. Regenerating would have changed nothing but the "last generated" line, turning a stale file into a fresh-looking stale file. The pointer in `00_current_state.md` now carries that caveat instead, and the real fix sits in a file this seat does not own.

The finding that mattered: cortex-api had moved to `00672-ceq` on a NEW digest after the wave closed, so the entire P-91 v3 panel had been verified against a cortex that no longer served, and nobody on that thread knew.

# p563: the vocabulary cut

Two subagent lanes on the cheaper model, both barred from git.

The measurement lane paid for itself by killing a build. Q1 asks that `find_parcel` gain `near`, `subdivision` and `street`. Measurement found `near` needs a radius route that does not exist, `subdivision` needs a source rather than a better regex (no `txgio` column holds it; the shipped parser extracted zero of six on the repo's own fixtures), and the bare-street half needs cortex too. That is the mirror of last wave's M1 result, where the same question deleted a dependency. Q1 was routed to the property seat rather than built, and one read-only lane was spent instead of a build lane.

It also found a defect on the way, in another seat's file: `recordsSearchQueryPlan.ts:16` uses `BLK(?:OCK)?`, which expands to `BLK` or `BLKOCK` and can never match `BLOCK`. Verified by violation. It degrades silently, since a legal description carrying `BLOCK 3` yields no block term and the records search returns a wider result that still looks complete.

The build lane shipped V1 to V6 plus the V2 payload half at the MCP normalisation seam. The planner re-ran the suite and three mutations chosen independently of the lane's own nine, and added one check the brief did not ask for, because appending a content part to every result could have shipped as visible junk. Merged as #562, deployed as p563 on `smartsite-mcp-00078-fat` behind a new pre-shift gate that reads the `DATABASE_URL` secret binding before any traffic moves.

# The verify lane

Compiled through `scripts/dispatch.mjs`, hand-carried, and it closed clean. F-11 introduced a new setback refusal carrying a prose `basis` that is not in the 19-token vocabulary table. The lane established by write path rather than by probing outputs that it reaches nobody today: the brief assembler drops `setback`, the facets consumer copies only `queryPoint`, and `edgesFromDraw` never reads it. It then declined to add a vocabulary row, correctly, because a 70-character prose sentence is not a token and mapping it would have been a starved row. It named the precondition instead: a closed code on each serve arm before any vocab row. The planner verified its load-bearing claim two independent ways.

# The W2 walk: v3 meets its bar

Capability 5 of 5, refusals 7 of 7, traps 3 of 3. Full grades at `_inbox/2026-08-31_p91_v3_W2_walk_results.md`.

The methodological move that made the grades worth anything came from the walk itself. The first chat asked to run it had already read every pass criterion and refused to be its own subject, on the correct ground that seven of the twelve scenarios test honest absence and a chat that knows the passing behaviour proves only that it read the card. It took the harness role and pulled ground truth instead, which produced three card corrections BEFORE the walk ran, each of which would otherwise have marked a correct answer wrong.

Eight findings came out of the walk and not one is an honesty failure. Every one is the product saying something imprecisely rather than claiming something it does not know, which is the distinction the whole programme exists to hold.

The strongest single result was the derived-figure trap. It refused both halves and named the escape hatch before declining it, "not the area with a caveat, and not the percentage from a caveated area", then found a lot size on the web, quarantined it as third-party, and quoted the aggregator's own disclaimer back. That is the failure that would have been invisible and confident.

The disposition-union defect was found three independent ways in one day: by the harness chat holding ground truth, by the planner reading the write path, and by a blind chat from the payload alone. `unknown` is not in the node disposition union, so it derives to `absent` and strengthens a claim, which is the one direction that file's own comment forbids.

And a failure mid-walk proved more than the passes did. After a transport 400 the panel received a reply shape nothing had designed for and printed "Result not readable", painting nothing: no stale data, no empty state that reads like a finding. Fail-closed holding under an unplanned condition is better evidence than any fixture, because no fixture anticipated it.

# The outage, and a correction the planner owes

Mid-session the operator's Google login returned `session_exchange_failed`. Read-healthy with writes failing is the exact signature of the Neon incident, and the cause was found in one query: the F-11 deploy at 02:52Z had rebound cortex-api's `DATABASE_URL` from `DEPLOYMENT_DATABASE_URL_DIRECT` back to the pooler. Authoritative-replace; that workflow carries the old secret in its own spec and the seat had no reason to know the fix was hand-applied. Fixed by redeploying the identical digest with the correct binding, gated before the shift.

The correction: this planner had written "the product write path is proven end to end" into the incident doc and the previous session close, on the strength of an operator write that succeeded. That write went through smartsite-mcp, which has its own database and had the gate. cortex-api was never tested and had already been reverted for ninety minutes when the claim was made. One write path was generalised to the product.

The deeper failure is not the wording. The mitigation was never made structural. A secret rebound by hand survives exactly until the next workflow deploy of that service, and the planner applied a pre-shift binding gate to its own deploy while never checking whether the sibling service had already been reverted. The gate belongs in the workflow file.

# Lessons

Measuring before building was right twice in two waves and gave opposite answers both times. That is the argument for keeping the step even when the answer feels obvious.

A grader that has read the answer key cannot grade itself, and the agent that says so unprompted is worth more than the walk it declined to run.

Three of the planner's own errors this session were caught by controls or by reading an instrument, and none by re-reading a conclusion: a grep whose negative result was wrong because the imports use the ESM `.js` form, a `_STATE.md` regeneration that would have made stale look fresh, and a branch move that broke the seat gate. The gate has now caught a real planner mistake in two consecutive sessions.
