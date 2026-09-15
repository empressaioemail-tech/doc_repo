## Mission — P-242: close the records disclosure and prove the tier gate can fail

### Scope, and what is deliberately held back

This row has two halves. **You are building the half that is not contingent on anything.**

The coming-soon surface change (which surfaces, and whether it means disabled, labelled or both)
is an OPERATOR RULING that has not been made. **Do not implement it, do not label anything
coming-soon, do not remove anything from the purchase surface in this lane.** A second dispatch
follows once the ruling lands.

**What you are doing is unconditional and the row says so: fix the error envelope, and test the
tier gate in the failing direction.** Neither depends on the ruling. Both are open today.

### The finding you are acting on

P-223 was opened 2026-09-15 as SEV-1 and then measured the same day. The measurement refuted most
of it and the severity dropped. **Two things survived, and they are yours.**

**(1) A bad `artifactId` returns a raw unhandled Postgres error.** Instead of the documented
`refused` / `artifact_not_found` envelope, the caller receives the query text verbatim, disclosing
`records_request_artifacts` table and column names. Exposure is bounded and you should not overstate
it: unauthenticated `POST https://mcp.smartsite.cloud/mcp` returns 401, so this is an
authenticated-caller disclosure, not a public one. It is still a defect, and it is still a schema
leak to anyone with a key.

**(2) The tier gate is UNTESTED in the failing direction.** The measurement could not supply a
genuinely sub-Studio account, so nobody has ever seen the gate refuse. **A gate observed only
allowing has not been observed working.** That is ENFORCEMENT's verify-by-violation rule, and this
is a live instance of it: the control may be correct, may be dormant, and nothing currently
distinguishes those two.

### Repo

`legacy-design-tools`, `artifacts/smartsite-mcp` plus the records serve layer. **Not
hauska-mcp-server** — the Smart Site MCP server lives in LDT, per the seat register and P-87. Trace
the live call before you edit, because a dispatch in this program has named the wrong repo twice in
two days and both were caught only by tracing.

The three tools in scope are `request_records`, `list_purchased_records` and
`read_purchased_record`.

### Done looks like

A bad `artifactId` returns the documented refusal envelope with a reason, and no database schema
text reaches the caller on any path. The tier gate is demonstrated refusing a sub-Studio caller, by
a test that fails if the gate is removed.

### Falsifiers, pre-register your answers before you run anything

1. **Prove the gate by violation.** Construct the sub-Studio case the earlier measurement could not
   and show the refusal. If a real account cannot be created, build the test at the level where the
   entitlement is resolved and assert the refusal there, then say plainly that the live account path
   remains unexercised. **Do not report the gate as working on the strength of it allowing a Studio
   caller.** That is the exact shape this program keeps finding dormant.
2. **Delete the gate and confirm the test goes red.** A test that passes with the control removed is
   testing nothing.
3. **Enumerate every path that can produce a raw driver error**, not just the one `artifactId` case
   that was reported. A fix that catches one call site and leaves three is the defect class
   ENFORCEMENT names: before scoring a default or a check as remediable, enumerate its call sites.
4. **Confirm no schema text survives anywhere in the refusal**, including in a nested `cause`, a
   log line the caller can read back, or a stack. Grep the served payload for the table name.
5. If you find the tier gate genuinely does fire and the earlier row was pessimistic, the row still
   closes, with the evidence. An honest refutation is a result.

### Known traps

- **Do not weaken the refusal to make it uniform.** Declining with a reason is correct behaviour;
  the defect is the shape of the message, not the refusal.
- **`artifactId` values that do not parse and ones that parse but do not exist are different
  states** and should not collapse to one message if the caller is entitled to know the difference.
  Decide deliberately and say which you chose.
- LDT's root `tsc --build` is VACUOUS (`files: []`). Use `pnpm run typecheck`.
- esbuild conditions in this repo stay `["workspace"]`. Broadening them boot-crashes pg ESM.
- api-server tests are not fully green locally. Baseline-compare against main before treating a
  failure as yours; CI is authoritative.
- **This repo does NOT auto-deploy.** Push runs build-and-push only; the workflow is NAMED "Cloud
  Run Deploy" and reports success while all four deploy jobs show skipped. Merged is not shipped.

### Do not

- Do not implement coming-soon, in any form, on any surface. That ruling is not made.
- Do not change tier boundaries or entitlement policy. You are proving the existing gate, not
  redesigning it.
- Do not deploy or merge. Open the PR green and hand it back.
- Do not spread into the purchased-records product flow beyond the two defects named here.
- Do not spawn sub-agents that themselves spawn sub-agents. You own your fan.

### Close

Paste the verbatim before-and-after of the bad-`artifactId` response. State how you proved the tier
gate refuses, and what you deleted to prove the test can fail. Name every call site you enumerated
and which ones could emit a raw driver error. If the live sub-Studio account path remains
unexercised, say so in those words. Declare `leave_behind` explicitly. State your snapshot (repo,
branch, commit).
