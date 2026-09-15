## Mission — P-234: the X-ray gate refuses before the engine is ever asked

### The finding you are acting on

P-221 rebuilt the X-ray as a subset of the feasibility model, exactly as P-120 ruled. It was
merged (#450, `4237c0b`), and the integration seat BUILT AND DEPLOYED it: Cloud Build
`ec9f434b` SUCCESS, digest `sha256:ce50efea…8ea0`, serving revision `hauska-engine-api-00228-zat`
at 100 percent, read by field. All four of P-221's pre-registered falsifiers were confirmed at
the code level, including the strongest form — `verdictLine` and `brief` were DELETED from the
options type and from the route's zod schema, so no code path can assemble them from caller
input even by mistake.

**And `export_instrument kind=dossier` on `48021:34049` still returns the byte-identical
refusal it returned before the fix:**

```
{"error":"pipeline_output_absent",
 "message":"X-ray cannot be generated: the verdict and cited brief facts were not produced...",
 "missing":["verdict","brief_facts"],
 "upstreamBodyStatus":422,
 "upstreamStatus":"unmeasured"}
```

**The refusal never reaches the engine.** Measured by the integration seat: `hauska-engine-api`
logged ZERO dossier or X-ray requests in the hour around the call, and a full 20-minute sweep
of ALL engine traffic shows only `/health` and two `site-plan-export/refresh` calls. The tell
was in the payload the whole time — **`upstreamStatus: "unmeasured"` literally says the caller
never measured upstream** — and it was read past on the first pass.

The connector routed the call to **hauska-mcp-server** (`/mcp` at 18:16:07Z, project
hauska-prod-497015). `pipeline_output_absent` appears in exactly two repos: hauska-engine's own
route, which P-221 fixed, and **`hauska-mcp-server/src/xray-export-gate.ts`** — a file named
for precisely this job, in a repo no lane has touched.

**METHOD NOTE, and do not skip it:** that file was located by GitHub code search, which is
**NOT exhaustive** — the same query returned zero matches for legacy-design-tools, which may
well be a false negative. **Confirm by reading the repo before treating `xray-export-gate.ts`
as the sole emitter.** If a second emitter exists, find it now rather than after a fix that
only half-works.

### Done looks like

`export_instrument kind=dossier` produces a real file for a parcel whose brief facts are
present. The gate either asks the engine and reports what the engine actually says, or it
declines naming an artifact that is GENUINELY missing **and** an action available on the
surface the caller is actually using.

### The two constraints that bound any fix

**1. Do NOT weaken the hollow-report refusal.** P-221 preserved it deliberately and P-221's own
row is explicit: declining to emit a hollow report is the behaviour we want, and the bug is
that it has to. After your change the refusal must still fire when the inputs are genuinely
absent. It becomes unreachable in the normal case; it is never removed.

**2. The remedy text is itself a defect.** "Open the property brief and try again" is a WEB APP
instruction with no connector equivalent, and opening the brief did not help. A refusal that
names an action the caller cannot take is a dead end wearing a helpful face. Any refusal this
path can still emit must name an action available on the surface the caller is on.

### Falsifiers, pre-register your answers before you run anything

1. **Confirm the current refusal is emitted WITHOUT an engine call, by reading the code**, not
   by inferring it from the log evidence above. If the gate does call the engine on some path,
   the mechanism is different from what this row assumes and you must say so.
2. **Construct a parcel whose verdict or brief facts are genuinely absent and confirm the
   refusal STILL fires after your change.** If it does not, you removed the guard rather than
   making it unreachable, and this row is failed regardless of how well the happy path works.
3. **Search the repo yourself for other emitters of `pipeline_output_absent` and of the same
   refusal shape.** If `xray-export-gate.ts` is not the only one, a fix there alone will look
   like it worked on your test parcel and still fail elsewhere.
4. If `kind=dossier` starts producing a file but its content disagrees with the feasibility
   study for the same parcel, P-221's subset relationship has been broken downstream and the
   row is not done.

### Known traps

- **hauska-mcp-server is its own repo and its own Cloud Run service** in project
  `hauska-prod-497015`. It is NOT legacy-design-tools and NOT the `smartsite-mcp` service in
  `legacy-design-tools-prod`. Confirm which service actually serves `export_instrument` before
  editing; both exist and both answer `/mcp`.
- **Check whether the deployed revision is current.** A merge there may ship nothing — no repo
  in this portfolio auto-deploys on merge, verified three times on 2026-09-15. Read the serving
  revision by field and say what it is.
- `upstreamStatus: "unmeasured"` is a real signal, not boilerplate. Wherever it is set, that is
  a place the code KNOWS it did not consult upstream. Use it.

### Do not

- Do not weaken the hollow-report refusal.
- Do not edit hauska-engine. P-221's engine-side work is correct and deployed; the defect is
  not there.
- Do not deploy or merge. Open the PR green and hand it back.
- Do not spawn sub-agents that themselves spawn sub-agents. You own your fan.

### Close

Name the service and the deployed revision you measured against, and state whether
`xray-export-gate.ts` was the only emitter. Close to `_inbox/` on doc_repo main and PUSH it.
Declare `leave_behind` explicitly. State your snapshot (repo, branch, commit).
