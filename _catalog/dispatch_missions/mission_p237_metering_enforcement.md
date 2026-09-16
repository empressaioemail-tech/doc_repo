## Mission — P-237: make the metering ruling enforceable, and date the X-ray regression

### The ruling you are protecting, and the hole in it

**RULED (operator, 2026-09-15): accept that a genuinely hollow X-ray refresh consumes a meter
tick.** A tick costs nothing today, verified on deployed main: `handleSettledOveragePayment` has
**zero call sites**, so the outbound RevenueRouter is dormant, and `source-obligation-meter.ts:224`
sets `amountMinor` to a number only when `perReferenceRateMinor` is finite — today rows land
`amount_minor: null` with `graceTerms: "pending-rate"`.

**The trigger is the whole point and it is UNENFORCED: moving metering after the engine's verdict
must land BEFORE any real `perReferenceRateMinor` is set.** The moment a finite rate exists, those
rows stop being free and start being wrong — customers metered for a refusal.

The ruling says so in its own words: **"Someone remembers" is not a control.** You are building the
control.

### What you are building

**A CI check that FAILS when a finite `perReferenceRateMinor` can resolve while the metering order
is unchanged.** Not a warning. Not a log. A red build.

Answer the three-question gate explicitly in your close:

1. **What executes it?** A CI job or a test. Not a role, not "the operator reviews."
2. **What triggers it?** Name the event.
3. **What fails, and is that thing running today?** A merged, correct, undeployed check enforces
   nothing.
4. **What bypasses it?** The answer is rarely none. A CI grep is bypassed by anything not passing
   through CI; a rate set at runtime from config or a database row is bypassed by a source-code
   check entirely. **If the rate can be set without touching this repo, say so plainly** — that is
   the most important sentence in your close, and it may mean the check has to live somewhere else.

### Folded into this row, same repo, same surface

**(a) Date the X-ray regression.** Both ends are now bounded. The QA capture lists X-ray artifacts
for 1505 WATER ST and 1101 CHESTNUT ST dated **2026-09-08**; P-221 measured `export_instrument
kind=dossier` as unable to generate at all on the morning of **2026-09-15**; and the integration seat
generated a dossier for `48021:34137` through the live MCP path at approximately **21:45 that
evening**, after P-221 and P-234 deployed. So it broke after 09-08 and was repaired that night —
**and nobody named what broke it.** A defect repaired without a cause can recur, and this repair took
two fixes in two repos. Bisect the gate across that window.

**(b) `verdict_line` and `brief` are documented, accepted and ignored** in the MCP tool schema. This
row's own leave_behind already names it. It is the same vestigial-argument surface P-234 removed from
the gate, so the bisect will take you straight to it. **A parameter that is accepted and ignored is
its own honesty defect**: remove them, or make the description say they do nothing.

### Repo

`hauska-mcp-server`. Free as of 2026-09-15 — P-240's `#84` merged as `744d16c`. Cut from
`origin/main` after a fetch.

### Falsifiers, pre-register your answers before you run anything

1. **Verify the check by violating it.** Set a finite `perReferenceRateMinor` in a fixture with the
   metering order unchanged and confirm the build goes RED. A check observed only passing has not
   been observed working. **Paste the red.**
2. **Then confirm it passes on the current tree**, so you have not shipped something that blocks
   everything.
3. **Confirm the check is not vacuous.** A predicate built by string concatenation that compiles to
   an alternation with an empty branch matches every input and reports success — that exact failure
   happened in this program and went into a commit message. Include a not-vacuous case that proves
   the predicate can distinguish.
4. **The bisect must name a commit.** "Something between these dates" is not a result. If you cannot
   isolate one, say what you ruled out and what remains.
5. If you find the rate cannot be set from this repo at all, the row still closes — with that
   finding stated plainly, because it means the control belongs elsewhere and the ruling still has a
   hole.

### Known traps

- Read the authoritative record, never a proxy. Whether `handleSettledOveragePayment` has call sites
  is answered by enumerating them, not by inferring from a grep of a name.
- `hauska-mcp-server` auth is the `X-Hauska-Key` header, not Bearer; a wrong header silently falls
  through to public rather than failing loudly.
- Gate enum is `public|codex|reporting|map`; legacy `cortex` normalises to `reporting`.
- Serving revision is `hauska-mcp-server-00094-nis` as of 2026-09-15, plus whatever P-240's `744d16c`
  canary lands. Read Cloud Run traffic BY FIELD, never a positional `--format=value`, and never trust
  `latestReadyRevisionName`.

### Do not

- Do not reorder metering in this lane. The ruling explicitly declined to reorder it now; you are
  building the thing that forces it to happen at the right moment.
- Do not set a real `perReferenceRateMinor`.
- Do not deploy or merge. Open the PR green and hand it back.
- Do not spawn sub-agents that themselves spawn sub-agents. You own your fan.

### Close

Answer all four gate questions, including what bypasses the check. Paste the verbatim RED from the
violation and the green from the current tree. Name the commit the bisect isolated, or state what you
ruled out. Say what you did with `verdict_line` and `brief`. Declare `leave_behind` explicitly. State
your snapshot (repo, branch, commit).
