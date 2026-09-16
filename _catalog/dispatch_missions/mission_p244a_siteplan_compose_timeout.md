## Mission — P-244 leg A: the standalone site-plan compose fails on its own at ~116 seconds

### The finding, measured on the authoritative record

P-240 ported site-plan export onto an async job pattern and deployed it. **Within two minutes it
exposed a defect the old synchronous path had been hiding.** Read directly from the job table,
not from tool output:

    site_plan_export_jobs  48021:34049
      queued     2026-09-16 00:49:10.784
      started    2026-09-16 00:49:10.848
      failed     2026-09-16 00:51:06.907   error_class = compose_timeout
      elapsed    ~116 s

**`compose_timeout` is a CLASSIFIER, not a ceiling P-240 introduced.** In `parcel-terrain.ts` it is
`if (/timed out|timeout/i.test(message)) return "compose_timeout"`. P-240's own stall ceilings are
5 minutes for flood and **8 minutes for site plan**, nowhere near 116 seconds. So something inside
the compose threw its own timeout at roughly 116 s - which sits exactly inside the 56.8 to 115.9 s
band A-162 measured before the port.

**This defect has always existed.** The client aborted at 55,000 ms first, so every report of it
named a cold start. It is the third time a string on these routes named a mechanism that did not
happen, and the first time the system recorded the true one.

### READ THIS BEFORE SCOPING — the scope was corrected by the operator

**This is NOT "customers cannot get a site plan."** The operator: *"I've actually never had a
problem getting a site plan."* He is right. `feasibility_export_jobs` holds 9 rows, **all `ready`,
zero failed**, and one of them is **`48021:34049` - the same parcel - completing at 19:55:15** on
2026-09-15, hours before its standalone export failed.

**So the COMPOSED path works and the STANDALONE route fails, on the same parcel.** Site plans reach
customers as SP- sheets inside a Feasibility Study. The broken route is standalone
`export_instrument kind=siteplan`, whose only consumer is the MCP connector. **Agent-surface
severity.** Scope it that way.

### The question that actually matters

**Why does the standalone compose time out when the composed one, on the same parcel, does not?**
Do not assume. P-227 established by code read that the engine is SYMMETRIC on this leg - both routes
call `composeSitePlanModelForParcel`, whose own doc says "Caller-supplied only" - and P-231 was split
out because the standalone CALLER sends a descriptor the composed path supplies correctly. **That
makes P-231's descriptor defect a live candidate cause for this timeout** (a malformed or missing
descriptor sending the compose down a slow or retrying path), and it is the first thing to rule in
or out. It is not the only candidate; name the one you find.

### Repo

`hauska-engine`. Serving `hauska-engine-api-00236-few` (P-222), deployed 2026-09-16. Cut from
`origin/main` after a fetch — the local `P:/hauska-engine` checkout has been 181 commits behind and
dirty.

### Done looks like

A standalone site-plan export reaches `ready` and the artifact downloads through the connector, on
a parcel where it currently fails.

### Falsifiers, pre-register your answers before you run anything

1. **Find the thing that throws "timeout" and name it with file and function.** A fix that raises a
   limit without naming what was slow has not found the defect.
2. **Explain the composed-versus-standalone difference on the SAME parcel.** If your explanation
   would make the composed path fail too, it is the wrong explanation - the composed path
   completes.
3. **Rule P-231's descriptor in or out explicitly.** If the standalone caller's descriptor is the
   cause, say so, and note that P-231 and this leg are then one fix.
4. **Do NOT fix this by raising the timeout.** A compose that takes 116 s and is given 300 s is still
   a compose that takes 116 s. If the work is genuinely that slow and legitimate, say so with the
   measurement and propose what should change; do not silently widen a ceiling.
5. **Verify on the authoritative record**: the `site_plan_export_jobs` row reaching `ready`, plus the
   artifact downloading. Not a 200. Not a 202.
6. If the timeout originates outside hauska-engine, the row still closes with that named. An honest
   attribution is a result.

### Known traps

- **Read the job table, not the tool output.** The MCP tool currently wraps a healthy in-progress
  job in `status: error` (that is leg B, not yours) and will mislead you about state.
- The atoms store is on Neon database `hauska_mcp`; the job tables are on the engine's own
  `DATABASE_URL`. A query against the wrong one returns a false absence.
- **Do not assume Cloud Run CPU starvation.** The jobs are detached in-process
  (`void runSitePlanExportJob(...)`) and the revision has no `cpu-throttling=false` annotation, so it
  looks plausible - **it was hypothesised by the planner and REFUTED**: the job ran a full 116 s and
  failed with a classified error, so it had CPU throughout. Do not re-raise it without new evidence.
- **hauska-engine has NO deploy workflow at all.** A merge ships nothing and nothing says so.
- PDFs use Identity-H CID fonts; drawn text is not greppable. Decode via the ToUnicode CMap.

### Do not

- Do not raise a timeout to make the symptom disappear.
- Do not touch leg B (hauska-mcp-server's error envelope).
- Do not change the composed feasibility path; it works.
- Do not deploy or merge. Open the PR green and hand it back.
- Do not spawn sub-agents that themselves spawn sub-agents. You own your fan.

### Close

Name what throws the timeout, with file and function. Explain the composed-versus-standalone
difference on `48021:34049`. State whether P-231's descriptor is the cause. Show the job row reaching
`ready`. Declare `leave_behind` explicitly. State your snapshot (repo, branch, commit).
