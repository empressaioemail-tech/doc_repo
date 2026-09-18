## Mission — P-328: the writer that retired 92.5 percent of Bastrop refuses on blast radius

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-engine` only and open one PR. You do not
merge, deploy, run the reconcile against any store, or write to any store. Any doc_repo change is
handed back as a diff in your close.

### Why this row exists

On 2026-09-15 a parcel-node reconcile retired **57,704 of Bastrop's 62,394 parcel-node atoms (92.5
percent)**; 19 of 20 sampled retirements were live at the county's own cadastral service (OPS-16
P-212, `ENFORCEMENT.md` "A mass state change refuses before it lands"). P-212 recovered 56,691 and
added a reactivation review, but the writer still has **no blast-radius refusal**.

The writer: `hauska-engine` `packages/engine-core/src/parcel-node/reconcile-county-parcel-nodes.ts`
(`reconcileCountyParcelNodes`). Read on engine main 2026-09-18: no share, threshold or
authorisation appears in it.

P-320 built the shared refusal in `hauska-factory` (`src/lib/destructive-write-guard.mjs`: one
declared threshold, `MAX_DESTRUCTIVE_SHARE = 0.5`, one authorisation token
`<writer>:<county-fips>:<destructive>/<population>` bound to the measured counts, refusals that write
nothing and name the exact token). Its registry (`DESTRUCTIVE_WRITERS`) lists factory writers only.
P-320's own row named this writer second, and it was not reached. Read the P-319 lane's close
(`_inbox/2026-09-17_p319-retirement-safety_close.json`, `enumerationOfDestructiveWriters`).

### What to build

1. **The refusal, in this writer, before any status flips:** measure the population (the county's
   active parcel-node atoms) and the destructive count (the retirements this run would write), and
   refuse above the declared share, writing nothing and saying what it would have done, with counts
   and a sample of ids. The share alone disqualifies; the refusal needs no knowledge of what went
   wrong.
2. **One threshold, not two.** The factory's number and token format are the program's. The engine
   cannot import the factory. Carry the same constant and token format, and add a drift check that
   fails when the two disagree (read the factory's value at a pinned SHA or from its published file;
   say which and why). A second, different threshold is the defect this row prevents.
3. **An authorisation that binds to this run:** the token names this writer, the county, and the exact
   counts; a stale token does not carry.
4. **Unmeasured is not zero:** a missing count refuses.
5. **Enumerate the other engine writers** that can set a destructive status on a served record
   (parcel-node retirement, record retirement, anything that removes an atom from the served set),
   say which you wired and why the others are not in class, the way the factory's registry does.

### Verify by violation

Pre-register your falsifiers and what would prove each wrong.

- **The Bastrop shape:** a fixture where the plan omits 57,704 of 62,394 active nodes. The pre-change
  writer retires them; the post-change writer refuses and the fixture store is byte-identical.
  Revert-and-run.
- **The authorised path still works:** the exact token lets the same run through; a token with
  different counts does not.
- **A normal reconcile passes:** a handful of genuine orphans below the share retire as before.
- **The drift check fires** when the engine's constant is edited alone.

### The three-question gate

Answer in your close: what executes the refusal, what triggers it, what fails, and what bypasses it
(a raw connection, any other engine or factory writer of parcel-node status, a script run with the
refusal caught).

### Constraints

- No store writes, no reconcile runs against any store, no deploys, no merges.
- hauska-engine main carries #471 and #472. Branch from `origin/main` and declare the SHA. Another
  engine lane (P-342) is in flight on the P-263 census and envelope scripts; do not touch them.

### Close

Declare: start commit, PR number, the refusal and its placement, the shared-constant drift check,
the writer enumeration, the fixtures in both directions, the three-question gate, and
`leave_behind`.
