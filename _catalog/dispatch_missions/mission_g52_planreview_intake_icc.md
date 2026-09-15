# MISSION — plan-review intake + ICC linkage recon (READ-ONLY)

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

READ-ONLY. Do NOT write, edit, commit, push, or modify ANY file in ANY product repository.
Do not run npm/pnpm install or any build. Do not check out, pull, reset, or alter repo state.
Your ONLY write is your report file named at the end of this mission.

## CRITICAL: the working tree is stale

Primary repo: `/p/plan-review` (GitHub empressaioemail-tech/plan-review).
The local working tree is **16 commits BEHIND** origin/main. Reading it gives WRONG answers.

Read the authoritative ref, each command bounded by `timeout 120`:
  timeout 120 git -C /p/plan-review log origin/main --oneline | head -60
  timeout 120 git -C /p/plan-review grep -n <pattern> origin/main
  timeout 120 git -C /p/plan-review show origin/main:<path>

origin/main is at `1af5ac5` (2026-09-02). Declare repo, ref and commit SHA in your first output line.

Secondary repos you may also read under the same rules: `/p/icc-demo`, `/p/icc-portal`.
Check each against its remote before trusting the working tree (`timeout 120 git -C <repo> fetch origin`
is allowed since it does not alter the working tree; nothing else that writes).

## Context

`plan-review` is a net-new product: AI-assisted building plan review producing a Pass/Fail/Unchecked
determination on a submittal, checked against code sections with structured citations. Multi-tenant
by persona. A real Bastrop persona `bastrop_tx` went live 2026-09-02 with cross-tenant read AND write
refusal verified both directions.

Two canon claims you must VERIFY against source rather than repeat back:
- Only TWO sections of the Bastrop UDC are real: `14-02-003` and `14-02-008`, in edition
  `bastrop_tx-bdc-2026-adopted` / book `BASTROP-UDC`.
- ICC content (IBC 2018, ~4,825 atoms) is licensed under a signed ICC contract and is reachable.
  A defect was fixed 2026-09-02 in `/api/plan-review/code` where payload extraction used `atom.data`
  instead of `atom.data.atom`.

Two things being planned depend on this report:
(a) Getting a Bastrop permit from their vendor system (MyGov) INTO plan review for a test review,
    WITHOUT disturbing their existing workflow.
(b) Verifying plan review is "linking appropriately with the ICC demo".

## Establish, with evidence

1. INTAKE. How does a submittal enter plan review today? Trace the full path end to end. File upload?
   API? What creates an engagement/project/case? Required fields? Name files, routes, functions; quote code.
2. MINIMUM VIABLE INPUT. Does a determination REQUIRE an uploaded document (drawings/PDF), or can it run
   on metadata alone? Answer explicitly either way. This decides whether a permit record with no
   attachments is useful at all.
3. DETERMINATION PIPELINE. How does a submittal become a Pass/Fail/Unchecked matrix? `matrixFromChain`,
   `buildCitation` and `code-lookup.mjs` have been referenced. Explain the real flow and where code
   sections get resolved.
4. EDITION AND CODE-BOOK WIRING. How are `AVAILABLE_EDITIONS` and `CODE_BOOKS` defined? Verify the
   two-real-sections claim. Verify which IBC/IPMC books are wired and whether each has a live query path
   to real content. Quote the actual definitions.
5. ICC LINKAGE, IN DETAIL — this is a priority. How does plan review reach ICC content? MCP server,
   REST route, direct DB read? Is there an entitlement or license gate, and what happens on an
   unentitled request? Read `/p/icc-demo` and `/p/icc-portal` for the other side. NOTE a commit
   `fix(g60): remove plan-review /icc middleware` suggests the linkage changed shape at least once.
   Establish the CURRENT shape, not the historical one.
6. TENANCY AND PERSONAS. How are personas defined (`src/actors.mjs` has been referenced)? How is
   `bastrop_tx` registered? How is cross-tenant access refused, and is refusal on BOTH read and write?
   Quote the enforcement code.
7. COVERAGE HONESTY. When a code section is unavailable, what is returned? Verify it is TYPED ABSENCE
   rather than a silent gap or a fabricated pass. Quote the code that does this. Honest refusal is a
   requirement here, not a nice-to-have.
8. EXTENSION POINTS. Given intake as it exists, what would it take to accept a permit record (number,
   address, type, applicant, possibly attached documents) pulled from an external vendor system and
   start a review from it? Name the specific functions and routes that would change, and flag whatever
   makes this hard.

## Method requirements

- ENUMERATE BEFORE ASSERTING ABSENCE. Say what you searched.
- State the mechanism explaining an observation, THEN a second mechanism that would produce the same
  observation and why you rejected it.
- Quote real code with real paths and line numbers from the origin/main ref.
- Verify the two canon claims against source. If canon is WRONG, say so plainly with evidence.
- Never print secret VALUES. Env var names only.
- Every verification command must be exit-bounded (`timeout 120 ...`). Never run a command that waits
  for input or does not terminate.

## Close

Write your report to `_inbox/2026-09-14_g52_planreview_intake_icc.md`.
Lead with a short executive summary: how a submittal gets in, what the minimum input is, whether ICC
linkage currently works, and what it would take to feed in an external permit. Then the numbered
sections. End with "What I could not determine and why".
