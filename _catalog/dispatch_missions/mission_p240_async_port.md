## Mission — P-240: port the two remaining synchronous routes onto P-155's async pattern

### The finding you are acting on

**Three synchronous routes outrun the client's 55,000 ms abort, and every one of them reports a
mechanism that did not happen.** Two are still open and this row closes both.

| Route | Measured 2026-09-15 | State |
|---|---|---|
| feasibility refresh | 85 to 154 s on Travis, 201 | **already fixed** by P-155, async + poll-download |
| flood-drainage refresh | 56 to 75 s, **11 of 11 returned 201**, 6 of 11 over the abort | **open, this row** |
| site-plan export | 56.8 to 115.9 s, **all 201** | **open, this row** |

**The engine never failed once in any of them.** Every single call returned 201. What the customer
sees is a timeout or a cold start, and both strings name a mechanism that did not occur. P-155's own
close already recorded that the cold-start wording "names the wrong mechanism"; this is the third
and fourth instance of the same sentence being wrong.

### This is NOT a flood row

It has been carried on the board as "the flood async port" and that framing is wrong. Site-plan
export is in the same class, was added to it by A-162, and must be ported in the same lane. If you
scope this to flood only you will be back here.

### The pattern already exists, is deployed, and is proven

P-155 solved this exact class for feasibility refresh. **Port these two routes onto that pattern.
Do not design a second one.** If you find a reason P-155's shape cannot serve one of these routes,
that is a finding worth reporting, not a licence to invent an alternative quietly.

### Done looks like

Both routes return immediately and the client polls for a download, on P-155's pattern.

### Falsifiers, pre-register your answers before you run anything

1. **The engine's own request log shows the client no longer aborts** on either route. Not a
   stopwatch on your own call: the engine's log is the instrument, because the client-side view is
   what has been lying.
2. **Generate each artifact on the customer surface and confirm it arrives.** A route that returns
   202 immediately and never produces a downloadable artifact is a worse defect than the one you
   are fixing, and it would pass a naive latency check.
3. **The old synchronous path is retired, not left beside the new one.** Per ENFORCEMENT's
   retirement rule: repoint consumers first, then retire; a retired path returns a decline or 404
   and a check fails if it reappears. If you leave both, say so explicitly and name the divergence
   test.
4. **Confirm the error strings.** If a genuine failure can still occur on these routes, the message
   must name the mechanism that actually happened. Shipping the async port while leaving a
   cold-start string that fires on a non-cold-start is half the row.
5. If you conclude one of these two routes is NOT in this class, the row still closes, with the
   measurement that establishes it. An honest refutation is a result.

### Known traps

- **Do not accept a timeout or a cold-start string at face value on any of these routes.** That
  string has been wrong three times out of three. Read the engine's request log.
- **hauska-engine has NO deploy workflow at all.** A merge ships nothing and nothing says so. Your
  work is not live when merged; say so plainly in the close rather than implying otherwise.
- A 200 or a 201 is not a success. Verify by served content and by the artifact actually arriving.
- The client abort is **55,000 ms**. Anything you measure between roughly 50 and 60 seconds is
  inside the noise band of the thing you are fixing; do not conclude from a single sample.

### Do not

- Do not scope this to flood only.
- Do not invent a second async pattern when P-155's is deployed and proven.
- Do not deploy or merge. Open the PR green and hand it back.
- Do not spawn sub-agents that themselves spawn sub-agents. You own your fan.

### Close

State the measured before-and-after from the engine's request log for BOTH routes, and name the
customer-surface artifact you generated for each. State whether the synchronous path is retired or
left in place, and if left, why. Declare `leave_behind` explicitly. State your snapshot (repo,
branch, commit).
