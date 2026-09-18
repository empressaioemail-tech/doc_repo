## Mission - G-158: write down who opened a record, the access-log write path the audit trail cannot exist without

You launch no sub-agents (FAN-DEPTH 0). You WRITE in `smartcity-dashboards`. You write nothing in
`doc_repo` (hand any doc edit back as a diff, uncommitted), nothing in `smartcity-os`, and nothing in
`hauska-mcp-server`.

### DO NOT START THE WORK UNTIL THE DASHBOARDS SLOT IS FREE

**This lane writes `smartcity-dashboards`, and that repo tolerates one lane at a time**: every lens
renders into `web/app.js` and `web/index.html`, and `g153-vendor-mapping` holds that slot as of
2026-09-18T22:30Z. **Claim your lane and confirm the slot before you write any code.** If
`g153-vendor-mapping` is still live, wait for it or report back that you are queued; do not start a
second writer into the same files. This is the one collision the dispatch planner could not resolve by
sequencing, because the queue was decided after this dispatch was compiled, so it is stated here
instead.

### Why this row exists

`_design/smartcity-people-and-access/` drew the audit trail, and the row's own words for why: it is "the
trust surface, not an admin screen", and it is "the half most likely to be dropped as internal". The
design then went looking for something to draw it from and found nothing. **A reference read at
`smartcity-dashboards` `3d3ec62a` across all 45 source files found no write path that records a staff
read anywhere.** So the design deliberately renders "Who looked" as NOT RECORDED, because an empty table
would read as "nobody looked", which is a different and false answer.

**You build the thing that lets it answer.** At the moment of every read by a signed-in staff identity,
write one record naming who (the staff `sub`), which record, which lens, and when, scoped to the tenant
so one city's reads never show on another's.

### Read this before you decide you are blocked, because two things in the card will look like blockers and are not

**1. The card names `G-134` for "a staff identity to attribute a read to". `G-134` is CLOSED-PARTIAL.**
Its only outstanding item is a real-WorkOS violation test (P13, UNVERIFIED-LIVE) that waits on the
operator's WorkOS credentials. **That does not block this row.** `G-134`'s wiring is built and merged
(PR #65, `f776b4bf`) and it measured two live-local end-to-end sign-in tests passing, so the staff
identity resolution you need is already there. Your acceptance is stated against a **named fixture staff
identity**, not a real person. Build and verify against the fixture path. Do not wait on credentials, do
not register a WorkOS account, and do not provision a real Bastrop user. If you find the identity
plumbing genuinely absent, say so with the read that shows it rather than guessing.

**2. Clause 3 of the acceptance spans repos and is HELD, not yours to build.** The card reads "reads
through the MCP surface are logged the same way", but `_catalog/repo_intents.md` is explicit: this
product's "MCP tools on hauska-mcp-server PR 70", and the repo row for `smartcity-dashboards` carries
"Not `smartcity-os`". The MCP surface for these lenses is therefore a different repo and a different
card. This is the identical shape to `G-134`'s GAP 2, recorded there as "NOT this row, OPS-19/OPS-23
territory, report only", and it is resolved the same way here. **REPORT, do not build:** name the MCP
surface you found, the repo it lives in, and where the log write would have to land, and file that in
your close so the planner can card it. Held clause, declared in the row by amendment, not silently
dropped.

### Acceptance, verbatim from the row

> A read by a named fixture staff identity writes exactly one record carrying who, which record, which
> lens and when, and a second identity's read writes a second; a forced log-write failure REFUSES the
> read rather than serving it, verified by violation; reads through the MCP surface are logged the same
> way; a tenant's reads never appear under another tenant; and `dump-source-state.mjs` then reports an
> access-log write path, which makes the current "Who looked" board refuse to render until it is redrawn
> against the real trail.

Read clause 2 as the load-bearing one. **The record is not the point; the refusal is.** A trail with
invisible holes is worse than no trail, because it reads as complete. If a read is served while its log
write silently failed, you have built a surface that will testify falsely, which is the exact defect
class this row exists to remove.

### Prove it by violation, in both directions, before you call it done

- **Pre-fix, show the absence:** drive a staff read on the unmodified code and show that no record is
  written, and that the "Who looked" surface correspondingly reports it cannot answer. That is the
  falsifier for the whole row and it must fail before your change.
- **Post-fix, show it can refuse:** force the log write to fail (a bad DSN, a closed pool, whatever the
  real failure is) and confirm the read is REFUSED rather than served. **A read that falls back to
  serving on log failure is the defect wearing the new code**, and this is the one plant that must be
  caught.
- **Post-fix, show tenant scoping by violation:** read as tenant A, then confirm the record does not
  appear for tenant B. A scoping claim tested only by reading its own tenant has not been tested.
- **Then confirm the design behaves as designed:** `dump-source-state.mjs` reports an access-log write
  path, and the current "Who looked" board consequently refuses to render.

### What you must not do

- **Do not redraw `_design/smartcity-people-and-access/` or "Who looked".** The board refusing to render
  once your write path exists is the mechanism working exactly as designed, not a regression to repair.
  Redrawing it against the real trail is a follow-on, and it belongs to whoever owns the design gate
  after you land. **Leave it failing and say so in your close**, so it is carded rather than quietly
  absorbed. A design-only repair here would also be fixing the prose to match a write path that has not
  been independently verified, which is the mistake `G-164` deliberately avoided on the flood study.
- **Do not build the MCP leg.** See above. Report where it goes.
- **Do not retire the shared persona, and do not touch the WorkOS wiring.** `G-134`'s sequencing rule is
  not negotiable: wire, provision and verify a real account, and only then retire the shared persona.
  Removing it before a real credential exists takes live Bastrop staff access to zero. That is a customer
  outage, and it is not this row.
- **Do not loosen the failure path to make a test pass.** Widening so a failed log write still serves is
  the defect, not the fix.

### Evidence your close must carry

- The pre-fix read showing no record written, with the file and line you searched and the moment you read
  it (a claim about absence needs a timestamp and a search, or it is not a ground-truth).
- The post-fix: two fixture identities, two records, all four fields, plus the tenant-scoping violation.
- **The forced-failure refusal, pasted.** This is the clause that decides whether the row is met.
- The MCP surface you found, the repo it lives in, and where the log write would have to land, so the
  held clause can be carded with a real target rather than a description.
- Confirmation, with output, that the "Who looked" board now refuses to render, and that you left it that
  way on purpose.
- Your test suite's baseline and after counts, with any pre-existing failures named as inherited rather
  than as regressions you caused.
- Your snapshot (repo, ref, moment read) and the exact commit your checks ran against per
  `ENFORCEMENT.md`.
- Your scratch block (LESSON / DEAD-END / GROUND-TRUTH with a timestamp / OPEN), returned in the close.
